import {
    check_feed_expired,
    fetch_feeds,
    update_icon,
    fetch_refresheable_feeds,
    fetch_unread_post_counts,
    fetch_all_feeds,
} from "$lib/dao/feed_db";

import {
    add_posts,
    fetch_posts,
    fetch_old_post_count,
    delete_old_posts,
    mark_post_as_read,
} from "$lib/dao/post_db";

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
    refreshing_feeds,
    feed_count_by_id,
    local_user_setting,
    active_folder_feed_ids,
    search_keywords,
    is_mobile,
    mobile_active_panel,
    cursor_post_id,
} from "$lib/stores/app_store";

import {
    NO_FEED_SELECTED,
    NO_OF_POST_PULLS_PER_TIME,
    SETTINGS,
    TOAST_MESSAGE_TYPE,
    FEED_TYPE,
} from "$lib/constants";

import { get } from "svelte/store";
import { fetchFeedDataFromFeedURL } from "$lib/services/feed_gather";
import { toastStore } from "$lib/stores/toast_store";
import { validate_url_secure } from "$lib/utils/html";
import type { Feed, FeedResult, PostResult } from "$lib/types";

export const refresh_app_data = async (
    only_feeds: boolean = true,
    only_posts: boolean = true,
) => {
    // Refresh Feed List
    if (only_feeds) {
        active_feed_id.set(NO_FEED_SELECTED);
        feed_count_by_id.set(await fetch_unread_post_counts());
        feeds_store.set(await fetch_feeds());
        active_feed_name.set('');
        refreshing_feeds.set(false);
    }
    if (only_posts) {
        active_post_id.set(-1);
        posts_store.set([]);
        refreshing_posts.set(false);
    }
}


export const refresh_posts = async (
    feed_id: number = -1,
    last_id: number | null = null,
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    lastPubDate: string = "",
    is_fav: boolean | null = null,
    feed_ids: number[] = [],
) => {
    console.log(`Refreshing Feed: ${feed_id}`);

    // When by default there is no feed selected, avoid refresh data
    if (feed_id == NO_FEED_SELECTED) {
        return;
    }

    refreshing_posts.set(true);
    const sort_by = get(posts_sort_by);
    const unread = get(filter_unread_posts);
    const keywords = get(search_keywords);
    const posts = await fetch_posts(
        sort_by,
        last_id,
        feed_id,
        limit,
        unread,
        lastPubDate,
        is_fav,
        keywords,
        feed_ids
    );
    posts_store.set(posts);
    // Keyboard cursor starts at the first post of the refreshed list
    cursor_post_id.set(posts[0]?.id ?? -1);
    feed_count_by_id.set(await fetch_unread_post_counts());
    refreshing_posts.set(false);
}


export const load_new_posts = async (
    feed_id: number = -1,
    last_id: number | null = null,
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    is_fav: boolean | null = null,
    feed_ids: number[] = [],
) => {
    const sort_by = get(posts_sort_by);
    const unread = get(filter_unread_posts);
    const keywords = get(search_keywords);

    // Get pubDate for last post
    const posts = get(posts_store);
    if (posts.length == 0) {
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
        keywords,
        feed_ids
    )

    // Append posts into current store
    if (new_posts.length != 0)
        posts_store.update(current_posts => {
            // Insert only unique posts
            const allPosts = [...current_posts, ...new_posts];
            const uniquePostIds = new Set<number>();
            const uniquePosts = allPosts.filter(post => {
                if (uniquePostIds.has(post.id)) {
                    return false;
                }
                uniquePostIds.add(post.id);
                return true;
            });
            return uniquePosts;
        });

    // Whether new posts loaded or not
    return new_posts.length > 0;
}


export const refresh_post_data = async (
    feed_id: number,
    url: string
) => {
    // Called when selecting "Refresh" option for a Feed

    // URL Validation
    const is_insecure_mode_enabled = get(local_user_setting).ENABLE_INSECURE_LINK;
    if (!is_insecure_mode_enabled && !validate_url_secure(url)) {
        toastStore.add(TOAST_MESSAGE_TYPE.ERROR, "Feed URL insecure. Enable insecure mode to fetch data from insecure urls.");
        return;
    }

    try {
        refreshing_posts.set(true);

        const latest_feed_info = await fetchFeedDataFromFeedURL(feed_id, url);

        await add_posts(latest_feed_info);

        // Update icon data if its not set
        if (await update_icon(feed_id, latest_feed_info.icon)) {
            await refresh_app_data(true, false);
            active_feed_id.set(feed_id);
        };

        // update new post data in store
        await refresh_posts(feed_id);
    } catch {
        toastStore.add(TOAST_MESSAGE_TYPE.ERROR, "Unable to fetch feed :(");
    } finally {
        refreshing_posts.set(false);
    }
}


export const check_and_pull_latest_feed_data = async (
    feed_id: number,
    url: string
) => {
    // Checks first if setting is enabled to check for latest feeds when selecting the feed.
    if (await user_settings.get(SETTINGS.REFRESH_FEED_ON_SELECT)) {
        // Check if given feed is expired
        if (await check_feed_expired(feed_id)) {
            // Pull new data from feed
            await refresh_post_data(feed_id, url);
        }
    }
}

export const pull_feed_and_refresh_post_data = async () => {
    const refresh_all_feeds_on_load = get(local_user_setting).REFRESH_ALL_FEED_ON_LAUNCH;
    let feeds: Feed[] = [];
    // If refresh all feeds is set, then fetch all feed info
    if (refresh_all_feeds_on_load) {
        feeds = await fetch_all_feeds();
    } else {
        feeds = await fetch_refresheable_feeds();
    }
    for (const feed of feeds) {
        if (await check_feed_expired(feed.id)) {
            await refresh_post_data(feed.id, feed.url);
        }
    }
}

export const update_post_feed_counter_value = (feed_id: number, value: number) => {
    let feed_count = get(feed_count_by_id);
    if (feed_id in feed_count) {
        feed_count[feed_id] += value;
        feed_count_by_id.set(feed_count);
    }
}


// Post Store Updates

export const update_post_store_item_by_id = (id: number, new_post: PostResult) => {
    let posts = get(posts_store);
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == id) {
            posts[i] = new_post;
            break;
        }
    }
    posts_store.set(posts);
}


// Shared "open this post" flow used by both mouse clicks and the keyboard
// cursor. Honors the auto-read setting and mobile panel navigation.
export const select_post = async (post: PostResult) => {
    if (get(local_user_setting).AUTO_READ_ON_SELECT) {
        if (!post.read) {
            await mark_post_as_read(post.id, true);
            update_post_feed_counter_value(post.feed_id, -1);
            update_post_store_item_by_id(post.id, { ...post, read: true });
        }
    }
    active_post_id.set(post.id);
    cursor_post_id.set(post.id);

    // Navigate to content panel on mobile
    if (get(is_mobile)) {
        mobile_active_panel.set("content");
    }
};


const find_feed_in_tree = (
    feeds: FeedResult[],
    id: number,
): Feed | FeedResult | null => {
    for (const feed of feeds) {
        if (feed.id == id) return feed;
        const child = feed.children?.find((c) => c.id == id);
        if (child) return child;
    }
    return null;
};

// Shared "select this feed" flow used by mouse clicks and the keyboard
// (Tab / Shift+Tab). Custom items are All Posts (-1) and Favourites (-2).
export const select_feed = async (feed_id: number) => {
    const isSameFeed = get(active_feed_id) == feed_id;
    const feed = find_feed_in_tree(get(feeds_store), feed_id);

    if (!isSameFeed) {
        if (feed_id == -2) {
            // Favourites list ignores the unread filter
            filter_unread_posts.set(false);
        }

        active_feed_id.set(feed_id);
        active_feed_name.set(feed ? feed.title : '');

        active_folder_feed_ids.set([]);

        if (feed && feed.type == FEED_TYPE.FEED) {
            // Check and try to pull latest posts from RSS feed
            await check_and_pull_latest_feed_data(feed_id, feed.url);
            await refresh_posts(feed_id);
        } else if (feed && feed.type == FEED_TYPE.FOLDER) {
            // Aggregate every child feed's posts under the folder.
            const ids = (feed as FeedResult).children?.map((c) => c.id) ?? [];
            active_folder_feed_ids.set(ids);
            await refresh_posts(feed_id, null, NO_OF_POST_PULLS_PER_TIME, "", null, ids);
        } else if (feed_id < 0) {
            // All Posts / Favourites
            await refresh_posts(feed_id);
        }
    }

    // Navigate to posts panel on mobile (always, even if same feed)
    if (get(is_mobile)) {
        mobile_active_panel.set("posts");
    }
};


// Delete old posts
export const auto_purge_old_posts = async () => {
    const post_expiry_time = get(local_user_setting).POST_EXPIRY_TIME;
    const is_auto_purge_enabled = get(local_user_setting).ENABLE_AUTO_PURGE;
    if (is_auto_purge_enabled) {
        await delete_old_posts(post_expiry_time);
    }
}
