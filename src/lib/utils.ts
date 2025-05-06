import dayjs from 'dayjs'
import { fetch } from '@tauri-apps/plugin-http';

import { user_settings } from '$lib/store';
import { SETTINGS, POST_EXPIRY_TIME, LAST_REFRESH_TIME, THEMES, FEED_VIEW, FEED_TYPE } from '$lib/constants';

export const fetchRSSMetadata = async (id: Number, url: string) => {
    if (!validateURL(url)) {
        return null;
    }
    let response;
    try {
        response = await fetch(url);
    } catch (except) {
        console.log("Failed Response");
    }

    if (response == null || response.status != 200) {
        return null;
    }
    const rssText = await response.text();

    return {
        id: id,
        name: fetchName(rssText),
        text: rssText,
        favicon: await fetchFavIcon(url, rssText),
        posts: await fetchPosts(rssText)
    }
}

const fetchName = (rssText: string) => {
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

const fetchFavIcon = async (rssUrl: string, rssText: string) => {
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

const fetchPosts = async (rssText: string) => {
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
            }
        }));
        console.log(`Fetched ${posts.length} posts.`)
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
            }
        }));
        console.log(`Fetched ${posts.length} posts.`)
        return posts;
    }
}

const validateURL = (url: string) => {
    if (url) {
        const uri = new URL(url);
        if (!uri.protocol.startsWith("https")) {
            return false;
        }
        return true;
    }
    return false;
}


export const isTimeExpired = (time: string, expiry_in_seconds: number) => {
    if (!time) {
        return true;
    }

    const lastRefreshTime = new Date(time);
    const currentTime = new Date();
    const timeDifference = currentTime - lastRefreshTime;

    const expiryDifference = expiry_in_seconds * 1000;

    if (timeDifference > expiryDifference) {
        return true;
    }

    return false;
}

export const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (days < 30) {
        return `${Math.floor(days / 7)} weeks ago`;
    } else if (months < 12) {
        return `${months} months ago`;
    } else {
        return `${years} years ago`;
    }
}

export const convertToTimeStringForDB = (dateString: string) => {
    const date = dayjs(dateString);
    return date.toISOString();
}

export const escape_title = (str: string) => {
    if (!str) return "";
    return str.replace(/[']/g, function (char) {
        switch (char) {
            case "'":
                return '"'; // prepends a backslash to backslash, percent,
            // and double/single quotes
            default:
                return char;
        }
    });
}

export const fetch_user_setting = async (key: string) => {
    const val = await user_settings.get(key);
    if (val) return val;
    switch (key) {
        case SETTINGS.LAST_REFRESH_TIME:
            return LAST_REFRESH_TIME;
        case SETTINGS.THEME_MODE:
            return THEMES.LIGHT;
        case SETTINGS.POST_EXPIRY_TIME:
            return POST_EXPIRY_TIME;
        case SETTINGS.CURRENT_FEED_VIEW:
            return FEED_VIEW.LIST;
    }
}

export const generateShortUuid = (length = 8) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let uuid = '';
    if (window.crypto && window.crypto.getRandomValues) {
        const randomValues = new Uint8Array(length);
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            uuid += chars.charAt(randomValues[i] % chars.length);
        }
    } else {
        // Fallback to Math.random() if crypto API is not available
        for (let i = 0; i < length; i++) {
            uuid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    return uuid;
}

export function capitalizeFirstLetter(val:string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const runWithTimeout = (promise, ms=3000) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    );
    return Promise.race([promise, timeout]);
};

export const convertFeedDataToOPML = (feed_data) => {
    let opml_body = "";

    for(const feed of feed_data){
        console.log(feed);
        if(feed.type == FEED_TYPE.FOLDER){
            if(feed.children){
                opml_body += `\t\t<outline text="${feed.title}">\n`
                for(const child_feed of feed.children){
                    opml_body += `\t\t\t\t<outline text="${child_feed.title}" xmlUrl="${child_feed.url}"/>\n`
                }
                opml_body += `\t\t</outline>\n`
            }
        } else{
            opml_body += `\t\t<outline text="${feed.title}" xmlUrl="${feed.url}"/>\n`
        }
    }

    return `<opml version="1.0">\t\n<body>\n${opml_body}\t</body>\n</opml>`;
}

export const parseOPML = (opmlString: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(opmlString, "text/xml");

    const items = [];

    function traverseOutlines(outlines) {
        outlines.forEach(outline => {
            if (outline.hasAttribute("xmlUrl")) {
                items.push({
                    name: outline.getAttribute("text") || "",
                    xmlUrl: outline.getAttribute("xmlUrl") || "",
                });
            } else {
                const childOutlines = outline.querySelectorAll(":scope > outline");
                traverseOutlines(childOutlines);
            }
        });
    }

    const topLevelOutlines = xmlDoc.querySelectorAll("body > outline");
    traverseOutlines(topLevelOutlines);

    return items;
}

export const toInitCaps = (str: string) => {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
}