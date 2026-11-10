/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// Strict Content-Security-Policy for the built app only. The dev server injects an
// inline React refresh script, so the policy is not applied there.
// connect-src allows only this site, plus the teacher sign-in service when one is configured.
// Recordings play from blob: URLs made on the device.
const cspFor = (authOrigin: string | null) => [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data:",
  "media-src 'self' blob:",
  `connect-src 'self'${authOrigin ? ` ${authOrigin}` : ''}`,
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ')

const csp = (CSP: string): Plugin => ({
  name: 'carmen-csp',
  apply: 'build',
  transformIndexHtml: (html) => html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
})

// Offline support: after the build, write a service worker that caches every built
// file and every public file (sounds, fonts) on first visit, so lessons, sounds and the
// on-device model keep working without a connection. Nothing is sent anywhere.
const listFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f)
    return statSync(full).isDirectory() ? listFiles(full) : [full]
  })

const offline = (): Plugin => ({
  name: 'carmen-offline',
  apply: 'build',
  generateBundle(_options, bundle) {
    const publicFiles = listFiles('public')
      .map((f) => relative('public', f).split('\\').join('/'))
      .filter((f) => !/(^|\/)(OFL|LICENSE)[^/]*\.txt$/i.test(f))
    const files = ['./', ...Object.keys(bundle).filter((f) => f !== 'sw.js'), ...publicFiles].map((f) => (f === './' ? f : `./${f}`))
    const version = createHash('sha256').update(files.join('\n')).digest('hex').slice(0, 12)
    const source = `// Generated at build time by vite.config.ts. Caches Carmen for offline use.
const CACHE = 'carmen-${version}';
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('carmen-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Pages: network first, so a new version shows on the next load; the cached copy is the offline fallback.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./', { ignoreVary: true })));
    return;
  }
  // Built files have hashed names, so cache first is safe for them.
  e.respondWith(
    caches.match(req, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(req).catch(() => Response.error())),
  );
});
`
    this.emitFile({ type: 'asset', fileName: 'sw.js', source })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  let authOrigin: string | null = null
  try {
    if (env.VITE_SUPABASE_URL?.startsWith('https://')) authOrigin = new URL(env.VITE_SUPABASE_URL).origin
  } catch {
    authOrigin = null
  }
  return {
  plugins: [react(), csp(cspFor(authOrigin)), offline()],
  build: {
    // The notation chunk (VexFlow with its embedded music font) is large but loaded on demand.
    chunkSizeWarningLimit: 800,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
  }
})
