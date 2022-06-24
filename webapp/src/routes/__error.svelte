<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ error, status }) => {
		return {
			props: {
				title: `${status}: ${error?.message}`
			}
		};
	};
</script>

<script lang="ts">
	export let title: string;
</script>

<div class="prose max-w-2xl">
	<h1>{title}</h1>
</div>
