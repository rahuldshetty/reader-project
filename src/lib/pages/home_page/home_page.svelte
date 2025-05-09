<script>
    import SideBar from "./side_bar/side_bar.svelte";
    import MainModal from "../modals/main_modal.svelte";
    import FeedPanel from "./feed_panel/feed_panel.svelte";
    import PostsPanel from "./posts_panel/posts_panel.svelte";
    import ContentPanel from "./content_panel/content_panel.svelte";
    import ToastManager from "../toast_manager/toast_manager.svelte";
</script>

<MainModal />
<ToastManager/>

<div class="flex h-screen w-screen overflow-hidden pt-[var(--titlebar-height)]">
    <SideBar/>
    <FeedPanel />
    <PostsPanel/>
    <ContentPanel/>
</div>
