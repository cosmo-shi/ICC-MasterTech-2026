# Team guide: building the music app together with Claude Code

For three people, beginner level. Uses the same tools as the last guide: Claude Code, the design skills, Vitest, Playwright, GitHub and Vercel. This guide adds what changes when three people share one project.

Files that go with this guide: `SPEC.md` (what to build) and `CLAUDE.md` (rules Claude Code follows). Both come from the team's Miro requirements spec.

---

## 0. Decisions are settled: the Miro spec wins

The team follows the Miro requirements spec for everything. That means three instruments (keyboard, drum pads, guitar), plain HTML, CSS and JavaScript in the browser, sounds from Tone.js or licensed sample libraries, lessons that unlock one after another, and a pre-written AI coach in the demo. `SPEC.md` section 2 lists each choice with its Miro reference. Any older chat note that disagrees is dropped.

Also ask the organisers whether you may write code before the two build days. Installing tools is almost certainly fine. Writing the app may not be.

---

## 1. How a shared setup works (the idea in plain words)

- There is **one copy of the project on GitHub**. Each of you has your own copy on your laptop.
- Each of you runs **your own Claude Code** on your own laptop. There is no shared Claude Code session.
- Claude Code reads the rules from files inside the project. If those files are in Git, **all three Claude Codes follow the same rules**. That is how you share your setup.
- You send your work to GitHub and take your teammates' work from GitHub. This is called pushing and pulling.

### What is shared through Git, and what stays personal

| File or folder                  | What it does                                          | Shared?                                                |
| ------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| `CLAUDE.md`                   | Rules Claude Code reads every session                 | Yes, commit it                                         |
| `SPEC.md`                     | The build list                                        | Yes, commit it                                         |
| `ASSETS.md`                   | Every sound and image with its licence                | Yes, commit it                                         |
| `.claude/skills/`             | The design and writing skills                         | Yes, if the install put them here (check in section 3) |
| `.mcp.json`                   | Project tools such as Playwright                      | Yes, commit it                                         |
| `.claude/settings.json`       | Team permissions (what Claude may run without asking) | Yes, commit it                                         |
| `.claude/settings.local.json` | Your own overrides                                    | No, Claude Code keeps it out of Git                    |
| `CLAUDE.local.md`             | Your own private notes to Claude                      | No, add it to `.gitignore`                           |
| `.env` or `.env.local`      | Secrets                                               | No, never. The demo needs none                         |

These locations come from the Claude Code settings documentation.

---

## 2. Roles: split by Claude plan, then by folder

The three of you are on different plans, so the work is split by what each plan can do. Decide among yourselves who is who. This guide assumes **Person A = Max, Person B = Pro, Person C = Free**. If it is the other way round, swap the letters.

| Person      | Plan | What the plan means for the work                                                                                                                                                                                                    |
| ----------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | Max  | Claude Code is included. Max gives 5x or 20x more usage per session than Pro (depends on your tier, so check which one you have). A takes the biggest, most iterative code: audio, instruments, stave and offline.                  |
| **B** | Pro  | Claude Code is included, but Pro has a five-hour session limit and a weekly limit, shared between Claude chat and Claude Code. B takes contained code that works in small steps: shell, onboarding, engine, hints, coach, contrast. |
| **C** | Free | Claude Code is not included on the Free plan. C has the Claude chat on claude.ai only, with a small message allowance. So C takes no coding milestone and works on content, design, testing and the presentation.                   |

### Who owns which folder

Most merge problems happen when two people edit the same file. Give each person their own folders.

| Person                                                     | Owns                                                                                                                                                                                           | Milestones                                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **A (Max): Instruments, notation, offline**          | `src/instruments/`, `src/components/notation/` (stave and rhythm grid), `src/screens/play*` and `src/screens/lesson*`, `public/audio/`, `src/data/instruments/`, the offline files | 2 (keyboard), 3 (drums), 4 (guitar), 6 (stave and lesson screen), 9 (instrument part), 10 (offline), then 11 if time |
| **B (Pro): Shell, engine, coach**                    | the rest of `src/screens/`, the rest of `src/components/`, `src/engine/`, `src/coach/`, `src/settings/`, `public/images/`                                                          | 0, 1, 5, 7, 8, 9 (contrast and Lighthouse), then 12 if time                                                          |
| **C (Free): Content, design, testing, presentation** | `src/data/lessons/` (the lesson files), `src/data/coach/` (the coach text), `src/data/mock/` (sample data and teacher guides), `docs/`, `ASSETS.md`, `README.md`                   | No code milestones. See 2.1                                                                                          |

Shared files nobody edits casually: `package.json`, `CLAUDE.md`, `SPEC.md`, `src/data/config.json`. Change them in a small commit of their own and tell the others. (`ASSETS.md` belongs to C, but anyone who adds a file tells C.)

Person B builds Milestone 0 first and creates the routing file with **every screen already listed as a placeholder**. After that, nobody needs to edit the routing file. A fills in the instrument and lesson screens and B fills in the others.

Tell Claude Code who you are at the start of each session, for example: "I am Person B. I own src/engine, src/coach, src/settings and the screens other than play and lesson. Do not edit anything else."

### 2.1 What Person C does on the Free plan

C's work matters as much as the code, and most of it does not need Claude Code.

1. **Write the lesson files and the coach text.** B defines the file format in Milestones 5 and 8 and writes one example file with placeholder text for each. C writes the real content in the same format, using the Claude chat on claude.ai:
   - the note-reading lesson and the rhythm lesson in `src/data/lessons/` (goal sentence, success criteria, three hint levels, coach questions by mistake type)
   - `src/data/coach/fallback.json`: pre-written questions and hints by mistake type and age band, plus the fixed redirect message (40 words or fewer for under-13s, a specific note or beat in every message, no generic praise)
   - sample class data and one-page teacher lesson guides in `src/data/mock/` (written for a teacher with no music training)
2. **Design and Miro artefacts** (Miro spec section 6): personas, user stories, user flow, wireframes, data flow diagram, traceability matrix. Save exports in `docs/`.
3. **Design brief for A and B.** A one-page `docs/design-brief.md` (calm, spacious, colour-blind-safe palette, high contrast, large targets, tone for ages 8 to 14). A and B paste it into the design skills in Claude Code so the screens match.
4. **Testing.** The test checklist, then running it on a real phone or tablet through the Vercel preview link (no install needed), and logging each bug as a GitHub issue with the requirement ID.
5. **Presentation.** Pitch script, deck, demo script, the backup video. C leads Day 3.

C can use the Free plan for all of this. See 3.8 for how C gets files into the repo without a terminal.

**If the organisers give hackathon API credits** (ask on Day 1), C can run Claude Code through a Console account instead (see 3.1) and take Milestone 12 from B.

### 2.2 Keeping the Pro plan within its limits

- Both Pro and Max have a five-hour session limit and a weekly limit, and the limits are shared with the Claude chat. Claude Code warns you as you approach one. Do not use the chat for long side tasks on the same account.
- One milestone per session, plan mode first, and `/clear` between milestones. Long, wandering sessions use the most.
- If B hits the limit, swap tasks: B writes tests and reads code while waiting, or A takes the next small milestone.

---

## 3. One-time setup (Person B does 3.2 to 3.6, then A does 3.7 and C does 3.8)

### 3.1 Install the basics on every laptop

Same as the last guide. Persons A and B need Node.js 22 or newer, Git, a GitHub account, and Claude Code. Person C needs a GitHub account only (see 3.8).

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

Claude Code is included with the Pro and Max plans. The Free plan does not include it, so Person C does not install it. A Console account with API billing also works, if the organisers give credits. Details: https://code.claude.com/docs

### 3.2 Create the project (Person B only)

```bash
npm create vite@latest music-app -- --template vanilla
cd music-app
npm install
npm install tone
npm install -D vitest
git init
git add .
git commit -m "Initial project"
```

The `vanilla` template gives plain JavaScript with no React and no TypeScript, which is what the Miro spec asks for.

Create an empty repository on GitHub, then follow the commands GitHub shows to push. Add your two teammates as collaborators (GitHub: Settings, Collaborators); this includes Person C, who needs write access to add files.

### 3.3 Add the team files (Person B)

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

### 3.4 Install the skills into the project (Person B)

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

### 3.5 Add Playwright as a project tool (Person B)

```bash
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest
```

The `--` matters. This writes `.mcp.json`, which you commit. When a teammate first opens the project, Claude Code asks them to approve the tool. Check with `/mcp` inside Claude Code.

### 3.6 Team permissions (Person B)

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

Connect the repository to Vercel (Add New Project, import from GitHub). Every push then gets a link anyone can open on a phone. This is no longer optional: Person C tests on a phone through these links.

### 3.7 Person A joins (Claude Code)

```bash
git clone <the repository address from GitHub>
cd music-app
npm install
claude
```

Inside Claude Code type `/` to confirm the skills appear and `/mcp` to confirm Playwright. Approve the project tool when asked.

### 3.8 Person C joins (no Claude Code, no terminal)

Person C works in the browser.

1. Accept the GitHub invite. Open the repository on github.com.
2. **Add a file:** click the branch button (it says `main`), type a new branch name such as `content-lessons-c`, and choose "Create branch". Open the folder (for example `src/data/lessons`), choose Add file, then Create new file (paste the text) or Upload files. Click Commit changes.
3. **Change a file:** open it, click the pencil icon, edit, and commit to your branch.
4. Click "Compare & pull request" and ask A or B to merge it. Never commit to `main`.
5. **Write the content with Claude on claude.ai.** Paste `CLAUDE.md`, the relevant part of `SPEC.md` (sections 3 and 8) and B's example file, and ask for the whole file in one message. The Free plan allows only a small number of messages per five-hour window (reports estimate 15 to 40, which is not an official number), so ask for a full file at a time rather than many small questions. Check every file against the example's format before committing.
6. **Check your files.** B's tests (`npm test`) list the file and the field if something is missing. Ask A or B to run them after you merge, or run them yourself if you install Node.
7. **Test on a phone.** Open the Vercel preview link B sets up in 3.6. No install needed.

---

## 4. The daily loop for everyone (copy this)

Persons A and B follow this loop. Person C uses the browser steps in 3.8 instead.

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
- Small merges every couple of hours beat one huge merge at the end of Day 2.
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

### Milestone 0: App shell (Person B, before anyone else starts)

> Set up plain CSS and the folder layout from SPEC.md section 9. Create simple routing in plain JavaScript (hash-based) for every screen: Tap to start, Onboarding, Instrument list, Instrument play, Lesson goal, Lesson, Results, My Music, Settings, Teacher (mock), Community (mock), Privacy notice (mock), Credits. Every screen is a placeholder with its name. Build the "Tap to start sound" screen (FR-PLY-12) and a settings store that saves preferences on the device (FR-ACC-08). Phone-first, 360 px wide. Use impeccable and design-taste-frontend: calm, spacious, large tap targets, high contrast.

### Milestone 1: Onboarding and instrument list (B)

> Build onboarding: age band only (under 13, 13 to 17, 18 and over), then learning goal (read notes, learn rhythm, just play) with a Skip button. FR-ONB-01 to 05. Under 13 hides community and sharing. Then the instrument list with name, icon and a preview button (FR-INS-01), plus a "Coming soon" wind instruments tile that cannot be opened (FR-INS-04). A first-time student reaches a playable instrument in 3 taps or fewer. Draw icons as inline SVG or use a public icon set; log any third-party set in ASSETS.md.

### Milestone 2: Audio engine and keyboard (A)

> Using Tone.js, build an audio module that makes the sounds with Tone.js (generated in code, or licensed sample files if the team provides them) and unlocks on the first tap. Build the keyboard: two octaves, scrollable on small screens, note names show or hide, multitouch chords, laptop keys as input, metronome from 40 to 160 BPM with a flashing beat marker (FR-PLY-01, 02, 07, 08, 09, 10, 11). Read the keyboard layout from src/data/instruments/keyboard.json. If I want real samples instead, tell me which licensed library to use and how to log it.

*You do now (optional):* if the generated keyboard sound is not good enough, download a licensed piano sample set, put it in `public/audio/keyboard/` and add it to `ASSETS.md`.

### Milestone 3: Drum pads (A)

> Build the drum pads: five pads labelled kick, snare, hi-hat, tom and crash, each playing its labelled sound, with multitouch so several pads can sound together (FR-PLY-03, FR-PLY-07). The pad layout comes from src/data/instruments/drums.json. Keep every pad at least 44 by 44 CSS pixels at the medium size setting. Use Tone.js sounds generated in code unless the team provides licensed samples. The four-pad simplified layout and drag-to-rearrange come in Milestone 9.

*You do now (optional):* if you want real drum hits, download a licensed set and add it to `ASSETS.md`.

### Milestone 4: Guitar (A, cut first if time is short)

> Build the guitar: six strings, tap a string to play its pitch, swipe across strings to play a strummed chord in swipe direction, four chord buttons C, G, Am, F (FR-PLY-04, 05, 06). Layout from src/data/instruments/guitar.json. Use Tone.js sounds generated in code (for example its plucked-string synth) or licensed samples.

*Tip:* ask Claude Code to try Tone.js's plucked-string synth first. It avoids the search for licensed guitar samples.

### Milestone 5: Checking engine (B)

> In src/engine, build attempt logging and checking in plain JavaScript. An attempt is a list of played notes with times. Compare to the target: correct or incorrect per note (FR-ASM-01), early, on time or late per beat with tolerance from src/data/config.json by difficulty (FR-ASM-02, 03), store the attempt so it can be replayed exactly (FR-ASM-04). Write Vitest tests: a perfect attempt, one with 2 deliberate wrong notes that reports exactly 2 incorrect, one early, one late. No screens yet. Also define the lesson file format in src/data/lessons: write one complete example lesson file with placeholder text (goal sentence, target notes or rhythm pattern, success criteria, three hint levels, pre-written coach questions by mistake type), and a Vitest test that loads every file in src/data/lessons and fails with a message naming the file and the missing field. A teammate will write the real lessons from this example.

### Milestone 6: Stave, rhythm grid and the lesson screen (A; lesson content by C)

> Build a stave component (five lines, treble clef) that shows target notes, highlights exactly one at a time, and shows the played note beside it within 100 ms (FR-LSN-03, 04, 05). Build a rhythm notation grid with a beat marker. Build the lesson screen that reads the lesson files in src/data/lessons (the format comes from Milestone 5; a teammate writes the real lessons, so test with the example lesson) and shows the one-sentence goal first (FR-LSN-01, 02, 07). In note-reading, the matching key stays unlit unless the student has asked for Level 2 or 3 help (FR-LSN-06). Use the stave and notation from a public library if one fits; tell me which and why.

### Milestone 7: Hint ladder and results (B)

> Build the Help control with three levels: guiding question, clue, answer. Level 1 first; each higher level must be requested (FR-HNT-01, 02). Record the highest level used per lesson (FR-HNT-03). Help never lowers results (FR-HNT-04). Build the results screen with counts: notes correct out of total, beats early, on time and late (FR-PRG-01); lessons completed per unit (FR-PRG-02); last 5 attempts (FR-PRG-03); a Compare button that plays the attempt then the target (FR-ASM-05), and the attempt beside the target with mismatches marked (FR-ASM-06). Progress saves after every attempt.

### Milestone 8: The coach (B)

> Build the coach in src/coach. After an attempt with errors, the first message is a question about what was different, with no answer in it (FR-AIC-01). Pick the question from src/data/coach/fallback.json by mistake type and age band. Every message names a specific note, beat or count (FR-AIC-02). Praise only when the lesson's success criteria are met and name what was done well (FR-AIC-03). Accept the student's answer by multiple choice or typed text (FR-AIC-04) and reply with the evidence, for example "beats 3 and 4 were early" (FR-AIC-05). Label every message "AI coach", add a flag button, add a switch that turns AI messages off (FR-AIC-08, 09, 12). Under-13 messages are 40 words or fewer. Off-topic typed text gets the fixed redirect. This is the pre-written coach; do not call any outside service. Also define the format of src/data/coach/fallback.json with a few placeholder entries per mistake type (wrong note, early, late, missed, extra) and age band plus the fixed redirect message, and a Vitest test that checks required fields and that under-13 entries are 40 words or fewer. A teammate will write the real text from this example.

*Optional stretch, only if the team agrees and everything else is done:* a Vercel server function that calls a model with de-identified results and falls back to the pre-written coach if it fails. The key lives only in Vercel's environment settings, never in the code.

### Milestone 9: Accessibility (A for the instrument part, B for contrast and Lighthouse)

Two prompts, because the instrument controls live in A's folders.

**Person A:**

> Add key, pad and string size small, medium and large (FR-ACC-01), a simplified layout of one octave or four drum pads (FR-ACC-02), drag-to-rearrange drum pads whose new positions stay after the app is reopened (FR-ACC-03), and colour-blind-safe note colours always shown with note names (FR-ACC-05). Save choices through the settings store from Milestone 0. Make sure the simplified layout can complete the first lesson. Touch only the instrument and notation folders.

**Person B:**

> Add the high-contrast mode (FR-ACC-04) across every screen, and make sure all control preferences are saved on the device and applied on the next launch (FR-ACC-08). Run a Lighthouse accessibility check on every screen and fix what it finds. Check that no information is shown by colour alone.

### Milestone 10: Offline and install (A)

> Make the app a PWA that works with no network after first load: all instruments, free play, lessons and pre-written hints (FR-OFF-01, 02, 03). Add an online or offline indicator that updates within 5 seconds (FR-OFF-04). Keep the cached package under 50 MB and tell me its size.

### Milestone 11: Create mode and opt-in gamification (A, only if time allows)

> Free play on every instrument with no goal or results screen. Record up to 60 seconds, stopping automatically; play back, name, save and delete recordings on the device (FR-CMP-01 to 04). Gamification is off by default; badges tied to a lesson success criterion; no streaks, timers or penalties; badges are kept when switched off (FR-GAM-01, 02, 03, 05). Recordings contain only note events, never raw audio (FR-PRV-04).

### Milestone 12: Mock screens and polish (B, only if time allows; content by C)

> Build the teacher dashboard, class join code, community and mentor review, and privacy notice as mock screens with sample data in src/data/mock, each labelled "Demo data". No ranking or comparing students. Build the Credits screen from ASSETS.md. Sample data and the one-page lesson guides come from src/data/mock/ (written by a teammate): show the guide for each lesson on the teacher screen (FR-TCH-03).

Then the polish pass, one screen at a time: hallmark review, impeccable polish, taste skill only on screens that still look generic, then `/unslop` on coach text, onboarding text, README and the pitch script (keep Year 3 reading level and specific praise).

---

## 7. Testing as a team

1. **Vitest** for the engine and the data files (`npm test`). A and B run it before every merge. It also checks the files Person C writes.
2. **Playwright through Claude Code** for screenshots at 360, 768 and 1920 px and console errors. It cannot judge audio delay or real multitouch.
3. **Real devices.** Run `npm run dev -- --host` and open the printed address on a phone on the same Wi-Fi, or open your Vercel preview link. Check: sound starts after one tap, two fingers play two sounds, nothing scrolls or zooms while playing.
4. **Sound delay.** Test on the demo device in the first hours of Day 1. If rhythm checking feels unfair, widen the beginner tolerance in `src/data/config.json` (known risk in the Miro spec).
5. **Checklist.** Ask Claude Code: "Turn SPEC.md section 11 and the acceptance criteria of every requirement in section 4 into test-checklist.md, one pass/fail row each." Person C can ask Claude on claude.ai for this instead, pasting in `SPEC.md`. Person C works through it on the demo phone after the Day 2 code freeze and logs each failure as a GitHub issue with the requirement ID.

---

## 8. Two build days plus a presentation day

Days 1 and 2 are for building. Day 3 is only for presenting: no new code.

| When              | A (Max)                                                                               | B (Pro)                                                                                                   | C (Free)                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Day 1, first hour | Check Tone.js sounds on the demo phone. Start Milestone 2                             | Milestone 0 first (everyone waits for it)                                                                 | Personas, user stories, user flow in Miro. Start the design brief                                               |
| Day 1, rest       | Milestone 2, then Milestone 3 (drum pads), then Milestone 6 (stave and lesson screen) | Milestone 1, then Milestone 5 with the lesson file format and test                                        | Wireframes, data flow, traceability matrix. `ASSETS.md`. First test checklist. Pitch outline                  |
| Day 2, morning    | Milestone 4 (guitar), Milestone 9 (instrument part), Milestone 10 (offline)           | Milestone 7 (hints, results), Milestone 8 (coach and fallback format), Milestone 9 (contrast, Lighthouse) | Write lesson files, coach text, sample data and teacher guides from B's examples; add them through GitHub (3.8) |
| Day 2, afternoon  | Milestone 11 if time, then fixes                                                      | Milestone 12 if time, then fixes                                                                          | Run the test checklist on the demo phone, log bugs, record the backup video, finish the deck                    |

**Day 2 midday decision point.** Check what is not done yet and use the cut order below to drop anything that will not be finished by mid-afternoon.

**Day 2 code freeze.** Agree a time, for example 4 hours before the end of the day. After the freeze, only bug fixes. Then:

1. C tests on the real demo phone or tablet.
2. Go through the done checklist in `SPEC.md` section 11.
3. Record a backup video of a perfect run.
4. Check the deployed link opens on a phone.

**Day 3: presentation only (C leads).**

- Rehearse the pitch and the three demo moments.
- Check the deployed link and the demo device (charged, sound on, airplane mode test).
- Do not change code. Fix a bug only if a demo moment is broken, and tell the team first.

**Cut order if time runs short:** guitar, optional live AI, Milestone 11 (create mode and gamification), then mock screens beyond the teacher dashboard (Milestone 12). Never cut: question-first coach, hint ladder, offline fallback, adaptable control sizes. These are your three demo moments.

**Honest warning.** Only two of you can run Claude Code, so eleven code milestones fall on A and B in two days. That is tight. Create mode and gamification are Miro "must" items, so if they are cut, say so openly in the pitch. Two things help: C's content work removes writing from A and B, and an early finisher takes the next item from whoever is behind. If hackathon API credits turn up, C can run Claude Code too and take Milestone 12.

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

| Problem                                            | Try                                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| A teammate's Claude Code does not follow the rules | Check `CLAUDE.md` is in the project root (next to `package.json`) and that they pulled. Restart `claude` |
| Skills missing for a teammate                      | They landed in your home folder, not the project. That teammate runs the install commands from 3.4             |
| Playwright not showing in `/mcp`                 | Check `.mcp.json` is in the repo and approve the tool when asked. Node must be 22 or newer                   |
| "Merge conflict"                                   | Stop. Ask whose file it is. Show the conflict to that person before changing anything                          |
| Two people edited the same file                    | Move the work into your own folders and split the file into smaller ones                                       |
| Claude Code edits files outside your folders       | Say "touch only [folders]" again, and add the folder rule to `CLAUDE.md`                                     |
| Build breaks after a merge                         | Everyone runs `git pull`, then `npm install`, then `npm run build`                                       |
| No sound on iPhone                                 | Audio must start after a tap; check the silent switch                                                          |
| Page scrolls while playing                         | Add `touch-action: none` to the instrument area                                                              |
| Notes lag                                          | Preload samples, keep the touch handler light, test on the real device                                         |
| A file written by Person C breaks the app          | Run `npm test`. The data tests name the file and the missing field. C fixes it on the same branch            |
| Claude Code says a usage limit is reached          | Wait for the five-hour reset, or swap tasks. See 2.2                                                           |
| Person C is out of Free-plan messages              | Ask for whole files per message. Wait for the window to reset, or ask A or B to draft the file in their chat   |

---

## What I checked and what I did not

- **Checked against the Claude Code settings documentation:** `CLAUDE.md` in the project root and `.claude/settings.json` are shared through Git, `.claude/settings.local.json` and `CLAUDE.local.md` are personal, and project tools live in `.mcp.json`.
- **Carried over from the last guide:** the skill install commands, the Playwright command and the Node 22 requirement. Skill commands come from each skill's own page and can change, so check their READMEs.
- **Not tested:** whether the design skills and Playwright work well together, and whether your skill installs land in the project or your home folder. Section 3.4 shows how to check.
- **Settled:** the team follows the Miro spec for everything; `SPEC.md` section 2 lists the choices.
- **Checked for the plan split:** Anthropic's help pages say Claude Code is included with Pro and Max, that both have a five-hour session limit and a weekly limit shared with Claude chat, and that Max gives 5x or 20x more usage per session than Pro. That the Free plan has no Claude Code, and the 15 to 40 messages per window, come from a third-party summary, not an official page.
- **Not checked:** which models each plan gets in Claude Code. Type `/model` in Claude Code to see yours.
