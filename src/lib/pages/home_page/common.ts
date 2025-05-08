import {
    fetch_feeds
} from "$lib/dao/feed_db";

import {
    feeds_store,
} from "$lib/stores/app_store";

export const refresh_app_data = async (
    refresh_only_feeds: boolean = true,
) => {
    // Refresh Feed List
    if(refresh_only_feeds)
        feeds_store.set(await fetch_feeds());
}
