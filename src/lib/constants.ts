export const FEED_URL2ICON_MAP = {
    "www.nytimes.com": ""
}

export const DB_PATH = "sqlite:reader.db"

export enum DB_ORDER_ENUM { NEWEST = "DESC", OLDEST = "ASC" }

export enum MODAL_TYPE { NONE, ADD, UPDATE, SETTINGS, TRANSLATE, OPML_IMPORT }

export enum SETTINGS {
    LAST_REFRESH_TIME = "LAST_REFRESH_TIME",
    THEME_MODE = "THEME_MODE",

    // Posts to clear from DB if they have passed this time
    POST_EXPIRY_TIME = "POST_EXPIRY_TIME",
    CURRENT_FEED_VIEW = "CURRENT_FEED_VIEW",
}

export enum THEMES{
    // Values must match the color configs in tailwind.config.js
    LIGHT = "light",
    DARK = "dark"
}

export enum FEED_VIEW {
    LIST = "list",
    THUMBNAIL = "thumbnail",
}

export enum FEED_TYPE {
    FEED = 0,
    FOLDER = 1,
}

export const NO_OF_POST_PULLS_PER_TIME = 20;

// Measured in Hours
export const LAST_REFRESH_TIME = 4;

// Measured in Days
export const POST_EXPIRY_TIME = 30;

// Content Type displayed in parsed view
export enum CONTENT_TYPES {
    none,
    html,
    pdf
}

// Based on data from https://daisyui.com/docs/themes/
export const DAISY_UI_THEMES = [
    "default",
    "light",
    "dark",
    "retro",
    "cyberpunk",
    "valentine",
    "dracula",
    "coffee",
    "aqua",
    "night",
    "winter",
    "forest"
]
export const DEFAULT_DAISY_THEME = "default";

export const NO_FEED_SELECTED = -1000;

export enum FEED_URL_CONTENT_TYPE {
    XML,
    WEBSITE
}
