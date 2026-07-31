# Repository Automation Guidelines

This file provides public-safe guidance for coding tools and automated contributors working in this repository.

## Scope

- The current Astro website is under `web/`.
- The preserved WordPress theme under `themes/` is legacy reference source and is not part of the Astro build.
- Keep changes focused on the requested task. Do not add unrelated refactors or redesigns.
- Preserve the mobile-first layout, accessibility behavior, approved copy, and product-asset integrity.

## Before editing

1. Verify the repository remote, current branch, starting commit, and clean worktree.
2. Work on a task branch created from current `origin/main` unless explicitly directed otherwise.
3. Inspect the smallest relevant source and documentation surface.
4. Treat existing uncommitted changes as user-owned and do not discard them.

## Validation

From `web/`, run:

```bash
npm ci
npm run check
npm run build
```

Before handoff, run `git diff --check` and confirm that only intended files changed.

## Security and repository hygiene

Never commit credentials, secrets, environment files, private data, subscriber exports, databases, backups, local absolute paths, generated build output, or dependency directories. Do not access or modify hosting, DNS, production systems, billing, analytics, or email collection unless a task explicitly authorizes that exact operation.

## Assets

Do not redraw, approximate, recolor, crop, or silently replace identity and product assets. Use only approved repository assets or explicitly supplied source files. Preserve attribution and provenance notes.

## Git safety

- Do not push directly to `main`.
- Do not force-push shared branches.
- Do not merge or deploy without explicit authorization.
- Do not rewrite public history as part of routine cleanup.
- Keep commits narrow, descriptive, and reproducible.
