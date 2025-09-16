<script lang="ts">
  import { fetch_posts_by_date } from "$lib/dao/post_db";
  import type { PostResult } from "$lib/types";
  import { onMount } from "svelte";
  import ArticleCardGallery from "./gallery/article_card_gallery.svelte";
  import { getRandomKElements } from "$lib/utils/html";
  import ContentPanel from "../content_panel/content_panel.svelte";
  import { active_post_id } from "$lib/stores/app_store";
  import Calendar from "./calendar.svelte";
  import HomePanelStats from "./stats.svelte";
    import Weather from "./weather.svelte";

  let selected_date = $state(new Date().toISOString().split("T")[0]);
  let loading = $state(false);
  let posts: PostResult[] = $state([]);

  onMount(async () => {
    loading = true;
    posts = await fetch_posts_by_date(selected_date);
    loading = false;
  });

  const handleReadMore = (post_id: number) => {
    $active_post_id = post_id;
  };

  const changePostByDate = async (date: string) => {
    selected_date = date;
    posts = await fetch_posts_by_date(date);
  }
</script>

{#if $active_post_id == -1}
  <section>
    <div class="flex w-screen h-screen overflow-hidden bg-base-300">
      <div class="p-4 overflow-y-auto">
        <div class="flex flex-col gap-6 max-w-xs">
          <HomePanelStats total_posts={posts.length} date={selected_date}/>
          <Calendar {changePostByDate} />
          <Weather/>
        </div>
      </div>


      <!-- Column 2: Large -->
      <div class="w-2/4 p-4 overflow-y-auto">
        <ArticleCardGallery
          posts={getRandomKElements(posts, 6)}
          onclick={handleReadMore}
        />
      </div>
    </div>
  </section>
{:else}
  <ContentPanel />
{/if}
