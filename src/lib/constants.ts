export const FEED_URL2ICON_MAP = {
    "www.nytimes.com": ""
}

export const DB_PATH = "sqlite:reader.db"

export enum DB_ORDER_ENUM { NEWEST = "DESC", OLDEST = "ASC" }

export enum MODAL_TYPE { 
    NONE, 
    ABOUT,
    ADD, 
    UPDATE, 
    SETTINGS, 
    TRANSLATE, 
    OPML_IMPORT,
    
    MARK_READ,
    DELETE_FEED,
    ADD_FOLDER,
}

export enum SCREEN {
    FEEDS,
    HOME
}

export enum SETTINGS {
    LAST_REFRESH_TIME = "LAST_REFRESH_TIME",
    THEME_MODE = "THEME_MODE",

    // Posts to clear from DB if they have passed this time
    ENABLE_AUTO_PURGE = "ENABLE_AUTO_PURGE",
    POST_EXPIRY_TIME = "POST_EXPIRY_TIME",
    CURRENT_FEED_VIEW = "CURRENT_FEED_VIEW",
    REFRESH_FEED_ON_SELECT = "REFRESH_FEED_ON_SELECT",
    ENABLE_INSECURE_LINK = "ENABLE_INSECURE_LINK",
    AUTO_READ_ON_SELECT = "AUTO_READ_ON_SELECT",
    REFRESH_ALL_FEED_ON_LAUNCH = "REFRESH_ALL_FEED_ON_LAUNCH",
    MINIMIZE_APP = "MINIMIZE_APP",

    // Home Panel Settings
    LONGITUDE = "LONGITUDE",
    LATITUDE = "LATITUDE",

    OPENAI_URL = "OPENAI_URL",
    OPENAI_MODEL = "OPENAI_MODEL",
    OPENAI_TOKEN = "OPENAI_TOKEN"
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
export const ENABLE_AUTO_PURGE = true;

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
    "forest",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "halloween",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "cmyk",
    "autumn",
    "dim",
    "nord",
    "silk"
]
export const DEFAULT_DAISY_THEME = "default";
export const REFRESH_FEED_ON_SELECT = true;
export const ENABLE_INSECURE_LINK = false;
export const AUTO_READ_ON_SELECT = false;
export const REFRESH_ALL_FEED_ON_LAUNCH = false;
export const MINIMIZE_APP = false;

export const LONGITUDE = 30.0444
export const LATITUDE = 31.2357

export const NO_FEED_SELECTED = -1000;
export const ROOT_PARENT_FEED_ID = -1;

export enum FEED_URL_CONTENT_TYPE {
    XML,
    WEBSITE
}

export enum TOAST_MESSAGE_TYPE {
    SUCCESS = "success",
    WARNING = "warning",
    INFO = "info",
    ERROR = "error"
}