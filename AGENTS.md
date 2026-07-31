# AGENTS.md — Junkfeathers Website DevAI Welcome and Repository Rules

## Start here

You may have no trusted memory of prior work. Do not infer current authorization from chat history, remembered context, old local files, branch names, commit history, pull-request titles, or prior coding-agent behavior.

Read this file, then read the current exchange.

Canonical local exchange:

`C:\Users\joned\Documents\Junkfeathers DevAI Exchange\junkfeathers-website\00 ACTIVE\Council-DevAI-Exchange.zip`

DevAI access boundary:

- DevAI may access only the local Git repository and the local exchange root authorized by the current exchange.
- Google Drive is accessible only to Jonathan, Website Council, and CEO Council.
- DevAI must never access Google Drive, request Drive credentials, or attempt to verify or update the Drive mirror.
- Website Council verifies local/Drive parity outside DevAI.

The active filename is always exactly `Council-DevAI-Exchange.zip`.

If the exchange is missing, inaccessible, stale, not explicitly authorized, or hash-mismatched, return `HOLD` without editing.

## Authority

1. Jonathan’s newest direct instruction.
2. The authorized current `Council-DevAI-Exchange.zip`.
3. This `AGENTS.md`.
4. Durable repository documentation.
5. Tested Git, CI, build, release, runtime, and physical evidence.

Older exchanges, chats, prompts, returns, and archives are historical evidence only.

Jonathan is founder and final authority. Website Council owns website purpose, scope, information architecture, copy, conversion, accessibility, privacy and support requirements, acceptance, and deployment recommendation. Pygmalion Council owns approved visual-system memory, art direction, approved visual assets and specifications, and visual QA. DevAI implements only the bounded work explicitly authorized by the active exchange and does not approve its own work.

The current coding tool is recorded in the exchange. Antigravity, Cursor, or another founder-approved coding AI may fill the DevAI role without changing authority.

## Repository identity

Repository: `JonathanEdwardLee/junkfeathers-website`

Remote: `https://github.com/JonathanEdwardLee/junkfeathers-website.git`

Owner: Jonathan Edward Lee / Junkfeathers Tech

Owning council: Website Council

Repository role: private proprietary source and durable developer documentation for `junkfeathers.com`.

Purpose: preserve the live website baseline, develop and verify the Git-native website replacement, and support controlled review, build, rollback, and future deployment without making chat memory or one coding tool authoritative.

## Permanent ownership boundary

This repository may contain:

- website source, tests, tools, manifests, fixtures, stable approved assets, and durable developer documentation;
- preserved WordPress baseline code and records that are intentionally tracked;
- the Astro website under `web/` and later approved website implementation.

This repository does not own:

- company strategy or project priority;
- Orpheus Deck, Local Agora, Chronos, or other application source repositories;
- PIM, AutoDetailingGuide.com, Snorkleprawn, or unrelated business material;
- pricing, billing, privacy-policy approval, public claims, release approval, deployment approval, or production authorization unless the active exchange explicitly authorizes a bounded implementation;
- visual redesign or identity assets without an approved Pygmalion handoff and Website Council implementation acceptance.

Do not infer which website runtime is public from repository contents alone. The active exchange and verified runtime evidence control current release truth.

## Pygmalion boundary

Jonathan is final visual authority. Do not invent, redraw, approximate, or silently alter the Chronos-derived company identity, dead-bird geometry, font rendering, glitch behavior, approved product imagery, or machine language. Implement visual work only from an approved bounded handoff. Temporary text-only identity is safer than an invented substitute.

## Repository hygiene

Allowed:

- source code, tests, tools, manifests, fixtures, stable approved assets, and approved release artifacts;
- durable repository documentation such as `README.md`, `AGENTS.md`, `CHANGELOG.md`, architecture records, licenses, and contribution rules.

Never add:

- `Council-DevAI-Exchange.zip` or an extracted exchange folder;
- council work orders, correction messages, acceptance reviews, closeout receipts, or chat exports;
- repository review ZIPs, evidence ZIPs, or detached external hash files;
- temporary extraction, exchange-build, staging, or evidence-build folders;
- Local, WordPress, database, or production snapshots;
- founder notes or Drive exports;
- credentials, API keys, signing material, private subscriber data, raw production data, `wp-config.php`, Hostinger backups, or other secrets.

Communication and return evidence belongs only in the external exchange or another path explicitly authorized by the exchange.

## Git rules

- Verify repository path, owner, remote, branch, clean starting state, and expected commit before editing.
- Work only on the branch authorized in the exchange.
- Never push or force-push `main` unless Jonathan explicitly authorizes the exact action.
- Never merge unless the exchange status is `MERGE_AUTHORIZED` and Jonathan’s approval requirements are satisfied.
- Never rewrite shared history or force-push an active shared task branch unless Jonathan explicitly authorizes that exact recovery action.
- Prefer a reviewed revert or the rollback method in the current work order.
- Do not silently include unrelated cleanup or later-milestone work.
- Do not create another branch or pull request when the active exchange requires continuing an existing one.

## Security, privacy, production, and release

No production access, Hostinger access, DNS mutation, cloud-console mutation, deployment, public publishing, Reach activation, email collection, analytics change, billing change, credential use, private-data access, new permission, new data collection, or release unless the active exchange explicitly authorizes the exact boundary.

Do not put secrets in prompts, logs, screenshots, evidence, Git, or local exchange files. Do not request Google Drive access or credentials.

The live website must be treated as protected even when the founder is willing to replace it. A rebuild decision is not standing authorization to delete, overwrite, deploy, or cut over production.

## Working procedure

1. Verify repository path, remote identity, branch, clean state, and expected starting commit.
2. Verify the local active exchange filename, status, index, and external ZIP SHA-256 against the current founder/council prompt. Do not access Google Drive.
3. Read `00_EXCHANGE_INDEX.md`.
4. Read `01_CURRENT_WORK_ORDER.md`.
5. Read `02_LATEST_COUNCIL_DIRECTION.md`.
6. Read `03_REQUIRED_RETURN.md`.
7. Inspect only the minimum durable repository documentation needed.
8. Implement only authorized scope.
9. Run required tests and capture truthful evidence.
10. Write return communication only under the external exchange `devai-return/` area or another explicitly approved external path.
11. Clean temporary files and confirm repository hygiene.
12. Leave the repository at the exact stop gate required by the exchange.

## HOLD conditions

Return `HOLD` without editing when:

- the exchange is missing, stale, unauthorized, inaccessible, or hash-mismatched;
- the local exchange hash does not match the expected hash supplied by Jonathan or Website Council;
- any instruction requires Google Drive access or credentials;
- repository path, owner, remote, branch, clean state, pull request, or expected commit does not match;
- instructions conflict materially;
- required work crosses an unapproved project, repository, product, visual, legal, privacy, security, billing, hosting, or deployment boundary;
- a paid cost, credential, secret, private data, production access, merge, release, deployment, destructive migration, or unsafe rollback is required but not authorized;
- tests or evidence cannot be completed honestly;
- the requested result cannot be safely reversed or stopped.

## Return contract

Before returning:

- run the required tests;
- record DevAI tool, branch, starting commit, final commit, and pull request when applicable;
- report files changed and scope not changed;
- report test, build, CI, runtime, accessibility, visual, and security evidence required by the work order;
- report cost and any new dependency;
- report limitations, risks, and rollback;
- prove `git status --short` contains only authorized changes and no council communication artifacts;
- update only the exchange `devai-return` area and the index fields explicitly allowed by the return contract;
- set exchange status to `RETURNED_FOR_COUNCIL_REVIEW`;
- report the canonical local ZIP path and external SHA-256 so Website Council can perform the Drive mirror and parity check;
- do not merge, deploy, publish, activate Reach, access production, or continue into the next milestone unless separately authorized.

## Memory rule

DevAI memory is a convenience, not authority. A restarted or replacement coding AI must be able to continue safely from this file, the current exchange, Git, and verified evidence.

## Current-work rule

This file contains no current work order. The only current implementation authorization is the active `Council-DevAI-Exchange.zip`.
