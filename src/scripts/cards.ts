// Mejora progresiva (el HTML funciona sin JS). Mismo comportamiento que la página actual:
//  1) escudo roto -> iniciales,
//  2) panel inerte mientras se abre (nadie enfoca un link que todavía no se ve),
//  3) respaldo con Web Animations API para navegadores sin ::details-content (Safari/Firefox al día de hoy).
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Escudo roto -> iniciales. Idempotente, y cubre también las imágenes que ya fallaron antes de que corra este módulo
// (los <script> de Astro son módulos diferidos, así que el evento `error` pudo haber pasado).
const showInitials = (img: HTMLImageElement) => {
	const c = img.parentElement
	if (!c || !img.isConnected) return
	const b = document.createElement('b')
	b.textContent = c.getAttribute('data-initials')
	c.replaceChild(b, img)
}
document.querySelectorAll<HTMLImageElement>('.crest img').forEach((img) => {
	if (img.complete && img.naturalWidth === 0) showInitials(img)
	else img.addEventListener('error', () => showInitials(img), { once: true })
})

const cards = document.querySelectorAll<HTMLDetailsElement>('details.match')

cards.forEach((d) => {
	const m = d.querySelector<HTMLElement>('.more')
	if (!m || !('inert' in m)) return
	let was = d.open
	let t: number | undefined
	d.addEventListener('toggle', () => {
		if (d.open === was) return
		was = d.open
		clearTimeout(t)
		if (d.open && !reduced()) {
			m.inert = true
			t = window.setTimeout(() => { m.inert = false }, 360)
		} else m.inert = false
	})
})

if (window.CSS?.supports && !CSS.supports('selector(::details-content)') && Element.prototype.animate) {
	cards.forEach((d) => {
		const s = d.querySelector('summary')!
		const m = d.querySelector<HTMLElement>('.more')!
		let a: Animation | null = null
		let closing = false
		s.addEventListener('click', (e) => {
			if (reduced()) return
			e.preventDefault()
			const cur = d.open ? m.offsetHeight : 0
			let wantOpen: boolean
			if (a) { a.cancel(); a = null; wantOpen = closing } else wantOpen = !d.open
			closing = !wantOpen
			d.classList.toggle('closing', closing)
			if (wantOpen) d.open = true
			const full = m.scrollHeight
			const to = wantOpen ? full : 0
			const k = full ? cur / full : 0
			m.style.overflow = 'hidden'
			a = m.animate({ height: [`${cur}px`, `${to}px`], opacity: [k, wantOpen ? 1 : 0] }, { duration: 350, easing: 'ease' })
			a.onfinish = () => {
				a = null
				m.style.overflow = ''
				if (!wantOpen) { d.open = false; closing = false; d.classList.remove('closing') }
			}
		})
	})
}
