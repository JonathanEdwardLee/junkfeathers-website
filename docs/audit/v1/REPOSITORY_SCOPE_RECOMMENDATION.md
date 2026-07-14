# Repository Scope & Version Control Recommendation

This document outlines the recommended Git repository setup for `junkfeathers.com` to ensure a clean, secure, and developer-friendly deployment workflow.

---

## 1. Core Git Strategy: The "Custom-Only" Approach

**Do NOT track the entire WordPress core or the entire `wp-content` directory.** Tracking core WordPress files, large uploads, and third-party plugins causes repository bloat, exposes database secrets, and makes branching/merging difficult.

Instead, we recommend initializing the Git repository at the **WordPress installation root (`app/public/`)** but utilizing a strict, opt-in `.gitignore` file that ignores everything except:
1. **The custom child theme**: `wp-content/themes/junkfeathers-machine/`
2. **The custom site plugin**: `wp-content/plugins/junkfeathers-core/` (to be created)
3. **Audit documentation**: `/docs/`

This layout keeps version control lightweight while allowing you to manage custom code and documents under a single repository.

---

## 2. Directory Layout Map

Here is the proposed repository layout:

```text
junkfeathers/ (Git Root)
├── .gitignore
├── README.md
├── docs/ (Audit reports and planning guides)
│   ├── BASELINE_AUDIT.md
│   ├── RISK_REGISTER.md
│   └── ...
└── wp-content/
    ├── plugins/
    │   └── junkfeathers-core/ (Custom site logic & custom blocks - to be created)
    │       ├── junkfeathers-core.php
    │       └── src/
    └── themes/
        └── junkfeathers-machine/ (Custom CSS variables and tactile templates)
            ├── style.css
            ├── functions.php
            └── README.md
```

---

## 3. Recommended `.gitignore` File

Save the following content as `.gitignore` in the root of the project to ensure secrets and binaries are never tracked:

```ini
# ==============================================================================
# JUNKFEATHERS.COM - GIT IGNORE SCHEMA
# ==============================================================================

# Ignore WordPress core files
/wp-admin/
/wp-includes/
/*.php
!/wp-content/

# Ignore index.php in wp-content
/wp-content/index.php

# Ignore all standard/third-party plugins
/wp-content/plugins/*
# BUT track our custom plugin
!/wp-content/plugins/junkfeathers-core/

# Ignore all themes
/wp-content/themes/*
# BUT track our custom child theme
!/wp-content/themes/junkfeathers-machine/

# Ignore all user uploads, backups, and caches
/wp-content/uploads/
/wp-content/upgrade/
/wp-content/blogs.dir/
/wp-content/cache/
/wp-content/backups/
/wp-content/litespeed/

# Ignore environment configuration and secrets (CRITICAL)
wp-config.php
.env
.env.*
*.sql
*.sql.gz
*.zip
*.tar.gz
*.log

# Ignore local server configs
/conf/
/logs/
.envrc
.direnv/

# System files
.DS_Store
Thumbs.db
```

---

## 4. Why This Architecture?

* **Security**: It guarantees database credentials, salts, and site keys (`wp-config.php`) are never accidentally pushed to a public or private remote repository.
* **Size**: Keeps the repository size under a few megabytes instead of hundreds of megabytes of media uploads and third-party vendor code.
* **Portability**: The child theme and custom plugin can be zipped and installed on any clean WordPress host (e.g. migrating from Local to Hostinger staging) without needing to transfer core files.
* **Clarity**: Simplifies tracking custom CSS changes and custom PHP logic, isolating them from third-party updates.
