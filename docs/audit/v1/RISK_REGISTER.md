# Risk Register & Technical Audit Issues

This risk register identifies potential issues in performance, security, SEO, accessibility, and maintainability for the `junkfeathers.com` website.

---

## 1. Summary Risk Matrix

| Risk ID | Risk Title | Category | Severity | Likelihood | Description | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | Hardcoded Local Domains | Deployment | **High** | **High** | The database dumps and page contents contain hardcoded `https://junkfeatherscom.local` URLs. | Use a database migration tool (like WP Migrate DB or WP-CLI's `wp search-replace`) during deployment. |
| **R-02** | Optimization Plugin Conflicts | Performance | **Medium** | **High** | LiteSpeed Cache and Jetpack both have script minification and file caching. Having both active can cause visual breakage. | Disable all file optimizations, JS deferring, and CSS minifications in Jetpack. Delegate caching to LiteSpeed. |
| **R-03** | Mobile Embed Performance Bloat | Mobile / UX | **High** | **High** | The Music page loads 3 YouTube videos, 3 Bandcamp players, and a Spotify embed. This triggers dozens of network calls, slowing down mobile load times. | Implement lazy-loading or placeholder preview cards for embeds. Do not load iframe scripts until the user clicks a preview. |
| **R-04** | Code Snippets in DB | Maintainability | **Medium** | **Medium** | Storing custom PHP filters in the database hides logic from Git, leading to version control drift. | Move all custom functions into a dedicated site-utility plugin (e.g. `junkfeathers-core`) under Git tracking. |
| **R-05** | Inactive/Disabled Plugin Directory Bloat | Security | **Low** | **Medium** | Unused/disabled plugins (`.disabled` folders) remain in the directory and increase the site's attack surface. | Physically delete unused plugin folders. Keep the local environment exactly in sync with the production requirements. |
| **R-06** | Version Control Exposure of Secrets | Security | **High** | **Low** | Accidentally checking in `wp-config.php` or sql database backups containing database passwords or salts. | Add rules to `.gitignore` to explicitly block `wp-config.php`, `.env`, and `*.sql` files from the code repository. |
| **R-07** | Broken Navigation and Placeholders | UX / SEO | **Low** | **Low** | The `Chronos` page is empty and menu items are left in draft mode. | Either delete the empty page or add a draft notice/construction block if it's not ready. Publish menus only when ready. |

---

## 2. Risk Descriptions & Actionable Mitigations

### R-01: Hardcoded Local Domains (Deployment)
* **Details**: When pages are built locally using Gutenberg/GenerateBlocks, URLs of links and uploaded images (e.g., `https://junkfeatherscom.local/wp-content/uploads/2026/07/SignatureLogo-1.png`) are hardcoded into the post content in the database. When the database is exported and uploaded to Hostinger, these local links will break on the public site.
* **Action Plan**: During site migrations, always run a search-and-replace command. If using WP-CLI:
  ```bash
  wp search-replace 'https://junkfeatherscom.local' 'https://junkfeathers.com'
  ```

### R-02: Caching & Optimization Conflicts (Performance)
* **Details**: LiteSpeed Cache is optimized to run on Hostinger's LiteSpeed web servers. Jetpack offers a "Boost" speed feature. When both plugins try to bundle CSS and defer JS scripts, race conditions can cause JavaScript functionality (like menus or interactive animations) to fail silently.
* **Action Plan**: Standardize on LiteSpeed Cache for all speed/caching tools and disable Jetpack's optimization/CDN features.

### R-03: Mobile Embed Performance Bloat (Mobile / UX)
* **Details**: The Music page has several rich media iframe embeds. When a mobile user opens this page, the browser immediately tries to download scripts, tracking code, and media assets for Spotify, Bandcamp, and YouTube simultaneously. This can consume several megabytes of bandwidth and cause a stuttering scroll experience.
* **Action Plan**: Replace direct iframe embeds with lightweight custom SVG/image preview cards. When clicked, load the actual iframe. This aligns with the "feels like an app" mobile-first direction.

### R-04: Code Snippets in DB (Maintainability)
* **Details**: The copyright hook is saved inside the `wp_snippets` table. If the site code is modified or moved to a new server, these snippets are easily lost if they are not exported with the database dump.
* **Action Plan**: Move the footer copyright override code into the child theme's `functions.php` or a dedicated custom utility plugin.
