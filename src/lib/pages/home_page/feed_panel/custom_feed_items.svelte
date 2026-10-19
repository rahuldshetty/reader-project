<script lang="ts">
    import { active_feed_id } from "$lib/stores/app_store";
    import { select_feed } from "$lib/pages/home_page/common";

    import Fa from "svelte-fa";
    import { faStar, faGripLines } from "@fortawesome/free-solid-svg-icons";
    import { t } from "$lib/i18n";

    const handleOnClick = (feed_id: number) => {
        void select_feed(feed_id);
    };
</script>

<li data-feed-id="-1" onclick={() => handleOnClick(-1)}>
    <div
        class="m-0.5 {$active_feed_id == -1
            ? 'menu-active'
            : ''} max-md:flex max-md:min-h-12 max-md:items-center max-md:gap-3 max-md:rounded-xl max-md:px-3"
    >
        <span
            class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/70 max-md:flex"
        >
            <Fa icon={faGripLines} size="lg" />
        </span>
        <Fa icon={faGripLines} size="lg" class="max-md:hidden" />
        <span class="truncate p-1 max-md:p-0 max-md:font-medium"
            >{$t("nav.all_posts")}</span
        >
    </div>
</li>

<li data-feed-id="-2" onclick={() => handleOnClick(-2)}>
    <div
        class="m-0.5 {$active_feed_id == -2
            ? 'menu-active'
            : ''} max-md:flex max-md:min-h-12 max-md:items-center max-md:gap-3 max-md:rounded-xl max-md:px-3"
    >
        <span
            class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-base-200 max-md:flex"
        >
            <Fa icon={faStar} color="var(--color-accent)" size="lg" />
        </span>
        <Fa
            icon={faStar}
            color="var(--color-accent)"
            size="lg"
            class="max-md:hidden"
        />
        <span class="truncate p-1 max-md:p-0 max-md:font-medium"
            >{$t("nav.my_favourites")}</span
        >
    </div>
</li>

<div class="divider h-0 m-0"></div>
