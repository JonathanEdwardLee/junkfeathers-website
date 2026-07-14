# Email Signup Privacy Requirements V1

* **Date Prepared**: July 14, 2026
* **Status**: **Requirements Draft** (This document outlines technical specifications and data requirements for a future site-wide privacy policy. It is not final legal advice or a published policy page).
* **Target Audience**: Website Council / Jonathan Lee

---

## 1. Core Data Principles

Before activating the email signup form on `junkfeathers.com`, the site must publish a site-wide Privacy Policy that addresses the following:

### A. Data Collected
* **Email Address**: Collected strictly for communication list membership.
* **Consent Metadata**: Consent timestamp, IP address (for consent logging purposes only, in accordance with processor defaults), and consent statement version.
* **No Excess Fields**: The form is restricted to email. Do not collect name, phone, preferences, or demographic data.

### B. Legal Basis for Processing
* **Explicit Consent**: Membership is based on active, affirmative consent (non-prechecked checkbox).
* **Unsubscribe Rights**: Users can revoke consent and opt-out at any time via the unsubscribe links provided in emails.

### C. Processor Disclosure
* **Processor**: Hostinger Reach is the third-party email campaign service provider.
* **Data Hosting**: Email addresses and consent timestamps are stored securely inside the Hostinger account database.
* **No Sale of Data**: Junkfeathers Tech does not sell, rent, lease, or share subscriber email data with any other third party.

---

## 2. Distinction from App Recording Privacy

It is critical that the site-wide privacy policy distinguishes between:
1. **Website Marketing Data (Email List)**: Transmitted to and stored in Hostinger Reach for campaign announcements.
2. **Orpheus Deck App Recording Data**: Purely local. App recordings, track audio, and project data are stored exclusively on the user's local Android device. The app has no network transmission features, does not sync to the cloud, and is completely isolated from the website marketing signup list.

---

## 3. Data Retention & Deletion Rights

* **Suppression List**: Unsubscribed emails must remain on a suppression list inside Reach to prevent accidental re-importing.
* **Export Requests**: Subscribers can request a CSV copy of their stored marketing data.
* **Erasure ("Right to be Forgotten")**: Subscribers can request complete deletion of their email record from the active and suppression lists, which must be executed manually by the administrator in the Hostinger Reach control panel.
