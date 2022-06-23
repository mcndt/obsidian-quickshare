<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from '$lib/marked/renderers/Heading.svelte';
	import List from '$lib/marked/renderers/List.svelte';
	import InternalLink from '$lib/marked/renderers/InternalLink.svelte';
	import { marked } from 'marked';
	import extensions from '$lib/marked/extensions';

	export let plaintext: string;

	// @ts-ignore: typing mismatch
	marked.use({ extensions: extensions });

	const options = { ...marked.defaults, breaks: true };
</script>

<div
	id="md-box"
	class="prose max-w-none prose-li:my-0 prose-ul:mt-0 prose-ol:mt-0 leading-7
prose-strong:font-bold"
>
	<SvelteMarkdown
		renderers={{ heading: Heading, list: List, 'internal-link': InternalLink }}
		source={plaintext}
		{options}
	/>
</div>
