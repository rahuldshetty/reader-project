<script>
    import { getCurrentWindow } from '@tauri-apps/api/window';

    const appWindow = getCurrentWindow();
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div data-tauri-drag-region class="bg-background1 titlebar text-text1">
    <button class="titlebar-button" id="titlebar-minimize" onclick={appWindow.minimize}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 14H4v-4h16"/></svg>
    </button>
    <button class="titlebar-button" id="titlebar-maximize" onclick={appWindow.toggleMaximize}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v16H4zm2 4v10h12V8z"/></svg>
    </button>
    <button class="titlebar-button" id="titlebar-close" onclick={appWindow.close}>
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
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
