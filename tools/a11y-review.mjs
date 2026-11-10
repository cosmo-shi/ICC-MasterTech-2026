// Design review accessibility pass: node tools/a11y-review.mjs '?look=a#/learn' ... (dev server on :5179).
// Checks per page: horizontal overflow, target size (>=44 css px both ways for buttons/links), text contrast (WCAG AA).
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const pages = process.argv.slice(2);
const sizes = [[320,640],[390,844],[820,1180],[1280,800],[740,360]];
const b = await chromium.launch();
const out = [];
for (const hash of pages) for (const [w,h] of sizes) for (const dark of [false,true]) for (const big of (w===390?[false,true]:[false])) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, hasTouch:w<900, isMobile:w<900, colorScheme: dark?'dark':'light' });
  const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.addInitScript(() => { localStorage.setItem('carmen-prefs-v1', JSON.stringify({ instrument: 'keyboard', rotateTipDismissed: true })); localStorage.setItem('carmen-players-v1', JSON.stringify([{ id: 'p-qa', name: 'QA', colour: 'sky', createdAt: 1 }])); localStorage.setItem('carmen-current-player-v1', 'p-qa'); });
  await p.goto('http://localhost:5179/'+hash); await p.waitForTimeout(1500);
  if (big) { await p.addStyleTag({ content: 'html{font-size:200% !important}' }); await p.waitForTimeout(300); }
  const r = await p.evaluate(() => {
    const parse = (c) => { let m = c.match(/rgba?\(([^)]+)\)/); if (m) { const v=m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0],v[1],v[2],v[3]??1]; }
      m = c.match(/color\(srgb ([^)]+)\)/); if (m) { const v=m[1].split(/[ /]+/).filter(Boolean).map(Number); return [v[0]*255,v[1]*255,v[2]*255,v[3]??1]; } return null; };
    const lum = ([r,g,b]) => { const f=(x)=>{x/=255;return x<=0.03928?x/12.92:((x+0.055)/1.055)**2.4}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
    const bgOf = (el) => { let stack=[]; for (let e=el;e;e=e.parentElement){ const c=parse(getComputedStyle(e).backgroundColor); if (c&&c[3]>0){ stack.push(c); if(c[3]>=1) break; } } let base=[255,255,255]; for (const c of stack.reverse()) base=base.map((v,i)=>v*(1-c[3])+c[i]*c[3]); return base; };
    const root = document.querySelector('.lx, .lp, .teacher-mode') || document.body;
    const bad=[]; const small=[];
    for (const el of root.querySelectorAll('*')) {
      const own = [...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()); if (!own) continue;
      const cs=getComputedStyle(el); if (cs.visibility==='hidden'||cs.display==='none'||el.closest('[aria-hidden="true"]')||el.closest('svg')) continue;
      const rect=el.getBoundingClientRect(); if (!rect.width) continue;
      const fg=parse(cs.color); if(!fg) continue; const bg=bgOf(el);
      const L1=lum(fg),L2=lum(bg); const ratio=(Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
      const px=parseFloat(cs.fontSize), bold=+cs.fontWeight>=700; const need=(px>=24||(px>=18.66&&bold))?3:4.5;
      if (ratio<need) bad.push(`${ratio.toFixed(2)} "${el.textContent.trim().slice(0,30)}"`);
    }
    for (const el of root.querySelectorAll('button, a[href], [role=radio]')) { const r=el.getBoundingClientRect(); if (!r.width||el.closest('[aria-hidden="true"]')||el.tabIndex<0) continue; if (r.height<44||r.width<44) small.push(`${Math.round(r.width)}x${Math.round(r.height)} ${el.textContent.trim().slice(0,20)||el.getAttribute('aria-label')}`); }
    return { overflow: document.documentElement.scrollWidth - innerWidth, bad: [...new Set(bad)].slice(0,8), small: [...new Set(small)].slice(0,6) };
  });
  const key=`${hash} ${w}x${h}${dark?' dark':''}${big?' 200%':''}`;
  out.push({key, ...r, errs: errs.slice(0,3)});
  await ctx.close();
}
await b.close();
for (const o of out) { const issues = (o.overflow>0?[`overflow ${o.overflow}px`]:[]).concat(o.bad.map(x=>'contrast '+x), o.small.map(x=>'target '+x), o.errs.map(x=>'console '+x)); console.log(issues.length?`FAIL ${o.key}\n  `+issues.join('\n  '):`ok   ${o.key}`); }
