<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import NavBar from '$lib/components/navbar/NavBar.svelte';
	import NavBarLink from '$lib/components/navbar/NavBarLink.svelte';
	import LogoGithub from 'svelte-icons/io/IoLogoGithub.svelte';
	import '../app.css';
</script>

<div class="bg-white dark:bg-background-dark min-h-full">
	<div class="z-50 sticky top-0 w-full bg-white dark:bg-background-dark">
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
						<span class="h-7 text-black dark:text-zinc-300"><LogoGithub /></span>
					</NavBarLink>
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
