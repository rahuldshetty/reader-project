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

    // Apply font settings to CSS custom properties
    const loadedSettings = await fetch_latest_user_settings();
    const root = document.documentElement;
    root.style.setProperty('--app-font-family', loadedSettings.FONT_SETTINGS.FONT_FAMILY);
    root.style.setProperty('--app-font-size', loadedSettings.FONT_SETTINGS.FONT_SIZE + 'px');
    root.style.setProperty('--app-line-height', String(loadedSettings.FONT_SETTINGS.LINE_HEIGHT));
    root.style.setProperty('--app-letter-spacing', loadedSettings.FONT_SETTINGS.LETTER_SPACING + 'px');
    root.style.setProperty('--app-paragraph-gap', loadedSettings.FONT_SETTINGS.PARAGRAPH_GAP + 'px');

    await auto_purge_old_posts();

    await pull_feed_and_refresh_post_data();

    await refresh_app_data();

    is_loading_splashscreen.set(false);
}
