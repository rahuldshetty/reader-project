<script>
  import { MODAL_TYPE, FEED_TYPE } from "$lib/constants";
  import { fetch_folder_feeds, update_feed, delete_feed, fetch_folders, fetch_folder_ids_for_open_status, fetch_feed } from "$lib/db";
  import { feed_parent_open_status, feeds_store, selected_feed_id, selected_modal } from "$lib/store";

  let feedName = $state("");
  let feedURL = $state("");
  let feedIcon = $state("");
  let feedType = $state(FEED_TYPE.FEED);
  let folder = $state(-1);

  selected_feed_id.subscribe(async (selected_feed_id) => {
    console.log(`SELECTED FEED ID: ${selected_feed_id}`);
    if (selected_feed_id != -1 && selected_feed_id != -2){
      const feeds = await fetch_feed();
      for (const feed of feeds) {
        if (feed.id == selected_feed_id) {
          feedName = feed.title;
          feedURL = feed.url;
          feedType = feed.type;
          folder = feed.parent;
          return;
        }
      }
    }
  });

  async function updateFeed() {
    await update_feed(feedName, $selected_feed_id, folder);
    $feeds_store = await fetch_folder_feeds();
  }

  async function deleteFeed() {
    await delete_feed($selected_feed_id);
    $selected_feed_id = -1;
    $feeds_store = await fetch_folder_feeds();
    $feed_parent_open_status = await fetch_folder_ids_for_open_status();
    feedURL = "";
    feedName = "";
    feedIcon = "";
    feedType =  "";
  }

</script>

<div
  id="updateFeedModal"
  class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-10 
  {$selected_modal != MODAL_TYPE.UPDATE ? "hidden":""}
  "
>
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-bold mb-4">Update {feedType == FEED_TYPE.FEED? "Feed": "Folder"}</h2>

    {#if feedType == FEED_TYPE.FEED}
      <label class="block mb-2 text-sm font-medium">Feed URL</label>
      <input
        type="url"
        placeholder="Enter RSS URL"
        class="w-full px-3 py-2 border rounded-lg mb-4"
        bind:value={feedURL}
        disabled
      />
    {/if}

    <div class="flex">
      <div class="">
        <label class="block mb-2 text-sm font-medium">Name</label>
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

    {#if feedType == FEED_TYPE.FEED}
    <div class="flex flex-col mb-4">
      <label class="block text-sm flex gap-1 font-medium">
        <p>Group under</p>
      </label>
      <select bind:value={folder} class="border-0 border-b-2  bg-transparent appearance-none border-neutral-500 focus:outline-none text-neutral-900 text-sm block w-full p-2.5 peer">
        <option value={-1}>Parent</option>
        {#await fetch_folders() then folders}
          {#each folders as folder}
            <option value={folder.id}>{folder.title}</option>
          {/each}
        {/await}
      </select>
    </div>   
    {/if}

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
