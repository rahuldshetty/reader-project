import { writable } from 'svelte/store';

export const selected_date = writable(new Date().toISOString().split("T")[0]);
