<script>
    import { SCREEN } from "$lib/constants";
    import { active_screen } from "$lib/stores/app_store";

    import SideBar from "./side_bar/side_bar.svelte";
    import MainModal from "../modals/main_modal.svelte";
    import FeedPanel from "./feed_panel/feed_panel.svelte";
    import PostsPanel from "./posts_panel/posts_panel.svelte";
    import ContentPanel from "./content_panel/content_panel.svelte";
    import ToastManager from "../toast_manager/toast_manager.svelte";
    import HomePanel from "./home_panel/home_panel.svelte";
</script>

<MainModal />
<ToastManager />

<div class="flex h-screen w-screen overflow-hidden pt-[var(--titlebar-height)]">
    <SideBar />
    {#if $active_screen == SCREEN.FEEDS}
        <FeedPanel />
        <PostsPanel />
        <ContentPanel />
    {:else if $active_screen == SCREEN.HOME}
        <HomePanel />
    {/if}
</div>
