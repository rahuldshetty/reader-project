<script lang="ts">
    import type { FeedResult, Feed } from "$lib/types";
    import FeedEditButton from "./feed_edit_button.svelte";

    import { active_feed_id, is_mobile } from "$lib/stores/app_store";
    import { FEED_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolder, faRss } from "@fortawesome/free-solid-svg-icons";
    import { select_feed } from "$lib/pages/home_page/common";
    import FeedCounterBadge from "./feed_counter_badge.svelte";

    const { feed }: { feed: FeedResult | Feed } = $props();

    const handleFeedSelect = () => {
        void select_feed(feed.id);
    };
</script>

{#if feed.type == FEED_TYPE.FOLDER}
    <!-- TODO: Handle selection of folders  -->
    <summary
        class="m-0.5 flex max-md:min-h-12 max-md:items-center max-md:gap-3 max-md:rounded-xl max-md:px-3"
        onclick={handleFeedSelect}
    >
        <Fa icon={faFolder} size="lg" class="max-md:hidden" />
        <span
            class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/70 max-md:flex"
        >
            <Fa icon={faFolder} size="lg" />
        </span>
        <div class="grow">
            <div class="max-w-24 truncate max-md:max-w-44 max-md:font-medium">
                {feed.title}
            </div>
        </div>
        <FeedEditButton {feed} />
    </summary>
{:else}
    <li data-feed-id={feed.id} onclick={handleFeedSelect}>
        <div
            class="m-0.5 {$active_feed_id == feed.id && !$is_mobile
                ? 'menu-active'
                : ''} {$active_feed_id == feed.id && $is_mobile
                ? 'bg-primary/10 font-medium text-primary'
                : ''} max-md:flex max-md:min-h-12 max-md:items-center max-md:gap-3 max-md:rounded-xl max-md:px-3"
        >
            {#if feed.favicon}
                <img
                    class="h-6 w-6 object-cover max-md:h-8 max-md:w-8 max-md:rounded-lg max-md:bg-base-200 max-md:p-1"
                    src={feed.favicon}
                    alt=""
                />
            {:else}
                <span
                    class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/55 max-md:flex"
                >
                    <Fa icon={faRss} size="sm" />
                </span>
            {/if}
            <span class="truncate max-md:font-medium">{feed.title}</span>
            <FeedCounterBadge id={feed.id} />
            <FeedEditButton {feed} />
        </div>
    </li>
{/if}
