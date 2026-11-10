// node tools/bench-listen/run.mjs  (needs: npm i --no-save pitchy@4.1.0 @spotify/basic-pitch@1.0.1 @tensorflow/tfjs@3)
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = new URL('.', import.meta.url).pathname;
const model = new URL('../../node_modules/@spotify/basic-pitch/model', import.meta.url).pathname;

if (existsSync(model)) cpSync(model, `${here}model`, { recursive: true });
const server = spawn('npx', ['vite', '--config', `${here}vite.config.mjs`], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3000));
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (m) => console.log('page:', m.text()));
await page.goto('http://localhost:5190/');
await page.waitForFunction(() => window.RESULT, null, { timeout: 600000 });
const result = await page.evaluate(() => window.RESULT);
await browser.close();
server.kill();
writeFileSync(`${here}result.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
