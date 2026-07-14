# Content Versioning Strategy

This document defines how `junkfeathers.com` splits content management between the WordPress database and the version-controlled Git codebase.

---

## 1. The Database vs. Code Split

To maintain a flexible, performant website, we separate editorial material from custom machine experiences:

### Database-Managed Content
* **Target assets**: Junk Notes posts, ordinary copy edits, page text content, image alt text, categories, taxonomy metadata, simple menus, and standard plugin option settings.
* **Who edits it**: Content editors and the founder using the standard WordPress admin dashboard. No code deployments are needed for these updates.

### Code-Managed Experience
* **Target assets**: Structural grids, retro OLED panel styles, custom buttons, registered block patterns, theme page templates, custom JS scroll behaviors, and sound/motion widgets.
* **Who edits it**: Developers modifying files in this standalone repository.

---

## 2. Reconstructing the Grandfather-Clock Homepage

The homepage is designed as an interactive OLED machine. To ensure it can be reconstructed from scratch without depending entirely on a single database record, we use:

1. **CSS Variables & Grid Layouts**:
   The grid structure of the clock (split portals, gear coordinates) is defined entirely in [style.css](file:///c:/Users/joned/Local%20Sites/junkfeatherscom/app/public/wp-content/themes/junkfeathers-machine/style.css).
2. **Registered Gutenberg Block Patterns**:
   Instead of writing HTML layout code directly in the page editor, we version-control the block markup inside custom theme files (or the future plugin) as **Block Patterns**. The home page is simply a single block tag loading the registered pattern.
3. **Template-Pattern Hierarchy**:
   * *Theme Page Template*: Used when a page has custom PHP routing, special HTML wrappers, or needs script enqueues.
   * *Block Pattern*: Used for reusable layout sections (like the split portals) that the editor can insert via the Block Editor.
   * *Custom Block*: Used when a complex JavaScript fidget or synth app needs direct DOM integration.

---

## 3. Workflow for Exporting and Versioning Blocks

When a layout change is made in the Gutenberg visual editor:
1. Export the block markup using WordPress's "Copy Block" feature.
2. Save the markup as a PHP block pattern template file in `themes/junkfeathers-machine/patterns/`.
3. Commit the pattern file to Git.
4. Sync the pattern to the Local site to test replication.

---

## 4. Database Privacy & Deployment

* **Database Backups**: All SQL dumps (`*.sql`) are strictly ignored by `.gitignore` and kept outside the repository to ensure no passwords or customer emails enter Git history.
* **Staging Sync**: When deploying layout edits, push the code repository files (CSS/plugins) first. Do NOT push database updates from local to production; instead, the live page editor should be updated by pulling the registered Block Patterns. This prevents database overwriting and data drift.
