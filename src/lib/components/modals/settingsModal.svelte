<script>
  import { SETTINGS, MODAL_TYPE, THEMES } from "$lib/constants";

  import { user_settings, selected_modal, themeMode, feeds_store } from "$lib/store";
  import { capitalizeFirstLetter, convertFeedDataToOPML, fetch_user_setting } from "$lib/utils";
  import { onMount } from "svelte";
  import { save } from '@tauri-apps/plugin-dialog';
  import { writeTextFile } from '@tauri-apps/plugin-fs';

  let last_refresh_time = $state(4);
  let theme = $state(THEMES.LIGHT);

  onMount(async () => {
    last_refresh_time = await fetch_user_setting(SETTINGS.LAST_REFRESH_TIME);
    theme = await fetch_user_setting(SETTINGS.THEME_MODE);
  });

  const saveSettings = async () => {
    $themeMode = theme;
    await user_settings.set(SETTINGS.LAST_REFRESH_TIME, last_refresh_time);
    await user_settings.set(SETTINGS.THEME_MODE, theme);
    $selected_modal = MODAL_TYPE.NONE
  };

  const exportOPML = async () => {
    // Open Save dialog
    const path = await save({
      filters: [
        {
          name: 'OPML (XML)',
          extensions: ['opml'],
        },
      ],
    });

    // Generate OPML
    const opml_result = convertFeedDataToOPML($feeds_store);
    console.log(opml_result);

    await writeTextFile(path, opml_result);
  }


</script>

<div
  id="settingModal"
  class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-10
  {$selected_modal != MODAL_TYPE.SETTINGS ? "hidden":""}
  "
>
  <div class="bg-white p-6 rounded-lg shadow-lg w-96 flex flex-col gap-6">
    <h2 class="text-lg font-bold">Settings</h2>

    <div>
      <label class="block mb-2 text-sm font-medium"
        >Last Refresh Time (hours)</label
      >
      <input
        type="number"
        placeholder="Enter no. of hours"
        class="w-full px-3 py-2 border rounded-lg "
        bind:value={last_refresh_time}
      />
    </div>

    <div class="flex flex-col">
      <label class="block text-sm flex gap-1 font-medium">
        <p>Theme Mode</p>
      </label>
      <select bind:value={theme} class="border-0 border-b-2  bg-transparent appearance-none border-neutral-500 focus:outline-none text-neutral-900 text-sm block w-full p-2.5 peer">
      {#each Object.values(THEMES) as themeValue}
        <option value={themeValue} class="">{capitalizeFirstLetter(themeValue)}</option>
      {/each}
      </select>
    </div>


    <div class="dropdown mb-72">
      <div tabindex="0" role="button" class="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          class="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048">
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
        </svg>
      </div>
      <ul tabindex="0" class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Default"
            value="default" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Retro"
            value="retro" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Cyberpunk"
            value="cyberpunk" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Valentine"
            value="valentine" />
        </li>
        <li>
          <input
            type="radio"
            name="theme-dropdown"
            class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
            aria-label="Aqua"
            value="aqua" />
        </li>
      </ul>
    </div>

    <div class="flex justify-end gap-2 mt-10">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onclick={exportOPML}
      >
        Export OPML
      </button>

      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onclick={saveSettings}
      >
        Save
      </button>
      <button
        class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
        onclick={() =>{
          console.log("CLOSING MODAL")
          $selected_modal = MODAL_TYPE.NONE;
        }}
      >
        Cancel
      </button>
    </div>
  </div>
</div>
