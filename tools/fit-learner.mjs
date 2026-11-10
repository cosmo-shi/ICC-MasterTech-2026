// Fits the learner model's settings on simulated learners and writes them into
// src/data/skills.json ("params"), keeping the reviewed hand values as "startingParams".
// Then re-runs the evaluation so docs/learner-model-metrics.json matches.
// Run: npm run fit:learner   (never hand-edit the fitted numbers)
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const MARK = 'LEARNER_FIT_JSON:';
const r = spawnSync('npx vitest run src/ai/learner.fit.test.ts --silent=false', {
  encoding: 'utf8',
  shell: true,
  env: { ...process.env, VITE_FIT_LEARNER: '1' },
});
const line = (r.stdout ?? '').split(/\r?\n/).find((l) => l.includes(MARK));
if (!line) {
  process.stdout.write(r.stdout ?? '');
  process.stderr.write(r.stderr ?? '');
  console.error('Fitting failed; skills.json not changed.');
  process.exit(1);
}
const fit = JSON.parse(line.slice(line.indexOf(MARK) + MARK.length));

const file = new URL('../src/data/skills.json', import.meta.url);
const skills = JSON.parse(readFileSync(file, 'utf8'));
for (const s of skills.skills) {
  s.startingParams ??= s.params;
  s.params = fit.params[s.id];
}
skills.paramsSource = `Fitted by maximum likelihood to ${fit.learners} simulated learners x ${fit.attempts} tries (seed ${fit.trainSeed}) by npm run fit:learner. Simulated data only: not fitted to children. startingParams are the reviewed hand values.`;
writeFileSync(file, JSON.stringify(skills, null, 2) + '\n');
console.log('Wrote fitted settings to src/data/skills.json');

const ev = spawnSync('node tools/eval-learner.mjs', { stdio: 'inherit', shell: true });
process.exit(ev.status ?? 1);
