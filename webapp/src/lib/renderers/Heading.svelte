<script lang="ts">
	// import { getContext } from 'svelte';
	// import {  } from 'svelte-markdown';
	export let depth: number;
	export let raw: string;
	export let text: string;

	// const { slug, getOptions } = getContext(key);
	// const options = getOptions();

	$: id = undefined;
	// $: id = options.headerIds ? options.headerPrefix + slug(text) : undefined;
</script>

{#if depth === 1}
	<h1 {id} class="text-3xl font-bold"><slot /></h1>
{:else if depth === 2}
	<h2 {id} class="text-2xl font-bold"><slot /></h2>
{:else if depth === 3}
	<h3 {id} class="text-xl font-bold"><slot /></h3>
{:else if depth === 4}
	<h4 {id}><slot /></h4>
{:else if depth === 5}
	<h5 {id}><slot /></h5>
{:else if depth === 6}
	<h6 {id}><slot /></h6>
{:else}
	{raw}
{/if}
