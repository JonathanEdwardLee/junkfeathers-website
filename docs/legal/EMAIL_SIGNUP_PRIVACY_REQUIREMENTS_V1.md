# Email Signup Privacy Requirements V1

* **Date Prepared**: July 14, 2026
* **Status**: **Requirements Draft** (This document outlines technical specifications and data requirements for a future site-wide privacy policy. It is not final legal advice or a published policy page).
* **Target Audience**: Website Council / Jonathan Lee

---

## 1. Core Data Principles

Before activating the email signup form on `junkfeathers.com`, the site must publish a site-wide Privacy Policy that addresses the following:

### A. Data Collected
* **Email Address**: Collected strictly for communication list membership.
* **Verification Required**: Website marketing data will be processed through Hostinger Reach after integration. Exact data fields (such as whether Reach stores a consent timestamp, consent-statement version, signup-source page, or IP address automatically for consent logging) must be verified in the live pilot before public collection.

### B. Legal Basis for Processing
* **Explicit Consent**: Membership is based on active, affirmative consent (non-prechecked checkbox).
* **Unsubscribe Rights**: Users can revoke consent and opt-out at any time via the unsubscribe links provided in emails. Exact unsubscribe and suppression list behavior must be verified in the live pilot.

### C. Processor Disclosure & Data Handling
* **Processor**: Hostinger Reach is the intended third-party email campaign service provider.
* **Verifications Needed**: The exact retention period, double-opt-in configuration, and legal-compliance features provided by Hostinger Reach must be verified in the live pilot.
* **Disclosures**:
  - Junkfeathers Tech intends not to sell subscriber data.
  - Subscriber data may be processed by service providers required to operate the mailing list and disclosed when legally required.

---

## 2. Distinction from App Recording Privacy

It is critical that the site-wide privacy policy distinguishes between:
1. **Website Marketing Data (Email List)**: Intended to be processed through Hostinger Reach for campaign announcements.
2. **Orpheus Deck App Recording Data**: Orpheus recordings and projects remain local to the device and are not automatically uploaded. The website mailing list is separate from Orpheus recording/project data.

---

## 3. Data Retention & Deletion Rights

The following operational capabilities must be verified in the Hostinger Reach dashboard before public activation:
* **Suppression List**: Verify how Reach handles unsubscribed emails and whether it allows complete deletion of a contact from suppression lists if requested.
* **Export Requests**: Verify the process for manual export of subscriber marketing data.
* **Erasure ("Right to be Forgotten")**: Verify the process for manual deletion of email records from both active and suppression lists.
