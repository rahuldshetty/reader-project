<script>
    import AddFeedModal from "./add_feed_modal.svelte";
    import FeedItem from "./feed_item.svelte";
    
    import { fetch_feed } from "$lib/db";
    import { feeds_store } from "$lib/store";
    import { onMount } from "svelte";

    // on load default
    // { id: 0, title: "New York Times (World)", url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"}
    onMount( async () => {
      $feeds_store = await fetch_feed();
    });
</script>

<AddFeedModal/>

<div class="w-1/6 bg-gray-600 border-r">
    <h2 class="text-xl font-bold p-4">RSS Feeds</h2>
    <ul class="h-4/5">
      {#each $feeds_store as feed}
        <FeedItem title={feed.title} favicon={feed.favicon} url={feed.url}/>
      {/each}
    </ul>

    <div class="h-1/5 ">
      <div class="">
        <button
          on:click={
            () => document.getElementById('addFeedModal').classList.remove('hidden')
          }
          class="
          flex items-center gap-2 px-4 py-2 
          bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          <!-- Plus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>        
          Add Feed
        </button>
      </div>
    </div>
</div>