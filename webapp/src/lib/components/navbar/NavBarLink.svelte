<script lang="ts">
	export let href: string = '/';
</script>

<a {href} class="self-center w-full h-full text-neutral-600">
	<div class="h-full flex flex-col justify-center">
		<slot />
	</div>
</a>
