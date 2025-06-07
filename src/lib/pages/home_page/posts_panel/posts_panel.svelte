<script lang="ts">
    import { derived } from "svelte/store";
    import {
        posts_store,
        refreshing_posts,
        active_feed_id,
        posts_infinite_loader as loaderState,
    } from "$lib/stores/app_store";

    import { load_new_posts } from "$lib/pages/home_page/common";
    import PostItem from "./post_item.svelte";
    import LoadingSpinner from "$lib/pages/components/loading_spinner.svelte";

    import { InfiniteLoader } from "svelte-infinite";
    import PostBar from "./post_bar.svelte";

    let scrollContainer: Element;

    const loadMorePosts = async () => {
        if (loaderState.isFirstLoad) {
            loaderState.loaded();
        }
        const is_loaded_more = await load_new_posts($active_feed_id);
        if (is_loaded_more) {
            loaderState.loaded();
        } else {
            loaderState.complete();
        }
    };

    active_feed_id.subscribe((_)=> {
        loaderState.reset();
        if(scrollContainer){
            scrollContainer.scrollTop = 0;
        }
    });

    const filtered_posts = derived([posts_store], ([$posts_store]) => {
        return $posts_store;
    });
</script>

<div class="flex flex-col w-64 sm:w-80 bg-base-100 border-r border-base-300">
    <PostBar />
    {#if $refreshing_posts}
        <LoadingSpinner messaage="Refreshing posts..." />
    {:else}
        <div bind:this={scrollContainer} class="overflow-auto overflow-x-hidden">
            <ul class="menu gap-2 bg-base-100 rounded-box">
                <InfiniteLoader {loaderState} triggerLoad={loadMorePosts}>
                    {#each $filtered_posts as post}
                        <PostItem {post} />
                    {/each}

                    {#snippet loading()}
                    <div class="flex justify-center">
                        <span class="loading loading-dots loading-lg"></span>
                    </div>
                    {/snippet}

                    {#snippet noData()}
                        <div class="h-0 m-0"></div>
                    {/snippet}
                </InfiniteLoader>
            </ul>
        </div>
    {/if}
</div>
