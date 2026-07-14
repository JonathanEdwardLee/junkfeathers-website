# Plugin Decision Matrix & Hostinger Reach Decision Memo

This document contains the module-level evidence, configurations, and decisions for all plugins currently found in the junkfeathers.com local environment.

---

## 1. Plugin Decision Matrix

| Plugin Name & Version | Local State | Live State | Founder Purpose / Business Value | Verified Configuration (Database Evidence) | Front-end Assets & Services | Privacy / Security | Status | Evidence Needed |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GenerateBlocks** | Active | Unverified | Gutenberg layout editor. Critical for visual panels. | None | Front-end CSS generated for columns/containers. | **Low**. Fully self-hosted, no external data sent. | **KEEP** | Verify production layout consistency. |
| **Code Snippets** | Active | Unverified | Quick custom hooks injections. | Snippet 5 active (Footer copyright text override). Snippets 1-4 disabled. | None. | **Low**. PHP runs on server side. | **CONFIGURE** | Confirm list of active snippets on production database. |
| **LiteSpeed Cache** | Active | Unverified | Performance optimization on Hostinger servers. | Caching, JS minification, and CSS defer are currently **disabled** locally. | None loaded locally. | **Low**. Local caching. | **KEEP (Prod-Only)** | Verify LiteSpeed server presence on Hostinger live site. |
| **All in One SEO Pack** | Active | Unverified | XML sitemaps, search engine meta tags. | Custom settings for Google webmaster verification. | Meta description, canonical URLs, and schema markup in HTML. | **Low**. Local metadata generation. | **KEEP** | Verify existing production meta settings. |
| **Google Site Kit** | Active | Unverified | Traffic analysis, Search Console, GA4. | `analytics-4` and `pagespeed-insights` are **enabled**. AdSense is **inactive**. | Injects GA4 tracking script (`gtag.js`). Connects to Google API. | **Medium**. Collects visitor cookies and IPs. | **KEEP (Founder Locked)** | Confirm Analytics property matches live production site. |
| **Jetpack** | Active | Unverified | WordPress.com account connection and management dashboard. | Connected to user `junkfeathers` (Jon Lee). Modules active: `wpcom-reader`, `account-protection`, `blaze`, `blocks`, `contact-form`, `json-api`, `notes`, `protect`, `stats`, `subscriptions`, `woocommerce-analytics`. | Injects core Jetpack blocks CSS and tracking script if stats are active. | **Medium**. Syncs database content and user logins with WordPress.com servers. | **KEEP (Pending config)** | Verify live WordPress.com admin dashboard connection. |
| **WPForms Lite** `1.10.2.1` | Active | Unverified | Forms editor for contact and merch requests. | Modern markup enabled. No active forms saved in the database. | Form styles and validation JS loaded (if a form is embedded). | **Low**. Local database logs. | **KEEP** | Confirm if any contact form is actively used on the live site. |
| **AI Provider for OpenAI** `1.0.3` | Active | Unverified | WordPress AI Client interface. | Registers OpenAI provider class. Actual usage is unverified. | None loaded. | **Medium**. Calls external OpenAI API. | **COMPARE / REMOVAL CANDIDATE** | Verify if any AI content generator block or translation tool is actively used by the founder. |
| **Akismet** | Active | Unverified | Comment and form spam prevention. | Mapped to default widgets. | Spam verification script on form submission. | **Low**. Sends form IPs to Akismet servers. | **CONFIGURE** | Confirm if public comments are enabled on live posts. |
| **Hostinger Tools** | Disabled | Unverified | Hostinger admin dashboard panel. | Folder renamed to `hostinger.disabled`. | None loaded. | **Low**. Local admin dashboard widgets. | **COMPARE (Prod-Only)** | Verify if required for Hostinger account management in production. |
| **Hostinger Affiliate Marketing Tools** | Disabled | Unverified | Affiliate links assistant. | Folder renamed to `hostinger-affiliate-plugin.disabled`. | None. | None. | **REMOVAL CANDIDATE** | Confirm that no affiliate redirects are active on production. |
| **Hostinger Easy Onboarding** | Disabled | Unverified | Admin setup assistant wizard. | Folder renamed to `hostinger-easy-onboarding.disabled`. | None. | None. | **REMOVAL CANDIDATE** | Safe to remove. |
| **Hostinger Reach** | Disabled | Unverified | Hostinger newsletter tool. | Folder renamed to `hostinger-reach.disabled`. | None. | Collects emails. | **COMPARE (Memo Below)** | Confirm if any email list was previously collected via this tool. |
| **Hostinger must-use plugins** | Active | Unverified | Auto-updates and preview domain integration. | Automatically loaded files in `wp-content/mu-plugins`. | None. | None. | **KEEP (Prod-Only)** | Exclude from core custom repository. |

---

## 2. Hostinger Reach Decision Memo

**Subject**: Comparative Evaluation of Email Marketing Options for Junkfeathers Tech  
**Date**: Check date: July 13, 2026  
**Auditor**: Antigravity  

### Comparative Matrix

| Feature | Hostinger Reach | Mailchimp | Substack | Brevo (formerly Sendinblue) |
| :--- | :--- | :--- | :--- | :--- |
| **Free-Tier Capacity** | Mapped to Hostinger plan limits (usually very low or restricted to transaction counts). | Up to 500 contacts, 1,000 monthly sends (as of 2026 limits). | **Unlimited** subscribers and sends. | Up to 300 emails per day, unlimited contacts. |
| **List Ownership & Export** | Locked to Hostinger database. CSV export available. | Complete export. | Complete export. | Complete export. |
| **Portability** | **Poor**. Locked to Hostinger hosting. Moving host means rebuild. | **High**. Independent SaaS. | **High**. Independent SaaS. | **High**. Independent SaaS. |
| **Automation** | Basic triggers. | Advanced visual automations (restricted on free tier). | Basic newsletter triggers. | Advanced multi-step automations (included on free tier). |
| **Animated GIF Support** | Yes. | Yes (optimizations can compress them). | **Excellent**. Built for media-rich writing. | Yes. |
| **API / Webhook Access** | Restricted/Proprietary. | Full API / developer keys. | None (restricted to embeds). | Full developer API and webhooks. |
| **Cost as List Grows** | Tied to Hostinger email tier upgrades. | Steeper pricing curves. | **Free** ($0 cost, takes a share of paid subs only). | Flat volume pricing (independent of contact size). |
| **Solo Founder Ease** | Moderately simple, but clunky UI. | Complex, bloated wizard interface. | **Extremely Simple**. Pure writing focus. | Moderate. Visual newsletter builder. |
| **Sign-up Forms** | basic WP widgets. | JS embeds and popup builders. | Minimalist clean embeds. | Form builders with double opt-in. |
| **Privacy / Consent** | Basic GDPR check. | Full double opt-in and GDPR blocks. | Simple compliance structures. | Advanced consent tracking and compliance. |

### Technical Analysis of Candidates

1. **Hostinger Reach**:
   - *Verdict*: A host-locked tool. If Junkfeathers migrates away from Hostinger's hosting (e.g. to a dedicated VPS, WP Engine, or custom static server), the entire newsletter system, subscriber records, and histories are lost.
2. **Substack**:
   - *Verdict*: Excellent for solo founders who want zero maintenance and $0 costs for unlimited lists. It is highly optimized for writing and handles animated GIFs beautifully. However, it lacks advanced API webhooks to pipe subscription data into custom apps like *The Local Agora*.
3. **Brevo**:
   - *Verdict*: The best technical choice for app integration. It offers a generous free tier (300 emails/day, unlimited contacts) and robust APIs/webhooks, allowing the developer to automate signups directly from *The Local Agora* or custom synth widgets.
4. **Mailchimp**:
   - *Verdict*: Powerful, but the free tier has become very restrictive, and the pricing grows rapidly, which is not ideal for a solo artist/workshop site.

### Open Decision Path
No decision is made in this audit. The choice depends on whether the founder prefers a **writing-focused publication channel** (Substack) or a **developer-centric transactional/automated system** (Brevo) to integrate with future apps.
