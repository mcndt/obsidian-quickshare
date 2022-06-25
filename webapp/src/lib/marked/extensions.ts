const InternalLinkExtension = {
	name: 'internal-link',
	level: 'inline',
	start(src: string) {
		return src.match(/^\[\[/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^\[\[([^\n]+?)]\]/);
		if (match) {
			return {
				type: 'internal-link',
				raw: match[0].trim(),
				text: match[1].trim()
			};
		}
		return false;
	}
};

const InternalEmbedExtension = {
	name: 'internal-embed',
	level: 'inline',
	start(src: string) {
		return src.match(/^!\[\[/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^!\[\[([^\n]+?)]\]/);
		if (match) {
			return {
				type: 'internal-embed',
				raw: match[0].trim(),
				text: match[1].trim()
			};
		}
		return false;
	}
};

const TagExtension = {
	name: 'tag',
	level: 'inline',
	start(src: string) {
		return src.match(/#/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^#([\w/]+)[\W\s]/);
		if (match) {
			return {
				type: 'tag',
				raw: match[0].trim(),
				text: match[1].trim()
			};
		}
		return false;
	}
};

const HighlightExtension = {
	name: 'highlight',
	level: 'inline',
	start(src: string) {
		// console.log(src);
		return src.match(/==/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^==(.+)==/);
		if (match) {
			return {
				type: 'highlight',
				raw: match[0].trim(),
				text: match[1].trim()
			};
		}
		return false;
	}
};

const MathInline = {
	name: 'math-inline',
	level: 'inline',
	start(src: string) {
		return src.indexOf('$');
	},

	tokenizer(src: string) {
		const match = src.match(/^(\${1})((?:\\.|.)*)\1/);
		console.log(src, match);
		if (match) {
			return {
				type: 'math-inline',
				raw: match[0],
				text: match[2].trim()
			};
		}
		return false;
	}
};

export default [
	InternalLinkExtension,
	InternalEmbedExtension,
	TagExtension,
	HighlightExtension,
	MathInline
];

// ^\#([\w\/]+)\W*
