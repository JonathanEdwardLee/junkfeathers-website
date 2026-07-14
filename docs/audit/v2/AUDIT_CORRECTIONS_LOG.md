# Audit Corrections Log

This log documents all corrections made to the baseline technical audit of junkfeathers.com between Version 1 and Version 2.

---

## 1. Documented Corrections

| Correction ID | Original Claim | Corrected Claim | Reason / Context | Evidence Source | Recommendation Impact? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C-01** | WordPress version was stated as "WordPress 6.x." | WordPress version is **7.0.1**. | Factual error corrected. | Local site dashboard / database option checks. | **None**. |
| **C-02** | Local app version was unstated. | Local application version is **10.1.1**. | Missing environment context added. | Local system logs. | **None**. |
| **C-03** | GeneratePress was described as the active theme. | **Junkfeathers Machine** is the active theme, and **GeneratePress** is the parent dependency. | Factual theme relationship correction. | `/wp-content/themes/` directory structures. | **None**. |
| **C-04** | Displayed default MySQL credentials (`DB_USER: root`, `DB_PASSWORD: root`). | Displayed `[REDACTED FOR SECURITY]` in place of raw credentials. | Prevent security leak of credentials in public git logs. | Best practices in security. | **None**. |
| **C-05** | Recommended deleting Hostinger's `.disabled` plugin folders immediately. | Keep disabled folders in local backups; do not delete before Council review. | The folders were renamed deliberately during recovery and must be preserved. | Founder instruction. | Yes. Changed from deletion to exclusion from Git but preserving locally. |
| **C-06** | Recommended removing Google Site Kit to avoid stats overlap. | **KEEP Google Site Kit** (Founder approved). | Founder requires Site Kit for traffic, search, and ads monetization across sites. | Founder decision. | Yes. Changed from removal to keeping and optimizing configuration. |
| **C-07** | Recommended removing Jetpack. | **KEEP Jetpack** pending detailed module audit. | The connection to the founder's WordPress.com account is useful and must be preserved. | Founder decision. | Yes. Changed from removal to keeping and configuring modules selectively. |
| **C-08** | Stated that Jetpack and Site Kit load duplicate analytics. | Claimed only potential overlap. Only GA4 was verified active. | Site Kit GA4 config is confirmed active, but Jetpack stats are unverified on front-end. | Database options query (`googlesitekit_active_modules` vs `jetpack_active_modules`). | Yes. Confirmed overlap exists in configuration but needs front-end verification. |
| **C-09** | Assumed Google Fonts, variable fonts, and green/amber color palettes. | Presented visual assets, typography, and palettes as options with trade-offs. | Visual design styles are supplied and approved by the founder. | Visual direction guidelines. | Yes. Design implementation details are now options. |
| **C-10** | Recommended iframes as the default embedding strategy for external apps. | External apps routing and embedding strategies must be decided per app. | Apps like *The Local Agora* have distinct performance, SEO, and navigation requirements. | Technical guidelines. | Yes. Removed default iframe recommendations. |
| **C-11** | Stated that hardcoded local URLs were visual defects. | Treated hardcoded URLs as standard local variables to be replaced on deployment. | Local intentionally rewrites urls on import, and deployment replaces them. | Deployment workflow. | Yes. Changed risk classification to a deployment step. |
| **C-12** | Displayed internal system path links (e.g. `file:///C:/...`). | Displayed only repository-relative links (e.g. `wp-content/...`). | Avoid breaking links across developer environments. | Tool guidelines. | **None**. |

---

## 2. Active Verification Confirmation
This audit remains a **documentation and planning mission only**. No plugins were activated/deactivated, no theme files were modified, and no database parameters were altered during this audit process.
