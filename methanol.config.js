import { common } from '@wooorm/starry-night'
import sourceMdx from '@wooorm/starry-night/source.mdx'

import Sitemap from 'vite-plugin-sitemap'

export default ({ mode }) => ({
	site: {
		name: 'Methanol Docs',
		repoBase: 'https://github.com/SudoMaker/methanol-docs/tree/main/pages/'
	},
	starryNight: {
		grammars: [...common, sourceMdx]
	},
	pagefind: true,
	pwa: true,
	vite: {
		plugins: [
			Sitemap({
				hostname: 'https://methanol.sudomaker.com'
			})
		]
	}
})
