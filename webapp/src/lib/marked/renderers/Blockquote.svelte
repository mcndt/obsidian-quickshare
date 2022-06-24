<script lang="ts">
	import Callout from './Callout.svelte';

	export let raw: string;

	let isCallout: boolean = raw.split('\n')[0].match(/>\s?\[!(.+)\](\s.*|$)/) != null;

	console.log(raw.split('\n')[0]);
</script>

{#if isCallout}
	<Callout>
		<slot />
	</Callout>
{:else}
	<p class="border border-l-4 ml-4 prose-p:my-2 prose-p:mx-4">
		<slot />
	</p>
{/if}
