<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { get } from "svelte/store";
    import { SCREEN } from "$lib/constants";
    import {
        active_screen,
        is_mobile,
        mobile_active_panel,
        type MobilePanel,
    } from "$lib/stores/app_store";
    import { handle_keydown } from "$lib/services/keyboard_shortcuts";

    import SideBar from "./side_bar/side_bar.svelte";
    import MainModal from "../modals/main_modal.svelte";
    import FeedPanel from "./feed_panel/feed_panel.svelte";
    import PostsPanel from "./posts_panel/posts_panel.svelte";
    import ContentPanel from "./content_panel/content_panel.svelte";
    import ToastManager from "../toast_manager/toast_manager.svelte";
    import HomePanel from "./home_panel/home_panel.svelte";
    import MobileNav from "$lib/components/mobile_nav.svelte";

    // Mobile detection based on viewport width
    const MOBILE_BREAKPOINT = 768;

    const updateMobileState = () => {
        is_mobile.set(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Handle browser/device back button on mobile
    const handleBackButton = (event: PopStateEvent) => {
        if (!get(is_mobile)) return;

        const currentPanel = get(mobile_active_panel);

        if (currentPanel === "content") {
            event.preventDefault();
            mobile_active_panel.set("posts");
            // Push a new state so back button works again
            history.pushState({ panel: "posts" }, "");
        } else if (currentPanel === "posts") {
            event.preventDefault();
            mobile_active_panel.set("feeds");
            // Push a new state so back button works again
            history.pushState({ panel: "feeds" }, "");
        }
        // If on feeds panel, let the default behavior happen (could close app or do nothing)
    };

    // Push initial history state and listen for panel changes
    let previousPanel: MobilePanel = "feeds";
    const unsubscribePanel = mobile_active_panel.subscribe((panel) => {
        if (
            typeof window !== "undefined" &&
            get(is_mobile) &&
            panel !== previousPanel
        ) {
            // Push state when navigating forward (feeds→posts, posts→content)
            if (
                (previousPanel === "feeds" && panel === "posts") ||
                (previousPanel === "posts" && panel === "content")
            ) {
                history.pushState({ panel }, "");
            }
            previousPanel = panel;
        }
    });

    onMount(() => {
        updateMobileState();
        window.addEventListener("resize", updateMobileState);
        window.addEventListener("popstate", handleBackButton);
        window.addEventListener("keydown", handle_keydown);

        // Push initial state
        if (get(is_mobile)) {
            history.pushState({ panel: "feeds" }, "");
        }
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", updateMobileState);
            window.removeEventListener("popstate", handleBackButton);
            window.removeEventListener("keydown", handle_keydown);
        }
        unsubscribePanel();
    });
</script>

<MainModal />
<ToastManager />

<div
    class="flex h-screen w-full overflow-hidden md:pt-[var(--titlebar-height)]"
    class:pb-14={$is_mobile}
>
    <!-- Desktop: Show sidebar -->
    <div class="hidden md:flex">
        <SideBar />
    </div>

    {#if $active_screen == SCREEN.FEEDS}
        <!-- Desktop: Show all panels, Mobile: Show only active panel -->
        {#if !$is_mobile}
            <FeedPanel />
            <PostsPanel />
            <ContentPanel />
        {:else if $mobile_active_panel === "feeds"}
            <FeedPanel />
        {:else if $mobile_active_panel === "posts"}
            <PostsPanel />
        {:else if $mobile_active_panel === "content"}
            <ContentPanel />
        {/if}
    {:else if $active_screen == SCREEN.HOME}
        <HomePanel />
    {/if}
</div>

<!-- Mobile bottom navigation -->
<MobileNav />
