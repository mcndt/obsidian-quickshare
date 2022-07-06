import { readFile } from 'fs/promises';
import { join } from 'path';

const TEST_FILES_DIR = 'src/test/markdown/input/';

export async function readMd(file: string) {
	return await readFile(join(TEST_FILES_DIR, file), { encoding: 'utf8' });
}
