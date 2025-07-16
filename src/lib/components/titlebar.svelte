<script>
    import { getCurrentWindow } from "@tauri-apps/api/window";

    import Fa from "svelte-fa";
    import {
        faWindowMinimize,
        faWindowRestore,
        faXmark,
    } from "@fortawesome/free-solid-svg-icons";

    import { local_user_setting } from "$lib/stores/app_store";
    import { exit } from "@tauri-apps/plugin-process";

    const appWindow = getCurrentWindow();

    const closeWindow = async () => {
        const minimize_app = $local_user_setting.MINIMIZE_APP;
        if(minimize_app){
            // Window Close is handled at rust to not close, but instead hide 
            await appWindow.close();
        } else {
            // Force exit app
            await exit(0);
        }
       
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

        <button class="btn btn-ghost btn-xs" onclick={closeWindow}>
            <Fa icon={faXmark} size="lg" title="Exit" />
        </button>
    </div>
</div>