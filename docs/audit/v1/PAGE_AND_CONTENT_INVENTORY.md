# Page & Content Inventory

This document maps the layout and contents of all pages, menus, custom post types, and media assets currently present on the junkfeathers.com local environment.

---

## 1. Page Inventory

The local database contains **6 published pages** and **1 trashed page**:

| Page Title | Database ID | Slug | Status | Character Length | Core Content / Block Layout |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Home** | `5` | `home` | Published | ~5,300 | Columns, GenerateBlocks Container wrapping two major navigation buttons: **Music** and **Tech**. |
| **Music** | `8` | `music` | Published | ~6,600 | Gallery of embeds: 1 logo image, 3 YouTube video/playlist embeds, 3 Bandcamp embedded players, and 1 Spotify artist profile embed. |
| **Tech** | `10` | `tech` | Published | ~350 | Standard Gutenberg image block linking to the `/orpheus-deck/` subpage. |
| **Orpheus Deck** | `12` | `orpheus-deck` | Published | ~3,400 | Two-column GenerateBlocks layout featuring app icon, description, platform metadata, play store link, and a gallery of 3 Android screenshots. |
| **Orpheus Deck Privacy Policy** | `107` | `orpheus-deck-privacy-policy` | Published | ~9,100 | Legal document details for Google Play Store compliance. Standard text block layout. |
| **Chronos** | `14` | `chronos` | Published | 0 | **Empty**. Placeholder page with no content. |
| *Privacy Policy* | `3` | `privacy-policy__trashed` | Trashed | ~5,500 | Default WordPress draft/trashed template. |

---

## 2. Navigation & Menus

The website has one primary navigation menu:
* **Menu Name**: "Home Menu" (Slug: `home-menu`, Taxonomy ID: `3`)
* **Total Menu Items**: 5 defined in the database, but **only 2 are published (active)**.

### Active Menu Items (Published)
1. **Music** (Post ID `18`): Links to Page ID `8` (`/music/`).
2. **Tech** (Post ID `20`): Links to Page ID `10` (`/tech/`).

### Inactive Menu Items (Drafts)
1. **Home** (Post ID `16`): Links to Page ID `5` (`/`).
2. **Orpheus Deck** (Post ID `19`): Links to Page ID `12` (`/orpheus-deck/`).
3. **Chronos** (Post ID `17`): Links to Page ID `14` (`/chronos/`).

---

## 3. Custom Post Types & Gutenberg Assets

A check of the database shows the presence of these custom configurations:
* **Custom Block Pattern (`wp_block`)**:
  - **ID 66: "Junk Button"**: A reusable GenerateBlocks button pattern used to render the Music and Tech portal links on the front page.
* **Global Styles (`wp_global_styles`)**:
  - **ID 6**: Style sheet settings for the active `generatepress` template.
  - **ID 62**: Inactive styles left behind by the disabled `hostinger-ai-theme`.
* **Custom CSS (`custom_css`)**:
  - **ID 23**: A customizer stylesheet post for theme `generatepress`, currently **empty** (0 bytes).

---

## 4. Media Library Inventory

There are **18 media assets** in the uploads directory (`/wp-content/uploads/2026/07/`):

| Media Title | ID | Mime Type | File Name | Primary Page Placement |
| :--- | :--- | :--- | :--- | :--- |
| **SignatureLogo** | `90` | `image/png` | `SignatureLogo-1.png` | Music page (header signature) |
| **OrpheusDeck_logo_512_app_icon** | `104` | `image/png` | `OrpheusDeck_logo_512_app_icon.png` | Orpheus Deck landing page |
| **OrpheusDeck_GooglePlay_FeatureGraphic_1024x500** | `98` | `image/png` | `OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png` | Tech page (landing link banner) |
| **OrpheusDeck_Recorded_Audio_Main_Deck** | `119` | `image/jpeg` | `OrpheusDeck_Recorded_Audio_Main_Deck.jpg` | Orpheus Deck screenshot gallery |
| **OrpheusDeck_OpeningMenu** | `113` | `image/jpeg` | `OrpheusDeck_OpeningMenu.jpg` | Orpheus Deck screenshot gallery |
| **OrpheusDeck_Click_Track_Menu** | `117` | `image/jpeg` | `OrpheusDeck_Click_Track_Menu.jpg` | Orpheus Deck screenshot gallery |
| **OrpheusDeck_Track_Options_Menu** | `114` | `image/jpeg` | `OrpheusDeck_Track_Options_Menu.jpg` | Unassigned (Media Library) |
| **OrpheusDeck_FX_Menu_Preview** | `115` | `image/jpeg` | `OrpheusDeck_FX_Menu_Preview.jpg` | Unassigned (Media Library) |
| **OrpheusDeck_Main_Four_Track_Deck** | `116` | `image/jpeg` | `OrpheusDeck_Main_Four_Track_Deck.jpg` | Unassigned (Media Library) |
| **OrpheusDeck_Export_Project_Menu** | `118` | `image/jpeg` | `OrpheusDeck_Export_Project_Menu.jpg` | Unassigned (Media Library) |
| **OrpheusDeck_Pro_User_Dialog** | `120` | `image/jpeg` | `OrpheusDeck_Pro_User_Dialog.jpg` | Unassigned (Media Library) |
| **OrpheusDeck_Project_MGMT_Options** | `121` | `image/jpeg` | `OrpheusDeck_Project_MGMT_Options.jpg` | Unassigned (Media Library) |
| **OrpheusDeck_Settings_Menu** | `122` | `image/jpeg` | `OrpheusDeck_Settings_Menu.jpg` | Unassigned (Media Library) |
| **SignatureLogo** | `39` | `image/png` | `SignatureLogo.png` | Duplicate upload |
| **logoawkwardbirdwhite** | `40` | `image/png` | `logoawkwardbirdwhite.png` | Unassigned brand assets |
| **logoDeadBird** | `41` | `image/png` | `logoDeadBird.png` | Unassigned brand assets |
| **smallbrand** | `44` | `image/png` | `smallbrand.png` | Brand asset |
| **cropped-smallbrand** | `45` | `image/png` | `cropped-smallbrand.png` | Brand asset (likely header icon) |
