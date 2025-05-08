import type { Feed, FeedResult } from '$lib/types';
import Database from '@tauri-apps/plugin-sql';
import { DB_PATH, FEED_TYPE, ROOT_PARENT_FEED_ID } from '$lib/constants';

const db = await Database.load(DB_PATH);

export const fetch_folders = async (): Promise<Feed[]> => {
    const folders = (await db.select(
        "SELECT * from feeds where type = $1 order by title",
        [ FEED_TYPE.FOLDER ]
    )) as Feed[];

    return folders;
}

export const fetch_feeds = async (): Promise<FeedResult[]> => {
    // Fetch data from DB
    const feeds = (await db.select(
        "SELECT * from feeds where type = $1 order by title",
        [ FEED_TYPE.FEED ]
    )) as Feed[];

    const folders = (await db.select(
        "SELECT * from feeds where type = $1 order by title",
        [ FEED_TYPE.FOLDER ]
    )) as Feed[];

    // Create map to link folder_id to index in folders array
    // Only support 1 children level
    let folderId_to_index: Record<number, number> = {};
    for(let i = 0; i < folders.length; i++){
        const folder_id = folders[i].id;
        folderId_to_index[folder_id] = i;
    }

    // Move folders to final result
    let result: FeedResult[] = [];

    for(const folder of folders){
        result.push({
            ...folder,
            children: [],
            if_folder_open: false
        });
    }

    for(const feed of feeds){
        if(feed.parent == -1){
            // Feeds without parent folder has parent=-1
            // Push them directly into list.
            result.push({
                ...feed,
                children: [],
                if_folder_open: false
            });
        } else {
            // If folder has parent, first find ID of parent
            // then push the feed inside parent's children
            const parent_idx = folderId_to_index[feed.parent];
            result[parent_idx].children.push(feed);
        }
    }

    // const feeds = result as Feed[];
    console.log(`|| FETCH_FEED (SIZE: ${feeds.length + folders.length}) ||`);
    return result;
}

export const add_feed = async (
    title: String, 
    url: String, 
    favicon: String, 
    type: FEED_TYPE,
    parent: number = ROOT_PARENT_FEED_ID,
) => {
    const response = await db.execute(
        "INSERT into feeds (title, url, favicon, type, parent) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [title, url, favicon, type, parent],
    );
    console.log("|| DB: ADD FEED ||")
    return response.lastInsertId;
}
