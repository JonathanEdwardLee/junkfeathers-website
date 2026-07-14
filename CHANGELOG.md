# Changelog

All notable changes to the `junkfeathers.com` repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.0] - 2026-07-14

### Added
- Centralized monochrome OLED custom properties (variables) inside [themes/junkfeathers-machine/style.css](themes/junkfeathers-machine/style.css).
- Standardized site-wide generic `monospace` typography, black background, white text, and square geometry (zero rounded corners).
- Configured clean accessibility styles: explicit high-contrast keyboard focus outlines (`:focus-visible` and `*-visible`) and `prefers-reduced-motion` timing overrides.
- Implemented a small CSS class system for future retro machines: `.jf-machine-shell`, `.jf-panel`, `.jf-screen`, `.jf-btn`, `.jf-btn--primary`, `.jf-btn--secondary`, `.jf-label`, `.jf-meta`, `.jf-divider`, `.jf-stack`, `.jf-row`.
- Added a subtle monochrome horizontal scanline gradient background to the body and screen classes.
- Updated the child theme version to `0.2.0`.

### Changed
- Updated the Local homepage content (post ID 5) to display a framed monochrome machine front panel prototype (includes site title, supporting status string, and square buttons for MUSIC, TECH, and ORPHEUS DECK).

---

## [0.4.0] - 2026-07-13

### Changed
- Migrated the GeneratePress footer copyright filter from the Code Snippets database to the child theme [themes/junkfeathers-machine/functions.php](themes/junkfeathers-machine/functions.php) as a named, documented callback `junkfeathers_machine_footer_copyright`.
- Deactivated the **Code Snippets** plugin locally (version 3.9.6, slug `code-snippets`) following the successful callback verification. The plugin remains installed locally, and its 5 snippet records remain stored in the database.
- Corrected all authority references in the repository from `Website 01Council` to `Website Council`.
- Updated [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) and [docs/COUNCIL_DECISIONS.md](docs/COUNCIL_DECISIONS.md) to record the local deactivation, backup status, and updated local technical plugin inventory.
- Updated [docs/plans/FOUNDATION_PASS_PLAN.md](docs/plans/FOUNDATION_PASS_PLAN.md) to mark the copyright hook location decision gate as resolved.

---

## [0.3.0] - 2026-07-13

### Changed
- Recorded the local-only deactivation test of the **AI Provider for OpenAI** plugin (version 1.0.3, slug `ai-provider-for-openai`) on July 13, 2026, following the founder's decision that it is not needed.
- Updated [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) to record the local deactivation, backup preconditions, and updated local technical plugin inventory.
- Updated [docs/COUNCIL_DECISIONS.md](docs/COUNCIL_DECISIONS.md) to lock the AI Provider deactivation decision.
- Updated [docs/plans/FOUNDATION_PASS_PLAN.md](docs/plans/FOUNDATION_PASS_PLAN.md) to mark the AI Provider utility decision gate as resolved.

---

## [0.2.0] - 2026-07-13

### Changed
- Hardened path validation in [scripts/sync-to-local.ps1](scripts/sync-to-local.ps1) to verify full WordPress structures (`wp-admin`, `wp-includes`, `wp-content`) and prevent resolving to user profiles or drive roots.
- Updated [scripts/sync-config.example.ps1](scripts/sync-config.example.ps1) to define two local paths (`$LocalSiteRootPath` and `$LocalBackupRootPath`).
- Configured [scripts/sync-to-local.ps1](scripts/sync-to-local.ps1) to write backups to the external `$LocalBackupRootPath` (outside the repository, Local site, and app folders).
- Expanded [scripts/verify-repository.ps1](scripts/verify-repository.ps1) to check for private keys (`.pem`, `.key`, etc.), `credentials.json`, `.env.local`, and to verify that `sync-config.local.ps1` is not tracked.
- Rewrote [docs/CONTENT_VERSIONING_STRATEGY.md](docs/CONTENT_VERSIONING_STRATEGY.md) to define accurate reproducibility choices (templates, patterns, and dynamic blocks) and note that the homepage layout architecture is undecided.
- Rewrote [docs/ROLLBACK.md](docs/ROLLBACK.md) to discourage destructive git resets and promote standard `git revert` and file restores.
- Updated [docs/plans/FOUNDATION_PASS_PLAN.md](docs/plans/FOUNDATION_PASS_PLAN.md) to outline neutral decision gates (AI Provider utility, copyright hooks, Jetpack audit, and email providers) instead of direct cleanup actions.
- Updated [WELCOME_AG.md](WELCOME_AG.md) to enforce strict, task-bound agent permissions.
- Updated [README.md](README.md), [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md), [docs/DEPLOYMENT_NOT_AUTHORIZED.md](docs/DEPLOYMENT_NOT_AUTHORIZED.md), and [docs/ACCEPTANCE_TESTS.md](docs/ACCEPTANCE_TESTS.md) to specify that Local by WP Engine is the active development/QA environment, no paid staging is planned, no deployment method is authorized, applied sync was not run in Task 04, Hostinger `.disabled` folders are preserved, and no custom plugins exist.

---

## [0.1.0] - 2026-07-13

### Added
- Initial standalone repository bootstrap outside of Local WordPress runtime.
- Existing custom theme files for **Junkfeathers Machine** (`style.css`, `functions.php`, `README.md`).
- Approved website audit pack documentation (Audit V1 and V2 historic archives).
- Core workspace guides: `CURRENT_STATE.md`, `COUNCIL_DECISIONS.md`, `ARCHITECTURE.md`, `CONTENT_VERSIONING_STRATEGY.md`, `DEPLOYMENT_NOT_AUTHORIZED.md`, `ROLLBACK.md`, and `ACCEPTANCE_TESTS.md`.
- Helper scripting suite: `sync-config.example.ps1`, `sync-to-local.ps1`, and `verify-repository.ps1`.
- Clean repository exclusion files: `.gitignore` and `.gitattributes`.
