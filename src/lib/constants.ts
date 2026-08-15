import type { ShortcutBinding } from "./types";

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

    LLM_ENABLE = "LLM_ENABLE",
    OPENAI_URL = "OPENAI_URL",
    OPENAI_MODEL = "OPENAI_MODEL",
    OPENAI_TOKEN = "OPENAI_TOKEN",

    // Font Settings
    FONT_FAMILY = "FONT_FAMILY",
    FONT_SIZE = "FONT_SIZE",
    LINE_HEIGHT = "LINE_HEIGHT",
    LETTER_SPACING = "LETTER_SPACING",
    PARAGRAPH_GAP = "PARAGRAPH_GAP",

    // Keyboard Shortcuts
    SHORTCUTS = "SHORTCUTS",
}

export enum THEMES {
    // Values must match the daisyUI theme names enabled in src/app.css (@plugin "daisyui")
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
export const FONT_FAMILIES = [
    "Roboto",
    "PT Serif",
    "Source Sans 3",
    "Nunito Sans",
    "Georgia",
];

export const DEFAULT_FONT_FAMILY = "Roboto";
export const DEFAULT_FONT_SIZE = 16;
export const DEFAULT_LINE_HEIGHT = 1.6;
export const DEFAULT_LETTER_SPACING = 0;
export const DEFAULT_PARAGRAPH_GAP = 16;

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

// ---------------------------------------------------------------------------
// Keyboard Shortcuts
// ---------------------------------------------------------------------------

// Action names are persisted as keys in the SHORTCUTS setting, so keep the
// string values stable across renames.
export enum SHORTCUT_ACTION {
    NEXT_POST = "NEXT_POST",
    PREV_POST = "PREV_POST",
    OPEN_POST = "OPEN_POST",
    MARK_READ = "MARK_READ",
    MARK_FAV = "MARK_FAV",
    OPEN_ORIGINAL = "OPEN_ORIGINAL",
    FOCUS_SEARCH = "FOCUS_SEARCH",
    NEXT_FEED = "NEXT_FEED",
    PREV_FEED = "PREV_FEED",
}

export interface ShortcutActionMeta {
    label: string;
    description: string;
}

export const SHORTCUT_ACTION_META: Record<SHORTCUT_ACTION, ShortcutActionMeta> = {
    [SHORTCUT_ACTION.NEXT_POST]: {
        label: "Next Post",
        description: "Move to the next post in the list. Opens the next post while reading.",
    },
    [SHORTCUT_ACTION.PREV_POST]: {
        label: "Previous Post",
        description: "Move to the previous post in the list. Opens the previous post while reading.",
    },
    [SHORTCUT_ACTION.OPEN_POST]: {
        label: "Open Post",
        description: "Open the highlighted post.",
    },
    [SHORTCUT_ACTION.MARK_READ]: {
        label: "Mark Read / Unread",
        description: "Toggle read status of the highlighted or open post.",
    },
    [SHORTCUT_ACTION.MARK_FAV]: {
        label: "Mark Favourite",
        description: "Toggle favourite status of the highlighted or open post.",
    },
    [SHORTCUT_ACTION.OPEN_ORIGINAL]: {
        label: "Open Original",
        description: "Open the post link in the default browser.",
    },
    [SHORTCUT_ACTION.FOCUS_SEARCH]: {
        label: "Focus Search",
        description: "Jump to the feed search box.",
    },
    [SHORTCUT_ACTION.NEXT_FEED]: {
        label: "Next Feed",
        description: "Move to and select the next feed in the list.",
    },
    [SHORTCUT_ACTION.PREV_FEED]: {
        label: "Previous Feed",
        description: "Move to and select the previous feed in the list.",
    },
};

// Feature is opt-in; disabled by default.
export const SHORTCUTS_ENABLED_DEFAULT = false;

export const DEFAULT_SHORTCUT_BINDINGS: Record<SHORTCUT_ACTION, ShortcutBinding> = {
    [SHORTCUT_ACTION.NEXT_POST]: { key: "j", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.PREV_POST]: { key: "k", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.OPEN_POST]: { key: "enter", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.MARK_READ]: { key: "m", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.MARK_FAV]: { key: "f", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.OPEN_ORIGINAL]: { key: "o", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.FOCUS_SEARCH]: { key: "/", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.NEXT_FEED]: { key: "tab", ctrl: false, alt: false, shift: false },
    [SHORTCUT_ACTION.PREV_FEED]: { key: "tab", ctrl: false, alt: false, shift: true },
};

export const DEFAULT_SHORTCUTS = {
    ENABLED: SHORTCUTS_ENABLED_DEFAULT,
    BINDINGS: DEFAULT_SHORTCUT_BINDINGS,
};