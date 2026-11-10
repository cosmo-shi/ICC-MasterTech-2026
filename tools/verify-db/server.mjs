// A local STAND-IN for a Supabase project, for end-to-end tests on one computer. The database is
// real Postgres with Carmen's migrations and row-level security (see run.mjs). In front of it:
//   * a minimal sign-in service shaped like Supabase Auth (one-time code, session, refresh,
//     sign-out). The code is printed here and readable at /__stand-in/code, instead of emailed;
//   * a minimal REST layer shaped like PostgREST: each request runs as its role with its JWT
//     claims, in one transaction, exactly as PostgREST does. It covers only the calls Carmen makes.
// It is NOT a deployment and NOT evidence that a hosted Supabase project is configured correctly.
//
//   node tools/verify-db/server.mjs        → http://localhost:54321, anon key "local-anon-key"
//   env: PORT, PG_PORT, ANON_KEY, ACCESS_TTL (seconds, default 3600)
import { createHmac, randomBytes, randomInt } from 'node:crypto';
import { createServer } from 'node:http';
import { startDatabase } from './pg.mjs';

const PORT = Number(process.env.PORT ?? 54321);
const ANON_KEY = process.env.ANON_KEY ?? 'local-anon-key';
const ACCESS_TTL = Number(process.env.ACCESS_TTL ?? 3600);
const SECRET = randomBytes(32);

const db = startDatabase({ port: Number(process.env.PG_PORT ?? 54330) });
db.applyMigrations();
db.admin(`insert into public.allowed_email_domains values ('school.edu.au') on conflict do nothing;`);

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const sign = (claims) => {
  const head = b64({ alg: 'HS256', typ: 'JWT' });
  const body = b64(claims);
  return `${head}.${body}.${createHmac('sha256', SECRET).update(`${head}.${body}`).digest('base64url')}`;
};
function verify(tok) {
  const [h, b, s] = tok.split('.');
  if (!s || createHmac('sha256', SECRET).update(`${h}.${b}`).digest('base64url') !== s) return { error: 'invalid JWT' };
  const c = JSON.parse(Buffer.from(b, 'base64url').toString());
  if (c.exp * 1000 < Date.now()) return { error: 'JWT expired' };
  return { claims: c };
}

const codes = new Map(); // email → code
const refresh = new Map(); // refresh token → user id
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

function issue(userId, email) {
  const rt = randomBytes(24).toString('hex');
  refresh.set(rt, { userId, email });
  const now = Math.floor(Date.now() / 1000);
  return { access_token: sign({ sub: userId, role: 'authenticated', email, iat: now, exp: now + ACCESS_TTL }), token_type: 'bearer', expires_in: ACCESS_TTL, refresh_token: rt, user: { id: userId, email } };
}

const fnCache = new Map();
function signature(name) {
  if (!fnCache.has(name)) {
    const out = db.admin(`select to_jsonb(x) from (select coalesce(p.proargnames, '{}') as names, array(select format_type(t, null) from unnest(p.proargtypes) t) as types, p.proretset as set, format_type(p.prorettype, null) as ret from pg_proc p where p.pronamespace = 'public'::regnamespace and p.proname = ${q(name)} limit 1) x;`).trim();
    fnCache.set(name, out ? JSON.parse(out) : null);
  }
  return fnCache.get(name);
}

function rpcSql(name, body) {
  const sig = signature(name);
  if (!sig) return null;
  const args = sig.types
    .map((type, i) => [sig.names[i], type])
    .filter(([n]) => n in body)
    .map(([n, type]) => {
      const v = `(:'body'::jsonb -> ${q(n)})`;
      if (type === 'jsonb') return `${n} => ${v}`;
      if (type.endsWith('[]')) return `${n} => (case when jsonb_typeof(${v}) = 'array' then (select array_agg(x)::${type} from jsonb_array_elements_text(${v}) x) end)`;
      return `${n} => (:'body'::jsonb ->> ${q(n)})::${type}`;
    })
    .join(', ');
  const call = `public.${name}(${args})`;
  if (sig.set) return `select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) from ${call} r;`;
  if (sig.ret === 'void') return `select ${call} \\g /dev/null\nselect 'null';`;
  return `select coalesce(to_jsonb(${call}), 'null'::jsonb);`;
}

const pkCache = new Map();
const primaryKey = (t) => {
  if (!pkCache.has(t)) pkCache.set(t, db.admin(`select string_agg(a.attname, ',') from pg_index i join pg_attribute a on a.attrelid = i.indrelid and a.attnum = any (i.indkey) where i.indrelid = ${q(`public.${t}`)}::regclass and i.indisprimary;`).trim());
  return pkCache.get(t);
};

function status(r, user) {
  if (r.code === '42501') return user ? 403 : 401;
  if (r.code === '28000') return 403;
  if (r.code === '42883' || r.code === '42P01') return 404;
  return 400;
}

const server = createServer(async (req, res) => {
  const send = (code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'apikey, authorization, content-type, prefer, x-client-info', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS' });
    res.end(data === undefined ? '' : JSON.stringify(data));
  };
  if (req.method === 'OPTIONS') return send(204);
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let raw = '';
  for await (const c of req) raw += c;
  const body = raw ? JSON.parse(raw) : {};
  if (req.headers.apikey !== ANON_KEY) return send(401, { message: 'No API key found in request' });

  // ---- sign-in stand-in ----
  if (url.pathname === '/__stand-in/code') return send(200, { code: codes.get(url.searchParams.get('email')) ?? null });
  if (url.pathname === '/auth/v1/otp') {
    const email = String(body.email ?? '').toLowerCase();
    const exists = db.admin(`select count(*) from auth.users where email = ${q(email)};`).trim() === '1';
    if (!exists) {
      if (!body.create_user) return send(422, { msg: 'Signups not allowed for otp' });
      try {
        db.admin(`insert into auth.users (email) values (${q(email)});`);
      } catch {
        return send(500, { msg: 'Database error saving new user' });
      }
    }
    const code = String(randomInt(0, 1e6)).padStart(6, '0');
    codes.set(email, code);
    console.log(`[stand-in] sign-in code for ${email}: ${code}`);
    return send(200, {});
  }
  if (url.pathname === '/auth/v1/verify') {
    const email = String(body.email ?? '').toLowerCase();
    if (!codes.has(email) || codes.get(email) !== body.token) return send(403, { msg: 'Token has expired or is invalid' });
    codes.delete(email);
    const id = db.admin(`select id from auth.users where email = ${q(email)};`).trim();
    return send(200, issue(id, email));
  }
  if (url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'refresh_token') {
    const r = refresh.get(body.refresh_token);
    if (!r) return send(400, { msg: 'Invalid Refresh Token: Refresh Token Not Found' });
    refresh.delete(body.refresh_token); // rotation: each refresh token works once
    return send(200, issue(r.userId, r.email));
  }

  // ---- who is calling ----
  const bearer = (req.headers.authorization ?? '').replace(/^Bearer\s+/i, '');
  let user = null;
  if (bearer && bearer !== ANON_KEY) {
    const v = verify(bearer);
    if (v.error) return send(401, { code: 'PGRST301', message: v.error });
    user = v.claims.sub;
  }
  if (url.pathname === '/auth/v1/logout') {
    for (const [k, v] of refresh) if (v.userId === user) refresh.delete(k);
    return send(204);
  }

  // ---- REST stand-in ----
  const rpc = /^\/rest\/v1\/rpc\/([a-z_]+)$/.exec(url.pathname);
  if (rpc && req.method === 'POST') {
    const sql = rpcSql(rpc[1], body);
    if (!sql) return send(404, { code: 'PGRST202', message: `Could not find the function public.${rpc[1]}` });
    const r = db.as(user, sql, { body: JSON.stringify(body) });
    return r.ok ? send(200, JSON.parse(r.out || 'null')) : send(status(r, user), { code: r.code, message: r.message });
  }
  const tbl = /^\/rest\/v1\/([a-z_]+)$/.exec(url.pathname);
  if (tbl && req.method === 'GET') {
    const cols = (url.searchParams.get('select') ?? '*').split(',').filter((c) => /^([a-z_]+|\*)$/.test(c));
    const where = [];
    const vars = {};
    for (const [k, v] of url.searchParams) {
      if (k === 'select' || !/^[a-z_]+$/.test(k) || !v.startsWith('eq.')) continue;
      vars[`v${where.length}`] = v.slice(3);
      where.push(`${k}::text = :'v${where.length}'`);
    }
    const r = db.as(user, `select coalesce(jsonb_agg(to_jsonb(t)), '[]'::jsonb) from (select ${cols.join(', ') || '*'} from public.${tbl[1]}${where.length ? ` where ${where.join(' and ')}` : ''}) t;`, vars);
    return r.ok ? send(200, JSON.parse(r.out)) : send(status(r, user), { code: r.code, message: r.message });
  }
  if (tbl && req.method === 'POST') {
    const rows = Array.isArray(body) ? body : [body];
    const cols = Object.keys(rows[0] ?? {}).filter((c) => /^[a-z_]+$/.test(c));
    const upsert = /merge-duplicates/.test(req.headers.prefer ?? '');
    const pk = primaryKey(tbl[1]);
    const sql = `insert into public.${tbl[1]} (${cols.join(', ')}) select ${cols.join(', ')} from jsonb_populate_recordset(null::public.${tbl[1]}, :'body'::jsonb)${upsert ? ` on conflict (${pk}) do update set ${cols.filter((c) => !pk.split(',').includes(c)).map((c) => `${c} = excluded.${c}`).join(', ')}` : ''};`;
    const r = db.as(user, sql, { body: JSON.stringify(rows) });
    return r.ok ? send(201) : send(status(r, user), { code: r.code, message: r.message });
  }
  return send(404, { message: 'Not part of the stand-in' });
});

server.listen(PORT, () => console.log(`[stand-in] Carmen service on http://localhost:${PORT} (real Postgres, stand-in sign-in and REST). Anon key: ${ANON_KEY}`));
const stop = () => {
  server.close();
  db.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
