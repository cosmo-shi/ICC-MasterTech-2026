// Re-runs the worked model sequence and rewrites docs/MODEL_DECISIONS.md (never hand-edit it).
// Run: npm run decisions
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const r = spawnSync('npx vitest run src/ai/trace.test.ts --silent=false', { encoding: 'utf8', shell: true, env: { ...process.env, VITE_WRITE_DECISIONS: '1' } });
const line = (r.stdout ?? '').split(/\r?\n/).find((l) => l.includes('MODEL_DECISIONS_MD:'));
if (r.status !== 0 || !line) {
  process.stdout.write(r.stdout ?? '');
  console.error('Trace test failed; MODEL_DECISIONS.md not changed.');
  process.exit(1);
}
writeFileSync(new URL('../docs/MODEL_DECISIONS.md', import.meta.url), JSON.parse(line.slice(line.indexOf('MODEL_DECISIONS_MD:') + 'MODEL_DECISIONS_MD:'.length)));
console.log('Wrote docs/MODEL_DECISIONS.md');
