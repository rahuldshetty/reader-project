import { get } from "svelte/store";

import {
    local_user_setting,
    is_loading_splashscreen
} from "$lib/stores/app_store";

import { fetch_latest_user_settings } from "$lib/utils/setting";
import { refresh_app_data } from "$lib/pages/home_page/common";

export const init_app = async () => {
    
    is_loading_splashscreen.set(true);

    // Load User Settings from settings.json
    local_user_setting.set(await fetch_latest_user_settings());

    // TODO: Do rest of loading stuff
    // 1. refreshing feed on load

    await refresh_app_data();

    is_loading_splashscreen.set(false);
}
