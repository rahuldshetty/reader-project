<script>
    import "../app.css"
    import Titlebar from "$lib/components/titlebar.svelte";
    import { themeMode } from "$lib/store";

    let { children } = $props();
</script>


<div class={$themeMode}>
    <Titlebar />
    {@render children()}
</div>
