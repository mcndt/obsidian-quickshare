<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ error, status }) => {
		let explainText = '';

		if (status == 404) {
			explainText = `No note was found for this link. It may be that the note that was once connected to this link has expired.`;
		}

		return {
			props: {
				title: `${status}: ${error?.message}`,
				explainText: explainText
			}
		};
	};
</script>

<script lang="ts">
	export let title: string;
	export let explainText: string;
</script>

<div class="prose max-w-2xl prose-zinc dark:prose-invert">
	<h1>{title}</h1>
	<p class="prose-xl">{explainText}</p>
</div>
