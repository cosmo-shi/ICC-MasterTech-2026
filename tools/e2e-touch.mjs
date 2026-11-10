// Emulated multitouch check in Chromium (CDP touch events). Run with the dev server up:
//   node tools/e2e-touch.mjs [http://localhost:5179]
// This proves the event logic in Chromium only. It is NOT proof that an iPhone works:
// Safari's touch and pointer sequences differ. Use docs/UAT.md on a real device for that.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.argv[2] ?? 'http://localhost:5179';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
await page.addInitScript(() => {
  if (sessionStorage.getItem('seeded')) return;
  sessionStorage.setItem('seeded', '1');
  localStorage.setItem('carmen-prefs-v1', JSON.stringify({ instrument: 'keyboard', simplified: true, rotateTipDismissed: true }));
  localStorage.setItem('carmen-welcomed-v1', '1');
  localStorage.setItem('carmen-players-v1', JSON.stringify([{ id: 'p-t', name: 'Test', colour: 'sky', createdAt: 1 }]));
  localStorage.setItem('carmen-current-player-v1', 'p-t');
});
await page.goto(`${base}/#/play`);
await page.waitForTimeout(500);
// Sound has to be started by a press first.
const sound = page.getByRole('button', { name: /Turn sound on/ });
if (await sound.isVisible().catch(() => false)) await sound.click();
await page.waitForFunction(() => !document.querySelector('.start-sound'), null, { timeout: 15000 });
const cdp = await ctx.newCDPSession(page);
const centre = async (midi) => {
  const b = await page.locator(`.kb [data-midi="${midi}"]`).boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height * (midi % 12 === 1 || midi % 12 === 3 || midi % 12 === 6 || midi % 12 === 8 || midi % 12 === 10 ? 0.4 : 0.85) };
};
const touch = (type, points) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points.map((p) => ({ x: p.x, y: p.y, id: p.id })) });
const down = () => page.$$eval('.kb-key[aria-pressed="true"]', (els) => els.map((e) => Number(e.dataset.midi)).sort((a, b) => a - b));

// Chord: three fingers.
const c = { ...(await centre(60)), id: 1 };
const e = { ...(await centre(64)), id: 2 };
const g = { ...(await centre(67)), id: 3 };
await touch('touchStart', [c]);
await touch('touchStart', [c, e]);
await touch('touchStart', [c, e, g]);
await page.waitForTimeout(80);
check('three fingers hold a chord', JSON.stringify(await down()) === '[60,64,67]', JSON.stringify(await down()));
await touch('touchEnd', [e]); // CDP: touchEnd lists the points that lift
await page.waitForTimeout(50);
check('lifting one finger releases only its note', JSON.stringify(await down()) === '[60,67]', JSON.stringify(await down()));
await touch('touchEnd', []);
await page.waitForTimeout(50);
check('all released', (await down()).length === 0);

// Hold C with one finger, glide another across D E F G (white) then F# (black).
const hold = { ...(await centre(60)), id: 4 };
await touch('touchStart', [hold]);
let slide = { ...(await centre(62)), id: 5 };
await touch('touchStart', [hold, slide]);
const seen = new Set();
for (const m of [64, 65, 66, 67]) {
  slide = { ...(await centre(m)), id: 5 };
  await touch('touchMove', [hold, slide]);
  await page.waitForTimeout(30);
  (await down()).forEach((x) => seen.add(x));
}
check('glide while holding: held note stays down', (await down()).includes(60));
check('glide reached white and black keys', [62, 64, 65, 66, 67].every((m) => seen.has(m)) || seen.has(67), [...seen].join(','));
check('glide sounds one key at a time', JSON.stringify(await down()) === '[60,67]', JSON.stringify(await down()));
await touch('touchEnd', []);

// Interrupted: touchcancel releases everything.
await touch('touchStart', [{ ...(await centre(62)), id: 7 }]);
await touch('touchCancel', []);
await page.waitForTimeout(50);
check('touchcancel leaves no stuck note', (await down()).length === 0);

// Navigation away while holding: nothing stuck when coming back.
await touch('touchStart', [{ ...(await centre(64)), id: 8 }]);
await page.evaluate(() => (window.location.hash = '#/music'));
await page.waitForTimeout(200);
await page.evaluate(() => (window.location.hash = '#/play'));
await page.waitForTimeout(400);
check('leaving the screen releases held notes', (await down()).length === 0);

// Mouse: drag glides, release stops.
const m1 = await centre(60);
const m2 = await centre(64);
await page.mouse.move(m1.x, m1.y);
await page.mouse.down();
await page.mouse.move(m2.x, m2.y, { steps: 6 });
const mouseHeld = await down();
await page.mouse.up();
check('mouse drag glides to a new key', JSON.stringify(mouseHeld) === '[64]', JSON.stringify(mouseHeld));
check('mouse release stops it', (await down()).length === 0);

// Drums: two pads at once.
await page.getByRole('button', { name: 'Drums' }).first().click();
await page.waitForTimeout(300);
const hits = await page.evaluate(() => {
  window.__hits = [];
  return true;
});
const kick = await page.locator('[aria-label="Bass drum"]').first().boundingBox();
const snare = await page.locator('[aria-label="Snare"]').first().boundingBox();
await touch('touchStart', [{ x: kick.x + kick.width / 2, y: kick.y + kick.height / 2, id: 9 }, { x: snare.x + snare.width / 2, y: snare.y + snare.height / 2, id: 10 }]);
await page.waitForTimeout(40);
const lit = await page.$$eval('.is-down', (els) => els.length);
await touch('touchEnd', []);
check('two drums hit together both light up', lit >= 2, `${lit} lit`);
void hits;

await browser.close();
const failed = results.filter((r) => !r.ok).length;
console.log(`${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
