<script>
    import { selected_feed_id, feed_unread_post_count} from "$lib/store";

    let {id, title, url, favicon} = $props();


    const update_feed_id = () =>{
        $selected_feed_id = id
    }

</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore event_directive_deprecated -->
<li class="flex items-center cursor-pointer gap-2 p-2 text-text1 hover:bg-primary2 hover:text-text3
    {
        $selected_feed_id == id ? "bg-primary2 text-text3": ""
    }
    "
    on:click={update_feed_id}
>
    {#if favicon}
        <img
            src={favicon} alt={title}
            class="w-6 h-6 object-cover"
        >
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
        <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z" />
    </svg>
    {/if}
    <span class="text-sm truncate">{title}</span>
    {#if id in $feed_unread_post_count &&  $feed_unread_post_count[id] != 0}
        <div class="flex grow justify-end">
            {$feed_unread_post_count[id]}
        </div>
    {/if}
</li>
