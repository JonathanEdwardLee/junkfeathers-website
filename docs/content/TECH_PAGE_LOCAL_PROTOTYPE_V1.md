# Junkfeathers Tech Page Local Prototype V1

* **Date Applied Locally**: July 14, 2026
* **WordPress Page Title**: Tech
* **Post ID**: 10
* **Site Relative URL**: `/tech/`
* **Deployment Status**: **Local-Only Development/QA** (No live production deployment or synchronization has occurred).

---

## 1. Visitor-Facing Copy & Structure

The Tech landing page utilizes the monochrome OLED design tokens defined in the child theme styles. Below is the exact HTML markup stored in the database:

```html
<div class="jf-machine-shell">
  <div class="jf-screen">
    <div style="text-align: center; padding: 15px 0;">
      <span class="jf-label" style="font-size: 0.8em; letter-spacing: 0.2em;">WORKSHOP INDEX // LOCAL BUILD</span>
      <h1 style="font-size: 2em; margin: 5px 0 0 0; letter-spacing: 0.1em;">JUNKFEATHERS TECH</h1>
      <hr class="jf-divider" />
      <p class="jf-meta" style="font-size: 0.95em; letter-spacing: 0.05em; margin: 10px 0 0 0;">Retro music tools and strange machines.</p>
    </div>
  </div>

  <div class="jf-panel">
    <span class="jf-label">FEATURED MACHINE</span>
    <h2 style="font-size: 1.6em; margin: 0 0 15px 0; letter-spacing: 0.05em;">ORPHEUS DECK</h2>

    <div style="margin-bottom: var(--jf-space-4); text-align: center;">
      <img src="/wp-content/uploads/2026/07/OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png" alt="Orpheus Deck Feature Graphic" style="max-width: 100%; height: auto; border: var(--jf-border-minor) solid var(--jf-gray-soft);" />
    </div>

    <p style="margin: 0 0 var(--jf-space-4) 0;">A retro Android 4-track recorder for songwriters.</p>

    <div class="jf-stack">
      <a href="/orpheus-deck/" class="jf-btn jf-btn--primary" style="display: block; font-size: 1.1em;">[ OPEN ORPHEUS DECK ]</a>
    </div>
  </div>

  <div class="jf-panel" style="border-style: dashed; padding: var(--jf-space-4); text-align: center; margin-bottom: 0;">
    <p class="jf-meta" style="color: var(--jf-gray-mid); margin: 0; letter-spacing: 0.1em;">MORE MACHINES IN DEVELOPMENT</p>
  </div>
</div>
```

---

## 2. Reused Media Library Assets

* **Feature Image Graphic**:
  - **Filename**: `OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png`
  - **Media Library ID**: 98
  - **Relative Path**: `/wp-content/uploads/2026/07/OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png`

---

## 3. Link Registry

* **Internal Target Link**: `/orpheus-deck/`
* **Google Play Outbound Link (on target page)**: `https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US`

---

## 4. Rollback Protocol

To restore the original Tech page content (which consisted only of the hyperlinked Orpheus Deck feature graphic), update the post content in WordPress using the editor or run a reviewed database update command using this snapshot of the prior HTML content:

```html
<!-- wp:image {"lightbox":{"enabled":false},"id":98,"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="/orpheus-deck/"><img src="/wp-content/uploads/2026/07/OrpheusDeck_GooglePlay_FeatureGraphic_1024x500.png" alt="" class="wp-image-98"/></a></figure>
<!-- /wp:image -->
```
