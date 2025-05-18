<script lang="ts">
    import { btn_in_progress, url, skip_data_load_on_import } from "$lib/stores/add_modal_store";
    import { closeAddModal, addFeedFromURL, addOPMLfromUpload } from "../add_modal_methods";

</script>

<div class="grid grid-cols-1 gap-2">
    <fieldset class="fieldset grid grid-cols-1 items-center gap-2">
        <!-- URL -->
        <div>
            <legend class="fieldset-legend">URL</legend>
            <p class="label">Enter RSS or Atom feed URL</p>
        </div>
        <div>
            <input
                type="url"
                pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                class="input w-full"
                disabled={$btn_in_progress}
                bind:value={$url}
            />
        </div>
    </fieldset>

    <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
      <!-- Pull latest feed on select -->
      <div>
        <legend class="fieldset-legend">Skip data fetch</legend>
        <p class="label">
          Enabling this option will skip the feed load.
        </p>
      </div>
      <div class="flex justify-end">
        <input
          type="checkbox"
          disabled={$url != ''}
          bind:checked={$skip_data_load_on_import}
          class="toggle toggle-success"
        />
      </div>
    </fieldset>
</div>

<div class="modal-action">
    <button
      class="btn btn-ghost"
      onclick={closeAddModal}
      disabled={$btn_in_progress}>Cancel</button
    >
    <button
      class="btn btn-secondary"
      onclick={addOPMLfromUpload}
      disabled={$btn_in_progress}>Upload OPML</button
    >
    <button
      class="btn btn-primary"
      onclick={addFeedFromURL}
      disabled={$btn_in_progress || $url == ''}
    >
      {#if $btn_in_progress}
        <span class="loading loading-spinner"></span>
      {/if}
      Scan URL
    </button>
</div>
