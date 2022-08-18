import { generateId } from "src/lib/anonUserId";

export interface PluginSettings {
	serverUrl: string;
	selfHosted: boolean;
	anonymousUserId: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	serverUrl: "https://noteshare.space",
	selfHosted: false,
	anonymousUserId: generateId(),
};
