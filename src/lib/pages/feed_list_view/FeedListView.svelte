<script lang="ts">
    import RssFeed from "$lib/feed/rss_feed.svelte";
    import PostFeed from "$lib/post/post_feed.svelte";

    import { selected_post } from "$lib/store";
    import ParserView from "$lib/content_view/parser_view.svelte";
    import "$lib/logging";
</script>

<div
    class="flex h-screen overflow-hidden"
    style="padding-top: var(--titlebar-height);"
>
    <!-- First Column: RSS Feeds -->
    <RssFeed />

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
</div>
