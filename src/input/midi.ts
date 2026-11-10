// Connected MIDI keyboards (Web MIDI). Note on and off with the browser's own timestamps, which
// are on the same clock as screen touches, so timing is checked the same way. Not available in
// Safari (iPhone and iPad), which Carmen says plainly instead of hiding.

export type MidiState = 'off' | 'asking' | 'ready' | 'none' | 'unsupported' | 'denied';

export interface MidiNote {
  type: 'down' | 'up';
  midi: number;
  velocity: number;
  /** performance.now() time */
  t: number;
}

type Access = { inputs: Map<string, MidiInputLike>; onstatechange: (() => void) | null };
type MidiInputLike = { name?: string | null; state?: string; onmidimessage: ((e: { data: Uint8Array; timeStamp: number }) => void) | null };

class Midi {
  state: MidiState = 'off';
  devices: string[] = [];
  private access: Access | null = null;
  private onNote: ((n: MidiNote) => void) | null = null;
  private subs = new Set<() => void>();

  get supported(): boolean {
    return typeof navigator !== 'undefined' && 'requestMIDIAccess' in navigator;
  }
  subscribe(f: () => void) {
    this.subs.add(f);
    return () => {
      this.subs.delete(f);
    };
  }
  private emit() {
    this.subs.forEach((f) => f());
  }

  /** Ask for MIDI (no system-exclusive messages). Call from a press. */
  async connect(onNote: (n: MidiNote) => void): Promise<boolean> {
    this.onNote = onNote;
    if (!this.supported) {
      this.state = 'unsupported';
      this.emit();
      return false;
    }
    this.state = 'asking';
    this.emit();
    try {
      const nav = navigator as unknown as { requestMIDIAccess: (o: { sysex: boolean }) => Promise<Access> };
      this.access = await nav.requestMIDIAccess({ sysex: false });
      this.access.onstatechange = () => this.bind();
      this.bind();
      return (this.state as MidiState) === 'ready';
    } catch {
      this.state = 'denied';
      this.emit();
      return false;
    }
  }

  private bind() {
    if (!this.access) return;
    const inputs = [...this.access.inputs.values()].filter((i) => i.state !== 'disconnected');
    this.devices = inputs.map((i) => i.name || 'MIDI keyboard');
    for (const i of inputs) i.onmidimessage = (e) => this.message(e.data, e.timeStamp);
    this.state = inputs.length ? 'ready' : 'none';
    this.emit();
  }

  private message(data: Uint8Array, t: number) {
    const parsed = parseMidi(data);
    if (parsed) this.onNote?.({ ...parsed, t });
  }

  disconnect() {
    if (this.access) for (const i of this.access.inputs.values()) i.onmidimessage = null;
    this.onNote = null;
    if (this.state !== 'unsupported') this.state = 'off';
    this.emit();
  }
}

/** Note on/off from a raw MIDI message. Note-on with velocity 0 is a note-off. Other messages are ignored. */
export function parseMidi(data: Uint8Array | number[]): Omit<MidiNote, 't'> | null {
  const [status, note, vel] = data;
  const cmd = status & 0xf0;
  if (note === undefined || note > 127) return null;
  if (cmd === 0x90 && vel > 0) return { type: 'down', midi: note, velocity: vel / 127 };
  if (cmd === 0x80 || (cmd === 0x90 && vel === 0)) return { type: 'up', midi: note, velocity: 0 };
  return null;
}

export const midiInput = new Midi();
