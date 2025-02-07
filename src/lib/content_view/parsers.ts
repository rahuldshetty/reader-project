import { Command } from '@tauri-apps/plugin-shell';
import { Readability } from "@mozilla/readability";
import { parseHTML } from 'linkedom';

export interface ParsedResult {
    title: string,
    content: string,
    word_count: number,
    url: string,
    image: string,
}

interface ContentParser {
  (url: string, html: string): Promise<ParsedResult | null>;
}

const runSideCar = async (url:string) => {
    const command = Command.sidecar('binaries/app', ["parse", url]);
    const output = await command.execute();
    console.log(output);

    const response = JSON.parse(output.stdout);
    console.log("Found response from sidecar:")
    console.log(response)
    return response;
}

export const mercury_parser:ContentParser = async (url: string, html: string) => {
    console.log("Trying to parse with mercury...");
    try {
        const document = await runSideCar(url);
        return {
            title: document.title,
            content: document.content,
            word_count: document.word_count,
            url: url,
            image: document.lead_image_url
        };
    } catch (error) {
        console.log("Parse FAILED")
        console.log(error)
        console.error(JSON.stringify(error));
    }
    return null;
}


export const morzilla_readability_parser:ContentParser = async (url: string, html: string) => {
    console.log("Trying to parse with morzilla_readability...");

    const { document } = parseHTML(html,{
        // Based on test
        // https://github.com/WebReflection/linkedom/blob/63c22fb48cea1179b7fdc9bcffe84d824c3bca04/test/html/document.js#L75
        href: url
    });

    let reader = new Readability(document);

    const article = reader.parse();
    if(article){
        console.log("Parsed Result:");
        console.log(JSON.stringify(article));
    
        return {
            title: article.excerpt,
            content: article.content,
            word_count: article.length,
            url: url,
            image: ""
        };
    } else{
        return null;
    }
   
}

