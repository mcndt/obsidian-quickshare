import { ItemView, WorkspaceLeaf } from "obsidian";
import QuickShareSideViewComponent from "./QuickShareSideView.svelte";
export class QuickShareSideView extends ItemView {
	static viewType = "QUICKSHARE_SIDE_VIEW";

	public navigation = false;

	private component: QuickShareSideViewComponent;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	/* Obsidian event lifecycle */

	async onOpen(): Promise<void> {
		this.component = new QuickShareSideViewComponent({
			target: this.contentEl,
		});
	}

	async onClose() {
		this.component.$destroy();
	}

	/* View abstract method implementations */

	getViewType(): string {
		return QuickShareSideView.viewType;
	}

	getDisplayText(): string {
		return "QuickShare";
	}

	getIcon(): string {
		return "cloud";
	}
}
