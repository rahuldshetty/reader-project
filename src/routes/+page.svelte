<script lang='ts'>
  import Titlebar from "$lib/components/titlebar.svelte";
  import RssFeed from "$lib/feed/rss_feed.svelte";
  import PostFeed from "$lib/post/post_feed.svelte";

  import { feeds_store, posts_store, selected_post } from "$lib/store";
  import { fetch_feed, add_posts, fetch_posts } from "$lib/db";
  import { fetchRSSMetadata } from "$lib/utils"; 

  import { onMount } from "svelte";

  let selectedNews = $state('');

  const syncPostsInDB = async (feeds:{id:Number, url:string, title:string, favicon:string}[]) => {
    // Updates post entires in DB
    const posts = []

    for(let feed of feeds){
      const feedMatadata = await fetchRSSMetadata(feed.url);
      if(feedMatadata)
        for(var post of feedMatadata.posts){
          posts.push({
            title: post.title,
            link: post.link,
            pubDate: post.pubDate,
            feed_id: feed.id
          })
        }
    }
    
    console.log("Posts to Insert: ", posts.length)

    if(posts.length > 0)
      await add_posts(posts);
  }

  // on load defaults
  onMount( async () => {
    $feeds_store = await fetch_feed();
    await syncPostsInDB($feeds_store);
    $posts_store = await fetch_posts();
  });
</script>

<Titlebar/>

<div class="flex h-screen overflow-hidden" style="padding-top: var(--titlebar-height);">
  <!-- First Column: RSS Feeds -->
  <RssFeed/>

  <!-- Second Column: News List -->
  <PostFeed/>

  <!-- Third Column: Webpage Preview -->
  <div class="w-full bg-gray-50">
    {#if $selected_post}
      <iframe
        src={$selected_post.link}
        class="w-full h-full border-none"
        title={$selected_post.title}
      ></iframe>
    {:else}
      <p class="p-4 text-gray-600">Select a news item to preview</p>
    {/if}
  </div>
</div>
