<script lang="ts">
    import {
        btn_in_progress,
        feeds_import_data,
    } from "$lib/stores/add_modal_store";
    import { closeAddModal } from "../add_modal_methods";

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
                        onchange={(e: Event) => handleOnClick(e, 1)}
                    />
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
                                <input type="checkbox" class="checkbox" />
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
            onclick={() => {}}
            disabled={$btn_in_progress}
        >
            {#if $btn_in_progress}
                <span class="loading loading-spinner"></span>
            {/if}
            Import
        </button>
    </div>
</div>