# Content Collections Schema & Guidelines

This directory houses the Markdown/MDX content for Junkfeathers. All entries must adhere to the schemas defined in `web/src/content.config.ts`.

---

## 1. Collection Rules

### Music Collection (`src/content/music/`)
* **Frontmatter Schema**:
  ```yaml
  title: string # Name of the song or release
  description: string # Short excerpt or context
  pubDate: Date # YYYY-MM-DD
  draft: boolean # Default: false
  internalFixture: boolean # Default: false
  embedUrl: string (optional) # Valid Bandcamp/YouTube/Spotify URL
  seo: (optional)
    title: string (optional)
    description: string (optional)
    canonicalUrl: string (optional)
  ```
* **Slug rules**: Lowercase file name without extensions (e.g. `src/content/music/my-song.md` maps to `/music/my-song/`).

---

### Tech Collection (`src/content/tech/`)
* **Frontmatter Schema**:
  ```yaml
  title: string # Name of the project or retro machine
  description: string # Brief marketing/support excerpt
  pubDate: Date # YYYY-MM-DD
  draft: boolean # Default: false
  internalFixture: boolean # Default: false
  featured: boolean # Default: false (true displays it on Tech Workshop main panel)
  featureImage: string (optional) # Relative path to media asset
  playStoreUrl: string (optional) # Outbound Google Play store link
  relatedMusic: array of strings (optional) # References to music slugs
  seo: (optional)
    title: string (optional)
    description: string (optional)
    canonicalUrl: string (optional)
  ```
* **Slug rules**: Lowercase project identifier (e.g. `orpheus-deck` maps to `/tech/orpheus-deck/`).

---

### Clio Collection (`src/content/clio/`)
* **Frontmatter Schema**:
  ```yaml
  title: string # Title of the interview
  description: string # Snippet or overview of the discussion
  pubDate: Date # YYYY-MM-DD
  draft: boolean # Default: false
  internalFixture: boolean # Default: false
  interviewee: string # Full name of the interviewee
  seo: (optional)
    title: string (optional)
    description: string (optional)
    canonicalUrl: string (optional)
  ```
* **Slug rules**: Lowercase interviewee identifier (e.g. `src/content/clio/interviewee-name.md` maps to `/clio/interviewee-name/`).

---

## 2. Publication Guard & Draft Behavior

Astro content collection loaders (`glob()`) load all content entries matching the pattern regardless of draft status. Publication eligibility is enforced explicitly by public-route helpers.

Public listing and detail routes MUST use `getPublishedEntries()` from `web/src/lib/content.ts` (or an equivalent filter) which filters out entries where:
- `draft === true`; OR
- `internalFixture === true`.

Internal schema fixtures (`internalFixture: true`) and unready drafts are strictly excluded from public site rendering.
