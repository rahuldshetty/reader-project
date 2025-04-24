import { invoke } from "@tauri-apps/api/core";

// Languages taken from https://libretranslate.com/languages
// TODO: Read the languages from URL
export const LIB_TRANSLATE_TARGETS = [
    {
        "name": "Arabic",
        "code": "ar"
    },
    {
        "name": "Chinese",
        "code": "zh"
    },
    {
        "name": "Chinese (traditional)",
        "code": "zh-TW"
    },
    {
        "name": "French",
        "code": "fr"
    },
    {
        "name": "German",
        "code": "de"
    },
    {
        "name": "Hindi",
        "code": "hi"
    },
    {
        "name": "Italian",
        "code": "it"
    },
    {
        "name": "Japanese",
        "code": "ja"
    },
    {
        "name": "Russian",
        "code": "ru"
    },
    {
        "name": "Spanish",
        "code": "es"
    },
]


export async function translateHtml(htmlString: string, source: string, target: string) {
    // 1. Parse
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // 2. TreeWalker for text nodes
    const walker = doc.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT,
      null,
    );
    
    // 3. Collect text nodes
    const originals = [];
    const textNodes: string[] = [];
    let node;
    while ((node = walker.nextNode())) {
        const txt = node.textContent.trim();
        if (!txt) continue;
        originals.push(node);
        textNodes.push(txt);
    }
    
    if (textNodes.length === 0) {
      return htmlString; // no text to translate
    }

    const translations = await Promise.all(
        textNodes.map(txt => translate_text(txt, source, target))
    );
    
    // 4. Replace node content
    originals.forEach((node, i) => {
        node.textContent = translations[i];
    });

    // 6. Serialize back
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc.body);
}

export async function translate_text(text:string, source: string, target: string) {
    const result = await invoke('translate_text', { 
        text: text,
        targetLanguage: target,
    });
    return result;
}
