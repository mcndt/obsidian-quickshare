<script lang="ts">
	import DarkIcon from 'svelte-icons/io/IoMdMoon.svelte';
	import LightIcon from 'svelte-icons/io/IoMdSunny.svelte';

	export let dark: boolean;

	function onClick() {
		dark = !dark;
	}
</script>

<button
	on:click={onClick}
	class="py-4 px-2 md:py-0 md:px-0 self-center w-full h-full text-zinc-600 dark:text-zinc-400 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5"
>
	<div class="h-full flex flex-col justify-center">
		<span class="h-6 text-black dark:text-zinc-300">
			{#if dark}
				<LightIcon />
			{:else}
				<DarkIcon />
			{/if}
		</span>
	</div>
</button>
