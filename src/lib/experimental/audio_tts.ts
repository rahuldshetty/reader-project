// https://github.com/hexgrad/kokoro/tree/main/kokoro.js
export const ttsWorker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
});
