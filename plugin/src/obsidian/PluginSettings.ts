export interface PluginSettings {
	serverUrl: string;
	selfHosted: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	serverUrl: "https://noteshare.space",
	selfHosted: false,
};
