# Measurement & Data Plan

This document outlines a restrained, privacy-centric measurement plan for junkfeathers.com to track user engagement and product outcomes, keeping data secure and compliant.

---

## 1. Google Site Kit Baseline Capabilities

Google Site Kit is already connected and provides:
1. **Search Console Integration**: Tracks impressions, clicks, click-through rates (CTR), and average search query positions for the `junkfeathers.com` domain.
2. **Google Analytics 4 (GA4) Integration**: Automatically tracks standard page views (`page_view`), session starts, user engagement duration, scroll depth (at 90%), and referral sources.
3. **AdSense (Optional/Future)**: Tracks ad views and revenue if enabled by the founder.

**What Remains in Google Dashboard (Never copy to WordPress)**:
* Detail lists of visitor IP addresses, individual user-agent strings, full raw cookie IDs, and detailed geo-location records must remain in Google’s secure analytical infrastructure. Do NOT store or copy raw tracking tokens or personal data into the WordPress MySQL database.

---

## 2. Event Tracking Matrix

To understand campaigns, product conversions, and user interaction, the following **15 custom events** are defined:

| Event Name | Business Question Answered | Trigger | Minimum Useful Parameters | Privacy Class | Google Analytics Support? | Custom Code Required? | Consent Needed? | Timeline |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `select_music_portal` | Do visitors prefer Music over Tech on the front page? | Click on the homepage "Music" button. | `button_position` | Low (Anonymized) | Yes (via GA4 custom event) | Minimal (inline JS trigger) | No (standard usage) | Now |
| `select_tech_portal` | Do visitors prefer Tech over Music on the front page? | Click on the homepage "Tech" button. | `button_position` | Low (Anonymized) | Yes (via GA4 custom event) | Minimal (inline JS trigger) | No (standard usage) | Now |
| `view_orpheus_deck` | How many visitors explore the Orpheus Deck product? | View page `/orpheus-deck/`. | None (standard page view) | Low (Anonymized) | Yes (automatic) | No | No | Now |
| `click_play_store` | Are visitors downloading Orpheus Deck? | Click on the Google Play Store button/link. | `product_id`, `destination_url` | Low (Anonymized) | Yes (outbound click tracking) | No (automatic in GA4) | No | Now |
| `interest_ofx` | Is there interest in the upcoming O-FX synth tool? | Click on O-FX preview card / "learn more" link. | `element_id` | Low (Anonymized) | Yes (custom click event) | Minimal | No | Now |
| `interest_limit` | Is there interest in the upcoming LIMIT tools? | Click on LIMIT preview card. | `element_id` | Low (Anonymized) | Yes (custom click event) | Minimal | No | Now |
| `view_local_agora` | How many visitors view the Agora landing page? | View page `/local-agora/` (or similar). | None (standard page view) | Low (Anonymized) | Yes (automatic) | No | No | Now |
| `launch_local_agora` | Are users actively launching the Agora app? | Click on "Launch The Local Agora" web app. | `app_version` | Low (Anonymized) | Yes (outbound click tracking) | Minimal | No | Now |
| `select_music_category` | What genres of music attract the most attention? | Click on category tags (e.g. Experimental, Acoustic). | `category_name` | Low (Anonymized) | Yes (custom click event) | Yes (custom click handler) | No | Later |
| `click_music_platform` | Which streaming platform do visitors prefer for listening? | Click on Spotify, YouTube, or Bandcamp links. | `platform_name`, `album_name` | Low (Anonymized) | Yes (outbound click) | No (automatic) | No | Now |
| `video_engagement` | Are visitors actually watching embedded video logs? | Play, 50% watch, and complete on embeds. | `video_title`, `percent_watched` | Low (Anonymized) | Yes (Enhanced Measurement) | No (automatic in GA4) | Yes (YouTube cookies) | Now |
| `view_junk_notes` | Which articles / build logs are the most read? | View post under `/junk-notes/`. | `post_title`, `category` | Low (Anonymized) | Yes (automatic) | No | No | Now |
| `email_signup_start` | Are users initiating email signup but abandoning? | Focus/interaction on the email input field. | `form_id` | Low (Anonymized) | Yes (custom form event) | Yes (JS listener) | No | Later |
| `email_signup_complete` | What is our subscriber growth rate? | Successful submission of the email form. | `form_id` (No email content) | Medium (Form success status) | Yes (conversion goal) | Yes (Form API listener) | Yes | Now |
| `error_broken_link` | Are app links or media plays failing? | Trigger of a 404 error page. | `broken_url`, `referrer` | Low (Anonymized) | Yes (automatic 404 page tracking) | No | No | Now |

---

## 3. Data Integration Constraints & Escalations

### Unified Dashboard Data Requirements
To support a future custom unified dashboard combining site analytics with Play Store sales, email subscriptions, and app metrics:
1. **API Exportable GA4 Events**: Ensure all outbound clicks (Play Store) and form submissions (email) are registered as formal GA4 events, which can be extracted via the Google Analytics Data API.
2. **Mail list exports**: Selected email tools must allow automated API/webhook data query (e.g. Brevo) rather than database-locked lists (e.g. Hostinger Reach).

### CEO Council Review Trigger Rules
Any implementation proposal matching the following criteria **must be escalated to the CEO Council**:
* Storing third-party app analytics, store transaction records, or user emails directly within the WordPress MySQL database.
* Setting up cross-domain tracking across separate projects (e.g. tracking specific user actions inside the separate *Local Agora* application using WordPress session IDs).
* Deploying a unified metrics database (like BigQuery or custom database instances) linking multiple user identities across different services.
