// Copies microphone samples to the page in blocks, with the frame they started on.
// Runs inside the browser's audio thread. Nothing is stored or sent from here.
class MicTap extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(1024);
    this.fill = 0;
    this.start = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch) return true;
    for (let i = 0; i < ch.length; i++) {
      if (this.fill === 0) this.start = currentFrame + i;
      this.buf[this.fill++] = ch[i];
      if (this.fill === this.buf.length) {
        this.port.postMessage({ frame: this.start, samples: this.buf });
        this.buf = new Float32Array(1024);
        this.fill = 0;
      }
    }
    return true;
  }
}
registerProcessor('carmen-mic-tap', MicTap);
