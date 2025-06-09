<script lang="ts">
  import { fetch_posts } from "$lib/dao/post_db";
  import type { PostResult } from "$lib/types";
  import { onMount } from "svelte";
  import LeftArticleCard from "./l_article_card.svelte";
  import ArticleCardGallery from "./gallery/article_card_gallery.svelte";
  import { getRandomKElements } from "$lib/utils/html";
  import ContentPanel from "../content_panel/content_panel.svelte";
  import { active_post_id } from "$lib/stores/app_store";

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

  const handleReadMore = (post_id: number) => {
    $active_post_id = post_id;
  };
</script>

{#if $active_post_id == -1}
  <section>
    <div class="flex w-screen h-screen overflow-hidden">
      <!-- Column 1: Medium -->
      <div class="w-1/4 p-4 overflow-hidden h-full flex flex-col pb-20">
        {#each getRandomKElements(posts, 3) as post}
          <LeftArticleCard {post} onclick={() => handleReadMore(post.id)} />
          <div class="divider"></div>
        {/each}
      </div>

      <!-- Column 2: Large -->
      <div class="w-2/4 p-4 overflow-y-auto">
        <ArticleCardGallery
          posts={getRandomKElements(posts, 6)}
          onclick={handleReadMore}
        />
      </div>

      <!-- Column 3: Small -->
      <div class="w-1/6 p-4 overflow-hidden h-full flex flex-col">
        <!-- <h1 class="m-2 text-lg font-bold">What happened last week?</h1> -->
        {#each getRandomKElements(posts, 3) as post}
          <LeftArticleCard {post} onclick={() => handleReadMore(post.id)} />
          <div class="divider"></div>
        {/each}
      </div>
    </div>
  </section>
{:else}
  <ContentPanel />
{/if}
