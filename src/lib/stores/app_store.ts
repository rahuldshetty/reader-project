import type { FeedResult, UserSettings, PostResult, FeedUnreadCounter } from '$lib/types';

import { LazyStore } from '@tauri-apps/plugin-store';
import { writable } from 'svelte/store';

import { 
    MODAL_TYPE, 
    LAST_REFRESH_TIME, 
    DEFAULT_DAISY_THEME,
    POST_EXPIRY_TIME, 
    FEED_VIEW,
    NO_FEED_SELECTED,
    REFRESH_FEED_ON_SELECT,
    DB_ORDER_ENUM,
    ENABLE_INSECURE_LINK,
    SCREEN,
    AUTO_READ_ON_SELECT,
    REFRESH_ALL_FEED_ON_LAUNCH,
    ENABLE_AUTO_PURGE,
    MINIMIZE_APP,
} from '$lib/constants';

// UI States
export const active_screen = writable(SCREEN.FEEDS);
export const is_loading_splashscreen = writable(true);
export const collapse_sidebar = writable(false);
export const active_modal = writable(MODAL_TYPE.NONE);

// User Configuration for App
export const user_settings = new LazyStore('settings.json');
export const local_user_setting = writable<UserSettings>({
    "MINIMIZE_APP": MINIMIZE_APP,
    "LAST_REFRESH_TIME": LAST_REFRESH_TIME,
    "THEME_MODE": DEFAULT_DAISY_THEME,
    "ENABLE_AUTO_PURGE": ENABLE_AUTO_PURGE,
    "POST_EXPIRY_TIME": POST_EXPIRY_TIME,
    "CURRENT_FEED_VIEW": String(FEED_VIEW.LIST),
    "REFRESH_FEED_ON_SELECT": REFRESH_FEED_ON_SELECT,
    "ENABLE_INSECURE_LINK": ENABLE_INSECURE_LINK,
    "AUTO_READ_ON_SELECT": AUTO_READ_ON_SELECT,
    "REFRESH_ALL_FEED_ON_LAUNCH": REFRESH_ALL_FEED_ON_LAUNCH,
});

// Feed Configuration
export const refreshing_feeds = writable(false);
export const feeds_store = writable<FeedResult[]>([]);
export const active_feed_id = writable(NO_FEED_SELECTED);
export const active_feed_name = writable('');
export const feed_count_by_id = writable<FeedUnreadCounter>();

// Post Configuration
export const refreshing_posts = writable(false);
export const posts_store = writable<PostResult[]>([]);
export const posts_sort_by = writable(DB_ORDER_ENUM.NEWEST);
export const filter_unread_posts = writable(false);
export const filter_liked_posts = writable(false);
export const active_post_id = writable(-1);
