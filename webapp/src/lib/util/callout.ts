type calloutType = {
	color: string;
	icon: string;
};

const calloutTypes = {
	note: {
		color: 'callout-note',
		icon: 'note'
	},
	abstract: {
		color: 'callout-summary',
		icon: 'summary'
	},
	summary: {
		color: 'callout-summary',
		icon: 'summary'
	},
	tldr: {
		color: 'callout-summary',
		icon: 'summary'
	},
	info: {
		color: 'callout-info',
		icon: 'info'
	},
	todo: {
		color: 'callout-info',
		icon: 'todo'
	},
	tip: {
		color: 'callout-hint',
		icon: 'hint'
	},
	hint: {
		color: 'callout-hint',
		icon: 'hint'
	},
	important: {
		color: 'callout-hint',
		icon: 'hint'
	},
	success: {
		color: 'callout-success',
		icon: 'success'
	},
	check: {
		color: 'callout-success',
		icon: 'success'
	},
	done: {
		color: 'callout-success',
		icon: 'success'
	},
	question: {
		color: 'callout-question',
		icon: 'question'
	},
	help: {
		color: 'callout-question',
		icon: 'question'
	},
	faq: {
		color: 'callout-question',
		icon: 'question'
	},
	warning: {
		color: 'callout-warning',
		icon: 'warning'
	},
	caution: {
		color: 'callout-warning',
		icon: 'warning'
	},
	attention: {
		color: 'callout-warning',
		icon: 'warning'
	},
	failure: {
		color: 'callout-fail',
		icon: 'fail'
	},
	fail: {
		color: 'callout-fail',
		icon: 'fail'
	},
	missing: {
		color: 'callout-fail',
		icon: 'fail'
	},
	danger: {
		color: 'callout-error',
		icon: 'error'
	},
	error: {
		color: 'callout-error',
		icon: 'error'
	},
	bug: {
		color: 'callout-bug',
		icon: 'bug'
	},
	example: {
		color: 'callout-example',
		icon: 'example'
	},
	quote: {
		color: 'callout-quote',
		icon: 'quote'
	},
	cite: {
		color: 'callout-quote',
		icon: 'quote'
	}
};

export function getCalloutColor(typeString: string): string {
	// @ts-expect-error
	return calloutTypes[typeString.toLowerCase()]?.color ?? 'callout-note';
}

export function getCalloutIcon(typeString: string): string {
	// @ts-expect-error
	return calloutTypes[typeString.toLowerCase()]?.icon ?? 'note';
}
