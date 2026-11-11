"""List learner- and teacher-facing string literals that changed between main (a85bbd5) and this branch.
Run from the repo root: python3 docs/review/2026-11-11/copy-diff.py > docs/review/2026-11-11/copy-diff.md"""
import re, subprocess, sys
BASE = sys.argv[1] if len(sys.argv) > 1 else 'a85bbd5'
files = subprocess.run(['git', 'diff', '--name-only', BASE, '--', 'src'], capture_output=True, text=True).stdout.split()
files = [f for f in files if re.search(r'\.(tsx?|json)$', f) and '.test.' not in f and 'curriculumAlignment' not in f]
lit = re.compile(r"'((?:[^'\\\n]|\\.){12,})'|\"((?:[^\"\\\n]|\\.){12,})\"|`((?:[^`\\]|\\.){12,})`|>\s*([A-Z][^<>{}]{11,}?)\s*<")
def strings(src):
    out = []
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    src = re.sub(r'(^|\s)//[^\n]*', r'\1', src)
    src = re.sub(r'\{/\*.*?\*/\}', '', src, flags=re.S)
    for m in lit.finditer(src):
        s = re.sub(r'\s+', ' ', next(g for g in m.groups() if g))
        s = s.replace("\\'", "'").replace('\\u2019', '’').strip()
        # Words people read: has a space and a letter; not a class list, path, import or CSS.
        if ' ' not in s or not re.search(r'[A-Za-z]{3}', s): continue
        if re.match(r'^[a-z0-9-]+( [a-z0-9-]+)*$', s): continue  # class names
        if re.search(r'^(\.|/|@|import |var\(|calc\()|=>|\(max-|\(min-|orientation', s): continue
        out.append(s)
    return out
def show(rev, p):
    r = subprocess.run(['git', 'show', f'{rev}:{p}'], capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else ''
print('| File | Before (removed) | After (added) |\n|---|---|---|')
for f in files:
    old, new = strings(show(BASE, f)), strings(open(f).read())
    gone = [s for s in old if s not in new]
    came = [s for s in new if s not in old]
    for i in range(max(len(gone), len(came))):
        a = gone[i] if i < len(gone) else ''
        b = came[i] if i < len(came) else ''
        e = lambda s: s.replace('|', '\\|').replace('\n', ' ')
        print(f'| `{f.removeprefix("src/")}` | {e(a)} | {e(b)} |')
