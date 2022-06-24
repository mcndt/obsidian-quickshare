type calloutType = {
	color: string;
	icon: string;
};

const calloutTypes = {
	note: {
		color: 'callout-note',
		icon: ''
	},
	abstract: {
		color: 'callout-summary',
		icon: ''
	},
	summary: {
		color: 'callout-summary',
		icon: ''
	},
	tldr: {
		color: 'callout-summary',
		icon: ''
	},
	info: {
		color: 'callout-info',
		icon: ''
	},
	todo: {
		color: 'callout-info',
		icon: ''
	},
	tip: {
		color: 'callout-hint',
		icon: ''
	},
	hint: {
		color: 'callout-hint',
		icon: ''
	},
	important: {
		color: 'callout-hint',
		icon: ''
	},
	success: {
		color: 'callout-success',
		icon: ''
	},
	check: {
		color: 'callout-success',
		icon: ''
	},
	done: {
		color: 'callout-success',
		icon: ''
	},
	question: {
		color: 'callout-question',
		icon: ''
	},
	help: {
		color: 'callout-question',
		icon: ''
	},
	faq: {
		color: 'callout-question',
		icon: ''
	},
	warning: {
		color: 'callout-warning',
		icon: ''
	},
	caution: {
		color: 'callout-warning',
		icon: ''
	},
	attention: {
		color: 'callout-warning',
		icon: ''
	},
	failure: {
		color: 'callout-fail',
		icon: ''
	},
	fail: {
		color: 'callout-fail',
		icon: ''
	},
	missing: {
		color: 'callout-fail',
		icon: ''
	},
	danger: {
		color: 'callout-error',
		icon: ''
	},
	error: {
		color: 'callout-error',
		icon: ''
	},
	bug: {
		color: 'callout-bug',
		icon: ''
	},
	example: {
		color: 'callout-example',
		icon: ''
	},
	quote: {
		color: 'callout-quote',
		icon: ''
	},
	cite: {
		color: 'callout-quote',
		icon: ''
	}
};

export function getCalloutType(typeString: string): calloutType {
	return 'note';
}

export function getCalloutColor(): string {
	return '';
}
