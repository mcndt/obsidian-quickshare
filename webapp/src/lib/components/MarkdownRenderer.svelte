<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from '$lib/renderers/Heading.svelte';
	import List from '$lib/renderers/List.svelte';

	export let plaintext: string;
</script>

<div
	id="md-box"
	class="prose max-w-none prose-li:my-0 prose-ul:mt-0 prose-ol:mt-0 leading-7
prose-strong:font-bold"
>
	<SvelteMarkdown renderers={{ heading: Heading, list: List }} source={plaintext} />
</div>
