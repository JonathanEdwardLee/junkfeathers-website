# Pygmalion Astro Integration Boundary V1

This document defines the interface, boundaries, and responsibilities for visual identity assets between the visual designer (**Pygmalion**) and the software agent (**Antigravity**).

* **Date**: July 16, 2026
* **Status**: **Locked Design Boundary**

---

## 1. Context & Canonical Identity Origin

1. **Chronos** is the canonical origin of the Junkfeathers company identity system.
2. The 128×64 resolution layout, logo word placement, dead-bird geometry, and console glitch behaviors are designed and controlled exclusively by Pygmalion.
3. Final website image formats (PNG, SVG), animated assets, reduced-motion still fallback representations, rendering scale policies (pixelated vs. smooth), and anti-aliasing configurations are **not yet approved or handed off**.

---

## 2. Antigravity Constraint Boundaries

1. **No Approximations**: Antigravity is strictly prohibited from redrawing, tracing, or approximating the logo, the dead-bird mark, or glitch assets using placeholder fonts or generic icons (such as stock ravens or basic canvas drawings).
2. **Text-Only Skeleton**: The current Astro foundation must use a simple text-only representation (monospace `JUNKFEATHERS` text) inside the panel shell.
3. **Future Extension**: Once Pygmalion's assets are formally approved, Astro will support them via dedicated layout components and the `web/src/assets/identity/` folder.

---

## 3. Workflow & Governance Chain

The process for integrating visual assets is governed as follows:

```text
Pygmalion issues visual specs / final exports
  → Website Council reviews for accessibility, payload size, and feasibility
  → Antigravity implements the integration strictly as specified
  → Pygmalion performs visual QA verification
  → Jonathan Lee grants final approval
```
