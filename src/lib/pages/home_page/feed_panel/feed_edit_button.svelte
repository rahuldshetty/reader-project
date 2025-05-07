<script lang="ts">
    import Fa from "svelte-fa";
    import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

    import { FEED_TYPE } from "$lib/constants";

    let { title, id, type } = $props();

    const handleEditFeed = () => {
        
    }

    const handleDeleteFeed = () => {

    }
</script>

<div class="dropdown dropdown-bottom dropdown-center flex justify-end">
    <button role="button" class="m-2">
        <Fa icon={faEllipsisVertical} />
    </button>
    <ul
        class="dropdown-content overflow-auto menu bg-base-200 rounded-box z-10 p-2 w-28 shadow-sm"
    >
        <li><div onclick={handleEditFeed}>Edit</div></li>
        <li><div onclick={handleDeleteFeed}>Delete</div></li>
    </ul>
</div>
