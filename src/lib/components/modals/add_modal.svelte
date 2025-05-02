<script>
  import { NO_OF_POST_PULLS_PER_TIME, MODAL_TYPE, FEED_TYPE } from "$lib/constants";
  import { open } from '@tauri-apps/plugin-dialog';
  import { readTextFile } from '@tauri-apps/plugin-fs';
  import {
    add_feed,
    add_posts,
    fetch_unread_post_counts,
    fetch_posts,
    fetch_folder_feeds,
    fetch_folders,
    fetch_folder_ids_for_open_status,
  } from "$lib/db";
  import {
    feeds_store,
    selected_feed_id,
    is_loading_posts,
    feed_unread_post_count,
    posts_by_feed_store,
    posts_sort_by,
    unread_posts_only,
    selected_modal,
    feed_parent_open_status,
    opml_modal_data,
  } from "$lib/store";
  import { fetchRSSMetadata } from "$lib/utils";

  let feedName = $state("");
  let feedURL = $state("");
  let feedIcon = $state("");
  let feedPosts = $state([]);
  let feedId = $state(-1);

  let feed_type = $state(FEED_TYPE.FEED);
  let folder = $state(-1);

  async function addFeed() {
    if (feedName.trim() !== "") {
      // TODO: Select specific folder

      // feedURL has unique constraint on DB.
      //  so we set it to name of feed to avoid issues inserting
      if(feed_type == FEED_TYPE.FOLDER){
        feedURL = feedName;
      }

      const id = await add_feed(feedName, feedURL, feedIcon, feed_type, folder);
      if (id) {
        feedId = id;
      } else {
        console.error("Unable to add data to feed table");
        return;
      }
      $feeds_store = await fetch_folder_feeds();
      $feed_parent_open_status = await fetch_folder_ids_for_open_status();
      
      if (feed_type == FEED_TYPE.FEED){
        // Insert posts into DB
        if (feedPosts) {
          const posts = [];
          for (var post of feedPosts) {
            posts.push({
              ...post,
              feed_id: feedId,
            });
          }
          await add_posts(posts);
        }
        $is_loading_posts = true;

        $posts_by_feed_store[feedId] = await fetch_posts(
          $posts_sort_by,
          null,
          feedId,
          0,
          NO_OF_POST_PULLS_PER_TIME,
          $unread_posts_only,
        );
        $selected_feed_id = feedId;
      }

      $feed_unread_post_count = await fetch_unread_post_counts();
      $is_loading_posts = false;
      feedURL = "";
      feedName = "";
      feedIcon = "";
      feedPosts = [];
    }
    // TODO: Error handling when name is not valid.
  }

  async function handleFeedURLChange() {
    // Fetch feed metadata and posts from the Feed URL change
    if(feed_type == FEED_TYPE.FOLDER) 
      return;

    const response = await fetchRSSMetadata(-1, feedURL);
    if (response) {
      feedName = response.name;
      feedIcon = response.favicon;
      feedPosts = response.posts;
    }
  }

  const importOPML = async () => {
    const file = await open({
      multiple: false,
      directory: false,
    });
    if(file){
      $opml_modal_data = await readTextFile(file);
      $selected_modal = MODAL_TYPE.OPML_IMPORT;
    }
  }
</script>

<div
  id="addFeedModal"
  class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-10
  {$selected_modal != MODAL_TYPE.ADD ? "hidden":""}
  "
>
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-bold mb-4">Create Feed</h2>

    <div class="flex flex-row gap-4 mb-4">
      <label class="block text-sm font-medium">Feed Type:</label>
      <label class="flex items-center space-x-2">
        <input
          type="radio"
          class="accent-blue-500"
          name="options"
          bind:group={feed_type}
          value={FEED_TYPE.FEED}
        />
        <span class="block text-sm font-medium">Feed</span>
      </label>
    
      <label class="flex items-center space-x-2">
        <input
          type="radio"
          class="accent-blue-500"
          name="options"
          bind:group={feed_type}
          value={FEED_TYPE.FOLDER}
        />
        <span class="block text-sm font-medium">Folder</span>
      </label>
    </div>

    {#if feed_type == FEED_TYPE.FEED}
      <label class="block mb-2 text-sm font-medium">Feed URL</label>
      <input
        type="url"
        placeholder="Enter RSS URL"
        class="w-full px-3 py-2 border rounded-lg mb-4"
        bind:value={feedURL}
        onchange={handleFeedURLChange}
      />
    {/if}

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

    {#if feed_type == FEED_TYPE.FEED}
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
        onclick={importOPML}
      >
        Import OPML
      </button>

      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onclick={async () => {
          await addFeed();
          $selected_modal = MODAL_TYPE.NONE;
        }}
      >
        Add
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
