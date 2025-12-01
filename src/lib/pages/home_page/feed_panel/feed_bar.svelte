<script>
    import {
        active_modal,
        active_post_id,
        refreshing_feeds,
    } from "$lib/stores/app_store";
    import { MODAL_TYPE } from "$lib/constants";

    import Fa from "svelte-fa";
    import { faFolderPlus, faRefresh } from "@fortawesome/free-solid-svg-icons";
    import {
        pull_feed_and_refresh_post_data,
        refresh_app_data,
    } from "../common";
    import FeedSearch from "./feed_search.svelte";

    const handleNewFolder = () => {
        $active_modal = MODAL_TYPE.ADD_FOLDER;
    };

    const handleRefresh = async () => {
        refreshing_feeds.set(true);
        active_post_id.set(-1);
        // TODO: Takes too much time to refresh post data from feed link
        // await pull_feed_and_refresh_post_data();
        await refresh_app_data();
    };
</script>

<div
    class="sticky top-0 z-10 justify-end bg-base-100 p-2 flex space-x-1 border-b border-base-300"
>
    <FeedSearch />

    <div class="tooltip" data-tip="Create a new folder">
        <button
            onclick={handleNewFolder}
            class="btn btn-ghost btn-sm btn-circle p-4 btn-press smooth-transition"
        >
            <Fa icon={faFolderPlus} size="lg" />
        </button>
    </div>

    <div class="tooltip" data-tip="Refresh Feed">
        <button
            onclick={handleRefresh}
            class="btn btn-ghost btn-sm btn-circle p-4 btn-press smooth-transition"
        >
            <Fa icon={faRefresh} size="lg" />
        </button>
    </div>
    <!-- <button class="btn btn-ghost btn-sm btn-circle p-4">
        <Fa icon={faFolderPlus} size="lg"/>
    </button> -->
</div>
