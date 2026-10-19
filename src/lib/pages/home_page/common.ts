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
    purge_article_cache,
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
    refreshing_posts,
    refreshing_feeds,
    feed_load_progress,
    feed_count_by_id,
    local_user_setting,
    active_folder_feed_ids,
    search_keywords,
    search_text,
    is_mobile,
    mobile_active_panel,
    cursor_post_id,
} from "$lib/stores/app_store";

import {
    NO_FEED_SELECTED,
    NO_OF_POST_PULLS_PER_TIME,
    TOAST_MESSAGE_TYPE,
    FEED_TYPE,
    CONTENT_CACHE_TTL_DAYS,
    CONTENT_CACHE_MAX_MB,
} from "$lib/constants";

import { get } from "svelte/store";
import { fetchFeedDataFromFeedURL } from "$lib/services/feed_gather";
import { toastStore } from "$lib/stores/toast_store";
import { validate_url_secure } from "$lib/utils/html";
import type { Feed, FeedResult, PostResult } from "$lib/types";
import { translate } from "$lib/i18n";

// Incremented on every explicit source selection. Async refreshes capture the
// value before awaiting so a slow response for an old feed cannot overwrite
// the source the user is looking at now.
let feed_selection_revision = 0;

export const refresh_app_data = async (
    only_feeds: boolean = true,
    only_posts: boolean = true,
) => {
    // Refresh Feed List
    if (only_feeds) {
        active_feed_id.set(NO_FEED_SELECTED);
        active_folder_feed_ids.set([]);
        feed_count_by_id.set(await fetch_unread_post_counts());
        feeds_store.set(await fetch_feeds());
        active_feed_name.set('');
        search_keywords.set([]);
        search_text.set('');
        refreshing_feeds.set(false);
    }
    if (only_posts) {
        feed_selection_revision++;
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
    revision: number | null = null,
) => {
    console.log(`Refreshing Feed: ${feed_id}`);

    // When by default there is no feed selected, avoid refresh data
    if (feed_id == NO_FEED_SELECTED) {
        return;
    }

    const request_revision = revision ?? feed_selection_revision;
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

    // A newer source selection owns the post panel now.
    if (request_revision !== feed_selection_revision) {
        return;
    }

    posts_store.set(posts);
    // Keyboard cursor starts at the first post of the refreshed list
    cursor_post_id.set(posts[0]?.id ?? -1);
    feed_count_by_id.set(await fetch_unread_post_counts());
    if (request_revision === feed_selection_revision) {
        refreshing_posts.set(false);
    }
}

// Reload the currently selected source while keeping folder aggregation.
export const refresh_active_posts = async () => {
    await refresh_posts(
        get(active_feed_id),
        null,
        NO_OF_POST_PULLS_PER_TIME,
        "",
        null,
        get(active_folder_feed_ids),
        feed_selection_revision,
    );
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
    url: string,
    revision: number | null = null,
) => {
    // Called when selecting "Refresh" option for a Feed
    const selection_revision = revision ?? feed_selection_revision;

    // URL Validation
    const is_insecure_mode_enabled = get(local_user_setting).ENABLE_INSECURE_LINK;
    if (!is_insecure_mode_enabled && !validate_url_secure(url)) {
        toastStore.add(TOAST_MESSAGE_TYPE.ERROR, translate("toast.feed_url_insecure"));
        return;
    }

    try {
        refreshing_posts.set(true);

        const latest_feed_info = await fetchFeedDataFromFeedURL(feed_id, url);

        await add_posts(latest_feed_info);

        // A newer source selection superseded this refresh while the network
        // request was in flight.
        if (selection_revision !== feed_selection_revision) {
            return;
        }

        // Update icon data if its not set. Refresh only the feed list here:
        // refresh_app_data() also resets the active feed, which can clobber a
        // newer selection while this await chain is still running.
        if (await update_icon(feed_id, latest_feed_info.icon)) {
            feeds_store.set(await fetch_feeds());
            if (selection_revision !== feed_selection_revision) {
                return;
            }
            active_feed_id.set(feed_id);
            const refreshed_feed = find_feed_in_tree(
                get(feeds_store),
                feed_id,
            );
            active_feed_name.set(refreshed_feed?.title ?? '');
        };

        // update new post data in store
        await refresh_posts(
            feed_id,
            null,
            NO_OF_POST_PULLS_PER_TIME,
            "",
            null,
            [],
            selection_revision,
        );
    } catch (error) {
        console.error(`Failed to refresh feed ${feed_id}:`, error);
        toastStore.add(TOAST_MESSAGE_TYPE.ERROR, translate("toast.unable_to_fetch"));
    } finally {
        if (selection_revision === feed_selection_revision) {
            refreshing_posts.set(false);
        }
    }
}


export const check_and_pull_latest_feed_data = async (
    feed_id: number,
    url: string,
    revision: number | null = null,
) => {
    // Read the loaded settings, not the raw store: on a fresh install the
    // store has no key yet and get() would return undefined, silently
    // skipping the first refresh for every newly added feed.
    if (get(local_user_setting).REFRESH_FEED_ON_SELECT) {
        // Check if given feed is expired
        if (await check_feed_expired(feed_id)) {
            // Pull new data from feed
            await refresh_post_data(feed_id, url, revision);
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
    // Resolve the expired feeds first so the startup progress reflects the
    // feeds that actually need a network refresh.
    const feeds_to_refresh: Feed[] = [];
    for (const feed of feeds) {
        if (await check_feed_expired(feed.id)) {
            feeds_to_refresh.push(feed);
        }
    }

    feed_load_progress.set({ completed: 0, total: feeds_to_refresh.length });
    for (const feed of feeds_to_refresh) {
        await refresh_post_data(feed.id, feed.url);
        feed_load_progress.update(({ completed, total }) => ({
            completed: completed + 1,
            total,
        }));
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

    const open_posts_panel = () => {
        if (get(is_mobile)) {
            mobile_active_panel.set("posts");
        }
    };

    if (isSameFeed) {
        open_posts_panel();
        // The list can be empty after a refresh or a failed load; reload it
        // instead of showing an empty panel for the already-selected source.
        if (get(posts_store).length === 0) {
            const revision = ++feed_selection_revision;
            await refresh_posts(
                feed_id,
                null,
                NO_OF_POST_PULLS_PER_TIME,
                "",
                null,
                get(active_folder_feed_ids),
                revision,
            );
        }
        return;
    }

    const revision = ++feed_selection_revision;

    if (feed_id == -2) {
        // Favourites list ignores the unread filter
        filter_unread_posts.set(false);
    }

    // Selecting a source explicitly replaces any active search.
    search_keywords.set([]);
    search_text.set('');

    active_feed_id.set(feed_id);
    active_feed_name.set(feed ? feed.title : '');
    active_post_id.set(-1);
    cursor_post_id.set(-1);

    const folder_ids =
        feed && feed.type == FEED_TYPE.FOLDER
            ? ((feed as FeedResult).children?.map((c) => c.id) ?? [])
            : [];
    active_folder_feed_ids.set(folder_ids);

    // Own the panel immediately. Network refreshes can take seconds; without
    // this the tap looks ignored and the next screen can render stale/empty.
    posts_store.set([]);
    refreshing_posts.set(true);
    open_posts_panel();

    if (feed && feed.type == FEED_TYPE.FEED) {
        // Check and try to pull latest posts from RSS feed
        await check_and_pull_latest_feed_data(feed_id, feed.url, revision);
        if (revision !== feed_selection_revision) return;
        await refresh_posts(
            feed_id,
            null,
            NO_OF_POST_PULLS_PER_TIME,
            "",
            null,
            [],
            revision,
        );
    } else if (feed && feed.type == FEED_TYPE.FOLDER) {
        // Aggregate every child feed's posts under the folder.
        await refresh_posts(
            feed_id,
            null,
            NO_OF_POST_PULLS_PER_TIME,
            "",
            null,
            folder_ids,
            revision,
        );
    } else if (feed_id < 0) {
        // All Posts / Favourites
        await refresh_posts(
            feed_id,
            null,
            NO_OF_POST_PULLS_PER_TIME,
            "",
            null,
            [],
            revision,
        );
    } else {
        refreshing_posts.set(false);
    }
};


// Delete old posts
export const auto_purge_old_posts = async () => {
    const settings = get(local_user_setting);
    const post_expiry_time = settings.POST_EXPIRY_TIME;
    const is_auto_purge_enabled = settings.ENABLE_AUTO_PURGE;
    if (is_auto_purge_enabled) {
        await delete_old_posts(post_expiry_time);
    }

    // Cache retention is independent of post retention: favorites and small
    // feeds may outlive the post expiry window.
    await purge_article_cache(
        settings.CONTENT_CACHE_TTL_DAYS ?? CONTENT_CACHE_TTL_DAYS,
        settings.CONTENT_CACHE_MAX_MB ?? CONTENT_CACHE_MAX_MB,
    );
}
