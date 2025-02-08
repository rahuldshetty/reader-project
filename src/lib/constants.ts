export const FEED_URL2ICON_MAP = {
    "www.nytimes.com": ""
}

export const DB_PATH = "sqlite:reader.db"

export enum DB_ORDER_ENUM { NEWEST = "DESC", OLDEST = "ASC" }

export enum SETTINGS {
    LAST_REFRESH_TIME = "LAST_REFRESH_TIME",
    DARK_MODE = "DARK_MODE",

    // Posts to clear from DB if they have passed this time
    POST_EXPIRY_TIME = "POST_EXPIRY_TIME", 
}

export const NO_OF_POST_PULLS_PER_TIME = 20;

// Measured in Hours
export const LAST_REFRESH_TIME = 4;

// Measured in Days
export const POST_EXPIRY_TIME = 3;
