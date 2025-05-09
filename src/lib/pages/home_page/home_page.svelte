<script>
    import SideBar from "./side_bar/side_bar.svelte";
    import MainModal from "../modals/main_modal.svelte";
    import FeedPanel from "./feed_panel/feed_panel.svelte";
    import PostsPanel from "./posts_panel/posts_panel.svelte";

    let selectedPost = {
        title: "Post 1",
        content: "This is the news content.",
    };
</script>

<MainModal />

<div class="flex h-screen w-screen overflow-hidden pt-[var(--titlebar-height)]">
    <SideBar/>
    <FeedPanel />
    <PostsPanel/>

    <!-- Column 4: News Content -->
    <div class="flex flex-col flex-grow bg-base-100 p-4 overflow-auto">
        <h1 class="text-xl font-bold mb-2">{selectedPost.title}</h1>
        <p>{selectedPost.content}</p>
    </div>
</div>
