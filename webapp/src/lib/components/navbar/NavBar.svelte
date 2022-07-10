<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import FaBars from 'svelte-icons/fa/FaBars.svelte';

	export let showMobileMenu = false;

	const mediaQueryHandler = (e: MediaQueryListEvent) => {
		if (!e.matches) {
			showMobileMenu = false;
		}
	};

	onMount(() => {
		const mediaListener = window.matchMedia('(max-width: 767px)');
		mediaListener.addEventListener('change', mediaQueryHandler);
		return () => mediaListener.removeEventListener('change', mediaQueryHandler);
	});
</script>

<div
	id="navbar"
	class="h-[65px] md:h-14 border-b border-zinc-200 dark:border-zinc-700 transition-colors"
>
	<div
		id="navbar-content"
		class="h-full px-4 6xl:px-0 max-w-6xl mx-auto flex items-center justify-between content-center whitespace-nowrap"
	>
		<div id="navbar-left" class="flex gap-4">
			<a href="/" class="self-center h-full pb-0.5">
				<span id="name" class="self-center font-bold text-xl md:text-lg dark:text-white"
					>📝 {import.meta.env.VITE_BRANDING}</span
				>
			</a>
			<ul class="hidden md:flex gap-4 content-center">
				<slot name="left" />
			</ul>
		</div>
		<div id="navbar-right" class="hidden md:block flex gap-8 flex">
			<ul class="flex gap-4 content-center">
				<slot name="right" />
			</ul>
		</div>
		<div class="md:hidden ml-6 cursor-pointer text-text-muted hover:text-text-normal w-6">
			<button
				aria-label="navigation menu"
				on:click={() => (showMobileMenu = !showMobileMenu)}
				class="flex flex-col justify-center text-zinc-500 dark:text-zinc-400"><FaBars /></button
			>
		</div>
	</div>
</div>

{#if showMobileMenu}
	<div
		transition:slide
		class="fixed top-[65px] w-full sm:w-72 sm:right-1
		rounded-lg"
	>
		<div
			class="bg-zinc-200 dark:bg-zinc-700 relative mt-2 mx-2 px-4 py-2 rounded-[20px] shadow-md sm:shadow-lg"
		>
			<div
				on:click={() => (showMobileMenu = !showMobileMenu)}
				class="flex flex-col gap-0 text-xl dark:text-zinc-200"
			>
				<slot name="left" />
				<slot name="right" />
			</div>
		</div>
	</div>
{/if}
