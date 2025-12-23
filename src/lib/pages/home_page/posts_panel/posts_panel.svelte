<script lang="ts">
    import { derived } from "svelte/store";
    import {
        posts_store,
        refreshing_posts,
        active_feed_id,
        is_mobile,
        mobile_active_panel,
    } from "$lib/stores/app_store";
    import Fa from "svelte-fa";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

    import { load_new_posts } from "$lib/pages/home_page/common";
    import PostItem from "./post_item.svelte";
    import LoadingSpinner from "$lib/components/loading_spinner.svelte";
    import PostBar from "./post_bar.svelte";

    let listElement: HTMLDivElement;

    active_feed_id.subscribe((value) => {
        if (listElement) {
            listElement.scrollTop = 0;
        }
    });

    const filtered_posts = derived([posts_store], ([$posts_store]) => {
        return $posts_store;
    });

    const handleScrollEvent = async (
        event: UIEvent & { currentTarget: EventTarget & HTMLDivElement },
    ) => {
        if (listElement) {
            console.log(listElement.clientHeight);
            const scrollTop = listElement.scrollTop;
            const clientHeight = listElement.clientHeight;
            const scrollHeight = listElement.scrollHeight;
            const threshold = 100; // px from bottom

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                await load_new_posts($active_feed_id);
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
                <span>Feeds</span>
            </button>
        </div>
    {/if}
    <PostBar />
    {#if $refreshing_posts}
        <div class="fade-transition">
            <LoadingSpinner messaage="Refreshing posts..." />
        </div>
    {:else}
        <div
            bind:this={listElement}
            onscroll={(e) => handleScrollEvent(e)}
            class="overflow-auto overflow-x-hidden fade-transition"
        >
            <ul class="menu gap-2 bg-base-100 rounded-box">
                {#each $filtered_posts as post}
                    <PostItem {post} />
                {/each}
            </ul>
        </div>
    {/if}
</div>
