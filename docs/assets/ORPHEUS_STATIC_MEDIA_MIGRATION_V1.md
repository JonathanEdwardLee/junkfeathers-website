# Orpheus Static Media Migration V1

This document records the Task 013B static media migration results from the founder-controlled read-only image library (`C:\Users\joned\Documents\Junkfeathers DevAI Exchange\junkfeathers-website\00 ACTIVE\Images-From-Founder`) into `web/public/media/orpheus/`.

## Governance & Audit Decision Rules

- **One exact filename match:** Copy exact bytes into `web/public/media/orpheus/`, verify SHA-256 parity.
- **No exact filename match / Multiple exact matches:** Do not substitute or rename. Report `ASSET_SELECTION_NEEDED` and list candidate files separately.

## Migration Status Summary

| Filename | Exact Match | Source Relative Path | Source Size (Bytes) | Source SHA-256 | Repository SHA-256 | Parity Match | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `OrpheusDeck_logo_512_app_icon.png` | YES (1 match) | `OrpheusDeck_Brand_Assets/OrpheusDeck_logo_512_app_icon.png` | 135409 | `5bcad91f81a0f393232e8bfe9d095268ecda27532b6224af27c6211b89cd7dc1` | `5bcad91f81a0f393232e8bfe9d095268ecda27532b6224af27c6211b89cd7dc1` | YES | `MIGRATED` |
| `OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png` | NO (0 matches) | N/A | N/A | N/A | N/A | N/A | `ASSET_SELECTION_NEEDED` |
| `OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg` | NO (0 matches) | N/A | N/A | N/A | N/A | N/A | `ASSET_SELECTION_NEEDED` |
| `OrpheusDeck_OpeningMenu-526x1024.jpg` | NO (0 matches) | N/A | N/A | N/A | N/A | N/A | `ASSET_SELECTION_NEEDED` |
| `OrpheusDeck_Click_Track_Menu-526x1024.jpg` | NO (0 matches) | N/A | N/A | N/A | N/A | N/A | `ASSET_SELECTION_NEEDED` |

## Candidate Files for Blocked Media (`ASSET_SELECTION_NEEDED`)

These candidate files exist in the founder image library with similar names (omitting resolution suffixes or alternate branding assets), but require explicit approval by Jonathan, Website Council, and Pygmalion:

1. **For `OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png`**:
   - `OrpheusDeck_Brand_Assets/OrpheusDeck_brand_asset_sheet.png` (Size: 84310 bytes, SHA-256: `6370ad3fe64f9f7bf4ebce39e17b3aeac64b7bd06209a80e1ec839bfca0754ca`)
   - `OrpheusDeck_Brand_Assets/OrpheusDeck_logo_2048_square_black_bg.png` (Size: 631024 bytes, SHA-256: `a93be9f6cf3607a9eb6cfb1efadfdcc08ebc3eb39e7caeb8a7199c0eb1bdff93`)

2. **For `OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg`**:
   - `Orpheus Deck Screenshots/OrpheusDeck_Recorded_Audio_Main_Deck.jpg` (Size: 622416 bytes, SHA-256: `5fd473ed74681fbbad19b33a7e4118f97fa1a4e107df454508492efefb4ee68f`)

3. **For `OrpheusDeck_OpeningMenu-526x1024.jpg`**:
   - `Orpheus Deck Screenshots/OrpheusDeck_OpeningMenu.jpg` (Size: 457224 bytes, SHA-256: `ee6d6cf08dbfa0be1d48c8b417efd03cf1cbf679e0bf0a1eecdebc2dd1d739ea`)

4. **For `OrpheusDeck_Click_Track_Menu-526x1024.jpg`**:
   - `Orpheus Deck Screenshots/OrpheusDeck_Click_Track_Menu.jpg` (Size: 524021 bytes, SHA-256: `3b8d1d86d5f75ca0a1122a2bb7f5bbf1ebfa7cf89be1f6057be09c316ad7a6db`)

## Visual Status Boundary

All migrated and candidate assets reflect current public production app evidence. They do not constitute final Pygmalion machine-identity targets or approved redesign graphics.
