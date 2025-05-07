export interface UserSettings {
    LAST_REFRESH_TIME: number;
    THEME_MODE: string;
    POST_EXPIRY_TIME: number;
    CURRENT_FEED_VIEW: string;
}

export interface Feed {
    id: number;
    title: string;
    url: string;
    favicon: string | null;
    last_refresh_time: string | null;
    type: number;
    parent: number;
}

export interface FeedResult {
    id: number;
    title: string;
    url: string;
    favicon: string | null;
    last_refresh_time: string | null;
    type: number;
    parent: number;
    children: Feed[];

    // UI-related state 
    if_folder_open: boolean; 
}

