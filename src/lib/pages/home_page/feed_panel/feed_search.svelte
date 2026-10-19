<script lang="ts">
  import { ROOT_PARENT_FEED_ID, SCREEN, SHORTCUT_ACTION } from "$lib/constants";
  import { get } from "svelte/store";
  import {
    search_keywords,
    search_text,
    active_feed_id,
    active_feed_name,
    active_folder_feed_ids,
    active_post_id,
    active_screen,
    filter_unread_posts,
    is_mobile,
    mobile_active_panel,
    mobile_drawer_open,
  } from "$lib/stores/app_store";
  import { get_binding_label } from "$lib/services/keyboard_shortcuts";
  import { refresh_active_posts, refresh_posts } from "../common";
  import { t, translate } from "$lib/i18n";

  let debounce_timer: ReturnType<typeof setTimeout> | undefined;
  let last_user_input = "";

  // Selecting a source clears search_text programmatically. Drop any pending
  // debounce so it cannot re-apply the old query to the new source.
  $effect(() => {
    if ($search_text !== last_user_input) {
      clearTimeout(debounce_timer);
      last_user_input = $search_text;
    }
  });

  const applySearch = async (raw_text: string) => {
    const text = raw_text.trim();
    if (text.length == 0) {
      $search_keywords = [];
      $active_feed_name = "";
      // Emptying the box returns to whatever source is selected now.
      await refresh_active_posts();
      return;
    }

    $filter_unread_posts = false;
    $active_folder_feed_ids = [];
    $active_feed_id = ROOT_PARENT_FEED_ID;
    $active_feed_name = translate("common.search");
    $search_keywords = text.toLowerCase().split(/\s+/);
    await refresh_posts(ROOT_PARENT_FEED_ID);
    if (get(is_mobile)) {
      active_screen.set(SCREEN.FEEDS);
      active_post_id.set(-1);
      mobile_active_panel.set("posts");
      mobile_drawer_open.set(false);
    }
  };

  // Debounced so typing on a phone does not run a query per keystroke.
  const onSearchValueChange = (event: Event) => {
    last_user_input = (event.target as HTMLInputElement).value;
    clearTimeout(debounce_timer);
    debounce_timer = setTimeout(() => {
      void applySearch(last_user_input);
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
    bind:value={$search_text}
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
