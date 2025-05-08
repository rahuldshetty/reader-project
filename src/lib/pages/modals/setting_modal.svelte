<script>
  import { onMount } from "svelte";
  import { active_modal, user_settings, local_user_setting } from "$lib/stores/app_store";
  import {
    MODAL_TYPE, 
    DAISY_UI_THEMES, DEFAULT_DAISY_THEME,
    LAST_REFRESH_TIME, SETTINGS
  } from "$lib/constants";
  import { toInitCaps } from "$lib/utils";
  import { fetch_latest_user_settings } from "$lib/utils/setting";

  // Local setting State Variables
  // Why use Local vs Global?
  // Answer: Only when user submit to save in modal, we need to save
  let color_theme = $state(DEFAULT_DAISY_THEME);
  let refresh_time = $state(LAST_REFRESH_TIME);

  // Do not close when save is in progress
  let save_in_progress = $state(false);

  const update_local_user_settings = () => {
    // Whenever user closes/re-opens modal - we need to present 
    // current settings not the previous unsaved changes.
    refresh_time = $local_user_setting.LAST_REFRESH_TIME;
    color_theme = $local_user_setting.THEME_MODE;
  }

  // Load Settings
  onMount(async () => {
    update_local_user_settings();
  });

  const closeModal = () => {
    update_local_user_settings();
    $active_modal = MODAL_TYPE.NONE;
  };

  const saveSettings = async () => {
    save_in_progress = true;

    // Persist settings
    await user_settings.set(SETTINGS.LAST_REFRESH_TIME, refresh_time);
    await user_settings.set(SETTINGS.THEME_MODE, color_theme);
    $local_user_setting = await fetch_latest_user_settings();

    // Close Modal
    update_local_user_settings();
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
          <fieldset class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2">
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

          <fieldset class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2">
            <!-- Last Refresh Time -->
            <div>
              <legend class="fieldset-legend">Last Refresh Time (hours)</legend>
              <p class="label">Expiry time before refreshing new posts.</p>
            </div>
            <div class="flex justify-end">
              <input type="number" class="input" bind:value={refresh_time} />
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Feed Setting -->
      <!-- <input type="radio" name="setting_tabs" class="tab" aria-label="Feeds" />
      <div class="tab-content bg-base-100 p-4">Tab content 2</div> -->
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
