# Content Versioning Strategy

This document defines how `junkfeathers.com` splits content management between the WordPress database and the version-controlled Git codebase.

---

## 1. The Database vs. Code Split

To maintain a flexible, performant website, we separate editorial material from custom machine experiences:

### Database-Managed Content
* **Target assets**: Junk Notes posts, ordinary copy edits, page text content, image alt text, categories, taxonomy metadata, simple menus, and standard plugin option settings.
* **Who edits it**: Content editors and the founder using the standard WordPress admin dashboard. No code deployments are needed for these updates. Ordinary editorial content remains strictly database-managed.

### Code-Managed Experience
* **Target assets**: Structural grids, retro OLED panel styles, custom buttons, registered block patterns, theme page templates, custom JS scroll behaviors, and sound/motion widgets.
* **Who edits it**: Developers modifying files in this standalone repository.

---

## 2. Interface Reproducibility Options

When designing retro visual structures or interactive widgets, developers have three options for versioning and maintaining markup across environments:

1. **Theme Templates or Template Parts**:
   - *Best for*: Base layouts and page structures that should update globally and automatically through code edits (e.g. page wrappers, headers, footers).
   - *Behavior*: Managed entirely in the stylesheet `../../themes/junkfeathers-machine/style.css` and template PHP files.
2. **Registered Gutenberg Block Patterns**:
   - *Best for*: Layout starting points that content editors can insert into the page.
   - *Behavior*: A normal inserted WordPress block pattern is **copied** directly into page content at the moment of insertion. It does **not** remain automatically linked to the source pattern. Updating a registered pattern later does **not** automatically rewrite pages where it was previously inserted; those inserted copies can drift and require a manual review/update process.
3. **Custom Dynamic Blocks or Server-Rendered Components**:
   - *Best for*: Interactive machine widgets or calculators where centrally maintained markup, PHP rendering, or Javascript behavior is required across multiple pages.
   - *Behavior*: Renders dynamically at load-time based on code definitions, meaning any code update immediately takes effect globally.

---

## 3. Grandfather-Clock Homepage Architecture

The future grandfather-clock homepage is envisioned as an interactive retro OLED machine.

The technical architecture for this interface—whether it is implemented using a custom page template, custom block patterns, or as a standalone embedded JS application—**remains undecided** and will be defined under a separate design/implementation task. No blocks or templates are created in this phase.

---

## 4. Database Privacy & Deployment

* **Database Backups**: All SQL dumps (`*.sql`) are strictly ignored by `.gitignore` and kept outside the repository to ensure no passwords or customer emails enter Git history.
* **Content Drift Control**: Database content backups should be versioned privately outside Git. During deployments, code changes are pushed to the server, while layout templates and configurations are synced manually or via safe migration checkpoints.
