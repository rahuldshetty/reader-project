<script>
    import { fade, slide } from "svelte/transition";
    import { fetch_posts } from "$lib/db";
    import {
        selected_feed_id,
        feed_unread_post_count,
        posts_sort_by,
        posts_by_feed_store,
        minimize_feeds,
        unread_posts_only
    } from "$lib/store";
    import { NO_OF_POST_PULLS_PER_TIME } from "$lib/constants";

    let { id, title, url, favicon } = $props();

    const count = $derived(
        id != -1
            ? $feed_unread_post_count[id]
            : Object.values($feed_unread_post_count).reduce(
                  (acc, value) => acc + value,
                  0,
              ),
    );

    const update_feed_id = async () => {
        $selected_feed_id = id;
        const posts = await fetch_posts(
            $posts_sort_by,
            null,
            $selected_feed_id,
            0,
            NO_OF_POST_PULLS_PER_TIME,
            $unread_posts_only
        );
        $posts_by_feed_store[$selected_feed_id] = posts;
    };
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore event_directive_deprecated -->
<li
    class="flex items-center cursor-pointer gap-2 p-2 text-text1 hover:bg-primary2 hover:text-text3
    rounded ml-2 mr-2 mt-1
    {$selected_feed_id == id ? 'bg-primary2 text-text3' : ''}
    "
    in:fade={{ delay: 300, duration: 500 }}
    out:slide
    onclick={update_feed_id}
>
    {#if favicon}
        <img src={favicon} alt={title} class="w-6 h-6 object-contain" />
    {:else}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5"
        >
            <path
                d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z"
            />
        </svg>
    {/if}

    {#if !$minimize_feeds}
        <span class="text-sm truncate">{title}</span>
    {/if}

    {#if !$minimize_feeds && count != 0}
        <div class="flex grow justify-end">
            {count}
        </div>
    {/if}
</li>
