<script>
    import { add_feed } from "$lib/db";
    import { feeds_store } from "$lib/store";

    let newFeedName = "";
    let newFeeUrl = "";

    async function addFeed() {
      if (newFeedName.trim() !== "") {
        await add_feed(newFeedName, newFeeUrl);
        $feeds_store = [
            ...$feeds_store,
            { id: $feeds_store.length + 1, title: newFeedName, url: newFeeUrl}
        ]
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
        on:click={async () => {
          await addFeed();
          document.getElementById('addFeedModal').classList.add('hidden');
        }}
      >
        Add Feed
      </button>
    </div>
  </div>
</div>