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
    import { mark_post_as_read } from "$lib/dao/post_db";
    import { TOAST_MESSAGE_TYPE } from "$lib/constants";

    const { data, post }: { data: ContentResult; post: PostResult } = $props();

    let read_status = $state(post.read);

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
    }

    const handleFavouriteButton = () => {

    }

    const handleOpenURL = async () => {
        await openUrl(post.link);
    }
</script>

<div class="sticky top-0 z-50 bg-base-100 border-b border-base-300 p-4 flex items-center justify-between">
  <!-- Left section: title and word count -->
  <div class="flex flex-col">
    <span class="text-lg font-semibold text-text1 truncate">{post.title}</span>
    <span class="text-sm">
        🕒 <span class="text-base-content/70">{`${timeToRead(data.word_count)} min read`}</span>
    </span>
  </div>

  <!-- Right section: action buttons -->
  <div class="flex items-center space-x-2">
    <!-- Share Button -->
    <button class="btn btn-circle btn-ghost p-5" onclick={handleShareButton}>
        <Fa icon={faShareNodes} color="var(--color-secondary)" size="lg" title="Copy link to Clipboard" />
    </button>

    <!-- Mark Read -->
    <button class="btn btn-ghost btn-circle p-5" onclick={handleReadButton}>
        <Fa icon={faCircleCheck} size="lg" title="Mark as Read" 
            color="{read_status? "var(--color-success)":""}"
        />
    </button>

    <!-- Mark Favourite -->
    <button class="btn btn-circle btn-ghost p-5" onclick={handleFavouriteButton}>
        <Fa icon={faStar} size="lg" title="Mark Favorite" />
    </button>

    <!-- Open URL -->
    <button class="btn btn-circle btn-ghost p-5" onclick={handleOpenURL}>
        <Fa icon={faGlobe} color="var(--color-info)" size="lg" title="Mark Favorite" />
    </button>
  </div>
</div>
