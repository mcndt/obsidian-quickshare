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
import { useFrontmatterHelper } from "src/obsidian/Frontmatter";
import moment from "moment";
import type { QuickShareCache } from "src/lib/cache/AbstractCache";
import { FsCache } from "src/lib/cache/FsCache";

export default class NoteSharingPlugin extends Plugin {
	public settings: PluginSettings;
	private noteSharingService: NoteSharingService;
	private cache: QuickShareCache;

	private fileMenuEvent: EventRef;

	async onload() {
		await this.loadSettings();

		this.cache = new FsCache(app);

		this.noteSharingService = new NoteSharingService(
			this.settings.serverUrl,
			this.settings.anonymousUserId,
			this.manifest.version
		);

		// Init settings tab
		this.addSettingTab(new SettingsTab(this.app, this));

		// Add note sharing command
		this.addCommands();

		// Add event listeners
		this.fileMenuEvent = this.app.workspace.on(
			"file-menu",
			(menu, file, source) => this.onMenuOpenCallback(menu, file, source)
		);
		this.registerEvent(this.fileMenuEvent);

		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (!this.cache.has(file.path)) {
					return;
				}
				this.cache.rename(oldPath, file.path);
			})
		);

		this.registerEvent(
			this.app.vault.on("delete", (file) => {
				if (!this.cache.has(file.path)) {
					return;
				}
				this.cache.set(file.path, (data) => ({
					...data,
					deleted_from_vault: true,
				}));
				console.log("deleted", file.path);
			})
		);
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
				this.shareNote(activeView.file);
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
					this.shareNote(file);
				});
			});
		}
	}

	async shareNote(file: TFile) {
		const { setFrontmatterKeys } = useFrontmatterHelper(this.app);

		const body = await this.app.vault.read(file);
		const title = this.settings.shareFilenameAsTitle
			? file.basename
			: undefined;

		this.noteSharingService
			.shareNote(body, { title })
			.then((res) => {
				if (this.settings.useFrontmatter) {
					const datetime = moment().format(
						this.settings.frontmatterDateFormat ||
							DEFAULT_SETTINGS.frontmatterDateFormat
					);
					setFrontmatterKeys(file, {
						url: `"${res.view_url}"`,
						datetime: datetime,
					});
				}

				// NOTE: this is an async call, but we don't need to wait for it
				this.cache.set(file.path, {
					shared_datetime: moment().toISOString(),
					updated_datetime: moment().toISOString(),
					expire_datetime: res.expire_time.toISOString(),
					view_url: res.view_url,
					secret_token: res.secret_token,
				});

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
