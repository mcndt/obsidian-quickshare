<script>
	import NavBarLink from './NavBarLink.svelte';
	import FaGithub from 'svelte-icons/fa/FaGithub.svelte';
</script>

<div id="navbar" class="h-14 border-b border-neutral-200">
	<div
		id="navbar-content"
		class="h-full px-4 6xl:px-0 max-w-6xl mx-auto flex items-center justify-between content-center"
	>
		<div id="navbar-left" class="flex gap-8 flex">
			<a href="/">
				<span id="name" class="font-extrabold text-lg">[Obsidian Note Sharing]</span>
			</a>
			<ul class="flex gap-5 content-center">
				<slot name="left" />
			</ul>
		</div>
		<div id="navbar-right" class="flex gap-8 flex">
			<ul class="flex gap-5 content-center">
				<slot name="right" />
			</ul>
		</div>
	</div>
</div>
