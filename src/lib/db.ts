import Database from '@tauri-apps/plugin-sql';

import { DB_PATH } from '$lib/constants';


const db = await Database.load(DB_PATH);

export const fetch_feed = async () => {
    const result = await db.select(
        "SELECT * from feeds"
    );
    return result;
}

export const add_feed = async (title:String, url:String, favicon: String) => {
    await db.execute(
        "INSERT into feeds (title, url, favicon) VALUES ($1, $2, $3)",
        [title, url, favicon],
    );
}
