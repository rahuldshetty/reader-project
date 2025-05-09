<script lang="ts">
    import type { PostResult } from "$lib/types";
    import { timeAgo }  from "$lib/utils/time";
    import { active_post_id } from "$lib/stores/app_store";

    const {post} : { post:PostResult } = $props();

    const handleOnPostClick = async () => {
        $active_post_id = post.id;
    }
</script>

<li class="p-2 rounded-lg"
    onclick={handleOnPostClick}
>
      <a class="flex gap-4 {$active_post_id == post.id? "menu-active":""}">
        {#if post.image}
          <img
            src={post.image}
            alt="Post thumbnail"
            class="w-20 h-20 mt-1 rounded object-cover"
          />
        {/if}
        <div class="flex flex-col">
          <p class="font-semibold line-clamp-2">{post.title}</p>
          <span class="">{timeAgo(post.pubDate)}</span>
        </div>
      </a>
</li>
