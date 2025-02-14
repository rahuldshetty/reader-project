<script>
    import { slide } from 'svelte/transition';
    import { read_post } from "$lib/db";
    import { selected_post, feed_unread_post_count, posts_by_feed_store, is_loading_post_content } from "$lib/store";
    import { timeAgo } from "$lib/utils";

    const { post } = $props();

    const postIndex = $derived(post.rowid);
    const postId = $derived(post.id);
    const postFeedId = $derived(post.feed_id);
    const postTitle = $derived(post.title);
    const postDate = $derived(timeAgo(post.pubDate));

    const isPostSelected = $derived($selected_post && $selected_post.id == post.id)

    let post_read = $derived(post.read == 1);

    const handleSelectPost = async () => {
        $selected_post = post;
        $is_loading_post_content = true;
        
        if(!post_read){
            await read_post(postId);
            $feed_unread_post_count[postFeedId] -= 1;
            $posts_by_feed_store[postFeedId][postIndex].read = 1;
        }
    }

</script>


<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li 
    transition:slide={{delay:200, duration:500}}
    class="p-4 border-b hover:bg-gray-100 hover:text-text2 cursor-pointer
    { isPostSelected ? "bg-slate-100" : "text-text1"}
    "
    onclick={handleSelectPost}
>
    <h3 class="text-sm font-semibold">{postTitle}</h3>
    <p class="text-xs text-text2">{postDate}</p>
    {#if !post_read}
        <div class="text-xs text-primary2 font-extrabold relative">
            <p class="absolute right-0 bottom-0 z-0">
                NEW
            </p>
        </div>
    {/if}
</li>
