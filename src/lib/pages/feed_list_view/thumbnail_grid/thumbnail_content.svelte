<script>
    import { selected_post } from "$lib/store";
    import ParserView from "$lib/content_view/parser_view.svelte";
</script>

<div class="w-full bg-background2">
    {#if $selected_post}
        <ParserView
            link={$selected_post.link}
            title={$selected_post.title}
        />
    {:else}
        <p class="p-4 text-gray-600">Select a news item to preview</p>
    {/if}
</div>
