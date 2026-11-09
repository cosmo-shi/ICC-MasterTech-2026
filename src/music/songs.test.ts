import { describe, expect, it } from 'vitest';
import { validatePhrase } from './lessons.ts';
import { SONGS, findSong, nameToMidi, normalise } from './songs.ts';

describe('songbook', () => {
  it('every song is a valid phrase that fits the keyboard, in whole bars', () => {
    expect(SONGS.length).toBeGreaterThanOrEqual(8);
    for (const s of SONGS) {
      expect(validatePhrase(s.phrase), s.id).toEqual([]);
      for (const e of s.phrase.events) if (e.kind === 'note') expect(e.midi).toBeGreaterThanOrEqual(60);
      expect(s.source).toBeTruthy();
    }
  });

  it('reads note names', () => {
    expect(nameToMidi('C4')).toBe(60);
    expect(nameToMidi('A4')).toBe(69);
    expect(nameToMidi('F#4')).toBe(66);
  });

  it('finds songs by title, nickname and with small typos', () => {
    expect(findSong('Twinkle twinkle little star')?.id).toBe('twinkle');
    expect(findSong('twinkle')?.id).toBe('twinkle');
    expect(findSong('twinkel twinkel')?.id).toBe('twinkle');
    expect(findSong('Mary had a lil lamb')?.id).toBe('mary');
    expect(findSong('frere jacques')?.id).toBe('frere-jacques');
    expect(findSong('Are you sleeping?')?.id).toBe('frere-jacques');
    expect(findSong('old mcdonald')?.id).toBe('old-macdonald');
    expect(findSong('JINGLE BELLS!!')?.id).toBe('jingle-bells');
    expect(findSong('beethoven')?.id).toBe('ode-to-joy');
  });

  it('says no rather than guessing a song it does not know', () => {
    expect(findSong('bohemian rhapsody')).toBeNull();
    expect(findSong('a')).toBeNull();
    expect(findSong('')).toBeNull();
  });

  it('normalises accents and punctuation', () => {
    expect(normalise('  Frère   Jacques! ')).toBe('frere jacques');
  });
});
