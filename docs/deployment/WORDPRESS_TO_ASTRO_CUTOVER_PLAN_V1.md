# WordPress to Astro Cutover Plan V1

This document outlines the workflow and preview strategy to cut over from the legacy WordPress site to the Astro rebuild.

* **Date**: July 16, 2026
* **Status**: **Planning Stage Only** (No WordPress deletion or replacement is authorized).

---

## 1. Planned Release Workflow

To ensure strict visual and cryptographic controls, updates transition through the following pipeline:

```text
task/013-astro-machine-foundation (Branch work)
  → pull request (Astro CI check + build verification)
  → Jonathan merges to main branch (Protected baseline)
  → Local/CI static build (Generates web/dist/)
  → Explicit cutover authorization (Website Council approval)
  → Deploy-only build output (SFTP upload of web/dist/ only)
  → Hostinger live public_html
```

---

## 2. Preview Strategy

Before cutting over the live root domain, the Astro rebuild will be validated through:

1. **Local Browser Preview**: Running the Astro dev server (`npm run dev`) or preview server (`npm run preview`) locally at `http://localhost:4321/`. This does NOT require Local by WP Engine.
2. **GitHub Actions Artifacts**: CI workflows will package the `web/dist/` output as a downloadable ZIP artifact on every pull request for offline local inspection.
3. **Hostinger Subdirectory Preview**: Upload the static folder to a test subdirectory (e.g. `https://junkfeathers.com/preview/`) or a temporary subdomain before modifying the root directory files.

---

## 3. Rollback Boundaries

If the live static cutover encounters critical issues (such as broken paths or visual breakage):
- The legacy WordPress files will remain completely preserved in their respective backups.
- We can restore the original index file and `.htaccess` file immediately to point back to the legacy WordPress runtime.
