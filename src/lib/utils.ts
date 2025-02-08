import dayjs from 'dayjs'
import { fetch } from '@tauri-apps/plugin-http';

import { user_settings } from '$lib/store';
import { SETTINGS, POST_EXPIRY_TIME, LAST_REFRESH_TIME } from '$lib/constants';

export const fetchRSSMetadata = async (url: string) => {
    if (!validateURL(url)) {
        return null;
    }
    let response;
    try {
        response = await fetch(url);
    } catch (except) {
        console.log("Failed Response:");
        console.log(JSON.stringify(response));
    }

    if (response == null || response.status != 200) {
        return null;
    }
    const rssText = await response.text();

    return {
        name: fetchName(rssText),
        text: rssText,
        favicon: await fetchFavIcon(url, rssText),
        posts: fetchPosts(rssText)
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

const fetchPosts = (rssText: string) => {
    const posts: { title: string; link: string; description: string; pubDate: string }[] = [];

    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, "application/xml");

    // Determine the type of feed (RSS or Atom)
    const isRSS = !!rssDoc.querySelector("channel > item");
    const isAtom = !!rssDoc.querySelector("feed > entry");

    if (isRSS) {
        const items = rssDoc.querySelectorAll("channel > item");
        items.forEach(item => {
            posts.push({
                title: item.querySelector("title")?.textContent?.trim() || "",
                link: item.querySelector("link")?.textContent?.trim() || "",
                description: item.querySelector("description")?.textContent?.trim() || "",
                pubDate: item.querySelector("pubDate")?.textContent?.trim() || "",
            });
        });
    } else if (isAtom) {
        const entries = rssDoc.querySelectorAll("feed > entry");
        entries.forEach(entry => {
            posts.push({
                title: entry.querySelector("title")?.textContent?.trim() || "",
                link: entry.querySelector("link")?.getAttribute("href") || "",
                description: entry.querySelector("summary")?.textContent?.trim() || "",
                pubDate: entry.querySelector("updated")?.textContent?.trim() || "",
            });
        });
    }

    return posts;
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
        case SETTINGS.DARK_MODE:
            return false;
        case SETTINGS.POST_EXPIRY_TIME:
            return POST_EXPIRY_TIME;
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