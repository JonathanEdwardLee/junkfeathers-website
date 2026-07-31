# WordPress to Astro Cutover Plan V1

This document outlines the workflow and preview strategy to cut over from the legacy WordPress site to the Astro rebuild.

* **Date**: July 28, 2026
* **Status**: **Planning Stage Only** (No WordPress deletion, replacement, or deployment is authorized).

---

## 1. Planned Release Workflow

To ensure strict visual and cryptographic controls, updates transition through the following pipeline:

```text
task/013-astro-machine-foundation (Branch work)
  → pull request (Astro CI check + build verification + 5-day review artifact upload)
  → Jonathan merges to main branch (founder-controlled main baseline)
  → Explicit cutover authorization (Website Council approval)
  → Deploy-only build output (SFTP upload of web/dist/ only)
  → Hostinger live public_html
```

---

## 2. Preview Strategy

Before cutting over the live root domain, the Astro rebuild will be validated through:

1. **Local Browser Preview**: Running the direct Astro preview server (`node .\node_modules\astro\bin\astro.mjs preview --host 127.0.0.1`) locally. This does NOT require Local by WP Engine.
2. **GitHub Actions Artifacts**: CI workflow (`.github/workflows/ci.yml`) uploads the static build output (`web/dist/`) as a 5-day review artifact (`junkfeathers-astro-pr-build`) using `actions/upload-artifact@v7` on pull requests for offline local inspection.
3. **Hostinger Subdirectory Preview**: Upload the static folder to a test subdirectory or temporary subdomain only after explicit Website Council authorization.

---

## 3. Rollback Boundaries

If live static cutover encounters critical issues:
- The legacy WordPress files will remain completely preserved in their respective backups.
- We can restore the original index file and `.htaccess` file immediately to point back to the legacy WordPress runtime.
