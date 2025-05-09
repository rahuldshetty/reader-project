import type { PostResult } from '$lib/types';
import Database from '@tauri-apps/plugin-sql';
import { 
    DB_PATH, 
    DB_ORDER_ENUM, 
    NO_OF_POST_PULLS_PER_TIME,
    ROOT_PARENT_FEED_ID 
} from '$lib/constants';

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
