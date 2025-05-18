<script>
    import Fa from "svelte-fa";
    import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

    import { active_modal } from "$lib/stores/app_store";
    import { MODAL_TYPE } from '$lib/constants';

    const openSettingsModal = () => {
        $active_modal = MODAL_TYPE.ABOUT;
    };
</script>

<li>
    <a class="flex flex-col" onclick={openSettingsModal}>
        <Fa icon={faInfoCircle} size="lg" />
        <span class="text-xs">About</span>
    </a>
</li>
