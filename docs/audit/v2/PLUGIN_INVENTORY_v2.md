# Plugin Inventory & Redundancy Analysis (v2)

This document provides a detailed breakdown of all WordPress plugins currently installed on the local site under WordPress 7.0.1.

---

## 1. Active Standard Plugins

The local database verifies the following **9 standard plugins** are active:

| Plugin Name | Folder Name | Active Version | Primary Purpose | Status / Dependency | Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GenerateBlocks** | `generateblocks` | *Current* | Layout block builder for Gutenberg. | **KEEP**. Essential layout tool. | [Junkfeathers Machine Theme](wp-content/themes/junkfeathers-machine/) |
| **Code Snippets** | `code-snippets` | *Current* | PHP/JS/CSS injections via WP Dashboard. | **KEEP**. Review for later core migration. | [Theme & Code Map](THEME_AND_CUSTOM_CODE_MAP_v2.md) |
| **LiteSpeed Cache** | `litespeed-cache` | *Current* | High-performance caching and media optimization. | **KEEP**. Caching remains disabled locally. | [Plugin Decision Matrix](PLUGIN_DECISION_MATRIX.md) |
| **All in One SEO Pack** | `all-in-one-seo-pack` | *Current* | Meta tags, XML sitemaps, search optimization. | **KEEP**. Standardizes SEO controls. | [Plugin Decision Matrix](PLUGIN_DECISION_MATRIX.md) |
| **Google Site Kit** | `google-site-kit` | *Current* | Official Google connection (Analytics, Search Console). | **KEEP (Founder Approved)**. | [Measurement & Data Plan](MEASUREMENT_AND_DATA_PLAN.md) |
| **Jetpack** | `jetpack` | *Current* | Connection to WordPress.com management dashboard. | **KEEP (Pending Module Audit)**. | [Plugin Decision Matrix](PLUGIN_DECISION_MATRIX.md) |
| **WPForms Lite** | `wpforms-lite` | `1.10.2.1` | Visual contact forms creator. | **KEEP**. Has no active forms in local DB. | [Plugin Decision Matrix](PLUGIN_DECISION_MATRIX.md) |
| **AI Provider for OpenAI** | `ai-provider-for-openai` | `1.0.3` | OpenAI backend integration for WordPress. | **Active (Use Unverified)**. | [Plugin Decision Matrix](PLUGIN_DECISION_MATRIX.md) |
| **Akismet Anti-Spam** | `akismet` | *Current* | Filters spam from comments and forms. | **KEEP**. Review comments status. | [Plugin Decision Matrix](PLUGIN_DECISION_MATRIX.md) |

---

## 2. Inactive / Disabled Plugins

The following plugins are present in the filesystem but are **disabled**:

| Plugin Name | Folder Name | Status | Purpose | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Hostinger Main** | `hostinger.disabled` | Inactive | Platform-specific settings. | **Keep in production / Exclude from Git**. |
| **Hostinger Reach** | `hostinger-reach.disabled` | Inactive | Email-marketing tool. | **Compare** before choosing a provider. |
| **Hostinger Affiliate** | `hostinger-affiliate-plugin.disabled` | Inactive | Affiliate program helper. | **Exclude from Git / Archive**. |
| **Hostinger Easy Onboarding** | `hostinger-easy-onboarding.disabled` | Inactive | Onboarding assistant. | **Exclude from Git / Archive**. |

> [!NOTE]
> The `.disabled` extension on these folders was added deliberately during local recovery to prevent environment initialization conflicts. They are not a public production attack surface. They should be excluded from Git, but they must not be deleted from the preserved baseline before Council review.

---

## 3. Must-Use Plugins (`mu-plugins`)

These plugins are located in the `wp-content/mu-plugins` folder. They are loaded automatically by WordPress and cannot be deactivated via the admin interface:

1. **`hostinger-auto-updates.php`**
   - **Purpose**: Enforces automatic updates for Hostinger WordPress sites.
   - **Recommendation**: This is a production integration file. Exclude from the custom-code repository.
2. **`hostinger-preview-domain.php`**
   - **Purpose**: Rewrites site URLs dynamically when previewing a site on a Hostinger temporary preview domain.
   - **Recommendation**: Production-only file. Exclude from the custom-code repository.

---

## 4. Analytical Alignment (Google Site Kit)

Google Site Kit is founder-approved and must remain a core component of the site. It binds the site to the owner's Google account to show Analytics and Search Console data. 

To prevent tracking errors:
* **No Duplicate Tracking**: Ensure Google Analytics is not injected via custom theme code or other plugins (like Jetpack or AIOSEO) if it is already loaded by Site Kit.
* **Consent Controls**: Integrate cookie consent banners (if needed) with Google Tag Manager or Site Kit's Consent Mode APIs.
* **Privacy Compliance**: Ensure IP anonymization and user privacy settings match junkfeathers.com's public policies.
