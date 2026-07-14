# Foundation Pass Plan (Future Reference)

This document outlines a neutral roadmap of decision gates for future project phases. All steps remain subject to explicit review and approval by Jonathan Lee and the Website 01Council.

* **Current Status**: **UNDER REVIEW** (No implementation, deletion, or deployment tasks are authorized)

---

## 1. Objectives

The primary goal of future phases will be to clean up local configurations, align analytical utilities, and prepare a stable development-to-production workflow locally before designing any deployment mechanisms.

---

## 2. Future Decision Gates

### Gate 1: Determine AI Provider Utility
* **Question**: Is the active `AI Provider for OpenAI` plugin required for any block generators, translation widgets, or text assistants used by the founder?
* **Evidence Required**: Verification of active custom client handlers or dependencies inside the database.
* **Outcome**: Decide whether to retain the plugin or mark it for deactivation.

### Gate 2: Copyright Hook Location
* **Question**: Should the active footer copyright filter (`generate_copyright`) remain inside the **Code Snippets** database list, or should it move to the active child theme's `functions.php`?
* **Context**: Since it is a theme-specific filter, keeping it in the child theme keeps files unified. No plugin creation is planned yet.

### Gate 3: Jetpack Module Audit
* **Question**: Which of the 11 active Jetpack modules can be deactivated locally to reduce script size and load times?
* **Tasks**: Perform local profiling with query monitors to verify the load overhead of Jetpack modules like Stats, Blaze, and blocks.

### Gate 4: Email Marketing Provider Selection
* **Question**: Which service (Hostinger Reach, Substack, Brevo, or Mailchimp) best meets our criteria for contact ownership, API access, portabilty, and GIF support?
* **Outcome**: Formal selection of provider and sign-up form design.

### Gate 5: Visual Foundations & Component Architecture
* **Question**: What font delivery model and style palettes are selected?
* **Outcome**: Approval of the CSS variables and grandfather-clock coordinates inside `style.css`.

### Gate 6: Deployment Workflow Design
* **Question**: How will code updates be deployed to Hostinger production without exposing SQL dumps, credentials, or local configs, given that no paid staging environment is planned?
* **Outcome**: Design a secure, manual or reviewed deployment pipeline (e.g. via SFTP or plugin upload) once local QA is complete.
