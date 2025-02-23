import { pipeline, TextStreamer } from '@huggingface/transformers';

class SummarizationPipeline {
  static task = 'summarization';
  static model = 'Xenova/distilbart-cnn-6-6';
  static instance = null;

  static async getInstance(progress_callback = null) {
    this.instance ??= pipeline(this.task, this.model, { progress_callback });
    return this.instance;
  }
}

export const summarize = async (text:string) => {
    const summarizer = await SummarizationPipeline.getInstance();
    const output = await summarizer(text, {
        max_new_tokens: 64,
    });
    console.log(output);
    return output[0].summary_text;
}
