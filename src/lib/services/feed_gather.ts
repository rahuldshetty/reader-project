import type { Post, FeedMetadata, FeedMetadataFolder } from "$lib/types";
import { FEED_URL_CONTENT_TYPE } from "$lib/constants";
import { fetch } from '@tauri-apps/plugin-http';

export const fetchFeedName = (rssText: string) => {
    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, "application/xml");
    var channelTitle;
    if (rssDoc.querySelector("channel > title")) {
        channelTitle = rssDoc.querySelector("channel > title");
    } else if (rssDoc.querySelector("feed > title")) {
        channelTitle = rssDoc.querySelector("feed > title");
    } else {
        return ""
    }
    if (channelTitle && channelTitle.textContent) {
        return channelTitle.textContent.trim();
    }
    return ""
}

export const fetchFeedIcon = async (rssUrl: string, rssText: string) :Promise<string> => {
    // Fetch the HTML page of the RSS feed's origin
    const baseUrl = new URL(rssUrl).origin;

    const response = await fetch(baseUrl);
    if (response.status != 200) {
        return '';
    }

    const htmlText = await response.text();

    //  Parse the HTML to find favicon links
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const faviconLink = Array.from(
            doc.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="icon"]')
        )
        .map(link => ({
            href: link.getAttribute("href"),
            sizes: link.getAttribute("sizes") || "",
        }))
        .sort((a, b) => {
            // Sort by size if possible (e.g., "32x32", "180x180")
            const aSize = parseInt(a.sizes.split("x")[0]) || 0;
            const bSize = parseInt(b.sizes.split("x")[0]) || 0;
            return bSize - aSize;
        })[0]; // Pick the largest

    if (faviconLink && faviconLink.href) {
        const faviconUrl = new URL(faviconLink.href, baseUrl).href; // Resolve relative URLs
        return faviconUrl;
    }

    return '';
}

export const fetchPosts = async (rssText: string) :Promise<Post[]> => {
    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, "application/xml");

    // Determine the type of feed (RSS or Atom)
    const isRSS = !!rssDoc.querySelector("channel > item");
    const isAtom = !!rssDoc.querySelector("feed > entry");

    if (isRSS) {
        const items = rssDoc.querySelectorAll("channel > item");
        console.log("Fetching RSS Contents");
        const posts = await Promise.all(Array.from(items).map(async (item)=>{
            const link = item.querySelector("link")?.textContent?.trim() || "";

            // Extract Image from enclosure or media:content
            const image = item.querySelector("media\\:thumbnail, thumbnail")?.getAttribute("url") ||
                          item.querySelector("enclosure[type^='image']")?.getAttribute("url") ||
                          item.querySelector("media\\:content, content")?.getAttribute("url") ||
                          "";

            return {
                title: item.querySelector("title")?.textContent?.trim() || "",
                link: link,
                description: item.querySelector("description")?.textContent?.trim() || "",
                pubDate: item.querySelector("pubDate")?.textContent?.trim() || "",
                image: image,
            } as Post;
        }));
        console.log(`Fetched ${posts.length} posts.`);
        return posts;
    } else if (isAtom) {
        console.log("Fetching Atom Contents");
        const entries = rssDoc.querySelectorAll("feed > entry");
        const posts = await Promise.all(Array.from(entries).map(async (entry)=>{
            const link = entry.querySelector("link")?.getAttribute("href") || "";

            // Extract Image from Atom feed (enclosure or media:content)
            const image =  entry.querySelector("media\\:thumbnail, thumbnail")?.getAttribute("url") ||
                            entry.querySelector("link[rel='enclosure'][type^='image']")?.getAttribute("href") ||
                            entry.querySelector("media\\:content, content")?.getAttribute("url") ||
                            "";

            return {
                title: entry.querySelector("title")?.textContent?.trim() || "",
                link: link,
                description: entry.querySelector("summary")?.textContent?.trim() || "",
                pubDate: entry.querySelector("updated")?.textContent?.trim() || "",
                image: image,
            } as Post;
        }));
        console.log(`Fetched ${posts.length} posts.`);
        return posts;
    }

    return [];
}

export const fetchFeedDataFromFeedURL = async (id: number, url: string) : Promise<FeedMetadata> => {
    // Returns feed metadata from XML URL
    const response = await fetch(url);

    if(response == null || response.status != 200){
        throw new Error("Failed to fetch Feed metadata.");
    }

    const xmlText = await response.text();

    return {
        id: id,
        name: fetchFeedName(xmlText),
        icon: await fetchFeedIcon(url, xmlText),
        posts: await fetchPosts(xmlText),
        url: url,
    }
}

const detectURLContentType = async (url: string) :Promise<FEED_URL_CONTENT_TYPE> => {
    // Detect whether URL points to XML feed or a website
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    const trimmed = text.trim().toLowerCase();

    const isXMLlike = contentType.includes('xml') || trimmed.startsWith('<?xml');

    if(isXMLlike){
        return FEED_URL_CONTENT_TYPE.XML;
    } else {
        return FEED_URL_CONTENT_TYPE.WEBSITE;
    }
}

export const fetchFeedDataFromURL = async (url: string): Promise<(FeedMetadata | FeedMetadataFolder)[]> => {
    // Returns list of feeds identified from URL 

    // Check type of URL
    const content_type = await detectURLContentType(url);

    if(content_type == FEED_URL_CONTENT_TYPE.XML){
        // Scenario 1: User provides direct URL to feed
        const feedMetadata = await fetchFeedDataFromFeedURL(0, url);
        return [ feedMetadata ];
    } else if(content_type == FEED_URL_CONTENT_TYPE.WEBSITE){
        // Scenario 2: User provides URL to website that may contain links to RSS feeds
        return [];
    }
    // TODO: Scenario 3 - OPML URL link
    return [];
}
