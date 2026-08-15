<script lang="ts">
    import type { FeedResult, Feed } from "$lib/types";
    import FeedEditButton from "./feed_edit_button.svelte";

    import { active_feed_id } from "$lib/stores/app_store";
    import { FEED_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolder } from "@fortawesome/free-solid-svg-icons";
    import { select_feed } from "$lib/pages/home_page/common";
    import FeedCounterBadge from "./feed_counter_badge.svelte";

    const { feed }: { feed: FeedResult | Feed } = $props();

    const handleFeedSelect = () => {
        void select_feed(feed.id);
    };
</script>

{#if feed.type == FEED_TYPE.FOLDER}
    <!-- TODO: Handle selection of folders  -->
    <summary class="flex m-0.5" onclick={handleFeedSelect}>
        <Fa icon={faFolder} size="lg" />
        <div class="grow">
            <div class="max-w-24 truncate">{feed.title}</div>
        </div>
        <FeedEditButton {feed} />
    </summary>
{:else}
    <li data-feed-id={feed.id} onclick={handleFeedSelect}>
        <div class="m-0.5 {$active_feed_id == feed.id ? 'menu-active' : ''}">
            {#if feed.favicon}
                <img
                    class="w-6 h-6 object-cover"
                    src={feed.favicon}
                    alt={feed.title}
                />
            {/if}
            <span class="truncate">{feed.title}</span>
            <FeedCounterBadge id={feed.id} />
            <FeedEditButton {feed} />
        </div>
    </li>
{/if}
