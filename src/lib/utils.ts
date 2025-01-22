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
        favicon: await fetchFavIcon(url, rssText),
        posts: fetchPosts(rssText)
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

const fetchPosts = (rssText:string) => {
    const posts: { title: string; link: string; description: string; pubDate: string | null; }[] = [];

    const parser = new DOMParser();
    const rssDoc = parser.parseFromString(rssText, "application/xml");

    // Determine the type of feed (RSS or Atom)
    const isRSS = !!rssDoc.querySelector("channel > item");
    const isAtom = !!rssDoc.querySelector("feed > entry");

    if (isRSS){
        const items = rssDoc.querySelectorAll("channel > item");
        items.forEach(item => {
            posts.push({
                title: item.querySelector("title")?.textContent?.trim() || "",
                link: item.querySelector("link")?.textContent?.trim() || "",
                description: item.querySelector("description")?.textContent?.trim() || "",
                pubDate: item.querySelector("pubDate")?.textContent?.trim() || null,
            });
        });
    } else if(isAtom){
        const entries = rssDoc.querySelectorAll("feed > entry");
        entries.forEach(entry => {
            posts.push({
                title: entry.querySelector("title")?.textContent?.trim() || "",
                link: entry.querySelector("link")?.getAttribute("href") || "",
                description: entry.querySelector("summary")?.textContent?.trim() || "",
                pubDate: entry.querySelector("updated")?.textContent?.trim() || null,
            });
        });
    }

    return posts;
}
