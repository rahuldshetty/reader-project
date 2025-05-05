<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { appLoader } from "$lib/pages/loading_page/app_loader";
    import Titlebar from "$lib/components/titlebar.svelte";
    import { is_loading_splashscreen } from "$lib/store";
    import AppLoadScreen from "$lib/pages/loading_page/app_load_screen.svelte";

    let { children } = $props();

    onMount(async () => {
        await appLoader();
    });
</script>

<div>
    <Titlebar />
    {#if !$is_loading_splashscreen}
        {@render children()}
    {:else}
        <AppLoadScreen/>
    {/if}
</div>
