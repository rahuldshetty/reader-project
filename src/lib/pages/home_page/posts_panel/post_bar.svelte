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
        faCheck,
        faFilter,
        faList,
        faSliders,
        faSortAlphaAsc,
        faSortAlphaDesc,
        faThLarge,
    } from "@fortawesome/free-solid-svg-icons";
    import { refresh_active_posts } from "../common";
    import { t } from "$lib/i18n";

    let sort_by_asending = $state($posts_sort_by == DB_ORDER_ENUM.OLDEST);
    let filter_menu_open = $state(false);

    const close_filter_menu = () => {
        filter_menu_open = false;
    };

    const handleSortDate = async () => {
        if ($posts_sort_by == DB_ORDER_ENUM.NEWEST) {
            $posts_sort_by = DB_ORDER_ENUM.OLDEST;
        } else {
            $posts_sort_by = DB_ORDER_ENUM.NEWEST;
        }
        sort_by_asending = $posts_sort_by == DB_ORDER_ENUM.OLDEST;

        // Pull latest post feeds from DB
        await refresh_active_posts();
    };

    const handleChangeOnReadFilter = async () => {
        await refresh_active_posts();
    };

    const handleToggleUnread = async () => {
        $filter_unread_posts = !$filter_unread_posts;
        await handleChangeOnReadFilter();
    };

    const handleToggleUnreadFromMenu = async () => {
        close_filter_menu();
        await handleToggleUnread();
    };

    const handleSortFromMenu = async () => {
        close_filter_menu();
        await handleSortDate();
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

    const handleToggleViewFromMenu = async () => {
        close_filter_menu();
        await handleToggleView();
    };
</script>

{#if $is_mobile}
    <div class="relative z-30 shrink-0">
        <button
            type="button"
            class="btn btn-ghost btn-circle relative h-10 w-10"
            aria-label={$t("posts.filters")}
            aria-expanded={filter_menu_open}
            onclick={() => (filter_menu_open = !filter_menu_open)}
        >
            <Fa icon={faSliders} size="lg" />
            {#if $filter_unread_posts}
                <span
                    class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary"
                ></span>
            {/if}
        </button>

        {#if filter_menu_open}
            <button
                type="button"
                class="fixed inset-0 z-20 cursor-default"
                aria-label={$t("common.close")}
                onclick={close_filter_menu}
            ></button>
            <div
                class="absolute right-0 top-11 z-30 w-60 rounded-box border border-base-300 bg-base-100 p-1 shadow-xl"
            >
                <button
                    type="button"
                    class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-base-200 disabled:opacity-40"
                    disabled={$active_feed_id == -2}
                    aria-pressed={$filter_unread_posts}
                    onclick={handleToggleUnreadFromMenu}
                >
                    <Fa icon={faFilter} size="sm" />
                    <span class="min-w-0 flex-1 truncate"
                        >{$t("posts.filter_unread")}</span
                    >
                    {#if $filter_unread_posts}
                        <Fa icon={faCheck} size="sm" class="text-primary" />
                    {/if}
                </button>

                <button
                    type="button"
                    class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-base-200"
                    onclick={handleSortFromMenu}
                >
                    <Fa
                        icon={sort_by_asending
                            ? faSortAlphaAsc
                            : faSortAlphaDesc}
                        size="sm"
                    />
                    <span class="min-w-0 flex-1 truncate">{sort_label}</span>
                </button>

                <button
                    type="button"
                    class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-base-200"
                    onclick={handleToggleViewFromMenu}
                >
                    <Fa
                        icon={$feed_view == FEED_VIEW.LIST ? faList : faThLarge}
                        size="sm"
                    />
                    <span class="min-w-0 flex-1 truncate"
                        >{$feed_view == FEED_VIEW.LIST
                            ? $t("posts.comfortable_view")
                            : $t("posts.compact_view")}</span
                    >
                </button>
            </div>
        {/if}
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
