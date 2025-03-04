export const add_missing_src = (html:string, url:string="") => {
    // Match all img tags and update src if necessary
    html = html.replace(/<img\s+([^>]*?)src=["'](?!https?:\/\/)([^"']+?)["']([^>]*?)>/gi, (match, before, src, after) => {
        return `<img ${before}src="${url}${src}"${after}>`;
    });

    html = html.replace(/<audio\s+([^>]*?)src=["'](?!https?:\/\/)([^"']+?)["']([^>]*?)>/gi, (match, before, src, after) => {
        return `<audio ${before}src="${url}${src}"${after}>`;
    });

    html = html.replace(/<video\s+([^>]*?)src=["'](?!https?:\/\/)([^"']+?)["']([^>]*?)>/gi, (match, before, src, after) => {
        return `<video ${before}src="${url}${src}"${after}>`;
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