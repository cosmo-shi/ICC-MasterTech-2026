// Renders Carmen's app icons (PNG) and favicon from the approved logo (public/brand/carmen-mark.png):
// the white mark, unchanged, centred on a deep-ink tile. node tools/make-icons.mjs → public/icons/*.png, public/favicon.svg
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const markPng = readFileSync(new URL('../public/brand/carmen-mark.png', import.meta.url)).toString('base64');
const ASPECT = 480 / 231;
// Full-bleed square (iOS and Android round the corners themselves). `pad` shrinks the mark into the maskable safe zone.
const tile = (size, pad) => {
  const w = size * (1 - pad * 2);
  const h = w / ASPECT;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#23264a"/><image x="${(size - w) / 2}" y="${(size - h) / 2}" width="${w}" height="${h}" href="data:image/png;base64,${markPng}"/></svg>`;
};
const out = new URL('../public/icons/', import.meta.url).pathname;
const b = await chromium.launch();
const page = await b.newPage();
for (const [name, size, pad] of [['apple-touch-icon.png', 180, 0.12], ['icon-192.png', 192, 0.1], ['icon-512.png', 512, 0.1], ['icon-maskable-512.png', 512, 0.2], ['favicon-32.png', 32, 0.04]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0">${tile(size, pad)}</body></html>`);
  await page.waitForTimeout(100);
  writeFileSync(out + name, await page.screenshot({ type: 'png', omitBackground: false }));
  console.log('wrote', name);
}
await b.close();
// The SVG favicon: a rounded ink tile with the mark embedded (small copy of the same pixels).
writeFileSync(new URL('../public/favicon.svg', import.meta.url), tile(64, 0.06).replace('<rect ', '<rect rx="14" ') + '\n');
console.log('wrote favicon.svg');
