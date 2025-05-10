import { user_settings } from "$lib/stores/app_store";
import { 
    DEFAULT_DAISY_THEME, LAST_REFRESH_TIME, POST_EXPIRY_TIME, FEED_VIEW,
    SETTINGS, REFRESH_FEED_ON_SELECT
} from "$lib/constants";

export const fetch_latest_user_settings = async () => {
    return {
        "LAST_REFRESH_TIME":  Number(await user_settings.get(SETTINGS.LAST_REFRESH_TIME)) || LAST_REFRESH_TIME,
        "THEME_MODE": String(await user_settings.get(SETTINGS.THEME_MODE)) || DEFAULT_DAISY_THEME,
        "POST_EXPIRY_TIME": Number(await user_settings.get(SETTINGS.POST_EXPIRY_TIME)) || POST_EXPIRY_TIME,
        "CURRENT_FEED_VIEW": String(await user_settings.get(SETTINGS.CURRENT_FEED_VIEW)) || String(FEED_VIEW.LIST),
        "REFRESH_FEED_ON_SELECT": Boolean(await user_settings.get(SETTINGS.REFRESH_FEED_ON_SELECT)) || REFRESH_FEED_ON_SELECT
    }
}
