<script>
    import BtnAbout from "./btn_about.svelte";
    import BtnAdd from "./btn_add.svelte";
    import BtnCollapse from "./btn_collapse.svelte";
    import BtnFeeds from "./btn_feeds.svelte";
    import BtnHome from "./btn_home.svelte";
    import BtnSettings from "./btn_settings.svelte";
</script>

<ul
    class="menu bg-base-200 gap-2 rounded-box bg-base-200 border-r border-base-300"
>
    <BtnHome/>
    <BtnFeeds/>
    <BtnSettings/>
    <BtnAdd />
    <div class="flex-grow"></div>
    <BtnAbout />
    <BtnCollapse/>
</ul>
