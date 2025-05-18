<script lang="ts">
    import type { PostResult } from "$lib/types";
    import { timeAgo }  from "$lib/utils/time";
    import { active_post_id } from "$lib/stores/app_store";

    const {post} : { post:PostResult } = $props();

    const handleOnPostClick = async () => {
        $active_post_id = post.id;
    }
</script>

<li class="rounded-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
    onclick={handleOnPostClick}
>
      <a class="flex gap-2 p-3 {$active_post_id == post.id? "menu-active":""}">
        {#if post.image}
          <img
            src={post.image}
            alt="Post thumbnail"
            class="w-18 h-18 rounded object-cover"
          />
        {/if}
        <div class="flex flex-col p-1">
          <p class="line-clamp-2 {post.read?"font-normal":"font-semibold"}">{post.title}</p>
          <span>{timeAgo(post.pubDate)}</span>
        </div>
      </a>
</li>
