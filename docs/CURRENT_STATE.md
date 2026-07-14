# Current State of the Project (v4)

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
* **Sync Execution**: Applied sync (`sync-to-local.ps1 -Apply`) was run in Task 06, copying the child-theme `functions.php` updates to the Local site directory and creating a safe pre-sync backup under the `Junkfeathers Website Backups` folder.
* **Founder Backup Status**: Jonathan Lee has confirmed that a fresh Local site export and database backup have been saved securely outside the repository and Local site directories.

---

## 2. Environment & Tooling Boundaries

* **QA & Development Environment**: Local by WP Engine is the active local environment.
* **Hostinger Staging Status**: No paid Hostinger staging upgrade is planned. Local remains the sole development and QA site.
* **Production Deployment Status**: No production deployment pipeline or method is designed or authorized.
* **Hostinger Plugin Backups**: The four `.disabled` Hostinger plugins are preserved locally inside the Local backups but excluded from Git tracking.

---

## 3. Active Technical Inventory

### Active Plugins
1. **GenerateBlocks** (Visual Layout)
2. **LiteSpeed Cache** (Caching, currently disabled locally)
3. **All in One SEO Pack** (SEO metadata)
4. **Google Site Kit** (Google Analytics 4 & PageSpeed Insights)
5. **Jetpack** (Connected to WordPress.com user account `junkfeathers`)
6. **WPForms Lite** (Form builder, zero active forms)
7. **Akismet Anti-Spam** (Comment spam protection)

### Disabled Local Plugins (Preserved in Workspace)
* **Code Snippets** (Version: 3.9.6, Slug: `code-snippets` - Deactivated locally on July 13, 2026, following the successful migration of the GeneratePress footer copyright filter into the child theme code. The plugin remains installed locally; its five stored snippet records remain inside the database, and its live state remains unverified/unchanged).
* **AI Provider for OpenAI** (Version: 1.0.3, Slug: `ai-provider-for-openai` - Deactivated locally on July 13, 2026, following the founder's decision that it is not needed. The plugin remains installed locally; its live state remains unverified/unchanged, and deletion remains unauthorized).
* `hostinger.disabled`
* `hostinger-affiliate-plugin.disabled`
* `hostinger-easy-onboarding.disabled`
* `hostinger-reach.disabled`

---

## 4. Theme & Layout Hooks

* **GeneratePress Footer Copyright Hook**: Moves from Code Snippets database to the child theme [themes/junkfeathers-machine/functions.php](../../themes/junkfeathers-machine/functions.php).
* **Callback Function**: A named, documented function `junkfeathers_machine_footer_copyright` is registered to the `generate_copyright` filter. It formats the year dynamically using `wp_date('Y')`, escapes the external URL `https://snorkleprawn.com`, and preserves the original link attributes (`target="_blank"`, `rel="noopener noreferrer"`).

---

## 5. Site Navigation & Page Map

The active site pages are:
* `/` (Home): Split portal portal linking to Music and Tech.
* `/music/`: A list of YouTube, Bandcamp, and Spotify embeds.
* `/tech/`: Banner graphic linking to the Orpheus Deck subpage.
* `/orpheus-deck/`: Android recorder app info and Play Store outbound link.
* `/orpheus-deck-privacy-policy/`: Compliant App privacy policy.
* `/chronos/`: Empty draft placeholder.
