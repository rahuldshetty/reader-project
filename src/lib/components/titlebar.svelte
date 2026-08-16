<script>
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import Fa, { FaLayers } from "svelte-fa";
    import {
        faCircle,
        faMinus,
        faPlus,
        faXmark,
    } from "@fortawesome/free-solid-svg-icons";

    import { local_user_setting } from "$lib/stores/app_store";
    import { exit } from "@tauri-apps/plugin-process";
    import { t } from "$lib/i18n";

    const appWindow = getCurrentWindow();

    const closeWindow = async () => {
        const minimize_app = $local_user_setting.MINIMIZE_APP;
        if (minimize_app) {
            // Window Close is handled at rust to not close, but instead hide
            await appWindow.close();
        } else {
            // Force exit app
            await exit(0);
        }
    };
</script>

<div
    data-tauri-drag-region
    class="titlebar fixed top-0 left-0 right-0 z-50 h-[var(--titlebar-height)] hidden md:flex items-center justify-end px-3 bg-base-100 border-b border-base-300"
>
    <div class="flex items-center gap-1.5">
        <button
            class="p-0 cursor-pointer leading-none"
            onclick={appWindow.minimize}
            title={$t("common.minimize")}
            aria-label={$t("common.minimize")}
        >
            <FaLayers size="sm">
                <Fa icon={faCircle} color="#febc2e" />
                <Fa icon={faMinus} scale={0.6} />
            </FaLayers>
        </button>
        <button
            class="p-0 cursor-pointer leading-none"
            onclick={appWindow.toggleMaximize}
            title={$t("common.maximize")}
            aria-label={$t("common.maximize")}
        >
            <FaLayers size="sm">
                <Fa icon={faCircle} color="#28c840" />
                <Fa icon={faPlus} scale={0.6} />
            </FaLayers>
        </button>
        <button
            class="p-0 cursor-pointer leading-none"
            onclick={closeWindow}
            title={$t("common.close")}
            aria-label={$t("common.close")}
        >
            <FaLayers size="sm">
                <Fa icon={faCircle} color="#ff5f57" />
                <Fa icon={faXmark} scale={0.6} />
            </FaLayers>
        </button>
    </div>
</div>
