# Acceptance Tests Checklist (v2)

This document contains the checklist required to verify the successful completion of the repository bootstrap and local workflow hardening.

---

## 1. Pre-condition Verification
* [ ] The database backup status is reported by Antigravity but still requires founder confirmation.
* [ ] The local WordPress site was confirmed to open successfully in the Local GUI client before bootstrapping.
* [ ] The primary site pages (`/`, `/music/`, `/tech/`, and `/orpheus-deck/`) remain functional.

## 2. Environment & Tooling Boundaries
* [ ] Local by WP Engine is identified as the active development and QA environment.
* [ ] No paid Hostinger staging upgrade is planned, and no production deployment method is authorized.
* [ ] Applied sync was NOT run in Task 04; only dry-run checks have been completed.
* [ ] The four `.disabled` Hostinger folders remain preserved locally.
* [ ] No custom plugin exists, and no plugin state changed.

## 3. Directory Structure Checks
* [ ] The standalone repository exists outside the Local server tree and backup directories.
* [ ] The folder hierarchy matches the specified architecture layout.
* [ ] Custom theme files are copied exactly from the working Local site.
* [ ] No third-party assets (GeneratePress, core plugins) are tracked in Git.
* [ ] No database files (`local.sql`), configurations (`wp-config.php`), or backups are present in the repository folders.

## 4. Script Security & Logic Checks
* [ ] The sync configuration template (`scripts/sync-config.example.ps1`) is tracked.
* [ ] The actual local configuration (`scripts/sync-config.local.ps1`) is ignored by Git.
* [ ] The sync script (`scripts/sync-to-local.ps1`) defaults to a **dry run** (requires an explicit `-Apply` flag).
* [ ] The sync script validates destination paths, verifying they target a directory containing `wp-admin`, `wp-includes`, and `wp-content` and that the child theme resolves exactly to `wp-content\themes\junkfeathers-machine`.
* [ ] The sync script backs up the Local target directory to the configured `$LocalBackupRootPath` before performing any write operations.
* [ ] The backup directory resolves outside the repository, local site, app, and wp-content folders.
* [ ] The repository verification script (`scripts/verify-repository.ps1`) executes successfully and flags any forbidden files or staged configurations.

## 5. Git Initialization Verification
* [ ] Git is initialized locally in the repository folder.
* [ ] The default branch is set to `main`.
* [ ] The `.gitignore` and `.gitattributes` files are present and match their specifications.
* [ ] A secret scan has been executed, confirming no passwords or site salts are staged.
* [ ] Git's staged file list is reviewed, and the commit is created on `main`.
* [ ] No remote origins (GitHub/GitLab) have been added, and no pushes have occurred.
