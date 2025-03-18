use crate::models;
use reqwest::Error;
use tauri_plugin_http::reqwest;

pub async fn get_articles_for_feed_url(id: i64, url: String) -> Result<models::FeedData, Error> {
    log::info!("Fetching articles for url: {url:?}");

    let response = reqwest::get(url).await?;

    let res_text = response.text().await?;

    Ok(models::FeedData {
        id: id,
        name: "RANDOM".to_string(),
        text: res_text,
        favicon: "".to_string(),
        posts: vec![],
    })
}

#[tauri::command]
pub async fn sync_posts_in_db() -> Result<(), ()> {
    log::info!("Syncing DB Posts...");
    // Call another async function and wait for it to finish
    get_articles_for_feed_url(1, String::from("https://feeds.bbci.co.uk/news/world/asia/rss.xml")).await;
    Ok(())
}
