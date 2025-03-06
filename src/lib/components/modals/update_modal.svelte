<script>
  import { MODAL_TYPE } from "$lib/constants";
  import { fetch_feed, update_feed, delete_feed } from "$lib/db";
  import { feeds_store, selected_feed_id, selected_modal } from "$lib/store";

  let feedName = $state("");
  let feedURL = $state("");
  let feedIcon = $state("");

  selected_feed_id.subscribe((selected_feed_id) => {
    if (selected_feed_id != -1)
      for (const feed of $feeds_store) {
        if (feed.id == selected_feed_id) {
          feedName = feed.title;
          feedURL = feed.url;
          return;
        }
      }
  });

  async function updateFeed() {
    await update_feed(feedName, $selected_feed_id);
    $feeds_store = await fetch_feed();
  }

  async function deleteFeed() {
    await delete_feed($selected_feed_id);
    $selected_feed_id = -1;
    $feeds_store = await fetch_feed();
    feedURL = "";
    feedName = "";
    feedIcon = "";
  }

</script>

<div
  id="updateFeedModal"
  class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-10 
  {$selected_modal != MODAL_TYPE.UPDATE ? "hidden":""}
  "
>
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-bold mb-4">Update Feed</h2>

    <label class="block mb-2 text-sm font-medium">Feed URL</label>
    <input
      type="url"
      placeholder="Enter RSS URL"
      class="w-full px-3 py-2 border rounded-lg mb-4"
      bind:value={feedURL}
      disabled
    />

    <div class="flex">
      <div class="">
        <label class="block mb-2 text-sm font-medium">Feed Name</label>
        <input
          type="text"
          placeholder="Enter name"
          class="px-3 py-2 border rounded-lg mb-4"
          bind:value={feedName}
        />
      </div>

      {#if feedIcon != ""}
        <div class="flex items-center justify-center grow">
          <img class="h-8 w-8" src={feedIcon} alt={feedName} />
        </div>
      {/if}
    </div>

    <div class="flex justify-end gap-2">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onclick={async () => {
          await updateFeed();
          $selected_modal = MODAL_TYPE.NONE;
        }}
      >
        Save
      </button>

      <button
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-800"
        onclick={async () => {
          await deleteFeed();
          $selected_modal = MODAL_TYPE.NONE;
        }}
      >
        Delete
      </button>

      <button
        class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
        onclick={() => ($selected_modal = MODAL_TYPE.NONE)}
      >
        Cancel
      </button>
    </div>
  </div>
</div>
