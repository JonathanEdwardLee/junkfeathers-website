# Council Decisions Log

This document records the official decisions, requirements, and revisions approved by Jonathan Lee and the Website Council.

---

## 1. Locked Decisions (Non-Negotiable)

* **Theme Framework**: **Junkfeathers Machine** is the active child theme shell, built on the parent theme dependency **GeneratePress**.
* **Layout Builder**: **GenerateBlocks** is the primary layout tool. No other visual builders (such as Elementor or Divi) may be introduced.
* **Google Site Kit**: MUST keep. Site Kit connects the site to the owner's Google account to track analytics, Search Console, and performance data.
* **Jetpack Connection**: MUST keep. The link mapping user `junkfeathers` to Jonathan's WordPress.com account is required for dashboard management.
* **SEO Management**: **All in One SEO Pack** stays.
* **Separate App Boundary**: The *Local Agora* remains a separate, standalone Flutter web application. WordPress provides only the landing/policy assets and launch redirections. Future substantial tools (like a web-based version of Orpheus Deck) will follow a separate application model.
* **Repository Architecture**: Standalone, custom-code-only repository (Option B).
* **Footer Copyright Hook**: Moved from the database Snippets table to the child theme codebase. The GeneratePress `generate_copyright` filter is managed as a version-controlled named callback `junkfeathers_machine_footer_copyright`.
* **Code Snippets**: Deactivated in the Local environment on July 13, 2026, following the successful footer hook migration. The plugin remains installed locally, its five stored snippet records are kept in the database, and its live state remains unverified/unchanged.
* **AI Provider for OpenAI**: The founder decided that this plugin is not needed. It was deactivated in the Local environment on July 13, 2026. The plugin remains installed locally; its live state remains unverified/unchanged, and deletion remains unauthorized.
* **Environment Change Freeze**: No changes to the live site, Local database, or plugin activation states (except the authorized local deactivation of AI Provider and Code Snippets) are permitted during this phase.
* **Tactile Creative Directive**: Visual aesthetics are supplied/approved by Jonathan. The design must be mobile-first, prioritize accessibility, support user-triggered sound, and respect reduced-motion requests.

---

## 2. Provisional / Pending Decisions (Requires Further Verification)

* **Jetpack Module Configurations**: Optional modules (such as WooCommerce analytics, Blaze, JSON-API) are candidates for deactivation to improve speed, pending a local verification of dependencies.
* **Hostinger Plugins**: Affiliate Marketing Tools and Easy Onboarding are removal candidates, but no action is authorized. Hostinger Reach is under review.
* **Hostinger Reach**: Maintained as an open option. Reach supports external signup forms, CSV exports, public APIs, and integrations with systems like n8n. It is NOT host-locked. A final choice between Reach, Substack, Brevo, or Mailchimp remains open.
* **Akismet**: Remains active under review. If comments remain closed and WPForms uses other spam controls, it may be deactivated.
* **LiteSpeed Cache**: Kept for production optimization. Caching remains disabled locally to prevent layout caching conflicts during development.

---

## 3. Corrected Audit Claims

The following claims from V1 have been corrected:
* **Repository Security**: The standalone repository is NOT "100% safe." While it isolates local credentials, it still requires strict secret scanning, pre-commit validation, and path checks.
* **Consent Requirements**: Consent is NOT universally "not required" for default tags. Consent requirements depend on site configuration, geo-location policies, and the selected cookie management tools.
* **GA4 Tracking**: Enhanced measurements (like scroll tracking, video interactions, and outbound clicks) cannot be assumed to function automatically until verified via live event streams.
* **Technology Choice**: Future tools are NOT locked to React or Vue. Technology is selected on a per-product basis.
* **Audio Processing**: Web Workers are not default Web Audio processors. AudioWorklets or other APIs will be selected based on real-time processing requirements.
* **Copyright Hook Location**: The `generate_copyright` hook is a theme-level filter and may remain in the child theme rather than moving to a custom plugin. No refactoring is authorized.
* **will-change CSS**: The `will-change` property must be applied sparingly in CSS and only when performance profiles justify it, avoiding general layout lag.
