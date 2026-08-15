<script lang="ts">
    import { onMount } from "svelte";
    import dayjs from "dayjs";
    import { fetch_posts } from "$lib/dao/post_db";
    import type { PostResult } from "$lib/types";
    import {
        DB_ORDER_ENUM,
        NO_OF_POST_PULLS_PER_TIME,
        ROOT_PARENT_FEED_ID,
        BROWSE_WINDOW_WEEKS,
    } from "$lib/constants";
    import { active_post_id } from "$lib/stores/app_store";
    import { select_post } from "../common";
    import ContentPanel from "../content_panel/content_panel.svelte";
    import BrowseCard from "./browse_card.svelte";
    import Fa from "svelte-fa";
    import { faArrowLeft, faCompass } from "@fortawesome/free-solid-svg-icons";

    // Hard limit: only surface articles published within the recent window.
    const since = dayjs().subtract(BROWSE_WINDOW_WEEKS, "week").toISOString();

    let posts = $state<PostResult[]>([]);
    let loading = $state(false);
    let loaded_all = $state(false);

    const lead = $derived(posts[0] ?? null);
    const featured = $derived(posts.slice(1, 4));
    const rest = $derived(posts.slice(4));

    const loadMore = async () => {
        if (loading || loaded_all) return;
        loading = true;
        const last = posts[posts.length - 1];
        const more = await fetch_posts(
            DB_ORDER_ENUM.NEWEST,
            null,
            ROOT_PARENT_FEED_ID,
            NO_OF_POST_PULLS_PER_TIME,
            false,
            last ? last.pubDate : "",
            null,
            [],
            [],
            since,
        );
        const seen = new Set(posts.map((p) => p.id));
        const fresh = more.filter((p) => !seen.has(p.id));
        if (fresh.length === 0) loaded_all = true;
        posts = [...posts, ...fresh];
        loading = false;
    };

    onMount(() => {
        void loadMore();
    });

    const handleScroll = (e: UIEvent) => {
        const el = e.currentTarget as HTMLDivElement;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 600) {
            void loadMore();
        }
    };

    const openPost = (post: PostResult) => {
        void select_post(post);
    };

    const backToBrowse = () => {
        active_post_id.set(-1);
    };
</script>

<section
    class="relative flex-1 w-full h-full overflow-hidden flex flex-col bg-base-100 animate-fade-in"
>
    <div
        class="shrink-0 px-5 py-4 border-b border-base-300 flex items-center gap-2"
    >
        <Fa icon={faCompass} class="text-primary" />
        <h1 class="text-lg font-semibold">Browse</h1>
        <span class="text-sm opacity-50"
            >Last {BROWSE_WINDOW_WEEKS} weeks</span
        >
    </div>

    <!-- Grid stays mounted so its scroll position and loaded posts survive
         opening a reader. The reader overlays it absolutely. -->
    <div onscroll={handleScroll} class="flex-1 overflow-y-auto p-4 md:p-6">
        {#if posts.length === 0 && loading}
            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto"
            >
                {#each Array(6) as _}
                    <div class="skeleton-loading rounded-lg h-56"></div>
                {/each}
            </div>
        {:else}
            <div class="flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">
                {#if lead}
                    <BrowseCard
                        post={lead}
                        variant="lead"
                        onclick={() => openPost(lead)}
                    />
                {/if}

                {#if featured.length > 0}
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                    >
                        {#each featured as post}
                            <BrowseCard
                                {post}
                                variant="featured"
                                onclick={() => openPost(post)}
                            />
                        {/each}
                    </div>
                {/if}

                {#if rest.length > 0}
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {#each rest as post}
                            <BrowseCard
                                {post}
                                variant="standard"
                                onclick={() => openPost(post)}
                            />
                        {/each}
                    </div>
                {/if}

                {#if loading}
                    <div class="flex justify-center py-6">
                        <span class="loading loading-spinner loading-md"></span>
                    </div>
                {/if}

                {#if loaded_all && posts.length > 0}
                    <p class="text-center text-sm opacity-50 py-6">
                        That's everything from the last {BROWSE_WINDOW_WEEKS}
                        weeks
                    </p>
                {/if}

                {#if posts.length === 0 && !loading}
                    <div
                        class="flex flex-col items-center justify-center py-20 text-base-content/30 select-none"
                    >
                        <Fa icon={faCompass} size="4x" class="mb-4" />
                        <p class="text-lg font-medium">
                            No articles in the last {BROWSE_WINDOW_WEEKS} weeks
                        </p>
                    </div>
                {/if}
            </div>
        {/if}
    </div>

    {#if $active_post_id != -1}
        <div class="absolute inset-0 z-10 flex flex-col bg-base-100">
            <div
                class="shrink-0 flex items-center gap-2 p-2 border-b border-base-300 bg-base-100"
            >
                <button class="btn btn-ghost btn-sm" onclick={backToBrowse}>
                    <Fa icon={faArrowLeft} />
                    <span>Browse</span>
                </button>
            </div>
            <ContentPanel />
        </div>
    {/if}
</section>
