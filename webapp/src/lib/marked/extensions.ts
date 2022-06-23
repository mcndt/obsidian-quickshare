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

const TagExtension = {
	name: 'tag',
	level: 'inline',
	start(src: string) {
		return src.match(/#/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^#([\w/]+)[\W\s]/);
		if (match) {
			console.log(match);
			return {
				type: 'tag',
				raw: match[0].trim(),
				text: match[1].trim()
			};
		}
		return false;
	}
};

export default [InternalLinkExtension, TagExtension];

// ^\#([\w\/]+)\W*
