<script lang="ts">
    import { derived } from "svelte/store";

    import {
        collapse_sidebar,
        feeds_store,
        refreshing_feeds,
        is_mobile,
    } from "$lib/stores/app_store";
    import FeedBar from "./feed_bar.svelte";
    import FeedParent from "./feed_parent.svelte";
    import CustomFeedItems from "./custom_feed_items.svelte";
    import LoadingSpinner from "$lib/components/loading_spinner.svelte";

    const filtered_feeds = derived([feeds_store], ([$feeds_store]) => {
        return $feeds_store;
    });
</script>

{#if !$collapse_sidebar || $is_mobile}
    <div
        class="flex flex-col w-full md:w-64 md:min-w-[200px] md:max-w-[300px] h-full bg-base-100 md:border-r border-base-300 animate-slide-in-left"
    >
        <FeedBar />

        {#if $refreshing_feeds}
            <div class="fade-transition">
                <LoadingSpinner messaage="Refreshing feed..." />
            </div>
        {:else}
            <!-- Feed List -->
            <ul
                class="menu menu-md overflow-y-auto overflow-x-hidden rounded-box w-full h-full fade-transition"
            >
                <div>
                    <CustomFeedItems />
                    {#each $filtered_feeds as feed}
                        <FeedParent {feed} />
                    {/each}
                </div>
            </ul>
        {/if}
    </div>
{/if}
