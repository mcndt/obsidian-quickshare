export type QuickShareData = {
	shared_datetime: string;
	updated_datetime: string;
	expire_datetime: string;
	view_url: string;
	secret_token: string;
	deleted_from_vault?: boolean;
	deleted_from_server?: boolean;
};

type FileId = string;
type Setter = (data: QuickShareData) => QuickShareData;

export interface QuickShareCache {
	get: (fileId: FileId) => Promise<QuickShareData | undefined>;
	set: (fileId: FileId, data: QuickShareData | Setter) => Promise<void>;
	rename: (oldFileId: FileId, newFileId: FileId) => Promise<void>;
	has: (fileId: FileId) => Promise<boolean>;
	list: () => Promise<QuickShareData[]>;
}

export type CacheObject = Record<FileId, QuickShareData>;

export abstract class AbstractCache implements QuickShareCache {
	/** Get the QuickShareData for file with id. */
	public async get(fileId: FileId): Promise<QuickShareData | undefined> {
		const cache = await this._getCache();
		return cache[fileId];
	}

	/** Set the QuickShareData for file with id. */
	public async set(
		fileId: FileId,
		data: QuickShareData | Setter
	): Promise<void> {
		const cache = await this._getCache();
		if (typeof data === "function") {
			if (cache[fileId] === undefined) {
				throw new Error("File not found in cache.");
			}
			cache[fileId] = data(cache[fileId]);
		} else {
			cache[fileId] = data;
		}
		this._writeCache(cache);
	}

	/** Check if file with id is in cache. */
	public async has(fileId: FileId): Promise<boolean> {
		const cache = await this._getCache();
		return cache[fileId] !== undefined;
	}

	/** Move the cache data to a new key and delete the old key. */
	public async rename(fileId: FileId, newFileId: FileId): Promise<void> {
		const cache = await this._getCache();
		cache[newFileId] = cache[fileId];
		delete cache[fileId];
		this._writeCache(cache);
	}

	/** Get a list of QuickShareData for this vault. */
	public async list(): Promise<(QuickShareData & { fileId: string })[]> {
		const cache = await this._getCache();
		return Object.entries(cache).map(([fileId, data]) => ({
			fileId,
			...data,
		}));
	}

	protected abstract _getCache(): Promise<CacheObject>;

	protected abstract _writeCache(object: CacheObject): void;
}
