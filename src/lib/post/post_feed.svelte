<script>
  import { derived } from "svelte/store";
  import { DB_ORDER_ENUM } from "$lib/constants";
  import { fetch_posts, fetch_unread_post_counts } from "$lib/db";
  import { posts_store, selected_feed_id, is_loading_posts, posts_sort_by, feed_unread_post_count} from "$lib/store";
  import PostItem from "$lib/post/post_item.svelte";

  import empty_logo from "$lib/assets/empty_logo.svg"
  import searching_logo from "$lib/assets/searching.svg"

  // Filter posts by selected feed id
  const filtered_posts = derived(
    [posts_store, selected_feed_id],
    ([$posts_store, $selected_feed_id]) =>
      $posts_store.filter(post => ($selected_feed_id == -1) || ($selected_feed_id != -1 && post.feed_id === $selected_feed_id))
  );

  const sortPosts = async () => {
    $posts_sort_by = ($posts_sort_by === DB_ORDER_ENUM.NEWEST) ? DB_ORDER_ENUM.OLDEST : DB_ORDER_ENUM.NEWEST;
    $posts_store = await fetch_posts($posts_sort_by);
    $feed_unread_post_count = await fetch_unread_post_counts();
  }
  
</script>

<div class="flex flex-col w-1/4">
  <div class="shrink border-br p-2">
    <button class="text-text2 font-semibold flex flex-row gap-2 justify-center items-center" on:click={sortPosts}>
      {#if $posts_sort_by === DB_ORDER_ENUM.NEWEST}
        <!-- Down Arrow -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>      
      {:else}
        <!-- Up Arrow -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
        </svg>        
      {/if}
      {$posts_sort_by === DB_ORDER_ENUM.OLDEST ? "Oldest" : "Newest"}
    </button>
  </div>

  <div class="bg-background2 border-r overflow-auto ">
      
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
</div>