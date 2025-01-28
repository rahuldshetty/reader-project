<script>
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { DB_ORDER_ENUM } from "$lib/constants";
  import { fetch_posts, fetch_unread_post_counts } from "$lib/db";
  import {
    posts_by_feed_store,
    selected_feed_id,
    is_loading_posts,
    posts_sort_by,
    feed_unread_post_count,
  } from "$lib/store";
  import PostItem from "$lib/post/post_item.svelte";

  import empty_logo from "$lib/assets/empty_logo.svg";
  import searching_logo from "$lib/assets/searching.svg";

  let sentinel;

  onMount(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          // When user wants to scroll down on a selected feed
          if ($selected_feed_id != -1) {
            const cur_posts = $posts_by_feed_store[$selected_feed_id];
            const last_id = cur_posts[cur_posts.length - 1].id;
            const new_posts = await fetch_posts(
              $posts_sort_by,
              last_id,
              $selected_feed_id,
              $posts_by_feed_store[$selected_feed_id].length,
            );
            console.log("New Posts:", new_posts);
            posts_by_feed_store.update((curValue) => {
              curValue[$selected_feed_id] = [
                ...curValue[$selected_feed_id],
                ...new_posts,
              ];
              return curValue;
            });
          } else {
            // When user wants to scroll down on "all posts"
            // then find the last_id by comparing all ids 
            let no_of_posts = 0;
            let newPost = {}
            for (const [feed_id, posts] of Object.entries($posts_by_feed_store)) {
              no_of_posts += posts.length;
              newPost[feed_id] = [];
            }
            
            const new_posts = await fetch_posts(
              $posts_sort_by,
              null,
              $selected_feed_id,
              0,
              no_of_posts + 20,
            );

            new_posts.forEach((post)=>{
              newPost[post.feed_id].push({
                ...post,
                rowid: newPost[post.feed_id].length
              });
            });

            $posts_by_feed_store = newPost;
            
            console.log("New Posts:", $posts_by_feed_store);
            $feed_unread_post_count = await fetch_unread_post_counts();

          }
        }
      },
      { threshold: 1.0 },
    );

    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  });

  // Filter posts by selected feed id
  const filtered_posts = derived(
    [posts_by_feed_store, selected_feed_id],
    ([$posts_by_feed_store, $selected_feed_id]) => {
      if ($selected_feed_id != -1) {
        // Select Particular Feed
        return $posts_by_feed_store[$selected_feed_id];
      } else {
        // Select "All Posts" feed
        let all_posts = [];
        for (const [feed_id, posts] of Object.entries($posts_by_feed_store)) {
          for (const post of posts) {
            all_posts.push(post);
          }
        }
        return all_posts;
      }
    },
  );

  const sortPosts = async () => {
    $posts_sort_by =
      $posts_sort_by === DB_ORDER_ENUM.NEWEST
        ? DB_ORDER_ENUM.OLDEST
        : DB_ORDER_ENUM.NEWEST;
    const posts = await fetch_posts($posts_sort_by, null, $selected_feed_id);
    $posts_by_feed_store[$selected_feed_id] = posts;
    $feed_unread_post_count = await fetch_unread_post_counts();
  };
</script>

<div class="flex flex-col w-1/4">
  <div class="shrink border-br p-2">
    <button
      class="text-text2 font-semibold flex flex-row gap-2 justify-center items-center"
      on:click={sortPosts}
    >
      {#if $posts_sort_by === DB_ORDER_ENUM.NEWEST}
        <!-- Down Arrow -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
          />
        </svg>
      {:else}
        <!-- Up Arrow -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      {/if}
      {$posts_sort_by === DB_ORDER_ENUM.OLDEST ? "Oldest" : "Newest"}
    </button>
  </div>

  <div class="bg-background2 border-r overflow-auto">
    {#if $is_loading_posts}
      <div
        class="w-full h-full cursor-default flex flex-col items-center justify-center gap-10"
      >
        <img src={searching_logo} class="object-contain w-32" alt="Not Found" />
        <p class="text-xs">Loading Posts</p>
      </div>
    {:else if $filtered_posts?.length == 0}
      <div
        class="w-full h-full cursor-default flex flex-col items-center justify-center gap-10"
      >
        <img src={empty_logo} class="object-contain w-32" alt="Not Found" />
        <p class="text-xs">Could not find posts</p>
      </div>
    {/if}

    <ul>
      {#each $filtered_posts as post}
        <PostItem {post} />
      {/each}

      <li bind:this={sentinel} aria-hidden="true" />
    </ul>
  </div>
</div>
