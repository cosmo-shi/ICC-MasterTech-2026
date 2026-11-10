// The brief's acceptance scenario, on two separate browser profiles (two "devices"):
// a teacher assigns on one device, a learner completes it on another, the teacher changes the
// learner's support, and the learner sees the change, surviving a refresh, the teacher's session
// renewing, going offline, and two teachers editing at once.
//
// Runs against tools/verify-db/server.mjs: real Postgres with Carmen's migrations and row-level
// security, behind a local stand-in for Supabase's sign-in and REST services. It does not prove a
// hosted Supabase project, real email delivery, or real phones (see docs/UAT.md).
//
//   ACCESS_TTL=90 node tools/verify-db/server.mjs &
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=local-anon-key npx vite --port 5182 &
//   node tools/e2e-classes.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = process.env.BASE ?? 'http://localhost:5182/';
const SVC = process.env.SVC ?? 'http://localhost:54321';
const SHOTS = process.env.SHOTS;
let fails = 0;
const ok = (c, m) => {
  console.log(`${c ? 'PASS' : 'FAIL'} ${m}`);
  if (!c) fails++;
};
const step = async (m, f) => {
  try {
    await f();
    ok(true, m);
  } catch (e) {
    ok(false, `${m}\n     ${String(e.message).split('\n')[0]}`);
    if (SHOTS) for (const [n, p] of Object.entries(pages)) await p.screenshot({ path: `${SHOTS}/fail-${fails}-${n}.png` }).catch(() => undefined);
  }
};
const pages = {};
const shot = async (p, n) => SHOTS && p.screenshot({ path: `${SHOTS}/${n}.png` });
const code = async (email) => (await (await fetch(`${SVC}/__stand-in/code?email=${encodeURIComponent(email)}`, { headers: { apikey: 'local-anon-key' } })).json()).code;

const b = await chromium.launch();
const watch = (p, who) => {
  p.setDefaultTimeout(10000);
  p.on('pageerror', (e) => console.log(`PAGEERROR (${who})`, String(e)));
  p.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && console.log(`CONSOLE (${who})`, m.text()));
};

// ---------- Device 1: the teacher's laptop ----------
const tctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
const t = await tctx.newPage();
pages.teacher = t;
watch(t, 'teacher');
const email = `lee${Date.now() % 100000}@school.edu.au`;
await step('teacher creates an account with a school email and a one-time code', async () => {
  await t.goto(`${BASE}#/teacher`);
  await t.getByRole('button', { name: 'Create account' }).click();
  await t.getByLabel('Your school email').fill(email);
  await t.getByRole('button', { name: 'Send me a code' }).click();
  await t.getByText('Check your email').waitFor();
  await t.getByLabel('Code').fill(await code(email));
  await t.getByRole('button', { name: 'Log in' }).click();
  await t.getByLabel(/Your name/).fill('Ms Lee');
  await t.getByRole('button', { name: 'Continue' }).click();
  await t.getByLabel('New space name').fill('Riverside Primary');
  await t.getByRole('button', { name: 'Make the space' }).click();
  await t.getByRole('tab', { name: 'Classes' }).waitFor();
});
let seat = '';
await step('teacher makes a class, adds a learner and gets their code', async () => {
  await t.getByLabel('New class').fill('3B Music');
  await t.getByRole('button', { name: 'Make the class' }).click();
  await t.getByRole('heading', { name: '3B Music' }).waitFor();
  await t.getByLabel('Add a learner').fill('Ari');
  await t.getByRole('button', { name: 'Add', exact: true }).click();
  await t.getByRole('button', { name: 'Get a code' }).click();
  seat = (await t.locator('.seat-code code').innerText()).trim();
  if (!/^[A-Z2-9]{6}$/.test(seat)) throw new Error(`code was ${seat}`);
});
await step('teacher previews and assigns “Keep a steady beat” to the class', async () => {
  await t.getByRole('button', { name: 'Assign an activity' }).click();
  await t.getByRole('combobox', { name: 'Activity', exact: true }).selectOption('L01');
  const preview = await t.getByRole('link', { name: 'Preview it as a learner' }).getAttribute('href');
  if (preview !== '#/lesson/L01') throw new Error(`preview ${preview}`);
  await t.getByLabel('A line for learners (optional)').fill('Steady beat with the metronome');
  await t.getByRole('button', { name: 'Assign', exact: true }).click();
  await t.locator('.assignment-line').getByText('whole class').waitFor();
  await t.getByText('Not joined yet').first().waitFor();
});
await shot(t, 'c1-teacher-board');

// ---------- Device 2: the learner's tablet ----------
const lctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
await lctx.addInitScript(() => {
  if (localStorage.getItem('carmen-players-v1')) return;
  localStorage.setItem('carmen-prefs-v1', JSON.stringify({ theme: 'light', saveOnDevice: true, pathway: '1-2', large: false, rotateTipDismissed: true }));
  localStorage.setItem('carmen-players-v1', JSON.stringify([{ id: 'p-mia', name: 'Mia', colour: 'mint', createdAt: 1, start: '1-2' }]));
  localStorage.setItem('carmen-current-player-v1', 'p-mia');
});
const l = await lctx.newPage();
pages.learner = l;
watch(l, 'learner');
await step('learner joins the class with the code (Settings, My class)', async () => {
  await l.goto(`${BASE}#/learn`);
  await l.getByRole('button', { name: /Settings/ }).first().click();
  await l.getByRole('button', { name: 'Join my class' }).click();
  await l.getByLabel('Class code').fill(seat.toLowerCase());
  await l.getByRole('button', { name: 'Join', exact: true }).click();
  await l.getByText('3B Music, as Ari').waitFor();
  await l.getByText('Up to date with your teacher.').waitFor();
});
await shot(l, 'c2-learner-joined');
await step('learner sees the assignment under “From your teacher”', async () => {
  await l.keyboard.press('Escape');
  await l.locator('.from-teacher-card').getByText('Steady beat with the metronome').waitFor();
});
await shot(l, 'c3-learner-from-teacher');

const prepL01 = async () => {
  await l.goto(`${BASE}#/lesson/L01`);
  await l.getByRole('button', { name: /^Continue$/ }).click();
  await l.getByRole('button', { name: /ready to try/ }).click();
};
const playL01 = async (prepared = false) => {
  if (!prepared) await prepL01();
  await l.getByRole('button', { name: /^Start$/ }).click();
  await l.waitForTimeout(3200);
  for (let i = 0; i < 4; i++) {
    await l.keyboard.press('a');
    await l.waitForTimeout(650);
  }
  await l.locator('dialog.feedback[open]').waitFor({ timeout: 12000 });
};
await step('learner plays the assigned activity on their device', () => playL01());
await shot(l, 'c4-learner-feedback');

await step('teacher’s board shows the learner’s try (live status)', async () => {
  await t.waitForTimeout(2500);
  await t.getByRole('button', { name: /Update/ }).click();
  await t.locator('.board-table').getByText(/Practising|May need support|Ready to move on/).waitFor();
});
await shot(t, 'c5-teacher-board-live');

await step('teacher reviews the learner, chooses the next activity and switches on Slower', async () => {
  await t.locator('.board-table').getByRole('button', { name: 'Ari' }).click();
  await t.getByText(/Practice: (passed|not yet)/).first().waitFor();
  await t.getByRole('combobox', { name: 'Next activity' }).selectOption('L02');
  await t.getByLabel(/^Slower/).check();
  await t.getByRole('combobox', { name: 'Keeping the beat' }).selectOption('practise');
  await t.getByRole('button', { name: 'Save for Ari' }).click();
  await t.getByText('Saved. Ari’s device gets it next time it’s online.').waitFor();
  await t.getByLabel('Add a note').fill('Strong pulse in class; rushes when excited.');
  await t.getByRole('button', { name: 'Add note' }).click();
  await t.getByText('rushes when excited').waitFor();
});
await shot(t, 'c6-teacher-review');

await step('after a refresh, the learner sees the teacher’s choice and the help is on', async () => {
  await l.goto(`${BASE}#/learn`);
  await l.reload();
  await l.locator('.resume').getByText('Your teacher picked this for you.').waitFor();
  const title = await l.locator('#resume-h').innerText();
  await l.goto(`${BASE}#/lesson/L02`);
  await l.locator('.from-teacher').getByText('Slower').waitFor();
  if (!title) throw new Error('no next title');
});
await shot(l, 'c7-learner-teacher-help');
const notesLeak = await l.evaluate(() => JSON.stringify(localStorage).includes('rushes when excited'));
ok(!notesLeak, 'the teacher’s private note is not on the learner’s device');

const linkState = () => l.evaluate(() => JSON.parse(localStorage.getItem('carmen-class-links-v1') ?? '{}')['p-mia']?.state);
await step('learner keeps working offline; it syncs when back online', async () => {
  // The learner's device loses its connection to the class service (the app itself is already
  // open; a school deploy serves it from the offline cache).
  await prepL01();
  await lctx.route(`${SVC}/**`, (r) => r.abort('internetdisconnected'));
  try {
    await playL01(true);
    await l.waitForTimeout(2500);
    const st = await linkState();
    if (st !== 'offline' && st !== 'pending') throw new Error(`state while offline: ${st}`);
    await l.keyboard.press('Escape');
    await shot(l, 'c8-learner-offline');
  } finally {
    await lctx.unroute(`${SVC}/**`);
  }
  await l.evaluate(() => window.dispatchEvent(new Event('online')));
  await l.waitForFunction(() => JSON.parse(localStorage.getItem('carmen-class-links-v1') ?? '{}')['p-mia']?.state === 'synced', null, { timeout: 15000 });
});

await step('teacher’s session renews by itself and the class is still there after a reload', async () => {
  const before = await t.evaluate(() => JSON.parse(localStorage.getItem('carmen-teacher-session-v1')).accessToken);
  await t.waitForTimeout(Number(process.env.RENEW_WAIT ?? 32000));
  await t.reload();
  await t.getByRole('tab', { name: 'Classes' }).click();
  await t.getByRole('button', { name: /3B Music/ }).click();
  await t.locator('.board-table').getByRole('button', { name: 'Ari' }).click();
  await t.getByText(/Practice: (passed|not yet)/).nth(1).waitFor();
  const after = await t.evaluate(() => JSON.parse(localStorage.getItem('carmen-teacher-session-v1')).accessToken);
  if (before === after) throw new Error('token was not renewed');
});

await step('two teachers editing at once: the later save is stopped and shown the newer plan', async () => {
  const t2 = await tctx.newPage();
  watch(t2, 'teacher tab 2');
  await t2.goto(`${BASE}#/teacher`);
  await t2.getByRole('button', { name: 'Continue' }).click(); // a new tab: already signed in
  await t2.getByRole('tab', { name: 'Classes' }).click();
  await t2.getByRole('button', { name: /3B Music/ }).click();
  await t2.locator('.board-table').getByRole('button', { name: 'Ari' }).click();
  await t2.getByRole('combobox', { name: 'Next activity' }).waitFor();
  await t.getByRole('combobox', { name: 'Next activity' }).selectOption('L03');
  await t.getByRole('button', { name: 'Save for Ari' }).click();
  await t.getByText('Saved.', { exact: false }).waitFor();
  await t2.getByLabel(/^Counting under the music/).check();
  await t2.getByRole('button', { name: 'Save for Ari' }).click();
  await t2.getByText('Another teacher changed this plan').waitFor();
  if ((await t2.getByRole('combobox', { name: 'Next activity' }).inputValue()) !== 'L03') throw new Error('newer plan not shown');
  await t2.getByText('Another teacher changed this plan').scrollIntoViewIfNeeded();
  await shot(t2, 'c9-teacher-conflict');
  await t2.close();
});

await step('the learner’s device gets the latest plan, and leaving the class unlinks it', async () => {
  await l.reload();
  await l.goto(`${BASE}#/learn`);
  await l.waitForTimeout(1500);
  const next = await l.evaluate(() => JSON.parse(localStorage.getItem('carmen-teacher-overrides-v1') ?? '{}')['p-mia']?.next);
  if (next !== 'L03') throw new Error(`next is ${next}`);
  await l.getByRole('button', { name: /Settings/ }).first().click();
  await l.getByRole('button', { name: 'Leave this class' }).click();
  await l.getByRole('button', { name: 'Leave', exact: true }).click();
  await l.getByRole('button', { name: 'Join my class' }).waitFor();
});
await step('teacher sees the device is no longer linked', async () => {
  await t.reload();
  await t.getByRole('tab', { name: 'Classes' }).click();
  await t.getByRole('button', { name: /3B Music/ }).click();
  await t.getByText('No device yet').waitFor();
});

await b.close();
console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
