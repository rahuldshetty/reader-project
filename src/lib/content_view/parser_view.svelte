<script lang="ts">
    import "$lib/styles/scrollbar.css";

    import { openUrl } from "@tauri-apps/plugin-opener";

    import { selected_post, is_loading_post_content } from "$lib/store";

    import ContentLoadingState from "$lib/content_view/content_loading_state.svelte";
    import EmptyState from "$lib/components/empty_state.svelte";
    import {
        hybrid_parser
    } from "$lib/content_view/parsers";

    import Fa from "svelte-fa";
    import {
        faStar,
        faUpRightFromSquare,
    } from "@fortawesome/free-solid-svg-icons";
    import { update_fav_post } from "$lib/db";
    import HtmlContent from "./contents/html_content/html_content.svelte";
    import { CONTENT_TYPES } from "$lib/constants";
    import PdfContent from "./contents/pdf_content/pdf_content.svelte";

    let parsed = $state({
        content_type: CONTENT_TYPES.none,
        title: "",
        image: "",
        url: "",
        content: "",
        word_count: 0,
    });
    let is_fav_post = $state(false);

    const timeToRead = (word_count: number) => {
        const wpm = 225;
        const time = Math.ceil(word_count / wpm);
        return time;
    };

    selected_post.subscribe(async (curValue) => {
        console.log(`Post Changed to: ${curValue.title}`);
        if(curValue && curValue.link != ""){
            parsed = await hybrid_parser(curValue.link);
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
                {#if parsed.word_count != 0}
                    <div class="text-base text-slate-500">
                        🕒 {`${timeToRead(parsed.word_count)} min read`}
                    </div>
                    ·
                {/if}
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

        {#if parsed.content_type == CONTENT_TYPES.html}
            <HtmlContent content={parsed.content} image={parsed.image} title={parsed.title} url={parsed.url}/>
        {:else if parsed.content_type == CONTENT_TYPES.pdf}
            <PdfContent content={parsed.content} image={parsed.image} title={parsed.title} url={parsed.url}/>
        {/if}
        
    {/if}
</div>
