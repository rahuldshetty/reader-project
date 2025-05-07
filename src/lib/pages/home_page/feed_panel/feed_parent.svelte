<script lang="ts">
    import type { FeedResult } from "$lib/types";
    import FeedItem from "./feed_item.svelte";

    const { feed }: { feed: FeedResult } = $props();
</script>

<!-- If feed doesn't contain children -->
{#if feed.children.length == 0}
    <FeedItem favicon={feed.favicon} title={feed.title} id={feed.id} type={feed.type}/>
{:else}
    <!-- Feed is a folder with children -->
    <li>
        <details>
            <!-- Folder -->
            <FeedItem favicon={feed.favicon} title={feed.title} id={feed.id} type={feed.type}/>
            <ul>
                {#each feed.children as child}
                    <!-- Children Feed Item -->
                    <FeedItem favicon={child.favicon} title={child.title} id={child.id} type={child.type}/>
                {/each}
            </ul>
        </details>
    </li>
{/if}
