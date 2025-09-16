import type { UserSettings } from "$lib/types";
import { user_settings } from "$lib/stores/app_store";
import { 
    DEFAULT_DAISY_THEME, LAST_REFRESH_TIME, POST_EXPIRY_TIME, FEED_VIEW,
    SETTINGS, REFRESH_FEED_ON_SELECT, ENABLE_INSECURE_LINK, AUTO_READ_ON_SELECT,
    REFRESH_ALL_FEED_ON_LAUNCH, ENABLE_AUTO_PURGE,
    MINIMIZE_APP,
    LONGITUDE,
    LATITUDE,
} from "$lib/constants";

export const fetch_latest_user_settings = async () : Promise<UserSettings>  => {
    const refresh_feed_on_select_enable = await user_settings.get(SETTINGS.REFRESH_FEED_ON_SELECT);
    const lrt = await user_settings.get(SETTINGS.LAST_REFRESH_TIME);
    const theme = await user_settings.get(SETTINGS.THEME_MODE);
    const post_expiry_time = await user_settings.get(SETTINGS.POST_EXPIRY_TIME);
    const feed_view = await user_settings.get(SETTINGS.CURRENT_FEED_VIEW);
    const enable_insecure_link = await user_settings.get(SETTINGS.ENABLE_INSECURE_LINK);
    const auto_read_on_select = await user_settings.get(SETTINGS.AUTO_READ_ON_SELECT);
    const refresh_all_feed_on_launch = await user_settings.get(SETTINGS.REFRESH_ALL_FEED_ON_LAUNCH);
    const enable_auto_purge = await user_settings.get(SETTINGS.ENABLE_AUTO_PURGE);
    const minimize_app = await user_settings.get(SETTINGS.MINIMIZE_APP);
    
    const longitude = await user_settings.get(SETTINGS.LONGITUDE);
    const latitude = await user_settings.get(SETTINGS.LATITUDE);
    
    return {
        "LAST_REFRESH_TIME":  lrt as number ?? LAST_REFRESH_TIME,
        "THEME_MODE": theme as string ?? DEFAULT_DAISY_THEME,
        "POST_EXPIRY_TIME": post_expiry_time as number ?? POST_EXPIRY_TIME,
        "CURRENT_FEED_VIEW": feed_view as string ?? (FEED_VIEW.LIST),
        "REFRESH_FEED_ON_SELECT": refresh_feed_on_select_enable as boolean ?? REFRESH_FEED_ON_SELECT,
        "ENABLE_INSECURE_LINK": enable_insecure_link as boolean ?? ENABLE_INSECURE_LINK,
        "AUTO_READ_ON_SELECT": auto_read_on_select as boolean ?? AUTO_READ_ON_SELECT,
        "REFRESH_ALL_FEED_ON_LAUNCH": refresh_all_feed_on_launch as boolean?? REFRESH_ALL_FEED_ON_LAUNCH,
        "ENABLE_AUTO_PURGE": enable_auto_purge as boolean ?? ENABLE_AUTO_PURGE,
        "MINIMIZE_APP": minimize_app as boolean ?? MINIMIZE_APP,
        "LONGITUDE": longitude as number ?? LONGITUDE,
        "LATITUDE": latitude as number ?? LATITUDE,
    }
}
