import { get } from "svelte/store";

import {
    feeds_store,
    local_user_setting,
    is_loading_splashscreen
} from "$lib/dao/store";

import {
    fetch_feeds
} from "$lib/dao/feed_db";

import { fetch_latest_user_settings } from "$lib/utils/setting";


export const init_app = async () => {
    
    is_loading_splashscreen.set(true);

    // Load User Settings from settings.json
    local_user_setting.set(await fetch_latest_user_settings());

    // TODO: Do rest of loading stuff
    // 1. refreshing feed on load

    // Fetch Feeds
    feeds_store.set(await fetch_feeds());

    is_loading_splashscreen.set(false);
}
