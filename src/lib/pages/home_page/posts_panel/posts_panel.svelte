<script lang="ts">
    import { derived } from "svelte/store";
    import {
        posts_store,
        refreshing_posts,
        active_feed_id,
        active_feed_name,
        active_folder_feed_ids,
        filter_unread_posts,
        is_mobile,
        search_keywords,
    } from "$lib/stores/app_store";
    import type { PostResult } from "$lib/types";
    import Fa from "svelte-fa";
    import { faInbox } from "@fortawesome/free-solid-svg-icons";

    import { load_new_posts } from "$lib/pages/home_page/common";
    import { dateGroupLabel } from "$lib/utils/time";
    import PostItem from "./post_item.svelte";
    import LoadingSpinner from "$lib/components/loading_spinner.svelte";
    import PostBar from "./post_bar.svelte";
    import MobileTopBar from "$lib/components/mobile_top_bar.svelte";
    import { t } from "$lib/i18n";

    const header_title = $derived(
        $active_feed_name ||
            ($active_feed_id === -1
                ? $t("nav.all_posts")
                : $active_feed_id === -2
                  ? $t("nav.my_favourites")
                  : $t("nav.posts")),
    );

    let listElement: HTMLDivElement;

    active_feed_id.subscribe(() => {
        if (listElement) {
            listElement.scrollTop = 0;
        }
    });

    const empty_title = $derived(
        $search_keywords.length > 0
            ? $t("posts.empty.search")
            : $filter_unread_posts
              ? $t("posts.empty.unread")
              : $t("posts.empty"),
    );
    const empty_hint = $derived(
        $search_keywords.length > 0 || $filter_unread_posts
            ? $t("posts.empty.filters")
            : $t("posts.empty.hint"),
    );

    const grouped_posts = derived([posts_store, t], ([$posts_store, $t]) => {
        const groups: { label: string; posts: PostResult[] }[] = [];
        let currentLabel = "";
        for (const post of $posts_store) {
            const label = dateGroupLabel(post.pubDate, $t);
            if (label !== currentLabel) {
                currentLabel = label;
                groups.push({ label, posts: [post] });
            } else {
                groups[groups.length - 1].posts.push(post);
            }
        }
        return groups;
    });

    const handleScrollEvent = async (
        event: UIEvent & { currentTarget: EventTarget & HTMLDivElement },
    ) => {
        if (listElement) {
            const scrollTop = listElement.scrollTop;
            const clientHeight = listElement.clientHeight;
            const scrollHeight = listElement.scrollHeight;
            const threshold = 100; // px from bottom

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                await load_new_posts(
                    $active_feed_id,
                    null,
                    undefined,
                    null,
                    $active_folder_feed_ids,
                );
            }
        }
    };
</script>

<div
    class="flex h-full w-full flex-col border-base-300 bg-base-100 animate-fade-in {$is_mobile
        ? ''
        : 'md:w-80 md:min-w-[280px] md:max-w-[400px] md:border-r'}"
>
    {#if $is_mobile}
        <MobileTopBar />
        <div class="flex shrink-0 items-center gap-2 px-4 pb-1 pt-2">
            <h1 class="min-w-0 flex-1 truncate text-xl font-bold tracking-tight">
                {header_title}
            </h1>
            <PostBar />
        </div>
    {:else}
        <PostBar />
    {/if}
    {#if $refreshing_posts}
        <div class="fade-transition">
            <LoadingSpinner messaage={$t("posts.refreshing")} />
        </div>
    {:else}
        <div
            bind:this={listElement}
            onscroll={(e) => handleScrollEvent(e)}
            class="min-h-0 flex-1 {$is_mobile
                ? 'mobile-scroll'
                : ''} overflow-auto overflow-x-hidden fade-transition"
        >
            {#if $grouped_posts.length === 0}
                <div
                    class="flex h-full flex-col items-center justify-center gap-2 px-6 py-20 text-center text-base-content/45"
                >
                    <Fa icon={faInbox} size="3x" />
                    <p class="text-base font-medium text-base-content/70">
                        {empty_title}
                    </p>
                    <p class="text-sm">{empty_hint}</p>
                </div>
            {:else}
            <ul
                class="list-none rounded-box bg-base-100 {$is_mobile
                    ? 'flex flex-col gap-2 px-3 pb-24 pt-2'
                    : 'menu gap-1'}"
            >
                {#each $grouped_posts as group}
                    <li
                        class={$is_mobile
                            ? "sticky top-0 z-10 bg-base-100/95 px-1 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-base-content/50 select-none backdrop-blur"
                            : "menu-title px-3 pt-4 pb-1 text-xs uppercase tracking-wide text-base-content/50 select-none"}
                    >
                        {group.label}
                    </li>
                    {#each group.posts as post}
                        <PostItem {post} />
                    {/each}
                {/each}
            </ul>
            {/if}
        </div>
    {/if}
</div>
