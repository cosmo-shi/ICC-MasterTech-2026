// A throwaway local Postgres for verification, and a way to run SQL exactly as PostgREST does for
// a request: inside a transaction, as the request's role, with its JWT claims set.
// Needs the Postgres server binaries (initdb, pg_ctl, psql). Set PG_BIN if they are not found.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('../../', import.meta.url).pathname;

function pgBin() {
  if (process.env.PG_BIN) return process.env.PG_BIN;
  const base = '/usr/lib/postgresql';
  if (existsSync(base)) {
    const v = readdirSync(base).sort((a, b) => Number(b) - Number(a))[0];
    if (v) return join(base, v, 'bin');
  }
  return ''; // rely on PATH
}

export function startDatabase({ port = 54329 } = {}) {
  const bin = pgBin();
  const exe = (n) => (bin ? join(bin, n) : n);
  const dir = mkdtempSync(join(tmpdir(), 'carmen-db-'));
  const data = join(dir, 'data');
  // Postgres refuses to run as root; run it as the owner of the temp folder when we are root.
  const asUser = process.getuid?.() === 0 ? 'nobody' : null;
  if (asUser) spawnSync('chown', ['-R', asUser, dir]);
  const wrap = (cmd, args) => (asUser ? ['runuser', ['-u', asUser, '--', exe(cmd), ...args]] : [exe(cmd), args]);
  const sh = (cmd, args) => {
    const [c, a] = wrap(cmd, args);
    const r = spawnSync(c, a, { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`${cmd} failed: ${r.stderr || r.stdout || r.error}`);
    return r.stdout;
  };
  sh('initdb', ['-D', data, '-U', 'postgres', '--auth=trust', '-E', 'UTF8', '--no-locale']);
  sh('pg_ctl', ['-D', data, '-l', join(dir, 'log.txt'), '-w', '-o', `-p ${port} -k ${dir} -c listen_addresses=''`, 'start']);
  const db = {
    dir,
    port,
    /** Run SQL as the database owner (setup). Returns stdout; throws with the server's message. */
    admin(sql) {
      return psql(exe, dir, port, sql);
    },
    /**
     * Run SQL as a request would: role anon (no user) or authenticated (with a user id), claims set
     * for this transaction only. Returns { ok, out, code, message }.
     */
    as(user, sql, vars = {}) {
      const role = user ? 'authenticated' : 'anon';
      const claims = JSON.stringify(user ? { sub: user, role } : { role });
      const wrapped = `begin;\nset local role ${role};\nselect set_config('request.jwt.claims', :'claims', true) \\g /dev/null\n${sql}\ncommit;\n`;
      try {
        return { ok: true, out: psql(exe, dir, port, wrapped, { ...vars, claims }).trim() };
      } catch (e) {
        const m = /ERROR:\s+([0-9A-Z]{5}):\s+(.*)/.exec(String(e.message));
        return { ok: false, out: '', code: m?.[1] ?? '', message: m?.[2] ?? String(e.message) };
      }
    },
    applyMigrations() {
      psql(exe, dir, port, readFileSync(join(ROOT, 'tools/verify-db/stub-supabase.sql'), 'utf8'));
      const migDir = join(ROOT, 'supabase/migrations');
      for (const f of readdirSync(migDir).filter((f) => f.endsWith('.sql')).sort()) psql(exe, dir, port, readFileSync(join(migDir, f), 'utf8'));
    },
    stop() {
      try {
        sh('pg_ctl', ['-D', data, '-m', 'fast', '-w', 'stop']);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    },
  };
  return db;
}

function psql(exe, host, port, sql, vars = {}) {
  const args = ['-h', host, '-p', String(port), '-U', 'postgres', '-d', 'postgres', '-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose'];
  for (const [k, v] of Object.entries(vars)) args.push('-v', `${k}=${v}`);
  const r = spawnSync(exe('psql'), [...args, '-f', '-'], { input: `\\set VERBOSITY verbose\n${sql}`, encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout || String(r.error));
  return r.stdout;
}
