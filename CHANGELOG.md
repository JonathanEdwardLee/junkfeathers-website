# Changelog

All notable changes to the `junkfeathers.com` repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
