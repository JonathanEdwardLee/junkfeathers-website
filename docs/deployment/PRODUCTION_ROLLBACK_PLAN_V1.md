# Production Rollback Plan V1

This document outlines the three levels of rollback procedures and the mandatory trigger conditions for reverting child-theme code or page content on the live Hostinger production website.

* **Status**: **Locked Reference Plan**
* **Application**: Live production environment

---

## 1. Rollback Levels

### Level 1 — Single-Page Rollback
Use this when only one database-managed page (Home, Tech, or Orpheus Deck) has broken layout, broken links, or syntax issues, but the rest of the site and the WordPress Admin dashboard remain fully functional.

#### Procedure
1. Log in to the live WordPress Admin panel.
2. Open the page editor for the broken page (e.g. **Pages** → **Orpheus Deck**).
3. In the sidebar under **Revisions**, select the revision immediately preceding your deployment edit.
4. Compare content and click **Restore This Revision**.
5. Alternatively, if revisions are disabled or corrupt, switch to the **Code Editor** view and paste the raw content block captured in the `live_preflight_backup.html` file in Phase 1 of the runbook, then update.

---

### Level 2 — Theme Rollback
Use this when style configurations, enqueues, or theme hooks introduce fatal PHP errors, lost navigation hooks, blank pages ("white screen of death"), or global visual breakage.

#### Procedure
1. Open your SFTP client or the Hostinger File Manager.
2. Locate the active theme folder: `wp-content/themes/junkfeathers-machine/`.
3. Overwrite all files inside that directory with the preflight backup files saved in Phase 2 of the runbook (`theme_preflight_backup_20260715`).
4. Re-verify the live homepage.

---

### Level 3 — Full Production Restore
Use this only as a last resort when the database becomes corrupted, the WordPress Admin panel is completely inaccessible, or Level 1 and Level 2 rollbacks fail to restore site functionality.

#### Procedure
1. Log in to the Hostinger Control Panel (hPanel).
2. Navigate to **Files** → **Backups**.
3. Select **Restore File Backup** and select the ZIP file generated in Phase 2 of the runbook. Click **Restore**.
4. Select **Restore Database Backup** and select the SQL backup file generated in Phase 2 of the runbook. Click **Restore**.
5. Allow the restoration task to complete, and clear all local browser caches.

---

## 2. Mandatory Rollback Triggers

If any of the following conditions occur and cannot be fixed within 10 minutes, a rollback must be executed immediately:

1. **Fatal Errors**: Any PHP compile error, warning banner, or database connection error is visible on the front end.
2. **Inaccessible Admin**: The WordPress dashboard (`/wp-admin/`) returns a 500, 404, or blank screen.
3. **Broken Homepage Navigation**: Homepage buttons (Music, Tech, Orpheus Deck) lead to dead pages or return 404.
4. **Missing Google Play Route**: The Google Play button on the Orpheus page fails to open the Play Store listing.
5. **Broken App Privacy Link**: The relative link to the privacy policy page returns a 404.
6. **Severe Mobile View Overflow**: Horizonal scrolling or broken columns appear on viewports down to 320px width.
7. **Incorrect Domain Names**: The local domain string `junkfeatherscom.local` is present in outbound links or media source tags.
8. **Lost Content**: Unrelated page content is modified or deleted.
9. **Unexpected Configuration Changes**: Plugin states, active users, analytics settings, or WordPress core settings are altered.
10. **Unplanned Data Collection**: Email inputs or consent checkboxes appear active on the production site, or subscriber data is sent to an unauthorized endpoint.
11. **Inability to Verify Rollback Point**: If a fresh backup ZIP or database sql backup is found to be missing or corrupted prior to editing, stop immediately; no deployment changes are permitted.

---

## 3. Deployment Safety Rules

* **No Destructive Git Resets**: Because production is a database-backed, Hostinger-managed runtime, executing Git reset or branch force-pushes is not a valid rollback mechanism for production database content. Follow only the manual procedures outlined in this document.
* **Preserve Option Values**: Do not import local SQL files to production, as this will overwrite production-specific options, URLs, paths, and users.
