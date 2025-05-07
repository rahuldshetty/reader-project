<script>
    import Fa from "svelte-fa";
    import { faAdd } from "@fortawesome/free-solid-svg-icons";

    import { active_modal } from "$lib/dao/store";
    import { MODAL_TYPE } from '$lib/constants';

    const openAddModal = () => {
        $active_modal = MODAL_TYPE.ADD;
    };
</script>

<li>
    <a class="flex flex-col btn btn-primary p-6" onclick={openAddModal}>
        <Fa icon={faAdd} size="lg" title="Minimize" />
        <span class="text-xs">Add</span>
    </a>
</li>
