<script>
  import FeedModal from "$lib/feed/feed_modal.svelte";
  import FeedItem from "$lib/feed/feed_item.svelte";

  import {
    feeds_store,
    minimize_feeds,
  } from "$lib/store";
  import SettingsModal from "$lib/components/settingsModal.svelte";
    import FeedOptions from "./feed_options.svelte";
    import FeedExpand from "./feed_expand.svelte";
</script>

<FeedModal />
<SettingsModal />

<div
  class="bg-background1 border-r flex flex-col h-screen
  {$minimize_feeds ? '' : 'w-2/6'}
"
>
  {#if !$minimize_feeds}
    <h2 class="text-xl font-bold p-4">Reader Project</h2>
  {:else}
    <h2 class="text-xl font-bold p-4">R</h2>
  {/if}

  <FeedExpand/>

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

  <FeedOptions/>
</div>
