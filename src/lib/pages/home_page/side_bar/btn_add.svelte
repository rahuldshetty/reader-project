<script>
    import Fa from "svelte-fa";
    import { faAdd } from "@fortawesome/free-solid-svg-icons";

    import { active_modal } from "$lib/stores/app_store";
    import { MODAL_TYPE } from '$lib/constants';

    const openAddModal = () => {
        $active_modal = MODAL_TYPE.ADD;
    };
</script>

<li class="flex items-center">
    <button class="p-6 btn btn-circle btn-primary" onclick={openAddModal}>
        <div class="flex flex-col">
            <Fa icon={faAdd} title="Minimize" />
        <span class="text-xs">Add</span>
        </div>
    </button>
</li>
