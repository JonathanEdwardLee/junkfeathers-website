/**
 * Content model for the reusable App Showcase -> Guide -> Contact pattern.
 * Sections without founder-verified public copy stay `held` instead of being filled in.
 */

export type AppGuideState = 'active' | 'held';

export interface AppGuideLink {
  label: string;
  href: string;
  external?: boolean;
}

export type AppGuideBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'steps'; items: string[] }
  | { kind: 'links'; items: AppGuideLink[] };

export interface AppGuideEntry {
  id: string;
  question: string;
  blocks: AppGuideBlock[];
}

export interface AppGuideHold {
  note: string;
  pendingQuestions?: string[];
}

export interface AppGuideGroup {
  id: string;
  heading: string;
  state: AppGuideState;
  lead?: string;
  entries?: AppGuideEntry[];
  hold?: AppGuideHold;
}

export interface AppGuideSection {
  id: string;
  navLabel: string;
  heading: string;
  state: AppGuideState;
  lead?: string;
  entries?: AppGuideEntry[];
  groups?: AppGuideGroup[];
  hold?: AppGuideHold;
}

export interface AppGuideStoreAction {
  label: string;
  href: string;
  /** Existing approved analytics event name, when present. */
  analyticsEvent?: string;
}

export interface AppGuideConfig {
  appId: string;
  appName: string;
  statusStrip: string;
  pageTitle: string;
  metaDescription: string;
  heading: string;
  lead: string;
  showcaseLink: AppGuideLink;
  supportLink: AppGuideLink;
  storeAction: AppGuideStoreAction;
  sections: AppGuideSection[];
}

export interface AppSupportIntent {
  id: string;
  label: string;
  summary: string;
  hints: string[];
}

export interface AppSupportConfig {
  appId: string;
  appName: string;
  statusStrip: string;
  pageTitle: string;
  metaDescription: string;
  heading: string;
  lead: string;
  intentsHeading: string;
  intents: AppSupportIntent[];
  /** All intents share one secure channel, so the page exposes a single contact action. */
  contactActionLabel: string;
  channelNote: string;
  subscriptionNote: string;
  guideLink: AppGuideLink;
  showcaseLink: AppGuideLink;
  privacyLink: AppGuideLink;
  storeAction: AppGuideStoreAction;
}
