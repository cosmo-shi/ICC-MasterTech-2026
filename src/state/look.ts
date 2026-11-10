// Design review switches. Read from the address only (?look=a|b|c&type=1|2|3), so trying a
// direction never changes a learner's saved settings or progress. Nothing here is stored.
export type Look = 'a' | 'b' | 'c' | null;
export type TypeSet = '1' | '2' | '3' | null;

const q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
const pick = <T extends string>(v: string | null, ok: readonly T[]): T | null => (v && (ok as readonly string[]).includes(v) ? (v as T) : null);

export const LOOK: Look = pick(q.get('look'), ['a', 'b', 'c'] as const);
/** Each look has a matching type system unless ?type overrides it: A Bricolage, B Cabin, C Fraunces. */
export const TYPE: TypeSet = pick(q.get('type'), ['1', '2', '3'] as const) ?? (LOOK ? ({ a: '1', b: '2', c: '3' } as const)[LOOK] : null);

export function applyLook(root: HTMLElement = document.documentElement) {
  if (LOOK) root.dataset.look = LOOK;
  if (TYPE) root.dataset.type = TYPE;
}
