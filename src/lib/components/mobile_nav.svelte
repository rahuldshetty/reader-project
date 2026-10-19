<script lang="ts">
    import Fa from "svelte-fa";
    import {
        faCompass,
        faGear,
        faNewspaper,
        faPlus,
    } from "@fortawesome/free-solid-svg-icons";
    import {
        active_post_id,
        active_screen,
        is_mobile,
        mobile_active_panel,
        active_modal,
    } from "$lib/stores/app_store";
    import { MODAL_TYPE, SCREEN } from "$lib/constants";
    import { t } from "$lib/i18n";

    const show_nav = $derived(
        $is_mobile &&
            !($active_screen === SCREEN.FEEDS &&
                $mobile_active_panel === "content") &&
            !($active_screen === SCREEN.BROWSE && $active_post_id !== -1),
    );

    const browse_active = $derived($active_screen === SCREEN.BROWSE);
    const feeds_active = $derived($active_screen === SCREEN.FEEDS);

    const goToBrowse = () => {
        active_post_id.set(-1);
        active_screen.set(SCREEN.BROWSE);
    };

    const goToFeeds = () => {
        active_post_id.set(-1);
        active_screen.set(SCREEN.FEEDS);
        mobile_active_panel.set("feeds");
    };

    const openSettings = () => {
        active_modal.set(MODAL_TYPE.SETTINGS);
    };

    const openAdd = () => {
        active_modal.set(MODAL_TYPE.ADD);
    };
</script>

{#if show_nav}
    <nav
        class="mobile-tabbar fixed bottom-0 left-0 right-0 z-50 border-t border-base-300/80 bg-base-100/95 shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.45)] backdrop-blur-xl"
    >
        <div class="grid h-16 grid-cols-4 items-center px-2">
            <button
                type="button"
                class="flex h-full flex-col items-center justify-center gap-0.5 text-base-content/60 transition-colors"
                class:text-primary={browse_active}
                onclick={goToBrowse}
                aria-current={browse_active ? "page" : undefined}
            >
                <span
                    class="flex h-8 w-16 items-center justify-center rounded-full transition-colors {browse_active
                        ? 'bg-primary/15'
                        : ''}"
                >
                    <Fa icon={faCompass} size="lg" />
                </span>
                <span class="text-[11px] font-medium leading-none"
                    >{$t("nav.browse")}</span
                >
            </button>

            <button
                type="button"
                class="flex h-full flex-col items-center justify-center gap-0.5 text-base-content/60 transition-colors"
                class:text-primary={feeds_active}
                onclick={goToFeeds}
                aria-current={feeds_active ? "page" : undefined}
            >
                <span
                    class="flex h-8 w-16 items-center justify-center rounded-full transition-colors {feeds_active
                        ? 'bg-primary/15'
                        : ''}"
                >
                    <Fa icon={faNewspaper} size="lg" />
                </span>
                <span class="text-[11px] font-medium leading-none"
                    >{$t("nav.feeds")}</span
                >
            </button>

            <button
                type="button"
                class="flex h-full flex-col items-center justify-center gap-0.5 text-base-content/60 transition-colors"
                onclick={openAdd}
            >
                <span
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-content shadow-sm"
                >
                    <Fa icon={faPlus} size="lg" />
                </span>
                <span class="text-[11px] font-medium leading-none"
                    >{$t("nav.add")}</span
                >
            </button>

            <button
                type="button"
                class="flex h-full flex-col items-center justify-center gap-0.5 text-base-content/60 transition-colors"
                onclick={openSettings}
            >
                <span
                    class="flex h-8 w-16 items-center justify-center rounded-full"
                >
                    <Fa icon={faGear} size="lg" />
                </span>
                <span class="text-[11px] font-medium leading-none"
                    >{$t("nav.settings")}</span
                >
            </button>
        </div>
    </nav>
{/if}
