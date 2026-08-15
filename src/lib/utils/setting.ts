import type { UserSettings } from "$lib/types";
import { user_settings } from "$lib/stores/app_store";
import {
    DEFAULT_DAISY_THEME, LAST_REFRESH_TIME, POST_EXPIRY_TIME, FEED_VIEW,
    SETTINGS, REFRESH_FEED_ON_SELECT, ENABLE_INSECURE_LINK, AUTO_READ_ON_SELECT,
    REFRESH_ALL_FEED_ON_LAUNCH, ENABLE_AUTO_PURGE,
    MINIMIZE_APP,
    LONGITUDE,
    LATITUDE,
    DEFAULT_FONT_FAMILY,
    DEFAULT_FONT_SIZE,
    DEFAULT_LINE_HEIGHT,
    DEFAULT_LETTER_SPACING,
    DEFAULT_PARAGRAPH_GAP,
    DEFAULT_SHORTCUTS,
    SHORTCUT_ACTION,
} from "$lib/constants";

import type { ShortcutSettings } from "$lib/types";

// Stored settings may predate the SHORTCUTS key or a new action, so merge
// persisted bindings over the defaults to keep every action bound. Stale
// entries for removed actions are dropped.
const merge_shortcut_settings = (stored: unknown): ShortcutSettings => {
    if (!stored || typeof stored !== "object") {
        return DEFAULT_SHORTCUTS;
    }
    const partial = stored as Partial<ShortcutSettings>;
    const known_actions = new Set<string>(
        Object.values(SHORTCUT_ACTION) as string[],
    );
    const stored_bindings = Object.fromEntries(
        Object.entries(partial.BINDINGS ?? {}).filter(([action]) =>
            known_actions.has(action),
        ),
    );
    return {
        ENABLED: partial.ENABLED ?? DEFAULT_SHORTCUTS.ENABLED,
        BINDINGS: {
            ...DEFAULT_SHORTCUTS.BINDINGS,
            ...stored_bindings,
        },
    };
};

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

    const llm_enable = await user_settings.get(SETTINGS.LLM_ENABLE);
    const openai_url = await user_settings.get(SETTINGS.OPENAI_URL);
    const openai_model = await user_settings.get(SETTINGS.OPENAI_MODEL);
    const openai_token = await user_settings.get(SETTINGS.OPENAI_TOKEN);

    const font_family = await user_settings.get(SETTINGS.FONT_FAMILY);
    const font_size = await user_settings.get(SETTINGS.FONT_SIZE);
    const line_height = await user_settings.get(SETTINGS.LINE_HEIGHT);
    const letter_spacing = await user_settings.get(SETTINGS.LETTER_SPACING);
    const paragraph_gap = await user_settings.get(SETTINGS.PARAGRAPH_GAP);
    const shortcuts = await user_settings.get(SETTINGS.SHORTCUTS);

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
        "LLM_ENABLE": llm_enable as boolean ?? false,
        "OPENAI_URL": openai_url as string ?? '',
        "OPENAI_MODEL": openai_model as string ?? '',
        "OPENAI_TOKEN": openai_token as string ?? '',
        "FONT_SETTINGS": {
            "FONT_FAMILY": font_family as string ?? DEFAULT_FONT_FAMILY,
            "FONT_SIZE": font_size as number ?? DEFAULT_FONT_SIZE,
            "LINE_HEIGHT": line_height as number ?? DEFAULT_LINE_HEIGHT,
            "LETTER_SPACING": letter_spacing as number ?? DEFAULT_LETTER_SPACING,
            "PARAGRAPH_GAP": paragraph_gap as number ?? DEFAULT_PARAGRAPH_GAP,
        },
        "SHORTCUTS": merge_shortcut_settings(shortcuts),
    }
}
