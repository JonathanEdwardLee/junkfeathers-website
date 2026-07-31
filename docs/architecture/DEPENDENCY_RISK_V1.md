# Dependency Risk Record V1

This document records the exact results of the `npm audit` check on `web/package.json` for Task 013B.

* **Audit Date**: July 28, 2026
* **Environment**: Node `22.23.1`, npm `10.9.2`
* **Pinned Stack**: Astro `6.4.8`, `@astrojs/check` `0.9.9`, TypeScript `5.9.3`

---

## Audit Summary

- **Total Audited Packages**: 338
- **Total Vulnerabilities**: 4 (1 low, 3 high)
- **Forced Upgrade**: `NO` (Astro 6 series preserved per task boundaries; `npm audit fix --force` prohibited).

---

## Detailed Findings & Mitigations

### 1. `astro` (<= 7.0.9)
- **Severity**: High / Moderate (Reflected XSS via animation properties / spread attributes / transition directives)
- **Affected Behavior**: Public runtime rendering of untrusted user-supplied animation properties or hydrated islands.
- **Current Mitigation**: The Junkfeathers site is a static export (SSG) with zero hydrated framework islands, zero user input rendering, and zero dynamic view transition payloads.
- **Review Date**: July 28, 2026
- **Upgrade Trigger**: Future migration to Astro 7 when authorized by Website Council.

### 2. `esbuild` (0.27.3 - 0.28.0)
- **Severity**: Moderate / Low (Development server Windows arbitrary file read)
- **Affected Behavior**: Local development server (`astro dev`) exposed to local network.
- **Current Mitigation**: The development server is bound exclusively to loopback (`127.0.0.1`), never exposed to external networks (`--host` prohibited).
- **Review Date**: July 28, 2026
- **Upgrade Trigger**: Upstream Astro 6 patch release or Astro 7 upgrade.

### 3. `fast-uri` (3.0.0 - 3.1.3)
- **Severity**: High (Host confusion via literal backslash authority delimiter)
- **Affected Behavior**: URI parsing in schema validators.
- **Current Mitigation**: All schemas use static trusted strings and Zod `z.url()` validation without dynamic external URI routing.
- **Review Date**: July 28, 2026
- **Upgrade Trigger**: Direct patch via `npm audit fix` when verified compatible with Astro 6.

### 4. `sharp` (< 0.35.0)
- **Severity**: High (Inherited libvips vulnerabilities CVE-2026-33327, etc.)
- **Affected Behavior**: Build-time image optimization.
- **Current Mitigation**: Static images are pre-processed or served from `public/media/` without on-demand server image processing pipelines.
- **Review Date**: July 28, 2026
- **Upgrade Trigger**: Upstream Astro 6 image service patch or Astro 7 release.
