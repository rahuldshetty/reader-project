export const cleanHTML = (content:string, url:string) => {
  const div = document.createElement("div");
  div.innerHTML = content;

  div.querySelectorAll("a").forEach((a) => {
    a.removeAttribute("href");
    a.style.pointerEvents = "none";
    a.style.cursor = "default";
    a.style.color = "inherit";
    a.style.textDecoration = "none";
  })

    // Replace above with below code to use redirect when user clicks on link
//   div.querySelectorAll("a").forEach((a) => {
//     a.setAttribute("target", "_blank");
//     a.setAttribute("rel", "noopener noreferrer");
//   });

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

export const validate_url_secure = (url: string) =>{
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

export function stripHtml(htmlString:string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent || "";
}