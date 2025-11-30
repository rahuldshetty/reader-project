export const renderHTML = (content: string, url: string) => {
  const div = document.createElement("div");
  div.innerHTML = content;

  // Disable links
  div.querySelectorAll("a").forEach((a) => {
    a.removeAttribute("href");
    a.style.pointerEvents = "none";
    a.style.cursor = "default";
    a.style.color = "inherit";
    a.style.textDecoration = "none";
  });

  // Constrain images to container width
  div.querySelectorAll("img").forEach((img) => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "block";
  });

  // Constrain iframes and videos
  div.querySelectorAll("iframe, video").forEach((elem) => {
    (elem as HTMLElement).style.maxWidth = "100%";
    (elem as HTMLElement).style.height = "auto";
  });

  // Constrain tables
  div.querySelectorAll("table").forEach((table) => {
    table.style.maxWidth = "100%";
    table.style.overflowX = "auto";
    table.style.display = "block";
  });

  // Remove problematic positioning and width styles from all elements
  div.querySelectorAll("*").forEach((elem) => {
    const htmlElem = elem as HTMLElement;

    // Remove fixed/absolute positioning that can cause overflow
    if (htmlElem.style.position === "fixed" || htmlElem.style.position === "absolute") {
      htmlElem.style.position = "relative";
    }

    // Remove explicit widths that might be larger than container
    if (htmlElem.style.width && htmlElem.style.width.includes("px")) {
      const width = parseInt(htmlElem.style.width);
      if (width > 800) { // If width is unreasonably large
        htmlElem.style.width = "100%";
        htmlElem.style.maxWidth = "100%";
      }
    }

    // Ensure max-width is respected
    if (!htmlElem.style.maxWidth || htmlElem.style.maxWidth === "none") {
      htmlElem.style.maxWidth = "100%";
    }
  });

  return div.innerHTML;
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

export const validate_url_secure = (url: string) => {
  return url.startsWith('https://');
}

export function getRandomElement<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}


export function getRandomKElements<T>(arr: T[], k: number): T[] {
  const shuffled = [...arr]; // Create a copy to avoid modifying original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
  }
  return shuffled.slice(0, k);
}

export function get_color_var(key: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(key)
    .trim();
}

export function extractTextFromHtml(htmlString: string) {
  // parse into a DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // remove all img elements
  const imgs = doc.querySelectorAll("img");
  imgs.forEach(img => img.remove());

  // optionally remove script/style content too
  doc.querySelectorAll("script, style").forEach(n => n.remove());

  // get the visible text
  const text = doc.body ? doc.body.textContent || "" : doc.textContent || "";
  // trim and normalize whitespace
  return text.replace(/\s+/g, " ").trim();
}


export async function hashString(inputString: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}