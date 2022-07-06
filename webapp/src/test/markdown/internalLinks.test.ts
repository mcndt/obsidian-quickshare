import { render, screen } from '@testing-library/svelte';
import { readMd } from './util';
import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

// rendering links
describe('rendering [[internal]] links', async () => {
	const plaintext = await readMd('links.md');

	it('Renders [[links]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Normal internal link$/);
		expect(linkEl).toBeInTheDocument();
		expect(linkEl).toHaveClass('internal-link');
	});

	it('Renders [[links|with alias]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Link with alias$/);
		expect(linkEl).toBeInTheDocument();
		expect(linkEl).toHaveClass('internal-link');
	});

	it('Renders [[links#heading]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Page with headings > heading A$/);
		expect(linkEl).toBeInTheDocument();
		expect(linkEl).toHaveClass('internal-link');
	});

	it('Renders [[links#heading|with alias]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Link with heading alias$/);
		expect(linkEl).toBeInTheDocument();
		expect(linkEl).toHaveClass('internal-link');
	});

	it('Renders [[links#heading|with alias#fakeheading]] correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Link with heading alias#false heading$/);
		expect(linkEl).toBeInTheDocument();
		expect(linkEl).toHaveClass('internal-link');
	});

	it('Does not render [[]] empty links', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const textEl = await screen.findByText('[[]]', { exact: false });
		expect(textEl).toBeInTheDocument();
		expect(textEl).not.toHaveClass('internal-link');
	});
});
