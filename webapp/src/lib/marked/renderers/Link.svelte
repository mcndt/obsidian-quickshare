<script lang="ts">
	export let href = '';
	export let title: string;
	// import LinkIcon from 'svelte-icons/fa/FaExternalLinkSquareAlt.svelte';
	// import LinkIcon from 'svelte-icons/fa/FaLink.svelte';
	import LinkIcon from 'svelte-icons/md/MdOpenInNew.svelte';
</script>

<!-- <a {href} {title}><slot /></a> -->

<span class="underline cursor-not-allowed inline-flex items-center font-normal">
	<a {href} {title} class="text-[#705dcf]"><slot /></a>
	<span class="h-3 mb-2 text-neutral-400 ml-0.5"><LinkIcon /></span>
</span>
