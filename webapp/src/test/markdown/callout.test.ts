import { render, screen } from '@testing-library/svelte';
import { readMd } from './util';
import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

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
