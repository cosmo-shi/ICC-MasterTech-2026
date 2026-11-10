// Local-only storage. IndexedDB when "save on this device" is on, memory otherwise.
// Nothing here is ever sent anywhere.

import type { CapturedInput, CheckSummary } from '../engine/checker.ts';
import type { InstrumentId, MusicEvent } from '../music/events.ts';
import { players } from './profiles.ts';

export const SCHEMA_VERSION = 2;
const DB_NAME = 'carmen-local';
const LIMIT_ATTEMPTS = 300;

export interface CoachRecord {
  focus: string;
  label: 'AI coach' | 'Coach tips';
  patternSource: 'local-model' | 'rules' | 'none';
  pattern?: string;
  modelId?: string;
  modelVersion?: string;
  modelStatus?: string;
  confidence?: number;
  latencyMs?: number;
  replyPlanId?: string;
  replyOp?: string;
  verified?: string[];
  rejected?: string[];
  learnerChoice?: string;
  /** On-device learner model: what it suggested and whether it chose the coach's focus. */
  tailor?: {
    provenance: 'learner-model' | 'rules';
    modelVersion?: string;
    focusFromLearner?: boolean;
    startTipUsed?: string;
    nextLessonId?: string;
    reasonId?: string;
  };
}

export interface AttemptRecord {
  id: string;
  createdAt: number;
  activityId: string; // lesson id (L01) or mission id
  activityVersion: string;
  /** 'check' = a short "what's getting in the way?" check: never used as evidence of a skill. */
  kind: 'practice' | 'independent' | 'mission' | 'mission-check' | 'check';
  instrument: InstrumentId;
  tempoBpm: number;
  support: { hintLevel: number; heardExample: boolean; largeControls: boolean; simplified: boolean; aiEnabled: boolean; slower: boolean; counting?: boolean };
  inputs: CapturedInput[];
  summary?: CheckSummary;
  passed: boolean;
  checkerVersion?: string;
  coach?: CoachRecord;
  reflection?: string;
  note?: string;
  /** For kind 'check': which check, on which skill, the single response, and what the learner chose next. */
  probe?: { skill: string; check: 'listen' | 'read' | 'play'; right: boolean; offeredBy: 'learner-model' | 'rules'; support?: string; supportTaken?: boolean };
  /** The local player this belongs to (see profiles.ts). Missing = a guest or older record. */
  profileId?: string;
  /** How the playing reached Carmen. Missing = on screen. `unclear`: the listener could not tell
   *  what was played, so the try is kept for the record but never counts as evidence. */
  input?: { mode: 'screen' | 'midi' | 'mic'; reliability?: number; unclear?: boolean; reason?: string };
}

export interface CompositionRecord {
  id: string;
  title: string;
  createdAt: number;
  instrument: InstrumentId;
  tempoBpm: number;
  totalTicks: number;
  events: MusicEvent[];
  origin: 'free-play' | 'lesson' | 'mission';
  activityId?: string;
  partner?: { op: string; accepted: boolean; provenance: string };
  profileId?: string;
}

/** Microphone audio, kept only when the learner pressed Record. Never sent anywhere, never used
 *  for training. Stored as bytes (not a Blob) because some browsers cannot keep Blobs here. */
export interface RecordingRecord {
  id: string;
  title: string;
  createdAt: number;
  mime: string;
  bytes: ArrayBuffer;
  size: number;
  durationSec: number;
  instrument: string;
  activityId?: string;
  profileId?: string;
}

type StoreName = 'attempts' | 'compositions' | 'recordings';
const STORES: StoreName[] = ['attempts', 'compositions', 'recordings'];

class LocalStore {
  private persistent = false;
  private db: IDBDatabase | null = null;
  private mem: Record<StoreName, Map<string, unknown>> = { attempts: new Map(), compositions: new Map(), recordings: new Map() };
  available = true;
  private listeners = new Set<() => void>();

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private emit() {
    this.listeners.forEach((f) => f());
  }

  get isPersistent() {
    return this.persistent;
  }

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in globalThis)) return reject(new Error('Storage is not available in this browser.'));
      const req = indexedDB.open(DB_NAME, SCHEMA_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('attempts')) db.createObjectStore('attempts', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('compositions')) db.createObjectStore('compositions', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('recordings')) db.createObjectStore('recordings', { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error ?? new Error('Storage could not open.'));
    });
  }

  /** Switch between memory-only and on-device saving. Moving to device copies this session's records. */
  async setPersistent(on: boolean): Promise<void> {
    if (on === this.persistent) return;
    if (on) {
      try {
        this.db = await this.open();
        this.persistent = true;
        for (const store of STORES) for (const v of this.mem[store].values()) await this.put(store, v);
        this.available = true;
      } catch {
        this.available = false;
        this.persistent = false;
        throw new Error('This browser is not letting Carmen save. Your music stays until you close the page.');
      }
    } else {
      // Pull device records into memory for this session, then stop writing to the device.
      if (this.db) for (const store of STORES) for (const v of await this.all(store)) this.mem[store].set((v as { id: string }).id, v);
      this.persistent = false;
      this.db?.close();
      this.db = null;
    }
    this.emit();
  }

  private tx<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('no db'));
      const t = this.db.transaction(store, mode);
      const req = fn(t.objectStore(store));
      t.oncomplete = () => resolve(req.result);
      t.onerror = () => reject(t.error ?? new Error('Save failed'));
      t.onabort = () => reject(t.error ?? new Error('Save failed'));
    });
  }

  /** Resolves only after the transaction commits. Never report "Saved" before this resolves. */
  async put(store: StoreName, value: unknown): Promise<void> {
    // New work belongs to whoever is playing. Existing records keep their owner.
    const who = players.currentId();
    if (who && !(value as { profileId?: string }).profileId) value = { ...(value as object), profileId: who };
    const v = value as { id: string };
    this.mem[store].set(v.id, value);
    if (this.persistent) await this.tx(store, 'readwrite', (s) => s.put(value));
    if (store === 'attempts') await this.trimAttempts();
    this.emit();
  }

  async delete(store: StoreName, id: string): Promise<void> {
    this.mem[store].delete(id);
    if (this.persistent) await this.tx(store, 'readwrite', (s) => s.delete(id));
    this.emit();
  }

  async all<T>(store: StoreName): Promise<T[]> {
    if (this.persistent) {
      const rows = await this.tx<unknown[]>(store, 'readonly', (s) => s.getAll());
      return rows as T[];
    }
    return [...this.mem[store].values()] as T[];
  }

  private async trimAttempts() {
    const rows = await this.all<AttemptRecord>('attempts');
    if (rows.length <= LIMIT_ATTEMPTS) return;
    rows.sort((a, b) => a.createdAt - b.createdAt);
    for (const r of rows.slice(0, rows.length - LIMIT_ATTEMPTS)) {
      this.mem.attempts.delete(r.id);
      if (this.persistent) await this.tx('attempts', 'readwrite', (s) => s.delete(r.id));
    }
  }

  /** Delete all learning records and creations on this device. Downloaded app files are separate. */
  async clearAll(): Promise<void> {
    for (const st of STORES) this.mem[st].clear();
    if (this.persistent) {
      for (const st of STORES) await this.tx(st, 'readwrite', (s) => s.clear());
    } else if ('indexedDB' in globalThis) {
      await new Promise<void>((res) => {
        const r = indexedDB.deleteDatabase(DB_NAME);
        r.onsuccess = r.onerror = r.onblocked = () => res();
      });
    }
    this.emit();
  }
}

export const store = new LocalStore();

/** Wall-clock time for records (called from event handlers only). */
export const stamp = (): number => Date.now();

export function newId(prefix: string): string {
  const rnd = crypto.getRandomValues(new Uint32Array(2));
  return `${prefix}-${rnd[0].toString(36)}${rnd[1].toString(36)}`;
}
