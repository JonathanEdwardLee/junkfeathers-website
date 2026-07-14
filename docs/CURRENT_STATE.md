# Current State of the Project

* **Last Updated**: July 13, 2026
* **WordPress Version**: 7.0.1
* **Local App version**: 10.1.1
* **Database Target**: `local` (MySQL 8.4.0)
* **Local Server**: Nginx, PHP 8.2.29
* **Active Child Theme**: Junkfeathers Machine (v0.1.0)
* **Parent dependency**: GeneratePress

---

## 1. Local Baseline Backup Confirmation

Before executing this repository bootstrap:
1. **Local Site State**: The local WordPress site was confirmed to open successfully in the Local GUI client, and the primary paths (`/`, `/music/`, `/tech/`, and `/orpheus-deck/`) are functional.
2. **Founder Confirmation**: Jonathan Lee has confirmed that a fresh Local site export and equivalent database backup (including the recovered Hostinger-specific plugins) have been saved to a secure backup directory outside the version-controlled codebase.

---

## 2. Active Technical Inventory

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

## 3. Site Navigation & Page Map

The active site pages are:
* `/` (Home): Split portal portal linking to Music and Tech.
* `/music/`: A list of YouTube, Bandcamp, and Spotify embeds.
* `/tech/`: Banner graphic linking to the Orpheus Deck subpage.
* `/orpheus-deck/`: Android recorder app info and Play Store outbound link.
* `/orpheus-deck-privacy-policy/`: Compliant App privacy policy.
* `/chronos/`: Empty draft placeholder.
