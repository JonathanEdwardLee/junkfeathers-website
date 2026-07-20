# Junkfeathers Website

Private proprietary source repository for **junkfeathers.com**, owned by Jonathan Edward Lee / Junkfeathers Tech.

> Retro outside. Current stable technology underneath.

## Ownership

Copyright © 2026 Jonathan Edward Lee / Junkfeathers Tech. All rights reserved.

This repository is private and proprietary. No license is granted to copy, redistribute, publish, sell, sublicense, or reuse its code, writing, designs, assets, or documentation without Jonathan Lee’s written permission.

GitHub ownership and this notice document the project’s provenance. Copyright ownership does not depend on publishing the repository or selecting an open-source license.

## Mission

Junkfeathers.com is the owned Music + Tech machine for:

- Junkfeathers music
- Orpheus Deck
- future strange musical machines
- one monthly Junkfeathers transmission
- Clio Interviews
- product, support, and privacy information

The site should feel like a strange musical instrument rather than a normal corporate website.

## Architecture Direction

The current WordPress website remains the safe public baseline while a modern Git-native replacement is developed and tested.

The replacement is designed for:

- artistic freedom
- clear Music and Tech navigation
- fast static delivery
- accessible machine-like interaction
- Markdown/MDX content that AI can maintain safely
- pull-request review before release
- reproducible builds
- simple rollback
- minimal ongoing plugin and database maintenance

The preferred rebuild stack is:

- Astro
- TypeScript in strict mode
- static output
- Markdown/MDX and Astro content collections
- semantic HTML
- CSS and lightweight browser JavaScript
- no client framework unless a specific interaction justifies it

Use the newest stable releases that pass testing. Do not use preview, beta, canary, or experimental dependencies merely because they are newer.

## Repository State

- `main` is the last founder-approved repository state.
- The current WordPress production snapshot remains preserved in Git history and under the existing WordPress directories.
- New work happens on one bounded task branch at a time.
- Hostinger production deployment is not triggered merely by merging a pull request.
- The future production deployment source will be a reviewed deploy-only branch or narrowly scoped workflow.

## Branch Workflow

Do not develop directly on `main`.

For each DevAI task:

1. Create a branch from current `main`:
   ```text
   task/NNN-short-description
   ```
2. The DevAI tool edits only the authorized files specified in the active exchange.
3. Run local checks and build the site.
4. Jonathan previews the branch locally in a browser.
5. Website Council reviews the pull request, diff, test evidence, and risks.
6. Corrections stay on the same branch.
7. Jonathan merges only after approval.
8. Production deployment requires a separate explicit authorization.

No direct push to `main`.  
No force-push to `main`.  
No automatic production deployment from task branches.

## Local Development

The modern rebuild lives in:

```text
web/
```

Typical workflow:

```bash
cd web
npm install
npm run dev
```

Before pull-request review:

```bash
npm run check
npm run build
```

The current WordPress Local installation remains available for legacy reference. It is not the runtime for the Astro rebuild.

## Deployment Boundary

Never deploy the entire repository into `public_html`.

The repository includes source, documentation, tests, and legacy WordPress records. A future production deployment must publish only reviewed build output.

Preferred eventual flow:

```text
task branch
  → pull request
  → founder-approved main
  → verified static build
  → deploy-only production branch or scoped deployment workflow
  → Hostinger
```

The existing WordPress production site remains live until the replacement passes local, preview, accessibility, performance, email, rollback, and founder-approval gates.

## Email Strategy

Junkfeathers maintains one audience and sends one routine editorial/promotional email per month.

Approved public promise:

> One transmission a month from the Junkfeathers workshop: new music, strange machines, Clio Interviews, product updates, and occasional offers.

Button:

> Receive the Monthly Transmission

There is no separate Clio subscription.

Hostinger Reach remains the planned provider. Public collection is not enabled until consent, privacy, sender authentication, delivery, confirmation, unsubscribe, export, deletion, postal address, accessibility, mobile behavior, measurement, backup, and rollback pass a controlled test.

## Design System

The company visual language is shared with Orpheus Deck and Chronos:

- black, white, and gray monochrome OLED
- generic monospace typography
- square machine geometry
- restrained green only for links and genuine error states
- physical panel divisions
- displays, labels, meters, switches, knobs, and ports
- controlled glitch behavior
- no autoplay audio
- keyboard access
- reduced-motion support

Optional spectacle must never obscure Music, Tech, Orpheus Deck, or the monthly signup.

## Source-of-Truth Boundaries

- Git/GitHub: exact code, branches, commits, tests, build configuration, and reviewed content source
- Hostinger: live runtime and deployment evidence
- Google Drive: approved company strategy, council state, and durable decisions
- Current WordPress database: legacy live content until the replacement site is launched

## Security

Never commit:

- passwords, access tokens, API keys, authentication codes, or salts
- `.env` files containing secrets
- `wp-config.php`
- database exports
- Hostinger backups
- private email configuration
- subscriber/contact exports
- WordPress uploads
- private customer or user data
- production credentials
- local-machine configuration

Use GitHub or Hostinger secret storage only when a reviewed deployment task requires it.

## DevAI Authority

The repository-specific DevAI welcome and rules are documented in [AGENTS.md](AGENTS.md). The DevAI tool (such as Antigravity) must follow all safety boundaries, working procedures, and HOLD conditions defined in [AGENTS.md](AGENTS.md) and the active exchange (`Council-DevAI-Exchange.zip`).

The DevAI tool may:

- work locally on the current authorized task branch
- install reviewed project dependencies
- run checks and builds
- push the task branch
- open or update a pull request
- prepare evidence for founder and Council review

The DevAI tool may not:

- merge the pull request
- push directly to `main`
- connect Hostinger
- deploy production
- delete the live WordPress site
- modify DNS, email, analytics, plugins, users, or live content
- request or store Jonathan’s credentials
- make the repository public
- grant repository access to another person or application

## Release Rule

A production replacement requires:

1. founder-approved architecture
2. passing email foundation
3. passing local and preview builds
4. accessibility and performance acceptance
5. exact deployment payload
6. fresh WordPress and Hostinger rollback copies
7. founder visual approval
8. explicit cutover authorization
9. verified rollback procedure
10. post-launch validation
