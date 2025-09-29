import { local_user_setting } from "$lib/stores/app_store";
import { extractTextFromHtml } from "$lib/utils/html";
import { ai, ax } from "@ax-llm/ax";
import { get } from "svelte/store";

const MIN_CONTENT_LEN = 100;

export const summarize_content = async (
    text: string,
) => {
    // Load openai endpoint
    const model = get(local_user_setting).OPENAI_MODEL;
    const apiKey = get(local_user_setting).OPENAI_TOKEN;
    const baseURL = get(local_user_setting).OPENAI_URL;

    if(model == '' || apiKey == '' || baseURL == ''){
        return [];
    }

    // Pre-process text
    let clean_text = extractTextFromHtml(text);

    if(clean_text.length < MIN_CONTENT_LEN){
        return [];
    }

    const llm = ai({ 
        name: "openai",
        apiKey: apiKey,
        apiURL: baseURL,
    });

    const documentProcessor = ax(
        'documentText:string -> keyPoints:string[] "main points"'
    );

    documentProcessor.addAssert(({keyPoints})=>{
        if(keyPoints.length == 3){
            return true;
        } 
        return `keyPoints should contain 3 elements.`
    });

    const result = await documentProcessor.forward(llm, {
        documentText: clean_text,
    }, {
        model: model,
        stream: false
    });

    return result.keyPoints;
}