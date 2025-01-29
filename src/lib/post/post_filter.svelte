<script>
    import { DB_ORDER_ENUM } from "$lib/constants";
    import {
        posts_by_feed_store,
        selected_feed_id,
        posts_sort_by,
        feed_unread_post_count,
    } from "$lib/store";
    import { fetch_posts, fetch_unread_post_counts } from "$lib/db";

    const sortPosts = async () => {
        $posts_sort_by =
        $posts_sort_by === DB_ORDER_ENUM.NEWEST
            ? DB_ORDER_ENUM.OLDEST
            : DB_ORDER_ENUM.NEWEST;
        const posts = await fetch_posts($posts_sort_by, null, $selected_feed_id);
        $posts_by_feed_store[$selected_feed_id] = posts;
        $feed_unread_post_count = await fetch_unread_post_counts();
    };
</script>


<div class="shrink border-br p-2">
    <button
        class="text-text2 font-semibold flex flex-row gap-2 justify-center items-center"
        on:click={sortPosts}
    >
        {#if $posts_sort_by === DB_ORDER_ENUM.NEWEST}
        <!-- Down Arrow -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
        >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
        </svg>
        {:else}
        <!-- Up Arrow -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
        >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
            />
        </svg>
        {/if}
        {$posts_sort_by === DB_ORDER_ENUM.OLDEST ? "Oldest" : "Newest"}
    </button>
</div>