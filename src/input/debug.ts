// Temporary on-device input diagnostics, for testing touch on a real phone.
// Turn on with ?debug=input in the address (before the #). Shows the last events on screen.
// Nothing is stored or sent; event names and counts only, never sound.

type Line = { t: number; what: string; detail: string };

class InputDebug {
  readonly enabled: boolean;
  lines: Line[] = [];
  private subs = new Set<() => void>();
  constructor() {
    this.enabled = readFlag();
  }
  log(what: string, detail = '') {
    if (!this.enabled) return;
    this.lines = [...this.lines.slice(-24), { t: Math.round(performance.now()), what, detail }];
    this.subs.forEach((f) => f());
  }
  subscribe(f: () => void) {
    this.subs.add(f);
    return () => this.subs.delete(f);
  }
}

function readFlag(): boolean {
  try {
    return typeof location !== 'undefined' && new URLSearchParams(location.search).get('debug') === 'input';
  } catch {
    return false;
  }
}

export const inputDebug = new InputDebug();
