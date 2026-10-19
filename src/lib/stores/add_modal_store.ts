import type { FeedMetadata, FeedMetadataFolder } from '$lib/types';
import { writable } from 'svelte/store';

export const active_page = writable(0);
export const url = writable('');
export const skip_data_load_on_import = writable(false);
export const btn_in_progress = writable(false);
export const feeds_import_data = writable('');

// Already-resolved feed metadata (QR transfer). When set, the import page
// skips parsing/refetching and renders these items directly.
export const feeds_import_items =
    writable<(FeedMetadata | FeedMetadataFolder)[] | null>(null);
