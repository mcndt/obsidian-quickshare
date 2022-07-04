import { readFile } from 'fs/promises';
import { join } from 'path';
import { render, screen } from '@testing-library/svelte';
import MarkdownRenderer from './MarkdownRenderer.svelte';

const TEST_FILES_DIR = 'test/markdown/';

// rendering links
describe('rendering [[internal]] links', async () => {
	const plaintext = await readMd('links.md');

	it('Renders [[links]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Normal internal link$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Renders [[links|with alias]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Link with alias$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Renders [[links#heading]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Page with headings > heading A$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Renders [[links#heading|with alias]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Link with heading alias$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Renders [[links#heading|with alias#fakeheading]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Link with heading alias#false heading$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Does not render [[]] empty links', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const textEl = await screen.findByText('[[]]', { exact: false });
		expect(textEl).toBeInTheDocument();
	});
});

describe('rendering [md style](links)', async () => {
	const plaintext = await readMd('links.md');

	it('Renders URL-encoded internal links correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Classic internal link (URL encoded)$/);
		expect(linkEl).toBeInTheDocument();
	});
});

describe('Rendering callouts', async () => {
	const plaintext = await readMd('callout.md');

	it('Renders callout title correctly ', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const titleEl = await screen.findByText('Don!t forget to account for non-letters! //fsd \\n');
		expect(titleEl).toBeInTheDocument();
		expect(titleEl).toHaveClass('callout-title');
	});

	it('Renders callout content correctly ', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const contentEl = await screen.findByText('Sample text.');
		expect(contentEl).toBeInTheDocument();
		expect(contentEl.parentElement).toHaveClass('callout-content');
	});
});

async function readMd(file: string) {
	return await readFile(join(TEST_FILES_DIR, file), { encoding: 'utf8' });
}
