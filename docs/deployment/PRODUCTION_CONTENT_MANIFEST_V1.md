# Production Content Manifest V1

* **Date Prepared**: July 15, 2026
* **Child-Theme Version**: `0.5.0`
* **Target Launch State**: **Omitted Signups** (All nonfunctional Signal List preview panels are excluded from this release manifest).
* **Deployment Status**: **PENDING AUTHORIZATION** (Approved deployment payload is locked to `LAUNCH_PAYLOAD_COMMIT`).

---

## 1. Page Listing & Slugs

| Page Title | Local ID | Production Slug | Relative Path | Expected Order |
| :--- | :--- | :--- | :--- | :--- |
| **Home** | 5 | (Root) | `/` | 1 |
| **Tech** | 10 | `tech` | `/tech/` | 2 |
| **Orpheus Deck** | 12 | `orpheus-deck` | `/orpheus-deck/` | 3 |

---

## 2. Expected Links

* **Home Page**:
  - Music Link: `/music/`
  - Tech Workshop Link: `/tech/`
  - Orpheus Deck Link: `/orpheus-deck/`
* **Tech Page**:
  - Orpheus Deck Link: `/orpheus-deck/`
* **Orpheus Deck Page**:
  - Google Play Outbound CTA: `https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US` (target `_blank`, `rel="noopener noreferrer"`)
  - App Privacy Link: `/orpheus-deck-privacy-policy/`
  - Tech Workshop Return Link: `/tech/`

---

## 3. Expected Media Assets

* **Tech Page**:
  - Feature Graphic: `/wp-content/uploads/2026/07/OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png` (Media ID 98, Alt: "Orpheus Deck Feature Graphic")
* **Orpheus Deck Page**:
  - App Icon: `/wp-content/uploads/2026/07/OrpheusDeck_logo_512_app_icon.png` (Media ID 104, Alt: "Orpheus Deck App Icon")
  - Screenshot 1: `/wp-content/uploads/2026/07/OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg` (Media ID 119, Alt: "Orpheus Deck Main Interface Screenshot")
  - Screenshot 2: `/wp-content/uploads/2026/07/OrpheusDeck_OpeningMenu-526x1024.jpg` (Media ID 113, Alt: "Orpheus Deck Opening Menu Screenshot")
  - Screenshot 3: `/wp-content/uploads/2026/07/OrpheusDeck_Click_Track_Menu-526x1024.jpg` (Media ID 117, Alt: "Orpheus Deck Click Track Menu Screenshot")

---

## 4. Content Verification Hashes

These SHA-256 hashes are computed from the exact HTML content blocks defined in the production-core records:

* **Home Page HTML**:
  - Hash: `fe8c94e51450e808e0ddb5a478bd042a430e6348b6708459665fc89abb36bda4`
  - Source File: [HOME_PAGE_PRODUCTION_CORE_V1.md](../content/HOME_PAGE_PRODUCTION_CORE_V1.md)
* **Tech Page HTML**:
  - Hash: `e40641df4461971dbd6408d7f83cab9a915bdd36be57ab090eeb9370e5b60537`
  - Source File: [TECH_PAGE_PRODUCTION_CORE_V1.md](../content/TECH_PAGE_PRODUCTION_CORE_V1.md)
* **Orpheus Deck Page HTML**:
  - Hash: `e47e3496236f57972932fb60ad17e4fbbf8bfacc2b58858d744b9824ceea8a75`
  - Source File: [ORPHEUS_PAGE_PRODUCTION_CORE_V1.md](../content/ORPHEUS_PAGE_PRODUCTION_CORE_V1.md)
