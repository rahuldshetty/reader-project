<script>
  import { onMount } from "svelte";
  import {
    active_modal,
    user_settings,
    local_user_setting,
  } from "$lib/stores/app_store";
  import {
    MODAL_TYPE,
    DAISY_UI_THEMES,
    DEFAULT_DAISY_THEME,
    REFRESH_FEED_ON_SELECT,
    LAST_REFRESH_TIME,
    SETTINGS,
  } from "$lib/constants";
  import { toInitCaps } from "$lib/utils";
  import { fetch_latest_user_settings } from "$lib/utils/setting";

  // Local setting State Variables
  // Why use Local vs Global?
  // Answer: Only when user submit to save in modal, we need to save
  let color_theme = $state($local_user_setting.THEME_MODE);
  let refresh_time = $state($local_user_setting.LAST_REFRESH_TIME);
  let pull_posts_on_feed_select = $state($local_user_setting.REFRESH_FEED_ON_SELECT);

  // Do not close when save is in progress
  let save_in_progress = $state(false);

  const closeModal = () => {
    $active_modal = MODAL_TYPE.NONE;
  };

  const closeDropdown = () => {
    if (
      document &&
      document.activeElement &&
      document.activeElement instanceof HTMLElement
    )
      document.activeElement.blur();
  };

  const saveSettings = async () => {
    save_in_progress = true;

    // Persist settings
    await user_settings.set(SETTINGS.LAST_REFRESH_TIME, refresh_time);
    await user_settings.set(SETTINGS.THEME_MODE, color_theme);
    await user_settings.set(
      SETTINGS.REFRESH_FEED_ON_SELECT,
      pull_posts_on_feed_select,
    );

    // Update local store
    $local_user_setting.THEME_MODE = color_theme;
    $local_user_setting.REFRESH_FEED_ON_SELECT = pull_posts_on_feed_select;
    $local_user_setting.LAST_REFRESH_TIME = refresh_time;

    // Close Modal
    save_in_progress = false;
    $active_modal = MODAL_TYPE.NONE;
  };
</script>

<dialog class="modal" class:modal-open={$active_modal == MODAL_TYPE.SETTINGS}>
  <div class="modal-box max-w-xl overflow-visible">
    <h3 class="font-bold text-lg">Settings</h3>

    <!-- name of each tab group should be unique -->
    <div class="tabs tabs-border">
      <!-- General Setting -->
      <input
        type="radio"
        name="setting_tabs"
        class="tab"
        aria-label="General"
        checked
      />
      <div class="tab-content bg-base-100 p-4">
        <div class="grid grid-cols-1 gap-2">
          <!-- Color Theme -->
          <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <div>
              <legend class="fieldset-legend">Theme</legend>
              <p class="label">Pick your favorite theme.</p>
            </div>
            <div class="dropdown flex justify-end">
              <div tabindex="0" role="button" class="btn m-1">Choose Theme</div>
              <ul
                tabindex="0"
                class="dropdown-content max-h-60 overflow-auto bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl"
              >
                {#each DAISY_UI_THEMES as theme_name}
                  <li
                    onclick={closeDropdown}
                    class={`rounded ${color_theme === theme_name ? "bg-primary text-primary-content" : ""}`}
                  >
                    <input
                      type="radio"
                      name="theme-dropdown"
                      class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                      aria-label={toInitCaps(theme_name)}
                      bind:group={color_theme}
                      value={theme_name}
                    />
                  </li>
                {/each}
              </ul>
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Feed Setting -->
      <input type="radio" name="setting_tabs" class="tab" aria-label="Feeds" />
      <div class="tab-content bg-base-100 p-4">
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <!-- Pull latest feed on select -->
          <div>
            <legend class="fieldset-legend">Refresh Feed</legend>
            <p class="label">
              Automatically pull latest posts when selecting an expired feed.
            </p>
          </div>
          <div class="flex justify-end">
            <input
              type="checkbox"
              bind:checked={pull_posts_on_feed_select}
              class="toggle toggle-success"
            />
          </div>
        </fieldset>
        
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <!-- Last Refresh Time -->
          <div>
            <legend class="fieldset-legend">Last Refresh Time (hours)</legend>
            <p class="label">Expiry time before refreshing new posts.</p>
          </div>
          <div class="flex justify-end">
            <input type="number" class="input" bind:value={refresh_time} disabled={!pull_posts_on_feed_select} />
          </div>
        </fieldset>
        
      </div>
    </div>

    <!-- Buttons -->
    <div class="modal-action">
      <button
        class="btn btn-ghost"
        onclick={closeModal}
        disabled={save_in_progress}>Cancel</button
      >
      <button
        class="btn btn-primary"
        onclick={saveSettings}
        disabled={save_in_progress}
      >
        {#if save_in_progress}
          <span class="loading loading-spinner"></span>
        {/if}
        Save
      </button>
    </div>
  </div>
</dialog>
