// Se corre en el workflow ANTES del build. Elige los datos más recientes entre:
//   - fixtures.json (raíz): lo escribe el job de Kody mientras no migre,
//   - src/data/fixtures.json: lo escribe el job de Kody una vez migrado (y es la copia versionada del sitio).
// Gana el de `updatedAt` más nuevo, así funciona en cualquier orden de migración. Solo modifica el checkout del workflow.
import { readFileSync, copyFileSync } from 'node:fs'

const ROOT = 'fixtures.json'
const SRC = 'src/data/fixtures.json'
const read = (p) => {
	try {
		const d = JSON.parse(readFileSync(p, 'utf8'))
		const t = Date.parse(d.updatedAt)
		return Array.isArray(d.matches) && Number.isFinite(t) ? { t, n: d.matches.length } : null
	} catch { return null }
}
const root = read(ROOT)
const src = read(SRC)
if (!src && !root) { console.error(`No hay datos válidos en ${SRC} ni en ${ROOT}`); process.exit(1) }
if (root && (!src || root.t > src.t)) {
	copyFileSync(ROOT, SRC)
	console.log(`Datos: ${ROOT} (más reciente, ${new Date(root.t).toISOString()}) -> ${SRC}`)
} else {
	console.log(`Datos: ${SRC} (${new Date(src.t).toISOString()})${root ? `; ${ROOT} es igual o más viejo` : ''}`)
}
