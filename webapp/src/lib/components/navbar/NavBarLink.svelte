<script lang="ts">
	export let href: string = '/';
</script>

<a {href} class="self-center w-full h-full text-zinc-600 dark:text-zinc-400">
	<div class="h-full flex flex-col justify-center">
		<slot />
	</div>
</a>
