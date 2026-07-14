# Junkfeathers Website Codebase

This repository contains the custom codebase, design variables, and technical documentation for **junkfeathers.com**.

---

## 1. Project Purpose & Creative Doctrine

> **"Retro outside. Current stable technology underneath."**

Junkfeathers is a growing museum/workshop of strange, tactile, and musical retro machines. The website is styled to feel like a handmade retro OLED device—tactile, app-like on mobile, animated, and artistic—while the underlying code utilizes clean, modern, performant, and version-controlled WordPress standards.

---

## 2. Repository Scope

This repository follows **Option B: Standalone Custom-Code Repository**. To prevent database credential leaks, core conflicts, and file bloat, this directory tracks **only custom assets** and documentation.

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
2. Edit `sync-config.local.ps1` to point to the actual Local `wp-content` path (e.g. `C:\Users\joned\Local Sites\junkfeatherscom\app\public\wp-content`). This file is ignored by Git.
3. Run the synchronization helper:
   ```powershell
   # Dry run (verify paths)
   .\scripts\sync-to-local.ps1
   
   # Apply changes (performs a dry run, backs up local theme, then copies theme files)
   .\scripts\sync-to-local.ps1 -Apply
   ```

---

## 4. Verification & Secret Scanning

Before committing code, run the repository verification script:
```powershell
.\scripts\verify-repository.ps1
```
This script checks for forbidden file extensions (like `.sql`, `.zip`, `.config`) and scans files for accidental credential and private token leaks.

---

## 5. Antigravity Agent Authorization & Prohibitions

* **Read-Only Local Baseline**: Antigravity is authorized to inspect local directories and write files to this repository.
* **Database & Plugin Blocks**: Antigravity is NOT authorized to activate, deactivate, or modify WordPress database values or live plugins.
* **LIVE DEPLOYMENT PROHIBITION**: Live site deployment is strictly prohibited during this phase. No changes may be pushed to production until a dedicated implementation plan is approved by the founder.
