<div id="navbar" class="h-14 border-b border-zinc-200 dark:border-zinc-700 transition-colors">
	<div
		id="navbar-content"
		class="h-full px-4 6xl:px-0 max-w-6xl mx-auto flex items-center justify-between content-center whitespace-nowrap"
	>
		<div id="navbar-left" class="flex gap-4">
			<a href="/" class="self-center h-full pb-0.5">
				<span id="name" class="self-center font-bold text-lg dark:text-white"
					>📝 {import.meta.env.VITE_BRANDING}</span
				>
			</a>
			<ul class="flex gap-4 content-center">
				<slot name="left" />
			</ul>
		</div>
		<div id="navbar-right" class="flex gap-8 flex">
			<ul class="flex gap-2.5 content-center">
				<slot name="right" />
			</ul>
		</div>
	</div>
</div>
