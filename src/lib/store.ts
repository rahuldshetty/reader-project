import { DB_ORDER_ENUM } from './constants';

import { load } from '@tauri-apps/plugin-store';
import { writable } from 'svelte/store';

export const feeds_store = writable([]);
export const feed_unread_post_count = writable({});

export const selected_feed_id = writable(-1);

export const posts_store = writable([]);

export const posts_sort_by = writable(DB_ORDER_ENUM.NEWEST);
export const selected_post = writable({});


export const is_loading_feed = writable(false);
export const is_loading_posts = writable(false);

export const user_settings = await load('settings.json', { autoSave: true });
