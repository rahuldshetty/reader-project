<script lang="ts">
    import {
        active_feed_id,
        filter_unread_posts,
        is_mobile,
        mobile_active_panel,
    } from "$lib/stores/app_store";
    import { refresh_posts } from "$lib/pages/home_page/common";

    import Fa from "svelte-fa";
    import { faStar, faGripLines } from "@fortawesome/free-solid-svg-icons";

    const handleOnClick = async (feed_id: number) => {
        const isSameFeed = $active_feed_id == feed_id;

        if (!isSameFeed) {
            // Since my_favourites is already ready,
            // reset the filter_read
            if (feed_id == -2) {
                $filter_unread_posts = false;
            }

            $active_feed_id = feed_id;
            await refresh_posts(feed_id);
        }

        // Navigate to posts panel on mobile (always, even if same feed)
        if ($is_mobile) {
            mobile_active_panel.set("posts");
        }
    };
</script>

<li onclick={() => handleOnClick(-1)}>
    <div class="m-0.5 {$active_feed_id == -1 ? 'menu-active' : ''}">
        <Fa icon={faGripLines} size="lg" />
        <span class="truncate p-1">All Posts</span>
    </div>
</li>

<li onclick={() => handleOnClick(-2)}>
    <div class="m-0.5 {$active_feed_id == -2 ? 'menu-active' : ''}">
        <Fa icon={faStar} color="var(--color-accent)" size="lg" />
        <span class="truncate p-1">My Favourites</span>
    </div>
</li>

<div class="divider h-0 m-0"></div>
