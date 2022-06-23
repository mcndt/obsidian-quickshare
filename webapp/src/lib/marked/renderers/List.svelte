<script lang="ts">
	export let ordered: boolean;
	export let start: number;
</script>

{#if ordered}
	<ol class="list-decimal list-inside" {start}><slot /></ol>
{:else}
	<ul class="list-disc list-inside"><slot /></ul>
{/if}
