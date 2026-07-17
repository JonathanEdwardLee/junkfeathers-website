# Pull Request: [Task Title]

## 1. Metadata
* **Task Number & Branch**: `task/NNN-short-description`
* **Scope**: [Describe the task boundary and target files]

---

## 2. Proposed Changes
* [List added/changed/removed files and describe their purpose]

---

## 3. UI & Visual Verification
* **Screenshots / Recordings**: [Provide screenshots or links to media assets representing visual changes]
* **Monochrome OLED Alignment**: [Confirm it adheres to monochrome styling guidelines]

---

## 4. Local Verification & Testing Steps
* **Local Build Tests**:
  - [ ] Checked `npm run check` in the `web` folder.
  - [ ] Checked `npm run build` in the `web` folder.
  - [ ] Checked local preview URL: `http://localhost:4321/`
* **Accessibility Notes**: [Describe keyboard tab order, focus visible styles, and screen reader/contrast accommodations]
* **Performance Notes**: [Describe page build speed, asset sizes, and optimization profiles]

---

## 5. Security & Verification Check
- [ ] Checked `.\scripts\verify-repository.ps1` output.
- [ ] Confirmed no secrets, `.env` files, credentials, or subscriber list sheets are staged or committed.

---

## 6. Rollback Protocol
* [List steps required to revert these changes on local development or preview systems]

---

## 7. Live Hostinger Boundary Confirmation
- [ ] **CONFIRMED**: No live systems, Hostinger accounts, or live WordPress files/databases were accessed or altered during this branch work.

---

## 8. Founder Decisions Needed
* [List any architectural or copy decisions that require Jonathan's explicit input]
