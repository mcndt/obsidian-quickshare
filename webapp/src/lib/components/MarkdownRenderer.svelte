<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from '$lib/renderers/Heading.svelte';
	import List from '$lib/renderers/List.svelte';

	export let plaintext: string;
</script>

<div id="md-box" class="space-y-6">
	<SvelteMarkdown renderers={{ heading: Heading, list: List }} source={plaintext} />
</div>
