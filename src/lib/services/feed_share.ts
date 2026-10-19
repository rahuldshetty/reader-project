import type {
    FeedMetadata,
    FeedMetadataFolder,
    FeedResult,
} from "$lib/types";
import { FEED_TYPE } from "$lib/constants";

// Feed-share envelope shared by the QR handshake and the PeerJS transfer.
//
// The QR only carries the peer id and a random 128-bit secret. The secret is
// the AES-GCM key for the data channel payload, so the signalling server and
// any TURN relay only ever see ciphertext. Anyone who can read the QR code can
// receive the feeds - that is the trust boundary.

export const SHARE_PROTOCOL_VERSION = 1;
export const SHARE_TOKEN_PREFIX = "RDR1";
export const SHARE_MAX_FEEDS = 2000;
export const SHARE_MAX_FOLDERS = 100;
export const SHARE_MAX_TITLE_LENGTH = 300;
export const SHARE_MAX_URL_LENGTH = 2048;
export const SHARE_MAX_ENVELOPE_BYTES = 2 * 1024 * 1024;

// Host waits this long for a phone, then tears the session down on its own.
// Phone-side setup (unlock, app cold start, camera permission, scan) routinely
// takes longer than two minutes, and expiring mid-handshake looks like a
// network failure on the receiver.
export const SHARE_WAIT_TTL_MS = 300_000;
// A connected peer must finish the transfer within this window.
export const SHARE_TRANSFER_TTL_MS = 45_000;

const MAGIC = new Uint8Array([0x52, 0x44, 0x52, 0x53]); // "RDRS"
const ENVELOPE_VERSION = 1;
const FLAG_GZIP = 1;
const AES_IV_BYTES = 12;
const AES_KEY_BYTES = 16;
const AAD_PREFIX = "reader-share";

export type ShareErrorCode =
    | "invalid-token"
    | "invalid-payload"
    | "decrypt"
    | "version"
    | "no-feeds"
    | "peer-unavailable"
    | "timeout"
    | "network"
    | "peer"
    | "cancelled";

export class ShareError extends Error {
    code: ShareErrorCode;

    constructor(code: ShareErrorCode, message: string) {
        super(message);
        this.name = "ShareError";
        this.code = code;
    }
}

// PeerJS only ships one Google STUN server by default. Extra servers improve
// candidate gathering; a TURN relay is still required when both peers sit
// behind symmetric NAT, which PeerJS cannot traverse on its own.
export const SHARE_ICE_SERVERS: RTCIceServer[] = [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
    { urls: "stun:stun.cloudflare.com:3478" },
];

type ShareLogLevel = "info" | "warn" | "error";

/**
 * Mirrors share-session events into the app log. The connection can only fail
 * on the other device, so the local log is the only way to tell signalling
 * failures apart from ICE/NAT failures.
 */
export const share_log = (level: ShareLogLevel, message: string): void => {
    console[level](`[feed-share] ${message}`);
    // The plain web build has no Tauri host; tracing must never break sharing.
    void import("@tauri-apps/plugin-log")
        .then((logger) => logger[level](`[feed-share] ${message}`))
        .catch(() => {});
};

export interface SharedFeed {
    title: string;
    url: string;
    icon: string;
    // Index into `folders`, or -1 for a root-level feed.
    folder: number;
}

export interface SharePayload {
    v: typeof SHARE_PROTOCOL_VERSION;
    folders: string[];
    feeds: SharedFeed[];
}

export interface ShareToken {
    peerId: string;
    secret: string;
}

export interface ShareClientInfo {
    // Coarse platform label shown on the host while transferring.
    platform: "android" | "ios" | "desktop";
}

export type ShareMessage =
    | { t: "hello"; client: ShareClientInfo }
    | { t: "ack" };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/* -------------------------------------------------------------------------- */
/* Base64url                                                                  */
/* -------------------------------------------------------------------------- */

export const bytes_to_base64url = (bytes: Uint8Array): string => {
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
};

export const base64url_to_bytes = (value: string): Uint8Array => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
        normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

/* -------------------------------------------------------------------------- */
/* Token                                                                      */
/* -------------------------------------------------------------------------- */

export const generate_share_secret = (): string => {
    const bytes = crypto.getRandomValues(new Uint8Array(AES_KEY_BYTES));
    return bytes_to_base64url(bytes);
};

export const format_share_token = (peer_id: string, secret: string): string =>
    `${SHARE_TOKEN_PREFIX}:P:${peer_id}:${secret}`;

export const parse_share_token = (text: string): ShareToken | null => {
    const match = text
        .trim()
        .match(
            /^RDR1:P:([A-Za-z0-9][A-Za-z0-9_-]{0,63}):([A-Za-z0-9_-]{16,64})$/,
        );
    if (!match) return null;
    return { peerId: match[1], secret: match[2] };
};

/* -------------------------------------------------------------------------- */
/* Envelope                                                                   */
/* -------------------------------------------------------------------------- */

const import_key = (secret: string) => {
    const bytes = base64url_to_bytes(secret);
    if (bytes.length !== AES_KEY_BYTES) {
        throw new ShareError("invalid-token", "Invalid share key");
    }
    return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, [
        "encrypt",
        "decrypt",
    ]);
};

const concat_bytes = (...parts: Uint8Array[]): Uint8Array => {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const part of parts) {
        out.set(part, offset);
        offset += part.length;
    }
    return out;
};

const envelope_header = (flags: number): Uint8Array =>
    new Uint8Array([...MAGIC, ENVELOPE_VERSION, flags]);

const envelope_aad = (flags: number): Uint8Array =>
    encoder.encode(
        `${AAD_PREFIX}:${SHARE_PROTOCOL_VERSION}:${MAGIC[0]}${MAGIC[1]}${MAGIC[2]}${MAGIC[3]}:${ENVELOPE_VERSION}:${flags}`,
    );

const encrypt_envelope = async (
    payload: Uint8Array,
    secret: string,
    flags: number,
): Promise<Uint8Array> => {
    const key = await import_key(secret);
    const iv = crypto.getRandomValues(new Uint8Array(AES_IV_BYTES));
    const ciphertext = new Uint8Array(
        await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv,
                additionalData: envelope_aad(flags),
            },
            key,
            payload,
        ),
    );
    return concat_bytes(envelope_header(flags), iv, ciphertext);
};

const decrypt_envelope = async (
    envelope: Uint8Array,
    secret: string,
): Promise<{ flags: number; payload: Uint8Array }> => {
    if (envelope.length < MAGIC.length + 2 + AES_IV_BYTES + 16) {
        throw new ShareError("decrypt", "Share message too short");
    }
    for (let i = 0; i < MAGIC.length; i++) {
        if (envelope[i] !== MAGIC[i]) {
            throw new ShareError("decrypt", "Not a feed-share message");
        }
    }
    const version = envelope[4];
    if (version !== ENVELOPE_VERSION) {
        throw new ShareError(
            "version",
            `Unsupported feed-share version ${version}`,
        );
    }
    const flags = envelope[5];
    const iv = envelope.slice(MAGIC.length + 2, MAGIC.length + 2 + AES_IV_BYTES);
    const ciphertext = envelope.slice(MAGIC.length + 2 + AES_IV_BYTES);
    const key = await import_key(secret);
    try {
        const payload = new Uint8Array(
            await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv,
                    additionalData: envelope_aad(flags),
                },
                key,
                ciphertext,
            ),
        );
        return { flags, payload };
    } catch {
        // Wrong key, tampered header or tampered ciphertext all fail here.
        throw new ShareError("decrypt", "Unable to decrypt share message");
    }
};

export const pack_share_message = async (
    message: ShareMessage,
    secret: string,
): Promise<Uint8Array> =>
    encrypt_envelope(encoder.encode(JSON.stringify(message)), secret, 0);

export const unpack_share_message = async (
    envelope: Uint8Array,
    secret: string,
): Promise<ShareMessage> => {
    const { flags, payload } = await decrypt_envelope(envelope, secret);
    if (flags !== 0) {
        throw new ShareError("version", "Unsupported message flags");
    }
    const parsed = JSON.parse(decoder.decode(payload)) as ShareMessage;
    if (parsed?.t !== "hello" && parsed?.t !== "ack") {
        throw new ShareError("invalid-payload", "Unknown share message");
    }
    if (parsed.t === "hello") {
        return {
            t: "hello",
            client: {
                platform:
                    parsed.client?.platform === "android" ||
                    parsed.client?.platform === "ios"
                        ? parsed.client.platform
                        : "desktop",
            },
        };
    }
    return parsed;
};

/* -------------------------------------------------------------------------- */
/* Payload                                                                    */
/* -------------------------------------------------------------------------- */

const gzip = async (input: Uint8Array): Promise<Uint8Array> => {
    const stream = new Blob([input as BlobPart])
        .stream()
        .pipeThrough(new CompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
};

const gunzip = async (input: Uint8Array): Promise<Uint8Array> => {
    const stream = new Blob([input as BlobPart])
        .stream()
        .pipeThrough(new DecompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
};

const is_http_url = (value: string): boolean => {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};

const to_shared_feed = (
    feed: {
        title: string;
        url: string;
        favicon: string | null;
    },
    folder: number,
): SharedFeed => ({
    title: (feed.title || feed.url).slice(0, SHARE_MAX_TITLE_LENGTH),
    url: feed.url,
    icon: (feed.favicon ?? "").slice(0, SHARE_MAX_URL_LENGTH),
    folder,
});

/**
 * Flattens the sidebar feed tree into a transferable payload: folder names are
 * referenced by index, feeds carry title/url/icon so the receiver can show a
 * populated preview without re-fetching every feed.
 */
export const build_share_payload = (feeds: FeedResult[]): SharePayload => {
    const folders = feeds.filter((feed) => feed.type === FEED_TYPE.FOLDER);
    const folder_names = folders
        .map((folder) => folder.title)
        .slice(0, SHARE_MAX_FOLDERS);
    const folder_index = new Map<number, number>();
    folders.slice(0, SHARE_MAX_FOLDERS).forEach((folder, index) => {
        folder_index.set(folder.id, index);
    });

    const out: SharedFeed[] = [];
    const seen = new Set<string>();

    const push = (feed: { title: string; url: string; favicon: string | null; id: number }, folder: number) => {
        if (out.length >= SHARE_MAX_FEEDS) return;
        if (!feed.url || !is_http_url(feed.url)) return;
        if (feed.url.length > SHARE_MAX_URL_LENGTH) return;
        if (seen.has(feed.url)) return;
        seen.add(feed.url);
        out.push(to_shared_feed(feed, folder));
    };

    for (const feed of feeds) {
        if (feed.type !== FEED_TYPE.FOLDER) {
            push(feed, -1);
        }
    }

    for (const folder of folders) {
        const index = folder_index.get(folder.id);
        if (index === undefined) continue;
        for (const child of folder.children ?? []) {
            push(child, index);
        }
    }

    if (out.length === 0) {
        throw new ShareError("no-feeds", "No shareable feeds");
    }

    return { v: SHARE_PROTOCOL_VERSION, folders: folder_names, feeds: out };
};

const assert_string = (
    value: unknown,
    max: number,
    label: string,
): string => {
    if (typeof value !== "string" || value.length > max) {
        throw new ShareError("invalid-payload", `Invalid ${label}`);
    }
    return value;
};

export const validate_share_payload = (value: unknown): SharePayload => {
    if (!value || typeof value !== "object") {
        throw new ShareError("invalid-payload", "Invalid share payload");
    }
    const candidate = value as Partial<SharePayload>;
    if (candidate.v !== SHARE_PROTOCOL_VERSION) {
        throw new ShareError(
            "version",
            `Unsupported payload version ${String(candidate.v)}`,
        );
    }
    if (
        !Array.isArray(candidate.folders) ||
        candidate.folders.length > SHARE_MAX_FOLDERS
    ) {
        throw new ShareError("invalid-payload", "Invalid folders");
    }
    const folders = candidate.folders.map((folder) =>
        assert_string(folder, SHARE_MAX_TITLE_LENGTH, "folder"),
    );

    if (
        !Array.isArray(candidate.feeds) ||
        candidate.feeds.length === 0 ||
        candidate.feeds.length > SHARE_MAX_FEEDS
    ) {
        throw new ShareError("invalid-payload", "Invalid feed list");
    }

    const feeds: SharedFeed[] = candidate.feeds.map((entry) => {
        if (!entry || typeof entry !== "object") {
            throw new ShareError("invalid-payload", "Invalid feed entry");
        }
        const feed = entry as Partial<SharedFeed>;
        const url = assert_string(feed.url, SHARE_MAX_URL_LENGTH, "feed URL");
        if (!is_http_url(url)) {
            throw new ShareError("invalid-payload", "Unsupported feed URL");
        }
        const folder =
            typeof feed.folder === "number" && Number.isInteger(feed.folder)
                ? feed.folder
                : -1;
        if (folder < -1 || folder >= folders.length) {
            throw new ShareError("invalid-payload", "Invalid feed folder");
        }
        return {
            title: assert_string(
                feed.title ?? url,
                SHARE_MAX_TITLE_LENGTH,
                "feed title",
            ),
            url,
            icon: assert_string(
                feed.icon ?? "",
                SHARE_MAX_URL_LENGTH,
                "feed icon",
            ),
            folder,
        };
    });

    return { v: SHARE_PROTOCOL_VERSION, folders, feeds };
};

export const pack_share_payload = async (
    payload: SharePayload,
    secret: string,
): Promise<Uint8Array> => {
    const validated = validate_share_payload(payload);
    const compressed = await gzip(encoder.encode(JSON.stringify(validated)));
    return encrypt_envelope(compressed, secret, FLAG_GZIP);
};

export const unpack_share_payload = async (
    envelope: Uint8Array,
    secret: string,
): Promise<SharePayload> => {
    if (envelope.length > SHARE_MAX_ENVELOPE_BYTES) {
        throw new ShareError("invalid-payload", "Share payload too large");
    }
    const { flags, payload } = await decrypt_envelope(envelope, secret);
    const raw = flags & FLAG_GZIP ? await gunzip(payload) : payload;
    if (raw.length > SHARE_MAX_ENVELOPE_BYTES) {
        throw new ShareError("invalid-payload", "Share payload too large");
    }
    let parsed: unknown;
    try {
        parsed = JSON.parse(decoder.decode(raw));
    } catch {
        throw new ShareError("invalid-payload", "Malformed share payload");
    }
    return validate_share_payload(parsed);
};

/* -------------------------------------------------------------------------- */
/* Import mapping                                                             */
/* -------------------------------------------------------------------------- */

export interface ShareImportItems {
    items: (FeedMetadata | FeedMetadataFolder)[];
    // Highest assigned id + 1, mirroring parseFeedDatafromOPML's `size`.
    size: number;
}

/**
 * Converts a payload to the same shape `parseFeedDatafromOPML` produces, so
 * the existing preview/selection screen can render it unchanged.
 */
export const share_payload_to_import_items = (
    payload: SharePayload,
): ShareImportItems => {
    const validated = validate_share_payload(payload);
    let cursor = 0;

    const folders: FeedMetadataFolder[] = validated.folders.map(
        (name, folder_index) => {
            const id = cursor++;
            const children: FeedMetadata[] = validated.feeds
                .filter((feed) => feed.folder === folder_index)
                .map((feed) => ({
                    id: cursor++,
                    name: feed.title,
                    icon: feed.icon,
                    posts: [],
                    url: feed.url,
                    type: FEED_TYPE.FEED,
                }));
            return {
                id,
                name,
                children,
                type: FEED_TYPE.FOLDER,
            };
        },
    );

    const root: FeedMetadata[] = validated.feeds
        .filter((feed) => feed.folder < 0)
        .map((feed) => ({
            id: cursor++,
            name: feed.title,
            icon: feed.icon,
            posts: [],
            url: feed.url,
            type: FEED_TYPE.FEED,
        }));

    return { items: [...folders, ...root], size: cursor };
};
