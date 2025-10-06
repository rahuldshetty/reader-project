import { CONTENT_TYPES, FEED_TYPE, TOAST_MESSAGE_TYPE } from "$lib/constants";

export interface UserSettings {
    LAST_REFRESH_TIME: number;
    THEME_MODE: string;
    MINIMIZE_APP: boolean;
    CURRENT_FEED_VIEW: string;
    REFRESH_FEED_ON_SELECT: boolean;
    ENABLE_INSECURE_LINK: boolean;
    AUTO_READ_ON_SELECT: boolean;
    REFRESH_ALL_FEED_ON_LAUNCH: boolean;

    ENABLE_AUTO_PURGE: boolean;
    POST_EXPIRY_TIME: number;

    LONGITUDE: number;
    LATITUDE: number;

    LLM_ENABLE: boolean;
    OPENAI_URL: string;
    OPENAI_MODEL: string;
    OPENAI_TOKEN: string;
}

export interface ToastMessage {
    id: string;
    type: TOAST_MESSAGE_TYPE;
    message: string;
    duration: number;
}

export interface Feed {
    id: number;
    title: string;
    url: string;
    favicon: string | null;
    last_refresh_time: string | null;
    type: number;
    parent: number;
    refresh_on_load: boolean;
}

export interface FeedResult {
    id: number;
    title: string;
    url: string;
    favicon: string | null;
    last_refresh_time: string | null;
    type: number;
    parent: number;
    refresh_on_load: boolean;
    children: Feed[];

    // UI-related state 
    if_folder_open: boolean; 
}

export interface FeedMetric {
    id: number;
    total: number;
    read: number;
    posts_per_day: number;
    last_refreshed: string;
}

export interface Post {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    image: string;
}

export interface FeedMetadata {
    id: number;
    name: string;
    icon: string;
    posts: Post[];
    url: string;
    type: FEED_TYPE;
}

export interface FeedMetadataFolder {
    id: number;
    name: string;
    children: FeedMetadata[];
    type: FEED_TYPE;
}


export interface PostResult {
    id: number;
    feed_id: number;
    title: string;
    link: string;
    pubDate: string;
    read: boolean;
    is_fav: boolean;
    image: string;
    content: string;
    word_count: number
}

export interface ContentResult {
    title: string;
    content: string | ArrayBuffer;
    word_count: number;
    url: string;
    image: string;
    content_type: CONTENT_TYPES;
}

export type FeedUnreadCounter = Record<number, number>;
