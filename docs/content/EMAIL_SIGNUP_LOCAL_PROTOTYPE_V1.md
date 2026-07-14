# Email Signup Local Prototype V1

* **Date Applied Locally**: July 14, 2026
* **Target Child-Theme Version**: `0.5.0`
* **Form Action Status**: **NONFUNCTIONAL PROTOTYPE** (No submissions, AJAX, database collection, or third-party connections occur. Email collection is completely off).
* **Privacy Policy Route**: **Omitted/Blocked**. No site-wide Junkfeathers privacy policy exists in the database. The app-specific `/orpheus-deck-privacy-policy/` governs app recordings only. Thus, the prototype displays the unlinked blocker note: *"Privacy policy required before activation."*

---

## 1. Exact Visitor-Facing Copy

* **Header Label**: `JUNKFEATHERS SIGNAL LIST`
* **Headline**: `GET OCCASIONAL TRANSMISSIONS`
* **Body Copy**: `Orpheus Deck updates, new music tools, Junk Notes, and future machine announcements.`
* **Field Label**: `EMAIL`
* **Placeholder**: `you@example.com`
* **Consent Text**: `I agree to receive occasional marketing emails from Junkfeathers Tech. I can unsubscribe at any time.`
* **Button Label**: `[ JOIN THE SIGNAL LIST ]`
* **Status Text**: `LOCAL PREVIEW // EMAIL COLLECTION OFF`
* **Disclaimer**: `Email only. No automatic enrollment. Privacy policy required before activation.`

---

## 2. Placements & Markup

### A. Homepage (Post ID 5)
Placed at the bottom of the machine panel shell, below the primary navigation controls:

```html
<!-- Form section added to homepage ID 5 -->
<div class="jf-panel jf-signup-panel" style="margin-top: var(--jf-space-5);">
  <span class="jf-status-strip">JUNKFEATHERS SIGNAL LIST</span>
  <h3 class="jf-machine-title" style="font-size: 1.3em; margin: var(--jf-space-2) 0;">GET OCCASIONAL TRANSMISSIONS</h3>
  <p class="jf-meta" style="margin-bottom: var(--jf-space-4);">Orpheus Deck updates, new music tools, Junk Notes, and future machine announcements.</p>

  <div class="jf-signup-form">
    <div class="jf-form-field">
      <label class="jf-field-label" for="jf-email">EMAIL</label>
      <input class="jf-email-input" type="email" id="jf-email" name="email" placeholder="you@example.com" disabled />
    </div>

    <div class="jf-consent-row">
      <input type="checkbox" id="jf-consent" name="consent" disabled />
      <label class="jf-consent-copy" for="jf-consent">I agree to receive occasional marketing emails from Junkfeathers Tech. I can unsubscribe at any time.</label>
    </div>

    <button class="jf-btn jf-btn--inactive" type="button" aria-disabled="true" style="width: 100%;">
      [ JOIN THE SIGNAL LIST ]
    </button>
  </div>

  <div class="jf-divider"></div>

  <div class="jf-text-center">
    <span class="jf-status-strip" style="color: var(--jf-gray-mid);">LOCAL PREVIEW // EMAIL COLLECTION OFF</span>
    <p class="jf-privacy-note" style="margin-top: var(--jf-space-2);">Email only. No automatic enrollment. Privacy policy required before activation.</p>
  </div>
</div>
```

### B. Orpheus Deck Page (Post ID 12)
Placed after the Local-First Privacy panel, before the return-to-Tech action:

```html
<!-- Form section added to Orpheus Deck ID 12 -->
<div class="jf-panel jf-signup-panel" style="margin-top: var(--jf-space-4);">
  <span class="jf-status-strip">JUNKFEATHERS SIGNAL LIST</span>
  <h3 class="jf-machine-title" style="font-size: 1.3em; margin: var(--jf-space-2) 0;">GET OCCASIONAL TRANSMISSIONS</h3>
  <p class="jf-meta" style="margin-bottom: var(--jf-space-4);">Orpheus Deck updates, new music tools, Junk Notes, and future machine announcements.</p>

  <div class="jf-signup-form">
    <div class="jf-form-field">
      <label class="jf-field-label" for="jf-email">EMAIL</label>
      <input class="jf-email-input" type="email" id="jf-email" name="email" placeholder="you@example.com" disabled />
    </div>

    <div class="jf-consent-row">
      <input type="checkbox" id="jf-consent" name="consent" disabled />
      <label class="jf-consent-copy" for="jf-consent">I agree to receive occasional marketing emails from Junkfeathers Tech. I can unsubscribe at any time.</label>
    </div>

    <button class="jf-btn jf-btn--inactive" type="button" aria-disabled="true" style="width: 100%;">
      [ JOIN THE SIGNAL LIST ]
    </button>
  </div>

  <div class="jf-divider"></div>

  <div class="jf-text-center">
    <span class="jf-status-strip" style="color: var(--jf-gray-mid);">LOCAL PREVIEW // EMAIL COLLECTION OFF</span>
    <p class="jf-privacy-note" style="margin-top: var(--jf-space-2);">Email only. No automatic enrollment. Privacy policy required before activation.</p>
  </div>
</div>
```

---

## 3. Form Safe-Guard Verification

* **Input Disabled**: Labeled `<input type="email">` has the `disabled` property.
* **Checkbox Disabled**: Consent `<input type="checkbox">` is forced to remain unchecked with `disabled` property.
* **Submit Blocked**: The action element is configured as `<button type="button">` (not `submit`) with `aria-disabled="true"`.
* **No Action Target**: Form contains no `action` or `method` attribute and is completely ignored by default browser submit routines.

---

## 4. Rollback Snapshots

To restore the prior content state (without signup forms):
1. **Homepage ID 5**: Re-apply the V1 homepage HTML markup captured in the repository.
2. **Orpheus Deck ID 12**: Re-apply the Orpheus Deck conversion page HTML markup without the `jf-signup-panel` block (prior metadata rows remain removed).
