import type { App } from "obsidian";
import { AbstractCache, type CacheObject } from "./AbstractCache";

export class FsCache extends AbstractCache {
	private _app: App;
	private _cache: CacheObject;

	constructor(app: App) {
		super();
		this._app = app;
		this._fetchCache();
	}

	protected async _getCache(): Promise<CacheObject> {
		return this._cache ?? {};
	}

	protected async _writeCache(object: CacheObject): Promise<void> {
		await this._app.vault.adapter.write(
			this._cachePath,
			JSON.stringify(object, null, 2)
		);
		this._cache = object;
	}

	private async _fetchCache(): Promise<void> {
		try {
			const jsonString = await app.vault.adapter.read(this._cachePath);
			this._cache = JSON.parse(jsonString) as CacheObject;
		} catch (e) {
			this._cache = {};
		}
	}

	private get _cachePath(): string {
		return `${this._app.vault.configDir}/quickshare.json`;
	}
}
