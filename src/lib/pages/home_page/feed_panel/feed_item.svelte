<script lang="ts">
    import type { FeedResult, Feed } from "$lib/types";
    import FeedEditButton from "./feed_edit_button.svelte";

    import {
        active_feed_id,
        active_feed_name,
        is_mobile,
        mobile_active_panel,
    } from "$lib/stores/app_store";
    import { FEED_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolder } from "@fortawesome/free-solid-svg-icons";
    import {
        check_and_pull_latest_feed_data,
        refresh_posts,
    } from "$lib/pages/home_page/common";
    import FeedCounterBadge from "./feed_counter_badge.svelte";

    const { feed }: { feed: FeedResult | Feed } = $props();

    const handleFeedSelect = async () => {
        // On mobile, always navigate to posts panel (even if same feed)
        // but skip data refresh if same feed to avoid unnecessary API calls
        const isSameFeed = $active_feed_id == feed.id;

        if (!isSameFeed) {
            $active_feed_id = feed.id;
            $active_feed_name = feed.title;

            if (feed.type == FEED_TYPE.FEED) {
                // Check and try to pull latest post from RSS feed
                await check_and_pull_latest_feed_data(feed.id, feed.url);

                // Pull latest post feeds from DB
                await refresh_posts(feed.id);
            }
        }

        // Navigate to posts panel on mobile (always, even if same feed)
        if ($is_mobile) {
            mobile_active_panel.set("posts");
        }
        // TODO: User settings option - switching feeds removes content
        // $active_post_id = -1;
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
    <li onclick={handleFeedSelect}>
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
