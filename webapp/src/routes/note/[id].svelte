<script context="module" , lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { EncryptedNote } from '$lib/model/EncryptedNote';

	export const load: Load = async ({ params, fetch, session, stuff }) => {
		const url = `${import.meta.env.VITE_BACKEND_URL}/note/${params.id}`;
		const response = await fetch(url);

		if (response.ok) {
			try {
				const note: EncryptedNote = await response.json();
				note.insert_time = new Date(note.insert_time as unknown as string);
				note.expire_time = new Date(note.expire_time as unknown as string);
				const maxage = Math.floor((note.expire_time.valueOf() - note.insert_time.valueOf()) / 1000);
				return {
					status: response.status,
					cache: {
						maxage: maxage,
						private: false
					},
					props: { note }
				};
			} catch {
				return {
					status: 500,
					error: response.statusText
				};
			}
		} else {
			return {
				status: response.status,
				error: response.statusText
			};
		}
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import decrypt from '$lib/crypto/decrypt';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
	import LogoMarkdown from 'svelte-icons/io/IoLogoMarkdown.svelte';
	import IconEncrypted from 'svelte-icons/md/MdLockOutline.svelte';

	export let note: EncryptedNote;
	let plaintext: string;
	let timeString: string;
	let decryptFailed = false;
	let downloadUrl: string;

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

	$: if (plaintext) {
		downloadUrl = getDownloadUrl(plaintext);
	}

	// https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
	function getDownloadUrl(text: string): string {
		// Make sure the browser reads the data as UTF-8
		// https://stackoverflow.com/questions/6672834/specifying-blob-encoding-in-google-chrome
		const BOM = new Uint8Array([0xef, 0xbb, 0xbf]);
		const blob = new Blob([BOM, text], { type: 'text/plain' });
		const url = window.URL.createObjectURL(blob);
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
		<p class="mb-4 text-sm flex justify-between text-neutral-500">
			<span class="flex gap-1.5 items-center uppercase">
				<span class="h-5"><IconEncrypted /></span>
				<span>e2e encrypted | <span>Shared {timeString} ago</span></span>
			</span>
			<a href={downloadUrl} class="flex gap-1.5 uppercase items-center">
				<span>Raw Markdown</span>
				<span class="h-6"><LogoMarkdown /></span>
			</a>
		</p>
		<MarkdownRenderer {plaintext} />
	</div>
{/if}

{#if decryptFailed}
	<div class="prose max-w-2xl">
		<h1>Error: Cannot decrypt file</h1>
		<p class="prose-xl">This note could not be decrypted with this link.</p>
		<p class="prose-xl">
			If you think this is an error, please double check that you copied the entire URL.
		</p>
	</div>
{/if}
