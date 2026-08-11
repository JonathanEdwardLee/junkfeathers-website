export type AppShowcaseSectionId =
  | 'overview'
  | 'watch'
  | 'screens'
  | 'guide'
  | 'history';

export interface AppShowcaseScreenshot {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

export interface AppShowcaseVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  youtubeUrl: string;
  poster: string;
  posterAlt: string;
  posterWidth: number;
  posterHeight: number;
}

export interface AppShowcaseWatch {
  heading: string;
  lead: string;
  videos: AppShowcaseVideo[];
}

export interface AppShowcaseOverviewSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export interface AppShowcaseLink {
  label: string;
  href?: string;
  external?: boolean;
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
  /** When set, the control routes to another page instead of switching an in-machine panel. */
  href?: string;
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
    proLead?: string;
    closing?: string;
    detailSections?: AppShowcaseOverviewSection[];
    closingParagraphs?: string[];
    privacyFacts: string[];
  };
  watch?: AppShowcaseWatch;
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
  statusStrip: 'ANDROID // 1.3.0 // RELEASE 55',
  descriptor: 'A retro four-track Android recorder for musicians, songwriters, and audio creatives.',
  platform: 'Android',
  freeLabel: 'FREE',
  proLabel: 'ORPHEUS PRO',
  proBenefits: [
    'Import WAV',
    'One-tap all-track WAV export',
    'Track name templates',
    'Non-destructive EDIT/CUT',
    'Additional Advanced Metronome time signatures',
    'Groove controls',
  ],
  overview: {
    paragraphs: [
      'Orpheus Deck is a retro-inspired four-track recorder for songwriters, musicians, and audio creatives who need to capture ideas from the muses before they disappear.',
      'Think of it as a musical sketchbook: fast enough to catch a riff before you forget it, focused enough to stay out of your way, and familiar enough to feel like an old cassette machine brought into your phone.',
      'Record riffs, melodies, vocals, harmonies, demos, practice parts, sound experiments, and rough song sketches across four tracks. Arm, mute, solo, overdub, adjust levels, edit your recordings, and export WAV files when you are ready to take an idea further.',
    ],
    featuresTitle: 'BUILT FOR MAKING MUSIC',
    features: [
      'Four-track recording and overdubbing',
      'Retro cassette-inspired interface',
      'Track arm, mute, solo, and volume controls',
      'Waveform display and precision positioning',
      'LEVEL for shaping and boosting track volume',
      'Advanced Metronome with BPM, accent sound, and visual beat guidance',
      'Project save and load',
      'Raw Mix and Master Mix WAV export',
      'Native low-latency Android audio engine',
      'No ads',
      'Recordings and projects stay local unless you choose to export or share them',
    ],
    proLead: 'The core four-track recorder and LEVEL remain available without Pro. Orpheus Pro adds:',
    detailSections: [
      {
        heading: 'EDIT WITHOUT DESTROYING THE TAPE',
        paragraphs: [
          "Orpheus Deck's EDIT machine lets you make multiple non-destructive cuts while keeping the rest of the recording aligned. Bypass your edits, undo cuts, or clear them without altering the original recording.",
        ],
      },
      {
        heading: 'A MUSICAL MACHINE, NOT A STUDIO MENU',
        paragraphs: [
          'Orpheus is intentionally designed around a small set of connected music-making machines rather than a screen full of traditional DAW controls.',
          'Record first. Experiment with the built-in tools. Export when you want to continue somewhere else.',
        ],
      },
      {
        heading: 'RECORDING AND LATENCY',
        paragraphs: [
          "Phone recording hardware varies. Orpheus uses a native low-latency audio engine, but headphones and Android devices can still introduce different amounts of monitoring and overdub latency.",
          'For the best overdubbing experience:',
        ],
        items: [
          'Use wired headphones.',
          'Avoid Bluetooth headphones while overdubbing because Bluetooth adds significant delay.',
          "Use Orpheus's latency tools when needed.",
          'For larger productions, export your WAV files and continue in your DAW.',
        ],
      },
    ],
    closingParagraphs: [
      'Orpheus Deck is a creative sketchbook, not a sterile studio.',
      'Capture the idea. Keep playing. Let a few beautiful imperfections become part of the song.',
    ],
    privacyFacts: [],
  },
  watch: {
    heading: 'WATCH ORPHEUS 1.3',
    lead: 'Load a privacy-enhanced YouTube player only when you choose. Playback never starts automatically.',
    videos: [
      {
        id: 'four-track-demo',
        title: 'Four-Track Acoustic Demo + LEVEL O-FX',
        description: 'Hear the four-track “demo. hi” acoustic-guitar project and LEVEL workflow.',
        youtubeId: '4vVAtSphLz8',
        youtubeUrl: 'https://www.youtube.com/watch?v=4vVAtSphLz8',
        poster: '/media/orpheus/posters/OrpheusDeck_1_3_Thumbnail_Demo_1920x1080.jpg',
        posterAlt: 'Orpheus Deck 1.3 four-track acoustic demo video thumbnail',
        posterWidth: 1920,
        posterHeight: 1080,
      },
      {
        id: 'master-mix-export',
        title: 'Master Mix Export to WAV',
        description: 'See the Orpheus Deck 1.3 Master Mix export workflow.',
        youtubeId: 'xQChjuiTo94',
        youtubeUrl: 'https://youtu.be/xQChjuiTo94',
        poster: '/media/orpheus/posters/OrpheusDeck_1_3_Thumbnail_Export_1920x1080.jpg',
        posterAlt: 'Orpheus Deck 1.3 Master Mix export video thumbnail',
        posterWidth: 1920,
        posterHeight: 1080,
      },
    ],
  },
  storeAction: {
    label: 'GET ON GOOGLE PLAY',
    href: ORPHEUS_PLAY_STORE_URL,
    analyticsEvent: 'orpheus_get_click',
  },
  links: [
    { label: 'PRIVACY', href: '/orpheus-deck-privacy-policy/' },
    { label: 'CONTACT', href: '/orpheus-deck/support/' },
  ],
  sections: [
    { id: 'overview', label: 'OVERVIEW', enabled: true },
    { id: 'watch', label: 'WATCH', enabled: true },
    { id: 'screens', label: 'SCREENS', enabled: true },
    { id: 'guide', label: 'GUIDE', enabled: true, href: '/orpheus-deck/guide/' },
    { id: 'history', label: 'HISTORY', enabled: false },
  ],
  screenshots: [
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_02_MainDeck.jpg',
      alt: 'Orpheus Deck 1.3 main four-track deck with recorded waveforms',
      title: 'Main Deck',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_03_MainDeck_Recording.jpg',
      alt: 'Orpheus Deck 1.3 main deck while recording a track',
      title: 'Recording',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_04_FourTrack_Sketch.jpg',
      alt: 'Orpheus Deck 1.3 four-track sketch with four acoustic-guitar tracks',
      title: 'Four-Track Sketch',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_05_Chronos_OFX.jpg',
      alt: 'Orpheus Deck 1.3 Advanced Metronome interface labeled CHRONOS O-FX in the app',
      title: 'Advanced Metronome',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_06_Level_Limit.jpg',
      alt: 'Orpheus Deck 1.3 LEVEL controls for gain and peak ceiling',
      title: 'LEVEL',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_07_Edit.jpg',
      alt: 'Orpheus Deck 1.3 EDIT waveform interface',
      title: 'EDIT',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_08_Files_Export.jpg',
      alt: 'Orpheus Deck 1.3 Files and Export choices',
      title: 'Export',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_01_Opening.jpg',
      alt: 'Orpheus Deck 1.3 opening screen',
      title: 'Opening',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_09_Project_Management.jpg',
      alt: 'Orpheus Deck 1.3 project management screen',
      title: 'Project Management',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_10_Guide.jpg',
      alt: 'Orpheus Deck 1.3 in-app Guide screen',
      title: 'Guide',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_11_Settings.jpg',
      alt: 'Orpheus Deck 1.3 Settings screen',
      title: 'Settings',
      width: 1080,
      height: 2104,
    },
    {
      src: '/media/orpheus/screens/OrpheusDeck_1_3_12_Pro.jpg',
      alt: 'Orpheus Deck 1.3 Pro feature screen',
      title: 'Pro',
      width: 1080,
      height: 2104,
    },
  ],
  returnLink: {
    label: 'RETURN TO TECH',
    href: '/tech/',
  },
};
