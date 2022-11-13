import type { App, TFile } from "obsidian";

type FrontmatterKey = "url" | "datetime";

const keyTypetoFrontmatterKey: Record<FrontmatterKey, string> = {
	url: "quickshare-url",
	datetime: "quickshare-date",
};

function _getFrontmatterKey(
	file: TFile,
	key: FrontmatterKey,
	app: App
): string {
	const fmCache = app.metadataCache.getFileCache(file).frontmatter;
	return fmCache?.[keyTypetoFrontmatterKey[key]] || undefined;
}

function _setFrontmatterKey(
	file: TFile,
	key: FrontmatterKey,
	value: string,
	content: string
) {
	if (_getFrontmatterKey(file, key, app) === value) {
		console.log("returning");
		return;
	}

	if (_getFrontmatterKey(file, key, app) !== undefined) {
		// replace the existing key.
		content = content.replace(
			new RegExp(`^(${keyTypetoFrontmatterKey[key]}):\\s*(.*)$`, "m"),
			`${keyTypetoFrontmatterKey[key]}: ${value}`
		);
	} else {
		if (content.match(/^---/)) {
			// add the key to the existing block
			content = content.replace(
				/^---/,
				`---\n${keyTypetoFrontmatterKey[key]}: ${value}`
			);
		} else {
			// create a new block
			content = `---\n${keyTypetoFrontmatterKey[key]}: ${value}\n---\n${content}`;
		}
	}

	return content;
}

async function _setFrontmatterKeys(
	file: TFile,
	records: Record<FrontmatterKey, string>,
	app: App
) {
	let content = await app.vault.read(file);

	for (const [key, value] of Object.entries(records)) {
		if (_getFrontmatterKey(file, key, app) !== value) {
			content = _setFrontmatterKey(file, key, value, content);
		}
	}

	app.vault.modify(file, content);
}

export function useFrontmatterHelper(app: App) {
	const getFrontmatterKey = (file: TFile, key: FrontmatterKey) =>
		_getFrontmatterKey(file, key, app);

	const setFrontmatterKeys = (
		file: TFile,
		records: Record<FrontmatterKey, string>
	) => _setFrontmatterKeys(file, records, app);

	return {
		getFrontmatterKey,
		setFrontmatterKeys,
	};
}
