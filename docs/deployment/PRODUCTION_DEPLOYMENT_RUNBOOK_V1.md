# Production Deployment Runbook V1

This runbook describes the manual step-by-step procedure to deploy the Junkfeathers child theme and verified page content to the live Hostinger production site. It is structured for Jonathan Lee to execute slowly, one screen and one action at a time.

* **Status**: **PENDING AUTHORIZATION** (Do not execute until explicit approval is given).
* **Child-Theme Version**: `0.5.0`
* **Mailing List Status**: **Omitted**. The free Reach email list plan remains unclaimed and inactive, and signup forms are excluded from this pass.

---

## Phase 0 — Authorization Pre-Checks

1. **Stop & Wait**: Do not proceed unless Jonathan Lee has explicitly authorized live production updates.
2. **Repository Alignment**: Verify that the local Git repository is clean on the ending commit of Task 11 (`cf5c23a` or later) and contains no uncommitted files:
   ```powershell
   git status --short
   ```
3. **Plugin Safe-State**: Confirm that Hostinger Reach (slug `hostinger-reach.disabled` or similar) remains inactive and unclaimed.

---

## Phase 1 — Live Baseline Capture

Before altering any files or settings:
1. **Front-End Check**: Open your web browser and load the live URLs. Confirm they load without layout errors:
   - Home: `https://junkfeathers.com/`
   - Music: `https://junkfeathers.com/music/`
   - Tech: `https://junkfeathers.com/tech/`
   - Orpheus: `https://junkfeathers.com/orpheus-deck/`
   - App Privacy: `https://junkfeathers.com/orpheus-deck-privacy-policy/`
   - Chronos: `https://junkfeathers.com/chronos/`
2. **Capture Visual State**: Take full-page screenshots of all six routes.
3. **WordPress Admin Access Check**: Log in to the live WordPress dashboard. Confirm access works and record:
   - The current active theme name and version (GeneratePress and child theme version).
   - The active plugin states (verify LiteSpeed Cache, GenerateBlocks, Jetpack, etc. are active).
4. **Capture Existing Content**: For the Home page, Tech page, and Orpheus Deck page:
   - Open the WordPress Page Editor.
   - Switch to the Code Editor view.
   - Copy the raw HTML blocks and paste them into a local text file named `live_preflight_backup.html` for emergency rollback reference.
   - Record their current revision count and database page IDs.

---

## Phase 2 — Fresh Rollback Point Creation

Do not proceed to file copies unless both file and database backups are downloaded and verified.
1. **Hostinger Panel Files Backup**:
   - Log in to your Hostinger Control Panel (hPanel).
   - Navigate to **Files** → **Backups**.
   - Generate a fresh **Files Backup** for the domain `junkfeathers.com`.
   - Download the generated zip file.
2. **Hostinger Database Backup**:
   - In hPanel under **Backups**, generate a fresh **Database Backup**.
   - Download the generated database sql file.
3. **Verify Downloads**: Confirm both downloaded files exist locally and are nonzero. Record their timestamps and file sizes.
4. **Manual Theme Directory Copy**:
   - Open the Hostinger File Manager or log in via SFTP.
   - Locate the theme folder: `wp-content/themes/junkfeathers-machine/`.
   - Copy the entire directory contents to a timestamped backup folder locally (e.g., `theme_preflight_backup_20260715`).

---

## Phase 3 — Theme Files Deployment

Only copy the three tracked child-theme files. Do not copy repository documentation, Git files, or configuration backups.
1. **Prepare Theme Files**: Collect these three files from your Git repository:
   - `themes/junkfeathers-machine/style.css`
   - `themes/junkfeathers-machine/functions.php`
   - `themes/junkfeathers-machine/README.md`
2. **Upload & Overwrite**:
   - Using Hostinger File Manager or SFTP, upload these three files into `wp-content/themes/junkfeathers-machine/`, overwriting the existing ones.
   - Confirm file permissions match the parent folder (typically `0644` for files).
3. **Immediate Front-End Check**:
   - Load `https://junkfeathers.com/` in a browser.
   - **Emergency Rollback Trigger**: If a PHP fatal error, blank page ("white screen of death"), lost navigation header, or stylesheet layout breakage occurs, immediately restore the files copied in Phase 2.

---

## Phase 4 — Database Page Migration

Migrate content manually through the WordPress editor one page at a time. Do not import SQL tables or use automated migration plugins.

### Step 1: Homepage Migration
1. Log in to the live WordPress Admin and open **Pages** → **Home**.
2. Switch the page editor to **Code Editor** view.
3. Open [HOME_PAGE_PRODUCTION_CORE_V1.md](../content/HOME_PAGE_PRODUCTION_CORE_V1.md) and copy the exact HTML markup inside the ` ```html ` block.
4. Paste the copied code into the WordPress Code Editor window, replacing all existing content.
5. Click **Preview** and confirm that the navigation buttons display cleanly and the Signal List signup prototype is absent.
6. Click **Update** to publish. Verify the live page at `https://junkfeathers.com/` on both desktop and mobile.

### Step 2: Tech Page Migration
1. Navigate to **Pages** → **Tech**.
2. Switch the page editor to **Code Editor** view.
3. Open [TECH_PAGE_PRODUCTION_CORE_V1.md](../content/TECH_PAGE_PRODUCTION_CORE_V1.md) and copy the exact HTML markup inside the ` ```html ` block.
4. Paste the copied code into the WordPress Code Editor window, replacing all existing content.
5. Click **Preview** and confirm that the Orpheus featured card and the secondary machines panel look correct.
6. Click **Update** to publish. Verify the live page at `https://junkfeathers.com/tech/`.

### Step 3: Orpheus Deck Page Migration
1. Navigate to **Pages** → **Orpheus Deck**.
2. Switch the page editor to **Code Editor** view.
3. Open [ORPHEUS_PAGE_PRODUCTION_CORE_V1.md](../content/ORPHEUS_PAGE_PRODUCTION_CORE_V1.md) and copy the exact HTML markup inside the ` ```html ` block.
4. Paste the copied code into the WordPress Code Editor window, replacing all existing content.
5. Click **Preview** and confirm that the release status header, Google Play CTA, screenshots, and privacy policy links display correctly, and that the Signal List signup prototype is absent.
6. Click **Update** to publish. Verify the live page at `https://junkfeathers.com/orpheus-deck/`.

*Note: Do not edit Music, Chronos, or the App Privacy Policy content.*

---

## Phase 5 — Cache Clearing & Verification

1. **Clear Caches**:
   - If LiteSpeed Cache or Hostinger Page Caching is active, navigate to LSCache in the WordPress admin bar and select **Purge All**.
   - Do not alter any optimization or minification settings.
2. **Multi-Browser Verification**:
   - Open a logged-out, private/incognito browser window.
   - Navigate through `/`, `/music/`, `/tech/`, and `/orpheus-deck/`.
   - Verify layout alignment, monospace typography, solid black background, and link color.
   - Verify that the Google Play CTA button targets the correct outbound store listing in a new tab.
   - Verify that all return navigation path links function.
   - Verify that **no** `junkfeatherscom.local` URLs or local credentials remain.
   - Verify that **no** Signal List local-preview panels are visible.
3. **Mobile & Keyboard Verification**:
   - Test layout scaling down to 320px width.
   - Navigate all pages using the `Tab` key. Verify that keyboard focus outlines are clearly visible.

---

## Phase 6 — Closeout & Log

1. **Record Timestamps**: Log the actual completion time of the deployment.
2. **Capture Launch Screenshots**: Save full-page screenshots of the live pages to record the successful launch.
3. **Log Page IDs**: Record the production page IDs and final revisions.
4. **Update Current State**: Open `docs/CURRENT_STATE.md` locally and update the status of the live deployment.
5. **CEO Update**: Provide a concise summary to Jonathan Lee on completion.
