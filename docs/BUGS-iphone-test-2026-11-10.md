# Carmen on a real iPhone: findings, 10 Nov 2026

For the team and for each person's Claude Code. Read this before working on the piano, touch
input, phone layout or the page head. It adds to `docs/BUGS-live-test-2026-11-10.md`.
Nothing here changes the app; these are findings and suggested fix shapes for the team to agree.

- Who and how: Carlos, his own iPhone, Safari, phone held sideways (landscape), live site.
- Screen: Learn, free lesson with the piano ("Stop the sound and finish" button showing).
- Code read: `main` at `c2ad5ca`; live build `index-FBbNgjv1.js` and `index-CWPd3LP9.css`.
- Not recorded: iPhone model and iOS version. Carlos to add them here.

## 1. Summary: whose problem is each one

| # | What Carlos saw | Whose problem | Severity |
|---|---|---|---|
| 1 | Sliding a finger across the keys plays one note only | App, on iPhone | Major |
| 2 | Piano squeezed and cut off when the phone is sideways | App | Major |
| 3 | Laptop letters (A S D F, W E T) printed on the keys on a phone | App | Minor |
| 4 | Safari address bar takes the top of the screen | iPhone Safari, every website | Fix by home-screen icon |
| 5 | Row of open tabs under the address bar | Carlos's phone setting | Not an app bug |
| 6 | Home-screen icon is generic | App (already in the first bug file) | Minor |

- None of 1 to 3 is caused by Carlos's phone; any iPhone should show them.
- 4 and 5 disappear when Carmen is opened from a home-screen icon.

## 2. Slide (glissando) does not work on iPhone: major

- Seen: finger down plays one note; sliding to the next keys plays nothing more.
- Expected: `Keyboard` in `src/ui/instruments.tsx` is written to glide; its comment says so.
- The glide code is in the live build, so this is not an old deployment.
- `touch-action: none` is already set on `.kb` and `.kb-key`, so scrolling is not the cause.
- Cause: not confirmed. It needs a real iPhone; a desktop browser does not reproduce it.

| Candidate cause | Why it fits | How to check |
|---|---|---|
| `onPointerLeave={release}` on the `.kb` container ends the note early | Code releases pointer capture on touch; Safari may then send a leave event with no related target, which React treats as leaving the keyboard; later moves are ignored because the pointer is forgotten | Log event types on screen during a slide on an iPhone |
| Safari keeps the touch tied to the first key | Touch events on iPhone always belong to the element first touched | Same log: check whether `pointermove` still arrives after the first key |

- Fix shape, for the team to agree:
  o End a note only on `pointerup` or `pointercancel` (listen on `window`), not on leave.
  o While a finger is down, find the key under it with `elementFromPoint`, as now.
  o If pointer events stay unreliable, drive touch from `touchstart`, `touchmove`, `touchend`.
- Done when, on a real iPhone:
  o Sliding one finger across five white keys sounds five notes.
  o Two fingers hold two notes; lifting one stops only that note.
  o Mouse drag on a laptop still glides.
- The same check applies to the drum pads (two taps at once).

## 3. Piano does not fit when the phone is sideways: major

- Seen: top of the keys cut off, page scrolls, empty band under the button.
- Cause, from the stylesheet: there is no sideways (landscape) layout at all.
  o `src/index.css` has no `orientation` or `max-height` media rule.
  o `.kb` height is `clamp(200px, calc(100svh - 560px), 520px)`: never under 200 px.
  o A sideways iPhone in Safari shows roughly 260 to 340 px of page height.
  o So 200 px of keys plus heading plus button cannot fit on one screen.
- Same family as bug 2.3 in the first file (keys under the bottom bar at 420 px wide).
- Fix shape, for the team to agree:
  o Add a short-screen rule, for example `@media (orientation: landscape) and (max-height: 500px)`.
  o In it, the piano fills the visible height; use `dvh`, not `vh`.
  o Hide or shrink the heading and bottom bar; keep one small Stop button beside the keys.
  o Respect the notch: `viewport-fit=cover` plus `env(safe-area-inset-left/right)` padding.
- Done when: at 844 x 390 and 667 x 375, with Safari's bars showing, the whole piano and
  the Stop button are visible without scrolling.
- Team call: support sideways properly, or lock the message "turn your phone upright" for the pitch.

## 4. Laptop letters on the keys on a phone: minor

- Seen: W E T Y U O P on black keys and A S D F G H J K L ; on white keys.
- Cause: `.kb-hint` is hidden only by width, `@media (max-width: 560px)`.
- A sideways phone is 667 to 932 px wide, so the hints come back.
- `showKeyHints` is on unless "simplified" is set (`src/ui/Workspace.tsx`, line 335).
- Fix shape: hide hints by input type, `@media (hover: none) and (pointer: coarse)`.
- Done when: no letter hints on a phone in either direction; hints still show on a laptop.

## 5. Address bar and tab row: not app bugs, but the app can help

- Every website in iPhone Safari shows the address bar. A page cannot hide it.
- The tab row is a Safari setting on Carlos's phone (Landscape Tab Bar) with many tabs open.
- Both go away when Carmen is opened from a home-screen icon:
  o Safari, Share, Add to Home Screen, then open Carmen from the icon.
  o `public/manifest.webmanifest` already says `"display": "standalone"`.
- App gaps that make this worse (the first file lists the head tags as a minor):

| Gap | Where | Fix shape |
|---|---|---|
| No iPhone icon | `index.html` has no `apple-touch-icon` | Add a 180 px PNG icon and the link tag |
| Manifest icon is SVG only | `public/manifest.webmanifest` | Add 192 and 512 px PNG icons |
| No web-app meta tags | `index.html` | Add `mobile-web-app-capable` and `apple-mobile-web-app-capable` |
| Nothing tells the learner | First run | One short hint: "Add Carmen to your home screen" |

- For the pitch: demo from the home-screen icon, so no address bar is on show.

## 6. Suggested order

1. Slide on iPhone (section 2): it is the first thing a judge will try on a phone.
2. Decide sideways support or an upright-only message (section 3).
3. Home-screen icon and tags (section 5), then demo from the icon.
4. Hide letter hints on touch (section 4).

## 7. Not tested yet on the phone

- Upright (portrait) piano: key width and the keys-under-bottom-bar bug from the first file.
- The count-in stall (blocker in the first file) on the phone.
- Sound delay, drums with two fingers, offline, and the app opened from the home screen.

## Sources

- Carlos's test on his iPhone, 10 Nov 2026, live site https://music-app-sooty-five.vercel.app
  (screenshot kept by Carlos; not in the repo because it shows his other tabs).
- Team repo `main` at `c2ad5ca`: `src/ui/instruments.tsx` (Keyboard, lines 44 to 111),
  `src/index.css` (`.kb` lines 876 to 892, `.kb-hint` lines 976 to 990), `src/ui/Workspace.tsx`
  (line 335), `index.html`, `public/manifest.webmanifest`, `src/screens/FreeLesson.tsx` (line 69).
- Live build fetched 10 Nov 2026: `/assets/index-FBbNgjv1.js` (glide code present),
  `/assets/index-CWPd3LP9.css` (no orientation rule; hints hidden at 560 px and under).
- `docs/BUGS-live-test-2026-11-10.md` in the team repo (bug 2.3 and the head tags row).
- The causes in section 2 are inferred from the code, not measured on a device.
