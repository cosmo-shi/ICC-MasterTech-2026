/// <reference types="node" />
// The curriculum alignment map (Australian Curriculum v9.0 Music, F-6) stays honest and complete:
// every activity is mapped, every code is a known descriptor with a source, and the coverage report
// in docs/review/2026-11-11/CURRICULUM_ALIGNMENT.md is regenerated from the data.
// Regenerate: UPDATE_ALIGNMENT=1 npx vitest run src/data/alignment.test.ts
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import map from './curriculumAlignment.json';
import { ACTIVITIES } from './curriculum.ts';
import { guidedById } from './guided.ts';
import { lessonById, missionById } from './catalog.ts';

const FILE = new URL('../../docs/review/2026-11-11/CURRICULUM_ALIGNMENT.md', import.meta.url).pathname;
const title = (id: string) => guidedById(id)?.title ?? lessonById(id)?.title ?? missionById(id)?.title ?? id;

function build(): string {
  const bands = ['Foundation', 'Years 1-2', 'Years 3-4', 'Years 5-6'];
  const byCode = (code: string) => map.mappings.filter((m) => m.codes.includes(code)).map((m) => m.activityId);
  const out: string[] = [];
  out.push('# Curriculum alignment: Australian Curriculum v9.0 Music, Foundation to Year 6', '');
  out.push(`${map.claim}`, '');
  out.push(`Generated from \`src/data/curriculumAlignment.json\` by \`src/data/alignment.test.ts\`. Do not edit by hand.`, '');
  out.push('## Sources', '');
  for (const s of map.sources) out.push(`- ${s.title}: ${s.url} (${s.licence})`);
  out.push('', `Attribution: ${map.attribution}`, '');
  out.push('## Coverage by band and strand', '', 'Each cell lists the Carmen activities mapped to that content description. "None" is a gap.', '');
  out.push(`| Band | ${map.strands.join(' | ')} |`, `|---|${map.strands.map(() => '---').join('|')}|`);
  for (const b of bands) {
    const cells = map.strands.map((st) => {
      const ds = map.descriptors.filter((d) => d.band === b && d.strand === st);
      return ds.map((d) => `${d.code}: ${byCode(d.code).join(', ') || '**none**'}`).join('<br>') || 'n/a';
    });
    out.push(`| ${b} | ${cells.join(' | ')} |`);
  }
  const covered = map.descriptors.filter((d) => byCode(d.code).length).length;
  out.push('', `${covered} of ${map.descriptors.length} content descriptions have at least one mapped activity. A mapping means the activity contributes to the description, not that it covers it.`, '');
  out.push('## Content descriptions', '', '| Code | Band | Strand | Official text (via QCAA) | Verification |', '|---|---|---|---|---|');
  for (const d of map.descriptors) out.push(`| ${d.code} | ${d.band} | ${d.strand} | ${d.officialText} | ${d.verification} ([source](${d.sourceUrl}), checked ${d.checkedOn}) |`);
  out.push('', '## Activity trace', '', '| Activity | Title | Codes | Elements | What the learner does | Observable evidence | How it is checked | Accessible equivalent | Confidence |', '|---|---|---|---|---|---|---|---|---|');
  for (const m of map.mappings) out.push(`| ${m.activityId} | ${title(m.activityId)} | ${m.codes.join(', ')} | ${m.elements.join(', ')} | ${m.experientialActivity} | ${m.observableEvidence} | ${m.assessment} | ${m.accessibleEquivalent} | ${m.confidence} |`);
  out.push('', '## Achievement standards (opening sentences, via QCAA)', '');
  for (const a of map.achievementStandards) out.push(`- **${a.band}.** Responding: ${a.responding} Making: ${a.making}`);
  out.push('', '## Elements of music', '', `${map.elements.list.join(', ')}. ${map.elements.verification}`, '');
  out.push('## Known gaps', '');
  for (const g of map.gaps) out.push(`- ${g}`);
  return out.join('\n') + '\n';
}

describe('curriculum alignment map', () => {
  it('maps every activity exactly once', () => {
    const ids = map.mappings.map((m) => m.activityId);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(ACTIVITIES.map((a) => a.id).sort());
  });
  it('uses only known, sourced content descriptions', () => {
    const codes = new Set(map.descriptors.map((d) => d.code));
    for (const m of map.mappings) for (const c of m.codes) expect(codes.has(c), `${m.activityId} → ${c}`).toBe(true);
    for (const d of map.descriptors) {
      expect(d.sourceUrl).toMatch(/^https:\/\/www\.qcaa\.qld\.edu\.au\//);
      expect(d.code).toMatch(/^AC9AMU(F|2|4|6)[EDCP]0\d$/);
    }
  });
  it('never claims certification or endorsement', () => {
    expect(map.claim).toMatch(/Not ACARA certification or endorsement/);
  });
  it('keeps the coverage report in step with the data', () => {
    const text = build();
    if (process.env.UPDATE_ALIGNMENT || !existsSync(FILE)) writeFileSync(FILE, text);
    expect(readFileSync(FILE, 'utf8')).toBe(text);
  });
});
