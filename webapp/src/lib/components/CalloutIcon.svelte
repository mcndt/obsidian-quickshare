<script lang="ts">
	import NoteIcon from 'svelte-icons/md/MdCreate.svelte';
	import SummaryIcon from 'svelte-icons/md/MdFormatListBulleted.svelte';
	import InfoIcon from 'svelte-icons/md/MdInfoOutline.svelte';
	import TodoIcon from 'svelte-icons/md/MdPlaylistAddCheck.svelte';
	// import HintIcon from 'svelte-icons/md/MdLightbulbOutline.svelte';
	import HintIcon from 'svelte-icons/md/MdWhatshot.svelte';
	import CheckIcon from 'svelte-icons/md/MdCheck.svelte';
	import QuestionIcon from 'svelte-icons/md/MdHelpOutline.svelte';
	import WarningIcon from 'svelte-icons/md/MdWarning.svelte';
	import FailIcon from 'svelte-icons/md/MdClose.svelte';
	import ErrorIcon from 'svelte-icons/md/MdErrorOutline.svelte';
	import BugIcon from 'svelte-icons/md/MdBugReport.svelte';
	import QuoteIcon from 'svelte-icons/md/MdFormatQuote.svelte';
	export let icon: string;

	console.log(icon);
</script>

{#if icon == 'note'}
	<NoteIcon />
{:else if icon == 'summary'}
	<SummaryIcon />
{:else if icon == 'info'}
	<InfoIcon />
{:else if icon == 'todo'}
	<TodoIcon />
{:else if icon == 'hint'}
	<HintIcon />
{:else if icon == 'success'}
	<CheckIcon />
{:else if icon == 'question'}
	<QuestionIcon />
{:else if icon == 'warning'}
	<WarningIcon />
{:else if icon == 'fail'}
	<FailIcon />
{:else if icon == 'error'}
	<ErrorIcon />
{:else if icon == 'bug'}
	<BugIcon />
{:else if icon == 'example'}
	<SummaryIcon />
{:else if icon == 'quote'}
	<QuoteIcon />
{:else}
	<NoteIcon />
{/if}
