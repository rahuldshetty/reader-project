<script>
  import { derived } from "svelte/store";
  import { posts_store, selected_feed_id} from "$lib/store";
  import PostItem from "./post_item.svelte";

  // Filter posts by selected feed id
  const filtered_posts = derived(
    [posts_store, selected_feed_id],
    ([$posts_store, $selected_feed_id]) =>
      $posts_store.filter(post => ($selected_feed_id == -1) || ($selected_feed_id != -1 && post.feed_id === $selected_feed_id))
  );
  
</script>

<div class="w-1/4 bg-white border-r overflow-auto ">
    <ul>
      {#each $filtered_posts as post}
        <PostItem post={post} />
      {/each}
    </ul>
</div>
