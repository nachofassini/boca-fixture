// Mantiene la URL pública `/fixtures.json` (el footer y terceros la consumen).
import type { APIRoute } from 'astro'
import { fixtures } from '../lib/fixtures'

export const GET: APIRoute = () =>
	new Response(JSON.stringify(fixtures, null, 2) + '\n', { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
