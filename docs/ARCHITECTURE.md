# Technical Architecture & Boundaries

This document maps out the system architecture and boundaries for junkfeathers.com.

---

## 1. System Layers

```text
+-------------------------------------------------------+
|                 WordPress Core (7.0.1)                |
|  - Publishing, Users, Pages, Media Library, Database  |
+---------------------------+---------------------------+
                            |
         +------------------+------------------+
         |                                     |
+--------v-------------------+       +---------v------------------+
|    Presentation Layer      |       |      Custom Plugins        |
|  - GeneratePress Parent    |       |  - junkfeathers-core       |
|  - Junkfeathers Machine    |       |    (Future custom code)    |
|    (Active child theme)    |       |  - Third-party plugins     |
+----------------------------+       +----------------------------+
```

### Layer 1: WordPress Core & database
Provides page routing, media uploads management, user administration, SEO fields, and general content structures.

### Layer 2: Presentation Layer (Child Theme)
* **Parent theme dependency**: GeneratePress. Inherits standard layouts, sidebars, block settings, and core accessibility features.
* **Child theme shell**: Junkfeathers Machine. Customizes layouts using custom CSS variables (color palettes, panel definitions, borders) to deliver the retro OLED aesthetic.

### Layer 3: Custom & Third-Party Plugins
* **Future custom plugin (`junkfeathers-core`)**: Will own reusable custom shortcodes, custom block registrations, and PHP filters that do not depend on the visual theme.
* **Third-party plugins**: Manage analytics (Site Kit), SEO (AIOSEO), connection links (Jetpack), and caching (LiteSpeed Cache).

---

## 2. Separate Web Application Boundary

Custom tools and apps are decoupled from WordPress to preserve performance and scalability:

1. **WordPress Role**:
   Serves as the public shell—providing landing pages, marketing, SEO metadata, documentation, privacy policies, support routes, and simple redirect/launch buttons.
2. **Web Application Role**:
   Apps like *The Local Agora* (Flutter Web) and future complex utilities run as independent projects. They are hosted on separate URLs, subfolders, or subdomains. 
3. **Integration Strategies**:
   Depending on the requirement, apps can be integrated via:
   - Direct link redirection (cleanest for separate user profiles).
   - Iframes (simplest for embedding widgets).
   - Subdomains or reverse proxies.
   The integration method is decided per product.
