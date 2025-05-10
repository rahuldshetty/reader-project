<script>
    import { active_modal } from "$lib/stores/app_store";
    import { MODAL_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolderPlus } from "@fortawesome/free-solid-svg-icons";

    const handleNewFolder = () => {
        $active_modal = MODAL_TYPE.ADD_FOLDER;
    }

</script>

<div
    class="sticky top-0 z-10 justify-end bg-base-100 p-2 flex space-x-1"
>
    <button onclick={handleNewFolder} class="btn btn-ghost btn-sm btn-circle p-4">
        <Fa icon={faFolderPlus} size="lg"/>
    </button>
     <!-- <button class="btn btn-ghost btn-sm btn-circle p-4">
        <Fa icon={faFolderPlus} size="lg"/>
    </button> -->
</div>
