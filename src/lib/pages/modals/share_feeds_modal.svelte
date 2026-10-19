<script lang="ts">
  import { onDestroy } from "svelte";
  import { get } from "svelte/store";
  import { renderSVG } from "uqr";

  import ModalShell from "$lib/components/modals/ModalShell.svelte";
  import { MODAL_TYPE } from "$lib/constants";
  import { t } from "$lib/i18n";
  import {
    active_modal,
    feeds_store,
  } from "$lib/stores/app_store";
  import {
    ShareError,
    build_share_payload,
    generate_share_secret,
  } from "$lib/services/feed_share";
  import {
    start_share_host,
    type ShareHostHandle,
    type ShareHostState,
  } from "$lib/services/feed_share_host";

  const open = $derived($active_modal === MODAL_TYPE.SHARE_FEEDS);

  let host_state = $state<ShareHostState>({ status: "starting" });
  let qr_svg = $state("");
  let now = $state(Date.now());
  let session: ShareHostHandle | null = null;

  const remaining = $derived(
    host_state.status === "waiting"
      ? Math.max(0, Math.ceil((host_state.expires_at - now) / 1000))
      : 0,
  );

  const client_label = $derived(
    host_state.status === "connected" || host_state.status === "sending"
      ? host_state.client.platform === "android"
        ? "Android"
        : host_state.client.platform === "ios"
          ? "iOS"
          : $t("share.client.desktop")
      : "",
  );

  const stop_session = () => {
    session?.stop();
    session = null;
  };

  const start_session = () => {
    stop_session();
    qr_svg = "";
    now = Date.now();

    let payload;
    try {
      payload = build_share_payload(get(feeds_store));
    } catch (error) {
      host_state = {
        status: "error",
        message:
          error instanceof ShareError && error.code === "no-feeds"
            ? $t("share.no_feeds")
            : error instanceof Error
              ? error.message
              : $t("share.no_feeds"),
      };
      return;
    }

    const secret = generate_share_secret();
    host_state = { status: "starting" };

    session = start_share_host(payload, secret, (next) => {
      host_state = next;
      if (next.status === "waiting") {
        qr_svg = renderSVG(next.token, { ecc: "M", border: 2 });
        now = Date.now();
      }
      if (
        next.status === "done" ||
        next.status === "stopped" ||
        next.status === "error"
      ) {
        session = null;
      }
    });
  };

  const close = () => {
    stop_session();
    $active_modal = MODAL_TYPE.SETTINGS;
  };

  // Start when opened, tear down when closed or unmounted.
  $effect(() => {
    if (open) {
      start_session();
    } else {
      stop_session();
    }
  });

  // Drive the expiry countdown while the code is on screen.
  $effect(() => {
    if (host_state.status !== "waiting") return;
    const interval = window.setInterval(() => {
      now = Date.now();
    }, 1000);
    return () => window.clearInterval(interval);
  });

  onDestroy(stop_session);
</script>

<ModalShell {open} title={$t("share.title")} widthClass="max-w-md" onClose={close}>
  <div class="flex flex-col gap-4">
    <p class="text-sm opacity-70">{$t("share.hint")}</p>

    {#if host_state.status === "starting"}
      <div class="flex flex-col items-center gap-3 py-10">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="text-sm opacity-70">{$t("share.starting")}</p>
      </div>
    {:else if host_state.status === "waiting"}
      <div
        class="mx-auto w-full max-w-[320px] rounded-lg bg-white p-2 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
      >
        {@html qr_svg}
      </div>
      <div class="text-center">
        <p class="text-sm font-medium">{$t("share.waiting")}</p>
        <p class="mt-1 text-xs opacity-70">
          {$t("share.expires_in", { seconds: remaining })}
        </p>
      </div>
    {:else if host_state.status === "connected" || host_state.status === "sending"}
      <div class="flex flex-col items-center gap-3 py-10">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="text-sm font-medium">
          {$t("share.connected", { client: client_label })}
        </p>
        <p class="text-xs opacity-70">
          {$t("share.sending", { count: host_state.feed_count })}
        </p>
      </div>
    {:else if host_state.status === "done"}
      <div class="flex flex-col items-center gap-3 py-10 text-center">
        <span class="text-success text-3xl">✓</span>
        <p class="text-sm">{$t("share.done")}</p>
      </div>
    {:else if host_state.status === "stopped"}
      <div class="flex flex-col items-center gap-3 py-10 text-center">
        <p class="text-sm">
          {host_state.reason === "expired"
            ? $t("share.expired")
            : $t("share.cancelled")}
        </p>
      </div>
    {:else if host_state.status === "error"}
      <div class="flex flex-col items-center gap-3 py-10 text-center">
        <p class="text-sm text-error">
          {$t("share.error", { message: host_state.message })}
        </p>
      </div>
    {/if}

    <div class="modal-action">
      <button class="btn btn-ghost" onclick={close}>
        {$t("common.close")}
      </button>
      <button class="btn btn-neutral" onclick={start_session}>
        {$t("share.new_code")}
      </button>
    </div>
  </div>
</ModalShell>
