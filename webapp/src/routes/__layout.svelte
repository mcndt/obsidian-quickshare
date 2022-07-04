<script lang="ts">
	import { browser } from '$app/env';

	import Footer from '$lib/components/Footer.svelte';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import NavBarLink from '$lib/components/navbar/NavBarLink.svelte';
	import ThemeToggle from '$lib/components/navbar/ThemeToggle.svelte';
	import LogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import '../app.css';

	let dark: boolean;
	let darkTheme = 'dark';

	$: getTheme();

	$: {
		if (browser) {
			console.log('saving dark mode');
			window.localStorage.setItem('isDarkMode', String(dark));
		}
	}

	async function getTheme() {
		if (browser) {
			const savedMode = window.localStorage.getItem('isDarkMode');
			dark = savedMode ? savedMode === 'true' : false;
			window.localStorage.setItem('isDarkMode', String(dark));
		}
	}
</script>

<svelte:head>
	<title>{import.meta.env.VITE_BRANDING}</title>
</svelte:head>

<div class=" h-full {dark !== undefined ? '' : 'hidden'} {dark ? darkTheme : ''}">
	<div class="bg-white dark:bg-background-dark min-h-full transition-colors">
		<div class="z-50 sticky top-0 w-full bg-white dark:bg-background-dark transition-colors">
			<div class="top-0 left-0 right-0">
				<NavBar>
					<svelte:fragment slot="left">
						<NavBarLink href="/about">About</NavBarLink>
						<NavBarLink href="/install">Get plugin</NavBarLink>
					</svelte:fragment>
					<svelte:fragment slot="right">
						<NavBarLink href="https://obsidian.md"
							><span class="text-[#705dcf] font-bold">Get Obsidian</span></NavBarLink
						>
						<NavBarLink href="https://github.com/mcndt/obsidian-note-sharing">
							<span class="h-6 text-black dark:text-zinc-300"><LogoGithub /></span>
						</NavBarLink>
						<ThemeToggle bind:dark />
					</svelte:fragment>
					></NavBar
				>
			</div>
		</div>

		<div class="container mx-auto max-w-4xl mx-auto mt-12 px-4 2xl:px-0 ">
			<slot />
			<div class="mt-12">
				<Footer />
			</div>
		</div>
	</div>
</div>
