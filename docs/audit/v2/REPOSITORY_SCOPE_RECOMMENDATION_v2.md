# Repository Scope & Git Readiness Plan (v2)

This document evaluates two version-control approaches for `junkfeathers.com` to manage custom code securely and efficiently under Windows development and Hostinger production environments.

---

## 1. Option Comparison Matrix

### Option A: Repository Rooted at Local `app/public/`
A single repository initialized at the root of the WordPress installation, using a strict opt-in `.gitignore` file to track only the custom theme, docs, and custom plugins.

* **Exact Repository Tree (Option A)**:
  ```text
  app/public/ (Git Root)
  ├── .gitignore
  ├── README.md
  ├── docs/
  │   ├── BASELINE_AUDIT_v2.md
  │   └── ...
  └── wp-content/
      ├── plugins/
      │   └── junkfeathers-core/ (Custom plugin - tracked)
      └── themes/
          └── junkfeathers-machine/ (Child theme - tracked)
  ```
* **Benefits**:
  - Simple git commands.
  - No file sync tools required locally; coding happens directly inside the Local server directory.
* **Risks**:
  - Higher risk of accidental commits of database backups, `wp-config.php`, or core files if `.gitignore` rules are misconfigured.
  - Tracks directly inside a live Local runtime folder, which contains transient files.

---

### Option B: Standalone Custom-Code Repository (Recommended)
A completely separate workspace directory outside the Local server tree. It contains only custom assets. A synchronization script (or task commands) handles copying files from the repository to the Local path for testing.

* **Exact Repository Tree (Option B)**:
  ```text
  junkfeathers-code/ (Git Root)
  ├── .gitignore
  ├── README.md
  ├── sync.ps1 (Local sync helper script)
  ├── docs/ (Audit reports and guidelines)
  │   ├── BASELINE_AUDIT_v2.md
  │   ├── PLUGIN_DECISION_MATRIX.md
  │   └── ...
  ├── plugins/
  │   └── junkfeathers-core/ (Custom utility plugin folder)
  └── themes/
      └── junkfeathers-machine/ (Child theme folder)
  ```
* **Benefits**:
  - **100% safe from credential exposure**. No core WordPress files, environment variables, or databases are in the directory.
  - Clean separation of concerns. The repository is host-agnostic and server-agnostic.
* **Risks & Sync Method**:
  - Requires copying files to `Local Sites/junkfeatherscom/app/public/wp-content/` whenever a change is tested.
  - *Sync Strategy*: A simple PowerShell script (`sync.ps1`) runs locally to copy changes:
    ```powershell
    # sync.ps1
    $LocalPath = "C:\Users\joned\Local Sites\junkfeatherscom\app\public\wp-content"
    Copy-Item -Path ".\themes\junkfeathers-machine" -Destination "$LocalPath\themes" -Recurse -Force
    Copy-Item -Path ".\plugins\junkfeathers-core" -Destination "$LocalPath\plugins" -Recurse -Force
    ```

---

## 2. Windows-Specific Path and File Considerations

1. **Line Endings (LF vs CRLF)**:
   Ensure Git handles line endings consistently across Windows and Hostinger Linux servers by creating a `.gitattributes` file in the repo root:
   ```ini
   * text=auto eol=lf
   ```
2. **Forward Slashes in Git**:
   Even on Windows, always write path rules in `.gitignore` using forward slashes (`/`).

---

## 3. Recommended `.gitignore` for Option A

If Option A is chosen, the `.gitignore` file must be strictly configured:

```ini
# ==============================================================================
# JUNKFEATHERS.COM - GIT IGNORE SCHEMA (Option A)
# ==============================================================================

# Ignore all root files (core WP, logs, configurations)
/*
!/wp-content/
!/.gitignore
!/README.md
!/docs/

# Ignore all subdirectories in wp-content
/wp-content/*
!/wp-content/themes/
!/wp-content/plugins/

# Ignore all themes except custom child theme
/wp-content/themes/*
!/wp-content/themes/junkfeathers-machine/

# Ignore all plugins except custom core plugin
/wp-content/plugins/*
!/wp-content/plugins/junkfeathers-core/

# Exclude sensitive settings and credentials (CRITICAL)
wp-config.php
.env
.env.*
*.sql
*.sql.gz
*.zip
*.tar.gz
*.log
/wp-content/uploads/
/wp-content/cache/
```

---

## 4. Security Controls & Pre-Commit Verification

To guarantee zero exposure of credentials, database dumps, or local configurations, follow these commands before performing the first git commit:

### Verification Commands
To test that `.gitignore` works perfectly and verify what files will be committed, run these commands in the git folder:

```powershell
# 1. Print list of all files that Git is tracking (should only show theme, core plugin, and docs)
git status --ignored

# 2. Check if a specific file is ignored (returns an error if successfully ignored)
git check-ignore -v wp-config.php
git check-ignore -v app/sql/local.sql

# 3. Dry-run add to inspect files staged for commit
git add --dry-run .
```

### Run a Local Secret Scan
Run a basic PowerShell search to verify no passwords, database salts, or raw keys are contained in any file inside the staged theme or plugin folders:

```powershell
# Search custom code directory for DB_PASSWORD, AUTH_KEY, or root credentials
Get-ChildItem -Path .\themes\junkfeathers-machine\ -Recurse | Select-String -Pattern "DB_PASSWORD", "AUTH_KEY", "SECURE_AUTH", "root"
```

---

## 5. Workflow Rules for a Solo Founder

* **Branching Model**: Use a simple single-branch trunk model (`main`) with descriptive commit tags. Since there is a single developer, complex branch merges are unnecessary.
* **Commit Tag Rules**:
  - `feat: [Description]` - for adding new templates or CSS rules.
  - `fix: [Description]` - for addressing bugs or styling corrections.
  - `docs: [Description]` - for updating audit maps or notes.
* **Rollback Protocol**: If a styling change breaks a layout:
  ```bash
  # View recent commits
  git log -n 5 --oneline
  # Rollback style sheet to the last commit
  git checkout HEAD~1 -- wp-content/themes/junkfeathers-machine/style.css
  ```
* **Deployment Workflow**: Deploy changes by uploading the clean child theme (`junkfeathers-machine`) and core plugin (`junkfeathers-core`) zip files to the Hostinger staging/production environment, avoiding SQL imports except during critical schema changes.
