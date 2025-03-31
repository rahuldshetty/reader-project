<script>
    import { DB_ORDER_ENUM, NO_OF_POST_PULLS_PER_TIME, FEED_VIEW } from "$lib/constants";
    import {
        feeds_store,
        posts_by_feed_store,
        selected_feed_id,
        posts_sort_by,
        feed_unread_post_count,
        unread_posts_only,
        is_loading_posts,
        feed_view
    } from "$lib/store";
    import { fetch_posts, fetch_unread_post_counts } from "$lib/db";

    import Fa from "svelte-fa";
    import { faGrip } from "@fortawesome/free-solid-svg-icons";

    const sortPosts = async () => {
        $is_loading_posts = true;
        
        $posts_sort_by =
            $posts_sort_by === DB_ORDER_ENUM.NEWEST
                ? DB_ORDER_ENUM.OLDEST
                : DB_ORDER_ENUM.NEWEST;
        const posts = await fetch_posts(
            $posts_sort_by,
            null,
            $selected_feed_id,
            0,
            NO_OF_POST_PULLS_PER_TIME,
            $unread_posts_only
        );

        if($selected_feed_id != -1){
            // Sorting a selected feed
            $posts_by_feed_store[$selected_feed_id] = posts;
        } else {
            // Sorting "all feeds"
            
            let posts_to_be_updated = {}
            
            for(const feed of $feeds_store){
                posts_to_be_updated[feed.id] = [];
            }

            posts.forEach((post)=>{
                posts_to_be_updated[post.feed_id].push({
                    ...post,
                    rowid: posts_to_be_updated[post.feed_id].length
                });
            });

            $posts_by_feed_store = posts_to_be_updated;
        }
        
        $feed_unread_post_count = await fetch_unread_post_counts();
        $is_loading_posts = false;
    };

    const filterUnreads = async () => {
        const posts = await fetch_posts(
            $posts_sort_by,
            null,
            $selected_feed_id,
            0,
            NO_OF_POST_PULLS_PER_TIME,
            $unread_posts_only
        );

        if($selected_feed_id != -1){
            // Update a selected feed
            $posts_by_feed_store[$selected_feed_id] = posts;
        } else {
            // Set "all feeds"
            let newPost = {};

            for (const [feed_id, posts] of Object.entries(
              $posts_by_feed_store,
            )) {
              newPost[feed_id] = [];
            }

            posts.forEach((post) => {
              newPost[post.feed_id].push({
                ...post,
                rowid: newPost[post.feed_id].length,
              });
            });

            $posts_by_feed_store = newPost;
        }

        $feed_unread_post_count = await fetch_unread_post_counts();
    };
</script>

<div class="shrink border-br p-2 flex flex-row gap-4">
    <button
        class="text-text2 text-sm font-semibold flex flex-row gap-2 justify-center items-center"
        onclick={sortPosts}
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

    <div class="flex justify-center items-center">
        <input
            id="default-checkbox"
            type="checkbox"
            value=""
            class="w-4 h-4 rounded-sm"
            bind:checked={$unread_posts_only}
            onchange={filterUnreads}
        />
        <label
            for="default-checkbox"
            class="ms-2 text-sm text-text2 font-semibold">Unread</label
        >
    </div>

    <div class="text-text2 cursor-pointer" onclick={()=>{ $feed_view = FEED_VIEW.THUMBNAIL }}>
        <Fa icon={faGrip} size="lg" title="Show Thumbnail View"/>
    </div>
</div>
