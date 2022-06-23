const InternalLinkExtension = {
	name: 'internal-link',
	level: 'inline',
	start(src: string) {
		return src.match(/^\[\[/)?.index;
	},
	tokenizer(src: string) {
		const match = src.match(/^\[\[([^\n]+?)]\]/);
		if (match) {
			console.log(match);
			return {
				type: 'internal-link',
				raw: match[0],
				text: match[1].trim()
			};
		}
		return false;
	}
};

export default [InternalLinkExtension];
