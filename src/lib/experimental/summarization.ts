import { stripHtml } from '$lib/utils/html';
import { pipeline, TextStreamer } from '@huggingface/transformers';

class SummarizationPipeline {
  static model = 'Xenova/distilbart-cnn-6-6';
  static instance = null;

  static async getInstance() {
    this.instance ??= pipeline('summarization', this.model);
    return this.instance;
  }
}

const MAX_SUMMARY_INPUT_TEXT = 512;
const MAX_NEW_TOKENS = 128;

function chunkText(text: string, chunkSize = 512) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export const summarize = async (text:string) : Promise<string[]> => {
    const summarizer = await SummarizationPipeline.getInstance();
    const chunks = chunkText(text, MAX_SUMMARY_INPUT_TEXT);
    const summaries: string[] = [];

    for (const chunk of chunks) {
      const result = await summarizer(stripHtml(chunk), {
          max_new_tokens: MAX_NEW_TOKENS,
      });
      summaries.push(result[0].summary_text);
    }

    return summaries;
}

