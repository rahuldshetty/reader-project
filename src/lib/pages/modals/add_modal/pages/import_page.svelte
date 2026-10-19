<script lang="ts">
    import {
        btn_in_progress,
        feeds_import_data,
        feeds_import_items,
        skip_data_load_on_import
    } from "$lib/stores/add_modal_store";
    import { refresh_app_data } from "$lib/pages/home_page/common";
    import { fetchFeedDataFromURL, flattenFeedData } from "$lib/services/feed_gather";
    import { add_feed, fetch_feed_urls, fetch_folders } from "$lib/dao/feed_db";
    import { closeAddModal } from "../add_modal_methods";
    import { t, translate } from "$lib/i18n";
    import { FEED_TYPE, TOAST_MESSAGE_TYPE } from "$lib/constants";
    import { toastStore } from "$lib/stores/toast_store";
    import { onDestroy } from "svelte";
    import type { FeedMetadata, FeedMetadataFolder } from "$lib/types";
    import { parseFeedDatafromOPML } from "$lib/services/opml_gather";

    let feed_metadata_imports: (FeedMetadata | FeedMetadataFolder)[] = $state([]);
    let feed_id_to_import = $state(new Set<number>());
    let existing_urls = $state(new Set<string>());
    let selectable_ids = $state<number[]>([]);

    // Feeds that are already subscribed cannot be inserted again: feeds.url is
    // UNIQUE, so they are disabled in the preview and skipped on import.
    const is_existing = (feed: FeedMetadata) => existing_urls.has(feed.url);

    const collect_selectable_ids = (
        items: (FeedMetadata | FeedMetadataFolder)[],
    ): number[] => {
        const ids: number[] = [];
        for (const item of items) {
            if ("children" in item) {
                for (const child of item.children) {
                    if (!is_existing(child)) ids.push(child.id);
                }
            } else if (!is_existing(item)) {
                ids.push(item.id);
            }
        }
        return ids;
    };

    const apply_items = (items: (FeedMetadata | FeedMetadataFolder)[]) => {
        feed_metadata_imports = items;
        feed_id_to_import = new Set();
        selectable_ids = collect_selectable_ids(items);
    };

    const load_existing = async () => {
        existing_urls = await fetch_feed_urls();
    };

    const unsubscribe_data = feeds_import_data.subscribe(async (data) => {
        if (data == '') return;
        btn_in_progress.set(true);
        try {
            await load_existing();
            if (data.startsWith('http')) {
                apply_items(await fetchFeedDataFromURL(data));
            } else {
                const result = await parseFeedDatafromOPML(data, $skip_data_load_on_import);
                apply_items(result.items);
            }
        } finally {
            btn_in_progress.set(false);
        }
    });

    const unsubscribe_prepared = feeds_import_items.subscribe(async (items) => {
        if (!items || items.length === 0) return;
        btn_in_progress.set(true);
        try {
            await load_existing();
            apply_items(items);
        } finally {
            btn_in_progress.set(false);
        }
    });

    onDestroy(() => {
        unsubscribe_data();
        unsubscribe_prepared();
    });

    const handleOnClick = (feed: FeedMetadata) => {
        if (is_existing(feed)) return;
        const is_present = feed_id_to_import.has(feed.id);
        if (!is_present) {
            feed_id_to_import.add(feed.id);
        } else {
            feed_id_to_import.delete(feed.id);
        }
        feed_id_to_import = new Set(feed_id_to_import);
    };

    const handleSelectAll = (e: Event) => {
        const checked = (e.target as HTMLInputElement).checked;
        if (checked) {
            feed_id_to_import = new Set(selectable_ids);
        } else {
            feed_id_to_import = new Set();
        }
    };

    const handleAddFeedToDB = async () => {
        $btn_in_progress = true;
        let failures = 0;

        const try_add_feed = async (
            title: string,
            url: string,
            icon: string,
            parent?: number,
        ) => {
            if (existing_urls.has(url)) return;
            try {
                await add_feed(title, url, icon, FEED_TYPE.FEED, parent);
            } catch (error) {
                failures++;
                console.log(`|| Failed to import feed ${url}: ${error} ||`);
            }
        };

        // Flatten feeds import data
        const flat_feed_data = flattenFeedData(feed_metadata_imports);

        // Mapping to folder.name to folder.id
        let map_folder_name_to_id: Record<string, number> = {};

        // Bring existing folder names to context to avoid re-writes
        const existing_folders = await fetch_folders();
        for(const folder of existing_folders){
            map_folder_name_to_id[folder.title] = folder.id;
        }

        // Create all folders
        for(const folder of flat_feed_data){
            if('children' in folder){
                // Add folder to DB if doesn't exist
                if(!(folder.name in map_folder_name_to_id)){
                    const id = await add_feed(
                        folder.name,
                        folder.name,
                        '',
                        FEED_TYPE.FOLDER
                    );
                    if(id)
                        map_folder_name_to_id[folder.name] = id;
                }
            }
        }

         // Only create feed at root level
        for(const feed of feed_metadata_imports){
            if(!('children' in feed)){
                if(feed_id_to_import.has(feed.id)){
                    await try_add_feed(feed.name, feed.url, feed.icon);
                }
            }
        }

        // Add feeds to DB which are inside folders
        for(const folder of feed_metadata_imports){
            if('children' in folder){
                const parent_id = map_folder_name_to_id[folder.name];
                for(const feed of folder.children){
                    if(feed_id_to_import.has(feed.id)){
                        await try_add_feed(
                            feed.name,
                            feed.url,
                            feed.icon,
                            parent_id,
                        );
                    }
                }
            }
        }

        // Refresh App Data
        await refresh_app_data();

        if (failures > 0) {
            toastStore.add(
                TOAST_MESSAGE_TYPE.ERROR,
                translate("toast.import_partial"),
            );
        }

        // Close modal once operation is done.
        closeAddModal();
    }
</script>

<div>
    <div>
        <p class="prose prose-sm">{$t("modal.select_feeds")}</p>
    </div>

    <div class="flex flex-col gap-2 mt-4 max-h-[400px] overflow-y-auto pr-2">
        <div class="flex items-center space-x-2">
            <input
                type="checkbox"
                class="checkbox"
                checked={selectable_ids.length > 0 && feed_id_to_import.size === selectable_ids.length}
                onchange={(e: Event) => handleSelectAll(e)}
            />
            <span>{$t("modal.select_all")}</span>
        </div>
        {#each feed_metadata_imports as import_data}
            {@const is_folder = "children" in import_data}
            {@const item_is_existing = !("children" in import_data) && is_existing(import_data)}
            <div class="rounded max-h-xl">
                <div class="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        class="checkbox"
                        checked={is_folder || (!item_is_existing && feed_id_to_import.has(import_data.id))}
                        disabled={is_folder || item_is_existing}
                        onchange={() => {
                            if (!("children" in import_data)) handleOnClick(import_data);
                        }}
                    />
                    {#if 'icon' in import_data && import_data.icon != ''}
                        <img class="w-6 h-6 object-cover" src={import_data.icon} alt={import_data.name} />
                    {/if}
                    <input
                        type="text"
                        placeholder="Type here"
                        class="input"
                        bind:value={import_data.name}
                    />
                    {#if item_is_existing}
                        <span class="badge badge-ghost badge-sm shrink-0">
                            {$t("share.already_added")}
                        </span>
                    {/if}
                </div>
                    {#if 'children' in import_data}
                        <ul class="ml-6 mt-2 space-y-2">
                            {#each import_data.children as child_import_data (child_import_data.id)}
                                {@const child_is_existing = is_existing(child_import_data)}
                                <li class="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        class="checkbox"
                                        checked={!child_is_existing && feed_id_to_import.has(child_import_data.id)}
                                        disabled={child_is_existing}
                                        onchange={() => handleOnClick(child_import_data)}
                                    />
                                    {#if 'icon' in child_import_data && child_import_data.icon != ''}
                                        <img class="w-6 h-6 object-cover" src={child_import_data.icon} alt={child_import_data.name} />
                                    {/if}
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        class="input"
                                        bind:value={child_import_data.name}
                                    />
                                    {#if child_is_existing}
                                        <span class="badge badge-ghost badge-sm shrink-0">
                                            {$t("share.already_added")}
                                        </span>
                                    {/if}
                                </li>
                            {/each}
                        </ul>
                    {/if}
            </div>
        {/each}
    </div>
    <div class="modal-action">
        <button
            class="btn btn-ghost"
            onclick={closeAddModal}
            disabled={$btn_in_progress}>{$t("common.cancel")}</button
        >
        <button
            class="btn btn-primary"
            onclick={handleAddFeedToDB}
            disabled={$btn_in_progress || feed_id_to_import.size == 0}
        >
            {#if $btn_in_progress}
                <span class="loading loading-spinner"></span>
            {/if}
            {$t("common.import")}
        </button>
    </div>
</div>
