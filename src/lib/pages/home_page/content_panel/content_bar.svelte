<script lang="ts">
    import { openUrl } from "@tauri-apps/plugin-opener";
    import { writeText } from '@tauri-apps/plugin-clipboard-manager';

    import type { ContentResult, PostResult } from "$lib/types";
    import { timeToRead } from "$lib/utils/time";

    import { toastStore } from '$lib/stores/toast_store';

    import Fa from "svelte-fa";
    import { 
        faCircleCheck,
        faShareNodes,
        faStar,
        faGlobe,
    } from "@fortawesome/free-solid-svg-icons";
    import { mark_post_as_fav, mark_post_as_read } from "$lib/dao/post_db";
    import { TOAST_MESSAGE_TYPE } from "$lib/constants";
    import { update_post_feed_counter_value } from "../common";

    const { data, post }: { data: ContentResult; post: PostResult } = $props();

    let read_status = $state(post.read);
    let is_fav = $state(post.is_fav);

    const handleShareButton = async () => {
        await writeText(post.link);
        toastStore.add(
            TOAST_MESSAGE_TYPE.INFO,
			'Copied link to Clipboard',
			4000
		);
    }

    const handleReadButton = async () => {
        await mark_post_as_read(post.id, !read_status);
        read_status = !read_status;
        
        update_post_feed_counter_value(post.feed_id, read_status? -1:1);
    }

    const handleFavouriteButton = async () => {
        await mark_post_as_fav(post.id, !is_fav);
        is_fav = !is_fav;
    }

    const handleOpenURL = async () => {
        await openUrl(post.link);
    }
</script>

<div class="sticky top-0 z-50 bg-base-100 border-b border-base-300 flex items-center justify-between p-2 pl-6">
  <!-- Left section: title and word count -->
  <div class="flex flex-col">
    <span class="text-lg font-semibold text-text1 max-w-3xl">
        {post.title}
    </span>
    <span class="text-sm">
        🕒 <span class="text-base-content/70">{`${timeToRead(data.word_count)} min read`}</span>
    </span>
  </div>

  <!-- Right section: action buttons -->
  <div class="flex items-center space-x-2">
    <!-- Share Button -->
    <button class="btn btn-circle btn-ghost p-5" onclick={handleShareButton}>
        <Fa icon={faShareNodes} size="lg" title="Copy link to Clipboard" />
    </button>

    <!-- Mark Read -->
    <button class="btn btn-ghost btn-circle p-5" onclick={handleReadButton}>
        <Fa icon={faCircleCheck} size="lg" title="Mark as Read" 
            color="{read_status? "var(--color-success)":""}"
        />
    </button>

    <!-- Mark Favourite -->
    <button class="btn btn-circle btn-ghost p-5" onclick={handleFavouriteButton}>
        <Fa icon={faStar} size="lg" title="Mark Favorite" 
            color="{is_fav? "var(--color-accent)":""}"
        />
    </button>

    <!-- Open URL -->
    <button class="btn btn-circle btn-ghost p-5" onclick={handleOpenURL}>
        <Fa icon={faGlobe} size="lg" title="Open in browser" />
    </button>
  </div>
</div>
