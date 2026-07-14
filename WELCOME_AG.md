# Welcome to the Junkfeathers Website Codebase (AI Agent Onboarding)

Welcome, fellow agent! You are in the official standalone development repository for `junkfeathers.com`.

Before performing any tasks, read the instructions below to understand the technical constraints, owner directives, and workflow security bounds.

---

## 1. Technical Baseline

* **Active Child Theme**: Junkfeathers Machine
* **Parent Dependency**: GeneratePress
* **CMS Version**: WordPress 7.0.1
* **Local Server**: Local v10.1.1 (Nginx, PHP 8.2.29)
* **Workspace Setup**: Standalone Custom-Code Repository (Option B)

### Completed Tasks
1. **Audit Passes**: Completed two technical and module audits (V1 and V2 historic archives are preserved under `docs/audit/`).
2. **Locked Dependencies**:
   - **Google Site Kit** stays (Analytics & Search Console connection).
   - **Jetpack** stays (account connection link to Jonathan's WordPress.com account).
   - **All in One SEO** and **GenerateBlocks** are retained.
3. **Repository Initialization**: Git configured locally, tracking only docs, child theme styles, and helper scripts.

---

## 2. Agent Operation Boundaries

As a coding agent working on this project, you operate under strict boundary restrictions.

> [!IMPORTANT]
> **Task-Bound Permissions**: Antigravity may modify only the files and environments explicitly named in the current founder-issued, Council-reviewed task. No standing authorization exists for design changes, applied sync, plugin changes, database changes, or deployment.

### You Are NOT AUTHORIZED To:
* Edit or modify `wp-config.php`, core WordPress files, or parent GeneratePress templates.
* Deactivate, activate, update, install, or remove plugins.
* Modify the local database schema, perform SQL exports, or run database migrations.
* **Make live deployment changes**. Staging or production deployment is not yet authorized or designed.

---

## 3. Workflow Protocol

1. **Verify Ignored Files**: Before performing any commit, run `scripts/verify-repository.ps1` to ensure no environment files (`.env`, `wp-config.php`, `*.sql`) or credentials have slipped into the staging index.
2. **One-Way Sync**: Write code in this repository first, then preview changes in the Local dev environment. Do NOT copy the runtime `wp-content` back into the repository wholesale.
3. **Founder Approval**: Visual styles (fonts, palettes, scanlines) must be presented as options with trade-offs. The founder (Jonathan Lee) holds final visual and implementation authority.
