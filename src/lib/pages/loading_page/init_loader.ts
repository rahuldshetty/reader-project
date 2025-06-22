import {
    local_user_setting,
    is_loading_splashscreen
} from "$lib/stores/app_store";

import { fetch_latest_user_settings } from "$lib/utils/setting";

import { 
    refresh_app_data,
    pull_feed_and_refresh_post_data,
    auto_purge_old_posts 
} from "$lib/pages/home_page/common";

export const init_app = async () => {

    is_loading_splashscreen.set(true);

    // Load User Settings from settings.json
    local_user_setting.set(await fetch_latest_user_settings());

    await auto_purge_old_posts();

    await pull_feed_and_refresh_post_data();

    await refresh_app_data();

    is_loading_splashscreen.set(false);
}
