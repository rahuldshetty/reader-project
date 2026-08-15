<script lang="ts">
    import { active_feed_id } from "$lib/stores/app_store";
    import { select_feed } from "$lib/pages/home_page/common";

    import Fa from "svelte-fa";
    import { faStar, faGripLines } from "@fortawesome/free-solid-svg-icons";

    const handleOnClick = (feed_id: number) => {
        void select_feed(feed_id);
    };
</script>

<li data-feed-id="-1" onclick={() => handleOnClick(-1)}>
    <div class="m-0.5 {$active_feed_id == -1 ? 'menu-active' : ''}">
        <Fa icon={faGripLines} size="lg" />
        <span class="truncate p-1">All Posts</span>
    </div>
</li>

<li data-feed-id="-2" onclick={() => handleOnClick(-2)}>
    <div class="m-0.5 {$active_feed_id == -2 ? 'menu-active' : ''}">
        <Fa icon={faStar} color="var(--color-accent)" size="lg" />
        <span class="truncate p-1">My Favourites</span>
    </div>
</li>

<div class="divider h-0 m-0"></div>
