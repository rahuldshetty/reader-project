import { fetch } from '@tauri-apps/plugin-http';
import { Command } from '@tauri-apps/plugin-shell';
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { parseHTML } from 'linkedom';
import { runWithTimeout } from '$lib/utils/time';
import { CONTENT_TYPES } from '$lib/constants';
import type { ContentResult } from '$lib/types';

const runSideCar = async (url:string) => {
    const command = Command.sidecar('binaries/app', ["parse", url]);
    const output = await command.execute();
    const response = JSON.parse(output.stdout);
    return response;
}

export const mercury_parser = async (url: string) :Promise<ContentResult> => {
    console.log(`Parsing with mercury: ${url}`);
    if(url){
        try {
            const document = await runWithTimeout(runSideCar(url));
            return {
                title: document.title,
                content: document.content,
                word_count: document.word_count,
                url: url,
                image: document.lead_image_url,
                content_type: CONTENT_TYPES.html,
            };
        } catch (error) {
            console.log(`Parse FAILED for ${url}: ${error}`);
            throw new Error('Something happened :(');
        }
    }
    return {
        title: '',
        content: '',
        word_count: 0,
        url: url,
        image: '',
        content_type: CONTENT_TYPES.none,
    };
}

export const morzilla_readability_parser = async (url: string, document: Document) :Promise<ContentResult> => {
    console.log(`Parsing with morzilla reader: ${url}`);

    let reader = new Readability(document);

    try{
        const article = reader.parse();
        if(article)
            return {
                title: article.excerpt,
                content: article.content,
                word_count: article.length,
                url: url,
                image: "",
                content_type: CONTENT_TYPES.html,
            };
    } catch(error){
        console.log(`Parse FAILED for ${url}: ${error}`);
        throw error;
    }

    throw Error("Unable to parse webpage :(");
}

export const hybrid_parser = async (url: string) :Promise<ContentResult> => {
    if(!url){
        return {
            title: '',
            content: '',
            word_count: 0,
            url: url,
            image: '',
            content_type: CONTENT_TYPES.none,
        };
    }
    try{
        const web_response = await fetch(url);

        if(web_response?.headers.get('Content-Type') == 'application/pdf'){
            return {
                title: `PDF (${url.split('/').pop()})`,
                content: await web_response.arrayBuffer(),
                word_count: 0,
                url: url,
                image: "",
                content_type: CONTENT_TYPES.pdf,
            };
        }

        const html: string = await web_response.text();;
        
        // Based on test
        // https://github.com/WebReflection/linkedom/blob/63c22fb48cea1179b7fdc9bcffe84d824c3bca04/test/html/document.js#L75
        const location = {href: url};
        const { document } = parseHTML(html, {location});

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
