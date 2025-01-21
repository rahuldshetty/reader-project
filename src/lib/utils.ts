import { fetch } from '@tauri-apps/plugin-http';

export const fetchRSSMetadata = async (url:string) => {
    const response = await fetch(url);
    if (response.status != 200) {
        return null;
    }
    const rssText = await response.text();

    return {
        name: fetchName(rssText),
        text: rssText,
        favicon: await fetchFavIcon(url, rssText)
    }
}

const fetchName = (rssText:string) => {
    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, "application/xml");
    var channelTitle;
    if(rssDoc.querySelector("channel > title")){
        channelTitle = rssDoc.querySelector("channel > title");
    } else if (rssDoc.querySelector("feed > title")){
        channelTitle = rssDoc.querySelector("feed > title");
    } else {
        return ""
    }
    if (channelTitle && channelTitle.textContent) {
        return channelTitle.textContent.trim();
    }
    return ""
}

const fetchFavIcon = async (rssUrl:string, rssText:string) => {
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