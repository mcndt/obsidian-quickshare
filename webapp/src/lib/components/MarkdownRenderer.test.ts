import { readFile } from 'fs/promises';
import { join } from 'path';
import { render, screen } from '@testing-library/svelte';
import MarkdownRenderer from './MarkdownRenderer.svelte';

const TEST_FILES_DIR = 'test/markdown/';

describe('Callout rendering', () => {
	it('Renders callout correctly ', async () => {
		const plaintext = await readMd('callout.md');

		render(MarkdownRenderer, { plaintext: plaintext });

		// Expect title to be correct.
		const titleEl = await screen.findByText('Don!t forget to account for non-letters! //fsd \\n');
		expect(titleEl).toBeInTheDocument();
		expect(titleEl).toHaveClass('callout-title');

		// Expect content to be correct.
		expect(await screen.findByText('Sample text.')).toBeInTheDocument();
		expect((await screen.findByText('Sample text.')).parentNode).toHaveClass('callout-content');
	});
});

async function readMd(file: string) {
	return await readFile(join(TEST_FILES_DIR, file), { encoding: 'utf8' });
}
