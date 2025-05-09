<script lang="ts">
    import { derived } from "svelte/store";
    import { posts_store } from "$lib/stores/app_store";
    import PostItem from "./post_item.svelte";

    const filtered_posts = derived([posts_store], ([$posts_store])=>{
        return $posts_store;
    });
</script>

<div
    class="flex flex-col w-64 sm:w-80 bg-base-100 border-r border-base-300"
    >
    <div class="overflow-auto overflow-x-hidden">
        <ul class="menu bg-base-100 rounded-box">
            {#each $filtered_posts as post}
                <PostItem post={post}/>
            {/each}
        </ul>
    </div>
</div>
