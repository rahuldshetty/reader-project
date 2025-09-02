<script lang="ts">
    import type { ContentResult, PostResult } from "$lib/types";
    import { cleanHTML } from "$lib/utils/html";
    import ContentBar from "./content_bar.svelte";

    import { writeText } from "@tauri-apps/plugin-clipboard-manager";

    import { Menu } from "@tauri-apps/api/menu";
    import { TOAST_MESSAGE_TYPE } from "$lib/constants";
    import { toastStore } from "$lib/stores/toast_store";

    const {
        data,
        post = $bindable(),
    }: { data: ContentResult; post: PostResult } = $props();

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
        items: [{ id: "context_menu_1", text: "Copy Text", action: copyTextToClipboard }],
    });

    const openContextMenu = async () => {
        const menu = await menuPromise;
        menu.popup();
    };
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
            class="prose prose-base text-text1 max-w-none"
            oncontextmenu={openContextMenu}
        >
            {@html cleanHTML(data.content as string, data.url)}
        </article>
    </div>
</div>
