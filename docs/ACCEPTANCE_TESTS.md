# Acceptance Tests Checklist (v5)

This document contains the checklist required to verify the successful completion of the repository bootstrap, local workflow hardening, footer copyright migration, and visual foundation pass.

---

## 1. Pre-condition Verification
* [ ] The database backup status is reported by Antigravity and confirmed by the founder.
* [ ] The local WordPress site was confirmed to open successfully in the Local GUI client before bootstrapping.
* [ ] The primary site pages (`/`, `/music/`, `/tech/`, and `/orpheus-deck/`) remain functional.

## 2. Environment & Tooling Boundaries
* [ ] Local by WP Engine is identified as the active development and QA environment.
* [ ] No paid Hostinger staging upgrade is planned, and no production deployment method is authorized.
* [ ] Applied sync was run in Task 08 for child-theme style sheet and functions updates.
* [ ] The four `.disabled` Hostinger folders remain preserved locally.
* [ ] Both Code Snippets and AI Provider for OpenAI are deactivated locally but remain installed. No custom plugin exists.

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

## 5. Visual Foundation & Homepage Prototype Checks
* [ ] The style sheet is updated to version `0.3.0`.
* [ ] Grayscale, border-weight, and spacing custom variables (tokens) are centralized in `style.css`.
* [ ] Site-wide overrides enforce `font-family: monospace;`, solid black background, white text, and square buttons.
* [ ] Restrained green color is only applied to links (`#7cff7c`) and warning/error focus indicators.
* [ ] Focus outlines are preserved on generic anchors, and custom focus outlines (`:focus-visible`) are styled clearly as square boxes.
* [ ] Repeating horizontal scanline backgrounds are confined strictly to screen classes (e.g. `.jf-screen`) and not applied globally.
* [ ] The local homepage (ID 5) displays a framed prototype including JUNKFEATHERS, the status line, and large square buttons for MUSIC, TECH, and ORPHEUS DECK.
* [ ] Reduced-motion queries are handled appropriately.

## 6. Tech Landing Page & Orpheus Checks
* [ ] The local Tech page (ID 10) displays the framed prototype featuring `JUNKFEATHERS TECH`, subtitle, and the featured `ORPHEUS DECK` module.
* [ ] The internal CTA `[ OPEN ORPHEUS DECK ]` is present and routes to `/orpheus-deck/`.
* [ ] The future machine banner `MORE MACHINES IN DEVELOPMENT` is present as a dashed-border panel.
* [ ] The Orpheus Deck page (ID 12) contains a clear return path link `< Return to Tech Workshop` routing back to `/tech/`.
* [ ] Page links and media assets utilize relative paths (no hardcoded domain prefixes).
* [ ] The exact implementation details are captured in the tracked database reproducibility record [docs/content/TECH_PAGE_LOCAL_PROTOTYPE_V1.md](content/TECH_PAGE_LOCAL_PROTOTYPE_V1.md).

## 7. Child-Theme Copyright Migration Checks
* [ ] The footer copyright filter exists in the tracked child-theme codebase [themes/junkfeathers-machine/functions.php](themes/junkfeathers-machine/functions.php).
* [ ] The callback is a named function `junkfeathers_machine_footer_copyright` (no anonymous callback).
* [ ] It fetches the dynamic year using `wp_date('Y')`.
* [ ] It escapes the external URL using `esc_url('https://snorkleprawn.com')`.
* [ ] It preserves target attributes (`target="_blank"`, `rel="noopener noreferrer"`).
* [ ] PHP lint check passes cleanly on the modified theme file.
* [ ] The applied sync copies only the child-theme files and creates a backup outside of Git.
* [ ] The footer output displays the expected text exactly once.
* [ ] The Code Snippets plugin is inactive locally but remains installed.
* [ ] The database contains all 5 original snippet records.

## 8. Git Verification
* [ ] Git is initialized locally in the repository folder.
* [ ] The default branch is set to `main`.
* [ ] The `.gitignore` and `.gitattributes` files are present and match their specifications.
* [ ] A secret scan has been executed, confirming no passwords or site salts are staged.
* [ ] Git's staged file list is reviewed, and the commit is created on `main`.
* [ ] No remote origins (GitHub/GitLab) have been added, and no pushes have occurred.
