<script lang="ts">
    import FeedEditButton from "./feed_edit_button.svelte";

    import { 
        active_feed_id,
        active_feed_name,
    } from "$lib/stores/app_store";
    import { FEED_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolder } from "@fortawesome/free-solid-svg-icons";
    import { refresh_posts } from "$lib/pages/home_page/common";

    let { favicon, title, id, type } = $props();

    const handleFeedSelect = async () => {
        if(type == FEED_TYPE.FEED){
            await refresh_posts(id);
        } 
        $active_feed_id = id;
        $active_feed_name = title;
    };
</script>

{#if type == FEED_TYPE.FOLDER}
    <!-- TODO: Handle selection of folders  -->
    <summary class="m-0.5" onclick={handleFeedSelect}>
        <Fa icon={faFolder} size="lg" />
        {title}
        <FeedEditButton {title} {id} {type} />
    </summary>
{:else}
    <li onclick={handleFeedSelect}>
        <div class="m-0.5 {$active_feed_id == id ? 'menu-active' : ''}">
            {#if favicon}
                <img class="w-6 h-6 object-cover" src={favicon} alt={title} />
            {/if}
            <span class="truncate">{title}</span>
            <FeedEditButton {title} {id} {type} />
        </div>
    </li>
{/if}
