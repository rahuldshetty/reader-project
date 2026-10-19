<script lang="ts">
    import { derived } from "svelte/store";

    import {
        collapse_sidebar,
        feeds_store,
        refreshing_feeds,
    } from "$lib/stores/app_store";
    import FeedBar from "./feed_bar.svelte";
    import FeedParent from "./feed_parent.svelte";
    import CustomFeedItems from "./custom_feed_items.svelte";
    import LoadingSpinner from "$lib/components/loading_spinner.svelte";
    import { t } from "$lib/i18n";

    const filtered_feeds = derived([feeds_store], ([$feeds_store]) => {
        return $feeds_store;
    });
</script>

{#if !$collapse_sidebar}
    <div
        class="flex h-full w-full flex-col border-base-300 bg-base-100 animate-slide-in-left md:w-64 md:min-w-[200px] md:max-w-[300px] md:border-r"
    >
        <FeedBar />

        {#if $refreshing_feeds}
            <div class="fade-transition">
                <LoadingSpinner messaage={$t("feed.refreshing")} />
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
