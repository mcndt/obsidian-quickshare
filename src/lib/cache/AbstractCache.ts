import { updateReactiveCache } from "./CacheStore";

export type QuickShareData = {
	shared_datetime: string;
	updated_datetime: string;
	expire_datetime: string;
	view_url: string;
	secret_token: string;
	deleted_from_vault?: boolean;
	deleted_from_server?: boolean;
	note_id: string;
	basename: string;
};

type FileId = string;
type Setter = (data: QuickShareData) => QuickShareData;

export interface QuickShareCache {
	get: (fileId: FileId) => QuickShareData | undefined;
	set: (fileId: FileId, data: QuickShareData | Setter) => Promise<void>;
	rename: (oldFileId: FileId, newFileId: FileId) => Promise<void>;
	has: (fileId: FileId) => boolean;
	list: () => Promise<QuickShareData[]>;
	copy: (cache: QuickShareCache) => Promise<void>;

	$getCache: () => Promise<Record<FileId, QuickShareData>>;
	$deleteAllData: () => Promise<void>;
}

export type CacheObject = Record<FileId, QuickShareData>;

export type QuickShareDataList = (QuickShareData & { fileId: string })[];

export abstract class AbstractCache implements QuickShareCache {
	/** Get the QuickShareData for file with id. */
	public get(fileId: FileId): QuickShareData | undefined {
		const cache = this._getCache();
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
		this.writeCache(cache);
	}

	/** Check if file with id is in cache. */
	public has(fileId: FileId): boolean {
		const cache = this._getCache();
		return cache[fileId] !== undefined;
	}

	/** Move the cache data to a new key and delete the old key. */
	public async rename(
		oldFileId: FileId,
		newFileId: string,
		newBasename?: string
	): Promise<void> {
		const cache = this._getCache();
		cache[newFileId] = cache[oldFileId];
		delete cache[oldFileId];
		if (newBasename) {
			cache[newFileId].basename = newBasename;
		}
		return this.writeCache(cache);
	}

	/** Get a list of QuickShareData for this vault. */
	public async list(): Promise<QuickShareDataList> {
		const cache = this._getCache();
		return Object.entries(cache).map(([fileId, data]) => ({
			fileId,
			...data,
		}));
	}

	/** Copies the contents of the passed cache to this cache. */
	public async copy(cache: QuickShareCache): Promise<void> {
		const data = await cache.$getCache();
		this.writeCache(data);
	}

	public async $getCache(): Promise<Record<FileId, QuickShareData>> {
		return this._getCache();
	}

	private async writeCache(object: CacheObject): Promise<void> {
		await this._writeCache(object);
		updateReactiveCache(await this.list());
	}

	public async init(): Promise<QuickShareCache> {
		const cache = await this._init();
		updateReactiveCache(await this.list());
		return cache;
	}

	public abstract $deleteAllData(): Promise<void>;

	protected abstract _init(): Promise<QuickShareCache>;

	protected abstract _getCache(): CacheObject;

	protected abstract _writeCache(object: CacheObject): Promise<void>;
}
