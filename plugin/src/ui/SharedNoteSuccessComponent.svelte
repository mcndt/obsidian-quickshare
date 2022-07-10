<script lang="ts">
	import moment, { type Moment } from "moment";

	export let url: string;
	export let expireTime: Moment;

	let buttonText = "Copy";
	let buttonTextTimeout: string | number | NodeJS.Timeout;

	function onCopy() {
		clearTimeout(buttonTextTimeout);
		navigator.clipboard.writeText(url);
		buttonText = "Copied";

		buttonTextTimeout = setTimeout(() => {
			buttonText = "copy";
		}, 1500);
	}

	function onOpen() {
		window.open(url, "_blank");
	}
</script>

<div class="share-plugin-modal-container">
	<p id="copytext">
		Your note has been encrypted and stored in the cloud. Only people with
		this share link can decrypt and read this file.
	</p>
	<div id="url">
		<input disabled id="url-input" type="text" bind:value={url} />
		<button
			class="url-button"
			aria-label="Copy link to clipboard"
			on:click={onCopy}>{buttonText}</button
		>
		<button
			class="url-button"
			aria-label="Copy link to clipboard"
			on:click={onOpen}>Open</button
		>
	</div>
	<p id="subtext">
		🔐 End-to-end encrypted • Expires in {expireTime.diff(
			moment(),
			"days"
		) + 1}
		days
	</p>
</div>

<style scoped>
	.share-plugin-modal-container {
		max-width: 560px;
	}

	#copytext {
		width: 100%;
	}

	#url {
		width: 100%;
		display: flex;
		gap: 0.5em;
	}

	#url-input {
		flex-grow: 1;
		text-decoration-line: underline;
		cursor: pointer !important;
	}

	.url-button {
		margin: 0px;
		width: 5em;
	}

	#subtext {
		/* container */
		margin: 0.5em 1px;
		/* text styling */
		color: var(--text-muted);
		font-size: 0.9em;
	}
</style>
