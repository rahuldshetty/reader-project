<script lang="ts">
    import type { ContentResult, PostResult } from "$lib/types";
    import { renderHTML } from "$lib/utils/html";
    import ContentBar from "./content_bar.svelte";

    const {
        data,
        post = $bindable(),
    }: { data: ContentResult; post: PostResult } = $props();
</script>

<div class="flex-1 overflow-y-auto animate-fade-in">
    <ContentBar {data} {post} />
    <div class="px-6 py-8 md:px-10 md:py-12">
        <div class="mx-auto max-w-prose">
            {#if data.image || post.image}
                <img
                    src={data.image || post.image}
                    alt={data.title}
                    class="rounded-lg object-cover max-h-96 w-full mb-8"
                />
            {/if}

            <article
                class="prose prose-base text-base-content overflow-hidden break-words"
            >
                {@html renderHTML(data.content as string, data.url)}
            </article>
        </div>
    </div>
</div>

<style>
    article :global(*) {
        max-width: 100%;
        box-sizing: border-box;
    }

    article :global(img),
    article :global(video),
    article :global(iframe) {
        max-width: 100%;
        height: auto;
    }
</style>
