<script>
    import {
        active_feed_id,
        posts_sort_by,
        filter_unread_posts,
        feed_view,
        user_settings,
    } from "$lib/stores/app_store";
    import {
        MODAL_TYPE,
        DB_ORDER_ENUM,
        FEED_VIEW,
        SETTINGS,
    } from "$lib/constants";

    import Fa from "svelte-fa";
    import {
        faSortAlphaAsc,
        faSortAlphaDesc,
        faList,
        faThLarge,
    } from "@fortawesome/free-solid-svg-icons";
    import { refresh_posts } from "../common";

    let sort_by_asending = $state($posts_sort_by == DB_ORDER_ENUM.OLDEST);

    const handleSortDate = async () => {
        if ($posts_sort_by == DB_ORDER_ENUM.NEWEST) {
            $posts_sort_by = DB_ORDER_ENUM.OLDEST;
        } else {
            $posts_sort_by = DB_ORDER_ENUM.NEWEST;
        }
        sort_by_asending = $posts_sort_by == DB_ORDER_ENUM.OLDEST;

        // Pull latest post feeds from DB
        await refresh_posts($active_feed_id);
    };

    const handleChangeOnReadFilter = async () => {
        await refresh_posts($active_feed_id);
    };

    const handleToggleView = async () => {
        $feed_view =
            $feed_view == FEED_VIEW.LIST ? FEED_VIEW.THUMBNAIL : FEED_VIEW.LIST;
        await user_settings.set(SETTINGS.CURRENT_FEED_VIEW, $feed_view);
    };
</script>

<div
    class="sticky top-0 z-10 justify-end bg-base-100 p-2 flex space-x-1 border-b border-base-300"
>
    <div class="m-1 tooltip tooltip-bottom" data-tip="Filter unread">
        <input
            type="checkbox"
            bind:checked={$filter_unread_posts}
            disabled={$active_feed_id == -2}
            onchange={handleChangeOnReadFilter}
            class="checkbox checkbox-sm checkbox-secondary smooth-transition"
        />
    </div>

    <div
        class="tooltip tooltip-bottom"
        data-tip={$feed_view == FEED_VIEW.LIST
            ? "Comfortable view"
            : "Compact view"}
    >
        <button
            onclick={handleToggleView}
            class="btn btn-ghost btn-sm btn-circle p-4 btn-press smooth-transition"
        >
            <Fa
                icon={$feed_view == FEED_VIEW.LIST ? faThLarge : faList}
                size="lg"
            />
        </button>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Sort By">
        <button
            onclick={handleSortDate}
            class="btn btn-ghost btn-sm btn-circle p-4 btn-press smooth-transition"
        >
            <Fa
                title={sort_by_asending ? "Latest First" : "Oldest First"}
                icon={sort_by_asending ? faSortAlphaAsc : faSortAlphaDesc}
                size="lg"
            />
        </button>
    </div>
</div>
