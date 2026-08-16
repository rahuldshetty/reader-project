<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Snippet } from "svelte";
    import { is_recording } from "$lib/services/keyboard_shortcuts";
    import { t } from "$lib/i18n";
    let {
        open = false,
        title = "",
        widthClass = "max-w-md",
        onClose = () => {},
        children,
        footer,
    }: {
        open?: boolean;
        title?: string;
        widthClass?: string;
        onClose?: () => void;
        children: Snippet;
        footer?: Snippet;
    } = $props();

    // Close only when clicking the dimmed backdrop, never the box itself.
    const handleBackdropClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    // Esc closes the modal, except while a shortcut is being recorded in the
    // settings modal (Esc there cancels the recording instead).
    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && open && !is_recording()) {
            onClose();
        }
    };

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeydown);
    });
</script>

<dialog class="modal" class:modal-open={open} onclick={handleBackdropClick}>
    <div class="modal-box app-modal-box mx-4 {widthClass}">
        <header class="app-modal-header">
            <h3 class="font-bold text-lg">{title}</h3>
            <button
                class="btn btn-sm btn-circle btn-ghost"
                onclick={onClose}
                aria-label={$t("common.close")}
                >✕</button
            >
        </header>

        <div class="app-modal-body">
            {@render children()}
        </div>

        {#if footer}
            <footer class="app-modal-footer">
                {@render footer()}
            </footer>
        {/if}
    </div>
</dialog>
