<script lang="ts">
    import Fa from "svelte-fa";
    import {
        faChevronRight,
        faCompass,
        faFolder,
        faNewspaper,
        faRss,
        faStar,
        faXmark,
    } from "@fortawesome/free-solid-svg-icons";
    import {
        active_feed_id,
        active_post_id,
        active_screen,
        feed_count_by_id,
        feeds_store,
        is_mobile,
        local_user_setting,
        mobile_drawer_open,
        open_folder_ids,
    } from "$lib/stores/app_store";
    import { FEED_TYPE, SCREEN } from "$lib/constants";
    import { select_feed } from "$lib/pages/home_page/common";
    import type { FeedResult } from "$lib/types";
    import { t } from "$lib/i18n";

    const close = () => mobile_drawer_open.set(false);

    const handle_keydown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && $mobile_drawer_open) close();
    };

    // All Posts (-1) and Favourites (-2) are fixed; folders and unfiled feeds
    // follow the order configured from Settings.
    const ordered_items = $derived.by(() => {
        const hidden = new Set($local_user_setting.SIDE_PANEL.HIDDEN_IDS);
        const by_id = new Map($feeds_store.map((feed) => [feed.id, feed]));
        const result: FeedResult[] = [];

        for (const id of $local_user_setting.SIDE_PANEL.ORDER) {
            const feed = by_id.get(id);
            if (!feed) continue;
            result.push(feed);
            by_id.delete(id);
        }
        for (const feed of $feeds_store) {
            if (by_id.has(feed.id)) result.push(feed);
        }

        return result.filter((feed) => !hidden.has(feed.id));
    });

    const hidden_ids = $derived(
        new Set($local_user_setting.SIDE_PANEL.HIDDEN_IDS),
    );

    const all_unread = $derived(
        Object.values($feed_count_by_id ?? {}).reduce(
            (total, count) => total + count,
            0,
        ),
    );

    const select_source = (id: number) => {
        close();
        active_screen.set(SCREEN.FEEDS);
        active_post_id.set(-1);
        void select_feed(id);
    };

    const open_browse = () => {
        close();
        active_post_id.set(-1);
        active_screen.set(SCREEN.BROWSE);
    };

    const toggle_folder = (id: number) => {
        open_folder_ids.update((ids) => {
            const next = new Set(ids);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };
</script>

<svelte:window onkeydown={handle_keydown} />

{#if $is_mobile && $mobile_drawer_open}
    <div class="fixed inset-0 z-[70]">
        <button
            type="button"
            class="absolute inset-0 h-full w-full bg-base-content/30 backdrop-blur-[2px]"
            aria-label={$t("common.close")}
            onclick={close}
        ></button>

        <div
            class="animate-slide-in-left relative flex h-full w-[min(86vw,20rem)] flex-col border-r border-base-300 bg-base-100 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={$t("nav.menu")}
        >
            <div
                class="mobile-appbar flex min-h-16 items-center justify-between border-b border-base-300/80 px-4"
            >
                <span class="text-lg font-semibold tracking-tight"
                    >Reader Project</span
                >
                <button
                    type="button"
                    class="btn btn-ghost btn-circle h-10 w-10"
                    onclick={close}
                    aria-label={$t("common.close")}
                >
                    <Fa icon={faXmark} size="lg" />
                </button>
            </div>

            <div class="mobile-scroll flex-1 overflow-y-auto px-2 py-2">
                <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors {$active_screen ===
                        SCREEN.FEEDS && $active_feed_id === -1
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-base-content/80'}"
                    onclick={() => select_source(-1)}
                >
                    <Fa icon={faNewspaper} size="lg" />
                    <span class="min-w-0 flex-1 truncate"
                        >{$t("nav.all_posts")}</span
                    >
                    {#if all_unread > 0}
                        <span
                            class="min-w-5 rounded-full bg-base-200 px-1.5 py-0.5 text-center text-[10px] font-medium leading-none text-base-content/60"
                            >{all_unread > 999 ? "999+" : all_unread}</span
                        >
                    {/if}
                </button>

                <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors {$active_screen ===
                        SCREEN.FEEDS && $active_feed_id === -2
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-base-content/80'}"
                    onclick={() => select_source(-2)}
                >
                    <Fa icon={faStar} size="lg" />
                    <span class="min-w-0 flex-1 truncate"
                        >{$t("nav.my_favourites")}</span
                    >
                </button>

                <button
                    type="button"
                    class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors {$active_screen ===
                        SCREEN.BROWSE
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-base-content/80'}"
                    onclick={open_browse}
                >
                    <Fa icon={faCompass} size="lg" />
                    <span class="min-w-0 flex-1 truncate"
                        >{$t("nav.browse")}</span
                    >
                </button>

                <div class="divider my-1"></div>

                {#if ordered_items.length === 0}
                    <p
                        class="px-4 py-8 text-center text-sm text-base-content/50"
                    >
                        {$feeds_store.length === 0
                            ? $t("nav.no_feeds")
                            : $t("settings.side_panel.hint")}
                    </p>
                {/if}

                {#each ordered_items as item (item.id)}
                    {@const item_unread =
                        item.type == FEED_TYPE.FOLDER
                            ? (item.children ?? []).reduce(
                                  (sum, child) =>
                                      sum + ($feed_count_by_id[child.id] ?? 0),
                                  0,
                              )
                            : ($feed_count_by_id[item.id] ?? 0)}
                    {#if item.type == FEED_TYPE.FOLDER}
                        <div
                            class="mt-0.5 flex items-center rounded-xl transition-colors {$active_screen ===
                                SCREEN.FEEDS && $active_feed_id === item.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-base-content/80'}"
                        >
                            <button
                                type="button"
                                class="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left {$active_screen ===
                                    SCREEN.FEEDS && $active_feed_id === item.id
                                    ? 'font-medium'
                                    : ''}"
                                onclick={() => select_source(item.id)}
                            >
                                <Fa icon={faFolder} size="lg" />
                                <span class="min-w-0 flex-1 truncate"
                                    >{item.title}</span
                                >
                                {#if item_unread > 0}
                                    <span
                                        class="min-w-5 rounded-full bg-base-200 px-1.5 py-0.5 text-center text-[10px] font-medium leading-none text-base-content/60"
                                        >{item_unread > 999
                                            ? "999+"
                                            : item_unread}</span
                                    >
                                {/if}
                            </button>
                            <button
                                type="button"
                                class="btn btn-ghost btn-circle mr-1 h-9 w-9 shrink-0"
                                aria-label={item.title}
                                aria-expanded={$open_folder_ids.has(item.id)}
                                onclick={() => toggle_folder(item.id)}
                            >
                                <Fa
                                    icon={faChevronRight}
                                    size="sm"
                                    class="transition-transform {$open_folder_ids.has(
                                        item.id,
                                    )
                                        ? 'rotate-90'
                                        : ''}"
                                />
                            </button>
                        </div>

                        {#if $open_folder_ids.has(item.id)}
                            {#each (item.children ?? []).filter(
                                (child) => !hidden_ids.has(child.id),
                            ) as child (child.id)}
                                <button
                                    type="button"
                                    class="flex w-full items-center gap-3 rounded-xl py-2.5 pl-12 pr-3 text-left transition-colors {$active_screen ===
                                        SCREEN.FEEDS &&
                                    $active_feed_id === child.id
                                        ? 'bg-primary/10 font-medium text-primary'
                                        : 'text-base-content/75'}"
                                    onclick={() => select_source(child.id)}
                                >
                                    <Fa icon={faRss} size="sm" />
                                    <span class="min-w-0 flex-1 truncate"
                                        >{child.title}</span
                                    >
                                    {#if ($feed_count_by_id[child.id] ?? 0) > 0}
                                        <span
                                            class="min-w-5 rounded-full bg-base-200 px-1.5 py-0.5 text-center text-[10px] font-medium leading-none text-base-content/60"
                                            >{($feed_count_by_id[child.id] ??
                                                0) > 999
                                                ? "999+"
                                                : $feed_count_by_id[child.id]}</span
                                        >
                                    {/if}
                                </button>
                            {/each}
                        {/if}
                    {:else}
                        <button
                            type="button"
                            class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors {$active_screen ===
                                SCREEN.FEEDS && $active_feed_id === item.id
                                ? 'bg-primary/10 font-medium text-primary'
                                : 'text-base-content/80'}"
                            onclick={() => select_source(item.id)}
                        >
                            <Fa icon={faRss} size="lg" />
                            <span class="min-w-0 flex-1 truncate"
                                >{item.title}</span
                            >
                            {#if item_unread > 0}
                                <span
                                    class="min-w-5 rounded-full bg-base-200 px-1.5 py-0.5 text-center text-[10px] font-medium leading-none text-base-content/60"
                                    >{item_unread > 999
                                        ? "999+"
                                        : item_unread}</span
                                >
                            {/if}
                        </button>
                    {/if}
                {/each}
            </div>
        </div>
    </div>
{/if}
