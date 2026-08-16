<script lang="ts">
  import type { PostResult } from "$lib/types";
  import { timeAgo } from "$lib/utils/time";
  import { extractTextFromHtml } from "$lib/utils/html";
  import { feed_by_id } from "$lib/stores/app_store";
  import Fa from "svelte-fa";
  import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
  import { t } from "$lib/i18n";

  type Variant = "lead" | "featured" | "standard";

  const {
    post,
    onclick,
    variant = "standard",
  }: { post: PostResult; onclick: () => void; variant?: Variant } = $props();

  const source = $derived($feed_by_id.get(post.feed_id));
  const snippet = $derived(extractTextFromHtml(post.content).slice(0, 220));
</script>

{#snippet meta()}
  <div class="text-xs opacity-60 flex items-center gap-1.5 min-w-0">
    {#if source?.favicon}
      <img
        src={source.favicon}
        alt=""
        class="w-3.5 h-3.5 rounded-sm shrink-0"
      />
    {/if}
    {#if source?.title}
      <span class="truncate">{source.title}</span>
      <span class="opacity-40">·</span>
    {/if}
    <span class="whitespace-nowrap">{timeAgo(post.pubDate, $t)}</span>
  </div>
{/snippet}

{#snippet cover(size: string)}
  <div
    class="w-full h-full flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 overflow-hidden px-6"
  >
    {#if source?.title}
      <span
        class="font-bold text-base-content/15 truncate leading-tight text-center {size}"
      >
        {source.title}
      </span>
    {:else}
      <Fa icon={faNewspaper} class="text-base-content/15" size="3x" />
    {/if}
  </div>
{/snippet}

{#if variant === "lead"}
  <button
    type="button"
    onclick={onclick}
    class="group w-full text-left rounded-lg overflow-hidden border border-base-300 bg-base-100 hover:shadow-lg hover-lift smooth-transition cursor-pointer flex flex-col md:flex-row"
  >
    <div
      class="md:w-3/5 shrink-0 aspect-[16/9] md:aspect-auto md:min-h-72 bg-base-200 overflow-hidden"
    >
      {#if post.image}
        <img
          src={post.image}
          loading="eager"
          alt=""
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      {:else}
        {@render cover("text-4xl")}
      {/if}
    </div>

    <div class="p-6 md:p-8 flex flex-col gap-3 md:w-2/5">
      <div class="text-xs uppercase tracking-wide text-primary font-semibold">
        {source?.title ?? $t("browse.article")}
      </div>
      <h2
        class="text-2xl md:text-3xl font-bold leading-tight line-clamp-4 {post.read
          ? 'text-base-content/80'
          : 'text-base-content'}"
      >
        {post.title}
      </h2>
      {#if snippet}
        <p class="text-base opacity-70 line-clamp-4">{snippet}</p>
      {/if}
      <div
        class="mt-auto pt-2 flex items-center justify-between text-sm opacity-60"
      >
        <span>{timeAgo(post.pubDate, $t)}</span>
        <span class="font-medium text-primary">{$t("browse.read")}</span>
      </div>
    </div>
  </button>
{:else if variant === "featured"}
  <button
    type="button"
    onclick={onclick}
    class="group w-full text-left rounded-lg overflow-hidden border border-base-300 bg-base-100 hover:shadow-md hover-lift smooth-transition cursor-pointer flex flex-col h-full"
  >
    <div class="aspect-[16/9] overflow-hidden bg-base-200">
      {#if post.image}
        <img
          src={post.image}
          loading="lazy"
          alt=""
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      {:else}
        {@render cover("text-2xl")}
      {/if}
    </div>

    <div class="p-4 flex flex-col gap-2 flex-1">
      {@render meta()}
      <h3
        class="text-lg font-semibold leading-snug line-clamp-3 {post.read
          ? 'text-base-content/80'
          : 'text-base-content'}"
      >
        {post.title}
      </h3>
      {#if snippet}
        <p class="text-sm opacity-70 line-clamp-3">{snippet}</p>
      {/if}
    </div>
  </button>
{:else}
  <button
    type="button"
    onclick={onclick}
    class="group w-full text-left rounded-lg overflow-hidden border border-base-300 bg-base-100 hover:shadow-sm hover-lift smooth-transition cursor-pointer flex flex-col h-full"
  >
    <div class="h-28 overflow-hidden bg-base-200">
      {#if post.image}
        <img
          src={post.image}
          loading="lazy"
          alt=""
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      {:else}
        {@render cover("text-lg")}
      {/if}
    </div>

    <div class="p-3 flex flex-col gap-1.5 flex-1">
      {@render meta()}
      <h3
        class="font-semibold leading-snug line-clamp-2 {post.read
          ? 'text-base-content/70'
          : 'text-base-content'}"
      >
        {post.title}
      </h3>
    </div>
  </button>
{/if}
