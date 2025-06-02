import type { UserSettings } from "$lib/types";
import { user_settings } from "$lib/stores/app_store";
import { 
    DEFAULT_DAISY_THEME, LAST_REFRESH_TIME, POST_EXPIRY_TIME, FEED_VIEW,
    SETTINGS, REFRESH_FEED_ON_SELECT, ENABLE_INSECURE_LINK, AUTO_READ_ON_SELECT
} from "$lib/constants";

export const fetch_latest_user_settings = async () : Promise<UserSettings>  => {
    const refresh_feed_on_select_enable = await user_settings.get(SETTINGS.REFRESH_FEED_ON_SELECT);
    const lrt = await user_settings.get(SETTINGS.LAST_REFRESH_TIME);
    const theme = await user_settings.get(SETTINGS.THEME_MODE);
    const post_expiry_time = await user_settings.get(SETTINGS.POST_EXPIRY_TIME);
    const feed_view = await user_settings.get(SETTINGS.CURRENT_FEED_VIEW);
    const enable_insecure_link = await user_settings.get(SETTINGS.ENABLE_INSECURE_LINK);
    const auto_read_on_select = await user_settings.get(SETTINGS.AUTO_READ_ON_SELECT);
    
    return {
        "LAST_REFRESH_TIME":  lrt as number ?? LAST_REFRESH_TIME,
        "THEME_MODE": theme as string ?? DEFAULT_DAISY_THEME,
        "POST_EXPIRY_TIME": post_expiry_time as number ?? POST_EXPIRY_TIME,
        "CURRENT_FEED_VIEW": feed_view as string ?? (FEED_VIEW.LIST),
        "REFRESH_FEED_ON_SELECT": refresh_feed_on_select_enable as boolean ?? REFRESH_FEED_ON_SELECT,
        "ENABLE_INSECURE_LINK": enable_insecure_link as boolean ?? ENABLE_INSECURE_LINK,
        "AUTO_READ_ON_SELECT": auto_read_on_select as boolean ?? AUTO_READ_ON_SELECT,
    }
}
