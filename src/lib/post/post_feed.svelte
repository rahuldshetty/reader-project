<script>
  import { derived } from "svelte/store";
  import { posts_store, selected_feed_id, selected_post} from "$lib/store";

  // Filter posts by selected feed id
  const filtered_posts = derived(
    [posts_store, selected_feed_id],
    ([$posts_store, $selected_feed_id]) =>
      $posts_store.filter(post => ($selected_feed_id == -1) || ($selected_feed_id != -1 && post.feed_id === $selected_feed_id))
  );
  
</script>

<div class="w-1/4 bg-white border-r overflow-auto ">
    <h2 class="text-xl font-bold p-4">All Posts</h2>
    <ul>
      {#each $filtered_posts as post}
        <li
          class="p-4 border-b hover:bg-gray-100 cursor-pointer"
          on:click={() => $selected_post = post}
        >
          <h3 class="text-sm font-semibold">{post.title}</h3>
          <p class="text-xs text-gray-600">{post.pubDate}</p>
        </li>
      {/each}
    </ul>
</div>
