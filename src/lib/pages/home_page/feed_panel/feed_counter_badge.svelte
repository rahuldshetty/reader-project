<script lang="ts">
    import {feed_count_by_id} from "$lib/stores/app_store";

    const { id }: { id: number } = $props();
    const total = $derived($feed_count_by_id[id] ?? 0);
</script>

{#if total && total != 0}
    <div class="badge badge-sm badge-secondary">
        {#if total < 100}
            {total}
        {:else}
            +99
        {/if}
    </div>
{/if}
