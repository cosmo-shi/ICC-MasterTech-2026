# Team guide: building the music app together with Claude Code

For three people, beginner level. Uses the same tools as the last guide: Claude Code, the design skills, Vitest, Playwright, GitHub and Vercel. This guide adds what changes when three people share one project.

Files that go with this guide: `SPEC.md` (what to build) and `CLAUDE.md` (rules Claude Code follows). Both come from the team's Miro requirements spec.

---

## 0. Before anything: confirm these with your team

Open `SPEC.md` section 2. It lists six decisions where the new Miro spec and your earlier chat notes disagree (three instruments or two, drum pads or a kit picture, how sounds are made, which stack, lesson locking, how the coach works). I filled in a default for each. Spend 10 minutes agreeing or changing them. Edit the table in `SPEC.md` if anything changes, because Claude Code follows that table.

Also ask the organisers whether you may write code before the three build days. Installing tools and downloading sounds and images is almost certainly fine. Writing the app may not be.

---

## 1. How a shared setup works (the idea in plain words)

- There is **one copy of the project on GitHub**. Each of you has your own copy on your laptop.
- Each of you runs **your own Claude Code** on your own laptop. There is no shared Claude Code session.
- Claude Code reads the rules from files inside the project. If those files are in Git, **all three Claude Codes follow the same rules**. That is how you share your setup.
- You send your work to GitHub and take your teammates' work from GitHub. This is called pushing and pulling.

### What is shared through Git, and what stays personal

| File or folder | What it does | Shared? |
|---|---|---|
| `CLAUDE.md` | Rules Claude Code reads every session | Yes, commit it |
| `SPEC.md` | The build list | Yes, commit it |
| `ASSETS.md` | Every sound and image with its licence | Yes, commit it |
| `.claude/skills/` | The design and writing skills | Yes, if the install put them here (check in section 3) |
| `.mcp.json` | Project tools such as Playwright | Yes, commit it |
| `.claude/settings.json` | Team permissions (what Claude may run without asking) | Yes, commit it |
| `.claude/settings.local.json` | Your own overrides | No, Claude Code keeps it out of Git |
| `CLAUDE.local.md` | Your own private notes to Claude | No, add it to `.gitignore` |
| `.env` or `.env.local` | Secrets | No, never. The demo needs none |

These locations come from the Claude Code settings documentation.

---

## 2. Roles and who owns which folder

Most merge problems happen when two people edit the same file. Give each person their own folders.

| Person | Owns | Milestones |
|---|---|---|
| **A: Instruments and audio** | `src/instruments/`, `public/audio/`, `src/data/instruments/` | 2 (keyboard), 3 (drums), 4 (guitar), 10 (offline) |
| **B: Lessons, engine and coach** | `src/engine/`, `src/coach/`, `src/data/lessons/`, `src/data/coach/` | 5, 6, 7, 8 |
| **C: Shell, design, access and mock screens** | `src/screens/`, `src/components/` (except stave and coach panel), `src/settings/`, `src/data/mock/`, `public/images/` | 0, 1, 9, 11, 12 |

Shared files nobody edits casually: `package.json`, `CLAUDE.md`, `SPEC.md`, `ASSETS.md`, `src/data/config.json`. Change them in a small commit of their own and tell the others.

Person C builds Milestone 0 first and creates the routing file with **every screen already listed as a placeholder**. After that, nobody needs to edit the routing file. A and B only fill in their own screens and folders.

Tell Claude Code who you are at the start of each session, for example: "I am Person B. I own src/engine, src/coach and src/data/lessons. Do not edit anything else."

---

## 3. One-time setup (Person C does steps 1 to 6, then A and B do step 7)

### 3.1 Install the basics on every laptop
Same as the last guide. Each laptop needs Node.js 22 or newer, Git, a GitHub account, and Claude Code.

```bash
node -v      # should print v22 or higher
git --version
claude --version
```

Install Claude Code (pick one):
```bash
curl -fsSL https://claude.ai/install.sh | bash        # macOS, Linux, WSL
irm https://claude.ai/install.ps1 | iex                # Windows PowerShell
```
Claude Code needs a paid Claude plan or a Console account with API billing. Check each teammate's account before the build days. Details: https://code.claude.com/docs

### 3.2 Create the project (Person C only)
```bash
npm create vite@latest music-app -- --template react-ts
cd music-app
npm install
npm install tone
npm install -D vitest
git init
git add .
git commit -m "Initial project"
```
Create an empty repository on GitHub, then follow the commands GitHub shows to push. Add your two teammates as collaborators (GitHub: Settings, Collaborators).

### 3.3 Add the team files (Person C)
Copy `SPEC.md`, `CLAUDE.md` and this guide into the project folder next to `package.json`. Create an empty `ASSETS.md` with this table:

```markdown
| File | Source link | Licence | Attribution needed | Date checked | Added by |
|------|-------------|---------|--------------------|--------------|----------|
```

Add these lines to `.gitignore`:
```
.env
.env.*
CLAUDE.local.md
.claude/settings.local.json
```

### 3.4 Install the skills into the project (Person C)
Run these inside the project folder, before starting `claude` (the same commands as the last guide; each skill's own README is the final word, so re-check them if one fails):

```bash
npx skills add pbakaus/impeccable
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add Nutlope/hallmark
npx skills add Manavarya09/design-extract

mkdir -p .claude/skills/unslop
curl -L https://github.com/cursor/plugins/raw/refs/heads/main/pstack/skills/unslop/SKILL.md \
  -o .claude/skills/unslop/SKILL.md
```
On Windows use Git Bash for the last two lines.

**Check where they landed:**
```bash
ls .claude/skills
ls ~/.claude/skills
```
- If they are in `.claude/skills` inside the project, they are shared when you commit.
- If they landed in `~/.claude/skills` (your home folder), they are personal. Then **each teammate runs these install commands on their own laptop**.

Open each `SKILL.md` and skim it. These are third-party skills.

### 3.5 Add Playwright as a project tool (Person C)
```bash
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest
```
The `--` matters. This writes `.mcp.json`, which you commit. When a teammate first opens the project, Claude Code asks them to approve the tool. Check with `/mcp` inside Claude Code.

### 3.6 Team permissions (Person C)
Create `.claude/settings.json` with commands Claude may run without asking each time:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)"
    ],
    "deny": [
      "Read(./.env*)"
    ]
  }
}
```
Anything not listed still asks you first, which is what you want while learning. Do not allow `git push` or deleting files here.

Commit and push everything:
```bash
git add .
git commit -m "Add team files, skills and tool setup"
git push
```
Optional: connect the repository to Vercel (Add New Project, import from GitHub). Every push then gets a link anyone can open on a phone.

### 3.7 Persons A and B join
```bash
git clone <the repository address from GitHub>
cd music-app
npm install
claude
```
Inside Claude Code type `/` to confirm the skills appear and `/mcp` to confirm Playwright. Approve the project tool when asked.

---

## 4. The daily loop for everyone (copy this)

**Start of a work session**
```bash
git checkout main
git pull
git checkout -b m2-keyboard-justin      # milestone, topic, your name
claude
```

**During:** plan mode first (`Shift+Tab` until it says plan mode), paste the milestone prompt, read the plan, approve, test, fix.

**End of a working step**
```bash
git add .
git commit -m "Keyboard plays notes with multitouch"
git push -u origin m2-keyboard-justin
```
Then on GitHub press "Compare & pull request", ask one teammate to glance at it, and merge. Everyone runs `git pull` on `main` before the next session.

**Rules of thumb**
- Pull before you start. Push before you stop.
- Small merges every couple of hours beat one huge merge on the last night.
- If Git says "conflict", stop and ask the team. Do not let Claude Code resolve a conflict in someone else's file without showing you.
- Never work directly on `main`.
- `/clear` between milestones so Claude Code does not mix up old and new tasks.

---

## 5. Using your Miro work with Claude Code

Your spec's section 6.5 gives the order: priorities, personas and stories, flow and wireframes, then build one screen per prompt. Use it like this.

1. **Personas, stories, flow, wireframes:** keep them in Miro. Export or screenshot the user flow and wireframes and keep them in a `docs/` folder in the repo. Claude Code can read images.
2. **One screen per prompt.** Use this template:

> Build the [screen name] screen. User story: [paste the story]. Acceptance test: [paste the Given/When/Then]. Requirements: [IDs from SPEC.md, for example FR-LSN-03, FR-LSN-04, FR-LSN-06]. Wireframe: docs/[file]. Touch only these folders: [your folders]. Follow CLAUDE.md. Start in plan mode.

3. **Traceability matrix:** keep it in Miro for the pitch. After each milestone, tick the matching rows.

---

## 6. The milestones with prompts (paste one at a time, in plan mode)

Each prompt assumes Claude Code has already read `CLAUDE.md` and `SPEC.md`.

### Milestone 0: App shell (Person C, before anyone else starts)
> Set up Tailwind CSS and the folder layout from SPEC.md section 9. Create routing for every screen: Tap to start, Onboarding, Instrument list, Instrument play, Lesson goal, Lesson, Results, My Music, Settings, Teacher (mock), Community (mock), Privacy notice (mock), Credits. Every screen is a placeholder with its name. Build the "Tap to start sound" screen (FR-PLY-12) and a settings store that saves preferences on the device (FR-ACC-08). Phone-first, 360 px wide. Use impeccable and design-taste-frontend: calm, spacious, large tap targets, high contrast.

### Milestone 1: Onboarding and instrument list (C)
> Build onboarding: age band only (under 13, 13 to 17, 18 and over), then learning goal (read notes, learn rhythm, just play) with a Skip button. FR-ONB-01 to 05. Under 13 hides community and sharing. Then the instrument list with name, icon and a preview button (FR-INS-01), plus a "Coming soon" wind instruments tile that cannot be opened (FR-INS-04). A first-time student reaches a playable instrument in 3 taps or fewer. Icons must be from a public icon set; list the set in ASSETS.md.

### Milestone 2: Audio engine and keyboard (A)
> Using Tone.js, build an audio module that loads sample files from public/audio and unlocks on the first tap. Build the keyboard: two octaves, scrollable on small screens, note names show or hide, multitouch chords, laptop keys as input, metronome from 40 to 160 BPM with a flashing beat marker (FR-PLY-01, 02, 07, 08, 09, 10, 11). Read the keyboard layout from src/data/instruments/keyboard.json. If sample files are missing, use a clearly labelled placeholder and list exactly what I must download. Do not create audio.

*You do now:* download piano samples (CC0 or clearly licensed), put them in `public/audio/keyboard/`, add each to `ASSETS.md`.

### Milestone 3: Drum kit (A)
> Build the drum kit from the image I put in public/images. Five touch areas: kick, snare, hi-hat, tom, crash, each a transparent area over the picture, with multitouch (FR-PLY-03, FR-PLY-07). The layout comes from src/data/instruments/drums.json. Keep every area at least 44 by 44 CSS pixels at the medium size setting. Do not draw the kit. If the image is missing, tell me what to download.

*You do now:* download a drum kit image and drum hits with clear licences. Record them in `ASSETS.md`.

### Milestone 4: Guitar (A, cut first if time is short)
> Build the guitar: six strings, tap a string to play its pitch, swipe across strings to play a strummed chord in swipe direction, four chord buttons C, G, Am, F (FR-PLY-04, 05, 06). Layout from src/data/instruments/guitar.json. Use downloaded samples only.

*You do now:* find guitar samples with a clear licence. This one is hardest to source, so look early.

### Milestone 5: Checking engine (B)
> In src/engine, build attempt logging and checking in plain TypeScript. An attempt is a list of played notes with times. Compare to the target: correct or incorrect per note (FR-ASM-01), early, on time or late per beat with tolerance from src/data/config.json by difficulty (FR-ASM-02, 03), store the attempt so it can be replayed exactly (FR-ASM-04). Write Vitest tests: a perfect attempt, one with 2 deliberate wrong notes that reports exactly 2 incorrect, one early, one late. No screens yet.

### Milestone 6: Stave, rhythm grid and the two lessons (B)
> Build a stave component (five lines, treble clef) that shows target notes, highlights exactly one at a time, and shows the played note beside it within 100 ms (FR-LSN-03, 04, 05). Build a rhythm notation grid with a beat marker. Create one note-reading lesson and one rhythm lesson as JSON files under src/data/lessons (FR-LSN-01, 02, 07). Each lesson shows a one-sentence goal first. In note-reading, the matching key stays unlit unless the student has asked for Level 2 or 3 help (FR-LSN-06). Use the stave and notation from a public library if one fits; tell me which and why.

### Milestone 7: Hint ladder and results (B)
> Build the Help control with three levels: guiding question, clue, answer. Level 1 first; each higher level must be requested (FR-HNT-01, 02). Record the highest level used per lesson (FR-HNT-03). Help never lowers results (FR-HNT-04). Build the results screen with counts: notes correct out of total, beats early, on time and late (FR-PRG-01); lessons completed per unit (FR-PRG-02); last 5 attempts (FR-PRG-03); a Compare button that plays the attempt then the target (FR-ASM-05), and the attempt beside the target with mismatches marked (FR-ASM-06). Progress saves after every attempt.

### Milestone 8: The coach (B)
> Build the coach in src/coach. After an attempt with errors, the first message is a question about what was different, with no answer in it (FR-AIC-01). Pick the question from src/data/coach/fallback.json by mistake type and age band. Every message names a specific note, beat or count (FR-AIC-02). Praise only when the lesson's success criteria are met and name what was done well (FR-AIC-03). Accept the student's answer by multiple choice or typed text (FR-AIC-04) and reply with the evidence, for example "beats 3 and 4 were early" (FR-AIC-05). Label every message "AI coach", add a flag button, add a switch that turns AI messages off (FR-AIC-08, 09, 12). Under-13 messages are 40 words or fewer. Off-topic typed text gets the fixed redirect. This is the pre-written coach; do not call any outside service.

*Optional stretch, only if the team agrees and everything else is done:* a Vercel server function that calls a model with de-identified results and falls back to the pre-written coach if it fails. The key lives only in Vercel's environment settings, never in the code.

### Milestone 9: Accessibility (C)
> Add key, pad and string size small, medium and large; a simplified layout (one octave, four drum pads); high-contrast mode; colour-blind-safe note colours always shown with note names (FR-ACC-01, 02, 04, 05, 08). Run a Lighthouse accessibility check and fix what it finds. Make sure the simplified layout can complete the first lesson.

### Milestone 10: Offline and install (A)
> Make the app a PWA that works with no network after first load: all instruments, free play, lessons and pre-written hints (FR-OFF-01, 02, 03). Add an online or offline indicator that updates within 5 seconds (FR-OFF-04). Keep the cached package under 50 MB and tell me its size.

### Milestone 11: Create mode and opt-in gamification (C)
> Free play on every instrument with no goal or results screen. Record up to 60 seconds, stopping automatically; play back, name, save and delete recordings on the device (FR-CMP-01 to 04). Gamification is off by default; badges tied to a lesson success criterion; no streaks, timers or penalties; badges are kept when switched off (FR-GAM-01, 02, 03, 05). Recordings contain only note events, never raw audio (FR-PRV-04).

### Milestone 12: Mock screens and polish (C, with all)
> Build the teacher dashboard, class join code, community and mentor review, and privacy notice as mock screens with sample data in src/data/mock, each labelled "Demo data". No ranking or comparing students. Build the Credits screen from ASSETS.md.

Then the polish pass, one screen at a time: hallmark review, impeccable polish, taste skill only on screens that still look generic, then `/unslop` on coach text, onboarding text, README and the pitch script (keep Year 3 reading level and specific praise).

---

## 7. Testing as a team

1. **Vitest** for the engine (`npm test`). B runs it before every merge.
2. **Playwright through Claude Code** for screenshots at 360, 768 and 1920 px and console errors. It cannot judge audio delay or real multitouch.
3. **Real devices.** Run `npm run dev -- --host` and open the printed address on a phone on the same Wi-Fi, or open your Vercel preview link. Check: sound starts after one tap, two fingers play two sounds, nothing scrolls or zooms while playing.
4. **Sound delay.** Test on the demo device on day one. If rhythm checking feels unfair, widen the beginner tolerance in `src/data/config.json` (known risk in the Miro spec).
5. **Checklist.** Ask Claude Code: "Turn SPEC.md section 11 and the acceptance criteria of every requirement in section 4 into test-checklist.md, one pass/fail row each." Work through it the day before the demo.

---

## 8. Three-day plan

| Day | A | B | C |
|---|---|---|---|
| 1 | Download samples and log them. Milestone 2 (keyboard) | Milestone 5 (engine and tests) | Milestone 0 first (everyone waits for it), then Milestone 1 |
| 2 | Milestone 3 (drums) | Milestone 6 (stave, two lessons), Milestone 7 | Milestone 9 (accessibility), Milestone 11 |
| 3 morning | Milestone 4 (guitar) or Milestone 10 (offline), whichever matters more | Milestone 8 (coach) | Milestone 12 (mock screens, credits) |
| 3 afternoon | Everyone: polish, real-device test, rehearse the three demo moments, record a backup video |

**Cut order if time runs short:** guitar, optional live AI, create mode layering and extras, gamification, then mock screens beyond the teacher dashboard. Never cut: question-first coach, hint ladder, offline fallback, adaptable control sizes. These are your three demo moments.

---

## 9. Demo and pitch

- 30-second story: a student with no instrument and no teacher can still learn music, and learns to think instead of being told.
- Demo moment 1: miss a beat, the coach asks what was different before answering.
- Demo moment 2: open three instruments from a web link, no sign-up, no cost.
- Demo moment 3: airplane mode on mid-lesson, lesson and hints keep working.
- Say honestly which screens use demo data (teacher, community) and that the coach is rule-based in the prototype.
- Use the traceability matrix from Miro to link each feature to the problem statement.
- Have a recorded backup run ready in case venue Wi-Fi or sound fails.

---

## 10. When the shared setup goes wrong

| Problem | Try |
|---|---|
| A teammate's Claude Code does not follow the rules | Check `CLAUDE.md` is in the project root (next to `package.json`) and that they pulled. Restart `claude` |
| Skills missing for a teammate | They landed in your home folder, not the project. That teammate runs the install commands from 3.4 |
| Playwright not showing in `/mcp` | Check `.mcp.json` is in the repo and approve the tool when asked. Node must be 22 or newer |
| "Merge conflict" | Stop. Ask whose file it is. Show the conflict to that person before changing anything |
| Two people edited the same file | Move the work into your own folders and split the file into smaller ones |
| Claude Code edits files outside your folders | Say "touch only [folders]" again, and add the folder rule to `CLAUDE.md` |
| Build breaks after a merge | Everyone runs `git pull`, then `npm install`, then `npm run build` |
| No sound on iPhone | Audio must start after a tap; check the silent switch |
| Page scrolls while playing | Add `touch-action: none` to the instrument area |
| Notes lag | Preload samples, keep the touch handler light, test on the real device |

---

## What I checked and what I did not

- **Checked against the Claude Code settings documentation:** `CLAUDE.md` in the project root and `.claude/settings.json` are shared through Git, `.claude/settings.local.json` and `CLAUDE.local.md` are personal, and project tools live in `.mcp.json`.
- **Carried over from the last guide:** the skill install commands, the Playwright command and the Node 22 requirement. Skill commands come from each skill's own page and can change, so check their READMEs.
- **Not tested:** whether the design skills and Playwright work well together, and whether your skill installs land in the project or your home folder. Section 3.4 shows how to check.
- **Needs a team decision:** the six items in `SPEC.md` section 2.
