import { ShareError } from "$lib/services/feed_share";

type ReaderModule = typeof import("zxing-wasm/reader");

interface LoadedReader {
    readBarcodes: ReaderModule["readBarcodes"];
}

const MAX_IMAGE_EDGE = 1600;
const CAMERA_MAX_EDGE = 800;
const CAMERA_SCAN_INTERVAL_MS = 120;

let reader_promise: Promise<LoadedReader> | null = null;

const load_reader = (): Promise<LoadedReader> => {
    // zxing ships a ~1 MiB wasm blob; load it the first time the user opens
    // the scanner instead of putting it in the main bundle.
    reader_promise ??= (async () => {
        const [module, wasm] = await Promise.all([
            import("zxing-wasm/reader"),
            import("zxing-wasm/reader/zxing_reader.wasm?url"),
        ]);
        await module.prepareZXingModule({
            overrides: {
                locateFile: (path: string) =>
                    path.endsWith(".wasm") ? wasm.default : path,
            },
            fireImmediately: true,
        });
        return { readBarcodes: module.readBarcodes };
    })();
    return reader_promise;
};

const decode = async (
    readBarcodes: ReaderModule["readBarcodes"],
    image: ImageData,
): Promise<string | null> => {
    const results = await readBarcodes(image, {
        formats: ["QRCode"],
        tryHarder: true,
        tryRotate: true,
    });
    const text = results[0]?.text?.trim();
    return text ? text : null;
};

const read_image_data = async (
    source: ImageBitmap | HTMLVideoElement,
    max_edge: number,
): Promise<ImageData | null> => {
    const width =
        source instanceof HTMLVideoElement ? source.videoWidth : source.width;
    const height =
        source instanceof HTMLVideoElement ? source.videoHeight : source.height;
    if (!width || !height) return null;

    const scale = Math.min(1, max_edge / Math.max(width, height));
    const target_width = Math.max(1, Math.round(width * scale));
    const target_height = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = target_width;
    canvas.height = target_height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;
    context.drawImage(source, 0, 0, target_width, target_height);
    return context.getImageData(0, 0, target_width, target_height);
};

/**
 * Decodes a QR code from a picked image. Throws a ShareError when no readable
 * code is present so the UI can offer a retry instead of silently failing.
 */
export const read_qr_from_file = async (file: Blob): Promise<string> => {
    const { readBarcodes } = await load_reader();
    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file, {
            imageOrientation: "from-image",
        });
    } catch {
        throw new ShareError("invalid-token", "Unable to read image");
    }
    try {
        const image = await read_image_data(bitmap, MAX_IMAGE_EDGE);
        if (!image) {
            throw new ShareError("invalid-token", "Unable to read image");
        }
        const text = await decode(readBarcodes, image);
        if (!text) {
            throw new ShareError("invalid-token", "No QR code found");
        }
        return text;
    } finally {
        bitmap.close();
    }
};

export interface CameraQrScanner {
    stop: () => void;
}

export const is_camera_available = (): boolean =>
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function";

/**
 * Streams the rear camera into `video` and scans frames for a QR code. The
 * returned handle is idempotent; always call it when leaving the screen.
 */
export const start_camera_qr_scanner = async (
    video: HTMLVideoElement,
    on_result: (text: string) => void,
): Promise<CameraQrScanner> => {
    const { readBarcodes } = await load_reader();

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
        },
    });

    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();

    let stopped = false;
    let timer: number | undefined;
    let decoding = false;

    const stop = () => {
        if (stopped) return;
        stopped = true;
        clearTimeout(timer);
        timer = undefined;
        for (const track of stream.getTracks()) {
            track.stop();
        }
        if (video.srcObject === stream) {
            video.srcObject = null;
        }
    };

    const tick = async () => {
        if (stopped) return;
        timer = window.setTimeout(() => void tick(), CAMERA_SCAN_INTERVAL_MS);
        if (decoding || video.readyState < 2 || !video.videoWidth) return;

        decoding = true;
        try {
            const image = await read_image_data(video, CAMERA_MAX_EDGE);
            if (!image) return;
            const text = await decode(readBarcodes, image);
            if (text && !stopped) {
                stop();
                on_result(text);
            }
        } catch {
            // A single bad frame should not abort the camera session.
        } finally {
            decoding = false;
        }
    };

    void tick();

    return { stop };
};
