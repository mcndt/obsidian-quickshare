import type NoteSharingPlugin from "main";
import { App, PluginSettingTab, Setting, TextComponent } from "obsidian";
import { DEFAULT_SETTINGS } from "./PluginSettings";

export default class SettingsTab extends PluginSettingTab {
	plugin: NoteSharingPlugin;

	private selfHostSettings: HTMLElement;
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

		containerEl.createEl("h2", { text: "Obsidian Note Sharing" });

		new Setting(containerEl)
			.setName("Use noteshare.space")
			.setDesc(
				"Noteshare.space is the official service for hosting your encrypted notes. Uncheck if you want to self-host."
			)
			.addToggle((text) =>
				text
					.setValue(!this.plugin.settings.selfHosted)
					.onChange(async (value) => {
						this.plugin.settings.selfHosted = !value;
						this.showSelfhostedSettings(
							this.plugin.settings.selfHosted
						);
						if (value === false) {
							this.plugin.settings.serverUrl =
								DEFAULT_SETTINGS.serverUrl;
							this.selfHostedUrl.setValue(
								this.plugin.settings.serverUrl
							);
						}
						await this.plugin.saveSettings();
					})
			);

		this.selfHostSettings = containerEl.createDiv();

		this.selfHostSettings.createEl("h3", { text: "Self-hosting options" });

		new Setting(this.selfHostSettings)
			.setName("Server URL")
			.setDesc("Server URL hosting the encrypted notes.")
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
	}

	private showSelfhostedSettings(show: boolean) {
		this.selfHostSettings.hidden = !show;
	}
}
