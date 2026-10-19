# boca-fixture
Fixture de Boca Juniors (actualizado automáticamente)

Página pública: https://nachofassini.github.io/boca-fixture/

## Estado actual y migración a Astro

Hoy la página que se sirve es `index.html` (en la raíz), generada por el job `boca-calendar-sync` de Kody junto con `fixtures.json`.
Este repo ya incluye además el sitio hecho con [Astro](https://astro.build) (componentes, salida 100% estática), **inactivo** hasta que
Pages pase a "GitHub Actions":

- Mientras Pages siga en "Deploy from a branch" (`main` / raíz), el sitio publicado sigue siendo `index.html`. El código de Astro
  no lo toca: el build escribe en `dist/` (ignorado por git) y nunca se commitea.
- Cuando se cambie Pages a "GitHub Actions", el workflow `.github/workflows/pages.yml` compila Astro y publica `dist/`.
  A partir de ahí el `index.html` de la raíz deja de servirse (se puede borrar). Para volver atrás: Pages → "Deploy from a branch".

```
.github/workflows/pages.yml   build (Node 26) + deploy a GitHub Pages; corre en push a main (si cambia el sitio o los datos) y a mano
scripts/pick-data.mjs         en el workflow, elige los datos más nuevos entre fixtures.json (raíz) y src/data/fixtures.json
astro.config.mjs              site: https://nachofassini.github.io, base: /boca-fixture
src/data/fixtures.json        datos (misma forma que el fixtures.json de la raíz)
src/lib/fixtures.ts           tipos + carga del JSON + formato "Actualizado: …" (hora argentina)
src/layouts/Base.astro        <head>, estilos globales, GoatCounter
src/components/               Header, MatchCard, Crest, Footer
src/pages/index.astro         arma la lista
src/pages/fixtures.json.ts    mantiene la URL pública /boca-fixture/fixtures.json
src/scripts/cards.ts          único JS propio: mejora progresiva de las tarjetas
```

El HTML funciona sin JavaScript; el script solo agrega mejoras (escudo roto → iniciales, panel inerte mientras abre, respaldo de
animación para navegadores sin `::details-content`). GoatCounter y el footer con redes se mantienen igual.

## Desarrollo

Requiere Node 26 (Astro 7 pide >= 22.22).

```sh
npm ci
npm run dev      # desarrollo en http://localhost:4321/boca-fixture/
npm run build    # genera dist/
npm run preview
```

## Datos

Mientras el job de Kody siga escribiendo `fixtures.json` en la raíz (junto con el `index.html` viejo), ese archivo dispara el
workflow y `scripts/pick-data.mjs` lo usa para el build si es más nuevo que `src/data/fixtures.json` (compara `updatedAt`).
Cuando el paquete de Kody pase a escribir `src/data/fixtures.json` (siguiente paso), esa copia pasa a ser la más nueva y gana
sola; los archivos viejos de la raíz (`index.html`, `fixtures.json`) quedan sin actualizar hasta que se los limpie. Así Pages se
puede activar antes o después de migrar Kody sin quedarse con datos viejos. `src/data/fixtures.json` es una copia versionada
(no se modifica en el workflow más que en su propio checkout).
