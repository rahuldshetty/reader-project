import {get} from "svelte/store";
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { active_modal } from "$lib/stores/app_store";
import { feeds_import_data, active_page, url, btn_in_progress } from "$lib/stores/add_modal_store";
import { MODAL_TYPE } from "$lib/constants";

import {
    fetchFeedDataFromURL
} from "$lib/services/feed_gather";
import { parseFeedDatafromOPML } from "$lib/services/opml_gather";

export const closeAddModal = () => {
    feeds_import_data.set('');
    active_modal.set(MODAL_TYPE.NONE);
    active_page.set(0);
    url.set('');
    btn_in_progress.set(false);
};

export const addFeedFromURL = async () => {
    btn_in_progress.set(true);

    feeds_import_data.set(get(url));

    btn_in_progress.set(false);
    active_page.set(1);
};

export const addOPMLfromUpload = async () => {
    btn_in_progress.set(true);

    const file = await open({
      multiple: false,
      directory: false,
    });

    if(file){
      const text_file_content = await readTextFile(file);
      feeds_import_data.set(text_file_content);
      active_page.set(1);
    }
    btn_in_progress.set(false);
};

