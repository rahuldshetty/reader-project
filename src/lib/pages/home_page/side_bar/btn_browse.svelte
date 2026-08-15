<script>
    import Fa from "svelte-fa";
    import { faCompass } from "@fortawesome/free-solid-svg-icons";

    import { SCREEN } from "$lib/constants";
    import { active_screen } from "$lib/stores/app_store";
    import { refresh_app_data } from "../common";

    const changeBrowseScreen = async () => {
        $active_screen = SCREEN.BROWSE;
        await refresh_app_data();
    };
</script>

<li>
    <a
        class="flex flex-col btn-press smooth-transition {$active_screen ==
        SCREEN.BROWSE
            ? 'menu-active'
            : ''}"
        onclick={changeBrowseScreen}
    >
        <Fa icon={faCompass} title="Browse" />
        <span class="text-xs">Browse</span>
    </a>
</li>
