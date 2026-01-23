import Sitemap from 'vite-plugin-sitemap'

export default ({ mode }) => ({
	site: {
		name: 'Methanol Docs',
		repoBase: 'https://github.com/SudoMaker/methanol-docs/tree/main/pages/'
	},
	pagefind: true,
	pwa: true,
	feed: {
		atom: true,
		siteUrl: 'https://methanol.sudomaker.com/'
	},
	vite: {
		plugins: [
			Sitemap({
				hostname: 'https://methanol.sudomaker.com'
			})
		]
	}
})
