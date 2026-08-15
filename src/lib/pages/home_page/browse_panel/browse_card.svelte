<script lang="ts">
  import type { PostResult } from "$lib/types";
  import { timeAgo } from "$lib/utils/time";
  import { extractTextFromHtml } from "$lib/utils/html";
  import { feed_by_id } from "$lib/stores/app_store";

  const { post, onclick }: { post: PostResult; onclick: () => void } = $props();

  const source = $derived($feed_by_id.get(post.feed_id));
  const snippet = $derived(extractTextFromHtml(post.content).slice(0, 180));
</script>

<button
  type="button"
  onclick={onclick}
  class="group text-left rounded-xl overflow-hidden bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover-lift smooth-transition cursor-pointer flex flex-col h-full"
>
  {#if post.image}
    <div class="aspect-[16/9] overflow-hidden bg-base-200">
      <img
        src={post.image}
        loading="lazy"
        alt=""
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  {/if}

  <div class="p-4 flex flex-col gap-2 flex-1">
    <div class="text-xs opacity-60 flex items-center gap-1.5 min-w-0">
      {#if source?.favicon}
        <img src={source.favicon} alt="" class="w-3.5 h-3.5 rounded-sm shrink-0" />
      {/if}
      {#if source?.title}
        <span class="truncate">{source.title}</span>
        <span class="opacity-40">·</span>
      {/if}
      <span class="whitespace-nowrap">{timeAgo(post.pubDate)}</span>
    </div>

    <h3
      class="font-semibold leading-snug {post.read
        ? 'text-base-content/80'
        : 'text-base-content'}"
    >
      {#if !post.read}
        <span class="inline-block w-2 h-2 rounded-full bg-primary shrink-0 mr-1.5 align-middle"></span>
      {/if}
      <span class="line-clamp-3">{post.title}</span>
    </h3>

    {#if snippet}
      <p class="text-sm opacity-70 line-clamp-3">{snippet}</p>
    {/if}
  </div>
</button>
