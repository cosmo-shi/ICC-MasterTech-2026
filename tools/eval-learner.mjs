// Re-runs the seeded learner model evaluation and rewrites docs/learner-model-metrics.json.
// Run: npm run eval:learner   (never hand-edit the metrics file)
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const r = spawnSync('npx vitest run src/ai/learner.eval.test.ts --silent=false', {
  encoding: 'utf8',
  shell: true,
  env: { ...process.env, VITE_WRITE_LEARNER_METRICS: '1' },
});
process.stdout.write(r.stdout ?? '');
process.stderr.write(r.stderr ?? '');
const line = (r.stdout ?? '').split(/\r?\n/).find((l) => l.includes('LEARNER_METRICS_JSON:'));
if (r.status !== 0 || !line) {
  console.error('Evaluation failed; metrics file not changed.');
  process.exit(1);
}
const metrics = JSON.parse(line.slice(line.indexOf('LEARNER_METRICS_JSON:') + 'LEARNER_METRICS_JSON:'.length));
writeFileSync(new URL('../docs/learner-model-metrics.json', import.meta.url), JSON.stringify(metrics, null, 2) + '\n');
console.log('Wrote docs/learner-model-metrics.json');
