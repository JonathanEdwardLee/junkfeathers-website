# Astro Rebuild Decision V1

This document evaluates the transition from the legacy WordPress runtime to a modern Git-native Astro static site architecture for **junkfeathers.com**.

* **Date**: July 28, 2026
* **Status**: **Approved Proof of Concept (Task 013B Foundation)**

---

## 1. Architectural Rationales

The transition from WordPress to Astro resolves several developer overhead and business goals identified by Jonathan Lee and the Website Council:

1. **Artistic Freedom**: Custom monochrome layouts, retro OLED terminal interfaces, and dynamic visual panels can be written cleanly in semantic HTML and CSS, without fighting database page layouts or block editor serialization.
2. **Simplified AI Maintenance**: A static layout is highly readable. Coding agents can edit Markdown files, configure content schema, or add static Astro components without breaking database structures or option tables.
3. **Reproducible Builds**: With a committed lockfile (`package-lock.json`), anyone can recreate the exact site output, resolving local-to-production configuration discrepancies.
4. **Maintenance Overhead Reduction**:
   - Zero WordPress Core updates.
   - Zero third-party plugin updates (Jetpack, LiteSpeed Cache, WPForms).
   - Zero SQL database backups required for regular site rendering.
5. **Fast static delivery**: The final build is pure HTML/CSS/JS, served directly from a static host or basic file storage.

---

## 2. Transition Plan & Rollback Boundary

* The existing WordPress database, posts, media assets, and files remain active and untouched.
* The WordPress project is tracked as the legacy fallback point under tag `production-wordpress-v0.5.0` on commit `e481054`.
* The Astro replacement resides in the `web/` directory under branch `task/013-astro-machine-foundation` and unmerged Pull Request #1.
* No merge or production deployment has occurred.

---

## 3. Technology Stack Choice

* **Framework**: Astro `6.4.8`
* **Node Version**: `22.23.1`
* **TypeScript Version**: `5.9.3`
* **Astro Check**: `@astrojs/check` `0.9.9`
* **Content Layer**: Content Layer API configured at `web/src/content.config.ts`
* **Output Mode**: `static` (zero server-side Node rendering dependency for pages)
* **Styling**: Vanilla CSS
* **Client Framework**: None (Pure HTML/CSS/Vanilla JS)
