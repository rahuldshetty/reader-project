<script lang="ts">
    import { getVersion } from "@tauri-apps/api/app";
    import icon from "$lib/assets/ico-1024.png";
    import Spinner from "$lib/components/spinner.svelte";
    import { t } from "$lib/i18n";
</script>

<div
    class="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white"
>
    <div class="text-center">
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

        <div id="block-content" class="block">
            <blockquote class="italic w-md">
                <p>
                    {$t("loading.quote")}
                </p>
            </blockquote>
            <span class="text-sm self-end block text-right">{$t("loading.quote_author")}</span>
        </div>
    </div>
</div>
