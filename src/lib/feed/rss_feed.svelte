<script>
    import FeedItem from "./feed_item.svelte";

    let default_feeds = [
        { id: 2, name: "New York Times (World)", url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", favicon: "https://www.nytimes.com/vi-assets/static-assets/favicon-dark-c0de2ee21c5d303cad570e8565f03f1d.ico"},
    ];

    let feeds = $state(default_feeds);

    let newFeedName = "";
    let newFeeUrl = "";

    function addFeed() {
      if (newFeedName.trim() !== "") {
        feeds.push(
          { id: feeds.length + 1, name: newFeedName, url: newFeeUrl}
        )
        newFeedName = "";
        newFeeUrl = "";
      }
    }

</script>

<div
    id="addFeedModal"
    class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center hidden"
  >
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-bold mb-4">Add New Feed</h2>

    <label class="block mb-2 text-sm font-medium">Feed Name</label>
    <input
      type="text"
      placeholder="Enter feed name"
      class="w-full px-3 py-2 border rounded-lg mb-4"
      bind:value={newFeedName}
    />

    <label class="block mb-2 text-sm font-medium">Feed URL</label>
    <input
      type="url"
      placeholder="Enter image URL (optional)"
      class="w-full px-3 py-2 border rounded-lg mb-4"
      bind:value={newFeeUrl}
    />

    <div class="flex justify-end gap-2">
      <button
        class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
        on:click={() => document.getElementById('addFeedModal').classList.add('hidden')}
      >
        Cancel
      </button>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        on:click={() => {
          addFeed();
          document.getElementById('addFeedModal').classList.add('hidden');
        }}
      >
        Add Feed
      </button>
    </div>
  </div>
</div>

<div class="w-1/6 bg-gray-600 border-r">
    <h2 class="text-xl font-bold p-4">RSS Feeds</h2>
    <ul class="h-4/5">
      {#each feeds as feed}
        <FeedItem name={feed.name} favicon={feed.favicon} url={feed.url}/>
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