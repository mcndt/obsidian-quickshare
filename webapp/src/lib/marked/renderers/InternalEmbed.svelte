<script lang="ts">
	import EmbedIcon from 'svelte-icons/md/MdAttachment.svelte';
	import FaRegQuestionCircle from 'svelte-icons/fa/FaRegQuestionCircle.svelte';

	export let text: string;
</script>

<div>
	<dfn class="not-italic" title="Interal embeds are not shared currently.">
		<div
			class="px-4 py-12 border border-zinc-300 dark:border-zinc-600 inline-flex flex-col items-center justify-center"
		>
			<span class="h-8 text-zinc-400 ml-0.5 inline-flex items-center whitespace-nowrap gap-1"
				><span class="w-8 h-8 inline-block">
					<EmbedIcon />
				</span>
				<span>Internal embed</span>
			</span>
			<span class="underline cursor-not-allowed inline-flex items-center">
				<span class="text-[#705dcf] opacity-50">{text}</span>
				<span class="inline-block w-3 h-3 mb-2 text-zinc-400 ml-0.5"><FaRegQuestionCircle /></span>
			</span>
		</div>
	</dfn>
</div>
