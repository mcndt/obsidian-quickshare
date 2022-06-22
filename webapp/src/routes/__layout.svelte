<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';

	import '../app.css';
</script>

<div id="navbar" class="h-14 border-b border-neutral-200">
	<div
		id="navbar-content"
		class="h-full max-w-6xl mx-auto flex items-center justify-between content-center"
	>
		<div id="navbar-left" class="flex gap-8 flex">
			<span id="name" class="font-extrabold text-lg">[Obsidian Note Sharing]</span>
			<ul class="flex gap-5 content-center">
				<li class="hidden lg:block self-center">Install</li>
				<li class="hidden lg:block self-center">About</li>
			</ul>
		</div>
		<div id="navbar-right">test</div>
	</div>
</div>

<div class="container mx-auto max-w-2xl mx-auto mt-6 px-4 2xl:px-0">
	<slot />
	<Footer />
</div>
