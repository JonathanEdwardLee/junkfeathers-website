# Risk Register & Technical Audit Issues (v2)

This document evaluates the technical, UX, performance, and compliance risks identified in the baseline audit of `junkfeathers.com`.

---

## 1. Risk Evaluation Matrix

Each risk is evaluated separately for **Likelihood** (probability of occurrence) and **Severity** (impact on site operations, security, or UX) using a 3-tier scale (Low, Medium, High), backed by database and file evidence.

| Risk ID | Risk Title | Category | Severity | Likelihood | Description | Evidence / Context | Mitigation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R-01** | Unverified Live Production State | Deployment | **High** | **High** | The active plugin lists, database records, and server settings on the Hostinger live site remain unverified. | The local database dump is a snapshot, but active live configurations could have drifted. | Sync the production database and files to a staging domain before making changes. |
| **R-02** | Hardcoded Local URLs | Deployment | **Medium** | **High** | Page contents contain hardcoded local domains (`https://junkfeatherscom.local`). | Found inside [PAGE_AND_CONTENT_INVENTORY_v2.md](PAGE_AND_CONTENT_INVENTORY_v2.md) page html logs. | Run a search-and-replace using WP-CLI or database migration tools upon deployment. |
| **R-03** | Lack of Staging or Preview Deployment Path | Deployment | **Medium** | **High** | There is currently no configured pipeline or temporary staging domain to preview changes before pushing them live. | Found in `.envrc` logs; only local environment exists. | Set up a Hostinger staging domain (e.g. `staging.junkfeathers.com`) as the target first. |
| **R-04** | Database-Stored Content Exclusion | Maintainability | **Medium** | **High** | Tracking only code (theme, plugin) ignores layouts and pages saved in the WordPress MySQL database. | Our recommended Git strategy tracks file-based child theme assets, not page rows. | Periodically backup DB schema and layouts, and use GenerateBlocks reusable block exports. |
| **R-05** | Mobile Performance Bloat (Rich Embeds) | Performance | **High** | **High** | The Music page immediately loads YouTube, Bandcamp, and Spotify scripts and iframes. | Found inside [PAGE_AND_CONTENT_INVENTORY_v2.md](PAGE_AND_CONTENT_INVENTORY_v2.md). | Replace iframe embeds with lazy-loading element cards. |
| **R-06** | Future OLED Animation & Audio Lag | Performance | **Medium** | **Medium** | Long scrolling layouts with complex canvas animations, gears, and audio synthesis will cause rendering delays. | Core product vision (tactile widgets) requires heavy DOM updates. | Throttle window scroll events, use Web Workers, and leverage CSS transform/hardware acceleration. |
| **R-07** | Privacy & Consent Violations | Compliance | **High** | **Medium** | Active Google GA4 tracking, email signups, and third-party embeds (YouTube/Spotify) store tracking cookies without consent. | Site Kit is active and injecting Google tags directly. | Implement a Cookie Consent banner mapped to GTM or GA4 Consent Mode. |
| **R-08** | Split-Face Navigation Accessibility | Accessibility | **Medium** | **Medium** | A split horizontal grandfather clock face controls primary navigation. Screen readers and mobile zoom can break. | Creative direction features a non-standard homepage panel. | Use semantic links, aria-labels, high contrast focus states, and keep standard footer text menus. |
| **R-09** | Fidget Actions Confusing Navigation | UX | **Medium** | **Medium** | Interactive tactile mechanical gears could confuse users if they look like links but have no action. | Creative direction highlights decorative mechanisms. | Use distinct styling (cursors, hover labels) to separate interactive links from playful fidget objects. |
| **R-10** | Database Logic Drift (Code Snippets) | Maintainability | **Medium** | **Medium** | Storing copyright filters in database hides them from Git history. | Verified custom snippet active in local database. | Move active snippets to the custom plugin and deactivate the database runner plugin. |
| **R-11** | Local Disabled Folder Safety | Security | **Low** | **Low** | renaming folders to `.disabled` prevents execution but keeps code in local folder. | Checked four folders with `.disabled` extensions. | Exclude `.disabled` folders from Git but keep them in backups. They are inactive and represent zero live threat. |

---

## 2. Risk Deep-Dive & Action Plans

### R-05: Mobile Performance Bloat (Rich Embeds)
* **Evidence**: The Music page contains 1 logo image, 3 YouTube video/playlist embeds, 3 Bandcamp embedded players, and 1 Spotify artist profile embed. This triggers dozens of external network calls.
* **Mitigation**: Instead of loading iframe elements on page load, write a script to generate a static image wrapper (using video thumbnails/album art) with a "Play" icon. Only when a visitor clicks does the script replace the thumbnail with the actual iframe.

### R-06: Future OLED Animation & Audio Lag
* **Context**: The homepage is envisioned as an OLED grandfather clock machine with visible gears and mechanisms.
* **Mitigation**: Avoid bloated animation libraries (like Lottie or heavy JS routines). Build the gears using standard CSS animations running on the GPU (`will-change: transform`). Perform any audio calculation or music-theory synthesis inside lightweight Web Workers to prevent blocking the UI thread.

### R-07: Privacy & Consent (Analytics, Newsletter, and Embeds)
* **Context**: GA4 is active, and the founder plans to collect emails and introduce merch links.
* **Mitigation**:
  - *YouTube*: Load videos using the `www.youtube-nocookie.com` domain to prevent YouTube from setting tracking cookies before the user plays the video.
  - *Consent Mode*: Configure GA4 to only collect anonymized hits if the user rejects cookies, complying with current privacy regulations.

### R-08: Split-Face Navigation Accessibility (Accessibility)
* **Context**: A split horizontal grandfather clock controls primary navigation (top half = Music, bottom half = Tech).
* **Mitigation**: Ensure screen readers can interpret the layout. The split buttons must use native HTML `<a>` tags with explicit `aria-label="Access Music Portal"` and `aria-label="Access Tech Portal"`. Keyboard navigation must support standard focus rings so users can jump between portals using the `Tab` key.
