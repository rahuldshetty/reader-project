<script lang="ts">
    import type { ContentResult, PostResult } from "$lib/types";
    import { renderHTML } from "$lib/utils/html";
    import ContentBar from "./content_bar.svelte";

    import { writeText } from "@tauri-apps/plugin-clipboard-manager";

    import { TOAST_MESSAGE_TYPE } from "$lib/constants";
    import { toastStore } from "$lib/stores/toast_store";
    import {
        detectWebRenderType,
        WEB_RENDER_TYPES,
    } from "./renderers/detector";
    import YoutubeRender from "./renderers/youtube_render.svelte";
    import AiSummary from "./ai_summary.svelte";
    import { reading_progress } from "$lib/stores/app_store";
    // import { Menu } from "@tauri-apps/api/menu";

    const {
        data,
        post = $bindable(),
    }: { data: ContentResult; post: PostResult } = $props();

    const renderType: WEB_RENDER_TYPES = $derived(
        detectWebRenderType(data.url),
    );

    const copyTextToClipboard = async () => {
        const selection_data = window.getSelection();
        if (selection_data) {
            const selection = selection_data.toString();
            if (selection) {
                await writeText(selection);
                toastStore.add(
                    TOAST_MESSAGE_TYPE.INFO,
                    "Copied text to Clipboard",
                    4000,
                );
                selection_data.removeAllRanges();
            }
        }
    };

    // TODO: Figure out way to get context menu working for both android and desktop
    //    const menuPromise = Menu.new({
    //         items: [
    //             {
    //                 id: "context_menu_1",
    //                 text: "Copy Text",
    //                 action: copyTextToClipboard,
    //             },
    //         ],
    //     });

    const openContextMenu = async () => {
        // const menu = await menuPromise;
        // menu.popup();
    };

    let scrollEl: HTMLDivElement;
    const onScroll = () => {
        if (!scrollEl) return;
        const max = scrollEl.scrollHeight - scrollEl.clientHeight;
        reading_progress.set(max > 0 ? scrollEl.scrollTop / max : 0);
    };
    // Reset scroll + progress whenever the article changes (next/prev).
    $effect(() => {
        post.id;
        if (scrollEl) scrollEl.scrollTop = 0;
        reading_progress.set(0);
    });
</script>

<div class="flex-1 overflow-y-auto animate-fade-in" bind:this={scrollEl} onscroll={onScroll}>
    <ContentBar {data} {post} />
    {#if typeof data.content === "string"}
        <AiSummary title={data.title} text={data.content} />
    {/if}
    {#if renderType == WEB_RENDER_TYPES.DEFAULT}
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
                    oncontextmenu={openContextMenu}
                >
                    {@html renderHTML(data.content as string, data.url)}
                </article>
            </div>
        </div>
    {:else if renderType == WEB_RENDER_TYPES.YOUTUBE}
        <YoutubeRender url={data.url} />
    {/if}
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
