<script lang="ts">
    import { fetch_post_data } from "$lib/dao/post_db";
    import {
        active_post_id,
        reading_progress,
    } from "$lib/stores/app_store";
    import { cached_parser } from "$lib/services/content_parser";
    import { CONTENT_TYPES } from "$lib/constants";
    import HtmlRenderer from "./html_renderer.svelte";
    import PdfRenderer from "./pdf_renderer.svelte";
    import SkeletonContent from "./skeleton_content.svelte";
    import DefaultRenderer from "./default_renderer.svelte";
    import type { PostResult } from "$lib/types";
    import Fa from "svelte-fa";
    import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
    import { t, translate } from "$lib/i18n";

    const prepareDefaultContent = (post: PostResult) => {
        // Called to render a default page when unable to load
        return {
            title: post.title,
            content: `<p>${translate("content.unable_to_parse")}</p>`,
            // TODO: Handle 0 word count here
            word_count: 0,
            url: post.link,
            image: post.image,
            content_type: CONTENT_TYPES.html,
        };
    };
</script>

<div
    class="flex-1 w-full h-full overflow-hidden flex flex-col bg-base-100 animate-fade-in"
>
    {#if $active_post_id != -1}
        <div class="h-0.5 w-full bg-base-300 shrink-0">
            <div
                class="h-full bg-primary transition-[width] duration-150"
                style:width={`${$reading_progress * 100}%`}
            ></div>
        </div>
    {/if}
    {#if $active_post_id != -1}
        {#await fetch_post_data($active_post_id) then post}
            {#await cached_parser(post.id, post.link)}
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
            <p class="text-lg font-medium">{$t("content.select_article")}</p>
        </div>
    {/if}
</div>
