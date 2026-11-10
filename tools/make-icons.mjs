// Renders Carmen's app icons (PNG) from the same mark as public/favicon.svg.
// node tools/make-icons.mjs  →  public/icons/*.png
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
// Full-bleed square (iOS and Android round the corners themselves). `pad` shrinks the mark into the
// maskable safe zone.
const mark = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb3e6"/><stop offset=".55" stop-color="#e3b4d6"/><stop offset="1" stop-color="#fad3b2"/></linearGradient></defs><rect width="24" height="24" fill="url(#s)"/><g transform="translate(12 12) scale(${1 - pad}) translate(-12 -12)"><ellipse cx="13.5" cy="9.2" rx="4.6" ry="3.4" transform="rotate(-20 13.5 9.2)" fill="#f89777"/><g fill="none" stroke="#23264a" stroke-width="1.9" stroke-linecap="round"><path d="M3.5 15.2c2.8-2 5.7-2.4 8.5-1.1s5.7.9 8.5-.9"/><path d="M3.5 19.2c2.8-2 5.7-2.4 8.5-1.1s5.7.9 8.5-.9"/></g></g></svg>`;
const out = new URL('../public/icons/', import.meta.url).pathname;
const b = await chromium.launch();
const page = await b.newPage();
for (const [name, size, pad] of [['apple-touch-icon.png', 180, 0.12], ['icon-192.png', 192, 0.08], ['icon-512.png', 512, 0.08], ['icon-maskable-512.png', 512, 0.3]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0">${mark(pad).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  writeFileSync(out + name, await page.screenshot({ type: 'png', omitBackground: false }));
  console.log('wrote', name);
}
await b.close();
