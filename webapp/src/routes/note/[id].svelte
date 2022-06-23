<script context="module" , lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { EncryptedNote } from '$lib/model/EncryptedNote';

	export const load: Load = async ({ params, fetch, session, stuff }) => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/note/${params.id}`;
		const response = await fetch(url);
		const note: EncryptedNote = await response.json();

		note.insert_time = new Date(note.insert_time as unknown as string);

		return {
			status: response.status,
			props: { note }
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import decrypt from '$lib/crypto/decrypt';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import LogoMarkdown from 'svelte-icons/io/IoLogoMarkdown.svelte';

	export let note: EncryptedNote;
	let plaintext: string;

	onMount(() => {
		if (browser) {
			// Decrypt note
			const key = location.hash.slice(1);
			const start = performance.now();
			plaintext = decrypt({ ...note, key });
			console.log(performance.now() - start);
		}
		console.log(note.insert_time);
	});
</script>

<div class="max-w-2xl mx-auto">
	<p class="mb-4 text-sm flex justify-between text-neutral-500">
		<span class="uppercase">Shared ?? days ago</span>
		<button class="flex gap-2 uppercase items-center">
			<span>Raw Markdown</span>
			<span class="h-6"><LogoMarkdown /></span>
		</button>
	</p>

	{#if plaintext}
		<MarkdownRenderer {plaintext} />
	{/if}
</div>
