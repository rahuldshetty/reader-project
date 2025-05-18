<script lang="ts">
    import { FEED_TYPE } from "$lib/constants";
    import type { FeedResult } from "$lib/types";
    import FeedItem from "./feed_item.svelte";

    const { feed }: { feed: FeedResult } = $props();
</script>

<!-- If its a feed -->
{#if feed.type == FEED_TYPE.FEED}
    <FeedItem feed={feed}/>
{:else}
    <!-- Feed is a folder with children -->
    <li>
        <details>
            <!-- Folder -->
            <FeedItem feed={feed}/>
            {#if feed.children.length > 0}
                <ul>
                    {#each feed.children as child}
                        <!-- Children Feed Item -->
                        <FeedItem feed={child}/>
                    {/each}
                </ul>
            {/if}
        </details>
    </li>
{/if}
