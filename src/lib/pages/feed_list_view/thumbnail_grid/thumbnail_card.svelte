<script>
    import { slide } from 'svelte/transition';
    import { read_post } from "$lib/db";
    import { selected_post, feed_unread_post_count, posts_by_feed_store, is_loading_post_content } from "$lib/store";
    import { timeAgo } from "$lib/utils";

    const { post, feed } = $props();

    const postIndex = $derived(post.rowid);
    const postId = $derived(post.id);
    const postFeedId = $derived(post.feed_id);
    const postTitle = $derived(post.title);
    const postDate = $derived(timeAgo(post.pubDate));
    const postImage = $derived(post.image);

    const isPostSelected = $derived($selected_post && $selected_post.id == post.id)

    let post_read = $derived(post.read == 1);

    const handleSelectPost = async () => {
        $selected_post = post;
        
        if(!post_read){
            await read_post(postId);
            $feed_unread_post_count[postFeedId] -= 1;
            $posts_by_feed_store[postFeedId][postIndex].read = 1;
        }
    }

    function randomGradient() {
        const colors = [`hsl(${Math.random() * 360}, 80%, 60%)`, `hsl(${Math.random() * 360}, 80%, 40%)`];
        return `linear-gradient(135deg, ${colors.join(", ")})`;
    }
</script>


<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li 
    transition:slide={{delay:200, duration:500}}
    class="bg-white rounded-md shadow overflow-hidden cursor-pointer hover:bg-gray-100 hover:text-text2 transition duration-200
     { isPostSelected ? "bg-slate-100" : "text-text1"}
    "
    onclick={handleSelectPost}
>
    {#if postImage && postImage != ""}
        <img src={postImage} class="w-full h-48 object-cover" alt={postTitle}/>
    {:else}
        <div class="w-full h-48 flex items-center justify-center text-white" style="background: {randomGradient()}">
            <p class="text-sm italic opacity-75">{postTitle}</p>
        </div>
    {/if}
    <div class="p-4">
        <h2 class="text-lg font-semibold line-clamp-1">{postTitle}</h2>
        <div class="relative bottom-0 flex flex-row gap-2">
            <p class="text-sm text-gray-500">{postDate} by</p>
            <div class="">
                <div class="flex flex-col">
                    <div class="flex flex-row items-center justify-center gap-1">
                        {#if feed.favicon}
                            <img src={feed.favicon} alt="Feed Logo" class="w-6 h-6" />
                        {/if}
                        <p class="text-xs font-light right-3  z-0 italic">
                            {feed.title}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- {#if !post_read}
        <div class="text-xs text-primary2 font-extrabold absolute right-3 top-4 z-0 animate-pulse">
            NEW
        </div>
    {/if} -->
</li>
