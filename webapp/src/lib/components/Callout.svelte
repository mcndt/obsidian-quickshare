<script lang="ts">
	import { getCalloutColor, getCalloutIcon } from '$lib/util/callout';
	import CalloutIcon from '$lib/components/CalloutIcon.svelte';

	let title = '';
	let type = 'note';
	let color = '--callout-warning';
	let icon = 'note';
	let init = false;

	let content: HTMLElement;

	$: console.log(content);

	$: if (content) {
		const titleElement = content.getElementsByTagName('p')[0];
		const match = titleElement.innerText.split('\n')[0].match(/\[!(.+)\](?:\s(.+))?/);
		if (match) {
			type = match[1]?.trim();
			title = match[2]?.trim() ?? type[0].toUpperCase() + type.substring(1).toLowerCase();
		}

		color = `--${getCalloutColor(type)}`;
		icon = getCalloutIcon(type);

		// Remove title from content
		const pos = titleElement.innerHTML.indexOf('<br>');
		if (pos >= 0) {
			titleElement.innerHTML = titleElement.innerHTML.substring(pos + 4);
		} else {
			titleElement.innerHTML = '';
		}
		init = true;
	}
</script>

<div
	style="--callout-color: var({color})"
	class="border-l-4 border-l-callout bg-zinc-100 dark:bg-zinc-800 my-4"
>
	<div class="p-[10px] bg-callout-bg flex items-center gap-2">
		<span class="callout-icon font-bold text-md text-callout h-5"><CalloutIcon {icon} /></span>
		<span class="callout-title font-bold text-md">{title}</span>
	</div>
	<div bind:this={content} class="callout-content prose-p:my-0 prose-p:mx-0 py-4 px-3">
		<slot />
	</div>
</div>
