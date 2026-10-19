import type { DataConnection, Peer } from "peerjs";
import {
    SHARE_ICE_SERVERS,
    SHARE_TRANSFER_TTL_MS,
    ShareError,
    pack_share_message,
    share_log,
    unpack_share_payload,
    type SharePayload,
    type ShareToken,
} from "$lib/services/feed_share";

export type ShareClientState =
    | { status: "connecting" }
    | { status: "connected" }
    | { status: "receiving" }
    | { status: "done" };

export interface ReceiveShareOptions {
    on_state?: (state: ShareClientState) => void;
    signal?: AbortSignal;
}

interface PayloadWaiter {
    promise: Promise<SharePayload>;
    resolve: (payload: SharePayload) => void;
    reject: (reason?: unknown) => void;
}

const PEER_OPEN_TIMEOUT_MS = 20_000;
const CONNECT_TIMEOUT_MS = 20_000;

const detect_platform = (): "android" | "ios" | "desktop" => {
    const agent = navigator.userAgent;
    if (/android/i.test(agent)) return "android";
    if (/iphone|ipad|ipod/i.test(agent)) return "ios";
    return "desktop";
};

const peer_error_type = (error: unknown): string | undefined => {
    if (typeof error !== "object" || error === null) return undefined;
    if (!("type" in error)) return undefined;
    return typeof error.type === "string" ? error.type : undefined;
};

const map_peer_error = (error: unknown): ShareError => {
    const type = peer_error_type(error);
    switch (type) {
        case "peer-unavailable":
            return new ShareError(
                "peer-unavailable",
                "The sharing device is no longer available",
            );
        case "browser-incompatible":
            return new ShareError("peer", "WebRTC is unavailable");
        case "network":
        case "server-error":
        case "socket-error":
        case "socket-closed":
            return new ShareError(
                "network",
                "Unable to reach the signaling server",
            );
        case "webrtc":
            return new ShareError(
                "network",
                "Could not establish a direct connection",
            );
        default:
            return new ShareError(
                "peer",
                error instanceof Error ? error.message : "Connection failed",
            );
    }
};

const to_bytes = async (data: unknown): Promise<Uint8Array | null> => {
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
    if (typeof Blob !== "undefined" && data instanceof Blob) {
        return new Uint8Array(await data.arrayBuffer());
    }
    return null;
};

/**
 * Joins a host session, authenticates with the QR secret and returns the
 * decrypted feed payload. The data connection and signalling peer are closed
 * before the promise resolves, so the host sees the transfer finish.
 */
export const receive_share = async (
    token: ShareToken,
    options: ReceiveShareOptions = {},
): Promise<SharePayload> => {
    const { on_state, signal } = options;
    let peer: Peer | null = null;
    let connection: DataConnection | null = null;
    let settled = false;
    let connect_timer: number | undefined;
    let receive_timer: number | undefined;
    let payload_waiter: PayloadWaiter | null = null;

    const cleanup = () => {
        clearTimeout(connect_timer);
        clearTimeout(receive_timer);
        connect_timer = undefined;
        receive_timer = undefined;
        try {
            connection?.close();
        } catch {
            // already gone
        }
        try {
            peer?.destroy();
        } catch {
            // already gone
        }
        connection = null;
        peer = null;
    };

    const { promise, resolve, reject } =
        Promise.withResolvers<SharePayload>();

    const fail = (error: unknown) => {
        if (settled) return;
        settled = true;
        const mapped =
            error instanceof ShareError ? error : map_peer_error(error);
        share_log("error", `client failed: ${mapped.code}: ${mapped.message}`);
        payload_waiter?.reject(mapped);
        payload_waiter = null;
        cleanup();
        reject(mapped);
    };

    const succeed = (payload: SharePayload) => {
        if (settled) return;
        settled = true;
        share_log("info", `client received ${payload.feeds.length} feeds`);
        on_state?.({ status: "done" });
        cleanup();
        resolve(payload);
    };

    const abort_error = () => new ShareError("cancelled", "Transfer cancelled");
    const abort_handler = () => fail(abort_error());

    if (signal) {
        if (signal.aborted) {
            fail(abort_error());
            return await promise;
        }
        signal.addEventListener("abort", abort_handler, { once: true });
    }

    const run = async () => {
        let peer_module;
        try {
            peer_module = await import("peerjs");
        } catch (error) {
            fail(error);
            return;
        }
        if (settled) return;

        on_state?.({ status: "connecting" });
        const current = new peer_module.Peer({
            config: { iceServers: SHARE_ICE_SERVERS },
        });
        peer = current;

        current.on("error", (error) => {
            if (current !== peer) return;
            share_log(
                "error",
                `client peer error: ${peer_error_type(error) ?? error.message}`,
            );
            fail(map_peer_error(error));
        });

        const opened = Promise.withResolvers<void>();
        connect_timer = window.setTimeout(
            () =>
                opened.reject(
                    new ShareError(
                        "network",
                        "Signaling server unreachable",
                    ),
                ),
            PEER_OPEN_TIMEOUT_MS,
        );
        current.on("open", () => {
            clearTimeout(connect_timer);
            connect_timer = undefined;
            share_log("info", "client signalling open");
            opened.resolve();
        });
        await opened.promise;

        if (settled) return;

        const conn = current.connect(token.peerId, { reliable: true });
        connection = conn;
        share_log("info", `client dialing ${token.peerId}`);
        conn.on("iceStateChanged", (state) => {
            share_log("info", `client ice: ${state}`);
        });

        const waiter = Promise.withResolvers<SharePayload>();
        payload_waiter = waiter;

        conn.on("data", async (data) => {
            const bytes = await to_bytes(data);
            if (!bytes) return;
            try {
                const payload = await unpack_share_payload(
                    bytes,
                    token.secret,
                );
                share_log(
                    "info",
                    `client payload received: ${bytes.length} bytes`,
                );
                waiter.resolve(payload);
            } catch {
                // Ignore non-payload frames; the host only sends one payload
                // and closes afterwards.
            }
        });
        conn.on("error", (error) => {
            share_log(
                "error",
                `client data error: ${peer_error_type(error) ?? String(error)}`,
            );
            waiter.reject(error);
        });
        conn.on("close", () =>
            waiter.reject(
                new ShareError(
                    "network",
                    "Connection closed before transfer finished",
                ),
            ),
        );

        const connected = Promise.withResolvers<void>();
        connect_timer = window.setTimeout(
            () =>
                connected.reject(
                    new ShareError("network", "Direct connection timed out"),
                ),
            CONNECT_TIMEOUT_MS,
        );
        conn.on("open", () => {
            clearTimeout(connect_timer);
            connect_timer = undefined;
            share_log("info", "client data connection opened");
            connected.resolve();
        });
        await connected.promise;

        if (settled) return;

        on_state?.({ status: "connected" });
        conn.send(
            await pack_share_message(
                {
                    t: "hello",
                    client: { platform: detect_platform() },
                },
                token.secret,
            ),
        );
        on_state?.({ status: "receiving" });

        receive_timer = window.setTimeout(
            () => fail(new ShareError("timeout", "Transfer timed out")),
            SHARE_TRANSFER_TTL_MS,
        );

        const payload = await waiter.promise;
        if (settled) return;

        clearTimeout(receive_timer);
        receive_timer = undefined;
        payload_waiter = null;

        conn.send(await pack_share_message({ t: "ack" }, token.secret));
        // Give the reliable channel a moment to flush the acknowledgement
        // before closing, so the host leaves its "sending" state promptly.
        const flushed = Promise.withResolvers<void>();
        window.setTimeout(flushed.resolve, 250);
        await flushed.promise;

        signal?.removeEventListener("abort", abort_handler);
        succeed(payload);
    };

    void run().catch((error) => {
        signal?.removeEventListener("abort", abort_handler);
        fail(error);
    });

    return await promise;
};
