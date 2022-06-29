import NoteSharingPlugin from "main";
import { Modal, TextComponent } from "obsidian";

export class SharedNoteSuccessModal extends Modal {
	private url: string;

	constructor(plugin: NoteSharingPlugin, url: string) {
		super(plugin.app);
		this.url = url;

		this.render();
	}

	render() {
		this.titleEl.innerText = "Shared note";
		new TextComponent(this.contentEl).setValue(this.url);
	}
}
