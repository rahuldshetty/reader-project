<script>
    import { getVersion } from "@tauri-apps/api/app";
    import logo from "$lib/assets/ico-1024.png";
    import { active_modal } from "$lib/stores/app_store";
    import { MODAL_TYPE } from "$lib/constants";
    import ModalShell from "$lib/components/modals/ModalShell.svelte";
    import { t } from "$lib/i18n";

    const closeModal = () => {
        $active_modal = MODAL_TYPE.NONE;
    };
</script>

<ModalShell
    open={$active_modal == MODAL_TYPE.ABOUT}
    title={$t("modal.about.title")}
    widthClass="max-w-2xl"
    onClose={closeModal}
>
    <!-- App Logo -->
    <div class="flex items-center space-x-3 mb-4">
        <img src={logo} alt={$t("modal.about.app_logo")} class="w-12 h-12 rounded-md" />
        <div>
            <h3 class="text-xl font-bold">Reader-Project</h3>
            {#await getVersion() then version}
                <p class="text-sm text-gray-500">{$t("app.version", { version })}</p>
            {/await}
        </div>
    </div>

    <!-- App Description -->
    <p class="mb-4 text-sm text-base-content">
        {$t("modal.about.description")}
    </p>

    <!-- Links -->
    <div class="flex gap-4 text-sm">
        <a
            href="https://github.com/rahuldshetty/reader-project"
            class="link link-hover"
            target="_blank"
        >
            🔗 {$t("modal.about.source_code")}
        </a>
        <a
            href="https://github.com/rahuldshetty/reader-project/blob/master/LICENSE"
            class="link link-hover"
            target="_blank"
        >
            📄 {$t("modal.about.license")}
        </a>
    </div>
</ModalShell>
