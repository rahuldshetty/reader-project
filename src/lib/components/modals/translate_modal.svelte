<script>
  import { SETTINGS, MODAL_TYPE, THEMES } from "$lib/constants";

  import { selected_modal, post_translate_code } from "$lib/store";
  import { capitalizeFirstLetter, fetch_user_setting } from "$lib/utils";

  import { LIB_TRANSLATE_TARGETS } from "$lib/experimental/translation";

  let lang = $state(LIB_TRANSLATE_TARGETS[0].code);

  const translate_on_submit_action = () => {
    $post_translate_code = lang;
    $selected_modal = MODAL_TYPE.NONE;
  }

</script>

<div
  id="settingModal"
  class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-10
  {$selected_modal != MODAL_TYPE.TRANSLATE ? "hidden":""}
  "
>
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-bold mb-4">Translate Language</h2>

    <div class="text-normal  mb-4">
      The translation service is powered by Google Translate.
    </div>

    <div class="flex flex-col">
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label class="block text-sm flex gap-1 font-medium">
        <p>Language</p>
      </label>
      <select bind:value={lang} class="border-0 border-b-2  bg-transparent appearance-none border-neutral-500 focus:outline-none text-neutral-900 text-sm block w-full p-2.5 peer">
      {#each LIB_TRANSLATE_TARGETS as lib_lang}
        <option value={lib_lang.code} class="">{lib_lang.name}</option>
      {/each}
      </select>
    </div>

    <div class="flex justify-end gap-2 mt-10">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onclick={translate_on_submit_action}
      >
        Submit
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
