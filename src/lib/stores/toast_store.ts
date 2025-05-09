import { generateId } from "$lib/utils/time";
import type { ToastMessage } from "$lib/types";
import { writable } from 'svelte/store';
import type { TOAST_MESSAGE_TYPE } from "$lib/constants";


function createToastStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function add(type: TOAST_MESSAGE_TYPE, message: string, duration: number = 3000) {
        const ramdomHash = generateId();

		update((toasts) => [...toasts, {
            id: ramdomHash,
            type,
            message,
            duration
        }]);

		setTimeout(() => {
			remove(ramdomHash);
		}, duration);
	}

	function remove(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return { subscribe, add, remove };
}

export const toastStore = createToastStore();
