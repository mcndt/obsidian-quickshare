import {
	MarkdownView,
	Menu,
	Notice,
	Plugin,
	TAbstractFile,
	TFile,
} from "obsidian";
import { NoteSharingService } from "src/NoteSharingService";
import { DEFAULT_SETTINGS } from "src/obsidian/PluginSettings";
import SettingsTab from "src/obsidian/SettingsTab";
import { SharedNoteSuccessModal } from "src/ui/SharedNoteSuccessModal";
import type { EventRef } from "obsidian";
import type { PluginSettings } from "src/obsidian/PluginSettings";

export default class NoteSharingPlugin extends Plugin {
	public settings: PluginSettings;
	private noteSharingService: NoteSharingService;
	private eventRef: EventRef;

	async onload() {
		await this.loadSettings();
		this.noteSharingService = new NoteSharingService(
			this.settings.serverUrl,
			this.settings.anonymousUserId,
			this.manifest.version,
			this.app
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
		await this.saveSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		if (this.noteSharingService) {
			this.noteSharingService.serverUrl = this.settings.serverUrl;
		}
	}

	addCommands() {
		this.addCommand({
			id: "obsidian-quickshare-share-note",
			name: "Create share link",
			checkCallback: (checking: boolean) => {
				// Only works on Markdown views
				const activeView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!activeView) return false;
				if (checking) return true;

				this.shareNote(activeView);
			},
		});
	}

	// https://github.dev/platers/obsidian-linter/blob/c30ceb17dcf2c003ca97862d94cbb0fd47b83d52/src/main.ts#L139-L149
	onMenuOpenCallback(menu: Menu, file: TAbstractFile, source: string) {
		if (file instanceof TFile && file.extension === "md") {
			menu.addItem((item) => {
				item.setIcon("paper-plane-glyph");
				item.setTitle("Create share link");
				item.onClick(async (evt) => {
					const activeView =
						this.app.workspace.getActiveViewOfType(MarkdownView);
					this.shareNote(activeView);
				});
			});
		}
	}

	async shareNote(view: MarkdownView) {
		// get cached embedded files
		const md = view.getViewData();
		const file = view.file;

		this.noteSharingService
			.shareNote(md, file)
			.then((res) => {
				new SharedNoteSuccessModal(
					this,
					res.view_url,
					res.expire_time
				).open();
			})
			.catch((err: Error) => {
				console.error(err);
				new Notice(err.message, 7500);
			});
	}
}
