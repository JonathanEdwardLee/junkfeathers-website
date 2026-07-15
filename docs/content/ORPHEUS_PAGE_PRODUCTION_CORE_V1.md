# Orpheus Deck Page Production Core V1

* **Date Prepared**: July 15, 2026
* **Source Local Page ID**: 12
* **Production Relative URL**: `/orpheus-deck/`
* **Child-Theme Dependency**: `0.5.0`
* **Form Action Boundary**: **Omitted**. The entire `jf-signup-panel` block is removed.

---

## 1. Production HTML Markup

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
      <span class="jf-label">Platform:</span><span>Android</span>
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

## 4. Verification & Rollback Notes

* **Verification**: Confirm that the Orpheus page displays the release status header, Google Play CTA button, screenshots, local-first recording privacy panel, and return CTA back to `/tech/`. No email signup panel should be visible.
* **Rollback**: To revert to the previous live Orpheus Deck page, restore the pre-deployment backup content captured in Phase 1 of the deployment runbook.
* **Content Edits Policy**: Minor editorial changes may be made directly via the production WordPress editor after launch, and should be recorded in future versions of this document.
