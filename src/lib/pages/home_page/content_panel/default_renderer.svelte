<script lang="ts">
    import type { ContentResult, PostResult } from "$lib/types";
    import { renderHTML } from "$lib/utils/html";
    import ContentBar from "./content_bar.svelte";
    import { reading_progress } from "$lib/stores/app_store";

    const {
        data,
        post = $bindable(),
    }: { data: ContentResult; post: PostResult } = $props();

    let scrollEl: HTMLDivElement;
    const onScroll = () => {
        if (!scrollEl) return;
        const max = scrollEl.scrollHeight - scrollEl.clientHeight;
        reading_progress.set(max > 0 ? scrollEl.scrollTop / max : 0);
    };
    $effect(() => {
        post.id;
        if (scrollEl) scrollEl.scrollTop = 0;
        reading_progress.set(0);
    });
</script>

<div
    class="flex-1 overflow-y-auto animate-fade-in"
    bind:this={scrollEl}
    onscroll={onScroll}
>
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
