# Plugin Inventory & Redundancy Analysis

This document provides a detailed breakdown of all WordPress plugins currently installed in the local environment, categorizing them by status and evaluating their relevance, performance impact, and potential redundancy.

---

## 1. Active Standard Plugins

Based on the local database check, the following **9 standard plugins** are currently active:

| Plugin Name | Folder Name | Active Version | Primary Purpose | Risk / Redundancy | Recommendation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GenerateBlocks** | `generateblocks` | *Current* | Layout block builder for Gutenberg. | **Low**. Essential for layout building without template bloat. | **Keep**. Use as the primary layout tool. |
| **Code Snippets** | `code-snippets` | *Current* | PHP/JS/CSS injections via WP Dashboard. | **Medium**. Can obscure codebase history and lead to deployment drift. | **Keep temporarily**. Plan to migrate custom PHP functions to a dedicated site utility plugin. |
| **LiteSpeed Cache** | `litespeed-cache` | *Current* | High-performance caching and media optimization. | **Medium**. Overlaps heavily with Jetpack's optimization tools. | **Keep in Production** only if running on a LiteSpeed web server (like Hostinger). |
| **All in One SEO Pack** | `all-in-one-seo-pack` | *Current* | Meta tags, XML sitemaps, search optimization. | **Medium**. Overlaps with Jetpack's traffic and SEO module. | **Keep**. Standardize on this for SEO, but disable competing modules in Jetpack. |
| **Google Site Kit** | `google-site-kit` | *Current* | Official Google connection (Analytics, Search Console). | **Low**. Displays analytics inside the WP admin. | **Keep**. Best practice for standard Google integration. |
| **Jetpack** | `jetpack` | *Current* | Suite of security, backups, and performance tools. | **High**. Massive performance footprint; overlaps with LiteSpeed (speed) and Site Kit (stats). | **Review**. If only used for stats or backups, replace with lightweight alternatives. |
| **WPForms Lite** | `wpforms-lite` | `1.10.2.1` | Visual contact forms creator. | **Low**. Currently has no active forms in the database. | **Keep**. Use to create future contact/merch inquiry forms. |
| **AI Provider for OpenAI** | `ai-provider-for-openai` | `1.0.3` | OpenAI backend integration for WordPress. | **Low / Inactive**. Appears to be an unused experiment. | **Deactivate / Delete**. Remove to keep the site minimal and secure. |
| **Akismet Anti-Spam** | `akismet` | *Current* | Filters spam from comments and contact forms. | **Low**. Unnecessary if comments are closed and forms are spam-protected. | **Deactivate** if comments are closed. Keep only if public comments are allowed. |

---

## 2. Inactive / Disabled Plugins

The following plugins are present in the filesystem but are **disabled**:

| Plugin Name | Folder Name | Status | Purpose | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Hostinger Main** | `hostinger.disabled` | Inactive | Platform-specific settings. | **Keep in production / Delete locally**. |
| **Hostinger reach** | `hostinger-reach.disabled` | Inactive | Newsletter / email list tools. | **Delete**. Do not use platform-locked newsletter tools. Use an independent service (like Mailchimp or Substack). |
| **Hostinger Affiliate** | `hostinger-affiliate-plugin.disabled` | Inactive | Affiliate program helper. | **Delete**. Unnecessary site bloat. |
| **Hostinger Easy Onboarding** | `hostinger-easy-onboarding.disabled` | Inactive | Onboarding assistant. | **Delete**. Unnecessary wizard. |

> [!NOTE]
> The `.disabled` extension on these folders was likely added to force-deactivate them in local development. They should be deleted from the filesystem of the git repository to keep files clean.

---

## 3. Must-Use Plugins (`mu-plugins`)

These plugins are located in the `wp-content/mu-plugins` folder. They are loaded automatically by WordPress and cannot be deactivated via the admin interface:

1. **`hostinger-auto-updates.php`**
   - **Purpose**: Enforces automatic updates for Hostinger WordPress sites.
   - **Recommendation**: This is a production integration file. It should remain in production but is not needed in the local version-controlled codebase.
2. **`hostinger-preview-domain.php`**
   - **Purpose**: Rewrites site URLs dynamically when previewing a site on a Hostinger temporary preview domain.
   - **Recommendation**: Production-only file. Exclude from version control.

---

## 4. Redundancy & Conflict Analysis

### Cache & Optimization Conflict
* **LiteSpeed Cache** and **Jetpack Boost / Performance** settings both try to optimize css/js delivery, defer scripts, and serve optimized media.
* **Risk**: Enabling optimization settings on both plugins will cause layout breakage, script failures, or white-screen errors.
* **Mitigation**: Turn off all performance/media optimization switches in Jetpack and delegate caching/file minification entirely to LiteSpeed Cache.

### Analytics Overlap
* **Google Site Kit** and **Jetpack Stats** both track page views.
* **Risk**: Dual script loading increases page weight and can slow down mobile loading times.
* **Mitigation**: Standardize on Google Site Kit for analytics and turn off the stats module inside Jetpack.
