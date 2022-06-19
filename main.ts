import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from "obsidian";
import { encryptMarkdown } from "src/encryption";
import { NoteSharingService } from "src/NoteSharingService";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	serverUrl: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	serverUrl: "http://localhost:8080",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	noteSharingService: NoteSharingService;

	async onload() {
		await this.loadSettings();
		this.noteSharingService = new NoteSharingService(
			this.settings.serverUrl
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "obsidian-note-sharing-share-note",
			name: "Create share link",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					if (!checking) {
						this.noteSharingService.shareNote(markdownView);
					}
					return true;
				}
			},
		});
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
}

class SettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
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
