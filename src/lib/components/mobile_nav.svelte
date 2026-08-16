<script lang="ts">
    import Fa from "svelte-fa";
    import {
        faNewspaper,
        faGear,
        faPlus,
    } from "@fortawesome/free-solid-svg-icons";
    import { mobile_active_panel, is_mobile } from "$lib/stores/app_store";
    import { MODAL_TYPE } from "$lib/constants";
    import { active_modal } from "$lib/stores/app_store";
    import { t } from "$lib/i18n";

    const goToFeeds = () => {
        mobile_active_panel.set("feeds");
    };

    const openSettings = () => {
        active_modal.set(MODAL_TYPE.SETTINGS);
    };

    const openAdd = () => {
        active_modal.set(MODAL_TYPE.ADD);
    };
</script>

{#if $is_mobile}
    <nav
        class="fixed bottom-0 left-0 right-0 h-14 bg-base-200 border-t border-base-300 z-50 flex flex-row items-stretch justify-around"
    >
        <!-- Feeds -->
        <button
            class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            class:text-primary={$mobile_active_panel === "feeds"}
            class:bg-base-300={$mobile_active_panel === "feeds"}
            onclick={goToFeeds}
        >
            <Fa icon={faNewspaper} size="lg" />
            <span class="text-xs">{$t("nav.feeds")}</span>
        </button>

        <!-- Add -->
        <button
            class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            onclick={openAdd}
        >
            <Fa icon={faPlus} size="lg" />
            <span class="text-xs">{$t("nav.add")}</span>
        </button>

        <!-- Settings -->
        <button
            class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            onclick={openSettings}
        >
            <Fa icon={faGear} size="lg" />
            <span class="text-xs">{$t("nav.settings")}</span>
        </button>
    </nav>
{/if}
