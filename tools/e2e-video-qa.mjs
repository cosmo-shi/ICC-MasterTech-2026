// Video QA regression check (docs/carmen-video-qa.md). Dev server up, then:
//   node tools/e2e-video-qa.mjs [http://localhost:5179] [--shots docs/video-qa]
// Emulated phones and tablets in Chromium: proves layout only, not real Safari or real touch.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://localhost:5179';
const shotsAt = process.argv.indexOf('--shots');
const shots = shotsAt > 0 ? process.argv[shotsAt + 1] : null;
const SIZES = ['320x568', '360x740', '390x844', '430x932', '768x1024', '1280x800', '1440x900', '568x320', '740x360', '844x390'];
let fail = 0;
const check = (name, ok, detail = '') => {
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
};
const seed = () => {
  localStorage.setItem('carmen-prefs-v1', JSON.stringify({ instrument: 'keyboard', rotateTipDismissed: true }));
  localStorage.setItem('carmen-players-v1', JSON.stringify([{ id: 'p-qa', name: 'QA', colour: 'sky', createdAt: 1 }]));
  localStorage.setItem('carmen-current-player-v1', 'p-qa');
};
const box = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width && r.height ? { top: r.top, bottom: r.bottom, w: r.width } : null; }, sel);

const browser = await chromium.launch();
for (const size of SIZES) {
  const [w, h] = size.split('x').map(Number);
  const touch = w < 900 || h < 500;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.addInitScript(seed);
  // Play: the stave (what you played) and every key are on screen.
  await p.goto(`${base}/#/play`);
  await p.waitForTimeout(900);
  const trail = await box(p, '.play .trail');
  const kb = await box(p, '.play .kb');
  const tabs = await box(p, '.tabs');
  const bottom = tabs && tabs.top > h / 2 ? tabs.top : h;
  check(`${size} Play: stave shown`, !!trail && trail.bottom <= h);
  check(`${size} Play: keys fully on screen`, !!kb && kb.bottom <= bottom + 1, kb ? `keys end ${Math.round(kb.bottom)}, room ${Math.round(bottom)}` : 'no keys');
  if (shots && ['390x844', '844x390', '1280x800'].includes(size)) await p.screenshot({ path: `${shots}/after-play-${size}.png` });
  // L05: stave and keys together on the "find C" step; a drawn stave is wider than 200 px.
  await p.goto(`${base}/#/lesson/L05`);
  await p.waitForTimeout(700);
  await p.locator('.lp-foot .btn-big').click();
  await p.waitForTimeout(700);
  const svg = await box(p, '.lp-music svg');
  const keys = await box(p, '.lp-instrument .kb');
  const foot = await box(p, '.lp-foot');
  const room = foot ? foot.top : h;
  check(`${size} L05: stave drawn and on screen`, !!svg && svg.w > 160 && svg.top >= 0 && svg.bottom <= room + 1, svg ? `w ${Math.round(svg.w)}` : 'none');
  check(`${size} L05: keys on screen with the stave`, !!keys && keys.top < room && keys.bottom <= room + 2);
  if (shots && ['390x844', '844x390', '1280x800'].includes(size)) await p.screenshot({ path: `${shots}/after-l05-${size}.png` });
  check(`${size} no page errors`, errors.length === 0, errors[0]);
  await ctx.close();
}
// Rotation mid-lesson keeps the step and redraws the stave at the new width.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  await p.addInitScript(seed);
  await p.goto(`${base}/#/lesson/L05`);
  await p.waitForTimeout(700);
  await p.locator('.lp-foot .btn-big').click();
  await p.waitForTimeout(700);
  const before = await box(p, '.lp-music svg');
  await p.setViewportSize({ width: 844, height: 390 });
  await p.waitForTimeout(800);
  const title = await p.locator('.lp-title').first().textContent();
  const after = await box(p, '.lp-music svg');
  check('rotate mid-lesson: same step', title === 'Find middle C', title ?? '');
  check('rotate mid-lesson: stave redrawn for the new width', !!before && !!after && Math.abs(before.w - after.w) > 1, `${Math.round(before?.w ?? 0)} → ${Math.round(after?.w ?? 0)}`);
  await ctx.close();
}
await browser.close();
console.log(fail ? `${fail} failed` : 'ALL PASS');
process.exit(fail ? 1 : 0);
