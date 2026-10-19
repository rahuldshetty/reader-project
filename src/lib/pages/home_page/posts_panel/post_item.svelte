<script lang="ts">
  import type { PostResult } from "$lib/types";
  import { timeAgo } from "$lib/utils/time";
  import { extractTextFromHtml } from "$lib/utils/html";
  import { FEED_VIEW } from "$lib/constants";
  import {
    active_post_id,
    cursor_post_id,
    is_mobile,
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
  class="stagger-item smooth-transition {$is_mobile
    ? ''
    : 'rounded-lg hover-lift'}"
  data-post-id={post.id}
>
  <button
    type="button"
    onclick={handleOnPostClick}
    class="w-full text-left cursor-pointer flex gap-3 p-3 transition-colors duration-200 {$is_mobile
      ? $active_post_id == post.id
        ? 'rounded-xl bg-primary/10 ring-1 ring-primary/20'
        : 'rounded-xl border border-base-300/70 bg-base-100 active:bg-base-200/70'
      : $active_post_id == post.id
        ? 'rounded-lg menu-active active-glow'
        : 'rounded-lg'} {is_cursor_target ? 'ring-2 ring-primary/60' : ''}"
  >
    {#if !compact && post.image}
      <img
        src={post.image}
        loading="lazy"
        alt=""
        class="h-24 w-24 shrink-0 rounded-xl object-cover transition-transform duration-200 hover:scale-105 md:h-18 md:w-18 md:rounded"
      />
    {/if}

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p
        class="line-clamp-3 text-[15px] leading-snug md:line-clamp-2 md:text-base {post.read
          ? 'font-normal'
          : 'font-semibold'}"
      >
        {#if !post.read}
          <span
            class="inline-block w-2 h-2 rounded-full bg-primary shrink-0 mr-1.5 align-middle"
          ></span>
        {/if}
        {post.title}
      </p>

      {#if !compact && snippet}
        <span class="line-clamp-2 text-sm opacity-70 max-md:text-[13px]"
          >{snippet}</span
        >
      {/if}

      <span
        class="mt-auto flex min-w-0 items-center gap-1.5 text-xs opacity-60"
      >
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
