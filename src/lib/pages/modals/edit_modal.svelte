<script lang="ts">
  import type {Feed} from "$lib/types";
  import { active_modal, active_feed_id, active_feed_name, local_user_setting } from "$lib/stores/app_store";
  import { refresh_app_data } from "$lib/pages/home_page/common";
  import { MODAL_TYPE, NO_FEED_SELECTED, FEED_TYPE, TOAST_MESSAGE_TYPE } from "$lib/constants";
  import { fetch_feed_by_id, fetch_folders, update_feed } from "$lib/dao/feed_db";
  import { toastStore } from "$lib/stores/toast_store";

  let save_in_progress = $state(false);
  let feed: Feed = $state({
    favicon: '',
    id: NO_FEED_SELECTED,
    last_refresh_time: '',
    parent: -1,
    type: 0,
    title: '',
    url: '',
    refresh_on_load: false,
  });

  // Update feed id on change
  active_feed_id.subscribe(async (current_feed_id) => {
    if(current_feed_id != NO_FEED_SELECTED)
      feed = await fetch_feed_by_id(current_feed_id);
  });

  const closeModal = () => {
    $active_modal = MODAL_TYPE.NONE;
  };

  const handleEdit = async () => {
    save_in_progress = true;

    try{
      update_feed(feed.id, feed.title, feed.parent, feed.refresh_on_load);
      toastStore.add(TOAST_MESSAGE_TYPE.SUCCESS, "Edit Saved.")
    } catch{
      toastStore.add(TOAST_MESSAGE_TYPE.ERROR, "Edit operation failed.")
    }

    // Refresh App Data
    feed = await fetch_feed_by_id(feed.id);
    await refresh_app_data(true, true);

    // Close Modal
    save_in_progress = false;
    $active_modal = MODAL_TYPE.NONE;
  };
</script>

<dialog
  class="modal"
  class:modal-open={$active_modal == MODAL_TYPE.UPDATE}
>
  <div class="modal-box max-w-md w-full">
    <h3 class="font-bold text-lg">Edit {feed.type == FEED_TYPE.FEED? "Feed": "Folder"}</h3>

    <div class="w-full">
      <fieldset class="fieldset items-center gap-2">
        <!-- URL -->
        <div>
            <!-- <legend class="fieldset-legend">Folder</legend> -->
            <p class="label">Title</p>
        </div>
        <div>
            <input
                type="text"
                class="input  w-full"
                disabled={save_in_progress}
                bind:value={feed.title}
            />
        </div>
    </fieldset>

    {#if feed.type == FEED_TYPE.FEED}
      <fieldset class="fieldset items-center gap-2">
          <!-- URL -->
          <div>
              <!-- <legend class="fieldset-legend">Folder</legend> -->
              <p class="label">URL</p>
          </div>
          <div>
              <input
                  type="text"
                  class="input  w-full"
                  disabled
                  bind:value={feed.url}
              />
          </div>
      </fieldset>

      <fieldset class="fieldset items-center gap-2">
          <!-- URL -->
          <div>
              <!-- <legend class="fieldset-legend">Folder</legend> -->
              <p class="label">Folder</p>
          </div>
          <div>
              <select class="select w-full" bind:value={feed.parent}>
                <option selected value={-1}>Pick a folder</option>
                  {#await fetch_folders() then folders}
                    {#each folders as folder}
                      <option value={folder.id}>{folder.title}</option>
                    {/each}
                  {/await}
              </select>
          </div>
      </fieldset>
      
      {#if $local_user_setting.REFRESH_ALL_FEED_ON_LAUNCH != true}
        <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <!-- Enable on refresh -->
            <div>
              <legend class="fieldset-legend">Load Refresh</legend>
              <p class="label">
                Enable this option to refresh feed when app is launched.
              </p>
            </div>
            <div class="flex justify-end">
              <input
                type="checkbox"
                bind:checked={feed.refresh_on_load}
                class="toggle toggle-success"
              />
            </div>
          </fieldset>
        {/if}

    {/if}

  </div>
    <!-- Buttons -->
    <div class="modal-action">
      <button
        class="btn btn-ghost"
        onclick={closeModal}
        disabled={save_in_progress}>Cancel</button
      >
      <button
        class="btn btn-primary"
        onclick={handleEdit}
        disabled={save_in_progress}
      >
        {#if save_in_progress}
          <span class="loading loading-spinner"></span>
        {/if}
        Update
      </button>
  </div>
</dialog>
