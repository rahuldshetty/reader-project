<script lang="ts">
    import type { ContentResult, PostResult } from "$lib/types";
    import { renderHTML } from "$lib/utils/html";
    import ContentBar from "./content_bar.svelte";

    import { writeText } from "@tauri-apps/plugin-clipboard-manager";

    import { Menu } from "@tauri-apps/api/menu";
    import { TOAST_MESSAGE_TYPE } from "$lib/constants";
    import { toastStore } from "$lib/stores/toast_store";
    import {
        detectWebRenderType,
        WEB_RENDER_TYPES,
    } from "./renderers/detector";
    import YoutubeRender from "./renderers/youtube_render.svelte";
    import AiSummary from "./ai_summary.svelte";

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

    const menuPromise = Menu.new({
        items: [
            {
                id: "context_menu_1",
                text: "Copy Text",
                action: copyTextToClipboard,
            },
        ],
    });

    const openContextMenu = async () => {
        const menu = await menuPromise;
        menu.popup();
    };
</script>

<div class="flex-1 overflow-y-auto">
    <ContentBar {data} {post} />
    {#if typeof data.content === "string"}
        <AiSummary title={data.title} text={data.content} />
    {/if}
    {#if renderType == WEB_RENDER_TYPES.DEFAULT}
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
                oncontextmenu={openContextMenu}
            >
                {@html renderHTML(data.content as string, data.url)}
            </article>
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
