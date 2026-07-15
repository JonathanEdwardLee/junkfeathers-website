# Homepage Production Core V1

* **Date Prepared**: July 15, 2026
* **Source Local Page ID**: 5
* **Production Relative URL**: `/`
* **Child-Theme Dependency**: `0.5.0`
* **Form Action Boundary**: **Omitted**. The entire `jf-signup-panel` block is removed.

---

## 1. Production HTML Markup

```html
<div class="jf-machine-shell">
  <div class="jf-screen">
    <div style="text-align: center; padding: 20px 0;">
      <h1 style="font-size: 2.2em; margin: 0; letter-spacing: 0.15em;">JUNKFEATHERS</h1>
      <hr class="jf-divider" />
      <p class="jf-meta" style="font-size: 1em; letter-spacing: 0.05em; margin: 10px 0 0 0;">Songs. Small tech. Junk Notes.</p>
    </div>
  </div>

  <div class="jf-panel" style="text-align: center; padding: var(--jf-space-5) var(--jf-space-4);">
    <div class="jf-stack">
      <a href="/music/" class="jf-btn jf-btn--primary" style="display: block; font-size: 1.2em;">[ MUSIC ]</a>
      <a href="/tech/" class="jf-btn jf-btn--primary" style="display: block; font-size: 1.2em;">[ TECH ]</a>
    </div>
  </div>

  <div style="text-align: center; margin-top: var(--jf-space-4);">
    <a href="/orpheus-deck/" class="jf-btn jf-btn--secondary" style="font-size: 0.85em;">[ ORPHEUS DECK ]</a>
  </div>
</div>
```

---

## 2. Link Registry

* **Music**: `/music/`
* **Tech**: `/tech/`
* **Orpheus Deck**: `/orpheus-deck/`

---

## 3. Verification & Rollback Notes

* **Verification**: Verify that the homepage resolves cleanly, all navigation buttons lead to active paths, and no signup widget is visible.
* **Rollback**: To revert to the previous live homepage, restore the pre-deployment backup content captured in Phase 1 of the deployment runbook.
* **Content Edits Policy**: Minor editorial changes may be made directly via the production WordPress editor after launch, and should be recorded in future versions of this document.
