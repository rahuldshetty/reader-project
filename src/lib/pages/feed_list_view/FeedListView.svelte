<script lang="ts">
    import RssFeed from "$lib/pages/feed_list_view/feed/rss_feed.svelte";
    import PostFeed from "$lib/pages/feed_list_view/post/post_feed.svelte";

    import { selected_post, feed_view } from "$lib/store";
    import { FEED_VIEW } from "$lib/constants";
    import ParserView from "$lib/content_view/parser_view.svelte";
    import "$lib/logging";
    import ThumbnailGridView from "./thumbnail_grid/thumbnail_grid_view.svelte";
</script>

<div
    class="flex h-screen overflow-hidden"
    style="padding-top: var(--titlebar-height);"
>
    <!-- First Column: RSS Feeds -->
    <RssFeed />

    {#if $feed_view == FEED_VIEW.THUMBNAIL}
        <ThumbnailGridView/>
    {:else if $feed_view == FEED_VIEW.LIST}
        <!-- Second Column: News List -->
        <PostFeed />

        <!-- Third Column: Webpage Preview -->
        <div class="w-full bg-background2">
            {#if $selected_post}
                <ParserView
                    link={$selected_post.link}
                    title={$selected_post.title}
                />
            {:else}
                <p class="p-4 text-gray-600">Select a news item to preview</p>
            {/if}
        </div>
    {/if}
</div>
