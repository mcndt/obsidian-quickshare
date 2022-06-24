<script lang="ts">
	import { onMount } from 'svelte';

	let title: string;
	let type = '???';

	let color = '#448aff';

	let content: HTMLElement;

	$: if (content) {
		const titleElement = content.getElementsByTagName('p')[0];
		console.log(titleElement.innerText.split('\n')[0]);
		const match = titleElement.innerText.split('\n')[0].match(/\[!(.+)\](\s([\w\s]+))?/);
		console.log(match);
		if (match) {
			console.log(match.length);
			type = match[1];
			title = match[2] ?? '';
			console.log(title);
		}
	}

	// onMount(() => {
	// 	console.log('mounted');
	// });
</script>

<div class="border-l-4 border-l-[#448aff] bg-neutral-100 my-4">
	<div class="p-[10px] bg-[{color}]/10">
		<span class="font-bold text-md">[{type}]</span>
		<span class="font-bold text-md">{title}</span>
	</div>
	<div bind:this={content} class="prose-p:my-0 prose-p:mx-0 py-4 px-3">
		<slot />
	</div>
</div>
