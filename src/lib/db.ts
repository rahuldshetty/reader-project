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
        "INSERT into feeds (title, url, favicon) VALUES ($1, $2, $3) RETURNING id",
        [title, url, favicon],
    );
    console.log("DB: ADD FEED")
    return response.lastInsertId;
}

export const update_feed = async (title: string, feed_id: number) => {
    await db.execute(
        `UPDATE feeds SET title = $1 WHERE id = $2`,
        [title, feed_id],
    );
    console.log("DB: UPDATE FEED:")
}

export const delete_feed = async (feed_id: number) => {
    await db.execute(
        `DELETE FROM feeds WHERE id = $1`,
        [feed_id],
    );
    console.log("DB: UPDATE FEED:")
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
    existing_store_size: number = 0, // Refers to size of existing items in the list
    limit: number = 20,
    unread: boolean = false,
    lastPubDate: string = "",
) => {
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

    if (feed_id != -1) {
        whereCondition += `AND feed_id=${feed_id} `
    }

    if(unread)
        whereCondition += `AND read=0 `

    const query = `
        SELECT id, feed_id, title, link, pub_date as pubDate, read from articles
        ${whereCondition}
        ORDER BY datetime(pub_date) ${sort_by}
        LIMIT ${limit}
    `

    console.log("SQL:" + query);

    const result = await db.select(query);
    let results = [];

    for (let i = 0; i < result.length; i++) {
        results.push({
            ...result[i],
            rowid: existing_store_size + i
        })
    }
    console.log("DB FETCH POSTS:" + results.length);
    console.log("DB DEBUG:");
    console.log(JSON.stringify(results));

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

    return id2count;
}

export const delete_expired_posts = async (days: number) => {
    // Deletes posts in DB that are older than 
    // the specified no. of "days" parameter
    const result = await db.execute(
        `DELETE FROM articles WHERE datetime(pub_date) <= date('now','-${days} day')`
    );
    console.log(`DB: DELETED ${result.rowsAffected} EXPIRED POSTS`)
}