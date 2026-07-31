# Hostinger Astro Deployment Plan V1

This document evaluates the future deployment options to publish the static Astro build to Hostinger production.

* **Date**: July 16, 2026
* **Status**: **Planning Stage Only** (No Hostinger connection or domain changes are authorized).

---

## 1. Evaluation of Options

### Option A — Hostinger Managed Node.js / GitHub Integration
* **Mechanism**: Hostinger automatically pulls changes from `main` on GitHub, installs dependencies, and compiles the Astro app on the server.
* **Limitations**: Requires an eligible Hostinger Business or Cloud plan. Not supported on standard Premium web hosting plans.
* **Rollback**: Controlled via GitHub commit history or reverting a merge.
* **Evaluation**: Adds server compilation overhead and plan eligibility dependencies.

### Option B — Static Deploy-Only Branch or Scoped Workflow (Recommended)
* **Mechanism**: The site is compiled locally or inside a secure GitHub Actions runner. Only the compiled static output files (`web/dist/`) are published to Hostinger's `public_html` directory via SFTP or a scoped deploy-only branch.
* **Advantages**:
  - Compatible with all Hostinger hosting plans (including Premium).
  - High Security: The main repository source code, Git metadata, and configurations are kept off the public server.
  - Zero server compilation: Fast, safe, and reproducible.
* **Rollback**: Extremely simple. Revert the static files on the server to the pre-deployment folder.

---

## 2. Recommendation

**Option B is recommended**. It minimizes plan cost dependencies, locks the runtime build output strictly to static assets, and keeps proprietary source directories off the public web root.

---

## 3. Hostinger Boundaries (Do Not Violate)
1. **No hosting plan upgrades** are authorized during this planning pass.
2. **No automated integrations** connecting GitHub directly to Hostinger hPanel are authorized.
3. **No removal** of existing live WordPress files or databases.
4. **No domain name** or DNS alterations.
