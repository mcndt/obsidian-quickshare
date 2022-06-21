<script lang="ts" id="MathJax-script">
	import { onMount } from 'svelte';
	import { AES, HmacSHA256, enc } from 'crypto-js';
	import SvelteMarkdown from 'svelte-markdown';
	import Heading from '$lib/renderers/Heading.svelte';
	import List from '$lib/renderers/List.svelte';

	import sample_crypto from './sample2.json';
	let plaintext: string = '';

	onMount(() => {
		plaintext = decrypt(sample_crypto);
	});

	function handleParsed(event: any) {
		//access tokens via event.detail.tokens
		console.log(event.detail.tokens);
	}

	// TODO: should be same source code as used in the plugin!!
	function decrypt(cryptData: { ciphertext: string; hmac: string; key: string }): string {
		const hmac_calculated = HmacSHA256(cryptData.ciphertext, cryptData.key).toString();
		const is_authentic = hmac_calculated == cryptData.hmac;

		if (!is_authentic) {
			throw Error('Cannot decrypt ciphertext with this key.');
		}
		const md = AES.decrypt(cryptData.ciphertext, cryptData.key).toString(enc.Utf8);
		return md;
	}
</script>

<div id="md-box" class="space-y-6">
	<SvelteMarkdown
		renderers={{ heading: Heading, list: List }}
		source={plaintext}
		on:parsed={handleParsed}
	/>
</div>

<style>
</style>
