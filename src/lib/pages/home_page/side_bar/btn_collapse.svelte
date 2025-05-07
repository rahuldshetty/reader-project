<script>
    import Fa from "svelte-fa";
    import {
        faAngleLeft,
        faAngleRight,
    } from "@fortawesome/free-solid-svg-icons";

    import { collapse_sidebar } from "$lib/dao/store";

    const handleCollapse = () => {
        $collapse_sidebar = !$collapse_sidebar;
    }
</script>

<li>
    <a class="flex flex-col" onclick={handleCollapse}>
        <Fa icon={$collapse_sidebar ? faAngleRight: faAngleLeft } title="Minimize" />
        <span class="text-xs">Collapse</span>
    </a>
</li>
