<script>
    import Fa from "svelte-fa";
    import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

    import { SCREEN } from "$lib/constants";
    import { active_screen } from "$lib/stores/app_store";
    import { refresh_app_data, select_feed } from "../common";

    const handleFeedClick = async () => {
        await refresh_app_data();
        $active_screen = SCREEN.FEEDS;
        // Default to the aggregate "All Posts" view on entry.
        await select_feed(-1);
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
