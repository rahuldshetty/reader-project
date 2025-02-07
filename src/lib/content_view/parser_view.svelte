<script lang="ts">
    import { fetch } from "@tauri-apps/plugin-http";
    import { openUrl } from "@tauri-apps/plugin-opener";
    import { derived } from "svelte/store";

    import { selected_post, is_loading_post_content } from "$lib/store";

    import ContentLoadingState from "$lib/content_view/content_loading_state.svelte";
    import EmptyState from "$lib/components/empty_state.svelte";
    import { mercury_parser, morzilla_readability_parser } from "$lib/content_view/parsers";

    let parsed = $state({});

    const fetch_web_content = async (url: string) => {
        const response = await fetch(url);
        const text = await response.text();
        return text;
    };

    const timeToRead = (word_count: number) => {
        const wpm = 225;
        const time = Math.ceil(word_count / wpm);
        return time;
    };

    selected_post.subscribe(async (curValue) => {
        if (curValue) {
            let webpage_content = await fetch_web_content(curValue.link);
            console.log("WEB CONTENT:");
            console.log(webpage_content);

            parsed = await mercury_parser(curValue.link, webpage_content);
            // parsed = await morzilla_readability_parser(curValue.link, webpage_content);
            $is_loading_post_content = false;
        }
    });

    const openURLInBrowser = async (url: string) => {
        await openUrl(url);
    };
</script>

<div class="m-5 overflow-auto h-screen">
    {#if $is_loading_post_content}
        <ContentLoadingState />
    {:else if !$selected_post.link}
        <EmptyState message="Select a post to get reading" />
    {:else}
        <div>
            <h1 class="text-2xl font-semibold">
                {parsed.title}
            </h1>
            <div class="flex flex-row items-center mb-2 mt-2 gap-2">
                <div class="text-sm text-slate-500">
                    {`${timeToRead(parsed.word_count)} min read`}
                </div>
                ·
                <div
                    class="flex grow-0"
                    onclick={() => openURLInBrowser(parsed.url)}
                >
                    <!-- Earth Logo -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="fill-text1 hover:fill-primary2 size-6 cursor-pointer"
                    >
                        <path
                            d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z"
                        />
                        <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </div>

        {#if parsed.image}
            <img
                src={parsed.image}
                alt={parsed.title}
                class="rounded-md object-cover"
            />
        {/if}

        <div
            class="mt-4 mr-4 indent-0 text-text1 text-base font-normal leading-relaxed text-justify mb-20"
        >
            <article>
                {@html parsed.content}
            </article>
        </div>
    {/if}
</div>

<style>
    article :global {
        p {
            padding-top: 0.5em;
        }
        a {
            pointer-events: none;
            cursor: default;
        }
    }
</style>
