<script lang="ts">
    import {
        active_feed_id,
        feed_count_by_id,
        feeds_store,
    } from "$lib/stores/app_store";
    import { select_feed } from "$lib/pages/home_page/common";
    import { t } from "$lib/i18n";

    type FeedTab = {
        id: number;
        title: string;
        count: number;
    };

    const all_unread = $derived(
        Object.values($feed_count_by_id ?? {}).reduce(
            (total, count) => total + count,
            0,
        ),
    );

    const tabs = $derived.by(() => {
        const items: FeedTab[] = [
            { id: -1, title: $t("nav.all_posts"), count: all_unread },
            { id: -2, title: $t("nav.my_favourites"), count: 0 },
        ];

        for (const feed of $feeds_store) {
            items.push({
                id: feed.id,
                title: feed.title,
                count: $feed_count_by_id?.[feed.id] ?? 0,
            });
            for (const child of feed.children ?? []) {
                items.push({
                    id: child.id,
                    title: child.title,
                    count: $feed_count_by_id?.[child.id] ?? 0,
                });
            }
        }

        return items;
    });

    const is_active = (id: number) => $active_feed_id === id;

    const open_feed = (id: number) => {
        void select_feed(id);
    };

    let tab_strip: HTMLDivElement;

    // Keep the selected source visible when returning to the feed screen.
    $effect(() => {
        $active_feed_id;
        const active = tab_strip?.querySelector<HTMLElement>(
            '[aria-current="page"]',
        );
        active?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    });
</script>

<!-- Google News style horizontal source tabs. The list below remains the
     management surface for editing, refreshing, and deleting feeds. -->
<div class="shrink-0 border-b border-base-300/80 bg-base-100">
    <div class="mobile-scroll flex overflow-x-auto px-2" bind:this={tab_strip}>
        {#each tabs as tab (tab.id)}
            <button
                type="button"
                class="relative flex h-12 shrink-0 items-center gap-1.5 px-3 text-sm transition-colors {is_active(
                    tab.id,
                )
                    ? 'font-semibold text-primary'
                    : 'text-base-content/65'}"
                onclick={() => open_feed(tab.id)}
                aria-current={is_active(tab.id) ? "page" : undefined}
                title={tab.title}
            >
                <span class="max-w-40 truncate">{tab.title}</span>
                {#if tab.count > 0}
                    <span
                        class="min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-medium leading-none {is_active(
                            tab.id,
                        )
                            ? 'bg-primary/15 text-primary'
                            : 'bg-base-200 text-base-content/60'}"
                    >
                        {tab.count > 999 ? "999+" : tab.count}
                    </span>
                {/if}
                {#if is_active(tab.id)}
                    <span
                        class="absolute inset-x-2 bottom-0 h-0.5 rounded-t-full bg-primary"
                    ></span>
                {/if}
            </button>
        {/each}
    </div>
</div>
