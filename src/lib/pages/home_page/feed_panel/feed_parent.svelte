<script lang="ts">
    import { FEED_TYPE } from "$lib/constants";
    import type { FeedResult } from "$lib/types";
    import { open_folder_ids } from "$lib/stores/app_store";
    import FeedItem from "./feed_item.svelte";

    const { feed }: { feed: FeedResult } = $props();

    const is_open = $derived($open_folder_ids.has(feed.id));

    const handle_toggle = (event: Event) => {
        const details = event.currentTarget as HTMLDetailsElement;
        open_folder_ids.update((ids) => {
            if (details.open === ids.has(feed.id)) return ids;
            const next = new Set(ids);
            if (details.open) {
                next.add(feed.id);
            } else {
                next.delete(feed.id);
            }
            return next;
        });
    };
</script>

<!-- If its a feed -->
{#if feed.type == FEED_TYPE.FEED}
    <FeedItem feed={feed}/>
{:else}
    <!-- Feed is a folder with children -->
    <li>
        <details
            class="overflow-visible"
            open={is_open}
            ontoggle={handle_toggle}
        >
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
