<script lang="ts">
	export let href: string = '/';
</script>

<a
	{href}
	class="text-center py-4 px-2 md:py-0 md:px-0 self-center w-full h-full text-zinc-600 dark:text-zinc-400 border-b md:border-b-0 border-zinc-300"
>
	<div class="h-full flex flex-col justify-center">
		<slot />
	</div>
</a>
