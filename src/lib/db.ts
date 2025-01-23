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
    let value_string = ""
    for(const [i, post] of posts.entries()){
        value_string += `(${post.feed_id}, "${post.title}", "${post.link}", "${post.pubDate}")`
        if(i != posts.length - 1){
            value_string += ",\n"
        }
    }
    await db.execute(
        `INSERT OR IGNORE INTO articles (feed_id, title, link, pub_date) VALUES ${value_string}`
    );
    
    console.log("DB: ADD POSTS");
}


export const fetch_posts = async () => {
    const result = await db.select(
        "SELECT id, feed_id, title, link, pub_date as pubDate, read from articles"
    );
    console.log("DB: FETCH POSTS")
    return result;
}