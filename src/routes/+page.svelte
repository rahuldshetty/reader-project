<script lang="ts">
  import Titlebar from "$lib/components/titlebar.svelte";
  import RssFeed from "$lib/feed/rss_feed.svelte";
  import PostFeed from "$lib/post/post_feed.svelte";

  import { NO_OF_POST_PULLS_PER_TIME, SETTINGS } from "$lib/constants";
  import {
    feeds_store,
    selected_post,
    is_loading_feed,
    is_loading_posts,
    posts_sort_by,
    feed_unread_post_count,
    posts_by_feed_store,
    selected_feed_id,
    unread_posts_only,
    darkMode,
  } from "$lib/store";
  import {
    fetch_feed,
    add_posts,
    fetch_posts,
    fetch_unread_post_counts,
    delete_expired_posts,
  } from "$lib/db";
  import {
    fetchRSSMetadata,
    isTimeExpired,
    fetch_user_setting,
  } from "$lib/utils";

  import { onMount } from "svelte";
  import WebIframe from "$lib/content_view/web_iframe.svelte";
  import ParserView from "$lib/content_view/parser_view.svelte";
  import "$lib/logging";

  const syncPostsInDB = async (
    feeds: {
      id: Number;
      url: string;
      title: string;
      favicon: string;
      last_refresh_time: string;
    }[],
  ) => {
    // Adds new post entries to DB
    const posts = [];

    const time_in_seconds =
      (await fetch_user_setting(SETTINGS.LAST_REFRESH_TIME)) * 60 * 60;

    for (let feed of feeds) {
      const expiredTime = isTimeExpired(
        feed.last_refresh_time,
        time_in_seconds,
      );
      console.log("Time Expired:" + expiredTime);
      if (expiredTime) {
        const feedMatadata = await fetchRSSMetadata(feed.url);
        if (feedMatadata) {
          for (var post of feedMatadata.posts) {
            posts.push({
              title: post.title,
              link: post.link,
              pubDate: post.pubDate,
              feed_id: feed.id,
            });
          }
        }
      }
    }

    console.log("Posts to Insert: " + posts.length);

    if (posts.length > 0) await add_posts(posts);
  };

  // on load defaults
  onMount(async () => {
    $darkMode = await fetch_user_setting(SETTINGS.DARK_MODE);
    await delete_expired_posts(
      await fetch_user_setting(SETTINGS.POST_EXPIRY_TIME),
    );

    $is_loading_feed = true;
    $is_loading_posts = true;

    $feeds_store = await fetch_feed();
    $is_loading_feed = false;

    for (const feed of $feeds_store) {
      $posts_by_feed_store[feed.id] = [];
    }

    await syncPostsInDB($feeds_store);

    const posts = await fetch_posts(
      $posts_sort_by,
      null,
      -1,
      0,
      NO_OF_POST_PULLS_PER_TIME,
      $unread_posts_only,
    );

    posts.forEach((post) => {
      $posts_by_feed_store[post.feed_id].push({
        ...post,
        rowid: $posts_by_feed_store[post.feed_id].length,
      });
    });
    $selected_feed_id = -1;

    $feed_unread_post_count = await fetch_unread_post_counts();
    $is_loading_posts = false;

    console.log("POSTS BY FEED:");
    console.debug(JSON.stringify($posts_by_feed_store));
  });
</script>

<div class={$darkMode ? "dark" : "light"}>
  <Titlebar />

  <div
    class="flex h-screen overflow-hidden"
    style="padding-top: var(--titlebar-height);"
  >
    <!-- First Column: RSS Feeds -->
    <RssFeed />

    <!-- Second Column: News List -->
    <PostFeed />

    <!-- Third Column: Webpage Preview -->
    <div class="w-full bg-background2">
      {#if $selected_post}
        <ParserView link={$selected_post.link} title={$selected_post.title} />
      {:else}
        <p class="p-4 text-gray-600">Select a news item to preview</p>
      {/if}
    </div>
  </div>
</div>
