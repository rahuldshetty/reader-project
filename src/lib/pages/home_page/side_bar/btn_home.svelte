<script>
    import Fa from "svelte-fa";
    import {
        faHome,
    } from "@fortawesome/free-solid-svg-icons";

    import { SCREEN } from "$lib/constants";
    import { active_screen } from "$lib/stores/app_store";
    import { refresh_app_data } from "../common";

    const changeHomeScreen = async () => {
        $active_screen=SCREEN.HOME;
        await refresh_app_data();
    }
</script>

<li>
    <a class="flex flex-col {$active_screen == SCREEN.HOME? "menu-active":""}" onclick={changeHomeScreen}>
        <Fa icon={faHome} title="Feeds" />
        <span class="text-xs">Home</span>
    </a>
</li>
