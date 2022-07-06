import { render, screen } from '@testing-library/svelte';
import { readMd } from './util';
import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

describe('rendering [md style](links)', async () => {
	const plaintext = await readMd('links.md');

	it('Renders URL-encoded internal links correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Classic internal link \(URL encoded\)$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Renders URL-encoded internal links correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Classic internal link \(tag format\)$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Renders http links correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/^Wikipedia \(http\)$/);
		expect(linkEl).toBeInTheDocument();
	});

	it('Renders https links correctly', async () => {
		render(MarkdownRenderer, { plaintext: plaintext });
		const linkEl = await screen.findByText(/Wikipedia \(https\)$/);
		expect(linkEl).toBeInTheDocument();
	});
});
