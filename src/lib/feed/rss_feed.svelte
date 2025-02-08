<script>
  import FeedModal from "$lib/feed/feed_modal.svelte";
  import FeedItem from "$lib/feed/feed_item.svelte";

  import {
    feeds_store,
    minimize_feeds,
  } from "$lib/store";
  import SettingsModal from "$lib/components/settingsModal.svelte";
    import FeedOptions from "./feed_options.svelte";
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

  <div class="relative w-full">
    <!-- Expand Button -->
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class="absolute top-14 -right-6 flex items-center justify-center w-8 h-8 rounded-full bg-background1  transition-all duration-300"
      onclick={() => $minimize_feeds = !$minimize_feeds}
    >
      <svg
        class="w-5 h-5 transition-transform duration-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        class:rotate-180={!$minimize_feeds}
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
  

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
