<script lang="ts">
    import { fetch_post_data } from "$lib/dao/post_db";
    import { active_post_id } from "$lib/stores/app_store";
    import {
        hybrid_parser,
        mercury_parser,
    } from "$lib/services/content_parser";
    import { CONTENT_TYPES } from "$lib/constants";
    import HtmlRenderer from "./html_renderer.svelte";
    import PdfRenderer from "./pdf_renderer.svelte";
    import SkeletonContent from "./skeleton_content.svelte";
    import DefaultRenderer from "./default_renderer.svelte";
    import type { PostResult } from "$lib/types";
    import Fa from "svelte-fa";
    import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

    const prepareDefaultContent = (post: PostResult) => {
        // Called to render a default page when unable to load
        return {
            title: post.title,
            content: `<p>Unable to parse page. Please access the site directly.</p>`,
            // TODO: Handle 0 word count here
            word_count: 0,
            url: post.link,
            image: post.image,
            content_type: CONTENT_TYPES.html,
        };
    };
</script>

<div
    class="flex-1 h-full overflow-hidden flex flex-col bg-base-100 animate-fade-in"
>
    {#if $active_post_id != -1}
        {#await fetch_post_data($active_post_id) then post}
            {#await hybrid_parser(post.link)}
                <!-- Content is being fetched from URL -->
                <div class="fade-transition w-full h-full overflow-y-auto">
                    <SkeletonContent />
                </div>
            {:then content}
                {#if content.content_type == CONTENT_TYPES.html}
                    <HtmlRenderer data={content} {post} />
                {:else if content.content_type == CONTENT_TYPES.pdf}
                    <PdfRenderer data={content} {post} />
                {/if}
            {:catch}
                <DefaultRenderer data={prepareDefaultContent(post)} {post} />
            {/await}
        {/await}
    {:else}
        <div
            class="flex flex-col items-center justify-center h-full text-base-content/30 select-none"
        >
            <Fa icon={faBookOpen} size="4x" class="mb-4" />
            <p class="text-lg font-medium">Select an article to read</p>
        </div>
    {/if}
</div>
