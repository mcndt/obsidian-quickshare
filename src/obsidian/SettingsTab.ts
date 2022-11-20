import type NoteSharingPlugin from "main";
import {
	App,
	Notice,
	PluginSettingTab,
	Setting,
	TextComponent,
} from "obsidian";
import { FsCache } from "src/lib/cache/FsCache";
import { LocalStorageCache } from "src/lib/cache/LocalStorageCache";
import { DEFAULT_SETTINGS } from "./PluginSettings";

export default class SettingsTab extends PluginSettingTab {
	plugin: NoteSharingPlugin;

	private selfHostSettings: HTMLElement;
	private frontmatterSettings: HTMLElement;
	private hideSelfHosted: boolean;
	private selfHostedUrl: TextComponent;

	constructor(app: App, plugin: NoteSharingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.hideSelfHosted = !plugin.settings.selfHosted;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// General settings
		containerEl.createEl("h2", { text: "QuickShare" });

		new Setting(containerEl)
			.setName("Use noteshare.space")
			.setDesc(
				"Noteshare.space is the free and official service for sharing your notes with QuickShare. Uncheck if you want to self-host."
			)
			.addToggle((text) =>
				text
					.setValue(!this.plugin.settings.selfHosted)
					.onChange(async (value) => {
						this.plugin.settings.selfHosted = !value;
						this.showSelfhostedSettings(
							this.plugin.settings.selfHosted
						);
						if (this.plugin.settings.selfHosted === false) {
							this.plugin.settings.serverUrl =
								DEFAULT_SETTINGS.serverUrl;
							this.selfHostedUrl.setValue(
								this.plugin.settings.serverUrl
							);
						}
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Sync QuickShare data across devices")
			.setDesc(
				`By default, QuickShare keeps the access keys for your shared
				notes in a hidden file in your vault. This enables updating or deleting of QuickShare notes from multiple
				devices when using Obsidian Sync. If your vault folder is shared or public, it is recommended that you turn this setting off.`
			)
			.addToggle((text) =>
				text
					.setValue(this.plugin.settings.useFsCache)
					.onChange(async (value) => {
						try {
							const newCache = value
								? await new FsCache(this.app).init()
								: await new LocalStorageCache(this.app).init();
							await newCache.copy(this.plugin.$cache);
							await this.plugin.$cache.$deleteAllData();
							this.plugin.$cache = newCache;
						} catch {
							new Notice(
								"Could not change cache type. Please report a bug."
							);
							return;
						}
						this.plugin.settings.useFsCache = value;
						await this.plugin.saveSettings();
					})
			);

		// Self-hosted settings
		this.selfHostSettings = containerEl.createDiv();
		this.selfHostSettings.createEl("h2", { text: "Self-hosting options" });
		new Setting(this.selfHostSettings)
			.setName("Server URL")
			.setDesc(
				"Server URL hosting the encrypted notes. For more information about self-hosting, see https://github.com/mcndt/noteshare.space#deployment"
			)
			.addText((text) => {
				this.selfHostedUrl = text;
				text.setPlaceholder("enter URL")
					.setValue(this.plugin.settings.serverUrl)
					.onChange(async (value) => {
						this.plugin.settings.serverUrl = value;
						await this.plugin.saveSettings();
					});
			});

		this.showSelfhostedSettings(this.plugin.settings.selfHosted);

		// Sharing settings
		containerEl.createEl("h2", { text: "Sharing options" });
		new Setting(containerEl)
			.setName("Share filename as note title")
			.setDesc(
				'Use the filename as the title of the note (like "Show inline title" in Obsidian\'s appearance settings). If unchecked, the title will be the first heading in the note.'
			)
			.addToggle((text) =>
				text
					.setValue(this.plugin.settings.shareFilenameAsTitle)
					.onChange(async (value) => {
						this.plugin.settings.shareFilenameAsTitle = value;
						await this.plugin.saveSettings();
					})
			);

		// Frontmatter settings
		containerEl.createEl("h2", { text: "Frontmatter options" });

		new Setting(containerEl)
			.setName("Use frontmatter")
			.setDesc(
				"Use frontmatter to store the QuickShare URL and share date after sharing."
			)
			.addToggle((text) =>
				text
					.setValue(this.plugin.settings.useFrontmatter)
					.onChange(async (value) => {
						this.plugin.settings.useFrontmatter = value;
						await this.plugin.saveSettings();
						this.showFrontmatterSettings(
							this.plugin.settings.useFrontmatter
						);
					})
			);

		// Frontmatter date format
		this.frontmatterSettings = containerEl.createDiv();

		new Setting(this.frontmatterSettings)
			.setName("Frontmatter date format")
			.setDesc(
				"See https://momentjs.com/docs/#/displaying/format/ for formatting options."
			)
			.addMomentFormat((text) =>
				text
					.setDefaultFormat(DEFAULT_SETTINGS.frontmatterDateFormat)
					.setValue(this.plugin.settings.frontmatterDateFormat)
					.onChange(async (value) => {
						this.plugin.settings.frontmatterDateFormat = value;
						await this.plugin.saveSettings();
					})
			);

		this.showFrontmatterSettings(this.plugin.settings.useFrontmatter);
	}

	private showSelfhostedSettings(show: boolean) {
		this.selfHostSettings.hidden = !show;
	}

	private showFrontmatterSettings(show: boolean) {
		this.frontmatterSettings.hidden = !show;
	}
}
