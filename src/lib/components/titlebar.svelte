<script>
    import { getCurrentWindow } from "@tauri-apps/api/window";

    import { local_user_setting } from "$lib/stores/app_store";
    import { exit } from "@tauri-apps/plugin-process";

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
    <div class="group flex items-center gap-2">
        <button
            class="traffic traffic-min"
            onclick={appWindow.minimize}
            title="Minimize"
            aria-label="Minimize"
        >
            <span class="traffic-symbol">−</span>
        </button>
        <button
            class="traffic traffic-max"
            onclick={appWindow.toggleMaximize}
            title="Maximize"
            aria-label="Maximize"
        >
            <span class="traffic-symbol">+</span>
        </button>
        <button
            class="traffic traffic-close"
            onclick={closeWindow}
            title="Close"
            aria-label="Close"
        >
            <span class="traffic-symbol">×</span>
        </button>
    </div>
</div>

<style>
    .traffic {
        width: 13px;
        height: 13px;
        border-radius: 9999px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(0, 0, 0, 0.12);
        cursor: pointer;
        line-height: 1;
        transition: filter 0.12s ease;
    }
    .traffic:hover {
        filter: brightness(0.92);
    }
    .traffic-close {
        background: #ff5f57;
    }
    .traffic-min {
        background: #febc2e;
    }
    .traffic-max {
        background: #28c840;
    }

    .traffic-symbol {
        font-size: 10px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.12s ease;
        user-select: none;
        pointer-events: none;
    }
    .group:hover .traffic-symbol {
        opacity: 1;
    }
</style>
