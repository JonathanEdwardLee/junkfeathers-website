# Current State of the Project (v9)

* **Last Updated**: July 28, 2026
* **Live Production Runtime**: WordPress on Hostinger (Tag `production-wordpress-v0.5.0` at commit `e481054`)
* **Legacy WordPress Reference/QA**: Local by WP Engine
* **Astro Replacement Target**: `web/` directory under branch `task/013-astro-machine-foundation` and private GitHub Pull Request #1 (unmerged)
* **Governance Standard**: Accepted Council OS 1.3 baseline
* **Hostinger / Reach Status**: Unconnected and inactive for Astro development
* **Pygmalion Visual Status**: Pending formal Pygmalion visual handoff and Website Council acceptance

---

## 1. Production & Baseline Fallback

* **Live Public Production**: WordPress remains the active public runtime for `junkfeathers.com`.
* **Legacy WordPress Baseline**: Tracked under tag `production-wordpress-v0.5.0` on commit `e481054`.
* **Local Reference**: Local by WP Engine serves as the legacy WordPress reference/QA environment.

---

## 2. Astro Machine Foundation Status (`web/`)

* **Repository Workspace**: `JonathanEdwardLee/junkfeathers-website` (private repository).
* **Branch**: `task/013-astro-machine-foundation`.
* **Pull Request**: GitHub PR #1 (open, review-ready, unmerged).
* **Stack**: Astro `6.4.8`, Node `22.23.1`, TypeScript `5.9.3`, `@astrojs/check` `0.9.9`.
* **Local Windows Verification**: Direct Node execution (`node .\node_modules\@astrojs\check\bin\astro-check.js` and `node .\node_modules\astro\bin\astro.mjs build`) works cleanly without script wrapper hangs.
* **Content Layer**: Content Layer API configured at `web/src/content.config.ts`.
* **Publication Guard**: `getPublishedEntries()` in `web/src/lib/content.ts` explicitly excludes drafts (`draft: true`) and internal schema fixtures (`internalFixture: true`) from public site routes.
* **CI Build Artifact**: GitHub Actions uploads a 5-day static review build artifact (`junkfeathers-astro-pr-build`) created from `web/dist/` via `actions/upload-artifact@v7`.

---

## 3. Environment & Service Boundaries

* **Hostinger / Reach**: No server connections, Reach activation, email collection, analytics changes, or DNS modifications exist for Astro development.
* **Pygmalion Visual Integration**: Jonathan is final visual authority; Pygmalion owns art direction, visual memory, and specifications. The Astro foundation uses a simple text-only skeleton until an approved visual handoff occurs.

---

## 4. Active Astro Route Map

* `/` (Home): Monochrome OLED machine front panel with neutral `Junkfeathers Music and Tech` identity.
* `/music/`: Music collection index using `getPublishedEntries('music')`.
* `/tech/`: Tech workshop index featuring Orpheus Deck using `getPublishedEntries('tech')`.
* `/orpheus-deck/`: High-conversion Android recorder app page with local static media assets and privacy link.
* `/orpheus-deck-privacy-policy/`: Complete 16-section founder-approved app privacy policy.
* `/chronos/`: Accurate historical prototype statement (`The original Junkfeathers timing-machine prototype. Future hardware work is parked.`).
