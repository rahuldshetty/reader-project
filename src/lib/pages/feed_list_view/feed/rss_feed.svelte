<script>
  import { fade } from 'svelte/transition';
  import { getVersion } from "@tauri-apps/api/app";

  import FeedItem from "$lib/pages/feed_list_view/feed/feed_item.svelte";

  import AddFeedModal from "$lib/components/modals/add_modal.svelte";
  import UpdateFeedModal from "$lib/components/modals/update_modal.svelte";
  import SettingsModal from "$lib/components/modals/settingsModal.svelte";
  import TranslateModal from '$lib/components/modals/translate_modal.svelte';

  import { feeds_store, minimize_feeds, selected_feed_id, feed_parent_open_status } from "$lib/store";
  import FeedOptions from "./feed_options.svelte";
  import FeedExpand from "./feed_expand.svelte";
  import { FEED_TYPE } from '$lib/constants';
    import OpmlImportModal from '$lib/components/modals/opml_import_modal.svelte';
</script>

<AddFeedModal />
<UpdateFeedModal />
<SettingsModal />
<TranslateModal />
<OpmlImportModal />

<div
  class="bg-background1 flex flex-col h-screen
  transition-[width] duration-300 ease-in-out
"
  style="width: {$minimize_feeds ? '4rem' : '16.666%'}"
>
  <FeedExpand />

  {#if !$minimize_feeds}
    <div class="text-primary1 ml-4 mb-1 flex flex-col">
      <h2 class="text-xl font-bold">Reader Project</h2>
      {#await getVersion() then version}
        <span class="text-sm self-start text-gray-500 block text-left" in:fade out:fade>v{version}</span>
      {/await}
    </div>
  {:else}
    <div class="text-primary1 ml-4 mb-1">
      <h2 class="text-xl font-bold">R</h2>
    </div>
  {/if}

  <ul class="flex-grow overflow-auto">
    <FeedItem id={-1} title="All Posts" url={null} favicon={null} type={0} parent={-1} is_child_node={false}/>
    <FeedItem id={-2} title="My Favorites" url={null} favicon={null} type={0} parent={-1} is_child_node={false}/>
    {#each $feeds_store as feed}
      <FeedItem
        id={feed.id}
        title={feed.title}
        favicon={feed.favicon}
        url={feed.url}
        type={feed.type}
        parent={feed.parent}
        is_child_node={false}
      />
      {#if $feed_parent_open_status[feed.id]}
      {#each feed.children as child_feed}
        <FeedItem
          id={child_feed.id}
          title={child_feed.title}
          favicon={child_feed.favicon}
          url={child_feed.url}
          type={child_feed.type}
          parent={child_feed.parent}
          is_child_node={true}
        />
      {/each}
      {/if}
    {/each}
  </ul>

  <FeedOptions />
</div>
