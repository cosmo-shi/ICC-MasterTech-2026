// Content catalogue: the ten foundation lessons plus the five pathways (F, 1–2, 3–4, 5–6, Older).
// All content is draft, pending review by a qualified primary music educator.

import seed from './lessons.seed.json';
import plan from './pathways.plan.json';
import { parseLessons, type Lesson } from '../music/lessons.ts';
import type { PathwayId } from '../state/prefs.tsx';
import type { Operation } from '../ai/reply.ts';

export const LESSONS: Lesson[] = parseLessons(seed);
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);

export interface Pathway {
  id: PathwayId;
  label: string;
  short: string;
  tone: 'coral' | 'sunflower' | 'mint' | 'lilac' | 'paper';
  invitation: string;
  recommended: string[];
  missionId: string;
  defaultTempo: number;
  showNotationByDefault: boolean;
  words: 'few' | 'some' | 'more';
  curriculumCodes: string[];
}

export interface Mission {
  id: string;
  band: string;
  title: string;
  objective: string;
  operation: Operation;
  instruments: ('keyboard' | 'drums')[];
  learnerControl: string;
  steps: string[];
  independentEvidence: string;
  doNotInfer: string;
  contextActivity: string;
  goalId: string;
}

const MISSION_TITLES: Record<string, string> = {
  F_SOUND_STORY: 'Loud and soft sound story',
  P12_RHYTHMIC_CONVERSATION: 'Rhythm conversation',
  P34_MELODIC_REPLY: 'Melody reply',
  P56_FORM_AND_TEXTURE: 'Build a piece: A and B',
  OLDER_EXTENSION: 'Arrange with a partner part',
};

export const MISSIONS: Mission[] = plan.missions.map((m) => ({
  id: m.id,
  band: m.band,
  title: MISSION_TITLES[m.id] ?? m.id,
  objective: m.objective,
  operation: m.operation as Operation,
  instruments: m.instruments as ('keyboard' | 'drums')[],
  learnerControl: m.learnerControl,
  steps: m.steps,
  independentEvidence: m.independentEvidence,
  doNotInfer: m.doNotInfer,
  contextActivity: m.contextActivity,
  goalId: m.goalId,
}));
export const missionById = (id: string) => MISSIONS.find((m) => m.id === id);

const codes = (band: string) => (plan.bands.find((b) => b.id === band)?.codes ?? []) as string[];

export const PATHWAYS: Pathway[] = [
  {
    id: 'F',
    label: 'Foundation',
    short: 'F',
    tone: 'coral',
    invitation: 'Make sounds loud and soft, and tell a sound story.',
    recommended: ['L00', 'L01', 'L04'],
    missionId: 'F_SOUND_STORY',
    defaultTempo: 70,
    showNotationByDefault: false,
    words: 'few',
    curriculumCodes: codes('F'),
  },
  {
    id: '1-2',
    label: 'Years 1–2',
    short: '1–2',
    tone: 'sunflower',
    invitation: 'Find the beat, leave a space, and have a rhythm conversation.',
    recommended: ['L01', 'L02', 'L03'],
    missionId: 'P12_RHYTHMIC_CONVERSATION',
    defaultTempo: 80,
    showNotationByDefault: true,
    words: 'few',
    curriculumCodes: codes('1-2'),
  },
  {
    id: '3-4',
    label: 'Years 3–4',
    short: '3–4',
    tone: 'mint',
    invitation: 'Meet C, D and E, read a small melody, and answer it higher or lower.',
    recommended: ['L04', 'L05', 'L06'],
    missionId: 'P34_MELODIC_REPLY',
    defaultTempo: 80,
    showNotationByDefault: true,
    words: 'some',
    curriculumCodes: codes('3-4'),
  },
  {
    id: '5-6',
    label: 'Years 5–6',
    short: '5–6',
    tone: 'lilac',
    invitation: 'Hold long notes, read with rests, and shape a piece from two ideas.',
    recommended: ['L07', 'L08', 'L09'],
    missionId: 'P56_FORM_AND_TEXTURE',
    defaultTempo: 90,
    showNotationByDefault: true,
    words: 'more',
    curriculumCodes: codes('5-6'),
  },
  {
    id: 'older',
    label: 'Older learners',
    short: '7+',
    tone: 'paper',
    invitation: 'Arrange your own music, compare a partner part, and defend your choice.',
    recommended: ['L06', 'L08', 'L09'],
    missionId: 'OLDER_EXTENSION',
    defaultTempo: 100,
    showNotationByDefault: true,
    words: 'more',
    curriculumCodes: [],
  },
];
export const pathwayById = (id: PathwayId | null) => PATHWAYS.find((p) => p.id === id);

/** One short, learner-facing line per activity. The formal objective stays in Grown-ups. */
const BLURBS: Record<string, string> = {
  L00: 'Make a sound, change it, stop it.',
  L01: 'Tap a steady beat.',
  L02: 'Play, then leave a quiet gap.',
  L03: 'One sound or two in each beat.',
  L04: 'Is the next note higher or lower?',
  L05: 'Find C, D and E on the keys.',
  L06: 'Read three notes and play them.',
  L07: 'Hold a note for longer.',
  L08: 'Read two bars with a rest.',
  L09: 'Make up an answer to a tune.',
  F_SOUND_STORY: 'Tell a story with loud and soft.',
  P12_RHYTHMIC_CONVERSATION: 'Swap rhythms with a partner.',
  P34_MELODIC_REPLY: 'Play a tune. Carmen answers higher or lower.',
  P56_FORM_AND_TEXTURE: 'Make part A and part B, then pick the order.',
  OLDER_EXTENSION: 'Add a partner part and decide what works.',
};
export const blurb = (id: string, fallback: string) => BLURBS[id] ?? fallback;
