<script lang="ts">
    import "$lib/styles/scrollbar.css";

    import { fetch } from "@tauri-apps/plugin-http";
    import { openUrl } from "@tauri-apps/plugin-opener";

    import { selected_post, is_loading_post_content } from "$lib/store";

    import ContentLoadingState from "$lib/content_view/content_loading_state.svelte";
    import EmptyState from "$lib/components/empty_state.svelte";
    import {
        mercury_parser,
        morzilla_readability_parser,
    } from "$lib/content_view/parsers";

    import Fa from "svelte-fa";
    import {
        faStar,
        faUpRightFromSquare,
    } from "@fortawesome/free-solid-svg-icons";
    import { update_fav_post } from "$lib/db";
    import { cleanHTML } from "$lib/content_view/html_cleaner";

    let parsed = $state({});
    let is_fav_post = $state(false);

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
        if (curValue && curValue.link) {
            parsed = await mercury_parser(curValue.link, "");
            // parsed = await morzilla_readability_parser(curValue.link, webpage_content);
            $is_loading_post_content = false;
            is_fav_post = curValue.is_fav == 1;
        }
    });

    const openURLInBrowser = async (url: string) => {
        await openUrl(url);
    };

    const change_fav_post = async () => {
        await update_fav_post($selected_post.id, is_fav_post ? 0 : 1);
        // Instead of Selected_Post use better reference to update the parent object.
        $selected_post.is_fav = 1 - $selected_post.is_fav;
    };
</script>

<div class="ml-5 mt-5 mb-5 overflow-auto h-screen scroll-smooth">
    {#if $is_loading_post_content}
        <ContentLoadingState />
    {:else if !$selected_post.link}
        <EmptyState message="Select a post to get reading" />
    {:else}
        <div>
            <h1 class="text-2xl text-text1 font-semibold">
                {parsed.title}
            </h1>
            <div class="flex flex-row items-center mb-2 mt-2 gap-2">
                <div class="text-base text-slate-500">
                    🕒 {`${timeToRead(parsed.word_count)} min read`}
                </div>
                ·
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="flex grow-0 cursor-pointer hover:text-primary2
                    {is_fav_post ? 'text-primary1' : 'text-text1'}
                    "
                    onclick={() => change_fav_post()}
                >
                    <Fa icon={faStar} size="lg" />
                </div>
                ·
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="flex grow-0 cursor-pointer text-text1 hover:text-primary2"
                    onclick={() => openURLInBrowser(parsed.url)}
                >
                    <Fa icon={faUpRightFromSquare} size="lg" />
                </div>
            </div>
        </div>

        <!-- To set margin: max-w-6xl -->
        <div class="max-w-6xl">
            {#if parsed.content && parsed.image && !parsed.content.includes("img")}
                <img
                    src={parsed.image}
                    alt={parsed.title}
                    class="rounded-md object-cover"
                />
            {/if}

            <div
                class="mt-4 mr-4 indent-0 text-text1 text-base font-normal leading-relaxed text-justify mb-20"
            >
                <article class="content">
                    {@html cleanHTML(parsed.content, parsed.url)}
                </article>
            </div>
        </div>
    {/if}
</div>

<style>
    article :global {
        * {
            @apply max-w-screen-2xl;
        }
        p {
            @apply text-text1 mt-3 mb-3 text-base antialiased font-normal;
        }

        li p {
            margin: 0; /* Remove unwanted margins */
            display: inline; /* Force inline content */
        }

        a {
            pointer-events: none;
            cursor: default;
        }

        h1 {
            @apply text-5xl font-medium text-text1 mt-4 mb-4;
        }
        h2 {
            @apply text-4xl font-medium text-text1 mt-4 mb-4;
        }
        h3 {
            @apply text-3xl font-medium text-text1 mt-4 mb-4;
        }
        h4 {
            @apply text-2xl font-medium text-text1 mt-4 mb-4;
        }
        h5 {
            @apply text-xl font-medium text-text1 mt-4 mb-4;
        }
        h6 {
            @apply text-base font-medium text-text1 mt-4 mb-4;
        }

        ul {
            @apply list-inside list-disc;
        }

        code {
            @apply text-sm font-mono;
        }

        img {
            @apply max-w-5xl;
        }

        pre {
            @apply text-text1 bg-pre rounded-md p-4 max-w-6xl whitespace-pre-wrap mt-1 mb-1;
        }

        /* Table Styling */
        table {
            @apply table w-1/2 text-sm text-left text-text1;
        }

        thead {
            @apply table-header-group font-medium uppercase;
        }

        th {
            @apply px-6 py-3;
        }

        tr {
            @apply table-row border-b;
        }

        tbody {
            @apply table-row-group;
        }

        td {
            @apply table-cell px-2 py-1;
        }
    }
</style>
