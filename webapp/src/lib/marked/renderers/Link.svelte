<script lang="ts">
	import LinkIcon from 'svelte-icons/md/MdOpenInNew.svelte';
	import InternalLink from './InternalLink.svelte';

	export let href = '';
	export let title: string;
	let isWebLink = true;

	$: if (href) {
		if (!href.match(/^http[s]?:\/\//)) {
			isWebLink = false;
		}
	}
</script>

{#if isWebLink}
	<span class="underline cursor-not-allowed inline-flex items-center font-normal">
		<a {href} {title} class="external-link text-[#705dcf]"><slot /></a>
		<span class="h-3 mb-2 text-zinc-400 ml-0.5"><LinkIcon /></span>
	</span>
{:else}
	<InternalLink useSlot><slot /></InternalLink>
{/if}
