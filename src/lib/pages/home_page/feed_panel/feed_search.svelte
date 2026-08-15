<script lang="ts">
  import { ROOT_PARENT_FEED_ID, SHORTCUT_ACTION } from "$lib/constants";
  import {
    search_keywords,
    active_feed_id,
    filter_unread_posts,
    is_mobile,
  } from "$lib/stores/app_store";
  import { get_binding_label } from "$lib/services/keyboard_shortcuts";
  import { refresh_posts } from "../common";

  const onSearchValueChange = async (e: Event) => {
    const text = (e.target as HTMLInputElement).value;
    if (text.trim().length == 0) {
      $search_keywords = [];
    } else {
      $filter_unread_posts = false;
      $active_feed_id = ROOT_PARENT_FEED_ID;
      $search_keywords = text.toLowerCase().trim().split(/\s+/);
    }
    await refresh_posts($active_feed_id);
  };

  const search_hint = $derived(get_binding_label(SHORTCUT_ACTION.FOCUS_SEARCH));
</script>

{#if !$is_mobile}
  <label class="input input-sm input-ghost relative">
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
      placeholder="Search"
      onchange={onSearchValueChange}
      class="pr-6"
    />
    {#if search_hint}
      <kbd
        class="kbd kbd-xs absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
        >{search_hint}</kbd
      >
    {/if}
  </label>
{/if}
