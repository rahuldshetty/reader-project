import type { PostResult, FeedMetadata } from '$lib/types';
import Database from '@tauri-apps/plugin-sql';
import { 
    DB_PATH, 
    DB_ORDER_ENUM, 
    NO_OF_POST_PULLS_PER_TIME,
    ROOT_PARENT_FEED_ID 
} from '$lib/constants';
import { convertToTimeStringForDB } from '$lib/utils/time';
import { escape_title } from '$lib/utils/html';

const db = await Database.load(DB_PATH);


export const fetch_posts = async (
    sort_by: DB_ORDER_ENUM = DB_ORDER_ENUM.NEWEST,
    last_id: number | null = null,
    feed_id: number = ROOT_PARENT_FEED_ID,
    limit: number = NO_OF_POST_PULLS_PER_TIME,
    unread: boolean = false,
    lastPubDate: string = "",
    is_fav: boolean | null = null, // Set this to filter specific posts
): Promise<PostResult[]> => {
    let whereCondition = "WHERE 1=1 ";
    if (last_id != null) {
        if (sort_by == DB_ORDER_ENUM.NEWEST) {
            whereCondition += `AND id < ${last_id} `
        } else {
            whereCondition += `AND id > ${last_id} `
        }
    }

    if (lastPubDate != "") {
        if (sort_by == DB_ORDER_ENUM.NEWEST) {
            whereCondition += `AND datetime(pub_date) < datetime("${lastPubDate}") `
        } else {
            whereCondition += `AND datetime(pub_date) > datetime("${lastPubDate}") `
        }
    }

    // Negative Feed ids reserved for All Posts, Favs
    if (feed_id >= 0) {
        whereCondition += `AND feed_id=${feed_id} `
    } else if(feed_id == -2){
        is_fav = true;
    }

    if(unread){
        whereCondition += `AND read=0 `
    }

    if(is_fav != null){
        if(is_fav)
            whereCondition += `AND is_fav=1 `
        else
            whereCondition += `AND is_fav=0 `
    }

    const query = `
        SELECT 
            id, 
            feed_id, 
            title, 
            link, 
            pub_date as pubDate, 
            read, 
            is_fav, 
            image_url as image, 
            content, 
            word_count 
        from articles
        ${whereCondition}
        ORDER BY datetime(pub_date) ${sort_by}
        LIMIT ${limit}
    `

    console.log(`|| SQL: ${query} ||`);

    const result = (await db.select(query)) as PostResult[];

    console.log("DB FETCH POSTS:" + result.length);
    
    return result;
}

export const fetch_post_data = async (id: number): Promise<PostResult> => {
    const query = `
        SELECT 
            id, 
            feed_id, 
            title, 
            link, 
            pub_date as pubDate, 
            read, 
            is_fav, 
            image_url as image, 
            content, 
            word_count 
        from articles
        where id = $1
    `

    const result = (await db.select(query, [id])) as PostResult[];

    if(result.length == 0){
        throw Error(`No Article found with id ${id}`);
    }

    return result[0];
}


export const mark_post_as_read = async (id: number, read_status: boolean) => {
    let status = 1;
    if(!read_status){
        status = 0;
    }
    await db.execute(
        `UPDATE articles SET read = $1 WHERE id = $2`,
        [ status, id ]
    );
}


export const mark_post_as_fav = async (id: number, is_fav: boolean) => {
    let fav = 1;
    if(!is_fav){
        fav = 0;
    }
    await db.execute(
        `UPDATE articles SET is_fav = $1 WHERE id = $2`,
        [fav, id],
    );
}


export const add_posts = async (feedMetadata: FeedMetadata) => {
    const posts = feedMetadata.posts;

    // Track individual posts to insert into DB
    let value_string = ""

    // Create a Set to track feeds that were updated
    const feedsSet = new Set();

    let inserted = 0;

    for (const [i, post] of posts.entries()) {
        try{
            const date = convertToTimeStringForDB(post.pubDate);

            value_string += `(${feedMetadata.id}, '${escape_title(post.title)}', '${post.link}', '${date}', '${escape_title(post.image)}')`;

            if (i != posts.length - 1) {
                value_string += ",\n"
            }

            await db.execute(
                `INSERT OR IGNORE INTO articles (feed_id, title, link, pub_date, image_url) VALUES ${value_string}`
            );

            feedsSet.add(feedMetadata.id);

            inserted++;
        } catch{

        }
    }

    // Update Last Refresh Time (LRT)
    if (feedsSet.size > 0) {
        const value_string_feeds = Array.from(feedsSet).join(", ");
        const currentTime = new Date().toISOString();
        await db.execute(
            `UPDATE feeds SET last_refresh_time = "${currentTime}" WHERE id in (${value_string_feeds})`
        );
    }

    console.log(`|| Refreshed feed: ${feedMetadata.name} ||`);
    console.log(`|| Inserted ${inserted} posts||`);
}

export const fetch_old_post_count = async (days: number): Promise<number> => {
    const query = `
        Select count(id) as count FROM articles WHERE datetime(pub_date) <= date('now','-${days} day') AND is_fav = 0 AND 
        feed_id in (
            SELECT feed_id FROM articles group by feed_id having count(*) > 100
        )
    `
    const result = (await db.select(query)) as Record<string, number>[];
    return result[0]['count'];
}


export const delete_old_posts = async (days: number): Promise<boolean> => {
    const query = `
        DELETE FROM articles WHERE datetime(pub_date) <= date('now','-${days} day') AND is_fav = 0 AND 
        feed_id in (
            SELECT feed_id FROM articles group by feed_id having count(*) > 100
        )
    `
    const result = await db.execute(query);
    console.log(`|| Deleted ${result.rowsAffected} old posts ||`);
    return result.rowsAffected != 0;
}