<script>
    import { fade, slide } from "svelte/transition";
    import { fetch_posts } from "$lib/db";
    import {
        selected_feed_id,
        feed_unread_post_count,
        posts_sort_by,
        posts_by_feed_store,
        minimize_feeds,
        unread_posts_only,
        feed_view,
        selected_post,

        feed_parent_open_status

    } from "$lib/store";
    import { NO_OF_POST_PULLS_PER_TIME, FEED_VIEW, FEED_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faStar, faRss, faFolderOpen, faFolder } from "@fortawesome/free-solid-svg-icons";

    let { id, title, url, favicon, type, parent, is_child_node } = $props();

    let folderOpen = $state(false);

    const count = $derived($feed_unread_post_count[id]);

    const update_feed_id = async () => {
        if(type == FEED_TYPE.FEED){
            const posts = await fetch_posts(
                $posts_sort_by,
                null,
                $selected_feed_id,
                0,
                NO_OF_POST_PULLS_PER_TIME,
                $unread_posts_only,
            );
            $posts_by_feed_store[$selected_feed_id] = posts;
            if($feed_view == FEED_VIEW.THUMBNAIL){
                $selected_post = {};
            }
        } else if(type == FEED_TYPE.FOLDER){
            folderOpen = !folderOpen;
            $feed_parent_open_status[id] = !$feed_parent_open_status[id];
            // TODO: Gather multiple feed ids to search for parent
        }
        $selected_feed_id = id;
    };
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore event_directive_deprecated -->
<li
    class="flex items-center cursor-pointer gap-2 p-2 text-text1 hover:bg-primary2 hover:text-text3
    rounded ml-2 mr-2 mt-1
    {$selected_feed_id == id ? 'bg-primary2 text-text3' : ''}
    {!$minimize_feeds && is_child_node? "ml-8":""}
    "
    in:fade={{ delay: 300, duration: 500 }}
    out:slide
    onclick={update_feed_id}
>
    {#if favicon}
        <img src={favicon} alt={title} class="w-6 h-6 object-contain" />
    {:else if id == -1}
        <!-- All Post Icon -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
        >
            <path
                fill-rule="evenodd"
                d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                clip-rule="evenodd"
            />
            <path
                d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z"
            />
        </svg>
    {:else if id == -2}
        <Fa icon={faStar} size="lg" />
    {:else if type == FEED_TYPE.FOLDER}
        {#if folderOpen}
            <Fa icon={faFolderOpen} size="lg" />
        {:else}
            <Fa icon={faFolder} size="lg" />
        {/if}
    {:else}
        <Fa icon={faRss} size="lg" />
    {/if}

    {#if !$minimize_feeds}
        <span class="text-sm truncate max-w-28">{title}</span>
    {/if}

    {#if count && count != 0}
        <!-- Count of unread posts -->

        <!-- When expanded -->
        {#if !$minimize_feeds}
            <div class="flex grow justify-end">
                {count}
            </div>
            <!-- When minimized -->
        {:else if $minimize_feeds}
            <div class="relative inline-block">
                <span
                    class="absolute -top-4 -right-1 bg-red-400 w-2 h-2 inline-flex rounded-full animate-ping opacity-75"
                ></span>
                <span
                    class="absolute -top-4 -right-1 bg-red-400 rounded-full h-2 w-2 text-xs text-slate-50"
                ></span>
            </div>
        {/if}
    {/if}
</li>
