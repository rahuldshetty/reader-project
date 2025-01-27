<script>
    import { read_post } from "$lib/db";
    import { selected_post, feed_unread_post_count } from "$lib/store";
    import { timeAgo } from "$lib/utils";
    const {post} = $props();
    let post_read = $state(post.read == 1);

    const handleSelectPost = async () => {
        $selected_post = post;
        if(!post_read){
            $feed_unread_post_count[post.feed_id] -= 1
            post_read = true;
            await read_post(post.id);
        }
    }

</script>


<li
    class="p-4 border-b hover:bg-gray-100 cursor-pointer
    {
        ($selected_post && $selected_post.id == post.id) ? "bg-slate-100" : ""
    }
    "
    on:click={handleSelectPost}
>
    <h3 class="text-sm font-semibold">{post.title}</h3>
    <p class="text-xs text-gray-600">{timeAgo(post.pubDate)}</p>
    {#if !post_read}
        <div class="text-xs text-primary2 font-extrabold relative">
            <p class="absolute right-0 bottom-0">
                NEW
            </p>
        </div>
    {/if}
</li>
