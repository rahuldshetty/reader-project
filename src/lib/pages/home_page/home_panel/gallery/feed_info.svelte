<script lang="ts"> 
    import { fetch_feed_by_id } from "$lib/dao/feed_db";
    const { feed_id }: { feed_id: number} = $props();
</script>

{#await fetch_feed_by_id(feed_id) then feed}
    {#if feed.favicon}
        <img class="w-6 h-6 object-cover" src={feed.favicon} alt={feed.title} />
    {/if} 
{/await}
