<script lang="ts">
	export let task: boolean;
	export let checked: boolean;
</script>

{#if task || checked}
	<li class="list-none translate-x-[-1.625em] leading-relaxed">
		<div class="inline-flex align-start justify-start items-start items-center">
			<div class="inline-block self-start mt-0.5 mr-2.5">
				<input
					type="checkbox"
					bind:checked
					value=""
					class="pointer-events-none w-4 h-4 accent-[#7b6cd9] text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
				/>
			</div>
			<slot />
		</div>
	</li>
{:else}
	<li><slot /></li>
{/if}
