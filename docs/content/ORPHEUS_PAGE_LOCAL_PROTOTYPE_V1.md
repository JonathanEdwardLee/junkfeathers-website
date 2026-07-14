# Orpheus Deck Page Local Prototype V1

* **Date Applied Locally**: July 14, 2026
* **WordPress Page Title**: Orpheus Deck
* **Post ID**: 12
* **Site Relative URL**: `/orpheus-deck/`
* **Deployment Status**: **Local-Only Development/QA** (No live production deployment or synchronization has occurred).

---

## 1. Visitor-Facing Copy & Structure

The Orpheus Deck landing page utilizes the monochrome OLED design tokens and new reusable helper classes. Below is the exact HTML markup stored in the database:

```html
<div class="jf-machine-shell">
  <div class="jf-screen">
    <div class="jf-machine-header">
      <span class="jf-status-strip">ANDROID // PUBLIC RELEASE</span>
      <h1 class="jf-machine-title">ORPHEUS DECK</h1>
      <hr class="jf-divider" />
      <p class="jf-machine-subtitle">A retro four-track Android recorder for musicians and songwriters.</p>
    </div>
  </div>

  <div class="jf-panel jf-text-center" style="padding: var(--jf-space-5) var(--jf-space-4);">
    <span class="jf-label">GOOGLE PLAY STORE</span>
    <a href="https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US" class="jf-btn jf-btn--primary" style="display: block; font-size: 1.15em;" target="_blank" rel="noopener noreferrer" title="Get Orpheus Deck on Google Play Store (Opens in a new tab)">
      [ GET ORPHEUS DECK ON GOOGLE PLAY ]
    </a>
  </div>

  <div class="jf-panel">
    <span class="jf-label">ABOUT THE MACHINE</span>
    <p>Catch song ideas before they disappear. Record up to four tracks in a focused machine-style workspace built for musicians and songwriters.</p>

    <div class="jf-divider"></div>

    <div class="jf-info-grid">
      <span class="jf-label">Type:</span><span>Android App</span>
      <span class="jf-label">Status:</span><span>Live on Google Play</span>
      <span class="jf-label">Release Date:</span><span>July 1, 2026</span>
      <span class="jf-label">Platform:</span><span>Android</span>
      <span class="jf-label">Engine:</span><span>Flutter / native audio plan</span>
    </div>
  </div>

  <div class="jf-panel">
    <span class="jf-label">SCREENSHOTS</span>
    <div style="text-align: center; margin-bottom: var(--jf-space-4);">
      <img src="/wp-content/uploads/2026/07/OrpheusDeck_logo_512_app_icon.png" alt="Orpheus Deck App Icon" class="jf-feature-media" style="max-width: 120px;" />
    </div>

    <!-- wp:group {"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"center"}} -->
    <div class="wp-block-group" style="display: flex; flex-wrap: wrap; justify-content: center; gap: var(--jf-space-3);">
      <img src="/wp-content/uploads/2026/07/OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg" alt="Orpheus Deck Main Interface Screenshot" class="jf-feature-media" style="max-width: 180px; height: auto;" />
      <img src="/wp-content/uploads/2026/07/OrpheusDeck_OpeningMenu-526x1024.jpg" alt="Orpheus Deck Opening Menu Screenshot" class="jf-feature-media" style="max-width: 180px; height: auto;" />
      <img src="/wp-content/uploads/2026/07/OrpheusDeck_Click_Track_Menu-526x1024.jpg" alt="Orpheus Deck Click Track Menu Screenshot" class="jf-feature-media" style="max-width: 180px; height: auto;" />
    </div>
    <!-- /wp:group -->
  </div>

  <div class="jf-panel">
    <span class="jf-label">PRIVACY POLICY</span>
    <h3 style="font-size: 1.2em; margin: 0 0 var(--jf-space-2) 0;">LOCAL-FIRST RECORDING</h3>
    <p>Your recordings and projects stay on your device. Orpheus Deck does not automatically upload them.</p>
    <p style="margin-top: var(--jf-space-3);">
      <a href="/orpheus-deck-privacy-policy/" class="jf-btn jf-btn--secondary" style="display: block;">[ VIEW PRIVACY POLICY ]</a>
    </p>
  </div>

  <div style="text-align: center; margin-top: var(--jf-space-4); display: flex; flex-direction: column; gap: var(--jf-space-2);">
    <a href="/tech/" class="jf-btn jf-btn--secondary" style="font-size: 0.9em;">&lt; RETURN TO TECH WORKSHOP</a>
  </div>
</div>
```

---

## 2. Reused Media Library Assets

* **App Logo Icon**:
  - **Filename**: `OrpheusDeck_logo_512_app_icon.png`
  - **Media Library ID**: 104
  - **Relative Path**: `/wp-content/uploads/2026/07/OrpheusDeck_logo_512_app_icon.png`
  - **Alt Text**: "Orpheus Deck App Icon"
* **Screenshot 1**:
  - **Filename**: `OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg`
  - **Media Library ID**: 119
  - **Relative Path**: `/wp-content/uploads/2026/07/OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg`
  - **Alt Text**: "Orpheus Deck Main Interface Screenshot"
* **Screenshot 2**:
  - **Filename**: `OrpheusDeck_OpeningMenu-526x1024.jpg`
  - **Media Library ID**: 113
  - **Relative Path**: `/wp-content/uploads/2026/07/OrpheusDeck_OpeningMenu-526x1024.jpg`
  - **Alt Text**: "Orpheus Deck Opening Menu Screenshot"
* **Screenshot 3**:
  - **Filename**: `OrpheusDeck_Click_Track_Menu-526x1024.jpg`
  - **Media Library ID**: 117
  - **Relative Path**: `/wp-content/uploads/2026/07/OrpheusDeck_Click_Track_Menu-526x1024.jpg`
  - **Alt Text**: "Orpheus Deck Click Track Menu Screenshot"

---

## 3. Link Registry

* **Google Play Outbound Listing**: `https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US`
* **Internal Privacy Link**: `/orpheus-deck-privacy-policy/`
* **Internal Return Link**: `/tech/`

---

## 4. Omit Reason: O-FX / LIMIT Panel

No public, visitor-facing copy or feature descriptions for O-FX or LIMIT existed on the homepage, tech page, or the previous Orpheus page in the Local site. To maintain truthfulness and prevent publishing unverified product claims, the O-FX/LIMIT section was completely omitted.

---

## 5. Unreleased Work Boundary (V34 / CUT)

Internal features (such as V34 navigation, CUT, APPLY CUT, scissor tools, zoom/scroll layouts, and track state checks) are unreleased and are explicitly **not** represented in the public copy of this conversion page.

---

## 6. Rollback Protocol

To restore the prior content state (consisting of the GenerateBlocks column layout, app icon, download links, and screenshot gallery), update the post content in WordPress using the editor or run a reviewed local database restore script using this snapshot of the prior HTML:

```html
<!-- wp:generateblocks/element {"uniqueId":"6a0c3adf","tagName":"div","styles":{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","columnGap":"1em","rowGap":"1em","@media (max-width:767px)":{"gridTemplateColumns":"1fr"}},"css":".gb-element-6a0c3adf{column-gap:1em;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));row-gap:1em}@media (max-width:767px){.gb-element-6a0c3adf{grid-template-columns:1fr}}"} -->
<div class="gb-element-6a0c3adf"><!-- wp:generateblocks/element {"uniqueId":"571beb94","tagName":"div"} -->
<div><!-- wp:html -->
<div>
  <h1>Orpheus Deck</h1>
  <p>A retro Android 4-track recorder for songwriters.</p>

  <div>
    <p><strong>Type:</strong> Android app</p>
    <p><strong>Status:</strong> Live on Google Play</p>
    <p><strong>Release Date:</strong> July 1, 2026</p>
    <p><strong>Platform:</strong> Android</p>
    <p><strong>Engine:</strong> Flutter / native audio plan</p>
    <p><strong>Privacy Policy:</strong> <a href="/orpheus-deck-privacy-policy/">View privacy policy</a></p>
  </div>

  <p>
    <a href="https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US" target="_blank" rel="noopener noreferrer">
      Download Orpheus Deck
    </a>
  </p>

  <p style="margin-top: 20px;">
    <a href="/tech/">&lt; Return to Tech Workshop</a>
  </p>
</div>
</div>
<!-- /wp:html --></div>
<!-- /wp:generateblocks/element -->

<!-- wp:generateblocks/element {"uniqueId":"d5081c6a","tagName":"div"} -->
<div><!-- wp:generateblocks/media {"uniqueId":"b2d27c8d","tagName":"img","styles":{"height":"auto","maxWidth":"100%","objectFit":"cover","width":"auto"},"css":".gb-media-b2d27c8d{height:auto;max-width:100%;object-fit:cover;width:auto}","htmlAttributes":{"alt":"","title":"OrpheusDeck_logo_512_app_icon","src":"/wp-content/uploads/2026/07/OrpheusDeck_logo_512_app_icon.png"},"mediaId":104} -->
<img class="gb-media-b2d27c8d" alt="" title="OrpheusDeck_logo_512_app_icon" src="/wp-content/uploads/2026/07/OrpheusDeck_logo_512_app_icon.png"/>
<!-- /wp:generateblocks/media --></div>
<!-- /wp:generateblocks/element --></div>
<!-- /wp:generateblocks/element -->

<!-- wp:spacer -->
<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:gallery {"linkTo":"none"} -->
<figure class="wp-block-gallery has-nested-images columns-default is-cropped"><!-- wp:image {"id":119,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="/wp-content/uploads/2026/07/OrpheusDeck_Recorded_Audio_Main_Deck-526x1024.jpg" alt="" class="wp-image-119"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":113,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="/wp-content/uploads/2026/07/OrpheusDeck_OpeningMenu-526x1024.jpg" alt="" class="wp-image-113"/></figure>
<!-- /wp:image -->

<!-- wp:image {"id":117,"sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image size-large"><img src="/wp-content/uploads/2026/07/OrpheusDeck_Click_Track_Menu-526x1024.jpg" alt="" class="wp-image-117"/></figure>
<!-- /wp:image --></figure>
<!-- /wp:gallery --></div>
<!-- /wp:group -->
```
