// Datos de la página: es exactamente el `fixtures.json` que hoy publica el job de Kody (misma forma).
import data from '../data/fixtures.json'

export type SiteTeam = { name: string; logo: string | null; initials: string }
export type SiteMatch = {
	id: string
	home: SiteTeam
	away: SiteTeam
	competition: string
	label: string // "CLAUSURA - FECHA 12", "SUDAMERICANA - SEMI (IDA)"
	dateART: string // yyyy-mm-dd
	day: string // "VIE 9/10"
	time: string | null // "19:30" (ART) o null = a confirmar
	kickoffUtc: string | null
	venue: string | null
	tv: string | null
	timeFromPromiedos: boolean
	notes: string[]
	links: { espn: string | null; promiedos: string | null }
}
export type Fixtures = {
	updatedAt: string
	hash: string
	timezone: string
	calendar: { id: string; subscribe: string; embed: string; ical: string; webcal: string }
	page: string
	matches: SiteMatch[]
}

export const fixtures = data as Fixtures

export const AUTHOR = {
	name: 'Nacho Fassini',
	instagram: 'https://www.instagram.com/nacho.fassini/',
	linkedin: 'https://www.linkedin.com/in/ignacio-fassini/',
}

/** "19/10/2026 01:00 (hora argentina)" — mismo formato que el `renderHtml` actual. */
export function artStamp(iso: string, tz = fixtures.timezone): string {
	const f = new Intl.DateTimeFormat('es-AR', { timeZone: tz, day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso))
	return `${f.replace(',', '')} (hora argentina)`
}
