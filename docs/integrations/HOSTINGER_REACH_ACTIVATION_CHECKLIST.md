# Hostinger Reach Activation Checklist

* **Date Prepared**: July 14, 2026
* **Status**: **Locked Gates Checklist**
* **Provider**: Hostinger Reach Pilot (Inactive)

This checklist outlines the mandatory technical gates that must be completed and approved before activating the email-signup form and collecting subscriber data on `junkfeathers.com`.

---

## Technical & Legal Activation Gates

- [ ] **Gate 1: Approved Local Design**
  - Nonfunctional monochrome signup prototype approved on Local homepage and Orpheus Deck page.
- [ ] **Gate 2: Approved Deployment/Rollback Method**
  - Git-reviewed deployment scripts and rollback plans are written and tested.
- [ ] **Gate 3: Live Deployment Completed**
  - Theme version `0.5.0` (with signup components) successfully synced and verified on the live Hostinger site.
- [ ] **Gate 4: HTTPS and Forms Verified**
  - SSL certificate active on live production site, and site-wide HTTPS routing is confirmed.
- [ ] **Gate 5: Site-Wide Privacy Policy Published**
  - A dedicated privacy policy page (e.g. `/privacy-policy/`) detailing email collection, data minimization, and Hostinger Reach processing is published on the live site.
- [ ] **Gate 6: Reach Plan Activation Timing Approved**
  - Confirm the exact day to activate the Reach one-year plan, ensuring no pre-activation days are lost.
- [ ] **Gate 7: Sending Domain Verified**
  - Domain Name System (DNS) configurations (DKIM, SPF, DMARC records) verified for the mailing domain to prevent spam filters.
- [ ] **Gate 8: Sender Mailbox Verified**
  - Sender email address (e.g., `list@junkfeathers.com`) is created, active, and verified within the Reach dashboard.
- [ ] **Gate 9: Exact Form/Contact-Field Mapping Verified**
  - Confirm that the signup form input field targets the correct Reach subscriber list database.
- [ ] **Gate 10: Consent Evidence Behavior Verified**
  - Verify that the Reach database correctly logs consent checkbox status and timestamps for each registration.
- [ ] **Gate 11: Unsubscribe and Suppression Behavior Tested**
  - Confirm that the footer unsubscribe links automatically add opt-outs to the suppression list.
- [ ] **Gate 12: Controlled Founder Signup Test Completed**
  - Jonathan Lee executes one test registration on the live site using a test address.
- [ ] **Gate 13: Test Campaign Received Correctly**
  - A test transmission email is successfully sent to and received by the founder.
- [ ] **Gate 14: Contact Export Procedure Tested**
  - Confirm the administrator can export subscriber data as a CSV for backups.
- [ ] **Gate 15: No Subscriber Export Stored in Git**
  - Confirm that `.gitignore` explicitly blocks any exported subscriber lists (`*.csv`) from entering version control.
- [ ] **Gate 16: No Public Collection Until All Gates Pass**
  - The signup form remains deactivated and unlinked to the Reach endpoint until all 15 preceding gates are checked and signed off.
