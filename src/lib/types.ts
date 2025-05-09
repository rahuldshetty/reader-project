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
}

export interface FeedMetadataFolder {
    id: number;
    name: string;
    children: FeedMetadata[];
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
