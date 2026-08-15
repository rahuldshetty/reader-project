<script lang="ts">
    import { openUrl } from "@tauri-apps/plugin-opener";
    import { writeText } from "@tauri-apps/plugin-clipboard-manager";

    import type { ContentResult, PostResult } from "$lib/types";
    import { timeToRead } from "$lib/utils/time";

    import { toastStore } from "$lib/stores/toast_store";
    import { posts_store } from "$lib/stores/app_store";
    import { get_binding_label } from "$lib/services/keyboard_shortcuts";

    import Fa from "svelte-fa";
    import {
        faCircleCheck,
        faShareNodes,
        faStar,
        faGlobe,
        faChevronUp,
        faChevronDown,
    } from "@fortawesome/free-solid-svg-icons";
    import { mark_post_as_fav, mark_post_as_read } from "$lib/dao/post_db";
    import { TOAST_MESSAGE_TYPE, SHORTCUT_ACTION } from "$lib/constants";
    import {
        update_post_feed_counter_value,
        update_post_store_item_by_id,
    } from "../common";
    import { select_post } from "../common";

    const { data, post }: { data: ContentResult; post: PostResult } = $props();

    // Authoritative read/fav state lives in the posts store so keyboard
    // toggles and list updates stay in sync with these buttons.
    const current_post = $derived(
        $posts_store.find((p) => p.id === post.id) ?? post,
    );
    let read_status = $derived(current_post.read);
    let is_fav = $derived(current_post.is_fav);

    const read_hint = $derived(get_binding_label(SHORTCUT_ACTION.MARK_READ));
    const fav_hint = $derived(get_binding_label(SHORTCUT_ACTION.MARK_FAV));
    const open_hint = $derived(get_binding_label(SHORTCUT_ACTION.OPEN_ORIGINAL));

    const handleShareButton = async () => {
        await writeText(post.link);
        toastStore.add(
            TOAST_MESSAGE_TYPE.INFO,
            "Copied link to Clipboard",
            4000,
        );
    };

    const handleReadButton = async () => {
        const new_status = !read_status;
        await mark_post_as_read(post.id, new_status);
        update_post_feed_counter_value(post.feed_id, new_status ? -1 : 1);
        update_post_store_item_by_id(post.id, { ...current_post, read: new_status });
    };

    const handleFavouriteButton = async () => {
        const new_status = !is_fav;
        await mark_post_as_fav(post.id, new_status);
        update_post_store_item_by_id(post.id, { ...current_post, is_fav: new_status });
    };

    const handleOpenURL = async () => {
        await openUrl(post.link);
    };

    // Prev/next within the active posts list (feeds order). Bounded at ends.
    const index = $derived($posts_store.findIndex((p) => p.id === post.id));
    const prev_post = $derived(index > 0 ? $posts_store[index - 1] : null);
    const next_post = $derived(
        index >= 0 && index < $posts_store.length - 1
            ? $posts_store[index + 1]
            : null,
    );
    const handlePrev = () => {
        if (prev_post) void select_post(prev_post);
    };
    const handleNext = () => {
        if (next_post) void select_post(next_post);
    };
</script>

<div
    class="sticky top-0 z-50 bg-base-100 border-b border-base-300 flex flex-col md:flex-row md:items-center md:justify-between p-2 px-4 gap-2"
>
    <!-- Title and word count -->
    <div class="flex flex-col">
        <span class="text-lg font-semibold text-base-content md:max-w-3xl">
            {post.title}
        </span>
        <span class="text-sm">
            🕒 <span class="text-base-content/70"
                >{`${timeToRead(data.word_count)} min read`}</span
            >
        </span>
    </div>

    <!-- Action buttons - separate row on mobile -->
    <div class="flex items-center justify-start md:justify-end gap-1">
        <!-- Previous article -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            disabled={!prev_post}
            onclick={handlePrev}
        >
            <Fa icon={faChevronUp} size="lg" title="Previous article" />
        </button>
        <!-- Next article -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            disabled={!next_post}
            onclick={handleNext}
        >
            <Fa icon={faChevronDown} size="lg" title="Next article" />
        </button>
        <!-- Share Button -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            onclick={handleShareButton}
        >
            <Fa icon={faShareNodes} size="lg" title="Copy link to Clipboard" />
        </button>

        <!-- Mark Read -->
        <button
            class="btn btn-ghost btn-circle btn-sm md:btn-md btn-press smooth-transition"
            onclick={handleReadButton}
        >
            <Fa
                icon={faCircleCheck}
                size="lg"
                title={read_hint ? `Mark as Read (${read_hint})` : "Mark as Read"}
                color={read_status ? "var(--color-success)" : ""}
            />
        </button>

        <!-- Mark Favourite -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            onclick={handleFavouriteButton}
        >
            <Fa
                icon={faStar}
                size="lg"
                title={fav_hint ? `Mark Favorite (${fav_hint})` : "Mark Favorite"}
                color={is_fav ? "var(--color-accent)" : ""}
            />
        </button>

        <!-- Open URL -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            onclick={handleOpenURL}
        >
            <Fa
                icon={faGlobe}
                size="lg"
                title={open_hint ? `Open in browser (${open_hint})` : "Open in browser"}
            />
        </button>
    </div>
</div>
