<script lang="ts">
  import type { PostResult } from "$lib/types";
  import { timeAgo } from "$lib/utils/time";
  import { extractTextFromHtml } from "$lib/utils/html";
  import { FEED_VIEW } from "$lib/constants";
  import {
    active_post_id,
    cursor_post_id,
    local_user_setting,
    feed_by_id,
    feed_view,
  } from "$lib/stores/app_store";
  import { select_post } from "../common";
  import { t } from "$lib/i18n";

  const { post }: { post: PostResult } = $props();

  const handleOnPostClick = () => {
    void select_post(post);
  };

  const is_cursor_target = $derived(
    $local_user_setting.SHORTCUTS.ENABLED && $cursor_post_id == post.id,
  );

  const source = $derived($feed_by_id.get(post.feed_id));
  const snippet = $derived(extractTextFromHtml(post.content).slice(0, 140));
  const compact = $derived($feed_view == FEED_VIEW.LIST);
</script>

<li
  class="stagger-item rounded-lg hover-lift smooth-transition"
  data-post-id={post.id}
>
  <button
    type="button"
    onclick={handleOnPostClick}
    class="w-full text-left cursor-pointer flex gap-3 p-3 rounded-lg transition-colors duration-200 {$active_post_id ==
    post.id
      ? 'menu-active active-glow'
      : ''} {is_cursor_target ? 'ring-2 ring-primary/60' : ''}"
  >
    {#if !compact && post.image}
      <img
        src={post.image}
        loading="lazy"
        alt=""
        class="w-18 h-18 rounded object-cover transition-transform duration-200 hover:scale-105 shrink-0"
      />
    {/if}

    <div class="flex flex-col gap-0.5 min-w-0 flex-1">
      <p class="line-clamp-2 {post.read ? 'font-normal' : 'font-semibold'}">
        {#if !post.read}
          <span
            class="inline-block w-2 h-2 rounded-full bg-primary shrink-0 mr-1.5 align-middle"
          ></span>
        {/if}
        {post.title}
      </p>

      {#if !compact && snippet}
        <span class="text-sm opacity-70 line-clamp-2">{snippet}</span>
      {/if}

      <span class="text-xs opacity-60 flex items-center gap-1.5 min-w-0">
        {#if source?.favicon}
          <img
            src={source.favicon}
            alt=""
            class="w-3.5 h-3.5 rounded-sm shrink-0"
          />
        {/if}
        {#if source?.title}
          <span class="truncate">{source.title}</span>
          <span class="opacity-40">·</span>
        {/if}
        <span class="whitespace-nowrap">{timeAgo(post.pubDate, $t)}</span>
      </span>
    </div>
  </button>
</li>
