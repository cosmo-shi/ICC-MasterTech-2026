// Learner model: what Carmen thinks each child can already do, skill by skill.
//
// This is the plug-in point for the live local model a teammate is building. Anything that
// implements `LearnerModel` can be registered with `registerLearnerModel`; the rest of the app
// (pathway, lesson summary, Grown-ups dashboard) only reads `SkillEstimate`s and never changes.
//
// The baseline below is a small Elo-style tracker: each attempt nudges a per-skill estimate
// towards what the checker saw, weighted by how much help was used. It is transparent on
// purpose, so a teacher can see why Carmen suggests something. It describes evidence from
// this device only; it does not grade, diagnose or rank children.

export type SkillId = 'explore' | 'pulse' | 'rests' | 'quavers' | 'direction' | 'note-names' | 'reading' | 'duration' | 'create';

export interface SkillInfo {
  id: SkillId;
  /** Child-facing name. */
  name: string;
  /** Teacher-facing description. */
  teacher: string;
  lessons: string[];
  /** Which checker facts count as evidence for this skill. */
  evidence: 'onset' | 'rest' | 'pitch' | 'duration' | 'any';
  theory: string;
}

export const SKILLS: SkillInfo[] = [
  { id: 'explore', name: 'Making sounds', teacher: 'Explores loud/soft, high/low and different sounds with intent', lessons: ['L00'], evidence: 'any', theory: 'dynamics' },
  { id: 'pulse', name: 'Keeping the beat', teacher: 'Plays in time with a steady pulse', lessons: ['L01'], evidence: 'onset', theory: 'pulse' },
  { id: 'rests', name: 'Leaving a space', teacher: 'Keeps rests silent while holding the pulse', lessons: ['L02', 'L08'], evidence: 'rest', theory: 'rests' },
  { id: 'quavers', name: 'Two sounds in a beat', teacher: 'Plays quaver pairs evenly against the pulse', lessons: ['L03'], evidence: 'onset', theory: 'quavers' },
  { id: 'direction', name: 'Higher and lower', teacher: 'Hears and plays pitch direction', lessons: ['L04'], evidence: 'pitch', theory: 'pitch' },
  { id: 'note-names', name: 'Finding C, D and E', teacher: 'Finds named notes on the keyboard', lessons: ['L05'], evidence: 'pitch', theory: 'note-names' },
  { id: 'reading', name: 'Reading music', teacher: 'Plays a short melody from stave notation', lessons: ['L06', 'L08'], evidence: 'pitch', theory: 'stave' },
  { id: 'duration', name: 'Long and short', teacher: 'Holds notes for their written length (minims, crotchets)', lessons: ['L07', 'L08'], evidence: 'duration', theory: 'note-values' },
  { id: 'create', name: 'Making your own music', teacher: 'Makes and shares original musical ideas', lessons: ['L09'], evidence: 'any', theory: 'form' },
];

export const skillById = (id: SkillId) => SKILLS.find((s) => s.id === id)!;
export const skillsForActivity = (activityId: string): SkillInfo[] => SKILLS.filter((s) => s.lessons.includes(activityId));

/** The parts of an attempt record the learner model may read. Nothing else is shared with it. */
export interface AttemptEvidence {
  activityId: string;
  createdAt: number;
  kind: 'practice' | 'independent' | 'mission' | 'mission-check';
  passed: boolean;
  hintLevel: number;
  summary?: {
    expected: number;
    correctSound: number;
    restViolations: number;
    onTime: number;
    durationOk: number;
    durationIssues: number;
  };
}

export type SkillStatus = 'not-yet' | 'starting' | 'growing' | 'secure';

export interface SkillEstimate {
  skill: SkillId;
  /** 0–1: how likely the child can do this now, from this device's evidence. */
  level: number;
  /** How many attempts this rests on. */
  evidence: number;
  /** Shown on their own, with no hints. */
  independent: boolean;
  status: SkillStatus;
  lastAt?: number;
}

export interface LearnerModel {
  id: string;
  version: string;
  /** 'baseline' = the built-in tracker; 'live' = a plugged-in model. Shown in Grown-ups. */
  kind: 'baseline' | 'live';
  estimate(attempts: AttemptEvidence[]): SkillEstimate[];
}

/** How well an attempt showed this skill, 0–1, or null if it says nothing about it. */
export function observe(skill: SkillInfo, a: AttemptEvidence): number | null {
  const s = a.summary;
  if (skill.evidence === 'any') return 1; // taking part in an open task is the evidence; it is not judged
  if (!s || s.expected === 0) return null;
  switch (skill.evidence) {
    case 'onset':
      return s.onTime / s.expected;
    case 'pitch':
      return s.correctSound / s.expected;
    case 'rest':
      return Math.max(0, 1 - s.restViolations / Math.max(1, Math.ceil(s.expected / 2)));
    case 'duration': {
      const n = s.durationOk + s.durationIssues;
      return n ? s.durationOk / n : null;
    }
  }
}

const PRIOR = 0.25;
const RATE = 0.4;

/** More help means the attempt says less about what the child can do alone. */
function weight(a: AttemptEvidence): number {
  if (a.kind === 'independent' || a.kind === 'mission-check') return 1;
  if (a.hintLevel >= 3) return 0.25;
  if (a.hintLevel === 2) return 0.45;
  return 0.7;
}

function statusOf(level: number, evidence: number, independent: boolean): SkillStatus {
  if (evidence === 0) return 'not-yet';
  if (level >= 0.8 && independent) return 'secure';
  if (level >= 0.5) return 'growing';
  return 'starting';
}

export const baselineLearner: LearnerModel = {
  id: 'carmen-elo-baseline',
  version: '1.0.0',
  kind: 'baseline',
  estimate(attempts) {
    const sorted = [...attempts].sort((x, y) => x.createdAt - y.createdAt);
    return SKILLS.map((skill) => {
      let level = PRIOR;
      let evidence = 0;
      let independent = false;
      let lastAt: number | undefined;
      for (const a of sorted) {
        if (!skill.lessons.includes(a.activityId)) continue;
        const o = observe(skill, a);
        if (o === null) continue;
        level += RATE * weight(a) * (o - level);
        evidence++;
        lastAt = a.createdAt;
        if ((a.kind === 'independent' || a.kind === 'mission-check') && a.passed) independent = true;
      }
      if (skill.evidence === 'any' && evidence > 0) {
        // Open tasks: shown = taking part. Never "growing" or "starting" — there is no wrong answer.
        return { skill: skill.id, level: 1, evidence, independent: true, status: 'secure', lastAt };
      }
      return { skill: skill.id, level, evidence, independent, status: statusOf(level, evidence, independent), lastAt };
    });
  },
};

let current: LearnerModel = baselineLearner;

/** Swap in another learner model (for example the teammate's live local model). */
export function registerLearnerModel(m: LearnerModel | null): void {
  current = m ?? baselineLearner;
}
export const learnerModel = (): LearnerModel => current;

/** Run the current model, falling back to the baseline if a plugged-in model throws or returns nonsense. */
export function estimateSkills(attempts: AttemptEvidence[]): { estimates: SkillEstimate[]; model: LearnerModel; fellBack: boolean } {
  const m = current;
  try {
    const out = m.estimate(attempts);
    const valid = SKILLS.every((s) => out.some((e) => e.skill === s.id && e.level >= 0 && e.level <= 1 && Number.isFinite(e.level)));
    if (valid) return { estimates: out, model: m, fellBack: false };
  } catch {
    /* fall through */
  }
  return { estimates: baselineLearner.estimate(attempts), model: baselineLearner, fellBack: m !== baselineLearner };
}

export interface NextStep {
  activityId: string;
  why: 'start' | 'practise' | 'next' | 'make';
  skill?: SkillId;
}

/**
 * Pick the next step on a route. Practise again when a skill on the route is started but weak
 * after two or more tries; otherwise the first activity whose skill is not yet secure.
 */
export function nextStep(route: string[], estimates: SkillEstimate[]): NextStep {
  const est = (id: SkillId) => estimates.find((e) => e.skill === id);
  for (const id of route) {
    for (const s of skillsForActivity(id)) {
      const e = est(s.id);
      if (e && e.status === 'starting' && e.evidence >= 2) return { activityId: id, why: 'practise', skill: s.id };
    }
  }
  for (const id of route) {
    const ss = skillsForActivity(id);
    const open = ss.find((s) => est(s.id)?.status !== 'secure');
    if (open) return { activityId: id, why: est(open.id)?.evidence ? 'next' : route.indexOf(id) === 0 ? 'start' : 'next', skill: open.id };
  }
  return { activityId: route[route.length - 1], why: 'make' };
}

/** Lesson score, out of 3: 1 = had a go, 2 = matched with practice, 3 = matched on your own. */
export function lessonStars(attempts: AttemptEvidence[], activityId: string): 0 | 1 | 2 | 3 {
  const mine = attempts.filter((a) => a.activityId === activityId);
  if (mine.some((a) => (a.kind === 'independent' || a.kind === 'mission-check') && a.passed)) return 3;
  if (mine.some((a) => a.passed)) return 2;
  return mine.length ? 1 : 0;
}

/** Children who are working on the same skill, for the teacher to group. Only skills started but not secure. */
export function suggestGroups(byChild: { id: string; estimates: SkillEstimate[] }[]): { skill: SkillId; children: string[] }[] {
  const groups: { skill: SkillId; children: string[] }[] = [];
  for (const s of SKILLS) {
    const kids = byChild.filter((c) => {
      const e = c.estimates.find((x) => x.skill === s.id);
      return e && (e.status === 'starting' || e.status === 'growing');
    });
    if (kids.length >= 2) groups.push({ skill: s.id, children: kids.map((k) => k.id) });
  }
  return groups.sort((a, b) => b.children.length - a.children.length);
}
