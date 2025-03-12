import { fetch } from '@tauri-apps/plugin-http';
import { Command } from '@tauri-apps/plugin-shell';
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { parseHTML } from 'linkedom';
import { runWithTimeout } from '$lib/utils';

export interface ParsedResult {
    title: string,
    content: string,
    word_count: number,
    url: string,
    image: string,
}

const runSideCar = async (url:string) => {
    const command = Command.sidecar('binaries/app', ["parse", url]);
    const output = await command.execute();
    const response = JSON.parse(output.stdout);
    console.log("Found response from sidecar!")
    return response;
}

const fetch_web_content = async (url: string) => {
    try{
        const response = await fetch(url);
        const text = await response.text();
        return text;
    } catch(err){
        console.log("ERROR: " + err.toString());
        return "";
    }
};

export const mercury_parser = async (url: string) => {
    console.log(`Parsing with mercury: ${url}`);
    try {
        const document = await runWithTimeout(runSideCar(url));
        return {
            title: document.title,
            content: document.content,
            word_count: document.word_count,
            url: url,
            image: document.lead_image_url
        };
    } catch (error) {
        console.log(`Parse FAILED for ${url}: ${error}`)
    }
    return {
        title: '',
        content: '',
        word_count: 0,
        url: url,
        image: ''
    };
}


export const morzilla_readability_parser = async (url: string, document: Document) => {
    console.log(`Parsing with morzilla_readability: ${url}`);

    let reader = new Readability(document);

    try{
        const article = reader.parse();
        return {
            title: article.excerpt,
            content: article.content,
            word_count: article.length,
            url: url,
            image: ""
        };
    } catch(error){
        console.log(`Parse FAILED for ${url}: ${error}`);
        throw error;
    }
}

export const hybrid_parser = async (url: string) => {
    try{
        const html: string = await fetch_web_content(url);

        const { document } = parseHTML(html,{
            // Based on test
            // https://github.com/WebReflection/linkedom/blob/63c22fb48cea1179b7fdc9bcffe84d824c3bca04/test/html/document.js#L75
            href: url
        });

        if(isProbablyReaderable(document, {
            minScore: 80
        })){
            return morzilla_readability_parser(url, document);
        } else {
            throw new Error("Not enough content with Readability");
        }
    } catch(error){
        return mercury_parser(url);
    }
}
