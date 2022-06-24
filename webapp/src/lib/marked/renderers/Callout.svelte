<script lang="ts">
	import { onMount } from 'svelte';

	let title: string;
	let type = '???';

	let color = '#448aff';

	let content: HTMLElement;

	$: if (content) {
		const titleElement = content.getElementsByTagName('p')[0];
		const match = titleElement.innerText.split('\n')[0].match(/\[!(.+)\](\s([\w\s]+))?/);
		if (match) {
			type = match[1]?.trim();
			title = match[2]?.trim() ?? '';
		}
		// Remove title from content
		const pos = titleElement.innerHTML.indexOf('<br>');
		if (pos >= 0) {
			titleElement.innerHTML = titleElement.innerHTML.substring(pos + 4);
		} else {
			titleElement.innerHTML = '';
		}
	}
</script>

<div class="border-l-4 border-l-callout bg-neutral-100 my-4">
	<div class="p-[10px] bg-callout-bg">
		<span class="font-bold text-md">[{type}]</span>
		<span class="font-bold text-md">{title}</span>
	</div>
	<div bind:this={content} class="prose-p:my-0 prose-p:mx-0 py-4 px-3">
		<slot />
	</div>
</div>
