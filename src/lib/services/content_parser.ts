import { fetch } from '@tauri-apps/plugin-http';
import { invoke } from '@tauri-apps/api/core';
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { parseHTML } from 'linkedom';
import { get } from 'svelte/store';
import { runWithTimeout } from '$lib/utils/time';
import {
    CONTENT_TYPES,
    CONTENT_CACHE_TTL_DAYS,
    CONTENT_CACHE_MAX_MB,
} from '$lib/constants';
import type { ContentResult } from '$lib/types';
import {
    add_post_cache,
    delete_post_cache,
    fetch_post_cache,
    purge_article_cache,
} from '$lib/dao/post_db';
import { local_user_setting } from '$lib/stores/app_store';

interface PostlightResult {
    title: string | null;
    content: string | null;
    word_count: number | null;
    lead_image_url: string | null;
}

// Crate fetch timeout is 10s/page; 20s covers slow sites plus extraction.
const POSTLIGHT_PARSE_TIMEOUT_MS = 20_000;

// Reuse an in-flight parse per URL so re-clicking a post doesn't re-invoke Rust.
const inFlightParses = new Map<string, Promise<PostlightResult>>();

// Session-level fast path. The persistent cache is in SQLite; this avoids an
// IPC round trip when navigating back to an article in the same session.
const MEMORY_CACHE_MAX_ENTRIES = 12;
const CACHE_PURGE_INTERVAL_MS = 24 * 60 * 60 * 1000;
const memoryContentCache = new Map<number, ContentResult>();
const inFlightContent = new Map<number, Promise<ContentResult>>();
let last_cache_purge = 0;
let cache_purge_in_flight: Promise<void> | null = null;

const runPostlightParser = (url: string): Promise<PostlightResult> => {
    let parse = inFlightParses.get(url);
    if (!parse) {
        parse = invoke('postlight_parse', { url });
        inFlightParses.set(url, parse);
        parse
            .catch(() => {})
            .finally(() => inFlightParses.delete(url));
    }
    return parse;
}

export const mercury_parser = async (url: string): Promise<ContentResult> => {
    if (url) {
        try {
            const document = await runWithTimeout(runPostlightParser(url), POSTLIGHT_PARSE_TIMEOUT_MS);
            return {
                title: document.title ?? '',
                content: document.content ?? '',
                word_count: document.word_count ?? 0,
                url: url,
                image: document.lead_image_url ?? '',
                content_type: CONTENT_TYPES.html,
            };
        } catch (error) {
            throw new Error('Something happened :(');
        }
    }
    return {
        title: '',
        content: '',
        word_count: 0,
        url: url,
        image: '',
        content_type: CONTENT_TYPES.none,
    };
}

export const morzilla_readability_parser = async (url: string, document: Document): Promise<ContentResult> => {
    let reader = new Readability(document);

    try {
        const article = reader.parse();
        if (article)
            return {
                title: article.excerpt,
                content: article.content,
                word_count: article.length,
                url: url,
                image: "",
                content_type: CONTENT_TYPES.html,
            };
    } catch (error) {
        throw error;
    }

    throw Error("Unable to parse webpage :(");
}

export const hybrid_parser = async (url: string): Promise<ContentResult> => {
    if (!url) {
        return {
            title: '',
            content: '',
            word_count: 0,
            url: url,
            image: '',
            content_type: CONTENT_TYPES.none,
        };
    }
    try {
        const web_response = await fetch(url);

        if (web_response?.headers.get('Content-Type') == 'application/pdf') {
            return {
                title: `PDF (${url.split('/').pop()})`,
                content: await web_response.arrayBuffer(),
                word_count: 0,
                url: url,
                image: "",
                content_type: CONTENT_TYPES.pdf,
            };
        }

        const html: string = await web_response.text();;

        // Based on test
        // https://github.com/WebReflection/linkedom/blob/63c22fb48cea1179b7fdc9bcffe84d824c3bca04/test/html/document.js#L75
        const location = { href: url };
        const { document } = parseHTML(html, { location });

        if (isProbablyReaderable(document, {
            minScore: 80
        })) {
            return morzilla_readability_parser(url, document);
        } else {
            throw new Error("Not enough content with Readability");
        }
    } catch (error) {
        return mercury_parser(url);
    }
}


const isCacheable = (
    result: ContentResult,
): result is ContentResult & { content: string } =>
    result.content_type === CONTENT_TYPES.html &&
    typeof result.content === 'string' &&
    result.content.length > 0;

const rememberContent = (post_id: number, result: ContentResult) => {
    // Re-insert on every hit so the Map's insertion order stays LRU.
    memoryContentCache.delete(post_id);
    memoryContentCache.set(post_id, result);
    while (memoryContentCache.size > MEMORY_CACHE_MAX_ENTRIES) {
        const oldest = memoryContentCache.keys().next();
        if (oldest.done) break;
        memoryContentCache.delete(oldest.value);
    }
}

export const clear_content_memory_cache = () => {
    memoryContentCache.clear();
}

const scheduleCachePurge = () => {
    if (cache_purge_in_flight) {
        return;
    }
    if (Date.now() - last_cache_purge < CACHE_PURGE_INTERVAL_MS) {
        return;
    }

    last_cache_purge = Date.now();
    const settings = get(local_user_setting);
    cache_purge_in_flight = purge_article_cache(
        settings.CONTENT_CACHE_TTL_DAYS ?? CONTENT_CACHE_TTL_DAYS,
        settings.CONTENT_CACHE_MAX_MB ?? CONTENT_CACHE_MAX_MB,
    ).finally(() => {
        cache_purge_in_flight = null;
    });
}

export const cached_parser = async (
    post_id: number,
    url: string,
): Promise<ContentResult> => {
    const settings = get(local_user_setting);
    if (!settings.ENABLE_CONTENT_CACHE) {
        return hybrid_parser(url);
    }

    const memory_result = memoryContentCache.get(post_id);
    if (memory_result && memory_result.url === url) {
        const cached_result = { ...memory_result, from_cache: true };
        rememberContent(post_id, cached_result);
        return cached_result;
    }
    if (memory_result) {
        memoryContentCache.delete(post_id);
    }

    const pending = inFlightContent.get(post_id);
    if (pending) {
        return pending;
    }

    const parse = (async (): Promise<ContentResult> => {
        try {
            const cached = await fetch_post_cache(
                post_id,
                settings.CONTENT_CACHE_TTL_DAYS ?? CONTENT_CACHE_TTL_DAYS,
            );
            if (cached && cached.url === url && isCacheable(cached)) {
                const cached_result = { ...cached, from_cache: true };
                rememberContent(post_id, cached_result);
                return cached_result;
            }
            if (cached) {
                // A changed article link makes the cached body stale.
                await delete_post_cache(post_id);
            }
        } catch (e) {
            // Cache failures must never block the live parse path.
            console.log(`|| Content cache read failed (${post_id}): ${e} ||`);
        }

        const result = await hybrid_parser(url);
        if (isCacheable(result)) {
            rememberContent(post_id, result);
            // Do not block rendering on the SQLite write.
            void add_post_cache(post_id, result).then(scheduleCachePurge);
        }
        return result;
    })();

    inFlightContent.set(post_id, parse);
    parse.then(
        () => {
            if (inFlightContent.get(post_id) === parse) {
                inFlightContent.delete(post_id);
            }
        },
        () => {
            if (inFlightContent.get(post_id) === parse) {
                inFlightContent.delete(post_id);
            }
        },
    );

    return parse;
}

