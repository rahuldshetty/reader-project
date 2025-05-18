<script>
    import Fa from "svelte-fa";
    import {
        faAngleLeft,
        faAngleRight,
    } from "@fortawesome/free-solid-svg-icons";

    import { collapse_sidebar } from "$lib/stores/app_store";

    const handleCollapse = () => {
        $collapse_sidebar = !$collapse_sidebar;
    }
</script>

<li>
    <a class="flex flex-col" onclick={handleCollapse}>
        <Fa icon={$collapse_sidebar ? faAngleRight: faAngleLeft } />
        <span class="text-xs">Collapse</span>
    </a>
</li>
