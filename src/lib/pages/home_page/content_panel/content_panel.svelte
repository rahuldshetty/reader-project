<script lang="ts">
    import { fetch_post_data } from "$lib/dao/post_db";
    import { active_post_id } from "$lib/stores/app_store";
    import { hybrid_parser, mercury_parser } from "$lib/services/content_parser";
    import { CONTENT_TYPES } from "$lib/constants";
    import HtmlRenderer from "./html_renderer.svelte";
    import PdfRenderer from "./pdf_renderer.svelte";
</script>

{#if $active_post_id != -1}
    {#await fetch_post_data($active_post_id) then post}
        {#await hybrid_parser(post.link) then content}
            
                {#if content.content_type == CONTENT_TYPES.html}
                    <HtmlRenderer data={content} post={post}/>
                {:else if content.content_type == CONTENT_TYPES.pdf}
                    <PdfRenderer data={content} post={post}/>
                {/if}
            
        {/await}
    {/await}
{/if}
