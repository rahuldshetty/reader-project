<script lang="ts">
  import type { PostResult } from "$lib/types";
  import { timeAgo } from "$lib/utils/time";
  import { active_post_id, local_user_setting } from "$lib/stores/app_store";
  import { mark_post_as_read } from "$lib/dao/post_db";
  import {
    update_post_feed_counter_value,
    update_post_store_item_by_id,
  } from "../common";

  const { post }: { post: PostResult } = $props();

  const handleOnPostClick = async () => {
    if ($local_user_setting.AUTO_READ_ON_SELECT) {
      if (!post.read) {
        await mark_post_as_read(post.id, true);
        update_post_feed_counter_value(post.feed_id, -1);
        update_post_store_item_by_id(post.id, { ...post, read: true });
      }
    }
    $active_post_id = post.id;
  };
</script>

<li class="stagger-item rounded-lg hover-lift smooth-transition">
  <button
    type="button"
    onclick={handleOnPostClick}
    class="w-full text-left cursor-pointer flex gap-2 p-3 rounded-lg transition-colors duration-200 {$active_post_id ==
    post.id
      ? 'menu-active active-glow'
      : ''}"
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
