<script lang='ts'>
  import RssFeed from "../lib/feed/rss_feed.svelte";

  let news = [
    { id: 1, title: "The Last Migrant Caravans Before Trump’s Inauguration", summary: "A Times photographer made two trips to southern Mexico to follow groups of migrants as they walked toward the United States.", url: "https://www.nytimes.com/card/2025/01/18/world/americas/mexico-migrants-border-trump" },

    { id: 2, title: "Trump’s Return Has Unnerved World Leaders. But Not India.", summary: "An upward trajectory in relations is “almost inevitable,” the U.S. ambassador, Eric Garcetti, said in an interview before leaving his post.", url: "https://www.nytimes.com/2025/01/18/world/asia/india-eric-garcetti-interview.html" },
  ];
  let selectedNews = $state('');

  const openNews = (newsItem) => {
    selectedNews = newsItem;
  };
</script>

<div class="flex h-screen overflow-hidden">
  <!-- First Column: RSS Feeds -->
  <RssFeed/>

  <!-- Second Column: News List -->
  <div class="w-1/4 bg-white border-r">
    <h2 class="text-xl font-bold p-4">All Posts</h2>
    <ul>
      {#each news as item}
        <li
          class="p-4 border-b hover:bg-gray-100 cursor-pointer"
          on:click={() => openNews(item)}
        >
          <h3 class="text-lg font-semibold">{item.title}</h3>
          <p class="text-sm text-gray-600">{item.summary}</p>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Third Column: Webpage Preview -->
  <div class="w-2/4 bg-gray-50">
    {#if selectedNews}
      <iframe
        src={"https://www.removepaywall.com/search?url=" + selectedNews.url}
        class="w-full h-full border-none"
        title={selectedNews.title}
      ></iframe>
    {:else}
      <p class="p-4 text-gray-600">Select a news item to preview</p>
    {/if}
  </div>
</div>
