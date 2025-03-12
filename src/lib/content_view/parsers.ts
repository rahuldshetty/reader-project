import { fetch } from '@tauri-apps/plugin-http';
import { Command } from '@tauri-apps/plugin-shell';
import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { parseHTML } from 'linkedom';
import { runWithTimeout } from '$lib/utils';
import { pdfToHtmlString } from '$lib/content_view/contents/pdf_content/pdf_helper';
import { CONTENT_TYPES } from '$lib/constants';

const runSideCar = async (url:string) => {
    const command = Command.sidecar('binaries/app', ["parse", url]);
    const output = await command.execute();
    const response = JSON.parse(output.stdout);
    console.log("Found response from sidecar!")
    return response;
}

const fetch_web_response = async (url: string) => {
    try{
        const response = await fetch(url);
        return response;
    } catch(err){
        console.log("ERROR: " + err.toString());
        return null;
    }
};

const fetch_web_content = async (response) => {
    try{
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
            image: document.lead_image_url,
            content_type: CONTENT_TYPES.html,
        };
    } catch (error) {
        console.log(`Parse FAILED for ${url}: ${error}`)
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
            image: "",
            content_type: CONTENT_TYPES.html,
        };
    } catch(error){
        console.log(`Parse FAILED for ${url}: ${error}`);
        throw error;
    }
}

export const hybrid_parser = async (url: string) => {
    try{
        const web_response = await fetch_web_response(url);

        if(web_response?.headers.get('Content-Type') == 'application/pdf'){
            return {
                title: `PDF (${url.split('/').pop()})`,
                content: '',
                word_count: 0,
                url: url,
                image: "",
                content_type: CONTENT_TYPES.pdf,
            };
        }

        const html: string = await fetch_web_content(web_response);

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
