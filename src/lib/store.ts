import { DB_ORDER_ENUM, MODAL_TYPE, THEMES, FEED_VIEW } from '$lib/constants';

import { LazyStore } from '@tauri-apps/plugin-store';
import { writable } from 'svelte/store';

export const feeds_store = writable([]);
export const feed_unread_post_count = writable({});
export const minimize_feeds = writable(true);
export const feed_view = writable(FEED_VIEW.LIST);

export const selected_modal = writable(MODAL_TYPE.NONE);
export const selected_feed_id = writable(-2);

export const posts_by_feed_store = writable({});

export const posts_sort_by = writable(DB_ORDER_ENUM.NEWEST);
export const unread_posts_only = writable(false);
export const selected_post = writable({});

export const is_loading_splashscreen = writable(true);
export const is_loading_feed = writable(false);
export const is_loading_posts = writable(false);
export const is_loading_post_content = writable(false);

export const user_settings = new LazyStore('settings.json', { autoSave: true });

export const themeMode = writable(THEMES.LIGHT);
