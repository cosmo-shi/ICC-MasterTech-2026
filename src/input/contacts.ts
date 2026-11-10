// Who owns which note. Each finger, mouse button or pen is a "contact" with its own id; a key
// sounds while at least one contact is on it. Pure logic (no DOM) so it can be tested directly.
//
// - Several contacts can hold separate keys (chords).
// - A contact that slides onto a new key releases its old key and sounds the new one (glissando).
// - Lifting one contact never releases a key another contact still holds.
// - Two contacts on the same key sound it once; it stops when the last one leaves.
// - cancelAll() releases everything (touch cancelled, page hidden, screen left, unmount).

export type ContactId = string | number;

export interface ContactCallbacks<K> {
  start: (key: K, t: number, contact: ContactId) => void;
  end: (key: K, t: number) => void;
}

export class ContactTracker<K> {
  private byContact = new Map<ContactId, K | null>();
  private holders = new Map<K, number>();
  private cb: ContactCallbacks<K>;

  constructor(cb: ContactCallbacks<K>) {
    this.cb = cb;
  }

  /** A new contact. `key` is null when it lands between keys; it may still slide onto one. */
  down(id: ContactId, key: K | null, t: number) {
    if (this.byContact.has(id)) this.up(id, t); // a lost "up": start again cleanly
    this.byContact.set(id, key);
    if (key !== null) this.acquire(key, t, id);
  }

  /** A contact moved. Only contacts that went down here are followed. */
  move(id: ContactId, key: K | null, t: number) {
    if (!this.byContact.has(id)) return;
    const was = this.byContact.get(id) ?? null;
    if (was === key) return;
    this.byContact.set(id, key);
    if (was !== null) this.release(was, t);
    if (key !== null) this.acquire(key, t, id);
  }

  up(id: ContactId, t: number) {
    if (!this.byContact.has(id)) return;
    const was = this.byContact.get(id) ?? null;
    this.byContact.delete(id);
    if (was !== null) this.release(was, t);
  }

  cancelAll(t: number) {
    for (const id of [...this.byContact.keys()]) this.up(id, t);
  }

  /** Keys currently sounding, for tests and for the screen. */
  held(): K[] {
    return [...this.holders.keys()];
  }

  get active(): number {
    return this.byContact.size;
  }

  private acquire(key: K, t: number, id: ContactId) {
    const n = this.holders.get(key) ?? 0;
    this.holders.set(key, n + 1);
    if (n === 0) this.cb.start(key, t, id);
  }

  private release(key: K, t: number) {
    const n = this.holders.get(key) ?? 0;
    if (n <= 1) {
      this.holders.delete(key);
      if (n === 1) this.cb.end(key, t);
    } else this.holders.set(key, n - 1);
  }
}
