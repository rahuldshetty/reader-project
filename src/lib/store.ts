import { writable } from 'svelte/store';

export const feeds_store = writable([]);

export const selected_feed_id = writable(-1);

export const posts_store = writable([]);

export const selected_post = writable({});
