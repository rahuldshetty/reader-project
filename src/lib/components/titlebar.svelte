<script>
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { exit } from '@tauri-apps/plugin-process';

    import Fa from "svelte-fa";
    import {
        faWindowMinimize,
        faWindowRestore,
        faXmark,
    } from "@fortawesome/free-solid-svg-icons";

    const appWindow = getCurrentWindow();

    const exitApp = async () => {
        appWindow.close();
        await exit(0);
    }
</script>

<div data-tauri-drag-region class="titlebar fixed top-0 left-0 right-0 w-full flex justify-end items-centerpy-2 rounded-t-lg">
    <div class="flex items-center space-x-2">
        <button class="btn btn-ghost btn-xs" onclick={appWindow.minimize}>
            <Fa icon={faWindowMinimize} size="lg" title="Minimize" />
        </button>

        <button class="btn btn-ghost btn-xs" onclick={appWindow.toggleMaximize}>
            <Fa icon={faWindowRestore} size="lg" title="Maximize" />
        </button>

        <button class="btn btn-ghost btn-xs" onclick={exitApp}>
            <Fa icon={faXmark} size="lg" title="Exit" />
        </button>
    </div>
</div>