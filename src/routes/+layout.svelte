<script>
    import "../app.css"
    import Titlebar from "$lib/components/titlebar.svelte";
    import { themeMode, is_loading_splashscreen } from "$lib/store";
    import "$lib/pages/app_loader";
    import { appLoader } from "$lib/pages/app_loader";
    import { onMount } from "svelte";
    
    let { children } = $props();

    onMount(async () => {
        await appLoader();
    });

</script>


<div class={$themeMode}>
    {#if !$is_loading_splashscreen}
        <Titlebar />
    {/if}

    {@render children()}
</div>
