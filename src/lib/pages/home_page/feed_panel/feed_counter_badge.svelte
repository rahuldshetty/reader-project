<script lang="ts">
    import {feed_count_by_id} from "$lib/stores/app_store";
    import { derived } from "svelte/store";

    const { ids }: { ids: number[] } = $props();
    console.log($feed_count_by_id);
    const total = ids.reduce((prev, num) => prev + $feed_count_by_id[num], 0);
</script>

<div class="badge badge-sm badge-secondary">
    {#if total < 100}
        {total}
    {:else}
        +99
    {/if}
</div>
