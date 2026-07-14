# Custom Plugins Folder

This folder is reserved for custom WordPress plugins designed for `junkfeathers.com`.

---

## 1. Directory State: Empty

Currently, this folder is empty because **no custom plugins have been authorized for initialization**. 

A future custom utility plugin (proposed as `junkfeathers-core`) is planned to house:
* Custom shortcodes (e.g., dynamic templates or musictheory calculators).
* Reusable mechanical widgets and block patterns.
* Core backend filters (such as copyright text or custom dashboard views).

---

## 2. Boundary Policy

To keep the site architecture clean:
1. **No Design in Plugins**: Keep visual style specifications (CSS) and layout colors in the child theme, not the custom plugins.
2. **No Business Logic in Themes**: Do not add data operations, integrations, API keys, or custom post type configurations to `themes/junkfeathers-machine/functions.php`. Keep them inside a custom plugin.
3. **No Unused Code**: Do not create or initialize a custom plugin until a concrete, founder-approved feature requires PHP processing.
