# Vikingo Estudios · Buenos Aires

Sitio web oficial de **Vikingo Estudios** ("De los siete mares"), estudio de grabación, mezcla analógica y producción musical creado artesanalmente por la familia Martorelli a principios de 2009 en Ciudad Evita, Buenos Aires, Argentina.

Construido con **Hugo** y estándares web modernos (`<dialog>`, Popover API, CSS `@container` queries, tipografía fluida y datos estructurados en YAML).

## Requisitos

- [Hugo](https://gohugo.io/) (`v0.120+` / `v0.168+ extended`)

## Comandos rápidos

```bash
# Servidor local de desarrollo (http://localhost:1313)
hugo server
# o mediante npm:
npm start

# Compilación de producción minificada en ./public
hugo --gc --minify
# o mediante npm:
npm run build

# Publicar directamente a la rama gh-pages
npm run deploy
```

## Publicación en Cloudflare Workers & Pages

- **Cloudflare Workers Static Assets (En Vivo)**:
  - URL en producción: `https://vikingo-v2.ryanleejwebdev.workers.dev/`
  - Configuración: `wrangler.jsonc` (`assets.directory = "./public"`, `not_found_handling = "404-page"`, `html_handling = "auto-trailing-slash"`)
  - Comando de publicación: `npm run deploy` (`hugo --gc --minify && npx wrangler deploy`)
- **Cloudflare Pages (Git conectado)**:
  - URL: `https://vikingo-v2.pages.dev/`
  - Repositorio vinculado: `ryan258/vikingo-v2` (rama de producción: `master`)
- **GitHub Pages (Alternativo)**:
  - Workflow automático en `.github/workflows/hugo.yml` o rama manual `gh-pages` vía `npm run deploy:gh-pages` (`scripts/deploy-gh-pages.sh`).

## Estructura del proyecto

- `hugo.toml` — Configuración general (`es-AR`), metadatos de contacto y menú principal.
- `content/` — Páginas principales del sitio (`_index.md`, `historia/`, `servicios/`, `equipamiento/`, `galeria/`, `staff/`, `contacto/`).
- `data/` — Catálogos estructurados:
  - `data/equipamiento.yaml` — Ficha técnica completa y backline (micrófonos, preamps Telefunken/API, consola Soundcraft, cinta abierta Tascam 1", monitoreo, equipos y baterías vintage).
  - `data/servicios.yaml` — Grabación en sala viva, mezcla híbrida, mastering analógico y producción artística.
  - `data/staff.yaml` — Perfiles de Claudio «Vikingo» Martorelli, Nahuel Martorelli y Damián «Cooczon» Martorelli.
  - `data/galeria.yaml` — Las 3 colecciones fotográficas completas (*En Sesión*, *Fierros y Sala*, *Construcción 2009*).
- `layouts/` — Plantillas HTML5 semánticas de Hugo (`partials/picture.html` genera variantes responsivas `.webp` automáticamente con Hugo Pipes).
- `assets/` — Hoja de estilos (`assets/css/site.css`), interactividad (`assets/js/site.js`) minificadas y con *fingerprint* SRI, y archivo fotográfico (`assets/img/`).
