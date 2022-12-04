import type { TFile } from "obsidian";
import { writable } from "svelte/store";

const { subscribe, set } = writable<TFile | null>(null);

export function setActiveMdFile(file: TFile | null) {
	set(file);
}

export default { subscribe };
