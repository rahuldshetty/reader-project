<script>
  import {
    active_modal,
    active_feed_id,
    active_feed_name,
  } from "$lib/stores/app_store";
  import { refresh_posts } from "$lib/pages/home_page/common";
  import { MODAL_TYPE } from "$lib/constants";
  import { mark_feed_as_read } from "$lib/dao/feed_db";

  let save_in_progress = $state(false);

  const closeModal = () => {
    $active_modal = MODAL_TYPE.NONE;
  };

  const handleMarkRead = async () => {
    save_in_progress = true;

    const feed_id = $active_feed_id;
    await mark_feed_as_read(feed_id);

    // Keep the current feed selected and refresh its posts
    await refresh_posts(feed_id);

    // Close Modal
    save_in_progress = false;
    $active_modal = MODAL_TYPE.NONE;
  };
</script>

<dialog class="modal" class:modal-open={$active_modal == MODAL_TYPE.MARK_READ}>
  <div class="modal-box w-full max-w-md mx-4">
    <h3 class="font-bold text-lg">Mark Read</h3>

    <p class="py-2">
      Mark all posts in <span class="font-bold">"{$active_feed_name}"</span> as read?
    </p>

    <!-- Buttons -->
    <div class="modal-action">
      <button
        class="btn btn-ghost"
        onclick={closeModal}
        disabled={save_in_progress}>Cancel</button
      >
      <button
        class="btn btn-soft btn-primary"
        onclick={handleMarkRead}
        disabled={save_in_progress}
      >
        {#if save_in_progress}
          <span class="loading loading-spinner"></span>
        {/if}
        Mark Read
      </button>
    </div>
  </div>
</dialog>
