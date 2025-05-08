<script>
    import logo from "$lib/assets/ico-1024.png";
    import { active_modal } from "$lib/stores/app_store";
    import { MODAL_TYPE } from "$lib/constants";

    const closeModal = () => {
        $active_modal = MODAL_TYPE.NONE;
    };
</script>

<dialog class="modal" class:modal-open={$active_modal == MODAL_TYPE.ABOUT}>
    <div class="modal-box max-w-xl overflow-visible">
        <form method="dialog">
            <button onclick={closeModal} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <!-- App Logo -->
        <div class="flex items-center space-x-3 mb-4">
            <img src={logo} alt="App Logo" class="w-12 h-12 rounded-md" />
            <h3 class="text-xl font-bold">Reader-Project</h3>
        </div>

        <!-- App Description -->
        <p class="mb-4 text-sm text-base-content">
            <strong>Reader-Project</strong> is a <span class="font-medium">privacy-focused RSS aggregator</span> built with 
            <span class="text-primary">Tauri</span>, <span class="text-secondary">SvelteKit</span>, and <span class="text-accent">Tailwind CSS</span>. 
            It supports offline storage, auto-refreshing feeds, content extraction, article translation, and more — all in a sleek, modern UI.
        </p>

        <!-- Links -->
        <div class="flex gap-4 text-sm">
            <a href="https://github.com/rahuldshetty/reader-project" class="link link-hover" target="_blank">
            🔗 Source Code
            </a>
            <a href="https://github.com/rahuldshetty/reader-project/blob/master/LICENSE" class="link link-hover" target="_blank">
            📄 License (MIT)
            </a>
        </div>
    </div>
</dialog>
