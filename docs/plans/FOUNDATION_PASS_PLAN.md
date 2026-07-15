# Foundation Pass Plan (Future Reference)

This document outlines a neutral roadmap of decision gates for future project phases. All steps remain subject to explicit review and approval by Jonathan Lee and the Website Council.

* **Current Status**: **UNDER REVIEW** (No implementation, deletion, or deployment tasks are authorized)

---

## 1. Objectives

The primary goal of future phases will be to clean up local configurations, align analytical utilities, and prepare a stable development-to-production workflow locally before designing any deployment mechanisms.

---

## 2. Future Decision Gates

### Gate 1: Determine AI Provider Utility [RESOLVED]
* **Outcome**: The founder decided that this plugin is not needed. It was successfully deactivated locally on July 13, 2026, as a reversible test. The plugin folder remains installed locally; its live state is unverified and unchanged, and deletion is unauthorized.

### Gate 2: Copyright Hook Location [RESOLVED]
* **Outcome**: The GeneratePress footer copyright filter was successfully migrated from the database Snippets list to the child theme `functions.php` on July 13, 2026, as a version-controlled callback function `junkfeathers_machine_footer_copyright`. The Code Snippets plugin was deactivated locally as a reversible test; its five snippet records remain stored in the database, and deletion of the plugin is unauthorized.

### Gate 3: Jetpack Module Audit
* **Question**: Which of the 11 active Jetpack modules can be deactivated locally to reduce script size and load times?
* **Tasks**: Perform local profiling with query monitors to verify the load overhead of Jetpack modules like Stats, Blaze, and blocks.

### Gate 4: Email Marketing Provider Selection [RESOLVED]
* **Outcome**: The founder approved the Hostinger Reach pilot as the first-year provider. In Task 10, a visually complete but nonfunctional signup prototype was placed on the Local homepage and Orpheus Deck page, child-theme version was bumped to `0.5.0`, and consent and activation checklists were documented. Actual integration and activation remain inactive.

### Gate 5: Visual Foundations & Component Architecture [RESOLVED]
* **Outcome**: The visual foundation pass 1 (monochrome OLED visual system, generic monospace typography, square borders, solid black body background, scanlines restricted to screens), the Tech landing page prototype (featuring Orpheus Deck), and the Orpheus Deck conversion page prototype (ID 12) were successfully implemented on July 14, 2026, bumping the child theme version to `0.4.0`.

### Gate 6: Deployment Workflow Design [RESOLVED]
* **Outcome**: Bounded manual deployment runbook, content records, and rollback plans (V1) were designed in Task 11 on July 15, 2026. Execution remains pending authorization.
