<script>
    import { getCurrentWindow } from "@tauri-apps/api/window";

    import Fa from "svelte-fa";
    import {
        faWindowMinimize,
        faWindowMaximize,
        faWindowClose,
    } from "@fortawesome/free-solid-svg-icons";

    const appWindow = getCurrentWindow();
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div data-tauri-drag-region class="titlebar">
    <button class="btn btn-ghost btn-xs" onclick={appWindow.minimize}>
        <Fa style="" icon={faWindowMinimize} size="lg" title="Minimize" />
    </button>

    <button class="btn btn-ghost btn-xs" onclick={appWindow.toggleMaximize}>
        <Fa icon={faWindowMaximize} size="lg" title="Maximize" />
    </button>

    <button class="btn btn-ghost btn-xs" onclick={appWindow.close}>
        <Fa icon={faWindowClose} size="lg" title="Exit" />
    </button>
</div>

<style>
    .titlebar {
        height: var(--titlebar-height);
        user-select: none;
        display: flex;
        justify-content: flex-end;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }
</style>
