# Rollback Protocol

This document defines the rollback and recovery steps for this development phase.

---

## 1. Local Code Rollback (Repository)

Because we are working in a standalone repository outside the Local server workspace, rollback is simple and has zero risk of site damage:

1. **Abandon Repository**: 
   Delete the local `C:\Users\joned\Documents\Git\junkfeathers-website` directory or move it to an archive folder.
2. **Revert Git Commits**:
   If a commit in the repository needs to be reverted:
   ```bash
   git reset --hard HEAD~1
   ```

---

## 2. Local Site Rollback (Local Server)

If an applied sync script (`scripts/sync-to-local.ps1 -Apply`) was executed and caused styling or layout errors on the Local runtime site:

1. **Locate Backup**:
   The sync script automatically saves a timestamped copy of the Local child theme to a backup folder outside the repository.
2. **Restore Files**:
   Copy the files from the backup folder back into the Local server's theme directory:
   `C:\Users\joned\Local Sites\junkfeatherscom\app\public\wp-content\themes\junkfeathers-machine`
3. **Reactivate Parent**:
   If the child theme causes a fatal PHP error, reactivate the parent dependency via WP-CLI or the WordPress admin panel:
   ```bash
   wp theme activate generatepress
   ```

---

## 3. Live Site Rollback

The live site (`junkfeathers.com` on Hostinger) requires no rollback protocol because **no live changes or connections are authorized in this phase**. The live production environment remains completely untouched.
