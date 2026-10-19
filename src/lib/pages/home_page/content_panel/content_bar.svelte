<script lang="ts">
    import { openUrl } from "@tauri-apps/plugin-opener";
    import { writeText } from "@tauri-apps/plugin-clipboard-manager";

    import type { ContentResult, PostResult } from "$lib/types";
    import { timeAgo, timeToRead } from "$lib/utils/time";

    import { toastStore } from "$lib/stores/toast_store";
    import {
        active_post_id,
        active_screen,
        feed_by_id,
        is_mobile,
        mobile_active_panel,
        posts_store,
    } from "$lib/stores/app_store";
    import { get_binding_label } from "$lib/services/keyboard_shortcuts";

    import Fa from "svelte-fa";
    import {
        faArrowLeft,
        faCircleCheck,
        faShareNodes,
        faStar,
        faGlobe,
        faChevronUp,
        faChevronDown,
        faDatabase,
    } from "@fortawesome/free-solid-svg-icons";
    import { mark_post_as_fav, mark_post_as_read } from "$lib/dao/post_db";
    import {
        TOAST_MESSAGE_TYPE,
        SCREEN,
        SHORTCUT_ACTION,
    } from "$lib/constants";
    import {
        update_post_feed_counter_value,
        update_post_store_item_by_id,
    } from "../common";
    import { select_post } from "../common";
    import { t, translate } from "$lib/i18n";

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

    const source = $derived($feed_by_id.get(post.feed_id));

    // Browse opens articles as an overlay; the feeds flow uses panel history.
    const handleBack = () => {
        if ($active_screen === SCREEN.BROWSE) {
            active_post_id.set(-1);
        } else {
            mobile_active_panel.set("posts");
        }
    };

    const handleShareButton = async () => {
        await writeText(post.link);
        toastStore.add(
            TOAST_MESSAGE_TYPE.INFO,
            translate("toast.copied_link"),
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

{#if $is_mobile}
    <div
        class="mobile-appbar sticky top-0 z-50 border-b border-base-300/80 bg-base-100/95 backdrop-blur-xl"
    >
        <div class="flex h-14 items-center gap-0.5 pl-1 pr-2">
            <button
                type="button"
                class="btn btn-ghost btn-circle h-11 w-11 shrink-0"
                onclick={handleBack}
                aria-label={$t("nav.posts")}
            >
                <Fa icon={faArrowLeft} size="lg" />
            </button>

            <div class="min-w-0 flex-1 px-1">
                <div class="flex min-w-0 items-center gap-1.5">
                    {#if source?.favicon}
                        <img
                            src={source.favicon}
                            alt=""
                            class="h-4 w-4 shrink-0 rounded-sm"
                        />
                    {/if}
                    <span class="truncate text-sm font-semibold">
                        {source?.title ?? $t("browse.article")}
                    </span>
                </div>
                <span class="block text-[11px] text-base-content/50">
                    {timeAgo(post.pubDate, $t)}
                </span>
            </div>

            <button
                type="button"
                class="btn btn-ghost btn-circle h-11 w-11"
                onclick={handleShareButton}
                aria-label={$t("content.copy_link")}
            >
                <Fa icon={faShareNodes} size="lg" />
            </button>

            <button
                type="button"
                class="btn btn-ghost btn-circle h-11 w-11"
                onclick={handleFavouriteButton}
                aria-label={$t("content.mark_favorite")}
                aria-pressed={is_fav}
            >
                <Fa
                    icon={faStar}
                    size="lg"
                    color={is_fav ? "var(--color-accent)" : ""}
                />
            </button>

            <button
                type="button"
                class="btn btn-ghost btn-circle h-11 w-11"
                onclick={handleReadButton}
                aria-label={$t("content.mark_as_read")}
                aria-pressed={read_status}
            >
                <Fa
                    icon={faCircleCheck}
                    size="lg"
                    color={read_status ? "var(--color-success)" : ""}
                />
            </button>
        </div>
    </div>

    <div class="border-b border-base-300/80 bg-base-100 px-4 pb-3 pt-3">
        <h1 class="text-xl font-bold leading-snug text-base-content">
            {post.title}
        </h1>

        <div
            class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-base-content/55"
        >
            <span>{$t("content.min_read", { n: timeToRead(data.word_count) })}</span>
            {#if data.from_cache}
                <span
                    class="badge badge-ghost badge-sm gap-1 font-normal"
                    title={$t("content.cached.hint")}
                >
                    <Fa icon={faDatabase} size="xs" />
                    {$t("content.cached")}
                </span>
            {/if}
        </div>

        <div class="mt-3 flex items-center gap-2">
            <button
                type="button"
                class="mobile-chip flex-1 justify-center"
                disabled={!prev_post}
                onclick={handlePrev}
            >
                <Fa icon={faChevronUp} size="sm" />
                <span class="truncate">{$t("content.previous_article")}</span>
            </button>

            <button
                type="button"
                class="mobile-chip flex-1 justify-center"
                disabled={!next_post}
                onclick={handleNext}
            >
                <Fa icon={faChevronDown} size="sm" />
                <span class="truncate">{$t("content.next_article")}</span>
            </button>

            <button
                type="button"
                class="mobile-chip px-3"
                onclick={handleOpenURL}
                aria-label={$t("content.open_in_browser")}
            >
                <Fa icon={faGlobe} size="sm" />
            </button>
        </div>
    </div>
{:else}
<div
    class="sticky top-0 z-50 bg-base-100 border-b border-base-300 flex flex-col md:flex-row md:items-center md:justify-between p-2 px-4 gap-2"
>
    <!-- Title and word count -->
    <div class="flex flex-col">
        <span class="text-lg font-semibold text-base-content md:max-w-3xl">
            {post.title}
        </span>
        <div class="flex flex-wrap items-center gap-2 text-sm">
            <span>
                🕒 <span class="text-base-content/70"
                    >{$t("content.min_read", { n: timeToRead(data.word_count) })}</span
                >
            </span>
            {#if data.from_cache}
                <span
                    class="badge badge-ghost badge-sm gap-1 font-normal"
                    title={$t("content.cached.hint")}
                >
                    <Fa icon={faDatabase} size="xs" />
                    {$t("content.cached")}
                </span>
            {/if}
        </div>
    </div>

    <!-- Action buttons - separate row on mobile -->
    <div class="flex items-center justify-start md:justify-end gap-1">
        <!-- Previous article -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            disabled={!prev_post}
            onclick={handlePrev}
        >
            <Fa icon={faChevronUp} size="lg" title={$t("content.previous_article")} />
        </button>
        <!-- Next article -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            disabled={!next_post}
            onclick={handleNext}
        >
            <Fa icon={faChevronDown} size="lg" title={$t("content.next_article")} />
        </button>
        <!-- Share Button -->
        <button
            class="btn btn-circle btn-ghost btn-sm md:btn-md btn-press smooth-transition"
            onclick={handleShareButton}
        >
            <Fa icon={faShareNodes} size="lg" title={$t("content.copy_link")} />
        </button>

        <!-- Mark Read -->
        <button
            class="btn btn-ghost btn-circle btn-sm md:btn-md btn-press smooth-transition"
            onclick={handleReadButton}
        >
            <Fa
                icon={faCircleCheck}
                size="lg"
                title={read_hint ? `${$t("content.mark_as_read")} (${read_hint})` : $t("content.mark_as_read")}
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
                title={fav_hint ? `${$t("content.mark_favorite")} (${fav_hint})` : $t("content.mark_favorite")}
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
                title={open_hint ? `${$t("content.open_in_browser")} (${open_hint})` : $t("content.open_in_browser")}
            />
        </button>
    </div>
</div>
{/if}
