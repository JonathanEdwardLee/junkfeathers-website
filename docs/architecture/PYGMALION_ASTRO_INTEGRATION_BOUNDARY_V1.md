# Pygmalion Astro Integration Boundary V1

This document defines the governance, boundaries, and responsibilities for visual identity assets between Jonathan, Pygmalion, Website Council, and DevAI.

* **Date**: July 28, 2026
* **Status**: **Locked Design & Governance Boundary**

---

## 1. Context & Governance Roles

1. **Jonathan** is founder and final visual authority.
2. **Pygmalion** owns visual-system memory, art direction, approved visual assets and specifications, and visual QA.
3. **Website Council** owns website purpose, scope, information architecture, copy, conversion, accessibility, privacy and support requirements, technical acceptance, and deployment recommendation.
4. **DevAI** implements only approved bounded handoffs explicitly authorized by the active exchange and does not approve its own work.

---

## 2. Canonical Identity Origin & DevAI Constraints

1. **Chronos** is the canonical origin of the Junkfeathers company identity system.
2. The 128×64 resolution layout, logo word placement, dead-bird geometry, font rendering, machine language, and console glitch behaviors are designed and controlled exclusively by Jonathan and Pygmalion.
3. **No Approximations**: DevAI is strictly prohibited from redrawing, tracing, or approximating the logo, dead-bird mark, font rendering, glitch behaviors, or final machine artwork using placeholder fonts or generic icons.
4. **Text-Only Skeleton**: The current Astro foundation must use simple text-only representations inside the panel shell until an approved Pygmalion visual handoff is authorized.
5. **Future Extension**: Once Pygmalion's assets are formally approved and handed off via Website Council, Astro will support them via dedicated layout components under `web/src/assets/identity/`.

---

## 3. Workflow & Governance Chain

The process for integrating visual assets is governed as follows:

```text
Pygmalion issues visual specs / final exports
  → Website Council reviews for accessibility, payload size, conversion, and technical acceptance
  → DevAI implements the integration strictly as specified in an authorized exchange
  → Pygmalion performs visual QA verification
  → Jonathan Lee grants final approval
```
