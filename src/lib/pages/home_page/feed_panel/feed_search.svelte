<script lang="ts">
  import { ROOT_PARENT_FEED_ID, SHORTCUT_ACTION } from "$lib/constants";
  import { get } from "svelte/store";
  import {
    search_keywords,
    active_feed_id,
    filter_unread_posts,
    is_mobile,
    mobile_active_panel,
  } from "$lib/stores/app_store";
  import { get_binding_label } from "$lib/services/keyboard_shortcuts";
  import { refresh_posts } from "../common";
  import { t } from "$lib/i18n";

  let debounce_timer: ReturnType<typeof setTimeout> | undefined;

  const applySearch = async (raw_text: string) => {
    const text = raw_text.trim();
    if (text.length == 0) {
      $search_keywords = [];
    } else {
      $filter_unread_posts = false;
      $active_feed_id = ROOT_PARENT_FEED_ID;
      $search_keywords = text.toLowerCase().split(/\s+/);
    }
    await refresh_posts($active_feed_id);
    if (get(is_mobile) && text.length > 0) {
      mobile_active_panel.set("posts");
    }
  };

  // Debounced so typing on a phone does not run a query per keystroke.
  const onSearchValueChange = (e: Event) => {
    const text = (e.target as HTMLInputElement).value;
    clearTimeout(debounce_timer);
    debounce_timer = setTimeout(() => {
      void applySearch(text);
    }, 250);
  };

  const search_hint = $derived(get_binding_label(SHORTCUT_ACTION.FOCUS_SEARCH));
</script>

<label
  class="input relative {$is_mobile
    ? 'h-11 w-full rounded-full border border-base-300 bg-base-200/70 text-sm'
    : 'input-sm input-ghost'}"
>
  <svg
    class="h-[1em] opacity-50"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-width="2.5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>
  <input
    id="feed-search-input"
    type="search"
    placeholder={$t("common.search")}
    oninput={onSearchValueChange}
    class={$is_mobile ? "w-full" : "pr-6"}
  />
  {#if !$is_mobile && search_hint}
    <kbd
      class="kbd kbd-xs absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
      >{search_hint}</kbd
    >
  {/if}
</label>
