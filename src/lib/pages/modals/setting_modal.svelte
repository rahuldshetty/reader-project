<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import {
    active_modal,
    user_settings,
    local_user_setting,
    feeds_store,
  } from "$lib/stores/app_store";
  import {
    MODAL_TYPE,
    DAISY_UI_THEMES,
    SETTINGS,
    TOAST_MESSAGE_TYPE,
    SHORTCUT_ACTION,
    SHORTCUT_ACTION_META,
    DEFAULT_SHORTCUT_BINDINGS,
  } from "$lib/constants";
  import {
    format_binding,
    find_conflicts,
    set_recording_action,
  } from "$lib/services/keyboard_shortcuts";
  import { toInitCaps, fontFamilies } from "$lib/utils";
  import { save } from "@tauri-apps/plugin-dialog";
  import { writeTextFile } from "@tauri-apps/plugin-fs";
  import { toastStore } from "$lib/stores/toast_store";
  import { convertFeedDataToOPML } from "$lib/services/opml_gather";
  import ModalShell from "$lib/components/modals/ModalShell.svelte";
  import type { ShortcutBindings } from "$lib/types";
  import {
    t,
    translate,
    SUPPORTED_LANGUAGES,
    apply_document_language,
  } from "$lib/i18n";

  // Local setting State Variables
  // Why use Local vs Global?
  // Answer: Only when user submit to save in modal, we need to save
  let color_theme = $state($local_user_setting.THEME_MODE);
  let language = $state($local_user_setting.LANGUAGE);
  let refresh_time = $state($local_user_setting.LAST_REFRESH_TIME);
  let enable_insecure_feeds = $state($local_user_setting.ENABLE_INSECURE_LINK);
  let pull_posts_on_feed_select = $state(
    $local_user_setting.REFRESH_FEED_ON_SELECT,
  );
  let enable_auto_read = $state($local_user_setting.AUTO_READ_ON_SELECT);
  let refresh_all_feed_on_launch = $state(
    $local_user_setting.REFRESH_ALL_FEED_ON_LAUNCH,
  );
  let enable_auto_purge = $state($local_user_setting.ENABLE_AUTO_PURGE);
  let old_posts_save_period_in_days = $state(
    $local_user_setting.POST_EXPIRY_TIME,
  );
  let minimize_app = $state($local_user_setting.MINIMIZE_APP);
  let longitude = $state($local_user_setting.LONGITUDE);
  let latitude = $state($local_user_setting.LATITUDE);

  let llm_enable = $state($local_user_setting.LLM_ENABLE);
  let openai_url = $state($local_user_setting.OPENAI_URL);
  let openai_token = $state($local_user_setting.OPENAI_TOKEN);
  let openai_model = $state($local_user_setting.OPENAI_MODEL);

  // Font Settings
  let font_family = $state($local_user_setting.FONT_SETTINGS.FONT_FAMILY);
  let font_size = $state($local_user_setting.FONT_SETTINGS.FONT_SIZE);
  let line_height = $state($local_user_setting.FONT_SETTINGS.LINE_HEIGHT);
  let letter_spacing = $state($local_user_setting.FONT_SETTINGS.LETTER_SPACING);
  let paragraph_gap = $state($local_user_setting.FONT_SETTINGS.PARAGRAPH_GAP);

  // Apply font settings to CSS custom properties for live preview
  $effect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-font-family', font_family);
    root.style.setProperty('--app-font-size', font_size + 'px');
    root.style.setProperty('--app-line-height', String(line_height));
    root.style.setProperty('--app-letter-spacing', letter_spacing + 'px');
    root.style.setProperty('--app-paragraph-gap', paragraph_gap + 'px');
  });

  // Do not close when save is in progress
  let save_in_progress = $state(false);

  // Keyboard Shortcut State
  let shortcuts_enabled = $state($local_user_setting.SHORTCUTS.ENABLED);
  let shortcut_bindings = $state<ShortcutBindings>({
    ...$local_user_setting.SHORTCUTS.BINDINGS,
  });
  let recording_action = $state<SHORTCUT_ACTION | null>(null);

  const shortcut_conflicts = $derived(find_conflicts(shortcut_bindings));
  const conflicting_actions = $derived(
    new Set<string>(shortcut_conflicts.flat()),
  );

  const stopRecording = () => {
    set_recording_action(null);
    recording_action = null;
  };

  const startRecording = (action: SHORTCUT_ACTION) => {
    set_recording_action(action);
    recording_action = action;
  };

  const resetShortcuts = () => {
    shortcut_bindings = { ...DEFAULT_SHORTCUT_BINDINGS };
    stopRecording();
  };

  // Captures the next key press while a shortcut is being remapped. The
  // global keyboard handler yields to this via is_recording().
  const handleCaptureKeydown = (event: KeyboardEvent) => {
    if (recording_action === null) return;
    event.preventDefault();
    event.stopPropagation();

    // Ignore modifier-only presses; wait for the actual key.
    if (
      event.key === "Control" ||
      event.key === "Alt" ||
      event.key === "Shift" ||
      event.key === "Meta"
    ) {
      return;
    }
    if (event.key === "Escape") {
      stopRecording();
      return;
    }

    shortcut_bindings[recording_action] = {
      key: event.key.length === 1 ? event.key.toLowerCase() : event.key,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    };
    stopRecording();
  };

  onMount(() => {
    window.addEventListener("keydown", handleCaptureKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleCaptureKeydown);
    set_recording_action(null);
  });

  const closeModal = () => {
    // Reset State
    color_theme = $local_user_setting.THEME_MODE;
    language = $local_user_setting.LANGUAGE;
    pull_posts_on_feed_select = $local_user_setting.REFRESH_FEED_ON_SELECT;
    refresh_time = $local_user_setting.LAST_REFRESH_TIME;
    enable_insecure_feeds = $local_user_setting.ENABLE_INSECURE_LINK;
    enable_auto_read = $local_user_setting.AUTO_READ_ON_SELECT;
    refresh_all_feed_on_launch = $local_user_setting.REFRESH_ALL_FEED_ON_LAUNCH;
    enable_auto_purge = $local_user_setting.ENABLE_AUTO_PURGE;
    old_posts_save_period_in_days = $local_user_setting.POST_EXPIRY_TIME;
    minimize_app = $local_user_setting.MINIMIZE_APP;
    longitude = $local_user_setting.LONGITUDE;
    latitude = $local_user_setting.LATITUDE;

    llm_enable = $local_user_setting.LLM_ENABLE;
    openai_url = $local_user_setting.OPENAI_URL;
    openai_token = $local_user_setting.OPENAI_TOKEN;
    openai_model = $local_user_setting.OPENAI_MODEL;

    font_family = $local_user_setting.FONT_SETTINGS.FONT_FAMILY;
    font_size = $local_user_setting.FONT_SETTINGS.FONT_SIZE;
    line_height = $local_user_setting.FONT_SETTINGS.LINE_HEIGHT;
    letter_spacing = $local_user_setting.FONT_SETTINGS.LETTER_SPACING;
    paragraph_gap = $local_user_setting.FONT_SETTINGS.PARAGRAPH_GAP;

    shortcuts_enabled = $local_user_setting.SHORTCUTS.ENABLED;
    shortcut_bindings = { ...$local_user_setting.SHORTCUTS.BINDINGS };
    stopRecording();

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
    // Refuse to persist conflicting keybindings
    if (shortcut_conflicts.length > 0) {
      toastStore.add(
        TOAST_MESSAGE_TYPE.ERROR,
        translate("toast.conflicting_shortcuts"),
      );
      return;
    }

    save_in_progress = true;

    // Persist settings
    await user_settings.set(SETTINGS.LAST_REFRESH_TIME, refresh_time);
    await user_settings.set(SETTINGS.THEME_MODE, color_theme);
    await user_settings.set(SETTINGS.LANGUAGE, language);
    await user_settings.set(
      SETTINGS.ENABLE_INSECURE_LINK,
      enable_insecure_feeds,
    );
    await user_settings.set(
      SETTINGS.REFRESH_FEED_ON_SELECT,
      pull_posts_on_feed_select,
    );
    await user_settings.set(SETTINGS.AUTO_READ_ON_SELECT, enable_auto_read);
    await user_settings.set(
      SETTINGS.REFRESH_ALL_FEED_ON_LAUNCH,
      refresh_all_feed_on_launch,
    );
    await user_settings.set(SETTINGS.ENABLE_AUTO_PURGE, enable_auto_purge);
    await user_settings.set(
      SETTINGS.POST_EXPIRY_TIME,
      old_posts_save_period_in_days,
    );
    await user_settings.set(SETTINGS.MINIMIZE_APP, minimize_app);
    await user_settings.set(SETTINGS.LONGITUDE, longitude);
    await user_settings.set(SETTINGS.LATITUDE, latitude);
    await user_settings.set(SETTINGS.LLM_ENABLE, llm_enable);
    await user_settings.set(SETTINGS.OPENAI_MODEL, openai_model);
    await user_settings.set(SETTINGS.OPENAI_URL, openai_url);
    await user_settings.set(SETTINGS.OPENAI_TOKEN, openai_token);
    await user_settings.set(SETTINGS.FONT_FAMILY, font_family);
    await user_settings.set(SETTINGS.FONT_SIZE, font_size);
    await user_settings.set(SETTINGS.LINE_HEIGHT, line_height);
    await user_settings.set(SETTINGS.LETTER_SPACING, letter_spacing);
    await user_settings.set(SETTINGS.PARAGRAPH_GAP, paragraph_gap);
    await user_settings.set(SETTINGS.SHORTCUTS, {
      ENABLED: shortcuts_enabled,
      BINDINGS: shortcut_bindings,
    });

    // Update local store
    $local_user_setting.THEME_MODE = color_theme;
    $local_user_setting.LANGUAGE = language;
    $local_user_setting.REFRESH_FEED_ON_SELECT = pull_posts_on_feed_select;
    $local_user_setting.LAST_REFRESH_TIME = refresh_time;
    $local_user_setting.ENABLE_INSECURE_LINK = enable_insecure_feeds;
    $local_user_setting.AUTO_READ_ON_SELECT = enable_auto_read;
    $local_user_setting.REFRESH_ALL_FEED_ON_LAUNCH = refresh_all_feed_on_launch;
    $local_user_setting.ENABLE_AUTO_PURGE = enable_auto_purge;
    $local_user_setting.POST_EXPIRY_TIME = old_posts_save_period_in_days;
    $local_user_setting.MINIMIZE_APP = minimize_app;
    $local_user_setting.LONGITUDE = longitude;
    $local_user_setting.LATITUDE = latitude;
    $local_user_setting.OPENAI_MODEL = openai_model;
    $local_user_setting.OPENAI_URL = openai_url;
    $local_user_setting.OPENAI_TOKEN = openai_token;
    $local_user_setting.LLM_ENABLE = llm_enable;
    $local_user_setting.FONT_SETTINGS.FONT_FAMILY = font_family;
    $local_user_setting.FONT_SETTINGS.FONT_SIZE = font_size;
    $local_user_setting.FONT_SETTINGS.LINE_HEIGHT = line_height;
    $local_user_setting.FONT_SETTINGS.LETTER_SPACING = letter_spacing;
    $local_user_setting.FONT_SETTINGS.PARAGRAPH_GAP = paragraph_gap;
    $local_user_setting.SHORTCUTS = {
      ENABLED: shortcuts_enabled,
      BINDINGS: shortcut_bindings,
    };
    apply_document_language(language);

    // Close Modal
    save_in_progress = false;
    $active_modal = MODAL_TYPE.NONE;
  };

  const handleOPMLSave = async () => {
    // Open Save dialog
    const path = await save({
      filters: [
        {
          name: "OPML (XML)",
          extensions: ["opml"],
        },
      ],
    });

    // Generate OPML
    if (path) {
      const opml_result = convertFeedDataToOPML($feeds_store);
      await writeTextFile(path, opml_result);
      toastStore.add(TOAST_MESSAGE_TYPE.SUCCESS, translate("toast.feed_saved"));
    } else {
      toastStore.add(
        TOAST_MESSAGE_TYPE.WARNING,
        translate("toast.invalid_file_path"),
      );
    }
  };
</script>

<ModalShell
  open={$active_modal == MODAL_TYPE.SETTINGS}
  title={$t("settings.title")}
  widthClass="max-w-xl"
  onClose={closeModal}
  footer={settingsFooter}
>
  <!-- name of each tab group should be unique -->
  <div class="tabs tabs-border">
      <!-- General Setting -->
      <input
        type="radio"
        name="setting_tabs"
        class="tab"
        aria-label={$t("settings.tab.general")}
        checked
      />
      <div class="tab-content bg-base-100 p-4">
        <div class="grid grid-cols-1 gap-2">
          <!-- Language -->
          <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <div>
              <legend class="fieldset-legend">{$t("settings.language")}</legend>
              <p class="label">{$t("settings.language.hint")}</p>
            </div>
            <div class="flex justify-end">
              <select class="select select-bordered" bind:value={language}>
                {#each SUPPORTED_LANGUAGES as lang}
                  <option value={lang.code}>{lang.label}</option>
                {/each}
              </select>
            </div>
          </fieldset>

          <!-- Color Theme -->
          <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <div>
              <legend class="fieldset-legend">{$t("settings.theme")}</legend>
              <p class="label">{$t("settings.theme.hint")}</p>
            </div>
            <div class="dropdown flex justify-end">
              <div tabindex="0" role="button" class="btn m-1">{$t("settings.choose_theme")}</div>
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

          <!-- App Close Behaviour -->
          <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <div>
              <legend class="fieldset-legend">{$t("settings.close_button")}</legend>
              <p class="label">
                {$t("settings.close_button.hint")}
              </p>
            </div>
            <div class="flex justify-end">
              <input
                type="checkbox"
                checked={minimize_app}
                onchange={() => (minimize_app = !minimize_app)}
                class="toggle toggle-success"
              />
            </div>
          </fieldset>

          <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <!-- Enable auto-refresh-all-feed -->
            <div>
              <legend class="fieldset-legend">{$t("settings.auto_refresh")}</legend>
              <p class="label">
                {$t("settings.auto_refresh.hint")}
              </p>
            </div>
            <div class="flex justify-end">
              <input
                type="checkbox"
                checked={refresh_all_feed_on_launch}
                onchange={() =>
                  (refresh_all_feed_on_launch = !refresh_all_feed_on_launch)}
                class="toggle toggle-success"
              />
            </div>
          </fieldset>

          <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <!-- Export OPML -->
            <div>
              <legend class="fieldset-legend">{$t("settings.export_opml")}</legend>
              <p class="label">{$t("settings.export_opml.hint")}</p>
            </div>
            <div class="flex justify-end">
              <button class="btn btn-neutral" onclick={handleOPMLSave}
                >{$t("settings.export_opml")}</button
              >
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Feed Setting -->
      <input type="radio" name="setting_tabs" class="tab" aria-label={$t("settings.tab.feeds")} />
      <div class="tab-content bg-base-100 p-4">
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <!-- Pull latest feed on select -->
          <div>
            <legend class="fieldset-legend">{$t("settings.refresh_feed")}</legend>
            <p class="label">
              {$t("settings.refresh_feed.hint")}
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
            <legend class="fieldset-legend">{$t("settings.last_refresh_time")}</legend>
            <p class="label">{$t("settings.last_refresh_time.hint")}</p>
          </div>
          <div class="flex justify-end">
            <input
              type="number"
              class="input"
              bind:value={refresh_time}
              disabled={!pull_posts_on_feed_select}
            />
          </div>
        </fieldset>

        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <!-- Enable auto-read -->
          <div>
            <legend class="fieldset-legend">{$t("settings.auto_read")}</legend>
            <p class="label">
              {$t("settings.auto_read.hint")}
            </p>
          </div>
          <div class="flex justify-end">
            <input
              type="checkbox"
              checked={enable_auto_read}
              onchange={() => (enable_auto_read = !enable_auto_read)}
              class="toggle toggle-success"
            />
          </div>
        </fieldset>

        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <!-- Pull unsecure links -->
          <div>
            <legend class="fieldset-legend">{$t("settings.insecure_mode")}</legend>
            <p class="label">
              {$t("settings.insecure_mode.hint")}
            </p>
          </div>
          <div class="flex justify-end">
            <input
              type="checkbox"
              checked={enable_insecure_feeds}
              onchange={() => (enable_insecure_feeds = !enable_insecure_feeds)}
              class="toggle toggle-warning"
            />
          </div>
        </fieldset>
      </div>

      <!-- Storage Setting -->
      <input
        type="radio"
        name="setting_tabs"
        class="tab"
        aria-label={$t("settings.tab.storage")}
      />
      <div class="tab-content bg-base-100 p-4">
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <!-- Auto Delete -->
          <div>
            <legend class="fieldset-legend">{$t("settings.auto_purge")}</legend>
            <p class="label">
              {$t("settings.auto_purge.hint")}
            </p>
          </div>
          <div class="flex justify-end">
            <input
              type="checkbox"
              bind:checked={enable_auto_purge}
              class="toggle toggle-success"
            />
          </div>
        </fieldset>

        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <!-- Post Duration -->
          <div>
            <legend class="fieldset-legend">{$t("settings.post_duration")}</legend>
            <p class="label">{$t("settings.post_duration.hint")}</p>
          </div>
          <div class="flex justify-end">
            <input
              type="number"
              class="input"
              bind:value={old_posts_save_period_in_days}
              disabled={!enable_auto_purge}
            />
          </div>
        </fieldset>
      </div>

      <!-- AI Settings -->
      <input type="radio" name="setting_tabs" class="tab" aria-label={$t("settings.tab.llm")} />
      <div class="tab-content bg-base-100 p-4">
        <!-- Enable LLM -->
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <div>
            <legend class="fieldset-legend">{$t("settings.enable_llm")}</legend>
            <p class="label">
              {$t("settings.enable_llm.hint")}
            </p>
          </div>
          <div class="flex justify-end">
            <input
              type="checkbox"
              checked={llm_enable}
              onchange={() => (llm_enable = !llm_enable)}
              class="toggle toggle-success"
            />
          </div>
        </fieldset>

        <!-- Open AI Base URL -->
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <div>
            <legend class="fieldset-legend">{$t("settings.base_url")}</legend>
            <p class="label">{$t("settings.base_url.hint")}</p>
          </div>
          <div class="flex justify-end">
            <input
              type="text"
              class="input"
              bind:value={openai_url}
              disabled={!llm_enable}
            />
          </div>
        </fieldset>

        <!-- Open AI Model Name -->
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <div>
            <legend class="fieldset-legend">{$t("settings.model")}</legend>
            <p class="label">{$t("settings.model.hint")}</p>
          </div>
          <div class="flex justify-end">
            <input
              type="text"
              class="input"
              bind:value={openai_model}
              disabled={!llm_enable}
            />
          </div>
        </fieldset>

        <!-- Open AI Token -->
        <fieldset
          class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
        >
          <div>
            <legend class="fieldset-legend">{$t("settings.token")}</legend>
            <p class="label">{$t("settings.token.hint")}</p>
          </div>
          <div class="flex justify-end">
            <input
              type="password"
              class="input"
              bind:value={openai_token}
              disabled={!llm_enable}
            />
          </div>
        </fieldset>
      </div>

      <!-- Fonts Settings -->
      <input type="radio" name="setting_tabs" class="tab" aria-label={$t("settings.tab.fonts")} />
      <div class="tab-content bg-base-100 p-4">
        <div class="grid grid-cols-1 gap-4">
          <!-- Font Family -->
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">{$t("settings.font_family")}</legend>
            <p class="label">{$t("settings.font_family.hint")}</p>
            <select class="select select-bordered w-full" bind:value={font_family}>
              {#each fontFamilies as family}
                <option value={family} style="font-family: {family}">{family}</option>
              {/each}
            </select>
          </fieldset>

          <!-- Font Size -->
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">{$t("settings.font_size")}</legend>
            <p class="label">{$t("settings.font_size.hint")}</p>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                bind:value={font_size}
                class="range range-sm flex-1"
              />
              <span class="text-sm font-mono w-12 text-right">{font_size}px</span>
            </div>
          </fieldset>

          <!-- Line Height -->
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">{$t("settings.line_height")}</legend>
            <p class="label">{$t("settings.line_height.hint")}</p>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                bind:value={line_height}
                class="range range-sm flex-1"
              />
              <span class="text-sm font-mono w-12 text-right">{line_height}</span>
            </div>
          </fieldset>

          <!-- Letter Spacing -->
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">{$t("settings.letter_spacing")}</legend>
            <p class="label">{$t("settings.letter_spacing.hint")}</p>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="-1"
                max="3"
                step="0.1"
                bind:value={letter_spacing}
                class="range range-sm flex-1"
              />
              <span class="text-sm font-mono w-12 text-right">{letter_spacing}px</span>
            </div>
          </fieldset>

          <!-- Paragraph Gap -->
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">{$t("settings.paragraph_gap")}</legend>
            <p class="label">{$t("settings.paragraph_gap.hint")}</p>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="48"
                step="2"
                bind:value={paragraph_gap}
                class="range range-sm flex-1"
              />
              <span class="text-sm font-mono w-12 text-right">{paragraph_gap}px</span>
            </div>
          </fieldset>
        </div>
      </div>

      <!-- Shortcuts Settings -->
      <input
        type="radio"
        name="setting_tabs"
        class="tab"
        aria-label={$t("settings.tab.shortcuts")}
      />
      <div class="tab-content bg-base-100 p-4">
        <div class="flex flex-col gap-3">
          <fieldset
            class="fieldset grid grid-cols-1 md:grid-cols-2 items-center gap-2"
          >
            <div>
              <legend class="fieldset-legend">{$t("settings.enable_shortcuts")}</legend>
              <p class="label">
                {$t("settings.enable_shortcuts.hint")}
              </p>
            </div>
            <div class="flex justify-end">
              <input
                type="checkbox"
                checked={shortcuts_enabled}
                onchange={() => (shortcuts_enabled = !shortcuts_enabled)}
                class="toggle toggle-success"
              />
            </div>
          </fieldset>

          {#if shortcut_conflicts.length > 0}
            <div class="alert alert-error text-sm">
              <span>
                {$t("settings.conflicting_shortcuts")}
                {shortcut_conflicts
                  .map(
                    ([a, b]) =>
                      `${$t(SHORTCUT_ACTION_META[a as SHORTCUT_ACTION].labelKey)} / ${$t(SHORTCUT_ACTION_META[b as SHORTCUT_ACTION].labelKey)}`,
                  )
                  .join(", ")}.
                {$t("settings.reassign_or_reset")}
              </span>
            </div>
          {/if}

          <div class="flex justify-end">
            <button
              class="btn btn-sm btn-ghost"
              onclick={resetShortcuts}>{$t("settings.reset_defaults")}</button
            >
          </div>

          <ul class="flex flex-col gap-2">
            {#each Object.entries(SHORTCUT_ACTION_META) as [action, meta]}
              {@const is_conflicting = conflicting_actions.has(action)}
              <li
                class="flex items-center justify-between gap-3 p-3 rounded-lg bg-base-200 {is_conflicting ? 'ring-1 ring-error' : ''}"
              >
                <div class="min-w-0">
                  <p class="text-sm font-medium">{$t(meta.labelKey)}</p>
                  <p class="text-xs opacity-70">{$t(meta.descriptionKey)}</p>
                </div>
                <button
                  class="btn btn-sm btn-ghost min-w-36 shrink-0"
                  class:btn-primary={recording_action === action}
                  onclick={() => startRecording(action as SHORTCUT_ACTION)}
                >
                  {#if recording_action === action}
                    <span class="text-xs"
                      >{$t("settings.press_keys")}</span
                    >
                  {:else}
                    <span class="flex items-center gap-1">
                      {#each format_binding(
                        shortcut_bindings[action] ??
                          DEFAULT_SHORTCUT_BINDINGS[action as SHORTCUT_ACTION],
                      ).split("+") as part}
                        <kbd class="kbd kbd-xs">{part}</kbd>
                      {/each}
                    </span>
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
</ModalShell>

{#snippet settingsFooter()}
  <button
    class="btn btn-ghost"
    onclick={closeModal}
    disabled={save_in_progress}>{$t("common.cancel")}</button
  >
  <button
    class="btn btn-primary"
    onclick={saveSettings}
    disabled={save_in_progress}
  >
    {#if save_in_progress}
      <span class="loading loading-spinner"></span>
    {/if}
    {$t("common.save")}
  </button>
{/snippet}
