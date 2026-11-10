// Smoke test of "Use my instrument" with Chromium's fake microphone (a looping WAV file).
// node tools/e2e-listen.mjs <piano.wav> <taps.wav>  (dev server on :5179)
// Proves the flow and that nothing leaves the page; it says nothing about real phones or rooms.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [pianoWav, tapWav] = process.argv.slice(2);
const BASE = process.env.BASE ?? 'http://localhost:5179/';
let fails = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };

async function run(wav, fn) {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${wav}`, '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['microphone'] });
  await ctx.addInitScript(() => { localStorage.setItem('carmen-welcomed-v1', '1'); localStorage.setItem('carmen-prefs-v1', JSON.stringify({ saveOnDevice: true })); localStorage.setItem('carmen-players-v1', '[]'); localStorage.setItem('carmen-current-player-v1', 'guest'); });
  const page = await ctx.newPage();
  page.setDefaultTimeout(8000);
  const offsite = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (u.host !== new URL(BASE).host && u.protocol !== 'data:' && u.protocol !== 'blob:') offsite.push(r.url()); });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`${BASE}#/play/instrument`);
  await fn(page);
  ok(offsite.length === 0, `no requests left the device (${offsite.length})`);
  ok(errors.length === 0, `no page errors ${errors.slice(0, 3).join(' | ')}`);
  await browser.close();
}

await run(pianoWav, async (page) => {
  await page.getByRole('button', { name: /Piano or keyboard/ }).click();
  await page.getByRole('button', { name: /Microphone/ }).click();
  await page.getByText('Check the microphone').waitFor({ timeout: 8000 });
  ok(await page.getByText('Listening', { exact: false }).first().isVisible(), 'visible Listening state with Stop');
  await page.getByText(/Carmen heard a note: C/).waitFor({ timeout: 10000 }).then(() => ok(true, 'heard the piano C from the microphone'), () => ok(false, 'heard the piano C from the microphone'));
  await page.getByRole('button', { name: /Carry on/ }).click();
  await page.getByRole('button', { name: /Play a note/ }).click();
  await page.getByRole('button', { name: /Play it/ }).click();
  const fb = await page.locator('.fb-what').textContent({ timeout: 10000 }).catch(() => '');
  ok(/That was C/.test(fb ?? ''), `note feedback: "${fb}"`);
  if (process.env.SHOT_DIR) await page.screenshot({ path: `${process.env.SHOT_DIR}/listen-note.png` });
  // Leaving stops the microphone.
  await page.goto(`${BASE}#/learn`);
  await page.waitForTimeout(500);
  const live = await page.evaluate(() => document.querySelectorAll('.mic-dot').length);
  ok(live === 0, 'leaving the screen stops listening');
});

await run(tapWav, async (page) => {
  await page.getByRole('button', { name: /A drum, or tapping a table/ }).click();
  await page.getByRole('button', { name: /Microphone/ }).click();
  await page.getByText(/Carmen heard a tap/).waitFor({ timeout: 10000 }).then(() => ok(true, 'heard taps'), () => ok(false, 'heard taps'));
  await page.getByRole('button', { name: /Carry on/ }).click();
  await page.getByRole('button', { name: /Free play/ }).click();
  await page.getByRole('button', { name: /^Start$/ }).click();
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: /finished/ }).click();
  const fb = await page.locator('.fb-what').textContent().catch(() => '');
  ok(/taps in \d+ seconds/.test(fb ?? '') && /even/.test(fb ?? ''), `free taps described: "${fb}"`);
  // Record is separate from listening, and saving is explicit.
  await page.getByRole('button', { name: /^Record$/ }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /Stop recording/ }).click();
  await page.getByRole('button', { name: /^Save$/ }).click({ timeout: 5000 });
  await page.getByText(/Saved in My music|until Carmen closes/).waitFor({ timeout: 5000 }).then(() => ok(true, 'recording saved on the device'), () => ok(false, 'recording saved on the device'));
  const n = await page.evaluate(() => new Promise((res) => { const r = indexedDB.open('carmen-local'); r.onerror = () => res(-1); r.onsuccess = () => { const db = r.result; if (!db.objectStoreNames.contains('recordings')) return res(`no store (v${db.version})`); const t = db.transaction('recordings').objectStore('recordings').count(); t.onsuccess = () => res(t.result); }; }));
  ok(n === 1, `one recording in IndexedDB (${n})`);
  if (process.env.SHOT_DIR) await page.screenshot({ path: `${process.env.SHOT_DIR}/listen-taps.png` });
});

console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
