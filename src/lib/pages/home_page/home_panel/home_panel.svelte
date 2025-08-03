<script lang="ts">
  import { fetch_posts } from "$lib/dao/post_db";
  import type { PostResult } from "$lib/types";
  import { onMount } from "svelte";
  import LeftArticleCard from "./l_article_card.svelte";
  import ArticleCardGallery from "./gallery/article_card_gallery.svelte";
  import { getRandomKElements } from "$lib/utils/html";
  import ContentPanel from "../content_panel/content_panel.svelte";
  import { active_post_id } from "$lib/stores/app_store";
    import Calendar from "./calendar.svelte";

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
      <div class="p-4 overflow-y-auto">
        <Calendar/>
      </div>

      <!-- Column 2: Large -->
      <div class="w-2/4 p-4 overflow-y-auto">
        <ArticleCardGallery
          posts={getRandomKElements(posts, 6)}
          onclick={handleReadMore}
        />
      </div>
  </section>
{:else}
  <ContentPanel />
{/if}
