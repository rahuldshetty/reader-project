<script>
  import { getVersion } from "@tauri-apps/api/app";

  import FeedItem from "$lib/feed/feed_item.svelte";

  import AddFeedModal from "$lib/components/modals/add_modal.svelte";
  import UpdateFeedModal from "$lib/components/modals/update_modal.svelte";
  import SettingsModal from "$lib/components/modals/settingsModal.svelte";

  import { feeds_store, minimize_feeds } from "$lib/store";
  import FeedOptions from "./feed_options.svelte";
  import FeedExpand from "./feed_expand.svelte";
</script>

<AddFeedModal />
<UpdateFeedModal />
<SettingsModal />

<div
  class="bg-background1 flex flex-col h-screen
  {$minimize_feeds ? '' : 'w-1/6'}
"
>
  <FeedExpand />

  {#if !$minimize_feeds}
    <div class="text-primary1 ml-4 mb-1 flex flex-col">
      <h2 class="text-xl font-bold">Reader Project</h2>
      {#await getVersion() then version}
        <span class="text-sm self-start block text-left">v{version}</span>
      {/await}
    </div>
  {:else}
    <div class="text-primary1 ml-4 mb-1">
      <h2 class="text-xl font-bold">R</h2>
    </div>
  {/if}

  <ul class="flex-grow overflow-auto">
    <FeedItem id={-1} title="All Posts" url={null} favicon={null} />
    {#each $feeds_store as feed}
      <FeedItem
        id={feed.id}
        title={feed.title}
        favicon={feed.favicon}
        url={feed.url}
      />
    {/each}
  </ul>

  <FeedOptions />
</div>
