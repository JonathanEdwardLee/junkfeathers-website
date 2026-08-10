import type { AppGuideConfig, AppSupportConfig } from './appGuide';
import { ORPHEUS_PLAY_STORE_URL } from './appShowcase';

/**
 * Public Guide copy is limited to founder-verified Orpheus 1.3 shared-guide truth.
 * Anything awaiting release verification stays in a `hold` block instead of being written as fact.
 */
export const orpheusDeckGuide: AppGuideConfig = {
  appId: 'orpheus-deck',
  appName: 'ORPHEUS DECK',
  statusStrip: 'ORPHEUS DECK // GUIDE',
  pageTitle: 'Orpheus Deck Guide — Recording, O-FX, Projects & Troubleshooting',
  metaDescription:
    'Learn how to record, overdub, use Orpheus Deck controls, manage projects, understand Free and Pro features, troubleshoot common problems, and contact Junkfeathers.',
  heading: 'ORPHEUS DECK GUIDE',
  lead:
    'How to use the four-track deck, what each control does, and what to check when something sounds wrong. Same machine, same words, now in your browser.',
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
                'Orpheus Deck is a retro four-track recorder for musicians, songwriters, and audio creatives. It is built for getting an idea down quickly without turning recording into a complicated studio session.',
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
      lead: 'Track controls, levels, and the two settings that fix most recording problems.',
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
                "O-FX is Orpheus Deck's family of focused audio tools. Each module should feel like a small machine built into the deck.",
            },
          ],
        },
      ],
      groups: [
        {
          id: 'chronos-o-fx',
          heading: 'CHRONOS O-FX',
          state: 'held',
          lead: "Chronos O-FX is Orpheus Deck's timing and click module.",
          hold: {
            note:
              'Detailed Chronos O-FX control help is held until the final Orpheus 1.3 behavior is confirmed. It will be published here rather than guessed at now.',
          },
        },
        {
          id: 'level-limit',
          heading: 'LEVEL AND LIMIT',
          state: 'active',
          entries: [
            {
              id: 'how-do-i-use-level',
              question: 'How do I use LEVEL?',
              blocks: [
                {
                  kind: 'paragraph',
                  text:
                    "LEVEL is Orpheus Deck's manual mastering and output tool. Use it to make the finished mix louder, control peaks, or deliberately push the sound.",
                },
              ],
            },
            {
              id: 'what-does-gain-do',
              question: 'What does GAIN do?',
              blocks: [
                {
                  kind: 'paragraph',
                  text:
                    'Raise GAIN to increase output level. Higher gain can also create deliberate drive or distortion when pushed into the limit.',
                },
              ],
            },
            {
              id: 'how-does-limit-work',
              question: 'How does LIMIT work?',
              blocks: [
                {
                  kind: 'paragraph',
                  text:
                    'LIMIT sets the peak ceiling. Lowering the dB limit gives the output less room before it is capped. Use GAIN and LIMIT together: raise GAIN for loudness or character, then choose the ceiling that keeps peaks where you want them.',
                },
              ],
            },
            {
              id: 'free-peak-master-choices',
              question: 'Which Peak Master choices are available for free?',
              blocks: [
                { kind: 'list', items: ['-3 dB', '-2 dB', '-1 dB', '-0.5 dB'] },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'edit',
      navLabel: 'EDIT',
      heading: 'EDIT',
      state: 'held',
      hold: {
        note:
          'EDIT help is held until the final Orpheus 1.3 editing behavior is confirmed. These are the questions this section will answer.',
        pendingQuestions: [
          'How do I edit a recording?',
          'How do I highlight a section?',
          'How do I make a CUT?',
          'How do I undo a cut?',
          'Does editing change my original recording?',
        ],
      },
    },
    {
      id: 'files-projects',
      navLabel: 'FILES / PROJECTS',
      heading: 'FILES / PROJECTS',
      state: 'active',
      lead: 'Where songs live and where recordings stay.',
      entries: [
        {
          id: 'how-do-i-manage-projects',
          question: 'How do I manage projects?',
          blocks: [
            {
              kind: 'paragraph',
              text: 'Use PROJECTS to create, open, and manage song projects.',
            },
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
      ],
      hold: {
        note:
          'Import and export details, including the exact Free and Pro export choices and file-format specifics, are held until Orpheus 1.3 release verification.',
      },
    },
    {
      id: 'free-pro',
      navLabel: 'FREE + PRO',
      heading: 'FREE + PRO',
      state: 'active',
      lead: 'What the free recorder does, and what Pro adds on top of it.',
      entries: [
        {
          id: 'do-i-need-pro-to-record',
          question: 'Do I need Pro to record?',
          blocks: [
            { kind: 'paragraph', text: 'No. The core four-track recorder is free.' },
          ],
        },
        {
          id: 'what-does-orpheus-pro-add',
          question: 'What does Orpheus Pro add?',
          blocks: [
            {
              kind: 'list',
              items: [
                'Import WAV files.',
                'One-tap all-track WAV export.',
                'Track name templates.',
              ],
            },
          ],
        },
      ],
      hold: {
        note:
          'Subscription management instructions are held until a verified Google Play management path is approved for publication.',
      },
    },
    {
      id: 'privacy-using-the-app',
      navLabel: 'PRIVACY / USING THE APP',
      heading: 'PRIVACY / USING THE APP',
      state: 'active',
      lead: 'What Orpheus Deck does and does not do with your recordings.',
      entries: [
        {
          id: 'does-orpheus-contain-ads',
          question: 'Does Orpheus Deck contain ads?',
          blocks: [{ kind: 'paragraph', text: 'No. There are no ads.' }],
        },
        {
          id: 'do-i-need-an-account',
          question: 'Do I need an account to use Orpheus Deck?',
          blocks: [
            {
              kind: 'paragraph',
              text: 'No account or special sign-in is required.',
            },
          ],
        },
        {
          id: 'does-orpheus-upload-my-recordings',
          question: 'Does Orpheus upload my recordings?',
          blocks: [
            {
              kind: 'paragraph',
              text: 'Orpheus does not automatically upload your recordings.',
            },
          ],
        },
        {
          id: 'does-orpheus-track-me',
          question: 'Does Orpheus Deck track me?',
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
      hold: {
        note:
          'Detailed permission and offline answers are held until final Orpheus 1.3 technical and privacy wording is verified.',
      },
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
            {
              kind: 'paragraph',
              text: 'Open SETTINGS and review the latency adjustment.',
            },
          ],
        },
      ],
      hold: {
        note:
          'Click-level and import/export troubleshooting are held until final Orpheus 1.3 behavior is verified.',
      },
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
