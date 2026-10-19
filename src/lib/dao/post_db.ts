import type { PostResult, FeedMetadata, ContentResult } from '$lib/types';
import Database from '@tauri-apps/plugin-sql';
import {
    DB_PATH,
    DB_ORDER_ENUM,
    NO_OF_POST_PULLS_PER_TIME,
    ROOT_PARENT_FEED_ID,
    CONTENT_TYPES,
    CONTENT_CACHE_TTL_DAYS,
    CONTENT_CACHE_MAX_MB,
} from '$lib/constants';
import { convertToTimeStringForDB } from '$lib/utils/time';

const db = await Database.load(DB_PATH);


export const fetch_posts = async (
    sort_by: DB_ORDER_ENUM = DB_ORDER_ENUM.NEWEST,
    last_id: number | null = null,
    feed_id: number = ROOT_PARENT_FEED_ID,
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    unread: boolean = false,
    lastPubDate: string = "",
    is_fav: boolean | null = null, // Set this to filter specific posts
    search_keywords: string[] = [],
    feed_ids: number[] = [],
    since: string = "",
): Promise<PostResult[]> => {
    let whereCondition = "WHERE 1=1 ";
    if (last_id != null) {
        if (sort_by == DB_ORDER_ENUM.NEWEST) {
            whereCondition += `AND id < ${last_id} `
        } else {
            whereCondition += `AND id > ${last_id} `
        }
    }

    if (lastPubDate != "") {
        if (sort_by == DB_ORDER_ENUM.NEWEST) {
            whereCondition += `AND datetime(pub_date) < datetime("${lastPubDate}") `
        } else {
            whereCondition += `AND datetime(pub_date) > datetime("${lastPubDate}") `
        }
    }

    if (since != "") {
        whereCondition += `AND datetime(pub_date) >= datetime("${since}") `
    }
    // Negative Feed ids reserved for All Posts, Favs
    if (feed_ids.length > 0) {
        // Folder aggregation: posts from any child feed.
        whereCondition += `AND feed_id IN (${feed_ids.join(',')}) `
    } else if (feed_id >= 0) {
        whereCondition += `AND feed_id=${feed_id} `
    } else if (feed_id == -2) {
        is_fav = true;
    }

    if (unread) {
        whereCondition += `AND read=0 `
    }

    if (is_fav != null) {
        if (is_fav)
            whereCondition += `AND is_fav=1 `
        else
            whereCondition += `AND is_fav=0 `
    }

    if (search_keywords.length > 0) {
        let searchTerms = '('
        for (let i = 0; i < search_keywords.length; i++) {
            const key = search_keywords[i];
            searchTerms += ` title like '%${key}%' `

            if (i != search_keywords.length - 1) {
                // if not the last term
                searchTerms += ' AND '
            }
        }
        whereCondition += ' AND ' + searchTerms + ') ';
    }

    const query = `
        SELECT 
            id, 
            feed_id, 
            title, 
            link, 
            pub_date as pubDate, 
            read, 
            is_fav, 
            image_url as image, 
            content, 
            word_count 
        from articles
        ${whereCondition}
        ORDER BY datetime(pub_date) ${sort_by}
        LIMIT ${limit}
    `

    console.log(`|| SQL: ${query} ||`);

    const result = (await db.select(query)) as PostResult[];

    console.log("DB FETCH POSTS:" + result.length);

    return result;
}

export const fetch_posts_by_date = async (date: string): Promise<PostResult[]> => {
    const query = `
        SELECT 
            id, 
            feed_id, 
            title, 
            link, 
            pub_date as pubDate, 
            read, 
            is_fav, 
            image_url as image, 
            content, 
            word_count 
        from articles
        where pub_date like '${date}%'
    `

    const result = (await db.select(query)) as PostResult[];
    console.log(`|| Fetch Posts By date (${result.length}) ||`)

    return result;
}

export const fetch_post_data = async (id: number): Promise<PostResult> => {
    const query = `
        SELECT 
            id, 
            feed_id, 
            title, 
            link, 
            pub_date as pubDate, 
            read, 
            is_fav, 
            image_url as image, 
            content, 
            word_count 
        from articles
        where id = $1
    `

    const result = (await db.select(query, [id])) as PostResult[];

    if (result.length == 0) {
        throw Error(`No Article found with id ${id}`);
    }

    return result[0];
}


export const mark_post_as_read = async (id: number, read_status: boolean) => {
    let status = 1;
    if (!read_status) {
        status = 0;
    }
    await db.execute(
        `UPDATE articles SET read = $1 WHERE id = $2`,
        [status, id]
    );
}


export const mark_post_as_fav = async (id: number, is_fav: boolean) => {
    let fav = 1;
    if (!is_fav) {
        fav = 0;
    }
    await db.execute(
        `UPDATE articles SET is_fav = $1 WHERE id = $2`,
        [fav, id],
    );
}


export const add_posts = async (feedMetadata: FeedMetadata) => {
    const posts = feedMetadata.posts;

    // Create a Set to track feeds that were updated
    const feedsSet = new Set();

    let inserted = 0;

    for (const [i, post] of posts.entries()) {
        try {
            const date = convertToTimeStringForDB(post.pubDate);

            await db.execute(
                `INSERT INTO articles (feed_id, title, link, pub_date, image_url)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT(link) DO UPDATE SET
                    title = excluded.title,
                    pub_date = excluded.pub_date,
                    image_url = excluded.image_url`,
                [
                    feedMetadata.id,
                    post.title,
                    post.link,
                    date,
                    post.image,
                ],
            );

            feedsSet.add(feedMetadata.id);

            inserted++;
        } catch (e) {
            console.log(`|| Failed to insert post (${post.link}): ${e} ||`);
        }
    }

    // Update Last Refresh Time (LRT)
    if (feedsSet.size > 0) {
        const value_string_feeds = Array.from(feedsSet).join(", ");
        const currentTime = new Date().toISOString();
        await db.execute(
            `UPDATE feeds SET last_refresh_time = "${currentTime}" WHERE id in (${value_string_feeds})`
        );
    }

    console.log(`|| Refreshed feed: ${feedMetadata.name} ||`);
    console.log(`|| Inserted ${inserted} posts||`);
}

export const fetch_old_post_count = async (days: number): Promise<number> => {
    const query = `
        Select count(id) as count FROM articles WHERE datetime(pub_date) <= date('now','-${days} day') AND is_fav = 0 AND 
        feed_id in (
            SELECT feed_id FROM articles group by feed_id having count(*) > 100
        )
    `
    const result = (await db.select(query)) as Record<string, number>[];
    return result[0]['count'];
}


export const delete_old_posts = async (days: number): Promise<boolean> => {
    const query = `
        DELETE FROM articles WHERE datetime(pub_date) <= date('now','-${days} day') AND is_fav = 0 AND 
        feed_id in (
            SELECT feed_id FROM articles group by feed_id having count(*) > 100
        )
    `
    const result = await db.execute(query);

    // Foreign keys may not be enabled on the SQLite connection, so remove
    // cache rows whose article no longer exists instead of relying on cascade.
    await db.execute(
        `DELETE FROM articles_cache WHERE post_id NOT IN (SELECT id FROM articles)`
    );

    console.log(`|| Deleted ${result.rowsAffected} old posts ||`);
    return result.rowsAffected != 0;
}


// Post Cache Layer

export interface ArticleCacheStats {
    count: number;
    bytes: number;
}

interface CachedPostRow {
    content: string;
    content_type: number;
    title: string | null;
    url: string;
    image: string | null;
    word_count: number;
    age_days: number | null;
}

interface CacheUsageRow {
    count: number;
    bytes: number | null;
}

const CACHE_STATS_QUERY = `
    SELECT COUNT(*) AS count, COALESCE(SUM(byte_size), 0) AS bytes
    FROM articles_cache
`

// Store the extracted HTML as TEXT. The old BLOB + JSON byte-array round trip
// was fragile through the SQL plugin; TEXT keeps the markup exactly as parsed.
export const add_post_cache = async (post_id: number, data: ContentResult) => {
    if (
        data.content_type !== CONTENT_TYPES.html ||
        typeof data.content !== "string" ||
        data.content.length === 0
    ) {
        return;
    }

    try {
        const byte_size = new TextEncoder().encode(data.content).length;
        const word_count = Number.isFinite(data.word_count)
            ? data.word_count
            : 0;

        const query = `
            INSERT INTO articles_cache (
                post_id, content, content_type, title, url, image,
                word_count, insert_date, last_access_date, byte_size
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                datetime('now'), datetime('now'), $8
            )
            ON CONFLICT(post_id) DO UPDATE SET
                content = excluded.content,
                content_type = excluded.content_type,
                title = excluded.title,
                url = excluded.url,
                image = excluded.image,
                word_count = excluded.word_count,
                insert_date = excluded.insert_date,
                last_access_date = excluded.last_access_date,
                byte_size = excluded.byte_size
        `

        await db.execute(query, [
            post_id,
            data.content,
            data.content_type,
            data.title,
            data.url,
            data.image,
            word_count,
            byte_size,
        ]);
        console.log(`|| Added post cache (${post_id}) ||`);
    } catch (e) {
        console.log(`|| Failed to add post cache (${post_id}): ${e} ||`);
    }
}

export const fetch_post_cache = async (
    post_id: number,
    ttl_days: number = CONTENT_CACHE_TTL_DAYS,
): Promise<ContentResult | null> => {
    try {
        const query = `
            SELECT
                content,
                content_type,
                title,
                url,
                image,
                word_count,
                (julianday('now') - julianday(insert_date)) AS age_days
            FROM articles_cache
            WHERE post_id = $1
        `
        const result = (await db.select(query, [post_id])) as CachedPostRow[];

        if (result.length === 0) {
            return null;
        }

        const ttl = Number.isFinite(ttl_days)
            ? ttl_days
            : CONTENT_CACHE_TTL_DAYS;
        const row = result[0];
        const expired =
            ttl <= 0 ||
            row.age_days === null ||
            row.age_days > ttl ||
            typeof row.content !== "string";

        if (expired) {
            await db.execute(
                `DELETE FROM articles_cache WHERE post_id = $1`,
                [post_id],
            );
            return null;
        }

        // Touching on every open would add a write per article view. One
        // update per day is enough for LRU ordering.
        await db.execute(
            `UPDATE articles_cache
             SET last_access_date = datetime('now')
             WHERE post_id = $1
               AND last_access_date < datetime('now', '-1 day')`,
            [post_id],
        );

        return {
            title: row.title ?? "",
            content: row.content,
            word_count: row.word_count ?? 0,
            url: row.url,
            image: row.image ?? "",
            content_type: row.content_type as CONTENT_TYPES,
        };
    } catch (e) {
        console.log(`|| Failed to fetch post cache (${post_id}): ${e} ||`);
        return null;
    }
}

export const delete_post_cache = async (post_id: number) => {
    try {
        await db.execute(`DELETE FROM articles_cache WHERE post_id = $1`, [
            post_id,
        ]);
    } catch (e) {
        console.log(`|| Failed to delete post cache (${post_id}): ${e} ||`);
    }
}

export const clear_article_cache = async (): Promise<number> => {
    const result = await db.execute(`DELETE FROM articles_cache`);
    return result.rowsAffected;
}

export const fetch_article_cache_stats = async (): Promise<ArticleCacheStats> => {
    const result = (await db.select(CACHE_STATS_QUERY)) as CacheUsageRow[];
    return {
        count: Number(result[0]?.count ?? 0),
        bytes: Number(result[0]?.bytes ?? 0),
    };
}

export const purge_article_cache = async (
    ttl_days: number = CONTENT_CACHE_TTL_DAYS,
    max_mb: number = CONTENT_CACHE_MAX_MB,
): Promise<void> => {
    const ttl = Number.isFinite(ttl_days)
        ? Math.max(0, Math.floor(ttl_days))
        : CONTENT_CACHE_TTL_DAYS;
    const max_size_mb = Number.isFinite(max_mb)
        ? Math.max(0, Math.floor(max_mb))
        : CONTENT_CACHE_MAX_MB;

    try {
        await db.execute(
            `DELETE FROM articles_cache WHERE post_id NOT IN (SELECT id FROM articles)`
        );
        await db.execute(
            `DELETE FROM articles_cache WHERE insert_date <= datetime('now', $1)`,
            [`-${ttl} days`],
        );

        if (max_size_mb === 0) {
            await db.execute(`DELETE FROM articles_cache`);
            return;
        }

        // Keep the most recently accessed rows; delete the oldest overflow.
        await db.execute(
            `WITH ordered AS (
                SELECT
                    post_id,
                    SUM(byte_size) OVER (
                        ORDER BY last_access_date DESC, post_id DESC
                    ) AS running_bytes
                FROM articles_cache
            )
            DELETE FROM articles_cache
            WHERE post_id IN (
                SELECT post_id FROM ordered WHERE running_bytes > $1
            )`,
            [max_size_mb * 1024 * 1024],
        );
    } catch (e) {
        console.log(`|| Failed to purge article cache: ${e} ||`);
    }
}


