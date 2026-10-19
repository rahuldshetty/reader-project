<script lang="ts">
    import { getVersion } from "@tauri-apps/api/app";
    import icon from "$lib/assets/ico-1024.png";
    import Spinner from "$lib/components/spinner.svelte";
    import { t } from "$lib/i18n";
    import { feed_load_progress } from "$lib/stores/app_store";

    let percent = $derived(
        $feed_load_progress.total > 0
            ? Math.round(
                  ($feed_load_progress.completed / $feed_load_progress.total) * 100,
              )
            : 0,
    );
</script>

<div
    class="flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-6 pb-[calc(2.5rem+var(--safe-area-inset-bottom))] pt-[calc(2.5rem+var(--safe-area-inset-top))] text-white"
>
    <div class="w-full max-w-sm text-center">
        <img src={icon} alt={$t("loading.logo_alt")} class="mx-auto mb-4 w-24 h-24" />
        <div class="inline-block">
            <h1 class="prose-xl font-bold">Reader-Project</h1>
            {#await getVersion() then version}
                <span class="text-sm self-end block text-right">{$t("app.version", { version })}</span
                >
            {/await}
        </div>
        <div class="flex w-full justify-center mb-6">
            <Spinner />
        </div>

        {#if $feed_load_progress.total > 0}
            <div class="w-64 mx-auto mb-6">
                <span class="block mb-1 text-xs">
                    {$t("loading.feeds_progress", {
                        completed: $feed_load_progress.completed,
                        total: $feed_load_progress.total,
                        percent,
                    })}
                </span>
                <div
                    class="h-1.5 w-full overflow-hidden rounded-full bg-white/25"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={percent}
                >
                    <div
                        class="h-full rounded-full bg-white transition-all duration-300"
                        style:width={`${percent}%`}
                    ></div>
                </div>
            </div>
        {/if}

        <div id="block-content" class="block">
            <blockquote class="w-full max-w-md italic">
                <p>
                    {$t("loading.quote")}
                </p>
            </blockquote>
            <span class="text-sm self-end block text-right">{$t("loading.quote_author")}</span>
        </div>
    </div>
</div>
