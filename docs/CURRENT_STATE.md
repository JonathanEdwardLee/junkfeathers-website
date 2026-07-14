# Current State of the Project (v2)

* **Last Updated**: July 13, 2026
* **WordPress Version**: 7.0.1
* **Local App version**: 10.1.1
* **Database Target**: `local` (MySQL 8.4.0)
* **Local Server**: Nginx, PHP 8.2.29
* **Active Child Theme**: Junkfeathers Machine (v0.1.0)
* **Parent dependency**: GeneratePress

---

## 1. Local Baseline Backup Status

* **Local Site State**: The local WordPress site was confirmed to open successfully in the Local GUI client, and the primary paths (`/`, `/music/`, `/tech/`, and `/orpheus-deck/`) are functional.
* **Sync Execution**: Applied sync (`sync-to-local.ps1 -Apply`) was NOT run in Task 04; only dry-run checks have been completed.
* **Founder Backup Status**: The saving of a fresh Local site export and database backup still requires final founder confirmation.

---

## 2. Environment & Tooling Boundaries

* **QA & Development Environment**: Local by WP Engine is the active local environment.
* **Hostinger Staging Status**: No paid Hostinger staging upgrade is planned. Local remains the sole development and QA site.
* **Production Deployment Status**: No production deployment pipeline or method is designed or authorized.
* **Hostinger Plugin Backups**: The four `.disabled` Hostinger plugins are preserved locally inside the Local backups but excluded from Git tracking. No custom plugins exist, and no plugin state changed during this task.

---

## 3. Active Technical Inventory

### Active Plugins
1. **GenerateBlocks** (Visual Layout)
2. **Code Snippets** (PHP Database Hook Injector)
3. **LiteSpeed Cache** (Caching, currently disabled locally)
4. **All in One SEO Pack** (SEO metadata)
5. **Google Site Kit** (Google Analytics 4 & PageSpeed Insights)
6. **Jetpack** (Connected to WordPress.com user account `junkfeathers`)
7. **WPForms Lite** (Form builder, zero active forms)
8. **AI Provider for OpenAI** (OpenAI WordPress AI Client register)
9. **Akismet Anti-Spam** (Comment spam protection)

### Disabled Local Plugins (Preserved in Workspace)
* `hostinger.disabled`
* `hostinger-affiliate-plugin.disabled`
* `hostinger-easy-onboarding.disabled`
* `hostinger-reach.disabled`

---

## 4. Site Navigation & Page Map

The active site pages are:
* `/` (Home): Split portal portal linking to Music and Tech.
* `/music/`: A list of YouTube, Bandcamp, and Spotify embeds.
* `/tech/`: Banner graphic linking to the Orpheus Deck subpage.
* `/orpheus-deck/`: Android recorder app info and Play Store outbound link.
* `/orpheus-deck-privacy-policy/`: Compliant App privacy policy.
* `/chronos/`: Empty draft placeholder.
