import { MarkdownView, Menu, Plugin, TAbstractFile, TFile } from "obsidian";
import { NoteSharingService } from "src/NoteSharingService";
import { DEFAULT_SETTINGS } from "src/obsidian/PluginSettings";
import SettingsTab from "src/obsidian/SettingsTab";
import { SharedNoteSuccessModal } from "src/ui/SharedNoteSuccessModal";
import type { EventRef } from "obsidian";
import type { PluginSettings } from "src/obsidian/PluginSettings";

// Remember to rename these classes and interfaces!

export default class NoteSharingPlugin extends Plugin {
	private settings: PluginSettings;
	private noteSharingService: NoteSharingService;
	private eventRef: EventRef;

	async onload() {
		await this.loadSettings();
		this.noteSharingService = new NoteSharingService(
			this.settings.serverUrl
		);

		// Init settings tab
		this.addSettingTab(new SettingsTab(this.app, this));

		// Add note sharing command
		this.addCommands();

		this.eventRef = this.app.workspace.on(
			"file-menu",
			(menu, file, source) => this.onMenuOpenCallback(menu, file, source)
		);
		this.registerEvent(this.eventRef);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.noteSharingService.serverUrl = this.settings.serverUrl;
	}

	addCommands() {
		this.addCommand({
			id: "obsidian-note-sharing-share-note",
			name: "Create share link",
			checkCallback: (checking: boolean) => {
				// Only works on Markdown views
				const activeView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!activeView) return false;
				if (checking) return true;
				this.shareNote(activeView.getViewData());
			},
		});
	}

	// https://github.dev/platers/obsidian-linter/blob/c30ceb17dcf2c003ca97862d94cbb0fd47b83d52/src/main.ts#L139-L149
	onMenuOpenCallback(menu: Menu, file: TAbstractFile, source: string) {
		if (file instanceof TFile && file.extension === "md") {
			menu.addItem((item) => {
				item.setIcon("paper-plane-glyph");
				item.setTitle("Share note");
				item.onClick(async (evt) => {
					this.shareNote(await this.app.vault.read(file));
				});
			});
		}
	}

	async shareNote(mdText: string) {
		const res = await this.noteSharingService.shareNote(mdText);
		new SharedNoteSuccessModal(this, res.view_url, res.expire_time).open();
	}
}
