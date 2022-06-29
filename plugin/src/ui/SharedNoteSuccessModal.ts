import type NoteSharingPlugin from "main";
import { Modal } from "obsidian";
import Component from "./SharedNoteSuccessComponent.svelte";

export class SharedNoteSuccessModal extends Modal {
	private url: string;
	private component: Component;

	constructor(plugin: NoteSharingPlugin, url: string) {
		super(plugin.app);
		this.url = url;

		this.render();
	}

	render() {
		this.titleEl.innerText = "Shared note";
	}

	async onOpen() {
		this.component = new Component({
			target: this.contentEl,
			props: {
				url: this.url,
			},
		});
	}

	async onClose() {
		this.component.$destroy();
	}
}
