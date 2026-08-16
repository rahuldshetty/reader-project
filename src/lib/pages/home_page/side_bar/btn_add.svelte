<script>
    import Fa from "svelte-fa";
    import { faAdd } from "@fortawesome/free-solid-svg-icons";

    import { active_modal } from "$lib/stores/app_store";
    import { MODAL_TYPE } from "$lib/constants";
    import { t } from "$lib/i18n";

    const openAddModal = () => {
        $active_modal = MODAL_TYPE.ADD;
    };
</script>

<li class="flex items-center">
    <button
        class="p-6 btn btn-circle btn-primary btn-press smooth-transition"
        onclick={openAddModal}
    >
        <div class="flex flex-col">
            <Fa icon={faAdd} title={$t("nav.add")} />
            <span class="text-xs">{$t("nav.add")}</span>
        </div>
    </button>
</li>
