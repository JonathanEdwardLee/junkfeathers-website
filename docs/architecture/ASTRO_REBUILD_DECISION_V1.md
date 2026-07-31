# Astro Static Architecture

Junkfeathers uses Astro to produce a small static website that is easy to review, build, and host.

## Why Astro

- Static HTML, CSS, and assets provide fast delivery with no application server or database.
- Components and content schemas keep the source readable and maintainable.
- A committed npm lockfile makes builds reproducible.
- Semantic markup and vanilla CSS support the machine-inspired visual system without a client framework.
- Static output reduces routine runtime maintenance and narrows the production attack surface.

## Current stack

- Astro `6.4.8`
- Node.js `22.23.1`
- TypeScript `5.9.3`
- `@astrojs/check` `0.9.9`
- Astro content collections
- Static output with trailing-slash routes
- Vanilla CSS and no client framework

Package versions are recorded in `web/package.json` and `web/package-lock.json`; those files are authoritative when this note becomes stale.

## Source and output boundaries

The application source lives in `web/src/`, while static assets live in `web/public/`. `npm run build` writes the deployable site to `web/dist/`. The generated directory is not committed and only its contents—not the repository root—are suitable for static hosting.

The legacy WordPress theme remains under `themes/` as historical source. It is not imported by or required for the Astro build.
