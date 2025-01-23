<script>
  import { derived } from "svelte/store";
  import { posts_store, selected_feed_id, is_loading_posts} from "$lib/store";
  import PostItem from "$lib/post/post_item.svelte";

  import empty_logo from "$lib/assets/empty_logo.svg"
  import searching_logo from "$lib/assets/searching.svg"

  // Filter posts by selected feed id
  const filtered_posts = derived(
    [posts_store, selected_feed_id],
    ([$posts_store, $selected_feed_id]) =>
      $posts_store.filter(post => ($selected_feed_id == -1) || ($selected_feed_id != -1 && post.feed_id === $selected_feed_id))
  );
  
</script>

<div class="w-1/4 bg-white border-r overflow-auto ">
    
    {#if $is_loading_posts}
    <div class="w-full h-full cursor-default flex flex-col items-center justify-center gap-10">
      <img src={searching_logo} class="object-contain w-32" alt="Not Found">
      <p class="text-xs">Loading Posts</p>
    </div>
    {:else if $filtered_posts.length == 0}
    <div class="w-full h-full cursor-default flex flex-col items-center justify-center gap-10">
      <img src={empty_logo} class="object-contain w-32" alt="Not Found">
      <p class="text-xs">Could not find posts</p>
    </div>
    {/if}
    
    <ul>
      {#each $filtered_posts as post}
        <PostItem post={post} />
      {/each}
    </ul>
</div>
