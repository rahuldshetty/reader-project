<script>
    import Fa from "svelte-fa";
    import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

    import { SCREEN } from "$lib/constants";
    import { active_screen } from "$lib/stores/app_store";
    import { refresh_app_data } from "../common";

    const handleFeedClick = async () => {
        await refresh_app_data();
        $active_screen = SCREEN.FEEDS;
    };
</script>

<li>
    <a
        class="flex flex-col btn-press smooth-transition {$active_screen ==
        SCREEN.FEEDS
            ? 'menu-active'
            : ''}"
        onclick={handleFeedClick}
    >
        <Fa icon={faNewspaper} title="Feeds" />
        <span class="text-xs">Feeds</span>
    </a>
</li>
