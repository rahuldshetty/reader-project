<script>
    import { getCurrentWindow } from '@tauri-apps/api/window';

    const appWindow = getCurrentWindow();
</script>

<div data-tauri-drag-region class="titlebar">
    <button class="titlebar-button" id="titlebar-minimize" on:click={appWindow.minimize}>
        <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
        />
    </button>
    <button class="titlebar-button" id="titlebar-maximize" on:click={appWindow.toggleMaximize}>
        <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
        />
    </button>
    <button class="titlebar-button" id="titlebar-close" on:click={appWindow.close}>
        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
    </button>
</div>

<style>
.titlebar {
    height: var(--titlebar-height);
    background: #394ec2;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: var(--titlebar-height);
    height: var(--titlebar-height);
    user-select: none;
    -webkit-user-select: none;
    border: none;
    background: transparent;
    cursor: pointer;
}

.titlebar-button:hover {
    background: #5bbec3;
}

.titlebar img {
    width: 16px;
    height: 16px;
}
</style>
