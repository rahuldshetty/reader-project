<script lang="ts">
    import Fa from "svelte-fa";
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

    import { FEED_TYPE, MODAL_TYPE } from "$lib/constants";
    import { active_modal } from "$lib/stores/app_store";

    let { title, id, type } = $props();
    
    const closeEditDialog = () => {
        if(document && document.activeElement && document.activeElement instanceof HTMLElement)
            document.activeElement.blur();
    }

    const handleRefresh = () => {
        closeEditDialog();

    }

    const handleEditFeed = () => {
        closeEditDialog();

    }

    const handleDeleteFeed = () => {
        closeEditDialog();
        $active_modal = MODAL_TYPE.DELETE_FEED;
        console.log("ACTIVE?")
    }
</script>

<div class="dropdown dropdown-bottom flex justify-end">
    <button role="button" class="p-2 cursor-pointer">
        <Fa icon={faEllipsisVertical} />
    </button>
    <ul
        class="dropdown-content overflow-auto text-base-content menu bg-base-200 rounded-box z-10 p-2 w-28 shadow-sm"
    >
        {#if type == FEED_TYPE.FEED}
            <li><button onclick={handleRefresh}>Refresh</button></li>
        {/if}
        <li><button onclick={handleEditFeed}>Edit</button></li>
        <li><button onclick={handleDeleteFeed}>Delete</button></li>
    </ul>
</div>
