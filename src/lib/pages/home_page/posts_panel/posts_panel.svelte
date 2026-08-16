<script lang="ts">
    import { derived } from "svelte/store";
    import {
        posts_store,
        refreshing_posts,
        active_feed_id,
        active_folder_feed_ids,
        is_mobile,
        mobile_active_panel,
    } from "$lib/stores/app_store";
    import type { PostResult } from "$lib/types";
    import Fa from "svelte-fa";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

    import { load_new_posts } from "$lib/pages/home_page/common";
    import { dateGroupLabel } from "$lib/utils/time";
    import PostItem from "./post_item.svelte";
    import LoadingSpinner from "$lib/components/loading_spinner.svelte";
    import PostBar from "./post_bar.svelte";
    import { t } from "$lib/i18n";

    let listElement: HTMLDivElement;

    active_feed_id.subscribe(() => {
        if (listElement) {
            listElement.scrollTop = 0;
        }
    });

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
    class="flex flex-col h-full w-full md:w-80 md:min-w-[280px] md:max-w-[400px] bg-base-100 md:border-r border-base-300 animate-fade-in"
>
    <!-- Mobile back button -->
    {#if $is_mobile}
        <div class="flex items-center gap-2 p-2 border-b border-base-300">
            <button
                class="btn btn-ghost btn-sm"
                onclick={() => mobile_active_panel.set("feeds")}
            >
                <Fa icon={faArrowLeft} />
                <span>{$t("nav.feeds")}</span>
            </button>
        </div>
    {/if}
    <PostBar />
    {#if $refreshing_posts}
        <div class="fade-transition">
            <LoadingSpinner messaage={$t("posts.refreshing")} />
        </div>
    {:else}
        <div
            bind:this={listElement}
            onscroll={(e) => handleScrollEvent(e)}
            class="overflow-auto overflow-x-hidden fade-transition"
        >
            <ul class="menu gap-1 bg-base-100 rounded-box">
                {#each $grouped_posts as group}
                    <li
                        class="menu-title px-3 pt-4 pb-1 text-xs uppercase tracking-wide text-base-content/50 select-none"
                    >
                        {group.label}
                    </li>
                    {#each group.posts as post}
                        <PostItem {post} />
                    {/each}
                {/each}
            </ul>
        </div>
    {/if}
</div>
