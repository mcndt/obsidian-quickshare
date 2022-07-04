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

	// Auto-loaded from [id].ts endpoint
	export let note: EncryptedNote;
	let plaintext: string;
	let timeString: string;
	let decryptFailed = false;
	// let downloadUrl: string;
	let downloadRef: HTMLAnchorElement;

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
		const diff_ms = new Date().valueOf() - note.insert_time.valueOf();
		timeString = msToString(diff_ms);
	}

	// $: if (plaintext) {
	// 	downloadUrl = downloadMd(plaintext);
	// }

	// https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
	function downloadMd() {
		if (plaintext === undefined) return;
		// Make sure the browser reads the data as UTF-8
		// https://stackoverflow.com/questions/6672834/specifying-blob-encoding-in-google-chrome
		const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob = new Blob([BOM, plaintext], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);
		console.log(url);
		downloadRef.href = url;
		downloadRef.click();
		window.URL.revokeObjectURL(blob);
		return url;
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

{#if plaintext}
	<div class="max-w-2xl mx-auto">
		<p class="mb-4 text-sm flex justify-between text-zinc-500 dark:text-zinc-400">
			<span class="flex gap-1.5 items-center uppercase">
				<span class="h-5"><IconEncrypted /></span>
				<span>e2e encrypted | <span>Shared {timeString} ago</span></span>
			</span>
			<button on:click={downloadMd} class="flex gap-1.5 uppercase items-center hover:underline">
				<span>Raw Markdown</span>
				<span class="h-6"><LogoMarkdown /></span>
				<a hidden bind:this={downloadRef} href="./">.</a>
			</button>
		</p>
		<MarkdownRenderer {plaintext} />
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
