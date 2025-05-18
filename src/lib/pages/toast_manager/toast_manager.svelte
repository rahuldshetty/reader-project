<script lang="ts">
	import { toastStore } from '$lib/stores/toast_store';
    import type { ToastMessage } from "$lib/types";
	import { fly, fade } from 'svelte/transition';
	import { onDestroy } from 'svelte';
    import { TOAST_MESSAGE_TYPE } from '$lib/constants';

	let toasts = $state([] as ToastMessage[]);
	const unsubscribe = toastStore.subscribe((t) => (toasts = t));
	onDestroy(unsubscribe);

	const style_mapping = (type: TOAST_MESSAGE_TYPE) => {
		switch(type){
			case TOAST_MESSAGE_TYPE.INFO:
				return "alert-info";
			case TOAST_MESSAGE_TYPE.ERROR:
				return "alert-error";
			case TOAST_MESSAGE_TYPE.WARNING:
				return "alert-warning";
			case TOAST_MESSAGE_TYPE.SUCCESS:
				return "alert-success";			
		}
	}
</script>

<style>
	.toast-enter,
	.toast-leave {
		will-change: transform, opacity;
	}
</style>

<div class="toast toast-end">
	{#each toasts as toast (toast.id)}
        <div class={"alert " + style_mapping(toast.type)}
            in:fly={{ y: -20, duration: 200 }}
			out:fade={{ duration: 200 }}
        >
            <span>{toast.message}</span>
        </div>
	{/each}
</div>
