import Database from '@tauri-apps/plugin-sql';

import { DB_PATH } from '$lib/constants';


const db = await Database.load(DB_PATH);

export const fetch_feed = async () => {
    const result = await db.select(
        "SELECT * from feeds"
    );
    console.log("DB: FETCH FEED")
    return result;
}

export const add_feed = async (title:String, url:String, favicon: String) => {
    const response = await db.execute(
        "INSERT into feeds (title, url, favicon) VALUES ($1, $2, $3)",
        [title, url, favicon],
    );
    console.log("DB: ADD FEED")
    return response.lastInsertId;
}

export const add_posts = async (posts:{title: string, link: string, pubDate: string, feed_id: Number}[]) => {
    // Track individual posts to insert into DB
    let value_string = ""

    // Create a Set to track feeds that were updated
    const feedsSet = new Set();

    for(const [i, post] of posts.entries()){
        value_string += `(${post.feed_id}, "${post.title}", "${post.link}", "${post.pubDate}")`
        if(i != posts.length - 1){
            value_string += ",\n"
        }
        feedsSet.add(post.feed_id);
    }
    await db.execute(
        `INSERT OR IGNORE INTO articles (feed_id, title, link, pub_date) VALUES ${value_string}`
    );

    // Update Last Refresh Time (LRT)
    if(feedsSet.size > 0){
        const value_string_feeds = Array.from(feedsSet).join(", ");
        const currentTime = new Date().toISOString();
        await db.execute(
            `UPDATE feeds SET last_refresh_time = "${currentTime}" WHERE id in (${value_string_feeds})`
        );
    }
    
    console.log("DB: ADD POSTS");
    console.log("DB: REFRESH FEED LRT")
}


export const fetch_posts = async () => {
    const result = await db.select(
        "SELECT id, feed_id, title, link, pub_date as pubDate, read from articles"
    );
    console.log("DB: FETCH POSTS")
    return result;
}