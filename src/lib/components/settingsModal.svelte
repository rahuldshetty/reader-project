<script>
  import { SETTINGS } from "$lib/constants";

  import { user_settings } from "$lib/store";
  import { fetch_user_setting } from "$lib/utils";
  import { onMount } from "svelte";

  let last_refresh_time = $state(4);
  let darkMode = $state(false);

  onMount(async () => {
    last_refresh_time = await fetch_user_setting(SETTINGS.LAST_REFRESH_TIME);
    darkMode = await fetch_user_setting(SETTINGS.DARK_MODE);
  });

  const saveSettings = async () => {
    document.getElementById("settingModal")?.classList.add("hidden");
    await user_settings.set(SETTINGS.LAST_REFRESH_TIME, last_refresh_time);
    await user_settings.set(SETTINGS.DARK_MODE, darkMode);
  }
</script>


<div
  id="settingModal"
  class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center hidden"
>
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-bold mb-4">Settings</h2>

    <div>
      <label class="block mb-2 text-sm font-medium">Last Refresh Time (hours)</label>
      <input
        type="number"
        placeholder="Enter no. of hours"
        class="w-full px-3 py-2 border rounded-lg mb-4"
        bind:value={last_refresh_time}
      />
    </div>

    <div class="flex items-center">
      <label class="block text-sm flex gap-1">
        <p>Enable</p>
        <p class="font-medium">Dark Mode</p>
      </label>
      <input
        type="checkbox"
        placeholder="Enter name"
        class=" border rounded-lg ml-2"
        bind:checked={darkMode}
      />
    </div>

    <div class="flex justify-end gap-2">
      <button
        class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
        onclick={() =>
          document.getElementById("settingModal")?.classList.add("hidden")}
      >
        Cancel
      </button>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onclick={saveSettings}
      >
        Save
      </button>
    </div>
  </div>
</div>
