<script lang="ts">
    import { get_random_bg } from "$lib/pages/components/random_background";
    import type { PostResult } from "$lib/types";
    import { timeAgo } from "$lib/utils/time";
    import { onMount, onDestroy } from "svelte";
    import FeedInfo from "./feed_info.svelte";

    const { posts }: { posts: PostResult[] } = $props();

    let index = $state(0);
    let bg_image = $state(get_random_bg());

    const DURATION = 10000; // milliseconds
    let interval: number | undefined;
    let progress = $state(0); // 0 to 100

    const nextPost = () => {
        index = (index + 1) % posts.length;
        bg_image = get_random_bg();
        progress = 0;
        startTimer();
    };

    const prevPost = () => {
        bg_image = get_random_bg();
        if (index === 0) {
            index = posts.length - 1;
        } else {
            index = index - 1;
        }
        progress = 0;
        startTimer();
    };

    const startTimer = () => {
        clearInterval(interval);
        let elapsed = 0;
        const step = 10; // ms
        interval = setInterval(() => {
            elapsed += step;
            progress = Math.min(100, (elapsed / DURATION) * 100);
            if (elapsed >= DURATION) {
                nextPost();
                elapsed = 0;
            }
        }, step);
    };

    onMount(() => {
        startTimer();
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

{#if posts && posts.length > 0}
<div class="h-full shadow-sm flex flex-col">
    {#if posts[index].image != ""}
        <figure class="h-3/4">
            <img
                src={posts[index].image}
                alt={posts[index].title}
                class="w-full h-full object-cover"
            />
        </figure>
    {:else}
        <figure class="h-3/4">
            <img
                src={bg_image}
                class="w-full h-full object-cover"
            />
        </figure>
    {/if}

    <!-- Progress Bar -->
    <progress class="progress w-full h-1" value={progress} max="100"></progress>

    <div class="card-body flex-1">
        <h2 class="card-title">
            {posts[index].title}
        </h2>
        <div class="flex flex-row gap-2">
            <FeedInfo feed_id={posts[index].feed_id}/>
            <span>{timeAgo(posts[index].pubDate)}</span>
        </div>
        <div class="card-actions justify-end mt-auto">
            <div class="join">
                <button on:click={prevPost} class="join-item btn">«</button>
                <button on:click={nextPost} class="join-item btn">»</button>
            </div>
        </div>
    </div>
</div>
{/if}
