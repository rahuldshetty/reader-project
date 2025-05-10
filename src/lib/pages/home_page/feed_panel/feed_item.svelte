<script lang="ts">
    import type { FeedResult, Feed } from "$lib/types";
    import FeedEditButton from "./feed_edit_button.svelte";

    import { 
        active_feed_id,
        active_feed_name,
        active_post_id,
        posts_infinite_loader,
    } from "$lib/stores/app_store";
    import { FEED_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolder } from "@fortawesome/free-solid-svg-icons";
    import { refresh_posts } from "$lib/pages/home_page/common";

    const { feed }: { feed: FeedResult | Feed } = $props();

    const handleFeedSelect = async () => {
        if(feed.type == FEED_TYPE.FEED){
            await refresh_posts(feed.id);
        } 
        $active_feed_id = feed.id;
        $active_feed_name = feed.title;
        posts_infinite_loader.reset();
        // TODO: User settings option - switching feeds removes content
        // $active_post_id = -1;
    };
</script>

{#if feed.type == FEED_TYPE.FOLDER}
    <!-- TODO: Handle selection of folders  -->
    <summary class="m-0.5" onclick={handleFeedSelect}>
        <Fa icon={faFolder} size="lg" />
        {feed.title}
        <FeedEditButton feed={feed} />
    </summary>
{:else}
    <li onclick={handleFeedSelect}>
        <div class="m-0.5 {$active_feed_id == feed.id ? 'menu-active' : ''}">
            {#if feed.favicon}
                <img class="w-6 h-6 object-cover" src={feed.favicon} alt={feed.title} />
            {/if}
            <span class="truncate">{feed.title}</span>
            <FeedEditButton feed={feed} />
        </div>
    </li>
{/if}
