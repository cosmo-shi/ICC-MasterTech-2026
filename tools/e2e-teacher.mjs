// Teacher account flow against a stand-in for the sign-in service (Playwright intercepts the calls).
// It checks the app's side: the requests it makes, the steps, the session and sign-out. It does
// not test a real Supabase project or its row-level security (see supabase/ and docs/SERVICES.md).
// Start: VITE_SUPABASE_URL=https://fake-carmen.supabase.co VITE_SUPABASE_ANON_KEY=anon-test npx vite --port 5181
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = process.env.BASE ?? 'http://localhost:5181/';
let fails = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
page.setDefaultTimeout(8000);
page.on('pageerror', (e) => console.log('PAGEERROR', String(e)));
page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()));
const seen = [];
let profile = null;
const spaces = [];
await page.route('https://fake-carmen.supabase.co/**', async (route) => {
  const r = route.request();
  const url = r.url();
  const body = r.postData() ? JSON.parse(r.postData()) : null;
  seen.push({ url: url.replace('https://fake-carmen.supabase.co', ''), body, auth: r.headers()['authorization'] ?? null, apikey: r.headers()['apikey'] });
  const json = (status, data) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) });
  if (url.includes('/auth/v1/otp')) return json(200, {});
  if (url.includes('/auth/v1/verify')) return body.token === '123456' ? json(200, { access_token: 'AT', refresh_token: 'RT', expires_in: 3600, user: { id: 'u1', email: body.email } }) : json(401, { msg: 'Token has expired or is invalid' });
  if (url.includes('/rest/v1/teachers') && r.method() === 'GET') return json(200, profile ? [profile] : []);
  if (url.includes('/rest/v1/teachers')) { profile = { id: 'u1', ...body }; return json(201, {}); }
  if (url.includes('/rpc/my_spaces')) return json(200, spaces);
  if (url.includes('/rpc/create_space')) { const s = { id: 's1', name: body.space_name, join_code: 'K7MQ2PXA', role: 'owner' }; spaces.push(s); return json(200, [s]); }
  if (url.includes('/auth/v1/logout')) return json(204, {});
  return json(404, {});
});
await page.goto(`${BASE}#/teacher`);
await page.getByRole('button', { name: 'Create account' }).click();
await page.getByLabel('Your school email').fill('Ms.Lee@School.edu.au');
await page.getByRole('button', { name: 'Send me a code' }).click();
await page.getByText('Check your email').waitFor();
const otp = seen.find((s) => s.url === '/auth/v1/otp');
ok(otp && otp.body.create_user === true && otp.body.email === 'ms.lee@school.edu.au' && otp.apikey === 'anon-test' && !otp.auth, 'code requested with the public key only');
await page.getByLabel('Code').fill('111111');
await page.getByRole('button', { name: 'Log in' }).click();
await page.getByText(/That code didn’t work/).waitFor().then(() => ok(true, 'a wrong code is explained'), () => ok(false, 'a wrong code is explained'));
await page.getByLabel('Code').fill('123456');
await page.getByRole('button', { name: 'Log in' }).click();
await page.getByRole('heading', { name: 'Welcome' }).waitFor().catch(async (e) => { console.log(JSON.stringify(seen)); console.log(await page.locator('main').innerText()); throw e; });
ok(true, 'first use asks for a name');
await page.getByLabel(/Your name/).fill('Ms Lee');
await page.getByRole('button', { name: 'Continue' }).click();
await page.getByRole('heading', { name: 'Your teaching space' }).waitFor();
await page.getByLabel('New space name').fill('Year 3 Music');
await page.getByRole('button', { name: 'Make the space' }).click();
await page.getByText('Year 3 Music').waitFor().then(() => ok(true, 'teacher space opens with the space name'), () => ok(false, 'teacher space opens with the space name'));
ok(await page.getByText('K7MQ2PXA').isVisible(), 'owner sees the join code');
ok(seen.filter((s) => s.url.startsWith('/rest/')).every((s) => s.auth === 'Bearer AT'), 'data calls carry the teacher session');
if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT });
await page.getByRole('button', { name: 'Sign out' }).click();
await page.waitForTimeout(400);
ok(seen.some((s) => s.url === '/auth/v1/logout'), 'sign-out reaches the service');
const stored = await page.evaluate(() => localStorage.getItem('carmen-teacher-session-v1'));
ok(stored === null, 'session removed from the device');
await b.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
