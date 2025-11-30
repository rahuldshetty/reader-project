<script lang="ts">
  import { active_modal } from "$lib/stores/app_store";
  import { active_page } from "$lib/stores/add_modal_store";
  import { MODAL_TYPE } from "$lib/constants";
  import ImportPage from "./pages/import_page.svelte";
  import InputPage from "./pages/input_page.svelte";
</script>

<div class="modal" class:modal-open={$active_modal == MODAL_TYPE.ADD}>
  <div class="modal-box w-full max-w-xl mx-4">
    <h3 class="font-bold text-lg">Add Feed</h3>

    <!-- Page 1: Scan/Upload Feed -->
    {#if $active_page == 0}
      <InputPage />
    {:else if $active_page == 1}
      <!-- Page 2: Import Page -->
      <ImportPage />
    {/if}
  </div>
</div>
