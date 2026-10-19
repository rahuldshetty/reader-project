<script lang="ts">
    import Fa from "svelte-fa";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

    const {
        title,
        onBack = null,
        backLabel = "",
    }: {
        title: string;
        onBack?: (() => void) | null;
        backLabel?: string;
    } = $props();
</script>

<header
    class="mobile-appbar sticky top-0 z-40 shrink-0 border-b border-base-300/80 bg-base-100/95 backdrop-blur-xl"
>
    <div class="flex min-h-14 items-center gap-0.5 pl-1 pr-2">
        {#if onBack}
            <button
                type="button"
                class="btn btn-ghost btn-circle btn-sm h-11 w-11 shrink-0"
                onclick={onBack}
                aria-label={backLabel || title}
            >
                <Fa icon={faArrowLeft} size="lg" />
            </button>
        {/if}

        <div class="min-w-0 flex-1 px-1">
            <h1 class="truncate text-xl font-semibold tracking-tight">
                {title}
            </h1>
        </div>
    </div>
</header>
