# Acceptance Tests Checklist

This document contains the checklist required to verify the successful completion of the repository bootstrap.

---

## 1. Pre-condition Verification
* [ ] A fresh Local baseline export or equivalent database backup has been saved securely outside the repository folder.
* [ ] The local WordPress site was confirmed to open successfully in the Local GUI client before bootstrapping.
* [ ] The primary site pages (`/`, `/music/`, `/tech/`, and `/orpheus-deck/`) remain visual and functional.

## 2. Directory Structure Checks
* [ ] The standalone repository exists outside the Local server tree and backup directories.
* [ ] The folder hierarchy matches the specified architecture layout.
* [ ] Custom theme files are copied exactly from the working Local site.
* [ ] No third-party assets (GeneratePress, core plugins) are tracked in Git.
* [ ] No database files (`local.sql`), configurations (`wp-config.php`), or backups are present in the repository folders.

## 3. Script Security & Logic Checks
* [ ] The sync configuration template (`scripts/sync-config.example.ps1`) is tracked.
* [ ] The actual local configuration (`scripts/sync-config.local.ps1`) is ignored by Git.
* [ ] The sync script (`scripts/sync-to-local.ps1`) defaults to a **dry run** (requires an explicit `-Apply` flag).
* [ ] The sync script validates destination paths, verifying they target a directory containing both `themes` and `plugins` and that the child theme is named `junkfeathers-machine`.
* [ ] The sync script backs up the Local target directory before performing any write operations.
* [ ] The repository verification script (`scripts/verify-repository.ps1`) executes successfully and flags any forbidden files.

## 4. Git Initialization Verification
* [ ] Git is initialized locally in the repository folder.
* [ ] The default branch is set to `main`.
* [ ] The `.gitignore` and `.gitattributes` files are present and match their specifications.
* [ ] A secret scan has been executed, confirming no passwords or site salts are staged.
* [ ] A single, clean local commit exists on `main` (`chore: establish safe website repository baseline`).
* [ ] No remote origins (GitHub/GitLab) have been added, and no pushes have occurred.
