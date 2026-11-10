import { describe, expect, it } from 'vitest';
import { ContactTracker } from './contacts.ts';

function setup() {
  const log: string[] = [];
  const tr = new ContactTracker<number>({ start: (k) => log.push(`+${k}`), end: (k) => log.push(`-${k}`) });
  return { tr, log };
}

describe('contact tracker (multitouch ownership)', () => {
  it('plays a chord with three fingers and releases each on its own', () => {
    const { tr, log } = setup();
    tr.down('a', 60, 0);
    tr.down('b', 64, 1);
    tr.down('c', 67, 2);
    expect(tr.held().sort()).toEqual([60, 64, 67]);
    tr.up('b', 3);
    expect(tr.held().sort()).toEqual([60, 67]);
    tr.up('a', 4);
    tr.up('c', 5);
    expect(log).toEqual(['+60', '+64', '+67', '-64', '-60', '-67']);
  });

  it('glides across white and black keys with one finger', () => {
    const { tr, log } = setup();
    tr.down('a', 60, 0);
    for (const k of [61, 62, 62, 63, 64]) tr.move('a', k, 1); // 62 twice: no repeat
    tr.up('a', 2);
    expect(log).toEqual(['+60', '-60', '+61', '-61', '+62', '-62', '+63', '-63', '+64', '-64']);
  });

  it('slides one finger while another holds a note', () => {
    const { tr, log } = setup();
    tr.down('hold', 48, 0);
    tr.down('slide', 60, 1);
    tr.move('slide', 62, 2);
    tr.move('slide', 64, 3);
    tr.up('slide', 4);
    expect(tr.held()).toEqual([48]);
    expect(log).not.toContain('-48');
  });

  it('two fingers on the same key sound it once and it stops with the last one', () => {
    const { tr, log } = setup();
    tr.down('a', 60, 0);
    tr.down('b', 62, 0);
    tr.move('b', 60, 1); // slides onto the key finger a holds: no second strike
    expect(log).toEqual(['+60', '+62', '-62']);
    tr.up('a', 2);
    expect(tr.held()).toEqual([60]); // b is still on it
    tr.up('b', 3);
    expect(log).toEqual(['+60', '+62', '-62', '-60']);
  });

  it('repeated strikes on one key each sound', () => {
    const { tr, log } = setup();
    for (let i = 0; i < 3; i++) {
      tr.down('a', 60, i);
      tr.up('a', i + 0.5);
    }
    expect(log).toEqual(['+60', '-60', '+60', '-60', '+60', '-60']);
  });

  it('a finger can land between keys and slide onto one; leaving the keys releases it', () => {
    const { tr, log } = setup();
    tr.down('a', null, 0);
    tr.move('a', 60, 1);
    tr.move('a', null, 2);
    tr.up('a', 3);
    expect(log).toEqual(['+60', '-60']);
  });

  it('cancel releases everything, and late moves from forgotten contacts are ignored', () => {
    const { tr, log } = setup();
    tr.down('a', 60, 0);
    tr.down('b', 64, 0);
    tr.cancelAll(1);
    expect(tr.held()).toEqual([]);
    tr.move('a', 65, 2);
    tr.up('b', 3);
    expect(log).toEqual(['+60', '+64', '-60', '-64']);
    expect(tr.active).toBe(0);
  });

  it('a repeated "down" for a contact that never sent "up" does not leave a stuck note', () => {
    const { tr } = setup();
    tr.down('a', 60, 0);
    tr.down('a', 62, 1);
    expect(tr.held()).toEqual([62]);
  });
});
