# Junkfeathers Website Codebase

This repository contains the custom codebase, design variables, and technical documentation for **junkfeathers.com**.

---

## 1. Project Purpose & Creative Doctrine

> **"Retro outside. Current stable technology underneath."**

Junkfeathers is a growing museum/workshop of strange, tactile, and musical retro machines. The website is styled to feel like a handmade retro OLED device—tactile, app-like on mobile, animated, and artistic—while the underlying code utilizes clean, modern, performant, and version-controlled WordPress standards.

---

## 2. Environment & Repository Scope

This repository follows **Option B: Standalone Custom-Code Repository**. To prevent database credential leaks, core conflicts, and file bloat, this directory tracks **only custom assets** and documentation.

* **Development & QA Environment**: Local by WP Engine is the active local environment.
* **Hostinger Staging Status**: No paid Hostinger staging upgrade is planned. Local remains the sole staging/QA location.
* **Production Deployment Status**: No production deployment pipeline or method is designed or authorized.
* **Hostinger Plugin Backups**: The four `.disabled` Hostinger plugins are preserved locally inside the Local backups but excluded from Git tracking. No custom plugins or database state changes have been created.

### Tracked Folders
* `docs/`: Technical audits, plans, architecture schemas, and guidelines.
* `themes/junkfeathers-machine/`: Custom stylesheet rules, enqueues, and layout variables.
* `plugins/`: Placeholder folder for future custom plugins.
* `scripts/`: Local verification and synchronization scripts.

### Explicitly Excluded (Do Not Add)
* WordPress core files, `wp-config.php`, `.htaccess`.
* Third-party themes (such as parent GeneratePress) and standard plugins.
* Database backups (`*.sql`), SQL files, site archives.
* Uploads folder (`wp-content/uploads/`) and media binary dumps.
* Private credentials, API keys, credentials, or Local server configuration.

---

## 3. Local Sync Process

Since this repository is standalone, code edits are written here and copied to the local runtime path for testing.

1. Copy `scripts/sync-config.example.ps1` to `scripts/sync-config.local.ps1`.
2. Edit `sync-config.local.ps1` to set `$LocalSiteRootPath` and `$LocalBackupRootPath`. This file is ignored by Git.
3. Run the synchronization helper:
   ```powershell
   # Dry run (verify paths - default)
   .\scripts\sync-to-local.ps1

   # Apply changes (performs a dry run, backs up local theme, then copies theme files)
   .\scripts\sync-to-local.ps1 -Apply
   ```
*(Note: Applied sync was not run in Task 04; only dry-run checks have been completed).*

---

## 4. Verification & Secret Scanning

Before committing code, run the repository verification script:
```powershell
.\scripts\verify-repository.ps1
```
This script checks for forbidden file extensions (like `.sql`, `.zip`, `.config`) and scans files for accidental credential and private token leaks.

---

## 5. Antigravity Agent Authorization & Prohibitions

* **Task-Bound Permissions**: Antigravity may modify only the files and environments explicitly named in the current founder-issued, Council-reviewed task. No standing authorization exists for design changes, applied sync, plugin changes, database changes, or deployment.
* **Database & Plugin Blocks**: Antigravity is NOT authorized to activate, deactivate, or modify WordPress database values or live plugins.
* **LIVE DEPLOYMENT PROHIBITION**: Live site deployment is strictly prohibited during this phase.
