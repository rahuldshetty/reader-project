<script lang="ts">
    import type { FeedResult, Feed } from "$lib/types";
    import Fa from "svelte-fa";
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

    import { FEED_TYPE, MODAL_TYPE } from "$lib/constants";
    import { active_modal, refreshing_posts } from "$lib/stores/app_store";
    import { refresh_post_data } from "$lib/pages/home_page/common";

    const { feed }: { feed: FeedResult | Feed } = $props();
    
    const closeEditDialog = () => {
        if(document && document.activeElement && document.activeElement instanceof HTMLElement)
            document.activeElement.blur();
    }

    const handleRefresh = async () => {
        $refreshing_posts = true;

        // Refresh Posts in Store
        await refresh_post_data(feed.id, feed.url);

        $refreshing_posts = false;
        closeEditDialog();
    }

    const handleEditFeed = () => {
        closeEditDialog();
        $active_modal = MODAL_TYPE.UPDATE;
    }

    const handleDeleteFeed = () => {
        closeEditDialog();
        $active_modal = MODAL_TYPE.DELETE_FEED;
    }

    const handleFeedAsRead = () =>{
        closeEditDialog();
        $active_modal = MODAL_TYPE.MARK_READ;
    }
</script>

<div class="dropdown dropdown-bottom flex justify-end">
    <button tabindex="0" role="button" class="p-2 cursor-pointer">
        <Fa icon={faEllipsisVertical} />
    </button>
    <ul
        tabindex="-1"
        class="dropdown-content overflow-auto text-base-content menu bg-base-200 rounded-box z-10 p-2 w-28 shadow-sm overflow-visible"
    >
        {#if feed.type == FEED_TYPE.FEED}
            <li><button onclick={handleRefresh}>Refresh</button></li>
            <li><button onclick={handleFeedAsRead}>Mark Read</button></li>
        {/if}
        <li><button onclick={handleEditFeed}>Edit</button></li>
        <li><button onclick={handleDeleteFeed}>Delete</button></li>
    </ul>
</div>
