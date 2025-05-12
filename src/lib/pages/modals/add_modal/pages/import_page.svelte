<script lang="ts">
    import {
        btn_in_progress,
        feeds_import_data,
    } from "$lib/stores/add_modal_store";
    import { refresh_app_data } from "$lib/pages/home_page/common";
    import { fetchFeedDataFromURL, flattenFeedData } from "$lib/services/feed_gather";
    import { add_feed, fetch_folders } from "$lib/dao/feed_db";
    import { closeAddModal } from "../add_modal_methods";
    import { FEED_TYPE } from "$lib/constants";
    import { onDestroy, onMount } from "svelte";
    import type { FeedMetadata, FeedMetadataFolder } from "$lib/types";
    import { parseFeedDatafromOPML } from "$lib/services/opml_gather";

    let feed_metadata_imports: (FeedMetadata | FeedMetadataFolder)[] = $state([]);
    let feed_id_to_import = $state(new Set());

    const unsubscribe = feeds_import_data.subscribe(async (data)=>{
        btn_in_progress.set(true);
        if(data == '')
            return;
        if(data.startsWith('http')){
            feed_metadata_imports = await fetchFeedDataFromURL(data);
        } else {
            feed_metadata_imports = await parseFeedDatafromOPML(data);
        }
        btn_in_progress.set(false);
    });

    onDestroy(unsubscribe);

    const handleOnClick = (e: Event, index: number) => {
        const checked = (e.target as HTMLInputElement).checked;
        if(checked){
            feed_id_to_import.add(index);
        } else {
            feed_id_to_import.delete(index);
        }
        feed_id_to_import = new Set(feed_id_to_import);
    };

    const handleAddFeedToDB = async () => {
        $btn_in_progress = true;

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
                    await add_feed(
                        feed.name,
                        feed.url,
                        feed.icon,
                        FEED_TYPE.FEED
                    );
                }
            }
        }

        // Add feeds to DB which are inside folders
        for(const folder of feed_metadata_imports){
            if('children' in folder){
                const parent_id = map_folder_name_to_id[folder.name];
                for(const feed of folder.children){
                    if(feed_id_to_import.has(feed.id)){
                        await add_feed(
                            feed.name,
                            feed.url,
                            feed.icon,
                            FEED_TYPE.FEED,
                            parent_id
                        );
                    }
                }
            }
        }

        // Refresh App Data
        await refresh_app_data();

        // Close modal once operation is done.
        closeAddModal();
    }
</script>

<div>
    <div>
        <p class="prose prose-sm">Select feeds to import.</p>
    </div>

    <div class="flex flex-col gap-2 mt-4">
        {#each feed_metadata_imports as import_data}
            <div class="rounded max-h-xl">
                <div class="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        class="checkbox"
                        checked={"children" in import_data}
                        disabled={"children" in import_data}
                        onchange={(e: Event) => handleOnClick(e, import_data.id)}
                    />
                    {#if 'icon' in import_data}
                        <img class="w-6 h-6 object-cover" src={import_data.icon} alt={import_data.name} />
                    {/if}
                    <input
                        type="text"
                        placeholder="Type here"
                        class="input"
                        bind:value={import_data.name}
                    />
                </div>
                    {#if 'children' in import_data}
                        <ul class="ml-6 mt-2 space-y-2">
                            {#each import_data.children as child_import_data (child_import_data.id)}
                                <li class="flex items-center space-x-2">
                                    <input type="checkbox" class="checkbox"
                                        onchange={(e: Event) => handleOnClick(e, child_import_data.id)}
                                    />
                                    {#if 'icon' in child_import_data}
                                        <img class="w-6 h-6 object-cover" src={child_import_data.icon} alt={child_import_data.name} />
                                    {/if}
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        class="input"
                                        bind:value={child_import_data.name}
                                    />
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
            disabled={$btn_in_progress}>Cancel</button
        >
        <button
            class="btn btn-primary"
            onclick={handleAddFeedToDB}
            disabled={$btn_in_progress || feed_id_to_import.size == 0}
        >
            {#if $btn_in_progress}
                <span class="loading loading-spinner"></span>
            {/if}
            Import
        </button>
    </div>
</div>