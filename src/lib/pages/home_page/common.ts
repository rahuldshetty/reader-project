import {
    fetch_feeds
} from "$lib/dao/feed_db";

import { add_posts, fetch_posts } from "$lib/dao/post_db";

import {
    feeds_store,
    active_feed_id,
    active_feed_name,
    posts_store,
    posts_sort_by,
    filter_unread_posts,
    filter_liked_posts,
    active_post_id,
} from "$lib/stores/app_store";

import {
    NO_FEED_SELECTED,
    NO_OF_POST_PULLS_PER_TIME
} from "$lib/constants";

import {get} from "svelte/store";
import { fetchFeedDataFromFeedURL } from "$lib/services/feed_gather";

export const refresh_app_data = async (
    only_feeds: boolean = true,
    only_posts: boolean = true,
) => {
    // Refresh Feed List
    if(only_feeds)
    {
        feeds_store.set(await fetch_feeds());
        active_feed_name.set('');
        active_feed_id.set(NO_FEED_SELECTED);
    }
    if(only_posts){
        active_post_id.set(-1);
    }
}


export const refresh_posts = async (
    feed_id:number = -1,
    last_id: number | null = null,
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    lastPubDate: string = "",
) => {
    const sort_by = get(posts_sort_by);
    const unread = get(filter_unread_posts);
    const is_fav = get(filter_liked_posts);
    posts_store.set(
        await fetch_posts(
            sort_by,
            last_id,
            feed_id,
            limit,
            unread,
            lastPubDate,
            is_fav,
        )
    );
}

export const refresh_post_data = async (
    feed_id: number, 
    url: string
) => {
    const latest_feed_info = await fetchFeedDataFromFeedURL(feed_id, url);

    await add_posts(latest_feed_info);
    
    // update new post data in store
    refresh_posts(feed_id);
}
