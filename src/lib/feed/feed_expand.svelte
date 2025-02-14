<script>
    import { minimize_feeds } from "$lib/store";
</script>

<div class="relative w-full">
    <!-- Expand Button -->
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
        class="absolute -top-11 -right-1 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 text-text1"
        onclick={() => ($minimize_feeds = !$minimize_feeds)}
    >
        <svg
            class="w-5 h-5 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            class:rotate-180={!$minimize_feeds}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
            />
        </svg>
    </button>
</div>
