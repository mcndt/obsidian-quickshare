<script lang="ts">
	export let ordered: boolean;
	export let start: number;
</script>

<!-- Styling is taken care of by Tailwind Typography plugin -->
{#if ordered}
	<ol><slot /></ol>
{:else}
	<ul><slot /></ul>
{/if}
