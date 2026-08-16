<script>
  import {
    active_modal,
    active_feed_id,
    active_feed_name,
  } from "$lib/stores/app_store";
  import { refresh_app_data } from "$lib/pages/home_page/common";
  import { MODAL_TYPE } from "$lib/constants";
  import { delete_feed } from "$lib/dao/feed_db";
  import ModalShell from "$lib/components/modals/ModalShell.svelte";
  import { t } from "$lib/i18n";

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

<ModalShell
  open={$active_modal == MODAL_TYPE.DELETE_FEED}
  title={$t("modal.delete_feed")}
  onClose={closeModal}
  footer={footer}
>
  <p class="py-2">
    {$t("modal.delete_confirm", { name: $active_feed_name })}
  </p>
</ModalShell>

{#snippet footer()}
  <button
    class="btn btn-ghost"
    onclick={closeModal}
    disabled={save_in_progress}>{$t("common.cancel")}</button
  >
  <button
    class="btn btn-soft btn-error"
    onclick={handleDeleteFeed}
    disabled={save_in_progress}
  >
    {#if save_in_progress}
      <span class="loading loading-spinner"></span>
    {/if}
    {$t("common.delete")}
  </button>
{/snippet}
