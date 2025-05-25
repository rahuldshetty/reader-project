<script>
    import Fa from "svelte-fa";
    import {
        faHome,
    } from "@fortawesome/free-solid-svg-icons";

    import { SCREEN } from "$lib/constants";
    import { active_screen } from "$lib/stores/app_store";
</script>

<li>
    <a class="flex flex-col {$active_screen == SCREEN.HOME? "menu-active":""}" onclick={()=>$active_screen=SCREEN.HOME}>
        <Fa icon={faHome} title="Feeds" />
        <span class="text-xs">Home</span>
    </a>
</li>
