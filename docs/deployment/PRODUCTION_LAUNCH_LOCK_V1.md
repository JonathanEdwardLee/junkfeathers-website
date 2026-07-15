# Production Launch Lock V1

This document locks the approved launch payload specifications and verification hashes for the live core launch. No deployable theme file or production-core HTML content block may change after the launch payload commit.

---

## 1. Launch Lock Metadata

* **Launch Payload Commit**: `54d1631`
* **Target Branch**: `main`
* **Child-Theme Version**: `0.5.0`
* **Production Status**: **LOCKED** (No deployment or live access is authorized without Stage B credentials).
* **Launch Lock Verification**: No live system has been accessed or modified in preparing this lock.

---

## 2. Cryptographic Hashes Manifest

These SHA-256 hashes define the only approved payload for deployment:

### Theme Files (Production Runtime)
* **`style.css`**: `4afa9c75ee90d6158dfc43547a00ec088b8b33b87344a9691f5ff5c4d82eff45`
  - Path: `themes/junkfeathers-machine/style.css`
* **`functions.php`**: `9e6f7b8c7c5c0b2750508951b9cf06307276ec59d2f2528c38b3b68e8f7bad24`
  - Path: `themes/junkfeathers-machine/functions.php`

### Database Page Markup (WordPress Editor)
* **Home Page HTML**: `fe8c94e51450e808e0ddb5a478bd042a430e6348b6708459665fc89abb36bda4`
  - Record: [docs/content/HOME_PAGE_PRODUCTION_CORE_V1.md](../content/HOME_PAGE_PRODUCTION_CORE_V1.md)
* **Tech Page HTML**: `e40641df4461971dbd6408d7f83cab9a915bdd36be57ab090eeb9370e5b60537`
  - Record: [docs/content/TECH_PAGE_PRODUCTION_CORE_V1.md](../content/TECH_PAGE_PRODUCTION_CORE_V1.md)
* **Orpheus Deck Page HTML**: `e47e3496236f57972932fb60ad17e4fbbf8bfacc2b58858d744b9824ceea8a75`
  - Record: [docs/content/ORPHEUS_PAGE_PRODUCTION_CORE_V1.md](../content/ORPHEUS_PAGE_PRODUCTION_CORE_V1.md)

---

## 3. Production Route Registry

All content updates are restricted to the following relative paths:
1. Home: `/`
2. Music: `/music/` (Unchanged database content)
3. Tech: `/tech/`
4. Orpheus Deck: `/orpheus-deck/`
5. App Privacy Policy: `/orpheus-deck-privacy-policy/` (Unchanged database content)
6. Chronos Draft: `/chronos/` (Unchanged database content)

---

## 4. Resource & Link Registries

### Outbound Store Route
* Google Play: `https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US`

### Verified Media Library Relative Paths
* `/wp-content/uploads/2026/07/OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png`
* `/wp-content/uploads/2026/07/OrpheusDeck_logo_512_app_icon.png`
* `/wp-content/uploads/2026/07/OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg`
* `/wp-content/uploads/2026/07/OrpheusDeck_OpeningMenu-526x1024.jpg`
* `/wp-content/uploads/2026/07/OrpheusDeck_Click_Track_Menu-526x1024.jpg`

---

## 5. Scope & Integration Boundaries

* **Signal List Omission**: All nonfunctional Local preview newsletter elements, email inputs, checkboxes, and status text classes are excluded from the production-core markup.
* **Hostinger Reach Pilot**: The free campaign plan remains unclaimed and inactive. No API connections, subscribers, or integrations exist on production.
* **WordPress Options Protection**: No database tables are imported, preventing overwrites of production settings, analytics, caching, or users.

---

## 6. Stage B Authorization Credentials

Stage B deployment is blocked until Jonathan Lee reviews this lock manifest and issues this exact command:

```text
AUTHORIZE TASK 12 LIVE DEPLOYMENT
```
