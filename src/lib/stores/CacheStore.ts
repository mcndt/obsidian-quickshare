import { writable } from "svelte/store";
import type { QuickShareDataList } from "../cache/AbstractCache";

const { subscribe, set } = writable<QuickShareDataList>([]);

export function updateReactiveCache(data: QuickShareDataList) {
	data.sort((a, b) => {
		const aDate = new Date(a.updated_datetime ?? a.shared_datetime);
		const bDate = new Date(b.updated_datetime ?? b.shared_datetime);
		return bDate.getTime() - aDate.getTime();
	});
	set(data);
}

export default { subscribe };
