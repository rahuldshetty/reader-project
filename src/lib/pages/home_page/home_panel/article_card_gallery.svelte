<script lang="ts">
    import type { PostResult } from "$lib/types";
    import { timeAgo } from "$lib/utils/time";

    import bg1 from "$lib/assets/bg1.jpg";
    import bg2 from "$lib/assets/bg2.jpg";
    import bg3 from "$lib/assets/bg3.jpg";
    import bg4 from "$lib/assets/bg4.jpg";
    import bg5 from "$lib/assets/bg5.jpg";
    import bg6 from "$lib/assets/bg6.jpg";

    const { posts }: { posts: PostResult[] } = $props();

    let index = $state(0);

    const nextPost = () => {
        index = (index + 1) % posts.length;
    };

    const prevPost = () => {
        if(index == 0){
            index = posts.length - 1;
        } else 
            index = (index - 1);
    };

    const get_random_bg = () => {
        return getRandomElement([
            bg1,
            bg2,
            bg3,
            bg4,
            bg5,
            bg6,
        ])
    }

    function getRandomElement<T>(arr: T[]): T {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }
</script>

{#if posts.length > 0}
    <div class="card h-full bg-base-100 shadow-sm flex flex-col">
    {#if posts[index].image != ""}
        <figure class="h-1/2">
        <img
            src={posts[index].image}
            alt={posts[index].title}
            class="w-full h-full object-cover"
        />
        </figure>
    {:else}
        <figure class="h-1/2">
        <img
            src={get_random_bg()}
            class="w-full h-full object-cover"
        />
        </figure>
    {/if}

    <div class="card-body flex-1">
        <h2 class="card-title">
            {posts[index].title}
        </h2>
        <div>
            <span>{timeAgo(posts[index].pubDate)}</span>
        </div>
        <div class="card-actions justify-end">
        <div class="join">
            <button on:click={prevPost} class="join-item btn">«</button>
            <button on:click={nextPost} class="join-item btn">»</button>
        </div>
        </div>
  </div>
</div>
{/if}
