import {} from '$lib/constants';

import type { FeedMetadata, FeedMetadataFolder } from '$lib/types';
import { writable } from 'svelte/store';

export const active_page = writable(0);
export const url = writable('');
export const btn_in_progress = writable(false);
export const feeds_import_data = writable<(FeedMetadata | FeedMetadataFolder)[]>([]);
