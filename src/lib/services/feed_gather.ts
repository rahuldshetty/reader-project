import type { Post, FeedMetadata, FeedMetadataFolder } from "$lib/types";
import { FEED_TYPE, FEED_URL_CONTENT_TYPE } from "$lib/constants";
import { fetch } from '@tauri-apps/plugin-http';

export const fetchFeedName = (rssText: string) => {
    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, "application/xml");
    var channelTitle;
    if (rssDoc.querySelector("channel > title")) {
        channelTitle = rssDoc.querySelector("channel > title");
    } else if (rssDoc.querySelector("feed > title")) {
        channelTitle = rssDoc.querySelector("feed > title");
    } else {
        return ""
    }
    if (channelTitle && channelTitle.textContent) {
        return channelTitle.textContent.trim();
    }
    return ""
}

export const fetchFeedIcon = async (rssUrl: string) :Promise<string> => {
    // A missing favicon must never abort importing the feed itself.
    try {
        // Fetch the HTML page of the RSS feed's origin
        const baseUrl = new URL(rssUrl).origin;

        const signal =
            "timeout" in AbortSignal
                ? AbortSignal.timeout(3000)
                : undefined;
        const response = await fetch(baseUrl, { signal });
        if (!response.ok) {
            return '';
        }

        const htmlText = await response.text();

        //  Parse the HTML to find favicon links
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        const faviconLink = Array.from(
                doc.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="icon"]')
            )
            .map(link => ({
                href: link.getAttribute("href"),
                sizes: link.getAttribute("sizes") || "",
            }))
            .sort((a, b) => {
                // Sort by size if possible (e.g., "32x32", "180x180")
                const aSize = parseInt(a.sizes.split("x")[0]) || 0;
                const bSize = parseInt(b.sizes.split("x")[0]) || 0;
                return bSize - aSize;
            })[0]; // Pick the largest

        if (faviconLink && faviconLink.href) {
            const faviconUrl = new URL(faviconLink.href, baseUrl).href; // Resolve relative URLs
            return faviconUrl;
        }
    } catch (error) {
        console.warn(`Unable to fetch feed icon for ${rssUrl}`, error);
    }

    return '';
}

export const fetchPosts = async (rssText: string) :Promise<Post[]> => {
    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, "application/xml");

    // Determine the type of feed (RSS or Atom)
    const isRSS = !!rssDoc.querySelector("channel > item");
    const isAtom = !!rssDoc.querySelector("feed > entry");

    if (isRSS) {
        const items = rssDoc.querySelectorAll("channel > item");
        console.log("Fetching RSS Contents");
        const posts = await Promise.all(Array.from(items).map(async (item)=>{
            const link = item.querySelector("link")?.textContent?.trim() || "";

            // Extract Image from enclosure or media:content
            const image = item.querySelector("media\\:thumbnail, thumbnail")?.getAttribute("url") ||
                          item.querySelector("enclosure[type^='image']")?.getAttribute("url") ||
                          item.querySelector("media\\:content, content")?.getAttribute("url") ||
                          "";

            return {
                title: item.querySelector("title")?.textContent?.trim() || "",
                link: link,
                description: item.querySelector("description")?.textContent?.trim() || "",
                pubDate: item.querySelector("pubDate")?.textContent?.trim() || "",
                image: image,
            } as Post;
        }));
        console.log(`Fetched ${posts.length} posts.`);
        return posts;
    } else if (isAtom) {
        console.log("Fetching Atom Contents");
        const entries = rssDoc.querySelectorAll("feed > entry");
        const posts = await Promise.all(Array.from(entries).map(async (entry)=>{
            const link = entry.querySelector("link")?.getAttribute("href") || "";

            // Extract Image from Atom feed (enclosure or media:content)
            const image =  entry.querySelector("media\\:thumbnail, thumbnail")?.getAttribute("url") ||
                            entry.querySelector("link[rel='enclosure'][type^='image']")?.getAttribute("href") ||
                            entry.querySelector("media\\:content, content")?.getAttribute("url") ||
                            "";

            return {
                title: entry.querySelector("title")?.textContent?.trim() || "",
                link: link,
                description: entry.querySelector("summary")?.textContent?.trim() || "",
                pubDate: entry.querySelector("updated")?.textContent?.trim() || "",
                image: image,
            } as Post;
        }));
        console.log(`Fetched ${posts.length} posts.`);
        return posts;
    }

    return [];
}

export const fetchFeedDataFromFeedURL = async (
    id: number,
    url: string,
    rssText?: string,
    load_icon: boolean = true,
) : Promise<FeedMetadata> => {
    // Returns feed metadata from XML URL. Callers that already have the body
    // pass `rssText` so the feed is not downloaded twice.
    let xmlText = rssText;
    if (xmlText === undefined) {
        const signal =
            "timeout" in AbortSignal
                ? AbortSignal.timeout(20000)
                : undefined;
        const response = await fetch(url, { signal });

        if(response == null || !response.ok){
            throw new Error(`Failed to fetch feed (${response?.status ?? "network error"}): ${url}`);
        }

        xmlText = await response.text();
    }

    return {
        id: id,
        name: fetchFeedName(xmlText),
        icon: load_icon ? await fetchFeedIcon(url) : '',
        posts: await fetchPosts(xmlText),
        url: url,
        type: FEED_TYPE.FEED
    }
}

const detectURLContentType = async (
    url: string,
) : Promise<{ content_type: FEED_URL_CONTENT_TYPE; text: string }> => {
    // Detect whether URL points to XML feed or a website
    const signal =
        "timeout" in AbortSignal ? AbortSignal.timeout(20000) : undefined;
    const response = await fetch(url, { signal });
    if (response == null || !response.ok) {
        throw new Error(`Failed to fetch URL (${response?.status ?? "network error"}): ${url}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    const trimmed = text.trim().toLowerCase();

    const isXMLlike =
        contentType.includes('xml') ||
        trimmed.startsWith('<?xml') ||
        trimmed.startsWith('<rss') ||
        trimmed.startsWith('<feed') ||
        trimmed.startsWith('<rdf:rdf');

    return {
        content_type: isXMLlike
            ? FEED_URL_CONTENT_TYPE.XML
            : FEED_URL_CONTENT_TYPE.WEBSITE,
        text,
    };
}

export const fetchFeedDataFromURL = async (url: string): Promise<(FeedMetadata | FeedMetadataFolder)[]> => {
    // Returns list of feeds identified from URL 

    // Check type of URL. Keep the body so direct feeds only fetch once.
    const { content_type, text } = await detectURLContentType(url);

    if(content_type == FEED_URL_CONTENT_TYPE.XML){
        // Scenario 1: User provides direct URL to feed
        const feedMetadata = await fetchFeedDataFromFeedURL(0, url, text);
        return [ feedMetadata ];
    } else if(content_type == FEED_URL_CONTENT_TYPE.WEBSITE){
        // Scenario 2: User provides URL to website that may contain links to RSS feeds
        return [];
    }
    // TODO: Scenario 3 - OPML URL link
    return [];
}


export const flattenFeedData = (feeds_import_data: (FeedMetadata | FeedMetadataFolder)[]) => {
    const flat_feeds_import_data = [];
    for(const feed of feeds_import_data){
        if('children' in feed){
            for(const child of feed.children){
                flat_feeds_import_data.push(child);
            }
            flat_feeds_import_data.push({
                ...feed,
                children: []
            });
        } else {
            flat_feeds_import_data.push(feed);
        }
    }
    return flat_feeds_import_data;
}
