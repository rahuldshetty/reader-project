<script>
  import { active_modal } from "$lib/stores/app_store";
  import { refresh_app_data } from "$lib/pages/home_page/common";
  import { MODAL_TYPE, FEED_TYPE, TOAST_MESSAGE_TYPE } from "$lib/constants";
  import { add_feed } from "$lib/dao/feed_db";
  import { toastStore } from "$lib/stores/toast_store";

  let save_in_progress = $state(false);
  let folder_name = $state("");

  const closeModal = () => {
    $active_modal = MODAL_TYPE.NONE;
  };

  const handleAddFolder = async () => {
    save_in_progress = true;

    try {
      await add_feed(folder_name, folder_name, "", FEED_TYPE.FOLDER);
      toastStore.add(TOAST_MESSAGE_TYPE.SUCCESS, "Folder created");
    } catch {
      toastStore.add(
        TOAST_MESSAGE_TYPE.ERROR,
        "Unable to create folder. Please make sure folder doesn't exist.",
      );
    }

    // Refresh App Data
    await refresh_app_data(true, false);

    // Close Modal
    save_in_progress = false;
    $active_modal = MODAL_TYPE.NONE;
    folder_name = "";
  };
</script>

<dialog class="modal" class:modal-open={$active_modal == MODAL_TYPE.ADD_FOLDER}>
  <div class="modal-box max-w-md w-full mx-4">
    <h3 class="font-bold text-lg">Create Folder</h3>

    <div class="w-full">
      <fieldset class="fieldset items-center gap-2">
        <!-- URL -->
        <div>
          <!-- <legend class="fieldset-legend">Folder</legend> -->
          <p class="label">Enter folder name</p>
        </div>
        <div>
          <input
            type="text"
            class="input w-full"
            disabled={save_in_progress}
            bind:value={folder_name}
          />
        </div>
      </fieldset>
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
        onclick={handleAddFolder}
        disabled={save_in_progress || folder_name == ""}
      >
        {#if save_in_progress}
          <span class="loading loading-spinner"></span>
        {/if}
        Create
      </button>
    </div>
  </div>
</dialog>
