import NoteSharingPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export default class SettingsTab extends PluginSettingTab {
	plugin: NoteSharingPlugin;

	constructor(app: App, plugin: NoteSharingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Obsidian Note Sharing" });

		new Setting(containerEl)
			.setName("Server URL")
			.setDesc("Server URL hosting the encrypted notes.")
			.addText((text) =>
				text
					.setPlaceholder("enter URL")
					.setValue(this.plugin.settings.serverUrl)
					.onChange(async (value) => {
						this.plugin.settings.serverUrl = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
