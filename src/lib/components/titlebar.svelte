<script>
    import { getCurrentWindow } from '@tauri-apps/api/window';

    const appWindow = getCurrentWindow();
</script>

<div data-tauri-drag-region class="titlebar bg-indigo-50">
    <button class="titlebar-button" id="titlebar-minimize" onclick={appWindow.minimize}>
        <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
        />
    </button>
    <button class="titlebar-button" id="titlebar-maximize" onclick={appWindow.toggleMaximize}>
        <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
        />
    </button>
    <button class="titlebar-button" id="titlebar-close" onclick={appWindow.close}>
        <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
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
    background: #F5F5F5;
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
    background: #5C6BC0;
}

.titlebar img {
    width: 16px;
    height: 16px;
}
</style>
