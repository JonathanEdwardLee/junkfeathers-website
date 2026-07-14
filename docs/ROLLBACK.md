# Rollback Protocol

This document defines the rollback and recovery steps for this development phase.

---

## 1. Local Code Rollback (Repository)

To roll back code changes in the standalone repository, prefer safe, non-destructive Git operations over commands that erase uncommitted work:

### Recommended Git Rollback Methods
1. **Inspect Commit History**:
   Find the hash of the commit you want to revert:
   ```bash
   git log --oneline
   ```
2. **Revert a Specific Commit**:
   To create a new corrective commit that reverses the changes of an existing commit (safest for history):
   ```bash
   git revert <commit-hash>
   ```
3. **Restore an Individual File**:
   To restore a single file to its state at a specific commit:
   ```bash
   git checkout <commit-hash> -- path/to/file
   ```

> [!WARNING]
> Avoid running `git reset --hard HEAD~1` as a default rollback command. Destructive reset commands will permanently erase all uncommitted local modifications and unstaged work in your workspace.

---

## 2. Local Site Rollback (Local Server)

If an applied sync script (`scripts/sync-to-local.ps1 -Apply`) was executed and caused styling errors on the Local development/QA site:

1. **Locate Backup**:
   The sync script saves a timestamped copy of the Local child theme to the configured `$LocalBackupRootPath` directory (which resides outside the repository and Local site folders).
2. **Restore Child Theme**:
   Copy the files from the backup directory back into the Local site's theme directory:
   `<LocalSiteRootPath>\app\public\wp-content\themes\junkfeathers-machine`
3. **Reactivate Parent Dependency**:
   If the child theme code causes a PHP error, reactivate the parent GeneratePress dependency via WP-CLI:
   ```bash
   wp theme activate generatepress
   ```

---

## 3. Live Site Rollback

A rollback protocol for the live website (`junkfeathers.com` on Hostinger) is **not yet designed or authorized**. No deployment systems or staging connections have been established or approved. The live website is completely untouched in this phase.
