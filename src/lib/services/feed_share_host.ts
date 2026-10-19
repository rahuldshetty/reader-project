import type { DataConnection, Peer } from "peerjs";
import {
    SHARE_ICE_SERVERS,
    SHARE_TRANSFER_TTL_MS,
    SHARE_WAIT_TTL_MS,
    format_share_token,
    pack_share_payload,
    share_log,
    unpack_share_message,
    type ShareClientInfo,
    type SharePayload,
} from "$lib/services/feed_share";

export type ShareHostState =
    | { status: "starting" }
    | { status: "waiting"; token: string; expires_at: number }
    | { status: "connected"; client: ShareClientInfo; feed_count: number }
    | { status: "sending"; client: ShareClientInfo; feed_count: number }
    | { status: "done" }
    | { status: "stopped"; reason: "expired" | "cancelled" }
    | { status: "error"; message: string };

export interface ShareHostHandle {
    stop: (reason?: "expired" | "cancelled") => void;
}

const MAX_REJECTED_ATTEMPTS = 5;
const PEER_OPEN_TIMEOUT_MS = 20_000;
const HELLO_TIMEOUT_MS = 15_000;

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

const peer_error_type = (error: unknown): string | undefined => {
    if (typeof error !== "object" || error === null) return undefined;
    if (!("type" in error)) return undefined;
    return typeof error.type === "string" ? error.type : undefined;
};

/**
 * Hosts a one-shot feed transfer. Emits the QR token as soon as the signalling
 * peer is open, tears itself down when the TTL expires, and closes both the
 * data connection and the signalling peer after the phone acknowledges.
 */
export const start_share_host = (
    payload: SharePayload,
    secret: string,
    on_state: (state: ShareHostState) => void,
): ShareHostHandle => {
    let peer: Peer | null = null;
    let connection: DataConnection | null = null;
    let stopped = false;
    let connected = false;
    let rejected_attempts = 0;
    let wait_timer: number | undefined;
    let hello_timer: number | undefined;
    let ack_timer: number | undefined;
    let open_timer: number | undefined;
    const expires_at = Date.now() + SHARE_WAIT_TTL_MS;

    const clear_timers = () => {
        clearTimeout(wait_timer);
        clearTimeout(hello_timer);
        clearTimeout(ack_timer);
        clearTimeout(open_timer);
        wait_timer = undefined;
        hello_timer = undefined;
        ack_timer = undefined;
        open_timer = undefined;
    };

    const teardown = () => {
        clear_timers();
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

    const finish = (state: ShareHostState) => {
        if (stopped) return;
        stopped = true;
        if (state.status === "error") {
            share_log("error", `host failed: ${state.message}`);
        } else if (state.status === "stopped") {
            share_log("info", `host stopped: ${state.reason}`);
        } else {
            share_log("info", `host finished: ${state.status}`);
        }
        teardown();
        on_state(state);
    };

    const stop = (reason: "expired" | "cancelled" = "cancelled") => {
        if (stopped) return;
        if (connected && reason === "cancelled") {
            // The phone already has (or is receiving) the data; report a clean
            // completion rather than an error to the user.
            finish({ status: "done" });
            return;
        }
        finish({ status: "stopped", reason });
    };

    const handle_data = async (data: unknown) => {
        if (stopped) return;
        const bytes = await to_bytes(data);
        if (!bytes || stopped) return;

        let message;
        try {
            message = await unpack_share_message(bytes, secret);
        } catch (error) {
            rejected_attempts++;
            if (!connected) {
                try {
                    connection?.close();
                } catch {
                    // already gone
                }
                connection = null;
            }
            if (rejected_attempts >= MAX_REJECTED_ATTEMPTS) {
                finish({
                    status: "error",
                    message:
                        error instanceof Error ? error.message : "bad-message",
                });
            }
            return;
        }

        if (message.t === "hello") {
            if (connected) return;
            connected = true;
            share_log(
                "info",
                `host hello from ${message.client.platform}, ${payload.feeds.length} feeds`,
            );
            clearTimeout(wait_timer);
            clearTimeout(hello_timer);
            wait_timer = undefined;
            hello_timer = undefined;

            on_state({
                status: "connected",
                client: message.client,
                feed_count: payload.feeds.length,
            });
            on_state({
                status: "sending",
                client: message.client,
                feed_count: payload.feeds.length,
            });

            try {
                const envelope = await pack_share_payload(payload, secret);
                if (stopped || !connection) return;
                connection.send(envelope);
                share_log(
                    "info",
                    `host payload sent: ${envelope.length} bytes`,
                );
                ack_timer = window.setTimeout(
                    () => finish({ status: "done" }),
                    SHARE_TRANSFER_TTL_MS,
                );
            } catch (error) {
                finish({
                    status: "error",
                    message:
                        error instanceof Error ? error.message : "send-failed",
                });
            }
            return;
        }

        if (message.t === "ack") {
            share_log("info", "host ack received");
            finish({ status: "done" });
        }
    };

    const accept_connection = (incoming: DataConnection) => {
        if (stopped) return;
        if (connected && connection) {
            // Only one receiver per session.
            try {
                incoming.close();
            } catch {
                // already gone
            }
            return;
        }
        if (rejected_attempts >= MAX_REJECTED_ATTEMPTS) {
            finish({ status: "error", message: "too-many-attempts" });
            return;
        }

        // Replace a previous connection that never proved it knew the key.
        if (connection && connection !== incoming) {
            try {
                connection.close();
            } catch {
                // already gone
            }
        }
        connection = incoming;
        share_log("info", "host data connection opened");

        incoming.on("iceStateChanged", (state) => {
            share_log("info", `host ice: ${state}`);
        });

        clearTimeout(hello_timer);
        hello_timer = window.setTimeout(() => {
            if (stopped || connected) return;
            try {
                incoming.close();
            } catch {
                // already gone
            }
            if (connection === incoming) connection = null;
        }, HELLO_TIMEOUT_MS);

        incoming.on("data", (data) => {
            void handle_data(data);
        });

        incoming.on("close", () => {
            if (connection === incoming) connection = null;
            // The receiver closes right after acknowledging (or after giving
            // up); either way there is nothing left to send.
            if (connected && !stopped) finish({ status: "done" });
        });

        incoming.on("error", () => {
            // Errors surface through `close`; nothing to do here.
        });
    };

    const open_peer = async (attempt = 0): Promise<void> => {
        if (stopped) return;
        let peer_module;
        try {
            peer_module = await import("peerjs");
        } catch (error) {
            finish({
                status: "error",
                message: error instanceof Error ? error.message : String(error),
            });
            return;
        }
        if (stopped) return;

        const current = new peer_module.Peer({
            config: { iceServers: SHARE_ICE_SERVERS },
        });
        peer = current;
        let opened = false;

        open_timer = window.setTimeout(() => {
            if (opened || stopped) return;
            finish({
                status: "error",
                message: "Signaling server unreachable",
            });
        }, PEER_OPEN_TIMEOUT_MS);

        current.on("open", (id) => {
            if (stopped || current !== peer) return;
            opened = true;
            clearTimeout(open_timer);
            open_timer = undefined;
            share_log("info", `host signalling open: ${id}`);
            on_state({
                status: "waiting",
                token: format_share_token(id, secret),
                expires_at,
            });
            wait_timer = window.setTimeout(
                () => stop("expired"),
                SHARE_WAIT_TTL_MS,
            );
        });

        current.on("connection", (incoming) => {
            accept_connection(incoming);
        });

        current.on("error", (error) => {
            if (stopped || current !== peer) return;
            clearTimeout(open_timer);
            open_timer = undefined;
            const type = peer_error_type(error);
            share_log(
                "error",
                `host peer error: ${type ?? error.message ?? "unknown"}`,
            );
            if (type === "unavailable-id" && attempt < 2) {
                try {
                    current.destroy();
                } catch {
                    // already gone
                }
                peer = null;
                void open_peer(attempt + 1);
                return;
            }
            finish({
                status: "error",
                message: type || error.message || "peer-error",
            });
        });
    };

    void open_peer();

    return {
        stop,
    };
};
