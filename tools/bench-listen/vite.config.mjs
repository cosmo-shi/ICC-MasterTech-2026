import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
// Serves the benchmark page with Carmen's public audio and the Basic Pitch model.
const root = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig({
  root,
  publicDir: fileURLToPath(new URL('../../public', import.meta.url)),
  server: { port: 5190, strictPort: true, fs: { allow: [fileURLToPath(new URL('../..', import.meta.url))] } },
});
