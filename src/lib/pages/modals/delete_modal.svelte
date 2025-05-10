<script>
  import {
    active_modal,
    active_feed_id,
    active_feed_name,
  } from "$lib/stores/app_store";
  import { refresh_app_data } from "$lib/pages/home_page/common";
  import { MODAL_TYPE } from "$lib/constants";
  import { delete_feed } from "$lib/dao/feed_db";

  let save_in_progress = $state(false);

  const closeModal = () => {
    $active_modal = MODAL_TYPE.NONE;
  };

  const handleDeleteFeed = async () => {
    save_in_progress = true;

    await delete_feed($active_feed_id);

    // Refresh App Data
    await refresh_app_data();

    // Close Modal
    save_in_progress = false;
    $active_modal = MODAL_TYPE.NONE;
  };
</script>

<dialog
  class="modal"
  class:modal-open={$active_modal == MODAL_TYPE.DELETE_FEED}
>
  <div class="modal-box max-w-md overflow-visible">
    <h3 class="font-bold text-lg">Delete</h3>

    <p class="py-2">
      You are about to delete <span class="font-bold"
        >{$active_feed_name}</span
      >. Are you sure you want to continue?
    </p>

    <!-- Buttons -->
    <div class="modal-action">
      <button
        class="btn btn-ghost"
        onclick={closeModal}
        disabled={save_in_progress}>Cancel</button
      >
      <button
        class="btn btn-soft btn-error"
        onclick={handleDeleteFeed}
        disabled={save_in_progress}
      >
        {#if save_in_progress}
          <span class="loading loading-spinner"></span>
        {/if}
        Delete
      </button>
  </div>
</dialog>
