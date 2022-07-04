<script context="module" , lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ props }) => {
		const note: EncryptedNote = props.note;
		const maxage = Math.floor((note.expire_time.valueOf() - note.insert_time.valueOf()) / 1000);
		return {
			status: 200,
			cache: {
				maxage: maxage,
				private: false
			},
			props: { note }
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import decrypt from '$lib/crypto/decrypt';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import LogoMarkdown from 'svelte-icons/io/IoLogoMarkdown.svelte';
	import IconEncrypted from 'svelte-icons/md/MdLockOutline.svelte';
	import type { EncryptedNote } from '$lib/model/EncryptedNote';
	import { browser } from '$app/env';
	import RawRenderer from '$lib/components/RawRenderer.svelte';
	import LogoDocument from 'svelte-icons/md/MdUndo.svelte';

	// Auto-loaded from [id].ts endpoint
	export let note: EncryptedNote;
	let plaintext: string;
	let timeString: string;
	let decryptFailed = false;
	let showRaw = false;

	onMount(() => {
		if (browser) {
			// Decrypt note
			const key = location.hash.slice(1);
			decrypt({ ...note, key })
				.then((value) => (plaintext = value))
				.catch(() => (decryptFailed = true));
		}
	});

	$: if (note.insert_time) {
		const diff_ms = new Date().valueOf() - new Date(note.insert_time).valueOf();
		timeString = msToString(diff_ms);
	}

	function toggleRaw() {
		showRaw = !showRaw;
	}

	function msToString(ms: number): string {
		const minutes = ms / 1000 / 60;
		if (minutes < 60) {
			return `${Math.floor(minutes)} minute${minutes >= 2 ? 's' : ''}`;
		}
		const hours = minutes / 60;
		if (hours < 24) {
			return `${Math.floor(hours)} hour${hours >= 2 ? 's' : ''}`;
		}
		const days = hours / 24;
		if (days < 30.42) {
			return `${Math.floor(days)} day${days >= 2 ? 's' : ''}`;
		}
		const months = days / 30.42;
		return `${Math.floor(months)} month${months >= 2 ? 's' : ''}`;
	}
</script>

<svelte:head>
	<title>{import.meta.env.VITE_BRANDING} | Shared note</title>
	{#if decryptFailed}
		<title>{import.meta.env.VITE_BRANDING} | Error decrypting note</title>
	{/if}
</svelte:head>

{#if plaintext}
	<div class="max-w-2xl mx-auto">
		<p class="mb-4 text-sm flex justify-between text-zinc-500 dark:text-zinc-400">
			<span class="flex gap-1.5 items-center uppercase">
				<span class="h-5"><IconEncrypted /></span>
				<span>e2e encrypted | <span>Shared {timeString} ago</span></span>
			</span>
			<button on:click={toggleRaw} class="flex gap-1.5 uppercase items-center hover:underline">
				{#if showRaw}
					<span class="h-6"><LogoDocument /> </span>
					<span>Render Document</span>
				{:else}
					<span>Raw Markdown</span>
					<span class="h-6"><LogoMarkdown /> </span>
				{/if}
			</button>
		</p>
		{#if showRaw}
			<RawRenderer>{plaintext}</RawRenderer>
		{:else}
			<MarkdownRenderer {plaintext} />
		{/if}
	</div>
{/if}

{#if decryptFailed}
	<div class="prose max-w-2xl prose-zinc dark:prose-invert">
		<h1>Error: Cannot decrypt file</h1>
		<p class="prose-xl">This note could not be decrypted with this link.</p>
		<p class="prose-xl">
			If you think this is an error, please double check that you copied the entire URL.
		</p>
	</div>
{/if}
