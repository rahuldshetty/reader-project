<script lang="ts">
    import FeedEditButton from "./feed_edit_button.svelte";

    import { active_feed_id } from "$lib/dao/store";
    import { FEED_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolder } from "@fortawesome/free-solid-svg-icons";

    let { favicon, title, id, type } = $props();

    const handleFeedSelect = () => {
        $active_feed_id = id;
    };
</script>

{#if type == FEED_TYPE.FOLDER}
    <!-- TODO: Handle selection of folders  -->
    <summary class="p-2">
        <Fa icon={faFolder} size="lg" />
        {title}
        <FeedEditButton {title} {id} {type} />
    </summary>
{:else}
    <li onclick={handleFeedSelect}>
        <div class="p-2 {$active_feed_id == id ? 'menu-active' : ''}">
            {#if favicon}
                <img class="w-6 h-6 object-cover" src={favicon} alt={title} />
            {/if}
            <span class="truncate">{title}</span>
            <FeedEditButton {title} {id} {type} />
        </div>
    </li>
{/if}
