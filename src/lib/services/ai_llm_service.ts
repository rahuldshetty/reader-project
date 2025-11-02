import { local_user_setting } from "$lib/stores/app_store";
import { extractTextFromHtml } from "$lib/utils/html";
import { ai, ax } from "@ax-llm/ax";
import { get } from "svelte/store";

const MIN_CONTENT_LEN = 150;
const MAX_POINTS = 3;

export const summarize_content = async (
    title: string,
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

    const relevantProcessor = ax(
        'documentText:string -> isUserContent:boolean "Is the given document text contains post related to user and not a generic message from a website"'
    )

    const documentProcessor = ax(
        'titleText:string, documentText:string -> keyPoints:string[] "3 summary points, less than 250 characters"'
    );

    const check_relevany_result = await relevantProcessor.forward(
        llm, {
        documentText: clean_text,
    }, {
        model: model,
        stream: false
    });
    if(check_relevany_result.isUserContent){
        const result = await documentProcessor.forward(llm, {
            titleText: title,
            documentText: clean_text,
        }, {
            model: model,
            stream: false
        });

        return result.keyPoints.slice(0, MAX_POINTS);
    } else {
        return [];
    }
}
