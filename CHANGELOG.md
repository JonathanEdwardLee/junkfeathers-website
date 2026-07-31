# Changelog

All notable changes to the `junkfeathers.com` repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.11.0] - 2026-07-28

### Added
- **Task 013 / 013A / 013B Astro Foundation**: Scaffolded and modernized Astro machine foundation under `web/` using Astro `6.4.8`, Node `22.23.1`, TypeScript `5.9.3`, and `@astrojs/check` `0.9.9`.
- **Founder Image Library Audit**: Completed recursive audit of founder image library (`C:\Users\joned\Documents\Junkfeathers DevAI Exchange\junkfeathers-website\00 ACTIVE\Images-From-Founder`), returning detailed inventory CSV, JSON, Markdown audit report, duplicate groups report, and unreadable/unsupported report under `devai-return/image-audit/`.
- **Orpheus Static Media Migration**: Migrated exact-matched `OrpheusDeck_logo_512_app_icon.png` to `web/public/media/orpheus/` with verified SHA-256 parity, and documented candidate assets for missing/suffix-mismatched files (`ASSET_SELECTION_NEEDED`) in `docs/assets/ORPHEUS_STATIC_MEDIA_MIGRATION_V1.md`.
- **Orpheus App Privacy Policy**: Implemented all 16 numbered sections of the founder-approved privacy policy at `/orpheus-deck-privacy-policy/`, documented in `docs/content/ORPHEUS_APP_PRIVACY_ASTRO_MIGRATION_V1.md`.
- **Publication Guard Helper**: Added `getPublishedEntries()` in `web/src/lib/content.ts` to strictly exclude drafts (`draft: true`) and internal schema fixtures (`internalFixture: true`) from public site routes.
- **CI Build Artifact**: Updated `.github/workflows/ci.yml` with `actions/upload-artifact@v7` to upload a 5-day review build artifact (`junkfeathers-astro-pr-build`) from `web/dist/`.

### Changed
- **Astro/Zod Deprecation Fix**: Replaced deprecated `z.string().url()` forms in `web/src/content.config.ts` with supported `z.url()` form, achieving 0 errors, 0 warnings, and 0 hints in Astro Check.
- **Editorial Copy Correction**: Removed superseded "Junk Notes" tagline, replacing default metadata with "Junkfeathers Music and Tech".
- **MonthlyTransmission Component Safety**: Enforced locked copy and button label, removed red status text and green accents, replaced focus outlines with white/gray, and removed inline `onsubmit="return false;"`.
- **Chronos Business Copy**: Updated Chronos subtitle to state: "The original Junkfeathers timing-machine prototype. Future hardware work is parked."
- **Pygmalion Governance Boundary**: Updated `docs/architecture/PYGMALION_ASTRO_INTEGRATION_BOUNDARY_V1.md` to explicitly state Jonathan as founder and final visual authority.
- **Documentation Reconciliation**: Updated `docs/architecture/ASTRO_REBUILD_DECISION_V1.md`, `docs/CURRENT_STATE.md`, and `docs/deployment/WORDPRESS_TO_ASTRO_CUTOVER_PLAN_V1.md`.

---

## [0.10.0] - 2026-07-19

### Added
- Created [AGENTS.md](AGENTS.md) exactly from the approved council-reference content, establishing the repository-specific DevAI communication foundation.
- Configured `.github/pull_request_template.md` to capture exchange identity, status, starting SHA-256 hash, and repository hygiene confirmations.

### Changed
- Updated [README.md](README.md) to replace Antigravity-specific authority wording with generic DevAI role and exchange terminology, and point to [AGENTS.md](AGENTS.md) as the authority.
- Updated [CONTRIBUTING.md](CONTRIBUTING.md) to require active exchange verification, [AGENTS.md](AGENTS.md) alignment, and founder merge authority.
- Updated [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) to record that the governance installation is present but restart acceptance is pending.
- Updated [scripts/verify-repository.ps1](scripts/verify-repository.ps1) to allow [AGENTS.md](AGENTS.md), remove `WELCOME_AG.md`, and detect/fail on tracked communication/exchange artifacts or prohibited temporary folders.
- Expanded [.gitignore](.gitignore) to exclude local exchange, extracted exchange, and council-return communication files.

### Removed
- Deleted `WELCOME_AG.md` after confirming all durable safety rules are preserved in [AGENTS.md](AGENTS.md).

---

## [0.9.0] - 2026-07-15

### Added
- Created the production-core content records [docs/content/HOME_PAGE_PRODUCTION_CORE_V1.md](docs/content/HOME_PAGE_PRODUCTION_CORE_V1.md), [docs/content/TECH_PAGE_PRODUCTION_CORE_V1.md](docs/content/TECH_PAGE_PRODUCTION_CORE_V1.md), and [docs/content/ORPHEUS_PAGE_PRODUCTION_CORE_V1.md](docs/content/ORPHEUS_PAGE_PRODUCTION_CORE_V1.md) containing the exact approved HTML markup for the Home, Tech, and Orpheus pages, excluding all Signal List signup panels and Local-preview code.
- Created the content manifest [docs/deployment/PRODUCTION_CONTENT_MANIFEST_V1.md](docs/deployment/PRODUCTION_CONTENT_MANIFEST_V1.md) detailing target pages, relative routes, expected media assets, and SHA-256 hashes of the exact production HTML blocks.
- Created the deployment runbook [docs/deployment/PRODUCTION_DEPLOYMENT_RUNBOOK_V1.md](docs/deployment/PRODUCTION_DEPLOYMENT_RUNBOOK_V1.md) describing step-by-step procedures for the manual copy of child-theme runtime files (style.css and functions.php) and manual database page content migration on Hostinger.
- Created the rollback plan [docs/deployment/PRODUCTION_ROLLBACK_PLAN_V1.md](docs/deployment/PRODUCTION_ROLLBACK_PLAN_V1.md) defining Level 1 (Single-page WordPress revision), Level 2 (Theme SFTP rollback), and Level 3 (Hostinger hPanel full restore) recovery procedures and triggers.
- Created the production acceptance checklist [docs/deployment/PRODUCTION_ACCEPTANCE_CHECKLIST_V1.md](docs/deployment/PRODUCTION_ACCEPTANCE_CHECKLIST_V1.md) mapping all safety, integrity, accessibility, and signup boundary checks.
- Appended narrow subscriber data ignore patterns (`private-data/`, `exports/subscribers/`, `*subscriber-export*.csv`, `*contact-export*.csv`, `*reach-export*.csv`) to [.gitignore](.gitignore) and [scripts/verify-repository.ps1](scripts/verify-repository.ps1).

### Changed
- Corrected historic claims regarding Method A/B editor verifications in [docs/ACCEPTANCE_TESTS.md](docs/ACCEPTANCE_TESTS.md) to note that WordPress Page editors have not yet been verified (`Founder front-end verification: PASSED. WordPress editor verification: NOT YET RECORDED.`).
- Corrected disabled control focus claims in [docs/ACCEPTANCE_TESTS.md](docs/ACCEPTANCE_TESTS.md) to clarify that disabled inputs and checkboxes in the Local prototype are not keyboard-focusable or submission-capable.
- Qualified Hostinger Reach and consent logging assumptions in [docs/legal/EMAIL_SIGNUP_PRIVACY_REQUIREMENTS_V1.md](docs/legal/EMAIL_SIGNUP_PRIVACY_REQUIREMENTS_V1.md) and [docs/integrations/HOSTINGER_REACH_ACTIVATION_CHECKLIST.md](docs/integrations/HOSTINGER_REACH_ACTIVATION_CHECKLIST.md) as live pilot verification items.
- Updated [docs/COUNCIL_DECISIONS.md](docs/COUNCIL_DECISIONS.md) to record the locked manual deployment method decision.
- Updated [docs/DEPLOYMENT_NOT_AUTHORIZED.md](docs/DEPLOYMENT_NOT_AUTHORIZED.md) and [docs/ROLLBACK.md](docs/ROLLBACK.md) to reference the prepared launch documentation.
- Updated [docs/plans/FOUNDATION_PASS_PLAN.md](docs/plans/FOUNDATION_PASS_PLAN.md) to mark Gate 6 (Deployment Workflow Design) as resolved.

---

## [0.8.0] - 2026-07-14

### Added
- Created the database content record [docs/content/EMAIL_SIGNUP_LOCAL_PROTOTYPE_V1.md](docs/content/EMAIL_SIGNUP_LOCAL_PROTOTYPE_V1.md) detailing the nonfunctional signup form prototype markup, placements, styling classes, and recovery snapshots.
- Created the future privacy requirements guide [docs/legal/EMAIL_SIGNUP_PRIVACY_REQUIREMENTS_V1.md](docs/legal/EMAIL_SIGNUP_PRIVACY_REQUIREMENTS_V1.md) defining the policies, consent frameworks, data minimization principles, and data processor disclosures needed before activating the signup form.
- Created the activation gates checklist [docs/integrations/HOSTINGER_REACH_ACTIVATION_CHECKLIST.md](docs/integrations/HOSTINGER_REACH_ACTIVATION_CHECKLIST.md) mapping all 16 technical milestones required to activate the campaign system.

### Changed
- Bounded child-theme version to `0.5.0` inside enqueues, comments, and stylesheets.
- Appended signup form layout and design classes to [themes/junkfeathers-machine/style.css](themes/junkfeathers-machine/style.css): `.jf-signup-panel`, `.jf-signup-form`, `.jf-form-field`, `.jf-field-label`, `.jf-email-input`, `.jf-consent-row`, `.jf-consent-copy`, `.jf-btn--inactive`, `.jf-privacy-note`, and `.jf-visually-hidden`.
- Cleaned up two unnecessary metadata rows (Release Date and Engine) from the Local Orpheus Deck page (ID 12) and the content record [docs/content/ORPHEUS_PAGE_LOCAL_PROTOTYPE_V1.md](docs/content/ORPHEUS_PAGE_LOCAL_PROTOTYPE_V1.md).
- Updated the Local homepage (post ID 5) to display the nonfunctional signup panel prototype at the bottom of the machine panel shell.
- Updated the Local Orpheus Deck page (ID 12) to display the nonfunctional signup panel prototype after the Local-First Privacy panel.
- Updated [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) to reflect child-theme version `0.5.0` and the signup form prototype placements.
- Updated [docs/ACCEPTANCE_TESTS.md](docs/ACCEPTANCE_TESTS.md) to include verification checklist items for signup layouts, focus order, checkbox behavior, and data suppression.

---

## [0.7.0] - 2026-07-14

### Added
- Created the database reproducibility record [docs/content/ORPHEUS_PAGE_LOCAL_PROTOTYPE_V1.md](docs/content/ORPHEUS_PAGE_LOCAL_PROTOTYPE_V1.md) to track visitor-facing Orpheus Deck page layout content, asset IDs, CTAs, and recovery steps.

### Changed
- Bounded child-theme version to `0.4.0` inside enqueues, comments, and stylesheets.
- Corrected button focus outline specification in [themes/junkfeathers-machine/style.css](themes/junkfeathers-machine/style.css) to support high-contrast keyboard outlines (`:focus-visible` / `*-visible`) while keeping clean clicks for pointer navigation.
- Added reusable layout and design utility helper classes: `.jf-machine-header`, `.jf-machine-title`, `.jf-machine-subtitle`, `.jf-feature-media`, `.jf-action-panel`, `.jf-info-grid`, `.jf-status-strip`, `.jf-text-center`.
- Updated the Local Orpheus Deck page (ID 12) to display the conversion page prototype with header, dynamic download button, descriptive purpose block, local-first privacy statement, and screenshots.
- Updated [docs/content/TECH_PAGE_LOCAL_PROTOTYPE_V1.md](docs/content/TECH_PAGE_LOCAL_PROTOTYPE_V1.md) to replace executable shell commands with descriptive snapshots and relative paths.
- Updated [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) to reflect child-theme version `0.4.0` enqueues and stylesheets, describe the Orpheus Deck page prototype, and clarify local caching (LiteSpeed Cache) and Hostinger deactivations.

---

## [0.6.0] - 2026-07-14

### Added
- Created the database reproducibility record [docs/content/TECH_PAGE_LOCAL_PROTOTYPE_V1.md](docs/content/TECH_PAGE_LOCAL_PROTOTYPE_V1.md) to track visitor-facing Tech page layout content, asset IDs, CTAs, and recovery steps.

### Changed
- Bounded child-theme version to `0.3.0` inside enqueues, comments, and stylesheets.
- Corrected child-theme styling rules inside [themes/junkfeathers-machine/style.css](themes/junkfeathers-machine/style.css):
  - Changed global body background to solid black.
  - Confined repeating scanlines strictly to display screens (`.jf-screen`).
  - Restored browser default outlines for generic link focus while optimizing `:focus-visible` keyboard outlines.
  - Added a baseline box-sizing wrapper and forced 44px tap target heights.
- Updated the Local Tech page (ID 10) to display the concise monochrome machine prototype featuring `JUNKFEATHERS TECH`, subtitle, and the featured `ORPHEUS DECK` module with relative paths.
- Updated the Local Orpheus Deck page (ID 12) with clean relative links and a return navigation path link (`< Return to Tech Workshop`).
- Updated [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) to correct contradictions regarding LiteSpeed Cache (production-only caching) and Hostinger disabled plugins, and fix relative child-theme documentation paths.

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
