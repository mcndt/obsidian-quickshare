import type NoteSharingPlugin from "main";
import { App, PluginSettingTab, Setting, TextComponent } from "obsidian";
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
