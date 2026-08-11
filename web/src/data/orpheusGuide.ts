import type { AppGuideConfig, AppSupportConfig } from './appGuide';
import { ORPHEUS_PLAY_STORE_URL } from './appShowcase';

export const orpheusDeckGuide: AppGuideConfig = {
  appId: 'orpheus-deck',
  appName: 'ORPHEUS DECK',
  statusStrip: 'ORPHEUS DECK 1.3 // GUIDE',
  pageTitle: 'Orpheus Deck Guide — Recording, O-FX, Projects & Troubleshooting',
  metaDescription:
    'Learn Orpheus Deck 1.3 recording, Advanced Metronome, LEVEL, EDIT, project, export, privacy, and troubleshooting basics.',
  heading: 'ORPHEUS DECK GUIDE',
  lead:
    'How to use the four-track deck, what each shipped control does, and what to check when something sounds wrong.',
  showcaseLink: { label: 'ORPHEUS DECK', href: '/orpheus-deck/' },
  supportLink: { label: 'CONTACT', href: '/orpheus-deck/support/' },
  storeAction: {
    label: 'GOOGLE PLAY',
    href: ORPHEUS_PLAY_STORE_URL,
    analyticsEvent: 'orpheus_get_click',
  },
  sections: [
    {
      id: 'start-here',
      navLabel: 'START HERE',
      heading: 'START HERE',
      state: 'active',
      lead: 'The short path from an empty deck to a four-track recording.',
      entries: [
        {
          id: 'what-is-orpheus-deck',
          question: 'What is Orpheus Deck?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Orpheus Deck 1.3 is a retro four-track Android recorder for musicians, songwriters, and audio creatives. It is built for getting an idea down quickly without turning recording into a complicated studio session.',
            },
          ],
        },
        {
          id: 'create-a-project',
          question: 'How do I create a project?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Open PROJECTS, create a project, give it a name, and open it. A project keeps the recordings and settings for that song together.',
            },
          ],
        },
        {
          id: 'record-my-first-track',
          question: 'How do I record my first track?',
          blocks: [
            {
              kind: 'steps',
              items: [
                'Open a project.',
                'Choose the track you want to record.',
                'Turn ARM on for that track.',
                'Press RECORD and play.',
                'Press STOP when you are finished.',
                'Play it back and adjust the track volume.',
              ],
            },
          ],
        },
        {
          id: 'record-multiple-tracks',
          question: 'How do I record multiple tracks or overdub?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Leave the tracks you want to hear available for playback, ARM the new track, then record while the existing tracks play. Repeat until you have built your four-track recording.',
            },
          ],
        },
        {
          id: 'play-back-and-balance',
          question: 'How do I play back and balance a recording?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                "Use each track's volume control to set the balance. MUTE hides a track from playback without deleting it. SOLO lets you hear a track by itself.",
            },
          ],
        },
      ],
    },
    {
      id: 'recording',
      navLabel: 'RECORDING',
      heading: 'RECORDING',
      state: 'active',
      lead: 'Four mono tracks, deck controls, recording levels, and timing.',
      entries: [
        {
          id: 'arm-mute-solo-fx',
          question: 'How do ARM, MUTE, SOLO, and FX work?',
          blocks: [
            {
              kind: 'list',
              items: [
                'ARM — chooses the track that will record.',
                'MUTE — silences the track without deleting it.',
                'SOLO — lets you hear that track by itself.',
                "FX — opens the track's available O-FX tools.",
              ],
            },
          ],
        },
        {
          id: 'recording-format',
          question: 'What format does Orpheus record?',
          blocks: [
            {
              kind: 'paragraph',
              text: 'Orpheus Deck records a four-track mono workflow as 48 kHz PCM16 WAV audio.',
            },
          ],
        },
        {
          id: 'recording-levels',
          question: 'How do I set recording and playback levels?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'If a recording is too quiet, raise the appropriate recording or track level gradually. If it is too loud or distorted when you do not want distortion, lower the level. Make level changes in small steps and listen again.',
            },
          ],
        },
        {
          id: 'headphones-for-overdubbing',
          question: 'Should I use headphones when overdubbing?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Headphones are recommended while overdubbing because they help keep playback from coming back through the phone speaker and into the new recording.',
            },
          ],
        },
        {
          id: 'wrong-microphone-or-timing',
          question: 'What if Orpheus uses the wrong microphone, or the timing feels off?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'If Orpheus is using the wrong microphone, or recorded audio feels early or late against playback, open SETTINGS. Microphone selection and latency adjustment live there.',
            },
          ],
        },
      ],
    },
    {
      id: 'o-fx',
      navLabel: 'O-FX',
      heading: 'O-FX',
      state: 'active',
      lead: "Orpheus Deck's family of focused audio tools.",
      entries: [
        {
          id: 'what-is-o-fx',
          question: 'What is O-FX?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'O-FX is the deck family that contains shipped tools including the Advanced Metronome and LEVEL. The visible metronome machine may say CHRONOS O-FX inside the app.',
            },
          ],
        },
      ],
      groups: [
        {
          id: 'chronos-o-fx',
          heading: 'ADVANCED METRONOME',
          state: 'active',
          lead: 'Timing choices in Orpheus Deck 1.3, split clearly between Free and Pro.',
          entries: [
            {
              id: 'advanced-metronome-free',
              question: 'What does the Free Advanced Metronome include?',
              blocks: [
                {
                  kind: 'list',
                  items: ['4/4', 'Tap Tempo', 'Count In', 'base Sound', 'Accent Sound'],
                },
                {
                  kind: 'image',
                  src: '/media/orpheus/screens/OrpheusDeck_1_3_05_Chronos_OFX.jpg',
                  alt: 'Orpheus Deck 1.3 Advanced Metronome interface labeled CHRONOS O-FX in the app',
                  caption: 'Advanced Metronome / CHRONOS O-FX interface',
                  width: 1080,
                  height: 2104,
                },
              ],
            },
            {
              id: 'advanced-metronome-pro',
              question: 'What does Pro add to the Advanced Metronome?',
              blocks: [
                {
                  kind: 'list',
                  items: ['3/4', '6/8', '5/4', '7/8', 'Groove'],
                },
              ],
            },
          ],
        },
        {
          id: 'level-limit',
          heading: 'LEVEL',
          state: 'active',
          lead: 'LEVEL remains Free forever.',
          entries: [
            {
              id: 'how-do-i-use-level',
              question: 'How do I use LEVEL?',
              blocks: [
                {
                  kind: 'paragraph',
                  text:
                    'Use LEVEL to set output gain and the peak ceiling used when rendering a Master Mix. Master Mix is an export render, not a permanent mastered playback mode.',
                },
                {
                  kind: 'image',
                  src: '/media/orpheus/screens/OrpheusDeck_1_3_06_Level_Limit.jpg',
                  alt: 'Orpheus Deck 1.3 LEVEL controls for gain and peak ceiling',
                  caption: 'LEVEL gain and peak-ceiling controls',
                  width: 1080,
                  height: 2104,
                },
              ],
            },
            {
              id: 'what-does-gain-do',
              question: 'What does GAIN do?',
              blocks: [
                {
                  kind: 'paragraph',
                  text: 'Raise GAIN to increase the output level used for the Master Mix render.',
                },
              ],
            },
            {
              id: 'how-does-limit-work',
              question: 'How does LIMIT work?',
              blocks: [
                {
                  kind: 'paragraph',
                  text: 'LIMIT sets the peak ceiling used for the Master Mix export render.',
                },
              ],
            },
            {
              id: 'free-peak-master-choices',
              question: 'Which Peak Master choices are available for free?',
              blocks: [{ kind: 'list', items: ['-3 dB', '-2 dB', '-1 dB', '-0.5 dB'] }],
            },
          ],
        },
      ],
    },
    {
      id: 'edit',
      navLabel: 'EDIT',
      heading: 'EDIT',
      state: 'active',
      lead: 'Browse waveforms for free; Pro unlocks non-destructive CUT.',
      entries: [
        {
          id: 'how-do-i-edit-a-recording',
          question: 'What can I do in EDIT?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'EDIT provides waveform browsing with ZOOM and SCROLL. Pro unlocks CUT for non-destructive edit decisions.',
            },
            {
              kind: 'image',
              src: '/media/orpheus/screens/OrpheusDeck_1_3_07_Edit.jpg',
              alt: 'Orpheus Deck 1.3 EDIT waveform interface',
              caption: 'EDIT waveform interface',
              width: 1080,
              height: 2104,
            },
          ],
        },
        {
          id: 'how-do-i-make-a-cut',
          question: 'How does CUT work?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'CUT is a Pro feature. Cuts are stored as metadata instead of changing the original recorded audio. You can make multiple cuts; each cut becomes a silent gap and does not ripple later audio earlier.',
            },
          ],
        },
        {
          id: 'does-edit-change-my-original-recording',
          question: 'Does EDIT change my original recording?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'No. CUT is non-destructive and metadata-based. EDIT POWER bypasses the current cuts so you can compare the uncut playback, then reapplies them when turned back on.',
            },
          ],
        },
        {
          id: 'how-do-i-undo-a-cut',
          question: 'How do I undo or clear cuts?',
          blocks: [
            {
              kind: 'list',
              items: [
                'UNDO CUT reverses the latest cut.',
                'CLEAR CUTS removes the current edit decisions.',
                'EDIT POWER bypasses or reapplies the current cut layout.',
              ],
            },
          ],
        },
        {
          id: 'how-does-undo-rec-work',
          question: 'What does UNDO REC restore?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'One-level UNDO REC restores the prior recording or clip state together with its prior cut layout.',
            },
          ],
        },
        {
          id: 'edit-end-limitation',
          question: 'Can CUT land exactly at the end of a recording?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'CUT placement in the extreme end or final second can be awkward. Orpheus Deck does not claim perfect sample-end trimming.',
            },
          ],
        },
      ],
    },
    {
      id: 'files-projects',
      navLabel: 'FILES / PROJECTS',
      heading: 'FILES / PROJECTS',
      state: 'active',
      lead: 'Where songs live, how audio is stored, and what each export choice does.',
      entries: [
        {
          id: 'how-do-i-manage-projects',
          question: 'How do I manage projects?',
          blocks: [
            { kind: 'paragraph', text: 'Use PROJECTS to create, open, and manage song projects.' },
          ],
        },
        {
          id: 'where-are-my-recordings',
          question: 'Where are my recordings?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Orpheus is local-first. Projects and recordings stay on the device unless you intentionally export or share them. Orpheus does not automatically upload your recordings.',
            },
          ],
        },
        {
          id: 'what-audio-format-does-orpheus-use',
          question: 'What audio format does Orpheus use?',
          blocks: [
            {
              kind: 'paragraph',
              text: 'The deck records four-track mono audio as 48 kHz PCM16 WAV.',
            },
          ],
        },
        {
          id: 'what-can-i-import',
          question: 'Can I import a WAV file?',
          blocks: [{ kind: 'paragraph', text: 'Yes. Import WAV is a Pro feature.' }],
        },
        {
          id: 'what-can-i-export',
          question: 'What can I export?',
          blocks: [
            {
              kind: 'list',
              items: [
                'Raw Mix — Free',
                'Master Mix — Free',
                'Export All Tracks — Pro',
              ],
            },
            {
              kind: 'paragraph',
              text:
                'Master Mix applies a peak ceiling during the export render. It is not a permanent mastered playback mode.',
            },
            {
              kind: 'image',
              src: '/media/orpheus/screens/OrpheusDeck_1_3_08_Files_Export.jpg',
              alt: 'Orpheus Deck 1.3 Files and Export choices',
              caption: 'Files and Export choices',
              width: 1080,
              height: 2104,
            },
          ],
        },
      ],
    },
    {
      id: 'free-pro',
      navLabel: 'FREE + PRO',
      heading: 'FREE + PRO',
      state: 'active',
      lead: 'The free four-track deck and the optional Pro additions in release 1.3.',
      entries: [
        {
          id: 'do-i-need-pro-to-record',
          question: 'Do I need Pro to record?',
          blocks: [
            { kind: 'paragraph', text: 'No. The core four-track mono recorder and LEVEL are free.' },
          ],
        },
        {
          id: 'what-is-included-free',
          question: 'What is included for Free?',
          blocks: [
            {
              kind: 'list',
              items: [
                'Four-track mono recording and playback',
                'LEVEL',
                'Raw Mix export',
                'Master Mix export',
                'EDIT waveform browsing with ZOOM and SCROLL',
                'Advanced Metronome 4/4',
                'Tap Tempo',
                'Count In',
                'base Sound',
                'Accent Sound',
              ],
            },
          ],
        },
        {
          id: 'what-does-orpheus-pro-add',
          question: 'What does Orpheus Pro add?',
          blocks: [
            {
              kind: 'list',
              items: [
                'Import WAV',
                'Export All Tracks',
                'Track-name templates',
                'Non-destructive EDIT CUT',
                'Advanced Metronome meters 3/4, 6/8, 5/4, and 7/8',
                'Groove',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'privacy-using-the-app',
      navLabel: 'PRIVACY / USING THE APP',
      heading: 'PRIVACY / USING THE APP',
      state: 'active',
      lead: 'What Orpheus Deck does and does not do with app and recording data.',
      entries: [
        {
          id: 'does-orpheus-contain-ads',
          question: 'Does Orpheus Deck contain ads?',
          blocks: [{ kind: 'paragraph', text: 'No. There are no ads.' }],
        },
        {
          id: 'do-i-need-an-account',
          question: 'Do I need an account to use Orpheus Deck?',
          blocks: [{ kind: 'paragraph', text: 'No account or special sign-in is required.' }],
        },
        {
          id: 'does-orpheus-upload-my-recordings',
          question: 'Does Orpheus upload my recordings?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Projects and recordings are local-first. Orpheus does not automatically upload your recordings.',
            },
          ],
        },
        {
          id: 'does-orpheus-track-me',
          question: 'Does Orpheus Deck collect or share my data?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'The current Google Play Data Safety entry says the app does not collect or share user data. Advertising ID is not used.',
            },
            {
              kind: 'links',
              items: [
                { label: 'ORPHEUS DECK PRIVACY POLICY', href: '/orpheus-deck-privacy-policy/' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'troubleshooting',
      navLabel: 'TROUBLESHOOTING',
      heading: 'TROUBLESHOOTING',
      state: 'active',
      lead: 'Check these first when the deck is not doing what you expect.',
      entries: [
        {
          id: 'orpheus-cant-hear-my-microphone',
          question: "Why can't Orpheus hear my microphone?",
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Check the Android microphone permission, then open SETTINGS and confirm the intended microphone is selected.',
            },
          ],
        },
        {
          id: 'i-cant-hear-playback',
          question: "Why can't I hear playback?",
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Check phone or headphone volume, track volume, MUTE and SOLO state, and the active output path. If the problem continues, report the project type and what you expected to hear.',
            },
            {
              kind: 'links',
              items: [{ label: 'REPORT IT', href: '/orpheus-deck/support/' }],
            },
          ],
        },
        {
          id: 'my-recording-feels-early-or-late',
          question: 'Why does my recording feel early or late?',
          blocks: [
            { kind: 'paragraph', text: 'Open SETTINGS and review the latency adjustment.' },
          ],
        },
        {
          id: 'cut-is-not-available',
          question: 'Why is CUT not available?',
          blocks: [{ kind: 'paragraph', text: 'Non-destructive EDIT CUT is a Pro feature.' }],
        },
        {
          id: 'master-mix-playback-different',
          question: 'Why does the Master Mix export differ from deck playback?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Master Mix applies the selected peak ceiling during export. It is an export render, not a permanent mastered playback mode.',
            },
          ],
        },
      ],
    },
    {
      id: 'support',
      navLabel: 'SUPPORT',
      heading: 'SUPPORT',
      state: 'active',
      lead: 'If the answer is not here, tell me directly.',
      entries: [
        {
          id: 'how-do-i-contact-junkfeathers',
          question: 'How do I contact Junkfeathers about Orpheus Deck?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                'Open the Orpheus Deck support channel. Report a bug, ask a question, or just say hi — it all goes to the same secure channel.',
            },
            {
              kind: 'links',
              items: [{ label: 'ORPHEUS DECK SUPPORT', href: '/orpheus-deck/support/' }],
            },
          ],
        },
      ],
    },
    {
      id: 'about-junkfeathers',
      navLabel: 'ABOUT JUNKFEATHERS',
      heading: 'ABOUT JUNKFEATHERS',
      state: 'active',
      entries: [
        {
          id: 'who-makes-orpheus-deck',
          question: 'Who makes Orpheus Deck?',
          blocks: [
            {
              kind: 'paragraph',
              text:
                "Orpheus Deck is made by Junkfeathers Tech — strange music technology built with a musician's point of view.",
            },
            {
              kind: 'links',
              items: [
                { label: 'JUNKFEATHERS TECH', href: '/tech/' },
                {
                  label: 'JUNKFEATHERS TECH ON YOUTUBE',
                  href: 'https://www.youtube.com/@JunkfeathersTech',
                  external: true,
                },
                { label: 'MUSIC ARCHIVE', href: '/music/archive/' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const orpheusDeckSupport: AppSupportConfig = {
  appId: 'orpheus-deck',
  appName: 'ORPHEUS DECK',
  statusStrip: 'ORPHEUS DECK // SUPPORT',
  pageTitle: 'Orpheus Deck Support — Report a Bug, Ask a Question, Say Hi',
  metaDescription:
    'Contact Junkfeathers about Orpheus Deck. Report a bug, ask a question about recording or O-FX, or just say hi through the secure Junkfeathers contact channel.',
  heading: 'ORPHEUS DECK SUPPORT',
  lead:
    'Bugs, questions, or just hello — all of it is welcome here, and all of it reaches me through the same secure Junkfeathers channel.',
  intentsHeading: 'WHAT YOU CAN WRITE ABOUT',
  intents: [
    {
      id: 'report-a-bug',
      label: 'REPORT A BUG',
      summary: 'Something behaved wrong, stopped, or sounded broken.',
      hints: [
        'What you were doing when it happened.',
        'What you expected to hear, and what happened instead.',
        'Your Android version and phone model, if you know them.',
      ],
    },
    {
      id: 'ask-a-question',
      label: 'ASK A QUESTION',
      summary: 'You want to know how something works.',
      hints: [
        'Which part of the deck you are asking about.',
        'What you are trying to record or finish.',
      ],
    },
    {
      id: 'say-hi',
      label: 'SAY HI',
      summary: 'Feedback, an idea, or a song you made with the deck.',
      hints: ['Anything you want to tell me.'],
    },
  ],
  contactActionLabel: 'OPEN CONTACT CHANNEL',
  channelNote:
    'One channel handles all of it. Put the reason at the top of your message and it lands in the right place.',
  subscriptionNote:
    'Sending a message does not subscribe you to updates. Subscribing is a separate, clearly marked choice.',
  guideLink: { label: 'ORPHEUS DECK GUIDE', href: '/orpheus-deck/guide/' },
  showcaseLink: { label: 'ORPHEUS DECK', href: '/orpheus-deck/' },
  privacyLink: { label: 'PRIVACY POLICY', href: '/orpheus-deck-privacy-policy/' },
  storeAction: {
    label: 'GOOGLE PLAY',
    href: ORPHEUS_PLAY_STORE_URL,
    analyticsEvent: 'orpheus_get_click',
  },
};
