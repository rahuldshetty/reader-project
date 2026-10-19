<script>
    import {
        active_feed_id,
        posts_sort_by,
        filter_unread_posts,
        feed_view,
        is_mobile,
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
        faFilter,
    } from "@fortawesome/free-solid-svg-icons";
    import { refresh_posts } from "../common";
    import { t } from "$lib/i18n";

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

    const handleToggleUnread = async () => {
        $filter_unread_posts = !$filter_unread_posts;
        await handleChangeOnReadFilter();
    };

    const sort_label = $derived(
        $posts_sort_by == DB_ORDER_ENUM.NEWEST
            ? $t("posts.latest_first")
            : $t("posts.oldest_first"),
    );

    const handleToggleView = async () => {
        $feed_view =
            $feed_view == FEED_VIEW.LIST ? FEED_VIEW.THUMBNAIL : FEED_VIEW.LIST;
        await user_settings.set(SETTINGS.CURRENT_FEED_VIEW, $feed_view);
    };
</script>

{#if $is_mobile}
    <div
        class="mobile-scroll sticky top-0 z-20 flex gap-2 overflow-x-auto border-b border-base-300/80 bg-base-100/95 px-3 py-2 backdrop-blur-xl"
    >
        <button
            type="button"
            class="mobile-chip"
            class:mobile-chip-active={$filter_unread_posts}
            disabled={$active_feed_id == -2}
            aria-pressed={$filter_unread_posts}
            onclick={handleToggleUnread}
        >
            <Fa icon={faFilter} size="sm" />
            <span>{$t("posts.filter_unread")}</span>
        </button>

        <button
            type="button"
            class="mobile-chip"
            aria-label={$t("posts.sort_by")}
            onclick={handleSortDate}
        >
            <Fa
                icon={sort_by_asending ? faSortAlphaAsc : faSortAlphaDesc}
                size="sm"
            />
            <span>{sort_label}</span>
        </button>

        <button
            type="button"
            class="mobile-chip ml-auto"
            aria-label={$feed_view == FEED_VIEW.LIST
                ? $t("posts.compact_view")
                : $t("posts.comfortable_view")}
            onclick={handleToggleView}
        >
            <Fa
                icon={$feed_view == FEED_VIEW.LIST ? faList : faThLarge}
                size="sm"
            />
        </button>
    </div>
{:else}
    <div
        class="sticky top-0 z-10 justify-end bg-base-100 p-2 flex space-x-1 border-b border-base-300"
    >
        <div
            class="m-1 tooltip tooltip-bottom"
            data-tip={$t("posts.filter_unread")}
        >
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
                ? $t("posts.comfortable_view")
                : $t("posts.compact_view")}
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

        <div class="tooltip tooltip-bottom" data-tip={$t("posts.sort_by")}>
            <button
                onclick={handleSortDate}
                class="btn btn-ghost btn-sm btn-circle p-4 btn-press smooth-transition"
            >
                <Fa
                    title={sort_by_asending
                        ? $t("posts.latest_first")
                        : $t("posts.oldest_first")}
                    icon={sort_by_asending ? faSortAlphaAsc : faSortAlphaDesc}
                    size="lg"
                />
            </button>
        </div>
    </div>
{/if}
