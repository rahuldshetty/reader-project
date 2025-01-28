<script>
    import { add_feed, add_posts, fetch_posts, fetch_unread_post_counts } from "$lib/db";
    import { feeds_store, selected_feed_id, is_loading_posts, posts_sort_by, feed_unread_post_count} from "$lib/store";
    import { fetchRSSMetadata } from "$lib/utils";

    let feedName = $state('');
    let feedURL = $state('');
    let feedIcon = $state('');
    let feedPosts = $state([]);
    let feedId = $state(-1);

    async function addFeed() {
      if (feedName.trim() !== "") {
        const id = await add_feed(feedName, feedURL, feedIcon);
        if(id){
          feedId = id;
        } else{
          console.error("Unable to add data to feed table");
          return;
        }
        $feeds_store = [
            ...$feeds_store,
            { id: $feeds_store.length + 1, title: feedName, url: feedURL, favicon: feedIcon}
        ]
        $selected_feed_id = feedId;
        
        // Insert posts into DB
        if(feedPosts){
          const posts = []
          for(var post of feedPosts){
            posts.push({
              title: post.title,
              link: post.link,
              pubDate: post.pubDate,
              feed_id: feedId
            })
          }
          await add_posts(posts);
        }
        $is_loading_posts = true;
        $feed_unread_post_count = await fetch_unread_post_counts();
        $is_loading_posts = false;
        feedURL = "";
        feedName = "";
        feedIcon = "";
        feedPosts = [];
      }
    }

    async function handleFeedURLChange() {
      const response = await fetchRSSMetadata(feedURL);
      if(response){
        feedName = response.name
        feedIcon = response.favicon
        feedPosts = response.posts
      }
      
    }
</script>

<div
    id="addFeedModal"
    class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center hidden"
  >
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-bold mb-4">Add New Feed</h2>

    <label class="block mb-2 text-sm font-medium">Feed URL</label>
    <input
      type="url"
      placeholder="Enter RSS URL"
      class="w-full px-3 py-2 border rounded-lg mb-4"
      bind:value={feedURL}
      on:change={handleFeedURLChange}
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

      {#if feedIcon != ''}
        <div class="flex items-center justify-center grow ">
          <img class="h-8 w-8" src={feedIcon} alt={feedName}>
        </div>
      {/if}
      
    </div>
    

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