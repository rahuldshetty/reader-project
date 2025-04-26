import Database from '@tauri-apps/plugin-sql';
import { DB_PATH, DB_ORDER_ENUM, NO_OF_POST_PULLS_PER_TIME, FEED_TYPE} from '$lib/constants';
import { convertToTimeStringForDB, escape_title } from "$lib/utils";


const db = await Database.load(DB_PATH);

export const fetch_feed = async () => {
    const result = await db.select(
        "SELECT * from feeds where type=0"
    );
    console.log("DB: FETCH FEED")
    return result;
}

export const add_feed = async (
    title: String, 
    url: String, 
    favicon: String, 
    type: FEED_TYPE,
    parent: number,
) => {
    const response = await db.execute(
        "INSERT into feeds (title, url, favicon, type, parent) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [title, url, favicon, type, parent],
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
    // Delete feed
    await db.execute(
        `WITH RECURSIVE descendants(id) AS (
            SELECT id FROM feeds WHERE id = $1
            UNION ALL
            SELECT n.id
            FROM feeds n
            JOIN descendants d ON n.parent = d.id
        )
        DELETE FROM feeds WHERE id IN (SELECT id FROM descendants);`,
        [feed_id],
    );
    console.log("DB: UPDATE FEED")
}

export const add_posts = async (posts: { title: string, link: string, pubDate: string, feed_id: Number, image: string }[]) => {
    // Track individual posts to insert into DB
    let value_string = ""

    // Create a Set to track feeds that were updated
    const feedsSet = new Set();


    for (const [i, post] of posts.entries()) {
        const date = convertToTimeStringForDB(post.pubDate);

        value_string += `(${post.feed_id}, '${escape_title(post.title)}', '${post.link}', '${date}', '${escape_title(post.image)}')`;

        if (i != posts.length - 1) {
            value_string += ",\n"
        }
        feedsSet.add(post.feed_id);
    }

    const response = await db.execute(
        `INSERT OR IGNORE INTO articles (feed_id, title, link, pub_date, image_url) VALUES ${value_string}`
    );

    console.log(`No. of inserts: ${response.rowsAffected}`);

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
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    unread: boolean = false,
    lastPubDate: string = "",
    is_fav: boolean | null = null, // Set this to filter specific posts
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

    // Negative Feed ids reserved for All Posts, Favs
    if (feed_id >= 0) {
        whereCondition += `AND feed_id=${feed_id} `
    } else if(feed_id == -2){
        is_fav = true;
    }

    if(unread){
        whereCondition += `AND read=0 `
    }

    if(is_fav != null){
        if(is_fav)
            whereCondition += `AND is_fav=1 `
        else
            whereCondition += `AND is_fav=0 `
    }

    const query = `
        SELECT id, feed_id, title, link, pub_date as pubDate, read, is_fav, image_url as image, content, word_count from articles
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
    let total = 0;
    
    for (var post of results) {
        id2count[post.id] = post.count;
        total += post.count;
    }

    // All Posts
    id2count[-1] = total;

    return id2count;
}

export const delete_expired_posts = async (days: number) => {
    // Deletes posts in DB that are older than 
    // the specified no. of "days" parameter
    // and are not fav posts and 
    // should contain more than 30 articles in that feed.
    const result = await db.execute(
        `DELETE FROM articles WHERE datetime(pub_date) <= date('now','-${days} day') AND is_fav = 0 AND 
        feed_id in (
            SELECT feed_id FROM articles group by feed_id having count(*) > 30
        )
        `
    );
    console.log(`DB: DELETED ${result.rowsAffected} EXPIRED POSTS`)
}

export const update_fav_post = async (post_id: number, is_fav: number) => {
    console.log(`POST ID: ${post_id} Val: ${is_fav}`)
    const res = await db.execute(
        `UPDATE articles SET is_fav = $1 WHERE id = $2`,
        [is_fav, post_id],
    );
    console.log(`DB: UPDATE IS_FAV ${res.rowsAffected}`)
}

export const save_post_html_content = async (post_id: number, content: string, word_count: number) => {
    const response = await db.execute(
        `UPDATE articles SET content = $1, word_count = $2 WHERE id = $3`,
        [content, word_count, post_id]
    );
    console.log(`DB: CONTENT SAVED STATUS - ${response.rowsAffected}`)
}
