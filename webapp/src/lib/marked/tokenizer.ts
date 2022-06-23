// Override function
const tokenizer = {
	// Obsidian [[internal links]]
	link(src: string) {
		const match = src.match(/\[\[([^\n]+?)]\]/);
		if (match) {
			return {
				type: 'internal-link',
				raw: match[0],
				text: match[1].trim()
			};
		}
		return false;
	}
};

export default tokenizer;
