/// <reference types="node" />
// Keeps docs/CURRICULUM_MATRIX.md in step with the content. The matrix is generated from the
// activity list, the lesson data and the pathway plan; this test fails if the file is stale.
// Regenerate: UPDATE_MATRIX=1 npx vitest run src/data/matrix.test.ts
import { guidedById } from './guided.ts';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import plan from './pathways.plan.json';
import { LESSONS, MISSIONS, PATHWAYS, lessonById, missionById } from './catalog.ts';
import { ACTIVITIES, TRACKS } from './curriculum.ts';

const FILE = new URL('../../docs/CURRICULUM_MATRIX.md', import.meta.url).pathname;

function statusOf(raw: string | undefined): 'Draft' | 'Reviewed' | 'Validated' {
  if (raw && /validated/i.test(raw)) return 'Validated';
  if (raw && /^reviewed|approved/i.test(raw)) return 'Reviewed';
  return 'Draft';
}

function checks(id: string): string {
  const l = lessonById(id);
  if (!l) return missionById(id) ? 'Completion and the learner’s own choices; not marked' : 'n/a';
  const a = l.assessment;
  if (!a.score) return 'Described, not marked';
  return [a.checkPitch && 'which sound or note', a.checkTiming && 'timing against the beat', a.checkDuration && 'note length', a.checkRestViolations && 'silence in rests'].filter(Boolean).join(', ') || 'Completion';
}

function build(): string {
  const bandsFor = (id: string) => PATHWAYS.filter((p) => p.recommended.includes(id) || p.missionId === id).map((p) => p.short);
  const rows = ACTIVITIES.map((a) => {
    const l = lessonById(a.id);
    const m = missionById(a.id);
    const track = TRACKS.find((t) => t.id === a.track)!.name;
    const g = guidedById(a.id);
    const evidence = g ? 'One mini-check by listening; marks the concept as explored, not mastered' : a.kind === 'project' ? (m?.independentEvidence ?? 'Finished piece') : l?.independent ? 'Practice, then a different pattern on their own with hints hidden' : l?.assessment.score ? 'Practice only (no on-your-own pattern yet)' : 'Exploration; nothing is marked';
    const bands = bandsFor(a.id);
    return `| ${a.id} | ${g?.title ?? l?.title ?? m?.title ?? a.id} | ${track} | ${a.learn} | ${a.level} | ${a.reading} | ${a.input} | ${checks(a.id)} | ${evidence} | ${bands.length ? bands.join(', ') : 'none'} | ${statusOf(l?.reviewStatus)} |`;
  });
  const bandRows = plan.bands.map((b) => {
    const p = PATHWAYS.find((x) => x.id === b.id);
    return `| ${b.label} | ${b.codes.join(', ')} | ${b.focus.join('; ')} | ${p ? [...p.recommended, p.missionId].join(', ') : ''} | Draft |`;
  });
  const counts = { Draft: 0, Reviewed: 0, Validated: 0 };
  for (const a of ACTIVITIES) counts[statusOf(lessonById(a.id)?.reviewStatus ?? (guidedById(a.id) ? 'draft' : undefined))]++;
  return `# Carmen curriculum coverage matrix

Generated from \`src/data/curriculum.ts\`, the lesson files and \`src/data/pathways.plan.json\` by
\`src/data/matrix.test.ts\`. Do not edit by hand; change the content and regenerate
(\`UPDATE_MATRIX=1 npx vitest run src/data/matrix.test.ts\`).

## What the status words mean

- **Draft**: written for the prototype. Not checked by a primary music educator. Not for claims.
- **Reviewed**: a named primary music educator has checked the musical content, the sequence and
  the wording, and their name and date are recorded in the lesson's \`reviewStatus\`.
- **Validated**: reviewed, and used with learners in a pilot with results recorded (docs/PILOT.md).

Today: **${counts.Draft} draft, ${counts.Reviewed} reviewed, ${counts.Validated} validated** of ${ACTIVITIES.length} activities.
Nothing here is certified, endorsed or aligned by a curriculum authority. The curriculum codes are
for orientation: they show which content descriptions an activity was written towards, not that it
meets them. The pathway plan itself records \`humanEducatorApproved: ${plan.humanEducatorApproved}\`.

## Activities

Level is musical demand (1 to 4), never an age. Reading and input demand are separate facts.

| Id | Activity | Track | Learners will | Level | Reading | Input | What Carmen checks | Evidence it produces | Suggested starting bands | Status |
|---|---|---|---|---|---|---|---|---|---|---|
${rows.join('\n')}

## Bands and the content descriptions they were written towards

Australian Curriculum: The Arts (Music), Version 9.0. A band's pathway is a suggested starting
point a learner or teacher picks; it is never stored as an age.

| Band | Content descriptions (orientation only) | Focus | Activities suggested | Status |
|---|---|---|---|---|
${bandRows.join('\n')}
| Older (extension) | not mapped | arranging with a partner part | ${PATHWAYS.find((p) => p.id === 'older')?.recommended.join(', ')}, ${PATHWAYS.find((p) => p.id === 'older')?.missionId} | Draft |

## Known gaps (from the pathway plan)

${plan.coverageGaps.map((g: string) => `- ${g}`).join('\n')}
- Singing, movement and group performance are outside what the app can hear or check.
- Guitar and wind instruments are not offered.

## What needs a primary music educator before any status changes

1. The order of activities in each track, and the prerequisites between them.
2. Every learner-facing instruction, hint and feedback sentence (accuracy and age-appropriate wording).
3. The on-time window and note-length tolerance used when Carmen checks timing (${LESSONS.filter((l) => l.assessment.checkTiming).length} lessons check timing).
4. Whether each "on your own" pattern is a fair test of the same idea as its practice pattern.
5. The teacher moves suggested in the Teacher area, and the wording of the status board.
6. The curriculum-code orientation above, band by band.
7. The ${MISSIONS.length} projects: what counts as evidence, and what must not be inferred.
8. Any First Nations content or context: none is included, and none should be added without authorised sources.
`;
}

describe('curriculum matrix', () => {
  it('docs/CURRICULUM_MATRIX.md matches the content', () => {
    const text = build();
    if (process.env.UPDATE_MATRIX || !existsSync(FILE)) writeFileSync(FILE, text);
    expect(readFileSync(FILE, 'utf8')).toBe(text);
  });
  it('every activity has a status and nothing claims more than draft without a named reviewer', () => {
    for (const l of LESSONS) expect(statusOf(l.reviewStatus)).toBe('Draft');
  });
});
