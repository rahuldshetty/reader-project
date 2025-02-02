<script>
  import FeedModal from "$lib/feed/feed_modal.svelte";
  import FeedItem from "$lib/feed/feed_item.svelte";

  import {
    feeds_store,
    selected_feed_id,
    is_adding_new_feed,
    minimize_feeds,
  } from "$lib/store";
  import SettingsModal from "$lib/components/settingsModal.svelte";
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
      on:click={() => $minimize_feeds = !$minimize_feeds}
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

  {#if !$minimize_feeds}
    <div class="h-72 flex flex-col justify-center items-center">
      <button
        on:click={() => {
          $is_adding_new_feed = true;
          document.getElementById("addFeedModal")?.classList.remove("hidden");
        }}
        class="
          m-2 w-6/12
          flex
          gap-2 px-4 py-2
          bg-primary1 text-white py-2 px-4 rounded-md hover:bg-primary2"
      >
        <!-- Plus Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add Feed
      </button>

      {#if $selected_feed_id != -1}
        <button
          on:click={() => {
            $is_adding_new_feed = false;
            document.getElementById("addFeedModal")?.classList.remove("hidden");
          }}
          class="
            m-2 w-6/12
            flex
            gap-2 px-4 py-2
            bg-primary1 text-white py-2 px-4 rounded-md hover:bg-primary2"
        >
          <!-- Plus Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          Update
        </button>
      {/if}

      <button
        on:click={() =>
          document.getElementById("settingModal")?.classList.remove("hidden")}
        class="
          m-2 w-6/12
          flex
          gap-2 px-4 py-2
          bg-primary1 text-white py-2 px-4 rounded-md hover:bg-primary2"
      >
        <!-- Settings Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
          />
        </svg>
        Settings
      </button>
    </div>
  {/if}
</div>
