<script>
    import Fa from "svelte-fa";
    import {
        faAngleLeft,
        faAngleRight,
    } from "@fortawesome/free-solid-svg-icons";

    import { active_screen, collapse_sidebar } from "$lib/stores/app_store";
    import { SCREEN } from "$lib/constants";

    const handleCollapse = () => {
        $collapse_sidebar = !$collapse_sidebar;
    }
</script>

{#if $active_screen == SCREEN.FEEDS}
    <li>
        <a class="flex flex-col" onclick={handleCollapse}>
            <Fa icon={$collapse_sidebar ? faAngleRight: faAngleLeft } />
            <span class="text-xs">Collapse</span>
        </a>
    </li>
{/if}
