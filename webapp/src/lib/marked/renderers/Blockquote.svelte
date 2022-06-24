<script lang="ts">
	export let raw: string;

	let isCallout = raw.split('\n')[0].match(/>\s?\[!(.+)\]\s(.*) /) != null;
</script>

{#if isCallout}
	<p>IS CALLOUT!!</p>
{:else}
	<p class="border border-l-4 ml-4 prose-p:my-2 prose-p:mx-4">
		<slot />
	</p>
{/if}
