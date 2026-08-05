export type AppShowcaseSectionId =
  | 'overview'
  | 'watch'
  | 'screens'
  | 'guide'
  | 'faq'
  | 'history';

export interface AppShowcaseScreenshot {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

export interface AppShowcaseLink {
  label: string;
  href?: string;
  external?: boolean;
  /** Opens Communication Machine Contact without inventing a new support surface. */
  action?: 'open-contact';
}

export interface AppShowcaseStoreAction {
  label: string;
  href: string;
  /** Existing approved analytics event name, when present. */
  analyticsEvent?: string;
}

export interface AppShowcaseSection {
  id: AppShowcaseSectionId;
  label: string;
  /** When false, control is visible but inert. */
  enabled: boolean;
}

export interface AppShowcaseConfig {
  id: string;
  name: string;
  statusStrip: string;
  descriptor: string;
  platform: string;
  freeLabel: string;
  proLabel: string;
  proBenefits: string[];
  overview: {
    paragraphs: string[];
    featuresTitle: string;
    features: string[];
    closing?: string;
    privacyFacts: string[];
  };
  storeAction: AppShowcaseStoreAction;
  links: AppShowcaseLink[];
  sections: AppShowcaseSection[];
  screenshots: AppShowcaseScreenshot[];
  returnLink?: AppShowcaseLink;
}

export const ORPHEUS_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US';

export const orpheusDeckShowcase: AppShowcaseConfig = {
  id: 'orpheus-deck',
  name: 'ORPHEUS DECK',
  statusStrip: 'ANDROID // PUBLIC RELEASE',
  descriptor: 'A retro four-track Android recorder for musicians and songwriters.',
  platform: 'Android',
  freeLabel: 'FREE',
  proLabel: 'OPTIONAL PRO',
  proBenefits: [
    'Import WAV files',
    'One-tap all-track WAV export',
    'Track name templates',
  ],
  overview: {
    paragraphs: [
      'Orpheus Deck is a retro-inspired four-track recorder built for songwriters, musicians, and audio creatives who need to capture ideas from the muses before they disappear. There will never be ads to interrupt you.',
      'It is designed like a musical sketchbook: simple enough to use fast, focused enough to stay out of your way, and familiar enough to feel like an old cassette machine brought into your phone.',
      'Record riffs, melodies, vocal ideas, demos, practice parts, harmonies, and rough song sketches across four tracks. Mix, mute, solo, overdub, and export your ideas so you can keep writing now and finish later.',
    ],
    featuresTitle: 'FEATURES // ALWAYS FREE',
    features: [
      'Four-track recording workflow',
      'Retro cassette-inspired interface',
      'Track arm, mute, solo, and volume controls',
      'Overdub-friendly workflow',
      'Project save/load',
      'Waveform display',
      'Basic metronome/click tools',
      'WAV export options',
      'Native low-latency Android audio engine',
      'Designed for fast songwriting, not bloated studio menus',
      'No ads, ever',
    ],
    closing:
      'Orpheus Deck is a creative sketchbook, not a sterile studio. It is built to help you stay in the flow, capture ideas quickly, and maybe let a few beautiful imperfections inspire something new.',
    privacyFacts: [
      'Recordings and projects stay on your device.',
      'No automatic upload.',
      'No ads. No app data collection.',
    ],
  },
  storeAction: {
    label: 'GET ON GOOGLE PLAY',
    href: ORPHEUS_PLAY_STORE_URL,
    analyticsEvent: 'orpheus_get_click',
  },
  links: [
    { label: 'PRIVACY', href: '/orpheus-deck-privacy-policy/' },
    { label: 'SUPPORT', action: 'open-contact' },
  ],
  sections: [
    { id: 'overview', label: 'OVERVIEW', enabled: true },
    { id: 'watch', label: 'WATCH', enabled: false },
    { id: 'screens', label: 'SCREENS', enabled: true },
    { id: 'guide', label: 'GUIDE', enabled: false },
    { id: 'faq', label: 'FAQ', enabled: false },
    { id: 'history', label: 'HISTORY', enabled: false },
  ],
  screenshots: [
    {
      src: '/media/orpheus/OrpheusDeck_Recorded_Audio_Main_Deck.jpg',
      alt: 'Orpheus Deck main interface with recorded audio on the deck',
      title: 'Main Deck',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/OrpheusDeck_OpeningMenu.jpg',
      alt: 'Orpheus Deck opening menu screenshot',
      title: 'Opening Menu',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/OrpheusDeck_Click_Track_Menu.jpg',
      alt: 'Orpheus Deck click track menu screenshot',
      title: 'Click Track Menu',
      width: 1080,
      height: 2104,
    },
  ],
  returnLink: {
    label: 'RETURN TO TECH',
    href: '/tech/',
  },
};
