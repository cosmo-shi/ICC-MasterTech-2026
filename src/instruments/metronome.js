/*
  Metronome (FR-PLY-09, FR-PLY-10).

  Clicks come from Tone.js's Transport, so the click rate is exactly the BPM shown.
  The click is a short synth blip made in code (beat 1 higher and louder).
  onBeat runs in step with the click (through Tone's Draw), for the flashing
  beat marker and the optional vibration.
*/
import { loadTone } from './audio.js'

export function clampBpm(value, min = 40, max = 160) {
  const n = Math.round(Number(value))
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

export function beatIntervalMs(bpm) {
  return 60000 / bpm
}

/*
  const metronome = await createMetronome({ minBpm: 40, maxBpm: 160, startBpm: 80, beatsPerBar: 4,
                                            onBeat: ({ beat, time }) => ... })
  metronome.start(); metronome.setBpm(100); metronome.stop(); metronome.dispose()
  beat counts 1, 2, 3, 4, 1, ...; time is the beat's time on the audio clock.
*/
export async function createMetronome({ minBpm = 40, maxBpm = 160, startBpm = 80, beatsPerBar = 4, onBeat = () => {}, onStop = () => {} } = {}) {
  const Tone = await loadTone()
  const transport = Tone.getTransport()
  const draw = Tone.getDraw()

  const click = new Tone.Synth({
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
  }).toDestination()
  click.volume.value = -14

  let bpm = clampBpm(startBpm, minBpm, maxBpm)
  let running = false
  let count = 0
  let eventId = null

  function tick(time) {
    const beat = (count % beatsPerBar) + 1
    count += 1
    if (beat === 1) click.triggerAttackRelease('C6', 0.03, time, 1)
    else click.triggerAttackRelease('G5', 0.03, time, 0.6)
    draw.schedule(() => onBeat({ beat, time }), time)
  }

  return {
    get bpm() {
      return bpm
    },
    isRunning: () => running,
    setBpm(value) {
      bpm = clampBpm(value, minBpm, maxBpm)
      transport.bpm.value = bpm
      return bpm
    },
    start() {
      if (running) return
      count = 0
      transport.bpm.value = bpm
      transport.stop()
      transport.position = 0
      eventId = transport.scheduleRepeat(tick, '4n', 0)
      transport.start('+0.05')
      running = true
    },
    stop() {
      if (!running) return
      transport.stop()
      if (eventId !== null) transport.clear(eventId)
      eventId = null
      draw.cancel()
      running = false
      onStop()
    },
    dispose() {
      this.stop()
      click.dispose()
    },
  }
}
