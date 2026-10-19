<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { get } from "svelte/store";
    import Fa from "svelte-fa";
    import { faPlus } from "@fortawesome/free-solid-svg-icons";
    import { MODAL_TYPE, SCREEN } from "$lib/constants";
    import {
        active_modal,
        active_post_id,
        active_screen,
        is_mobile,
        mobile_active_panel,
        mobile_drawer_open,
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
    import MobileDrawer from "$lib/components/mobile_drawer.svelte";
    import { t } from "$lib/i18n";

    const updateMobileState = () => {
        is_mobile.set(window.matchMedia(MOBILE_MEDIA_QUERY).matches);
    };

    // Floating actions are hidden while reading so the article owns the screen.
    const hide_mobile_chrome = $derived(
        $is_mobile &&
            (($active_screen === SCREEN.FEEDS &&
                $mobile_active_panel === "content") ||
                ($active_screen === SCREEN.BROWSE && $active_post_id !== -1)),
    );

    // Handle browser/device back button on mobile
    const handleBackButton = (event: PopStateEvent) => {
        if (!get(is_mobile)) return;

        if (get(mobile_drawer_open)) {
            event.preventDefault();
            mobile_drawer_open.set(false);
            history.pushState({ panel: get(mobile_active_panel) }, "");
            return;
        }

        if (get(active_screen) === SCREEN.BROWSE) {
            event.preventDefault();
            if (get(active_post_id) !== -1) {
                active_post_id.set(-1);
            } else {
                active_screen.set(SCREEN.FEEDS);
                mobile_active_panel.set("posts");
            }
            history.pushState({ screen: SCREEN.BROWSE }, "");
            return;
        }

        if (get(mobile_active_panel) === "content") {
            event.preventDefault();
            mobile_active_panel.set("posts");
            // Push a new state so back button works again
            history.pushState({ panel: "posts" }, "");
        }
        // At the posts root, let the default behavior close the app.
    };

    // Push initial history state and listen for panel changes
    let previousPanel: MobilePanel = "posts";
    const unsubscribePanel = mobile_active_panel.subscribe((panel) => {
        if (
            typeof window !== "undefined" &&
            get(is_mobile) &&
            panel !== previousPanel
        ) {
            // Push state when navigating forward (posts → content).
            if (previousPanel === "posts" && panel === "content") {
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
            history.pushState({ panel: "posts" }, "");
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
        {:else if $mobile_active_panel === "posts"}
            <PostsPanel />
        {:else}
            <ContentPanel />
        {/if}
    {:else if $active_screen == SCREEN.BROWSE}
        <BrowsePanel />
    {/if}
</div>

{#if $is_mobile && !hide_mobile_chrome}
    <button
        type="button"
        class="btn btn-primary btn-circle fixed bottom-[calc(1.25rem+var(--safe-area-inset-bottom))] right-4 z-40 h-14 w-14 shadow-xl"
        onclick={() => active_modal.set(MODAL_TYPE.ADD)}
        aria-label={$t("nav.add")}
    >
        <Fa icon={faPlus} size="lg" />
    </button>
{/if}

<MobileDrawer />
