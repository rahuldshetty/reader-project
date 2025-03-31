<script>
    import { derived } from "svelte/store";
    import {
        posts_by_feed_store,
        selected_feed_id
    } from "$lib/store";

    // Filter posts by selected feed id
    const filtered_posts = derived(
        [posts_by_feed_store, selected_feed_id],
        ([$posts_by_feed_store, $selected_feed_id]) => {
            if ($selected_feed_id != -1) {
                // Select Particular Feed
                return $posts_by_feed_store[$selected_feed_id];
            } else {
                // Select "All Posts" feed
                let all_posts = [];
                for (const [feed_id, posts] of Object.entries(
                    $posts_by_feed_store,
                )) {
                    for (const post of posts) {
                        all_posts.push(post);
                    }
                }
                return all_posts;
            }
        },
    );
</script>
