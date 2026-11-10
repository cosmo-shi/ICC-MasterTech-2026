// Phone and tablet layout check: overlapping text or buttons, text touching the screen edge,
// cut-off text, sideways scrolling and page errors, on every main screen.
// Chromium emulating iPhone/Android sizes and touch: NOT Safari/WebKit and not a real device.
//   node tools/e2e-devices.mjs [http://localhost:5179]
import { createRequire } from 'node:module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const base = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://localhost:5179';
const DEVICES = ['iPhone SE', 'iPhone 14', 'iPhone 14 Pro Max', 'iPhone 14 landscape', 'Pixel 7', 'Galaxy S9+', 'Pixel 7 landscape', 'iPad Mini', 'iPad Mini landscape'];
const ROUTES = ['#/play', '#/learn', '#/theory', '#/theory/beat', '#/lesson/L05', '#/lesson/L01', '#/lesson/L03', '#/mission/P34_MELODIC_REPLY', '#/music', '?testdata#/teacher', 'FIRST'];
const b = await chromium.launch();
let fails = 0;
for (const name of DEVICES) {
  const { defaultBrowserType: _ignored, ...d } = devices[name];
  for (const dark of [false, true]) for (const route of ROUTES) {
    if (dark && !['#/learn', '#/lesson/L05', '?testdata#/teacher'].includes(route)) continue;
    const ctx = await b.newContext({ ...d, colorScheme: dark ? 'dark' : 'light' });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    if (route !== 'FIRST')
      await p.addInitScript(() => {
        localStorage.setItem('carmen-prefs-v1', JSON.stringify({ instrument: 'keyboard', rotateTipDismissed: true }));
        localStorage.setItem('carmen-players-v1', JSON.stringify([{ id: 'p-qa', name: 'QA', colour: 'sky', createdAt: 1 }]));
        localStorage.setItem('carmen-current-player-v1', 'p-qa');
      });
    await p.goto(`${base}/${route === 'FIRST' ? '' : route}`);
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => {
      const W = innerWidth;
      const vis = (e) => { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false; if (e.closest('[aria-hidden="true"], .sr-only, svg, [hidden]')) return false; const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
      const pinned = (e) => { for (let x = e; x; x = x.parentElement) { const ps = getComputedStyle(x).position; if (ps === 'fixed' || ps === 'sticky') return true; } return false; };
      const label = (e) => (e.textContent || e.getAttribute('aria-label') || e.className || e.tagName).toString().trim().replace(/\s+/g, ' ').slice(0, 28);
      // With a modal dialog open, only what is in the dialog is visible and reachable.
      const modal = document.querySelector('[aria-modal="true"]');
      const scope = (e) => !modal || modal.contains(e);
      const texts = [...document.querySelectorAll('body *')].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && vis(e) && scope(e));
      const ctrls = [...document.querySelectorAll('button, a[href], input, select, [role=radio], [role=tab]')].filter((e) => vis(e) && scope(e) && !e.closest('.kb, .minikeys, .kb-strip'));
      const issues = [];
      // What is actually visible: the text itself (not its padding), clipped by any scrolling or
      // clipping ancestor. Content scrolled out of a lesson panel is hidden, not overlapping.
      const textRect = (e) => {
        if (e.matches('button, a, input, select, [role=radio], [role=tab]')) return e.getBoundingClientRect();
        const rg = document.createRange();
        let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
        for (const n of e.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { rg.selectNodeContents(n); for (const q of rg.getClientRects()) { l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom); } }
        return l === Infinity ? e.getBoundingClientRect() : { left: l, top: t, right: r, bottom: b };
      };
      const clipped = (e) => {
        let { left: l, top: t, right: r, bottom: b } = textRect(e);
        for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) {
          const cs = getComputedStyle(x);
          if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { const q = x.getBoundingClientRect(); l = Math.max(l, q.left); t = Math.max(t, q.top); r = Math.min(r, q.right); b = Math.min(b, q.bottom); }
        }
        return { left: l, top: t, right: r, bottom: b, empty: r - l < 1 || b - t < 1 };
      };
      const box = (e) => { const r = clipped(e); return { l: r.left + scrollX, r: r.right + scrollX, t: r.top + scrollY, b: r.bottom + scrollY, empty: r.empty }; };
      const inter = (a, c) => Math.max(0, Math.min(a.r, c.r) - Math.max(a.l, c.l)) * Math.max(0, Math.min(a.b, c.b) - Math.max(a.t, c.t));
      const check = (list, kind) => {
        const items = list.map((e) => ({ e, b: box(e), pin: pinned(e) })).filter((x) => !x.b.empty);
        for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
          const A = items[i], C = items[j];
          if (A.e.contains(C.e) || C.e.contains(A.e)) continue;
          // Inline words in one sentence ("Try: …") share line boxes; that is wrapping, not overlap.
          if (A.e.parentElement === C.e.parentElement && getComputedStyle(A.e).display === 'inline' && getComputedStyle(C.e).display === 'inline') continue;
          if (A.pin !== C.pin) continue; // page content scrolling under a fixed bar is expected
          if (inter(A.b, C.b) > 6) issues.push(`${kind} overlap: "${label(A.e)}" / "${label(C.e)}"`);
        }
      };
      check(texts, 'text');
      check(ctrls, 'control');
      for (const e of texts) {
        if (e.closest('.kb, .minikeys, .kb-strip, nav, .lp-bar, .notation')) continue; // nav rails sit by the edge on purpose (and pad for the notch)
        const r = clipped(e);
        if (r.empty) continue;
        // Text must keep a gutter (or the safe-area inset) from the screen edge.
        if (r.left < 8 || r.right > W - 8) issues.push(`edge: "${label(e)}" ${Math.round(r.left)}–${Math.round(r.right)} of ${W}`);
        const cs = getComputedStyle(e);
        if ((cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 1) issues.push(`cut off: "${label(e)}"`);
      }
      if (document.documentElement.scrollWidth > W + 1) issues.push(`sideways scroll ${document.documentElement.scrollWidth - W}px`);
      return [...new Set(issues)].slice(0, 8);
    });
    const all = r.concat(errs.slice(0, 2).map((x) => 'error: ' + x.slice(0, 120)));
    const key = `${name}${dark ? ' dark' : ''} ${route}`;
    if (all.length) { fails++; console.log(`FAIL ${key}\n  ${all.join('\n  ')}`); } else console.log(`ok   ${key}`);
    await ctx.close();
  }
}
await b.close();
console.log(fails ? `${fails} screens with issues` : 'ALL PASS');
