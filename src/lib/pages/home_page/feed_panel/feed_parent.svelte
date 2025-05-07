<script lang="ts">
    import type { FeedResult } from "$lib/types";

    import Fa from "svelte-fa";
    import { faFolder } from "@fortawesome/free-solid-svg-icons";
    import FeedItem from "./feed_item.svelte";
    import FeedEditButton from "./feed_edit_button.svelte";

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
            <summary class="p-2">
                <Fa icon={faFolder} size="lg" />
                {feed.title}
                <FeedEditButton title={feed.title} id={feed.id} type={feed.type}/>
            </summary>
            <ul>
                {#each feed.children as child}
                    <!-- Children Feed Item -->
                    <FeedItem favicon={child.favicon} title={child.title} id={child.id} type={child.type}/>
                {/each}
            </ul>
        </details>
    </li>
{/if}
