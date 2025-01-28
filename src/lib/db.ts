import Database from '@tauri-apps/plugin-sql';
import { DB_PATH, DB_ORDER_ENUM } from '$lib/constants';
import { convertToTimeStringForDB, escape_title } from "$lib/utils";


const db = await Database.load(DB_PATH);

export const fetch_feed = async () => {
    const result = await db.select(
        "SELECT * from feeds"
    );
    console.log("DB: FETCH FEED")
    return result;
}

export const add_feed = async (title: String, url: String, favicon: String) => {
    const response = await db.execute(
        "INSERT into feeds (title, url, favicon) VALUES ($1, $2, $3)",
        [title, url, favicon],
    );
    console.log("DB: ADD FEED")
    return response.lastInsertId;
}

export const add_posts = async (posts: { title: string, link: string, pubDate: string, feed_id: Number }[]) => {
    // Track individual posts to insert into DB
    let value_string = ""

    // Create a Set to track feeds that were updated
    const feedsSet = new Set();


    for (const [i, post] of posts.entries()) {
        const date = convertToTimeStringForDB(post.pubDate);

        value_string += `(${post.feed_id}, '${escape_title(post.title)}', '${post.link}', '${date}')`;

        if (i != posts.length - 1) {
            value_string += ",\n"
        }
        feedsSet.add(post.feed_id);
    }

    await db.execute(
        `INSERT OR IGNORE INTO articles (feed_id, title, link, pub_date) VALUES ${value_string}`
    );

    // Update Last Refresh Time (LRT)
    if (feedsSet.size > 0) {
        const value_string_feeds = Array.from(feedsSet).join(", ");
        const currentTime = new Date().toISOString();
        await db.execute(
            `UPDATE feeds SET last_refresh_time = "${currentTime}" WHERE id in (${value_string_feeds})`
        );
    }

    console.log("DB: ADD POSTS");
    console.log("DB: REFRESH FEED LRT");
}


export const fetch_posts = async (
    sort_by: DB_ORDER_ENUM = DB_ORDER_ENUM.NEWEST,
    last_id: number | null = null,
    feed_id: number = -1,
    existing_store_size: number = 0, // Refers to size of posts_store
    limit: number = 20,
) => {
    let whereCondition = "WHERE 1=1 ";
    if (last_id != null) {
        if (sort_by == DB_ORDER_ENUM.NEWEST) {
            whereCondition += `AND id < ${last_id} `
        } else {
            whereCondition += `AND id > ${last_id} `
        }
    }

    if (feed_id != -1) {
        whereCondition += `AND feed_id=${feed_id} `
    }

    const query = `
        SELECT id, feed_id, title, link, pub_date as pubDate, read from articles
        ${whereCondition}
        ORDER BY datetime(pub_date) ${sort_by}
        LIMIT ${limit}
    `

    console.log("SQL:", query);

    const result = await db.select(query);
    let results = [];

    for (let i = 0; i < result.length; i++) {
        results.push({
            ...result[i],
            rowid: existing_store_size + i
        })
    }
    console.log("DB FETCH POSTS:", results.length);

    return results;
}

export const read_post = async (id: number) => {
    await db.execute(
        `UPDATE articles SET read = 1 WHERE id = ${id} and read = 0`
    );
}

export const fetch_unread_post_counts = async () => {
    const results = await db.select(
        `SELECT feed_id as id, count(*) as count from articles where read=0 group by feed_id`
    );

    let id2count = {};
    for (var post of results) {
        id2count[post.id] = post.count;
    }

    console.log(id2count)

    return id2count;
}