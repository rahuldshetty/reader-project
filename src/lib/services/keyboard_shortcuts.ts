import { openUrl } from "@tauri-apps/plugin-opener";
import { get } from "svelte/store";

import {
    active_feed_id,
    active_modal,
    active_post_id,
    cursor_post_id,
    is_mobile,
    local_user_setting,
    posts_store,
    feeds_store,
} from "$lib/stores/app_store";
import {
    DEFAULT_SHORTCUT_BINDINGS,
    DEFAULT_SHORTCUTS,
    FEED_TYPE,
    MODAL_TYPE,
    SHORTCUT_ACTION,
} from "$lib/constants";
import type { ShortcutBindings, ShortcutBinding, ShortcutSettings } from "$lib/types";
import { mark_post_as_fav, mark_post_as_read } from "$lib/dao/post_db";
import {
    select_feed,
    select_post,
    update_post_feed_counter_value,
    update_post_store_item_by_id,
} from "$lib/pages/home_page/common";
import type { Feed, FeedResult, PostResult } from "$lib/types";

// ---------------------------------------------------------------------------
// Settings access
// ---------------------------------------------------------------------------

export const get_shortcut_settings = (): ShortcutSettings => {
    const stored = get(local_user_setting).SHORTCUTS;
    if (!stored) {
        return DEFAULT_SHORTCUTS;
    }
    return {
        ENABLED: stored.ENABLED,
        BINDINGS: { ...DEFAULT_SHORTCUT_BINDINGS, ...stored.BINDINGS },
    };
};

export const is_shortcuts_enabled = (): boolean => get_shortcut_settings().ENABLED;

export const get_binding = (action: SHORTCUT_ACTION): ShortcutBinding =>
    get_shortcut_settings().BINDINGS[action] ?? DEFAULT_SHORTCUT_BINDINGS[action];

// Human-readable hint ("Ctrl+Shift+J"); empty string when the feature is off
// so the UI can hide shortcut hints entirely.
export const get_binding_label = (action: SHORTCUT_ACTION): string =>
    is_shortcuts_enabled() ? format_binding(get_binding(action)) : "";

// ---------------------------------------------------------------------------
// Binding helpers
// ---------------------------------------------------------------------------

const display_key = (key: string, shift: boolean): string => {
    // "?" is produced by Shift+/ on most layouts; showing Shift+/ is clearer.
    if (shift && key.toLowerCase() === "?") return "/";
    if (key.length === 1) return key.toUpperCase();
    return key.charAt(0).toUpperCase() + key.slice(1);
};

export const format_binding = (binding: ShortcutBinding): string => {
    const parts: string[] = [];
    if (binding.ctrl) parts.push("Ctrl");
    if (binding.alt) parts.push("Alt");
    if (binding.shift) parts.push("Shift");
    parts.push(display_key(binding.key, binding.shift));
    return parts.join("+");
};

export const find_action_for_event = (
    event: KeyboardEvent,
    bindings: ShortcutBindings,
): SHORTCUT_ACTION | null => {
    for (const action of Object.keys(bindings)) {
        const binding = bindings[action];
        if (
            binding.ctrl !== event.ctrlKey ||
            binding.alt !== event.altKey ||
            binding.shift !== event.shiftKey
        ) {
            continue;
        }
        if (binding.key.toLowerCase() === event.key.toLowerCase()) {
            return action as SHORTCUT_ACTION;
        }
    }
    return null;
};

// Returns pairs of action names that share the same key combination.
export const find_conflicts = (bindings: ShortcutBindings): [string, string][] => {
    const seen = new Map<string, string>();
    const conflicts: [string, string][] = [];
    for (const [action, binding] of Object.entries(bindings)) {
        const signature =
            `${binding.ctrl ? "C" : ""}${binding.alt ? "A" : ""}` +
            `${binding.shift ? "S" : ""}|${binding.key.toLowerCase()}`;
        const previous = seen.get(signature);
        if (previous) {
            conflicts.push([previous, action]);
        } else {
            seen.set(signature, action);
        }
    }
    return conflicts;
};

// ---------------------------------------------------------------------------
// Recording (used by the settings modal to remap a shortcut)
// ---------------------------------------------------------------------------

let recording_action: SHORTCUT_ACTION | null = null;

export const is_recording = (): boolean => recording_action !== null;

export const set_recording_action = (action: SHORTCUT_ACTION | null) => {
    recording_action = action;
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

const get_target_post = (): PostResult | null => {
    const posts = get(posts_store);
    const id = get(active_post_id) !== -1 ? get(active_post_id) : get(cursor_post_id);
    return posts.find((post) => post.id === id) ?? null;
};

const move_cursor = (direction: 1 | -1) => {
    const posts = get(posts_store);
    if (posts.length === 0) return;

    const active = get(active_post_id);
    const base_id = active !== -1 ? active : get(cursor_post_id);
    let index = posts.findIndex((post) => post.id === base_id);
    // Cursor before the list or stale: start at the first/last post.
    if (index === -1) index = direction === 1 ? -1 : posts.length;

    const target_index = index + direction;
    if (target_index < 0 || target_index >= posts.length) return;

    const target = posts[target_index];
    if (active !== -1) {
        // Reading a post: j/k moves to the next/previous article.
        void select_post(target);
    } else {
        cursor_post_id.set(target.id);
        document
            .querySelector(`[data-post-id="${target.id}"]`)
            ?.scrollIntoView({ block: "nearest" });
    }
};

const toggle_read = async (post: PostResult) => {
    const read_status = !post.read;
    await mark_post_as_read(post.id, read_status);
    update_post_feed_counter_value(post.feed_id, read_status ? -1 : 1);
    update_post_store_item_by_id(post.id, { ...post, read: read_status });
};

const toggle_fav = async (post: PostResult) => {
    const fav_status = !post.is_fav;
    await mark_post_as_fav(post.id, fav_status);
    update_post_store_item_by_id(post.id, { ...post, is_fav: fav_status });
};

const focus_search = () => {
    if (get(is_mobile)) return; // search box is desktop-only
    document.getElementById("feed-search-input")?.focus();
};

// Flat, visually-ordered list of keyboard-selectable feeds: All Posts (-1),
// Favourites (-2), then every real feed in tree order (folders are skipped).
const flat_feed_ids = (): number[] => {
    const ids: number[] = [-1, -2];
    const walk = (feeds: Feed[] | FeedResult[]) => {
        for (const feed of feeds) {
            if (feed.type == FEED_TYPE.FEED) {
                ids.push(feed.id);
            } else if (feed.type == FEED_TYPE.FOLDER && "children" in feed) {
                walk(feed.children);
            }
        }
    };
    walk(get(feeds_store));
    return ids;
};

// Tab / Shift+Tab: activate the next/previous feed, mirroring a click on it.
const move_feed = (direction: 1 | -1) => {
    const ids = flat_feed_ids();
    if (ids.length === 0) return;

    let index = ids.indexOf(get(active_feed_id));
    // No feed selected or selection not in the list: start at the ends.
    if (index === -1) index = direction === 1 ? -1 : ids.length;

    const target_index = index + direction;
    if (target_index < 0 || target_index >= ids.length) return;

    const target_id = ids[target_index];
    void select_feed(target_id);
    document
        .querySelector(`[data-feed-id="${target_id}"]`)
        ?.scrollIntoView({ block: "nearest" });
};

const run_action = (action: SHORTCUT_ACTION) => {
    switch (action) {
        case SHORTCUT_ACTION.NEXT_POST:
            move_cursor(1);
            break;
        case SHORTCUT_ACTION.PREV_POST:
            move_cursor(-1);
            break;
        case SHORTCUT_ACTION.OPEN_POST: {
            const target = get_target_post();
            if (target) void select_post(target);
            break;
        }
        case SHORTCUT_ACTION.MARK_READ: {
            const target = get_target_post();
            if (target) void toggle_read(target);
            break;
        }
        case SHORTCUT_ACTION.MARK_FAV: {
            const target = get_target_post();
            if (target) void toggle_fav(target);
            break;
        }
        case SHORTCUT_ACTION.OPEN_ORIGINAL: {
            const target = get_target_post();
            if (target) void openUrl(target.link);
            break;
        }
        case SHORTCUT_ACTION.FOCUS_SEARCH:
            focus_search();
            break;
        case SHORTCUT_ACTION.NEXT_FEED:
            move_feed(1);
            break;
        case SHORTCUT_ACTION.PREV_FEED:
            move_feed(-1);
            break;
    }
};

// ---------------------------------------------------------------------------
// Global keydown handler
// ---------------------------------------------------------------------------

export const handle_keydown = (event: KeyboardEvent) => {
    // The settings modal captures its own keys while remapping.
    if (is_recording()) return;
    if (event.isComposing) return;
    if (get(active_modal) !== MODAL_TYPE.NONE) return;
    if (!is_shortcuts_enabled()) return;

    const target = event.target as HTMLElement | null;
    if (
        target &&
        (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "SELECT" ||
            target.isContentEditable)
    ) {
        return;
    }

    const action = find_action_for_event(event, get_shortcut_settings().BINDINGS);
    if (!action) return;

    event.preventDefault();
    run_action(action);
};
