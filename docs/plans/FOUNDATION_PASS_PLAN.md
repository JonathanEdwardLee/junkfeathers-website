# Foundation Pass Plan

This document outlines the proposed implementation plan for the next phase of development: cleaning up the local environment, refactoring database snippets, and establishing staging synchronization.

* **Current Status**: **PENDING REVIEW** (No implementation is authorized in this phase)

---

## 1. Objectives

1. **Local Plugin Cleanup**:
   Remove the deliberately disabled Hostinger helper folders (`.disabled`) to declutter the plugins directory, and archive them in backups.
2. **Snippet Migration**:
   Establish a custom site utility plugin (`junkfeathers-core`) to replace the **Code Snippets** plugin.
3. **Staging Pipeline**:
   Prepare a staging subdomain to test deployments and search-and-replace scripts.

---

## 2. Proposed Implementation Steps

### Phase 1: Local Cleanup
* **Task 1.1**: Archive the deactivated Hostinger plugins (`hostinger.disabled`, `hostinger-affiliate-plugin.disabled`, `hostinger-easy-onboarding.disabled`, `hostinger-reach.disabled`) into a local backup zip outside of Git.
* **Task 1.2**: Remove these `.disabled` folders from the local workspace.
* **Task 1.3**: Deactivate the unused `AI Provider for OpenAI` plugin in the Local site dashboard if its utility remains unverified.

### Phase 2: Create Custom Site Plugin (`junkfeathers-core`)
* **Task 2.1**: Create `plugins/junkfeathers-core/` inside the repository.
* **Task 2.2**: Write the main plugin header `junkfeathers-core/junkfeathers-core.php`.
* **Task 2.3**: Move the footer copyright override code from the Code Snippets database into a theme-specific or plugin-based function:
  ```php
  add_filter( 'generate_copyright', function() {
      return '© ' . date('Y') . ' Junkfeathers. Pet the <a href="https://snorkleprawn.com" target="_blank" rel="noopener noreferrer">SnorklePrawn</a>.';
  } );
  ```
* **Task 2.4**: Deactivate and delete the **Code Snippets** plugin from the WordPress local site.

### Phase 3: Staging Setup & Verification
* **Task 3.1**: Request Jonathan to configure a temporary staging subdomain on Hostinger (e.g., `staging.junkfeathers.com`).
* **Task 3.2**: Develop a deploy script to zip the repository's custom theme and plugin, upload it, and execute a safe domain search-replace.
* **Task 3.3**: Verify event measurement flows on staging.
