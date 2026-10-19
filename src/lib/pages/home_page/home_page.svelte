<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { get } from "svelte/store";
    import { SCREEN } from "$lib/constants";
    import {
        active_post_id,
        active_screen,
        is_mobile,
        mobile_active_panel,
        MOBILE_MEDIA_QUERY,
        type MobilePanel,
    } from "$lib/stores/app_store";
    import { handle_keydown } from "$lib/services/keyboard_shortcuts";

    import SideBar from "./side_bar/side_bar.svelte";
    import MainModal from "../modals/main_modal.svelte";
    import FeedPanel from "./feed_panel/feed_panel.svelte";
    import PostsPanel from "./posts_panel/posts_panel.svelte";
    import ContentPanel from "./content_panel/content_panel.svelte";
    import ToastManager from "../toast_manager/toast_manager.svelte";
    import BrowsePanel from "./browse_panel/browse_panel.svelte";
    import MobileNav from "$lib/components/mobile_nav.svelte";

    const updateMobileState = () => {
        is_mobile.set(window.matchMedia(MOBILE_MEDIA_QUERY).matches);
    };

    // The bottom bar is hidden while reading so the article owns the screen.
    const hide_mobile_nav = $derived(
        $is_mobile &&
            (($active_screen === SCREEN.FEEDS &&
                $mobile_active_panel === "content") ||
                ($active_screen === SCREEN.BROWSE && $active_post_id !== -1)),
    );

    // Handle browser/device back button on mobile
    const handleBackButton = (event: PopStateEvent) => {
        if (!get(is_mobile)) return;

        if (get(active_screen) === SCREEN.BROWSE) {
            event.preventDefault();
            if (get(active_post_id) !== -1) {
                active_post_id.set(-1);
            } else {
                active_screen.set(SCREEN.FEEDS);
                mobile_active_panel.set("feeds");
            }
            history.pushState({ screen: SCREEN.BROWSE }, "");
            return;
        }

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

    // Browse is a separate screen on mobile, and an article inside Browse is
    // an overlay. Register both in history so the Android back gesture closes
    // the overlay/screen instead of leaving the app.
    const unsubscribeScreen = active_screen.subscribe((screen) => {
        if (
            typeof window !== "undefined" &&
            get(is_mobile) &&
            screen === SCREEN.BROWSE
        ) {
            history.pushState({ screen }, "");
        }
    });

    const unsubscribeBrowsePost = active_post_id.subscribe((post_id) => {
        if (
            typeof window !== "undefined" &&
            get(is_mobile) &&
            get(active_screen) === SCREEN.BROWSE &&
            post_id !== -1
        ) {
            history.pushState({ screen: SCREEN.BROWSE, post_id }, "");
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
        unsubscribeScreen();
        unsubscribeBrowsePost();
    });
</script>

<MainModal />
<ToastManager />

<div
    class="flex h-[100dvh] w-full overflow-hidden {$is_mobile
        ? ''
        : 'md:pt-[var(--titlebar-height)]'}"
    class:mobile-shell={$is_mobile}
    class:mobile-shell-reading={hide_mobile_nav}
>
    <!-- Desktop: Show sidebar -->
    {#if !$is_mobile}
        <div class="hidden md:flex">
            <SideBar />
        </div>
    {/if}

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
    {:else if $active_screen == SCREEN.BROWSE}
        <BrowsePanel />
    {/if}
</div>

<!-- Mobile bottom navigation -->
<MobileNav />
