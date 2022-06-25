<script lang="ts">
	// @ts-expect-error
	import katex from 'katex';
	export let math: string;
	export let displayMode = false;

	const options = {
		displayMode: displayMode,
		throwOnError: false
	};

	$: katexString = katex.renderToString(math, options);
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css"
		integrity="sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ"
		crossorigin="anonymous"
	/>
</svelte:head>

{@html katexString}
