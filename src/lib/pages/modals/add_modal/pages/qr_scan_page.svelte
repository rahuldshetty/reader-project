<script lang="ts">
  import { onDestroy, tick } from "svelte";

  import { t, type TranslationKey } from "$lib/i18n";
  import {
    active_page,
    feeds_import_data,
    feeds_import_items,
  } from "$lib/stores/add_modal_store";
  import {
    ShareError,
    parse_share_token,
    share_payload_to_import_items,
  } from "$lib/services/feed_share";
  import { receive_share } from "$lib/services/feed_share_client";
  import {
    is_camera_available,
    read_qr_from_file,
    start_camera_qr_scanner,
    type CameraQrScanner,
  } from "$lib/services/qr_scan";

  type Phase = "idle" | "camera" | "busy" | "error";

  let phase = $state<Phase>("idle");
  let status_key = $state<TranslationKey>("share.connecting");
  let error_key = $state<TranslationKey>("share.invalid_qr");
  let error_detail = $state("");

  let video: HTMLVideoElement | null = $state(null);
  let file_input: HTMLInputElement | null = $state(null);
  let scanner: CameraQrScanner | null = null;
  let controller: AbortController | null = null;
  let destroyed = false;

  const stop_camera = () => {
    scanner?.stop();
    scanner = null;
  };

  const back = () => {
    stop_camera();
    controller?.abort();
    controller = null;
    phase = "idle";
    active_page.set(0);
  };

  const fail = (key: TranslationKey, detail = "") => {
    stop_camera();
    error_key = key;
    error_detail = detail;
    phase = "error";
  };

  const handle_text = async (text: string) => {
    stop_camera();
    const token = parse_share_token(text);
    if (!token) {
      fail("share.invalid_qr");
      return;
    }

    phase = "busy";
    status_key = "share.connecting";
    const current = new AbortController();
    controller = current;

    try {
      const payload = await receive_share(token, {
        signal: current.signal,
        on_state: (state) => {
          if (state.status === "receiving") {
            status_key = "share.receiving";
          }
        },
      });
      if (destroyed) return;

      const { items } = share_payload_to_import_items(payload);
      feeds_import_items.set(items);
      feeds_import_data.set("");
      active_page.set(1);
    } catch (error) {
      if (destroyed) return;
      if (error instanceof ShareError && error.code === "cancelled") return;
      fail(
        error instanceof ShareError && error.code === "peer-unavailable"
          ? "share.code_expired"
          : "share.connect_failed",
        error instanceof Error ? error.message : "",
      );
    } finally {
      if (controller === current) controller = null;
    }
  };

  const start_camera = async () => {
    if (!is_camera_available()) {
      fail("share.camera_unavailable");
      return;
    }
    phase = "camera";
    await tick();
    if (!video || destroyed) return;
    try {
      const created = await start_camera_qr_scanner(video, (text) => {
        void handle_text(text);
      });
      // Camera startup is async; the user may have cancelled meanwhile.
      if (destroyed || phase !== "camera") {
        created.stop();
        return;
      }
      scanner = created;
    } catch {
      fail("share.camera_unavailable");
    }
  };

  const choose_image = () => {
    file_input?.click();
  };

  const handle_file = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    phase = "busy";
    status_key = "share.scanning";
    try {
      const text = await read_qr_from_file(file);
      await handle_text(text);
    } catch (error) {
      fail(
        "share.invalid_qr",
        error instanceof Error ? error.message : "",
      );
    }
  };

  onDestroy(() => {
    destroyed = true;
    stop_camera();
    controller?.abort();
    controller = null;
  });
</script>

<div class="flex flex-col gap-4">
  <p class="text-sm opacity-70">{$t("share.scan_hint")}</p>

  {#if phase === "idle" || phase === "error"}
    {#if phase === "error"}
      <div class="rounded-lg bg-base-200 p-3 text-sm">
        <p class="text-error">{$t(error_key)}</p>
        {#if error_detail}
          <p class="mt-1 text-xs opacity-60 break-words">{error_detail}</p>
        {/if}
      </div>
    {/if}

    <div class="flex flex-col gap-2 sm:flex-row">
      <button class="btn btn-primary flex-1" onclick={start_camera}>
        {$t("share.scan_camera")}
      </button>
      <button class="btn btn-secondary flex-1" onclick={choose_image}>
        {$t("share.choose_image")}
      </button>
    </div>
  {:else if phase === "camera"}
    <video
      bind:this={video}
      class="w-full rounded-lg bg-black"
      autoplay
      muted
      playsinline
    ></video>
    <p class="text-center text-sm opacity-70">{$t("share.scanning")}</p>
  {:else if phase === "busy"}
    <div class="flex flex-col items-center gap-3 py-10">
      <span class="loading loading-spinner loading-lg"></span>
      <p class="text-sm">{$t(status_key)}</p>
    </div>
  {/if}

  <div class="modal-action">
    <button class="btn btn-ghost" onclick={back}>
      {$t("common.cancel")}
    </button>
  </div>
</div>

<input
  bind:this={file_input}
  type="file"
  accept="image/*"
  class="hidden"
  onchange={handle_file}
/>
