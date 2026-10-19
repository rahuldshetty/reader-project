<script>
    import {
        active_modal,
        active_post_id,
        is_mobile,
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
    import { t } from "$lib/i18n";

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

{#if $is_mobile}
    <div
        class="mobile-bar-top sticky top-0 z-20 border-b border-base-300/80 bg-base-100/95 px-3 pb-2 backdrop-blur-xl"
    >
        <div class="flex items-center gap-0.5 pb-2">
            <h1 class="grow px-1 text-2xl font-bold tracking-tight">
                {$t("nav.feeds")}
            </h1>

            <button
                type="button"
                onclick={handleNewFolder}
                class="btn btn-ghost btn-circle h-11 w-11"
                aria-label={$t("feed.new_folder")}
            >
                <Fa icon={faFolderPlus} size="lg" />
            </button>

            <button
                type="button"
                onclick={handleRefresh}
                class="btn btn-ghost btn-circle h-11 w-11"
                aria-label={$t("feed.refresh")}
                aria-busy={$refreshing_feeds}
                disabled={$refreshing_feeds}
            >
                <Fa
                    icon={faRefresh}
                    size="lg"
                    class={$refreshing_feeds ? "animate-spin" : ""}
                />
            </button>
        </div>

        <FeedSearch />
    </div>
{:else}
    <div
        class="sticky top-0 z-10 flex justify-end space-x-1 border-b border-base-300 bg-base-100 p-2"
    >
        <FeedSearch />

        <div class="tooltip tooltip-bottom" data-tip={$t("feed.new_folder")}>
            <button
                onclick={handleNewFolder}
                class="btn btn-ghost btn-sm btn-circle p-4 btn-press smooth-transition"
            >
                <Fa icon={faFolderPlus} size="lg" />
            </button>
        </div>

        <div class="tooltip tooltip-bottom" data-tip={$t("feed.refresh")}>
            <button
                onclick={handleRefresh}
                class="btn btn-ghost btn-sm btn-circle p-4 btn-press smooth-transition"
            >
                <Fa icon={faRefresh} size="lg" />
            </button>
        </div>
    </div>
{/if}
