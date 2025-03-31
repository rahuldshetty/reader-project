<script>
  import "$lib/styles/scrollbar.css";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import { fetch_posts, fetch_unread_post_counts } from "$lib/db";
  import {
    posts_by_feed_store,
    selected_feed_id,
    is_loading_posts,
    posts_sort_by,
    feed_unread_post_count,
    unread_posts_only,
  } from "$lib/store";
  import PostItem from "$lib/pages/feed_list_view/post/post_item.svelte";

  import empty_logo from "$lib/assets/empty_logo.svg";
  import searching_logo from "$lib/assets/searching.svg";
  import PostFilter from "./post_filter.svelte";
  import EmptyState from "$lib/components/empty_state.svelte";
  import { NO_OF_POST_PULLS_PER_TIME } from "$lib/constants";

  let sentinel;
  let scrollContainer;

  onMount(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          // When user wants to scroll down on a selected feed
          if ($selected_feed_id != -1) {
            if ($posts_by_feed_store[$selected_feed_id]) {
              const cur_posts = $posts_by_feed_store[$selected_feed_id];
              const lastPubDate = cur_posts[cur_posts.length - 1].pubDate;
              const new_posts = await fetch_posts(
                $posts_sort_by,
                null,
                $selected_feed_id,
                $posts_by_feed_store[$selected_feed_id].length,
                NO_OF_POST_PULLS_PER_TIME,
                $unread_posts_only,
                lastPubDate,
              );

              $posts_by_feed_store[$selected_feed_id] = [
                ...$posts_by_feed_store[$selected_feed_id],
                ...new_posts,
              ];
            }
          } else {
            // When user wants to scroll down on "all posts"
            // then find the last_id by comparing all ids
            let no_of_posts = 0;
            let newPost = {};
            for (const [feed_id, posts] of Object.entries(
              $posts_by_feed_store,
            )) {
              no_of_posts += posts.length;
              newPost[feed_id] = [];
            }

            const new_posts = await fetch_posts(
              $posts_sort_by,
              null,
              $selected_feed_id,
              0,
              no_of_posts + NO_OF_POST_PULLS_PER_TIME,
              $unread_posts_only
            );

            new_posts.forEach((post) => {
              newPost[post.feed_id].push({
                ...post,
                rowid: newPost[post.feed_id].length,
              });
            });

            $posts_by_feed_store = newPost;

            // Update no. of unread posts
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

  selected_feed_id.subscribe((val)=>{
    if (val && scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" })
    }
  });
</script>

<div class="flex flex-col w-2/5 
  bg-background2">
  <PostFilter/>

  <div
    bind:this={scrollContainer}
    class="{$filtered_posts?.length != 0
      ? 'overflow-auto scroll-smooth'
      : ''}"
  >
    {#if $is_loading_posts}
      <div
        class="w-full h-screen cursor-default flex flex-col items-center justify-center gap-10"
      >
        <img src={searching_logo} class="object-contain w-32" alt="Not Found" />
        <p class="text-xs">Loading Posts</p>
      </div>
    {:else if $filtered_posts?.length == 0}
      <EmptyState message="Could not find posts" />
    {/if}

    <ul>
      {#each $filtered_posts as post}
        <PostItem {post} />
      {/each}

      <li bind:this={sentinel} aria-hidden="true" />
    </ul>
  </div>
</div>