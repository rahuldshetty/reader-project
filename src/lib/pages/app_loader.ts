import {
    feeds_store,
    is_loading_feed,
    is_loading_posts,
    posts_sort_by,
    feed_unread_post_count,
    posts_by_feed_store,
    selected_feed_id,
    unread_posts_only,
    themeMode,
    is_loading_splashscreen,
    feed_view
} from "$lib/store";
import { get } from "svelte/store";

import {
    add_posts,
    fetch_feed,
    fetch_posts,
    fetch_unread_post_counts,
    delete_expired_posts,
} from "$lib/db";

import {
    fetchRSSMetadata,
    isTimeExpired,
    fetch_user_setting,
} from "$lib/utils";

import "$lib/logging";

import { NO_OF_POST_PULLS_PER_TIME, SETTINGS } from "$lib/constants";

import { invoke } from "@tauri-apps/api/core";

export const syncPostsInDB = async (
    feeds: {
        id: Number;
        url: string;
        title: string;
        favicon: string;
        last_refresh_time: string;
    }[],
) => {
    // Adds new post entries to DB
    const time_in_seconds =
        (await fetch_user_setting(SETTINGS.LAST_REFRESH_TIME)) * 60 * 60;

    const filteredFeeds = feeds.filter((feed) => {
        // Need to refresh if time is expired (don't worry, logic is right :))
        return isTimeExpired(feed.last_refresh_time, time_in_seconds);
    });

    console.log(`No. of Feeds to Update: ${filteredFeeds.length}`);

    const feedsResults = await Promise.all(
        filteredFeeds.map(async (feed) => {
            return await fetchRSSMetadata(feed.id, feed.url);
        }),
    );

    for (const feed of feedsResults) {
        let posts = [];
        for (const post of feed.posts) {
            posts.push({
                ...post,
                feed_id: feed.id,
            });
        }
        if (posts.length > 0) await add_posts(posts);
    }
};

export const appLoader = async () => {
    console.log("Loading Reader App...");
    is_loading_splashscreen.set(true);

    // Load Default Settings
    themeMode.set(await fetch_user_setting(SETTINGS.THEME_MODE));
    feed_view.set(await fetch_user_setting(SETTINGS.CURRENT_FEED_VIEW));

    await delete_expired_posts(
        await fetch_user_setting(SETTINGS.POST_EXPIRY_TIME),
    );

    is_loading_feed.set(true);
    is_loading_posts.set(true);

    const fetchedFeeds = await fetch_feed();
    feeds_store.set(fetchedFeeds);
    is_loading_feed.set(false);

    posts_by_feed_store.update(store => {
        fetchedFeeds.forEach(feed => {
            store[feed.id] = [];
        });
        return store;
    });

    // Update DB Posts
    await syncPostsInDB(fetchedFeeds);

    // Render Posts
    const posts = await fetch_posts(
        get(posts_sort_by),
        null,
        -1,
        0,
        NO_OF_POST_PULLS_PER_TIME,
        get(unread_posts_only),
    );

    posts_by_feed_store.update(store => {
        posts.forEach(post => {
            if (!store[post.feed_id]) store[post.feed_id] = [];
            store[post.feed_id].push({ ...post, rowid: store[post.feed_id].length });
        });
        return store;
    });

    selected_feed_id.set(-1);

    feed_unread_post_count.set(await fetch_unread_post_counts());
    is_loading_posts.set(false);

    // console.log("POSTS BY FEED:");
    // console.debug(JSON.stringify($posts_by_feed_store));

    // Set the frontend task as being completed
    console.log('FRONTEND TASK DONE!')
    invoke("set_complete", { task: "frontend" });
    is_loading_splashscreen.set(false);
    console.log('APP LOAD FINISHED!')
};

