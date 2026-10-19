<script lang="ts">
    import Fa from "svelte-fa";
    import { faBars, faGear } from "@fortawesome/free-solid-svg-icons";
    import {
        active_modal,
        mobile_drawer_open,
    } from "$lib/stores/app_store";
    import FeedSearch from "$lib/pages/home_page/feed_panel/feed_search.svelte";
    import { MODAL_TYPE } from "$lib/constants";
    import { t } from "$lib/i18n";
</script>

<header
    class="mobile-appbar sticky top-0 z-40 shrink-0 border-b border-base-300/80 bg-base-100/95 backdrop-blur-xl"
>
    <div class="flex min-h-14 items-center gap-1 pl-1 pr-2">
        <button
            type="button"
            class="btn btn-ghost btn-circle h-11 w-11 shrink-0"
            onclick={() => mobile_drawer_open.set(true)}
            aria-label={$t("nav.menu")}
        >
            <Fa icon={faBars} size="lg" />
        </button>

        <div class="min-w-0 flex-1">
            <FeedSearch />
        </div>

        <button
            type="button"
            class="btn btn-ghost btn-circle h-11 w-11 shrink-0"
            onclick={() => active_modal.set(MODAL_TYPE.SETTINGS)}
            aria-label={$t("nav.settings")}
        >
            <Fa icon={faGear} size="lg" />
        </button>
    </div>
</header>
