<script>
    import FeedModal from "./feed_modal.svelte";
    import FeedItem from "./feed_item.svelte";
    
    import { feeds_store } from "$lib/store";
    import SettingsModal from "$lib/components/settingsModal.svelte";

</script>

<FeedModal/>
<SettingsModal/>

<div class="w-1/6 bg-background1 border-r flex flex-col h-screen">
    <h2 class="text-xl font-bold p-4">RSS Feeds</h2>
    <ul class="flex-grow overflow-auto">
      <FeedItem id={-1} title="All Posts" url={null} favicon={null}/>
      {#each $feeds_store as feed}
        <FeedItem id={feed.id} title={feed.title} favicon={feed.favicon} url={feed.url}/>
      {/each}
    </ul>

    <div class="h-72 flex flex-col justify-center items-center">
        <button
          on:click={
            () => document.getElementById('addFeedModal')?.classList.remove('hidden')
          }
          class="
          m-2 w-36
          flex flex-row
          gap-2 px-4 py-2 
          bg-primary1 text-white py-2 px-4 rounded-md hover:bg-primary2"
        >
          <!-- Plus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>        
          Add Feed
        </button>


        <button
          on:click={
            () => document.getElementById('settingModal')?.classList.remove('hidden')
          }
          class="
          m-2 w-36
          flex flex-row
          gap-2 px-4 py-2 
          bg-primary1 text-white py-2 px-4 rounded-md hover:bg-primary2"
        >
          <!-- Plus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>        
          Settings
        </button>
    </div>
</div>