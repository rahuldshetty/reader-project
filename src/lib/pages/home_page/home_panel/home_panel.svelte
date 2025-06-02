<script lang="ts">
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const feeds = [
    { id: 1, title: "Breaking: Feed 1", description: "Exciting news from Feed 1", date: "2025-05-27" },
    { id: 2, title: "Exclusive: Feed 2", description: "Latest updates from Feed 2", date: "2025-05-26" },
    { id: 3, title: "Trending: Feed 3", description: "Hot topic from Feed 3", date: "2025-05-25" }
  ];
</script>

<div class="container mx-auto p-4">
  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each feeds as feed}
      <div class="card bg-base-200 shadow hover:shadow-lg cursor-pointer">
        <figure class="h-48 bg-gray-300 animate-pulse flex items-center justify-center">
          <span class="text-gray-500">Image Placeholder</span>
        </figure>
        <div class="card-body">
          <h2 class="card-title">{feed.title}</h2>
          <p class="text-sm">{feed.description}</p>
          <p class="text-xs text-gray-400">{feed.date}</p>
          <div class="card-actions justify-end">
            <button class="btn btn-sm btn-primary">Read More</button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>