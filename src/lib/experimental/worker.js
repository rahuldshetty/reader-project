import { KokoroTTS } from "kokoro-js";

// Device detection
const device =  "wasm";
self.postMessage({ status: "device", device });

// Load the model
const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";

const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: "q8", // // Options: "fp32", "fp16", "q8", "q4", "q4f16"
  device,  // Options: "wasm", "webgpu" (web) or "cpu" (node). If using "webgpu", we recommend using dtype="fp32".
}).catch((e) => {
  self.postMessage({ status: "error", error: e.message });
  throw e;
});

self.postMessage({ status: "ready", voices: tts.voices, device });

// Listen for messages from the main thread
self.addEventListener("message", async (e) => {
  const { text, voice } = e.data;

  // Generate speech
  const audio = await tts.generate(text, { voice });

  // Send the audio file back to the main thread
  const blob = audio.toBlob();
  self.postMessage({ status: "complete", audio: URL.createObjectURL(blob), text });
});
