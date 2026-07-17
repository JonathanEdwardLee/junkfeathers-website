# Astro Rebuild Decision V1

This document evaluates the transition from the legacy WordPress runtime to a modern Git-native Astro static site architecture for **junkfeathers.com**.

* **Date**: July 16, 2026
* **Status**: **Approved Proof of Concept**

---

## 1. Architectural Rationales

The transition from WordPress to Astro resolves several developer overhead and business goals identified by Jonathan Lee and the Website Council:

1. **Artistic Freedom**: Custom monochrome layouts, retro OLED terminal interfaces, and dynamic visual panels can be written cleanly in semantic HTML and CSS, without fighting database page layouts or block editor serialization.
2. **Simplified AI Maintenance**: A static layout is highly readable. LLMs can edit Markdown files, configure content schema, or add static Astro components without breaking database structures or option tables.
3. **Reproducible Builds**: With a committed lockfile (`package-lock.json`), anyone can recreate the exact site output, resolving local-to-production configuration discrepancies.
4. **Maintenance Overhead Reduction**:
   - Zero WordPress Core updates.
   - Zero third-party plugin updates (Jetpack, LiteSpeed Cache, WPForms).
   - Zero SQL database backups required for regular site rendering.
5. **Fast static delivery**: The final build is pure HTML/CSS/JS, served directly from a global CDN or basic file storage.

---

## 2. Transition Plan & Rollback Boundary

* The existing WordPress database, posts, media assets, and files remain active and untouched.
* The WordPress project is tracked as the legacy fallback point under tag `production-wordpress-v0.5.0` on local commit `e481054`.
* The Astro proof of concept resides in the `web/` directory.

---

## 3. Technology Stack Choice

* **Framework**: Astro (latest stable `v5.2.2`).
* **Output Mode**: `static` (zero server-side Node rendering dependency for pages).
* **Styling**: Vanilla CSS.
* **Data Layer**: Content Collections (typed frontmatter).
* **Client Framework**: None (Pure HTML/CSS/Vanilla JS).
