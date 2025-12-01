<script lang="ts">
    import type { ContentResult, PostResult } from "$lib/types";
    import { renderHTML } from "$lib/utils/html";
    import ContentBar from "./content_bar.svelte";

    const {
        data,
        post = $bindable(),
    }: { data: ContentResult; post: PostResult } = $props();
</script>

<div class="flex-1 overflow-y-auto">
    <ContentBar {data} {post} />
    <div class="p-6">
        {#if data.image || post.image}
            <img
                src={data.image || post.image}
                alt={data.title}
                class="rounded-md object-cover max-h-96 w-full mb-4
                    transition-transform duration-300 ease-in-out transform hover:scale-101
                "
            />
        {/if}

        <article
            class="prose prose-base text-text1 max-w-none overflow-hidden break-words"
        >
            {@html renderHTML(data.content as string, data.url)}
        </article>
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
