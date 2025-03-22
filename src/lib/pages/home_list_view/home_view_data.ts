
import { SETTINGS } from "$lib/constants";
import {
    add_posts,
} from "$lib/db";
import {
    fetchRSSMetadata,
    isTimeExpired,
    fetch_user_setting,
} from "$lib/utils";

import "$lib/logging";

export const syncPostsInDB = async (
    feeds: {
        id: Number;
        url: string;
        title: string;
        favicon: string;
        last_refresh_time: string;
    }[],
) => {
    // Adds new post entries to DB
    const time_in_seconds =
        (await fetch_user_setting(SETTINGS.LAST_REFRESH_TIME)) * 60 * 60;

    const filteredFeeds = feeds.filter((feed) => {
        // Need to refresh if time is expired (don't worry, logic is right :))
        return isTimeExpired(feed.last_refresh_time, time_in_seconds);
    });

    console.log(`No. of Feeds to Update: ${filteredFeeds.length}`);

    const feedsResults = await Promise.all(
        filteredFeeds.map(async (feed) => {
            return await fetchRSSMetadata(feed.id, feed.url);
        }),
    );

    for (const feed of feedsResults) {
        let posts = [];
        for (const post of feed.posts) {
            posts.push({
                ...post,
                feed_id: feed.id,
            });
        }
        if (posts.length > 0) await add_posts(posts);
    }

};