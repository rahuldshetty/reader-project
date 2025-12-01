<script>
    import "../app.css";
    import "$lib/styles/animations.css";
    import { onMount } from "svelte";
    import "$lib/components/tray";
    import { init_app } from "$lib/pages/loading_page/init_loader";
    import Titlebar from "$lib/components/titlebar.svelte";
    import { is_loading_splashscreen } from "$lib/stores/app_store";
    import AppLoadScreen from "$lib/pages/loading_page/app_load_screen.svelte";

    let { children } = $props();

    onMount(async () => {
        await init_app();

        // Disable Right-click context globally
        document.addEventListener("contextmenu", (event) => {
            if (!event.target.closest(".allow-context")) {
                event.preventDefault();
            }
        });
    });
</script>

<div>
    <Titlebar />
    {#if !$is_loading_splashscreen}
        {@render children()}
    {:else}
        <AppLoadScreen />
    {/if}
</div>
