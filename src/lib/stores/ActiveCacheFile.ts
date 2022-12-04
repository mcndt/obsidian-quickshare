import { derived } from "svelte/store";
import ActiveMdFile from "./ActiveMdFile";
import CacheStore from "./CacheStore";

const ActiveCacheFile = derived(
	[ActiveMdFile, CacheStore],
	([$file, $cache]) => {
		if (!$file) return null;
		return {
			file: $file,
			cache: $cache.find((o) => o.fileId === $file.path),
		};
	}
);

export default ActiveCacheFile;
