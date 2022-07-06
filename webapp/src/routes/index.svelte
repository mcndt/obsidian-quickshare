<script>
	import Tile from '$lib/components/index/tile.svelte';
</script>

<svelte:head>
	<title>{import.meta.env.VITE_BRANDING} | Create share links for Obsidian in one click</title>
</svelte:head>

<!-- <div class="prose dark:prose-invert">
	<h1>{import.meta.env.VITE_BRANDING}</h1>
	<p class="prose-lg">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
		non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	</p>
</div> -->

<article class="mx-auto max-w-4xl text-zinc-900 dark:text-zinc-100">
	<div class="space-y-6 pt-24 pb-32">
		<h1 id="title" class="font-extrabold text-5xl text-center">
			Securely share your <span class="text-[#705dcf]">Obsidian</span> notes with one click.
		</h1>
		<p id="tagline" class="prose-2xl text-center text-zinc-700 dark:text-zinc-300">
			Zero configuration. End-to-end encrypted. <br />No account needed.
		</p>
		<p id="install-button" class="text-center pt-2">
			<a href="/install">
				<button
					class="py-1.5 px-4 rounded-lg border-2 border-[#705dcf] text-[#705dcf] font-semibold hover:bg-[#705dcf] hover:text-white transition-colors"
					>Install plugin</button
				>
			</a>
		</p>
	</div>

	<hr class="border-zinc-200 dark:border-zinc-700 transition-colors" />

	<div class="space-y-8 pt-24 pb-16">
		<div class="flex flex-row gap-4 mx-auto justify-center">
			<Tile>
				<h2 slot="title">End-to-end encrypted</h2>
				<p slot="text">
					Your notes are stored securely using strong <strong>AES256-CBC encryption</strong>. The
					decryption key is never sent to the server, so not even the server can open your notes.
				</p>
			</Tile>
			<img src="/encrypted.svg" alt="encrypted-art" class="w-80" />
		</div>

		<div class="flex flex-row gap-4 mx-auto justify-center flex-row-reverse">
			<Tile>
				<h2 slot="title">Zero configuration</h2>
				<p slot="text">
					Other plugins require integration with GitHub Gist or Notion using your API keys.
					Noteshare.space is a <strong>dedicated service</strong> for sharing your Markdown notes. No
					account is needed to use our service.
				</p>
			</Tile>
			<img src="/zeroconfig.svg" alt="encrypted-art" class="w-80" />
		</div>

		<div class="flex flex-row gap-4 mx-auto justify-center">
			<Tile>
				<h2 slot="title">Open source</h2>
				<p slot="text">
					Want to verify the security of the encryption mechanism? Or host your own instance?
					Noteshare.space is completely <a
						class="underline"
						href="https://github.com/mcndt/obsidian-note-sharing">open-source</a
					> under the MIT license.
				</p>
			</Tile>
			<img src="/opensource.svg" alt="encrypted-art" class="w-80" />
		</div>
	</div>
</article>
