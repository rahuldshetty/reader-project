<script lang="ts">
  import { active_modal } from "$lib/stores/app_store";
  import { active_page } from "$lib/stores/add_modal_store";
  import { MODAL_TYPE } from "$lib/constants";
  import { closeAddModal } from "./add_modal_methods";
  import ImportPage from "./pages/import_page.svelte";
  import InputPage from "./pages/input_page.svelte";
  import ModalShell from "$lib/components/modals/ModalShell.svelte";
</script>

<ModalShell
  open={$active_modal == MODAL_TYPE.ADD}
  title="Add Feed"
  widthClass="max-w-xl"
  onClose={closeAddModal}
>
  <!-- Page 1: Scan/Upload Feed -->
  {#if $active_page == 0}
    <InputPage />
  {:else if $active_page == 1}
    <!-- Page 2: Import Page -->
    <ImportPage />
  {/if}
</ModalShell>
