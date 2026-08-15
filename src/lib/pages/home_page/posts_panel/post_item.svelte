<script lang="ts">
  import type { PostResult } from "$lib/types";
  import { timeAgo } from "$lib/utils/time";
  import {
    active_post_id,
    cursor_post_id,
    local_user_setting,
    is_mobile,
    mobile_active_panel,
  } from "$lib/stores/app_store";
  import { select_post } from "../common";

  const { post }: { post: PostResult } = $props();

  const handleOnPostClick = () => {
    void select_post(post);
  };

  const is_cursor_target = $derived(
    $local_user_setting.SHORTCUTS.ENABLED && $cursor_post_id == post.id,
  );
</script>

<li
  class="stagger-item rounded-lg hover-lift smooth-transition"
  data-post-id={post.id}
>
  <button
    type="button"
    onclick={handleOnPostClick}
    class="w-full text-left cursor-pointer flex gap-2 p-3 rounded-lg transition-colors duration-200 {$active_post_id ==
    post.id
      ? 'menu-active active-glow'
      : ''} {is_cursor_target ? 'ring-2 ring-primary/60' : ''}"
  >
    {#if post.image}
      <img
        src={post.image}
        loading="lazy"
        alt="Post thumbnail"
        class="w-18 h-18 rounded object-cover transition-transform duration-200 hover:scale-105"
      />
    {/if}
    <div class="flex flex-col p-1">
      <p class="line-clamp-2 {post.read ? 'font-normal' : 'font-semibold'}">
        {post.title}
      </p>
      <span class="text-sm opacity-70">{timeAgo(post.pubDate)}</span>
    </div>
  </button>
</li>
