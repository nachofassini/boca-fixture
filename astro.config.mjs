// @ts-check
import { defineConfig } from 'astro/config'

// Salida estática para GitHub Pages del repo `nachofassini/boca-fixture`
// (https://nachofassini.github.io/boca-fixture/).
export default defineConfig({
	site: 'https://nachofassini.github.io',
	base: '/boca-fixture',
	trailingSlash: 'always',
	output: 'static',
	compressHTML: true,
	// Todo el CSS inline en el HTML (una sola request, igual que la página actual).
	build: { inlineStylesheets: 'always' },
})
