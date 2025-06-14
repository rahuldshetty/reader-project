<script lang="ts">
    import { derived } from "svelte/store";
    import {
        posts_store,
        refreshing_posts,
        active_feed_id
    } from "$lib/stores/app_store";

    import { load_new_posts } from "$lib/pages/home_page/common";
    import PostItem from "./post_item.svelte";
    import LoadingSpinner from "$lib/pages/components/loading_spinner.svelte";
    import PostBar from "./post_bar.svelte";


    let listElement: HTMLDivElement;

    active_feed_id.subscribe((value)=> {
        if(listElement){
            listElement.scrollTop = 0;
        }
    });

    const filtered_posts = derived([posts_store], ([$posts_store]) => {
        return $posts_store;
    });

    const handleScrollEvent = async (event: UIEvent & { currentTarget: EventTarget & HTMLDivElement; }) =>{
        if(listElement){
            
            console.log(listElement.clientHeight);
            const scrollTop = listElement.scrollTop;
            const clientHeight = listElement.clientHeight;
            const scrollHeight = listElement.scrollHeight;
            const threshold = 100; // px from bottom

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                await load_new_posts($active_feed_id);
            }
        }
    }
</script>

<div class="flex flex-col h-full w-64 sm:w-80 bg-base-100 border-r border-base-300">
    <PostBar />
    {#if $refreshing_posts}
        <LoadingSpinner messaage="Refreshing posts..." />
    {:else}
        <div bind:this={listElement} onscroll={(e)=>handleScrollEvent(e)} class="overflow-auto overflow-x-hidden">
            <ul class="menu gap-2 bg-base-100 rounded-box">
                {#each $filtered_posts as post}
                    <PostItem {post} />
                {/each}
            </ul>
        </div>
    {/if}
</div>
