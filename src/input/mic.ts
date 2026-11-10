// Microphone capture. Listening and keeping audio are separate:
//   - listen(): samples go to the analyser in this page and are thrown away block by block.
//   - startRecording(): only when the learner presses Record, a copy is encoded on the device.
// Permission is asked only when listen() is called from a learner's action. Nothing is sent
// anywhere; there is no cloud fallback. stop() releases the microphone (the browser's
// microphone indicator goes off).

import { audio } from '../audio/engine.ts';

export type MicState = 'off' | 'asking' | 'starting' | 'listening' | 'denied' | 'unavailable' | 'error';

export interface MicBlock {
  samples: Float32Array;
  /** Audio-context time of samples[0], in seconds. */
  time: number;
  sampleRate: number;
}

class Mic {
  state: MicState = 'off';
  error = '';
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private node: AudioWorkletNode | ScriptProcessorNode | null = null;
  private sink: GainNode | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recStarted = 0;
  private subs = new Set<() => void>();
  private onBlock: ((b: MicBlock) => void) | null = null;

  subscribe(f: () => void) {
    this.subs.add(f);
    return () => {
      this.subs.delete(f);
    };
  }
  private set(state: MicState, error = '') {
    this.state = state;
    this.error = error;
    this.subs.forEach((f) => f());
  }

  get supported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
  }

  /** Start listening. Must be called from a press (it may show the browser's permission prompt). */
  async listen(onBlock: (b: MicBlock) => void): Promise<boolean> {
    this.onBlock = onBlock;
    if (this.state === 'listening') return true;
    if (!this.supported) {
      this.set('unavailable', 'This browser can’t use a microphone here.');
      return false;
    }
    this.set('asking');
    try {
      if (!audio.running) await audio.start();
      const ctx = audio.ctx;
      if (!ctx) throw new Error('Sound did not start.');
      // Raw input: echo cancelling, noise suppression and auto-gain change timing and pitch.
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
      this.set('starting');
      this.source = ctx.createMediaStreamSource(this.stream);
      // The tap must reach the destination to run, so it goes through a silent gain: the
      // microphone is never played out loud (no feedback).
      this.sink = ctx.createGain();
      this.sink.gain.value = 0;
      this.sink.connect(ctx.destination);
      const sr = ctx.sampleRate;
      if (ctx.audioWorklet) {
        await ctx.audioWorklet.addModule(`${import.meta.env.BASE_URL}worklets/mic-tap.js`);
        const n = new AudioWorkletNode(ctx, 'carmen-mic-tap');
        n.port.onmessage = (e: MessageEvent<{ frame: number; samples: Float32Array }>) => this.onBlock?.({ samples: e.data.samples, time: e.data.frame / sr, sampleRate: sr });
        this.node = n;
      } else {
        const sp = ctx.createScriptProcessor(1024, 1, 1);
        sp.onaudioprocess = (e) => this.onBlock?.({ samples: new Float32Array(e.inputBuffer.getChannelData(0)), time: e.playbackTime - 1024 / sr, sampleRate: sr });
        this.node = sp;
      }
      this.source.connect(this.node).connect(this.sink);
      // Stop if the browser ends the track (unplugged, permission revoked, phone call).
      this.stream.getAudioTracks().forEach((t) => (t.onended = () => this.stop()));
      this.set('listening');
      return true;
    } catch (e) {
      this.release();
      const name = (e as { name?: string }).name;
      if (name === 'NotAllowedError' || name === 'SecurityError') this.set('denied', 'The microphone is blocked for Carmen.');
      else if (name === 'NotFoundError' || name === 'OverconstrainedError') this.set('unavailable', 'No microphone was found.');
      else this.set('error', e instanceof Error ? e.message : 'The microphone could not start.');
      return false;
    }
  }

  /** Keep a copy of the sound from now on (only after the learner pressed Record). */
  startRecording(): boolean {
    if (!this.stream || typeof MediaRecorder === 'undefined') return false;
    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e) => e.data.size && this.chunks.push(e.data);
    this.recorder.start();
    this.recStarted = performance.now();
    this.subs.forEach((f) => f());
    return true;
  }

  get recording(): boolean {
    return this.recorder?.state === 'recording';
  }

  /** Stop keeping audio. Resolves with the recording, which exists only in memory until saved. */
  stopRecording(): Promise<{ blob: Blob; durationSec: number } | null> {
    const r = this.recorder;
    if (!r || r.state !== 'recording') return Promise.resolve(null);
    return new Promise((resolve) => {
      r.onstop = () => {
        const blob = new Blob(this.chunks, { type: r.mimeType || 'audio/webm' });
        this.chunks = [];
        this.recorder = null;
        this.subs.forEach((f) => f());
        resolve({ blob, durationSec: (performance.now() - this.recStarted) / 1000 });
      };
      r.stop();
    });
  }

  private release() {
    try {
      if (this.recorder?.state === 'recording') this.recorder.stop();
    } catch {
      /* already stopped */
    }
    this.recorder = null;
    this.chunks = [];
    this.node?.disconnect();
    this.source?.disconnect();
    this.sink?.disconnect();
    if (this.node && 'port' in this.node) this.node.port.onmessage = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.node = null;
    this.source = null;
    this.sink = null;
    this.stream = null;
  }

  /** Stop listening and release the microphone. Any unsaved recording is dropped. */
  stop() {
    this.onBlock = null;
    this.release();
    if (this.state === 'listening' || this.state === 'starting' || this.state === 'asking') this.set('off');
  }
}

export const mic = new Mic();
