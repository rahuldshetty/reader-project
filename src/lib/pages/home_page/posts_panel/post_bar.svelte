<script>
    import { active_feed_id, posts_sort_by, filter_unread_posts } from "$lib/stores/app_store";
    import { MODAL_TYPE, DB_ORDER_ENUM } from "$lib/constants";

    import Fa from "svelte-fa";
    import {
        faSortAlphaAsc,
        faSortAlphaDesc,
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
    }
</script>

<div
    class="sticky top-0 z-10 justify-end bg-base-100 p-2 flex space-x-1 border-b border-base-300"
>   
    <div class="m-1 tooltip" data-tip="Filter unread">
        <input type="checkbox" bind:checked={$filter_unread_posts} disabled={$active_feed_id == -2} onchange={handleChangeOnReadFilter} class="checkbox checkbox-sm checkbox-secondary" />
    </div>

    <div class="tooltip" data-tip="Sort By">
        <button
            onclick={handleSortDate}
            class="btn btn-ghost btn-sm btn-circle p-4"
        >
            <Fa
                title={sort_by_asending ? "Latest First" : "Oldest First"}
                icon={sort_by_asending ? faSortAlphaAsc : faSortAlphaDesc}
                size="lg"
            />
        </button>
    </div>
</div>
