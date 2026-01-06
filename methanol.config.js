import { common } from '@wooorm/starry-night'
import sourceMdx from '@wooorm/starry-night/source.mdx'

import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'

export default ({ mode }) => ({
	site: {
		name: 'Methanol Docs'
	},
	starryNight: {
		grammars: [...common, sourceMdx]
	},
	pagefind: true,
	vite: {
		plugins: [
			VitePWA({
				injectRegister: 'auto',
				registerType: 'autoUpdate',
				workbox: {
					globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
					navigateFallback: '/404.html',
					ignoreURLParametersMatching: [/./]
				}
			}),
			Sitemap({
				hostname: 'https://methanol.netlify.app'
			})
		]
	}
})
