import type { App } from "obsidian";
import {
	AbstractCache,
	type CacheObject,
	type QuickShareCache,
} from "./AbstractCache";

export class LocalStorageCache extends AbstractCache {
	private _app: App;
	private _cache: CacheObject;

	constructor(app: App) {
		super();
		this._app = app;
	}

	public async init(): Promise<QuickShareCache> {
		this._fetchCache();
		return this;
	}

	protected _getCache(): CacheObject {
		return this._cache ?? {};
	}

	protected async _writeCache(object: CacheObject): Promise<void> {
		window.localStorage.setItem(
			this._cacheKey,
			JSON.stringify(object, null, 2)
		);
		this._cache = object;
	}

	private async _fetchCache(): Promise<void> {
		try {
			const jsonString = window.localStorage.getItem(this._cacheKey);
			if (jsonString) {
				this._cache = JSON.parse(jsonString) as CacheObject;
			} else {
				this._cache = {};
			}
		} catch (e) {
			this._cache = {};
		}
	}

	public async $deleteAllData(): Promise<void> {
		window.localStorage.removeItem(this._cacheKey);
		this._cache = {};
	}

	private get _cacheKey(): string {
		// @ts-ignore appId is an undocumented API property, see
		// https://discord.com/channels/686053708261228577/840286264964022302/1030208306242928664
		return `${this._app.appId}-quickshare`;
	}
}
