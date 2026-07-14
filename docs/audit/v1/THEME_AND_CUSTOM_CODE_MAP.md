# Theme & Custom Code Map

This document outlines the file structure of the custom child theme, custom CSS styles, Code Snippets stored in the database, and reusable block assets.

---

## 1. Active Theme: Junkfeathers Machine (Child Theme)

* **Parent Theme**: GeneratePress (v3.x)
* **Child Theme Directory**: `/wp-content/themes/junkfeathers-machine`
* **Version**: `0.1.0`
* **Author**: Jonathan Lee / Junkfeathers Tech

### Theme File Inventory

1. **`style.css`**
   - **Purpose**: Defines theme metadata and custom OLED stylesheet rules.
   - **Analysis**: Contains CSS variables (`:root`) and custom panels/buttons classes designed for the retro OLED look.
2. **`functions.php`**
   - **Purpose**: Enqueues the child theme stylesheet cleanly.
   - **Analysis**: Only enqueues `style.css` on the `wp_enqueue_scripts` hook (priority 20). No other hooks, actions, or filters are defined here.
3. **`README.md`**
   - **Purpose**: Basic developer installation documentation.

---

## 2. CSS Design System Analysis

The child theme's `style.css` defines a sleek, retro OLED design language:

### Custom CSS Variables (`:root`)
* `--jf-bg`: `#050505` (Deep OLED black background)
* `--jf-panel`: `#0d0d0d` (Slightly lighter grey panel background)
* `--jf-text`: `#f4f4f4` (Crisp off-white text)
* `--jf-muted`: `#b9b9b9` (Muted grey secondary text)
* `--jf-glow`: `#9cffd0` (Vibrant neon green OLED glow color)
* `--jf-border`: `rgba(156, 255, 208, 0.45)` (Semi-transparent neon green border)

### Custom Classes
* **`.jf-machine-panel`**:
  A styled panel container. Sets a thin neon green border, dark panel background, modern clamp padding (`clamp(1rem, 3vw, 2rem)`), rounded corners (`14px`), and a subtle green glow box shadow (`rgba(156, 255, 208, 0.08)`).
* **`.jf-oled-label`**:
  Uppercase label styling with letter-spacing (`0.08em`), font size (`0.82rem`), and neon green glow color.
* **`.jf-button` & `.jf-button-row`**:
  Row layouts for tactile buttons with neon green borders and bold text.

---

## 3. Code Snippets Inventory

Custom PHP scripts are stored in the database (`wp_snippets` table). Here is the verified inventory:

### Active Snippets (1)
* **Snippet ID 5: "Junkfeathers Footer Text"**
  - **Scope**: Front-end only.
  - **Code**:
    ```php
    add_filter( 'generate_copyright', function() {
        return '© ' . date('Y') . ' Junkfeathers. Pet the <a href="https://snorkleprawn.com" target="_blank" rel="noopener noreferrer">SnorklePrawn</a>.';
    } );
    ```
  - **Description**: Overrides the standard GeneratePress footer text to display a copyright notice with a link to `snorkleprawn.com`.

### Inactive Snippets (4)
* **Snippet ID 1: "Make upload filenames lowercase"** (Global, disabled)
  - `add_filter( 'sanitize_file_name', 'mb_strtolower' );`
* **Snippet ID 2: "Disable admin bar"** (Front-end, disabled)
  - Disables the admin bar for non-administrators.
* **Snippet ID 3: "Allow smilies"** (Global, disabled)
  - Enables smilies conversion in widget titles, post titles, and blog info.
* **Snippet ID 4: "Current year"** (Shortcode, disabled)
  - Simple PHP code `<?php echo date( 'Y' ); ?>` meant for a shortcode.

---

## 4. Custom Reusable Blocks

The database contains one custom block pattern:
* **Post ID 66: "Junk Button"** (Post Type: `wp_block`)
  - **Description**: A Gutenberg reusable block containing layout settings for the custom "Music" and "Tech" buttons on the homepage.
  - **Usage**: Hardcoded in the Home page layout block.

---

## 5. Architectural Recommendations

To preserve clean code and keep a maintainable "retro machine but modern underneath" site structure, custom logic should be segregated:

1. **Child Theme (`junkfeathers-machine`)**:
   - Keep only visual and styling rules (CSS) and child theme enqueues.
   - Do NOT add complex PHP calculations, shortcodes, or database routines to `functions.php`.
2. **Dedicated Site Utility Plugin (`junkfeathers-core`)**:
   - Create a custom, version-controlled plugin (e.g. `junkfeathers-core`) to replace the **Code Snippets** plugin.
   - Migrate "Junkfeathers Footer Text" (Snippet ID 5) and any future shortcodes, custom post types, or widgets into this plugin.
   - This keeps site business logic separate from the design theme, enabling clean upgrades of GeneratePress.
3. **External Apps (e.g. Synth Tools, Music-Theory Calculators)**:
   - Run these as standalone, modern Javascript/React/Vue single-page apps (SPAs) embedded in WordPress via iframes, or host them in subfolders (e.g., `junkfeathers.com/orpheus/` or `junkfeathers.com/theory/`) separate from the WordPress core. This keeps WordPress database queries lightweight and isolates complex logic.
