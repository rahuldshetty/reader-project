<script>
    import Fa from "svelte-fa";
    import { faGear } from "@fortawesome/free-solid-svg-icons";

    import { active_modal } from "$lib/stores/app_store";
    import { MODAL_TYPE } from '$lib/constants';

    const openSettingsModal = () => {
        $active_modal = MODAL_TYPE.SETTINGS;
    };
</script>

<li>
    <a class="flex flex-col" onclick={openSettingsModal}>
        <Fa icon={faGear} size="lg" />
        <span class="text-xs">Settings</span>
    </a>
</li>
