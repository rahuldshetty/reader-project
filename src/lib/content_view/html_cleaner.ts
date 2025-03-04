const mergeURLs = (baseUrl:string, src:string) => {
    if (!baseUrl) return src;

    for (let i = 0; i < baseUrl.length; i++) {
      if (src.startsWith(baseUrl.slice(i))) {
        return baseUrl + src.slice(baseUrl.slice(i).length);
      }
    }
    return baseUrl + src;
};

export const add_missing_src = (html:string, url:string="") => {
    const fallbackText = "Unable to load image!"

    // Match all img tags and update src if necessary
    html = html.replace(/<img\s+([^>]*?)src=["'](?!https?:\/\/)([^"']+?)["']([^>]*?)>/gi, (match, before, src, after) => {
        const newSrc = mergeURLs(url, src);
        return `<img ${before}src="${newSrc}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" ${after}>
        <span style="display:none;">${fallbackText}</span>`;
    });

    html = html.replace(/<audio\s+([^>]*?)src=["'](?!https?:\/\/)([^"']+?)["']([^>]*?)>/gi, (match, before, src, after) => {
        const newSrc = mergeURLs(url, src);
        return `<audio ${before}src="${newSrc}"${after}>`;
    });

    html = html.replace(/<video\s+([^>]*?)src=["'](?!https?:\/\/)([^"']+?)["']([^>]*?)>/gi, (match, before, src, after) => {
        const newSrc = mergeURLs(url, src);
        return `<video ${before}src="${newSrc}"${after}>`;
    });

    return html;
}

export const cleanHTML = (html:string, url:string="")=>{
    // Remove all class attributes
    let cleanedHtml = html.replace(/\s*class="[^"]*"/g, '');

    // Add missing src to img and similar tags
    cleanedHtml = add_missing_src(html, url);
    
    return cleanedHtml;
}