import {
    check_feed_expired,
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
    user_settings,
    refreshing_posts,
} from "$lib/stores/app_store";

import {
    local_user_setting,
} from "$lib/stores/app_store";

import {
    NO_FEED_SELECTED,
    NO_OF_POST_PULLS_PER_TIME,
    SETTINGS,
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
        posts_store.set([]);
    }
}


export const refresh_posts = async (
    feed_id:number = -1,
    last_id: number | null = null,
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    lastPubDate: string = "",
    is_fav: boolean | null = null,
) => {
    console.log(`Refreshing Feed: ${feed_id}`);

    // When by default there is no feed selected, avoid refresh data
    if(feed_id == NO_FEED_SELECTED){
        return;
    }

    refreshing_posts.set(true);
    const sort_by = get(posts_sort_by);
    const unread = get(filter_unread_posts);
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
    refreshing_posts.set(false);
}


export const load_new_posts = async (
    feed_id:number = -1,
    last_id: number | null = null,
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    is_fav: boolean | null = null,
) => {
    const sort_by = get(posts_sort_by);
    const unread = get(filter_unread_posts);

    // Get pubDate for last post
    const posts = get(posts_store);
    if(posts.length == 0){
        return false;
    }
    const lastPubDate = posts[posts.length - 1].pubDate;

    // Get new posts
    const new_posts = await fetch_posts(
        sort_by,
        last_id,
        feed_id,
        limit,
        unread,
        lastPubDate,
        is_fav,
    )

    // Append posts into current store
    if(new_posts.length != 0)
        posts_store.update(current_posts => {
            return [ ...current_posts, ...new_posts ];
        });
    
    // Whether new posts loaded or not
    return new_posts.length > 0;
}


export const refresh_post_data = async (
    feed_id: number, 
    url: string
) => {
    // Called when selecting "Refresh" option for a Feed
    refreshing_posts.set(true);

    const latest_feed_info = await fetchFeedDataFromFeedURL(feed_id, url);

    await add_posts(latest_feed_info);
    
    // update new post data in store
    refresh_posts(feed_id);
}


export const check_and_pull_latest_feed_data = async (
    feed_id: number,
    url: string
) => {
    // Checks first if setting is enabled to check for latest feeds when selecting the feed.
    if(await user_settings.get(SETTINGS.REFRESH_FEED_ON_SELECT)){
        // Check if given feed is expired
        if(await check_feed_expired(feed_id)){
            // Pull new data from feed
            await refresh_post_data(feed_id, url);
        }
    }
}