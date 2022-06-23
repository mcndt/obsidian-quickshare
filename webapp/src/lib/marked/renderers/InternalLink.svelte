<script lang="ts">
	import Link from 'svelte-icons/io/IoIosLink.svelte';

	export let text: string;
</script>

<span class="text-blue-400 underline cursor-not-allowed">
	<dfn class="not-italic" title="Internal links are not shared."> {text}</dfn></span
>
