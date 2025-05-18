import {get} from "svelte/store";
import type { Feed, FeedResult } from '$lib/types';
import Database from '@tauri-apps/plugin-sql';
import { DB_PATH, FEED_TYPE, ROOT_PARENT_FEED_ID } from '$lib/constants';
import { isTimeExpired } from "$lib/utils/time";
import { local_user_setting } from "$lib/stores/app_store";

const db = await Database.load(DB_PATH);

export const fetch_feed_by_id = async (id: number): Promise<Feed> => {
    const feed = (await db.select(
        "SELECT * from feeds where id = $1",
        [ id ]
    )) as Feed[];
    if(feed.length == 0){
        throw Error(`Feed data for id ${id} not found.`);
    }
    return feed[0];
}

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
    console.log("|| DB: DELETE FEED ||");
}

export const update_feed = async (feed_id: number, title: string, folder: number) => {
    await db.execute(
        `UPDATE feeds SET title = $2, parent = $3 WHERE id = $1`,
        [feed_id, title, folder],
    );
    console.log("|| UPDATE FEED ||")
}

export const check_feed_expired = async (feed_id: number) => {
    const feed = await fetch_feed_by_id(feed_id);
    const lrt = get(local_user_setting).LAST_REFRESH_TIME;
    return feed.last_refresh_time == null || feed.last_refresh_time == '' || isTimeExpired(feed.last_refresh_time, lrt);
}

export const update_icon = async (feed_id: number, icon: string) => {
    const feed = await fetch_feed_by_id(feed_id);
    if(feed.favicon == '' && icon != ''){
        await db.execute(
            `UPDATE feeds SET favicon = $2 WHERE id = $1`,
            [feed_id, icon],
        );
        console.log("|| UPDATE FEED ICON ||");
        return true;
    } else {
        return false;
    }
}
