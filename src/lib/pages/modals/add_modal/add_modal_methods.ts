import {get} from "svelte/store";
import { active_modal } from "$lib/stores/app_store";
import { feeds_import_data, active_page, url, btn_in_progress } from "$lib/stores/add_modal_store";
import { MODAL_TYPE } from "$lib/constants";

import {
    fetchFeedDataFromURL
} from "$lib/services/feed_gather";

export const closeAddModal = () => {
    feeds_import_data.set([]);
    active_modal.set(MODAL_TYPE.NONE);
    active_page.set(0);
    url.set('');
};

export const addFeedFromURL = async () => {
    btn_in_progress.set(true);

    feeds_import_data.set(await fetchFeedDataFromURL(get(url)));

    btn_in_progress.set(false);
    active_page.set(1);
};

export const addOPMLfromUpload = () => {
    btn_in_progress.set(true);

    // TODO: Handle OPML File upload

    active_page.set(1);
};

