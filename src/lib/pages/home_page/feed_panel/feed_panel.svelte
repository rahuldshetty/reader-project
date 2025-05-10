<script lang="ts">
    import { derived } from "svelte/store";

    import { collapse_sidebar, feeds_store } from "$lib/stores/app_store";
    import FeedBar from "./feed_bar.svelte";
    import FeedParent from './feed_parent.svelte';

    const filtered_feeds = derived([feeds_store], ([$feeds_store])=>{
        return $feeds_store;
    });
</script>


{#if !$collapse_sidebar}
    <div
        class="flex flex-col w-48 sm:w-64 bg-base-100 border-r border-base-300"
    >
        <FeedBar />

        <!-- Feed List -->
        <ul class="menu menu-md overflow-y-auto overflow-x-hidden rounded-box w-full h-full">
            <div>
                {#each $filtered_feeds as feed}
                    <FeedParent feed={feed}/>
                {/each}
            </div>
        </ul>
    </div>
{/if}
