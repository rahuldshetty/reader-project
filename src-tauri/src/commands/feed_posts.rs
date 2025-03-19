use crate::models;
use crate::models::FaviconLink;
use scraper::{Html, Selector};
use url::Url;
use roxmltree::Document;
use tauri_plugin_http::reqwest;
use std::error::Error;

pub fn fetch_name(rss_text: &str) -> String {
    // Parse the RSS text into an XML document.
    let doc = match Document::parse(rss_text) {
        Ok(doc) => doc,
        Err(_) => return String::new(),
    };

    // Attempt to find a <title> node whose parent is <channel>
    let channel_title = doc
        .descendants()
        .find(|n| {
            n.has_tag_name("title") &&
            n.parent().map_or(false, |p| p.has_tag_name("channel"))
        })
        // If not found, look for a <title> whose parent is <feed>
        .or_else(|| {
            doc.descendants()
                .find(|n| {
                    n.has_tag_name("title") &&
                    n.parent().map_or(false, |p| p.has_tag_name("feed"))
                })
        });

    // If a title is found and it has text, trim and return it.
    if let Some(node) = channel_title {
        return node.text().unwrap_or("").trim().to_string();
    }

    // Fallback: return an empty string.
    String::new()
}

#[tauri::command]
pub fn get_article_data_for_url(rss_text: String) -> Vec<models::PostData> {
    // Parse the XML document.
    let doc = match Document::parse(&rss_text) {
        Ok(doc) => doc,
        Err(err) => {
            log::error!("Failed to parse XML");
            return Vec::new();
        }
    };

    // Check if the feed is RSS by looking for "channel > item"
    let is_rss = doc.descendants().any(|n| {
        n.has_tag_name("item") && n.parent().map_or(false, |p| p.has_tag_name("channel"))
    });

    // Check if the feed is Atom by looking for "feed > entry"
    let is_atom = doc.descendants().any(|n| {
        n.has_tag_name("entry") && n.parent().map_or(false, |p| p.has_tag_name("feed"))
    });

    if is_rss {
        log::info!("Fetching RSS Contents");
        // Collect all <item> elements under <channel>
        let items: Vec<_> = doc.descendants().filter(|n| {
            n.has_tag_name("item") && n.parent().map_or(false, |p| p.has_tag_name("channel"))
        }).collect();

        let posts: Vec<models::PostData> = items.iter().map(|item| {
            // For each item, extract the desired child element text.
            let title = item
                .children()
                .find(|n| n.has_tag_name("title"))
                .and_then(|n| n.text())
                .unwrap_or("")
                .trim()
                .to_string();

            let link = item
                .children()
                .find(|n| n.has_tag_name("link"))
                .and_then(|n| n.text())
                .unwrap_or("")
                .trim()
                .to_string();

            let description = item
                .children()
                .find(|n| n.has_tag_name("description"))
                .and_then(|n| n.text())
                .unwrap_or("")
                .trim()
                .to_string();

            let pubDate = item
                .children()
                .find(|n| n.has_tag_name("pubDate"))
                .and_then(|n| n.text())
                .unwrap_or("")
                .trim()
                .to_string();

            models::PostData {
                title,
                link,
                description,
                pubDate,
            }
        }).collect();

        log::info!("Fetched {} posts.", posts.len());
        posts

    } else if is_atom {
        log::info!("Fetching Atom Contents");
        // Collect all <entry> elements under <feed>
        let entries: Vec<_> = doc.descendants().filter(|n| {
            n.has_tag_name("entry") && n.parent().map_or(false, |p| p.has_tag_name("feed"))
        }).collect();

        let posts: Vec<models::PostData> = entries.iter().map(|entry| {
            let title = entry
                .children()
                .find(|n| n.has_tag_name("title"))
                .and_then(|n| n.text())
                .unwrap_or("")
                .trim()
                .to_string();

            // For Atom, the link is in the href attribute of the <link> element.
            let link = entry
                .children()
                .find(|n| n.has_tag_name("link"))
                .and_then(|n| n.attribute("href"))
                .unwrap_or("")
                .trim()
                .to_string();

            let description = entry
                .children()
                .find(|n| n.has_tag_name("summary"))
                .and_then(|n| n.text())
                .unwrap_or("")
                .trim()
                .to_string();

            let pubDate = entry
                .children()
                .find(|n| n.has_tag_name("updated"))
                .and_then(|n| n.text())
                .unwrap_or("")
                .trim()
                .to_string();

            models::PostData {
                title,
                link,
                description,
                pubDate,
            }
        }).collect();

        log::info!("Fetched {} posts.", posts.len());
        posts
    } else {
        // Neither RSS nor Atom format detected.
        Vec::new()
    }
}


pub async fn get_fav_icon(rss_url: &str, _rss_text: &str) -> Result<String, Box<dyn Error>> {
    // Extract the origin (base URL) from the provided RSS URL.
    let parsed_url = Url::parse(rss_url)?;
    let host = parsed_url.host_str().ok_or("Invalid URL: missing host")?;
    let base_url = format!("{}://{}", parsed_url.scheme(), host);

    // Fetch the HTML page of the base URL.
    let response = reqwest::get(&base_url).await?;
    if response.status() != reqwest::StatusCode::OK {
        return Ok(String::new());
    }
    let html_text = response.text().await?;

    // Parse the HTML document.
    let document = Html::parse_document(&html_text);

    // Define a CSS selector that matches favicon links.
    // Note: We combine selectors for "icon" and "apple-touch-icon".
    let selector = Selector::parse(r#"link[rel="icon"], link[rel="apple-touch-icon"]"#).unwrap();

    // Extract favicon link data.
    let mut favicons: Vec<FaviconLink> = document
        .select(&selector)
        .filter_map(|element| {
            let href = element.value().attr("href")?;
            let sizes = element.value().attr("sizes").unwrap_or("").to_string();
            Some(FaviconLink {
                href: href.to_string(),
                sizes,
            })
        })
        .collect();

    // Sort the favicon links by size (largest first).
    favicons.sort_by(|a, b| {
        let a_size = a
            .sizes
            .split('x')
            .next()
            .and_then(|s| s.parse::<i32>().ok())
            .unwrap_or(0);
        let b_size = b
            .sizes
            .split('x')
            .next()
            .and_then(|s| s.parse::<i32>().ok())
            .unwrap_or(0);
        b_size.cmp(&a_size)
    });

    // If a favicon was found, resolve its URL relative to the base URL.
    if let Some(best) = favicons.first() {
        let base = Url::parse(&base_url)?;
        let resolved = base.join(&best.href)?;
        return Ok(resolved.to_string());
    }

    // If no favicon link was found, return an empty string.
    Ok(String::new())
}

#[tauri::command]
pub async fn get_feed_data_for_url(id: i64, url: String, skip_extra_details: bool) -> Result<models::FeedData, ()> {
    log::info!("Fetching articles for url: {url:?}");

    let response = reqwest::get(url.clone()).await.unwrap();

    let res_text = response.text().await.unwrap();

    if skip_extra_details {
        // Only parse Posts Data
        Ok(models::FeedData {
            id: id,
            name: "".to_string(),  // name of feed not necessary for syncing posts
            text: "".to_string(),
            favicon: "".to_string(), // favicon not requires for syncing posts
            posts: get_article_data_for_url( res_text.clone()),
        })
    } else {
        Ok(models::FeedData {
            id: id,
            name: fetch_name(&res_text),  // name of feed not necessary for syncing posts
            text: res_text.clone(),
            favicon: get_fav_icon(&url, &res_text).await.unwrap(), // favicon not requires for syncing posts
            posts: get_article_data_for_url( res_text.clone()),
        })
    }
}


#[tauri::command]
pub async fn sync_posts_in_db() -> Result<(), ()> {
    log::info!("Syncing DB Posts...");

    let result = get_feed_data_for_url(1, String::from("https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml"), false).await.unwrap();

    

    Ok(())
}
