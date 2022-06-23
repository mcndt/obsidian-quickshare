<script lang="ts">
	import FaRegQuestionCircle from 'svelte-icons/fa/FaRegQuestionCircle.svelte';

	export let text: string;
</script>

<dfn class="not-italic" title="Internal link">
	<span class="underline cursor-not-allowed inline-flex items-center">
		<span class="text-[#705dcf] opacity-50">{text}</span>
		<span class="h-3 mb-2 text-neutral-400 ml-0.5"><FaRegQuestionCircle /></span>
	</span>
</dfn>
