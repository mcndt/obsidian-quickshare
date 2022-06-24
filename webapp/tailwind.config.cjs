/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				callout: 'rgb(var(--callout-color))',
				'callout-bg': 'rgba(var(--callout-color), 0.1)'
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
