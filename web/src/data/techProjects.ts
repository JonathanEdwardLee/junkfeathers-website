export type TechProjectId =
  | 'orpheus'
  | 'ofx'
  | 'chronos'
  | 'agora'
  | 'ichor'
  | 'syrinx'
  | 'ostracon'
  | 'archimedes';

export interface TechProjectAction {
  label: string;
  href?: string;
  external?: boolean;
  disabled?: boolean;
  style: 'primary' | 'secondary';
}

export interface TechProject {
  id: TechProjectId;
  name: string;
  selector: string;
  type: string;
  description: string;
  status: string;
  family?: 'orpheus';
  actions: TechProjectAction[];
}

export const techProjects: TechProject[] = [
  {
    id: 'orpheus',
    name: 'Orpheus Deck',
    selector: 'ORPHEUS',
    type: 'ANDROID MUSIC APP',
    description: 'A private four-track recorder for capturing, arranging, editing, and processing musical ideas.',
    status: 'AVAILABLE NOW',
    family: 'orpheus',
    actions: [
      {
        label: 'GET ORPHEUS',
        href: 'https://play.google.com/store/apps/details?id=com.junkfeathers.orpheusdeck&hl=en_US',
        external: true,
        style: 'primary',
      },
      {
        label: 'VIEW PROJECT',
        href: '/orpheus-deck/',
        style: 'secondary',
      },
    ],
  },
  {
    id: 'ofx',
    name: 'O-FX',
    selector: 'O-FX',
    type: 'AUDIO EFFECT SYSTEM',
    description: 'A modular family of musician-focused effects built into Orpheus Deck.',
    status: 'BUILT INTO ORPHEUS',
    family: 'orpheus',
    actions: [
      {
        label: 'OPEN ORPHEUS',
        href: '/orpheus-deck/',
        style: 'primary',
      },
      {
        label: 'EXPLORE O-FX',
        disabled: true,
        style: 'secondary',
      },
    ],
  },
  {
    id: 'chronos',
    name: 'Chronos',
    selector: 'CHRONOS',
    type: 'PHYSICAL MUSIC TECHNOLOGY',
    description: 'A tactile BPM clock that gives electronic instruments a dependable hands-on tempo source.',
    status: 'WORKING PROTOTYPE',
    actions: [
      { label: 'VIEW PROTOTYPE', disabled: true, style: 'primary' },
      { label: 'MORE INFO', disabled: true, style: 'secondary' },
    ],
  },
  {
    id: 'agora',
    name: 'The Local Agora',
    selector: 'AGORA',
    type: 'LOCAL EVENT WEB APP',
    description: 'A text-first local event finder without social-media clutter.',
    status: 'PUBLIC EXPERIMENT',
    actions: [
      { label: 'OPEN AGORA', disabled: true, style: 'primary' },
      { label: 'MORE INFO', disabled: true, style: 'secondary' },
    ],
  },
  {
    id: 'ichor',
    name: 'Ichor Nine',
    selector: 'ICHOR IX',
    type: 'MODULAR SYNTHESIZER',
    description: 'A premium modular synthesizer designed to behave like a real playable instrument.',
    status: 'FUTURE INSTRUMENT',
    actions: [{ label: 'NO PUBLIC LINK', disabled: true, style: 'secondary' }],
  },
  {
    id: 'syrinx',
    name: 'Syrinx',
    selector: 'SYRINX',
    type: 'MUSICAL CALCULATOR',
    description: 'A retro practice instrument for exploring scales, chords, melodies, and musical relationships.',
    status: 'FUTURE APP',
    actions: [{ label: 'NO PUBLIC LINK', disabled: true, style: 'secondary' }],
  },
  {
    id: 'ostracon',
    name: 'Ostracon',
    selector: 'OSTRACON',
    type: 'FIELD INVENTORY APP',
    description: 'A fast local-first counter for merchandise, instruments, equipment, and small crews.',
    status: 'FUTURE APP',
    actions: [{ label: 'NO PUBLIC LINK', disabled: true, style: 'secondary' }],
  },
  {
    id: 'archimedes',
    name: 'Archimedes',
    selector: 'ARCHIMEDES',
    type: 'PHYSICAL TECHNOLOGY',
    description: 'An AI-assisted flying familiar envisioned as a strange robotic companion.',
    status: 'FUTURE MACHINE',
    actions: [{ label: 'SHOP', disabled: true, style: 'secondary' }],
  },
];
