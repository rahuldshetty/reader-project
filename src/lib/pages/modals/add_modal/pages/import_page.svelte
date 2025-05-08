<script lang="ts">
    import {
        btn_in_progress,
        feeds_import_data,
    } from "$lib/stores/add_modal_store";
    import { refresh_app_data } from "$lib/pages/home_page/common";
    import { flattenFeedData } from "$lib/services/feed_gather";
    import { add_feed } from "$lib/dao/feed_db";
    import { closeAddModal } from "../add_modal_methods";
    import { FEED_TYPE } from "$lib/constants";

    let feed_id_to_import = $state(new Set());

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
        const flat_feed_data = flattenFeedData($feeds_import_data);

        // TODO: Handle folder creation and storing parent_index map

        for(const feed of flat_feed_data){
            if(!('children' in feed)){
                await add_feed(
                    feed.name,
                    feed.url,
                    feed.icon,
                    FEED_TYPE.FEED
                );
            }
            // TODO: Add post data into DB while addition
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
        {#each $feeds_import_data as import_data}
            <div class="rounded max-h-xl">
                <div class="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        class="checkbox"
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
                <ul class="ml-6 mt-2 space-y-2">
                    {#if "children" in import_data}
                        {#each import_data.children as child_import_data}
                            <li class="flex items-center space-x-2">
                                <input type="checkbox" class="checkbox"
                                    onchange={(e: Event) => handleOnClick(e, child_import_data.id)}
                                />
                                {#if 'icon' in import_data}
                                    <img class="w-6 h-6 object-cover" src={child_import_data.icon} alt={import_data.name} />
                                {/if}
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    class="input"
                                    bind:value={child_import_data.name}
                                />
                            </li>
                        {/each}
                    {/if}
                </ul>
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