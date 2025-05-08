import {
    fetch_feeds
} from "$lib/dao/feed_db";

import {
    feeds_store,
    active_feed_id,
    active_feed_name
} from "$lib/stores/app_store";

import {
    NO_FEED_SELECTED
} from "$lib/constants";

export const refresh_app_data = async (
    only_feeds: boolean = true,
) => {
    // Refresh Feed List
    if(only_feeds)
    {
        feeds_store.set(await fetch_feeds());
        active_feed_name.set('');
        active_feed_id.set(NO_FEED_SELECTED);
    }
}
