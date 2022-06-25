<script lang="ts">
	import Katex from '$lib/components/Math.svelte';

	export let text: string;
</script>

<Katex math={text} displayMode />
