<script>
  import Titlebar from "$lib/components/titlebar.svelte";
  import HomeListView from "$lib/pages/home_list_view/HomeListView.svelte";
  import { themeMode } from "$lib/store";
</script>

<div class={$themeMode}>
  <Titlebar />
  <HomeListView/>
</div>
