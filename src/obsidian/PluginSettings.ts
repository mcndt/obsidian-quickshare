import { generateId } from "src/lib/anonUserId";

export interface PluginSettings {
	serverUrl: string;
	selfHosted: boolean;
	anonymousUserId: string;
	useFrontmatter: boolean;
	frontmatterDateFormat?: string;
	shareFilenameAsTitle: boolean;
	useFsCache: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	serverUrl: "https://noteshare.space",
	selfHosted: false,
	anonymousUserId: generateId(),
	useFrontmatter: true,
	frontmatterDateFormat: "YYYY-MM-DD HH:mm:ss",
	shareFilenameAsTitle: true,
	useFsCache: true,
};
