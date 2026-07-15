# Current State of the Project (v8)

* **Last Updated**: July 14, 2026
* **WordPress Version**: 7.0.1
* **Local App version**: 10.1.1
* **Database Target**: `local` (MySQL 8.4.0)
* **Local Server**: Nginx, PHP 8.2.29
* **Active Child Theme**: Junkfeathers Machine (v0.5.0)
* **Parent dependency**: GeneratePress

---

## 1. Local Baseline Backup Status

* **Local Site State**: The local WordPress site is running. The primary paths (`/`, `/music/`, `/tech/`, and `/orpheus-deck/`) are functional.
* **Sync Execution**: Applied sync (`sync-to-local.ps1 -Apply`) was run in Task 10, copying the child-theme `style.css` and `functions.php` updates (version 0.5.0) and creating a safe pre-sync backup under the `Junkfeathers Website Backups` folder.
* **Founder Backup Status**: Jonathan Lee has confirmed that a fresh Local site export and database backup have been saved securely outside the repository and Local site directories.

---

## 2. Environment & Tooling Boundaries

* **QA & Development Environment**: Local by WP Engine is the active local environment.
* **Hostinger Staging Status**: No paid Hostinger staging upgrade is planned. Local remains the sole staging/QA location.
* **Production Deployment Status**: No production deployment pipeline or method is designed or authorized.
* **Hostinger Plugin Backups**: The four `.disabled` Hostinger plugins are preserved in the Local site's active plugin directory `wp-content/plugins/` (with a `.disabled` suffix to prevent activation) but excluded from Git tracking.

---

## 3. Active Technical Inventory

### Active Plugins
1. **GenerateBlocks** (Visual Layout)
2. **LiteSpeed Cache** (Caching plugin - active on production host, but deactivated/disabled in the Local site configuration to prevent layout caching conflicts during local QA and development)
3. **All in One SEO Pack** (SEO metadata)
4. **Google Site Kit** (Google Analytics 4 & PageSpeed Insights)
5. **Jetpack** (Connected to WordPress.com user account `junkfeathers`)
6. **WPForms Lite** (Form builder, zero active forms)
7. **Akismet Anti-Spam** (Comment spam protection)

### Disabled Local Plugins (Preserved in Workspace)
* **Code Snippets** (Version: 3.9.6, Slug: `code-snippets` - Deactivated locally on July 13, 2026, following the successful migration of the GeneratePress footer copyright filter into the child theme code. The plugin remains installed locally; its five stored snippet records remain inside the database, and its live state remains unverified/unchanged).
* **AI Provider for OpenAI** (Version: 1.0.3, Slug: `ai-provider-for-openai` - Deactivated locally on July 13, 2026, following the founder's decision that it is not needed. The plugin remains installed locally; its live state remains unverified/unchanged, and deletion remains unauthorized).
* **Hostinger Reach** (Version: 1.5.6, Slug: `hostinger-reach.disabled` - Preserved in the plugins directory with a `.disabled` suffix to prevent accidental activation. The pilot integration remains inactive and unconnected).
* `hostinger.disabled`
* `hostinger-affiliate-plugin.disabled`
* `hostinger-easy-onboarding.disabled`

---

## 4. Theme & Layout Hooks

* **GeneratePress Footer Copyright Hook**: Moves from Code Snippets database to the child theme [themes/junkfeathers-machine/functions.php](../themes/junkfeathers-machine/functions.php).
* **Callback Function**: A named, documented function `junkfeathers_machine_footer_copyright` is registered to the `generate_copyright` filter. It formats the year dynamically using `wp_date('Y')`, escapes the external URL `https://snorkleprawn.com`, and preserves the original link attributes (`target="_blank"`, `rel="noopener noreferrer"`).

---

## 5. Visual Foundation & Homepage Prototype

* **Visual System**: Monochrome OLED (black site background, white primary text, gray details, restrained link green).
* **Typography**: Default generic `monospace` family, no remote/Google fonts are loaded.
* **Layout Structure**: Flat square geometry (zero rounded corners, zero drop shadows). Depth is supplied by border weights, grid spacing, and line dividers.
* **Scanlines**: Confined strictly to screen display classes (such as `.jf-screen`). The global body background is set to solid black.
* **Homepage**: ID 5 is updated locally to display a framed monochrome machine front panel prototype (includes site title, status string, and square navigation buttons) and a compact nonfunctional signup panel prototype at the bottom.
* **Tech Landing Page**: ID 10 is updated locally as a concise monochrome machine directory featuring Orpheus Deck (ID 12) with a custom CTA and relative paths.
* **Orpheus Deck Page**: ID 12 is updated locally as a high-conversion landing page containing a dynamic download button, descriptive purpose block, screenshots, local-first privacy statement, and a nonfunctional signup panel prototype. Unreleased branch features (V34/CUT) and O-FX/LIMIT panels are omitted. Two metadata rows (Release Date and Engine) have been removed.

---

## 6. Site Navigation & Page Map

The active site pages are:
* `/` (Home): A monochrome OLED machine front panel prototype with signup.
* `/music/`: A list of YouTube, Bandcamp, and Spotify embeds.
* `/tech/`: A concise monochrome machine directory featuring Orpheus Deck.
* `/orpheus-deck/`: Android recorder app info, Play Store outbound link, screenshots, local-first privacy panel, nonfunctional signup, and a return link to `/tech/`.
* `/orpheus-deck-privacy-policy/`: Compliant App privacy policy.
* `/chronos/`: Empty draft placeholder.

---

## 7. Versioning Conventions

To maintain clear and accurate history tracking, we apply two separate versioning pathways:
1. **Root Repository Changelog**: Tracks workspace setup, script configurations, database reproducibility records, and workflow milestones (e.g. `0.5.0`, `0.6.0`, `0.7.0`, `0.8.0`, `0.9.0`).
2. **Child-Theme Version**: Tracks visitor-facing child theme code, styles, and template assets loaded by WordPress (e.g. `0.2.0`, `0.3.0`, `0.4.0`, `0.5.0`).
*They serve distinct purposes and do not need to share identical version numbers.*
