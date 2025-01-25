<script>
    import { selected_post } from "$lib/store";
    import { timeAgo } from "$lib/utils";
    const {post} = $props();

</script>


<li
    class="p-4 border-b hover:bg-gray-100 cursor-pointer
    {
        ($selected_post && $selected_post.id == post.id) ? "bg-slate-100" : ""
    }
    "
    on:click={() => $selected_post = post}
>
    <h3 class="text-sm font-semibold">{post.title}</h3>
    <p class="text-xs text-gray-600">{timeAgo(post.pubDate)}</p>
</li>
