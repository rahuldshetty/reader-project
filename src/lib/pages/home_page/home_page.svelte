<script>
    import SideBar from "./side_bar/side_bar.svelte";

    import MainModal from "../modals/main_modal.svelte";
    import FeedPanel from "./feed_panel/feed_panel.svelte";

    let posts = [
        { title: "Post 1", time: "10:00 AM" },
        { title: "Post 2", time: "11:00 AM" },
    ];
    let selectedPost = {
        title: "Post 1",
        content: "This is the news content.",
    };
</script>

<MainModal />

<div class="flex h-screen w-screen overflow-hidden pt-[var(--titlebar-height)]">
    <SideBar/>
    <FeedPanel />

    <!-- Column 3: Post List -->
    <div
        class="flex flex-col w-64 sm:w-80 bg-base-100 border-r border-base-300"
    >
        <div class="overflow-auto flex-grow p-2 space-y-2">
            {#each posts as post}
                <div class="p-2 rounded hover:bg-base-200 cursor-pointer">
                    <div class="font-bold">{post.title}</div>
                    <div class="text-xs text-gray-500">{post.time}</div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Column 4: News Content -->
    <div class="flex flex-col flex-grow bg-base-100 p-4 overflow-auto">
        <h1 class="text-xl font-bold mb-2">{selectedPost.title}</h1>
        <p>{selectedPost.content}</p>
    </div>
</div>
