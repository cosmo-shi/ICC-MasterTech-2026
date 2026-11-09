import { describe, expect, it } from 'vitest';
import { LESSONS } from '../data/catalog.ts';
import { LESSON_INFOS } from '../ai/learner.ts';
import { soundingEvents } from './events.ts';
import { validatePhrase } from './lessons.ts';
import { cellsFrom, cellsToPhrase, describeChanges, makeSpec, setCell } from './maker.ts';

describe('making your own phrase from a lesson', () => {
  it('every scored lesson gives a decision, starting cells and valid music', () => {
    for (const l of LESSONS) {
      const src = l.practice ?? l.independent;
      if (!src) continue;
      const skills = LESSON_INFOS.find((x) => x.id === l.id)?.skills ?? [];
      const spec = makeSpec(skills, src);
      const cells = cellsFrom(src, spec);
      expect(cells, l.id).toHaveLength(spec.beats);
      const p = cellsToPhrase(cells, spec, l.tempoBpm);
      expect(validatePhrase(p), l.id).toEqual([]);
    }
  });

  it('the rests decision reproduces a sound-rest pattern exactly', () => {
    const l = LESSONS.find((x) => x.id === 'L02')!;
    const spec = makeSpec(['pulse', 'rests'], l.practice!);
    expect(spec.concept).toBe('rests');
    const cells = cellsFrom(l.practice!, spec);
    const p = cellsToPhrase(cells, spec, 80);
    expect(soundingEvents(p).map((e) => e.onset)).toEqual(soundingEvents(l.practice!).map((e) => e.onset));
  });

  it('long notes take two beats and can be undone', () => {
    const spec = makeSpec(['duration'], LESSONS.find((x) => x.id === 'L07')!.practice!);
    let cells = ['short', 'short', 'short', 'short'];
    cells = setCell(cells, 1, 'long');
    expect(cells).toEqual(['short', 'long', 'held', 'short']);
    expect(soundingEvents(cellsToPhrase(cells, spec, 80)).map((e) => e.duration)).toEqual([480, 960, 480]);
    cells = setCell(cells, 2, 'short');
    expect(cells).toEqual(['short', 'short', 'short', 'short']);
    expect(setCell(cells, 3, 'long')).toEqual(cells); // no room on the last beat
  });

  it('describes what changed between versions', () => {
    const spec = makeSpec(['rests'], LESSONS.find((x) => x.id === 'L02')!.practice!);
    expect(describeChanges(['one', 'rest', 'one', 'rest'], ['one', 'one', 'one', 'rest'], spec)).toEqual(['Beat 2: rest → sound']);
  });
});
