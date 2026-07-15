# Production Acceptance Checklist V1

This checklist defines the validation criteria that must be satisfied on the live Hostinger production website following deployment.

* **Status**: **Locked Reference Checklist**
* **Application**: Live production environment

---

## 1. Safety Checks
- [ ] **Fresh Database Backup**: A fresh SQL database backup is downloaded and stored outside the site.
- [ ] **Fresh Files Backup**: A fresh files backup ZIP is downloaded and stored outside the site.
- [ ] **Child-Theme Directory Backup**: A copy of the old theme directory is saved locally.
- [ ] **Exact Approved Commit**: Tracked child-theme files match commit `cf5c23a` or later.
- [ ] **No Secret Files**: Verification script confirms no PEM keys, API credentials, or local configs are present in the repository.
- [ ] **No Plugin Changes**: No active plugins have been activated, deactivated, or deleted.
- [ ] **No Reach Activation**: The free Hostinger Reach email list plan remains unclaimed and inactive.
- [ ] **No Local URLs**: Search of the live HTML confirms that the local testing domain `junkfeatherscom.local` is absent.

---

## 2. Page Integrity Checks
Confirm that all six core pages load successfully:
- [ ] **Home Page**: `/` resolves cleanly without layout shifts.
- [ ] **Music Page**: `/music/` loads successfully and displays embeds.
- [ ] **Tech Page**: `/tech/` loads successfully and displays featured card.
- [ ] **Orpheus Deck Page**: `/orpheus-deck/` loads successfully and displaysscreenshots and description.
- [ ] **App Privacy Policy Page**: `/orpheus-deck-privacy-policy/` loads successfully.
- [ ] **Chronos Page**: `/chronos/` draft placeholder loads successfully.

---

## 3. Conversion & Navigation Links
Verify all link targets:
- [ ] **Homepage Music Button**: Leads to `/music/`.
- [ ] **Homepage Tech Button**: Leads to `/tech/`.
- [ ] **Homepage Orpheus Button**: Leads to `/orpheus-deck/`.
- [ ] **Tech Page CTA Button**: Leads to `/orpheus-deck/`.
- [ ] **Orpheus Page Google Play Button**: Links to the outbound Google Play store listing in a new browser tab.
- [ ] **Orpheus Page App Privacy Link**: Links to `/orpheus-deck-privacy-policy/`.
- [ ] **Orpheus Page Return Link**: Links to `/tech/`.

---

## 4. Visual & Accessibility Standards
- [ ] **OLED Monochrome Design**: Global black background, white text, gray details, and generic `monospace` typography are enforced.
- [ ] **Restrained Green**: Link green `#7cff7c` is limited to links and genuine errors.
- [ ] **Focus Outlines**: Active keyboard focus displays clear, visible square outlines.
- [ ] **Mobile Responsive**: Scaling down to 320px width shows no horizontal scroll or layout overflow.
- [ ] **No Global Scanlines**: Body scanlines are absent; scanline effects are confined strictly to display screen boxes.
- [ ] **Reduced-Motion Support**: Stylesheet handles `prefers-reduced-motion` cleanly.

---

## 5. Signup Boundary Check
- [ ] **No Signup Panels**: No email signup form, Signal List header, or disclaimer block appears on the live homepage or Orpheus Deck page.
- [ ] **No Form Fields**: No active email inputs or consent checkboxes are present in the DOM.
- [ ] **No Reach Collection**: No customer data is collected, stored, or sent.

---

## 6. Production Isolation
- [ ] **Music Content**: Music page embeds and copy remain identical to pre-deployment.
- [ ] **Chronos Draft**: Chronos draft remains empty and unchanged.
- [ ] **App Privacy Text**: App privacy policy text remains unchanged.
- [ ] **Plugin Configuration**: Caching, SEO sitemaps, analytics, and Jetpack dashboard connection remain unchanged.
- [ ] **WordPress Users**: Admin accounts, credentials, and passwords remain unchanged.
