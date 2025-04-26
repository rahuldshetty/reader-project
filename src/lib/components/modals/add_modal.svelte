<script>
  import { NO_OF_POST_PULLS_PER_TIME, MODAL_TYPE, FEED_TYPE } from "$lib/constants";
  import {
    add_feed,
    add_posts,
    fetch_unread_post_counts,
    fetch_posts,
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
  } from "$lib/store";
  import { fetchRSSMetadata } from "$lib/utils";

  let feedName = $state("");
  let feedURL = $state("");
  let feedIcon = $state("");
  let feedPosts = $state([]);
  let feedId = $state(-1);
  let folder = $state(-1);

  async function addFeed() {
    if (feedName.trim() !== "") {
      // TODO: Select specific folder
      const id = await add_feed(feedName, feedURL, feedIcon, FEED_TYPE.FEED, folder);
      if (id) {
        feedId = id;
      } else {
        console.error("Unable to add data to feed table");
        return;
      }
      $feeds_store = [
        ...$feeds_store,
        {
          id: feedId,
          title: feedName,
          url: feedURL,
          favicon: feedIcon,
        },
      ];

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
      $feed_unread_post_count = await fetch_unread_post_counts();
      $selected_feed_id = feedId;

      $is_loading_posts = false;
      feedURL = "";
      feedName = "";
      feedIcon = "";
      feedPosts = [];
    }
    // TODO: Error handling when name is not valid.
  }

  async function handleFeedURLChange() {
    const response = await fetchRSSMetadata(-1, feedURL);
    if (response) {
      feedName = response.name;
      feedIcon = response.favicon;
      feedPosts = response.posts;
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
    <h2 class="text-lg font-bold mb-4">Add New Feed</h2>

    <label class="block mb-2 text-sm font-medium">Feed URL</label>
    <input
      type="url"
      placeholder="Enter RSS URL"
      class="w-full px-3 py-2 border rounded-lg mb-4"
      bind:value={feedURL}
      onchange={handleFeedURLChange}
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
