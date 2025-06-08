<script lang="ts">
  import { fetch_posts } from "$lib/dao/post_db";
  import type { PostResult } from "$lib/types";
  import { onMount } from "svelte";
  import LeftArticleCard from "./l_article_card.svelte";
    import ArticleCardGallery from "./article_card_gallery.svelte";

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let loading = $state(false);
  let posts: PostResult[] = $state([]);

  onMount(async () => {
    loading = true;
    posts = await fetch_posts();
    loading = false;
  });
</script>

<section class="">
  <div class="flex w-screen h-screen overflow-hidden">
    <!-- Column 1: Medium -->
    <div class="w-1/4 bg-base-200 p-4 overflow-hidden h-full flex flex-col pb-20">
      {#each posts.slice(0, 3) as post}
        <LeftArticleCard post={post} total={3}/>
        <div class="divider"></div>
      {/each}
    </div>

    <!-- Column 2: Large -->
    <div class="w-2/4 bg-base-100 p-4 overflow-y-auto">
      <ArticleCardGallery posts={posts.slice(3, 10)}/>
    </div>

    <!-- Column 3: Small -->
    <div class="w-1/4 bg-base-200 p-4 overflow-hidden h-full flex flex-col">
      <!-- First Row -->
      <div class="flex-1 bg-base-100 rounded-xl p-2">
        <p class="text-lg font-bold">📄 Top Half</p>
        <p>Content for row 1...</p>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Second Row -->
      <div class="flex-1 bg-base-100 rounded-xl p-2">
        <p class="text-lg font-bold">📄 Bottom Half</p>
        <p>Content for row 2...</p>
      </div>

      <div class="divider"></div>

      <!-- Third Row -->
      <div class="flex-1 bg-base-100 rounded-xl p-2">
        <p class="text-lg font-bold">📄 Bottom Half</p>
        <p>Content for row 2...</p>
      </div>
    </div>
  </div>
</section>
