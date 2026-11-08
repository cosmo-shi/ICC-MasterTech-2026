# Cisco fit note v1: where Cisco technology honestly touches the practice coach

- Date: Fri 6 Nov 2026 (AEDT), overnight run. Purpose: v0 revised against the Webex docs and a no-web Codex check.
- Recommendation: keep v0's one real fit (Webex hand-off message, mocked). Fix the guest-join plan, the fallback wording and the stage mock; reword four borderline lines.
- Scope: change log, Codex points checked, stage mock, line-by-line honesty marks, two sponsor challenges, extra uses.
- Status: overnight draft for the team; verify before the pitch. v0 (`cisco-fit-note.md`) is unchanged; its sections 1 to 7 and sources 1 to 24 still stand except where section 0 says otherwise. Source numbers in [brackets] below point to this file's `## Sources`; [v0-N] points to v0's list.

## 0. Change log (v0 to v1)
| Line in v0 | v0 said | v1 says | Reason |
|---|---|---|---|
| Section 2, Webex Meetings API row; section 3 fit 2 | "guests without accounts can join through a Guest Issuer app" | Wrong for a new build. Guest Issuer app creation was disabled 21 Jan 2026. New guest tokens need a Service App an org admin approves, and only paid Webex subscribers can create guests. Ordinary invitees join by the meeting `webLink`; the proposal rests on that | Docs: changelog [3], Service App guests guide [4], Create a Meeting spec [5] (all opened) |
| Section 4, card rules | "the `markdown` field is the required fallback" | A card message needs `text` OR `markdown`. Webex does not support card `fallbackText`. Card notifications show a generic "shared a card" line, not the fallback | Cards guide [1] (opened) |
| Section 4, limits | markdown up to 7,439 bytes | Kept. Added: the whole message (`text`, `markdown`, `attachments`) cannot exceed 22,740 bytes. The 7,439 limit is stated on both `text` and `markdown` in the spec (v0 said opened; the team's verification file still lists it as snippet, so this re-open closes that row) | Create a Message spec [2] (opened) |
| Section 4, limits | previews only for 1 MB or less | Kept, narrowed: "File previews are only rendered for attachments of 1MB or less". Applies to files, not cards, and we send no file by default | Spec [2] |
| Section 4, limits | attachments up to 100 MB | Kept: "Message attachments are limited to 100MB each" | API basics [6] (opened) |
| Section 4, privacy bullets | Webex residency for Messaging, space-owner rule (snippet) | Kept as org-dependent. Help page (updated 24 Sep 2026) tells admins to check Control Hub, Account, Info, Data Locations. Space-owner wording not re-read tonight, still snippet | Help page [7] opened, partial |
| Section 5, spoken lines 1 and 3; slide A, B, steps 1 to 6 | marked honest | Four lines and slides reworded, see section 3 | Check, plus self-assessment rows 8 and 10 |
| Section 6, slide B | "Webex Australian residency (if the org is set up)" | "Australian residency, subject to the host org's configuration" | Check; matches [7] |
| Section 2, NIIN row | page `cisco.com/c/m/en_au/niin.html` | Newer page read: "Cisco's flagship industry-university collaboration initiative in Australia", est. 2020; Cisco brings platforms, engineering expertise, funding for research chairs | NIIN page [8] (opened) |
| Section 4, card fields table | Learner: "First name or Learner 12; age band only" | Pseudonymous id only ("Learner 12" style), no first name, no learner name anywhere on the card. Message is text and link only, no audio. Space members: the reviewer and the supervisor only, listed in the share notice (or a 1:1 message), because every member sees the message | privacy-design-v1.md data-flow row "Webex message" and its conflict note (team file); coordinator message 6 Nov 20:16 |
| New (not in v0) | none | Three small Webex card uses, one dropped (edit) | Section 5 |
| Check said: edit the bot message when sharing is revoked | n/a | Rejected: edits of messages with attachments (cards are attachments) return 400. Delete instead | Edit a Message spec [2] |

## 1. Codex points: confirmed, corrected, unverified
| # | Codex point on v0 | Result | Evidence |
|---|---|---|---|
| 1 | `POST /v1/messages`, bearer bot token, `roomId` or `toPersonEmail` | Confirmed (carried from v0, spec opened) | [2] |
| 2 | Bot token shown once | Unverified in v1 (v0 read the Bots guide, not reopened tonight) | [v0-3] |
| 3 | Card needs `markdown` fallback | Corrected: `text` or `markdown`; no `fallbackText` | [1] |
| 4 | Card version 1.3, schema, one card per request | Confirmed ("Webex supports Adaptive Cards Version 1.3"; "Only one card can be sent per request") | [1] |
| 5 | "7,439 bytes unsure; 22,740 total" | Both confirmed. 7,439 per `markdown` or `text`; 22,740 for the whole message | [2] |
| 6 | One file, public URL or multipart, 100 MB | Confirmed | [2][6] |
| 7 | "1 MB preview rule unsure, remove" | Confirmed in the spec, so kept, but off the pitch: it is a files rule | [2] |
| 8 | No `Media` element in a card | Confirmed ("not supported: `Media`") | [1] |
| 9 | Group-space bot sees only @mentions; posting unaffected | Unverified in v1 (v0 source, not reopened); Codex qualification accepted as wording | [v0-3] |
| 10 | Australian Messaging residency is org-dependent; check Control Hub | Confirmed as the admin route; Australia-for-Messaging table cell not read cleanly (page is JavaScript-heavy). Keep "can be", never "is" | [7] |
| 11 | Guest Issuer is stale | Confirmed: creation disabled 21 Jan 2026; type "removed"; Guest Issuer guests "deprecated". New route = Service App, admin-approved, paid subscribers only | [3][4] |
| 12 | Webex minimum age 13+ | Unverified in v1 (eSafety snippet only) | [v0-23] |
| 13 | Open URL button on the card | Confirmed: `Action.OpenUrl` is in the spec's card example | [2] |
| 14 | "I'll take this" Submit action plus webhook | Confirmed: `Action.Submit` data comes via the `attachmentActions` `created` webhook; one webhook serves all cards. Needs a live endpoint, so mock only | [1] |
| 15 | Edit the message on revoke | Rejected (400 for messages with attachments); Delete a Message exists | [2] |
| 16 | Webex Meetings join link via `webLink` | Confirmed: the create-a-meeting response schema has `webLink` | [5] |

- Unverified count (v1 additions): 3 (rows 2, 9, 12). Retention under the org's policy stays unverified from v0.

## 2. The stage mock: choice, failure, sentence
- Choice: default = screenshot of the hand-off card, embedded in slide A and in the deck backup. No live Webex dependency on stage.
  o Reason: the stage rig already has six drilled failures (freeze-and-rehearsal-playbook s5); a login or network step would be a seventh with no drill and no spare.
  o Stand and showcase (second laptop, not the stage laptop): the pre-sent message open in a test space on a second screen.
  o Sandbox bot token live post: Tuesday rehearsal only, never on stage. Token stays in an env var, off screen.
- What the screenshot is: if the team does send a real test message before the Tuesday 15:00 freeze, it is a "test message" in a team test space with a synthetic take. If not, it is the designed mock screen and says "mock". Never mix the two words.
| Option | Failure mode | Say if it fails |
|---|---|---|
| Screenshot in the deck (stage default) | Slide fails to load; image reads as live | "This is the hand-off we designed; here is the captured screen." (mock) or "This is the test message we sent; here is the capture." (real test) |
| Pre-sent message, second screen (stand) | Login, network, wrong space, notification pop-up | "The live view is down; this screenshot is the same test message." |
| Live post with a sandbox bot token (rehearsal) | Token, membership, payload or card rendering fails | "The live post did not complete; our intended Webex hand-off is the prepared screen." |
- Consistent with playbook s5: label it on screen as well as aloud, never present it as live, and the speaker does not wait; the rig lead acts.
- Fields on the card come from handoff-design-v0.md s8: trigger on the third miss, card fields filled from the real take, cues and proofs, consent tap; teacher list canned; "mock pilot" wording; reply is a pre-written cue; revoke is a local log line.
- Card identity (privacy-design-v1.md): pseudonymous id only ("Learner 12"), no first name; goal text can still identify, so keep it generic on stage. Space members = the reviewer and the supervisor only; synthetic or teammate data on stage. No audio, no learner name, text and link only. Do not claim erasure: the message stays under the Webex org's retention (unverified).
- Message content follows privacy-design-v0.md s1: text and a link the learner chose to share, no audio attached. With no real post, the "Shared take" row is a button label only.

## 3. Spoken lines and slide statements: honest, borderline, overclaim
| # | Line or slide claim | Mark | Reworded line |
|---|---|---|---|
| 1 | Spoken 1: "the teacher gets the fix list in Webex; today, a mock" | Borderline | "Our mock shows the learner sharing a fix list with a teacher through Webex." If a real post is shown: "test message" |
| 2 | Spoken 2: "Connected North, started by Cisco Canada in 2014 and now run by TakingITGlobal (search-result only), brings experts to remote classrooms over Webex. We prepare the evidence a teacher needs" | Honest | Keep. Add: "a pattern we learn from, not a partner" |
| 3 | Spoken 3: "Audio stays on the phone. A teacher only hears a take the learner chose to share, through a link that expires" | Borderline | "Audio stays on the phone unless the learner shares it. In our design the teacher link would expire." (expiry is proposed, privacy-design s1) |
| 4 | "Built on Cisco" or "integrated with Webex" (mock) | Overclaim | "We have mocked a Webex teacher hand-off." |
| 5 | "Cisco is partnering with us" or "Cisco-backed pilot" | Overclaim | "We would seek a university pilot through the hub." |
| 6 | "Meraki or ThousandEyes keeps it offline" or "Cisco AI listens" | Overclaim | "Our app handles offline practice itself." |
| 7 | Slide A: "teacher gets the card in Webex" | Borderline | "Mocked teacher card in Webex" (legend: Built, Mock, Future) |
| 8 | Slide B: Webex bot, Duo, residency, NIIN pilot, Connected North | Borderline | Bot, Duo, pilot marked "proposed"; "Australian residency, subject to the host org's configuration"; Connected North labelled "precedent" |
| 9 | Slide B steps 1 to 6 | Borderline | Step 1 Built; step 2 Mock button; steps 3, 5, 6 Proposed (seven-day delete, teacher sign-in, expiry); step 4 Mock screen |
| 10 | Q&A: "A university would want teacher sign-in and local data; Duo and Australian residency are candidates we have not tested" | Honest | Keep |
| 11 | Q&A: "NIIN and the Innovation Centrals are Cisco's route from prototype to pilot; using it is our ask" | Borderline | "NIIN is a possible route we would ask about; no pilot is agreed." |
| 12 | Q&A: "Webex documents a messages API for exactly this kind of bot post" | Honest | Keep; adds "we show a mock and have not run it with real learners" |
| 13 | Any line that lets Webex stand for "the AI" (self-assessment row 8: a judge may ask "where is the AI?") | Overclaim risk | Never answer the AI question with Webex. Say: "Webex is how a human gets involved; the AI is the part that turns a measured miss into your words and your plan" (self-assessment: say it only if the model step really runs, shown as labelled example output) |
| 14 | Self-assessment row 10: sponsor fit; Webex hand-off is a mock, no teacher partner signed | Honest if stated | "The hand-off is a designed screen; no teacher partner is signed yet." |
| 15 | Duo: "teachers sign in with Duo" | Borderline | "Teacher sign-in, for example Duo, is proposed." Learners (children) never use Duo |
- Time check: a 3-minute pitch affords one Cisco sentence and slide A. Lines 1, 3, 7 are the ones to say; 8 to 15 are Q&A and showcase.

## 4. The two statements a sponsor engineer would challenge first
1. Challenge: "Meeting guests join through a Guest Issuer app." (v0 said so.)
   o Answer: "That is stale for new apps. Creation was disabled in January 2026. We would start with a normal Meetings join link; a token-based guest flow needs an admin-approved Service App on a paid subscription, and we have not tried it."
   o v1 fix: v0's Meetings row and fit 2 now read "join link" only.
2. Challenge: "Webex content can be stored in Australia."
   o Answer: "Cisco offers Australian residency for some Webex services, but we have not checked a teacher's org. Where a space lives depends on the space owner's org, and an admin sees it in Control Hub under Data Locations. The recording host is our own decision, separate from Webex."
   o Say "can be in Australia, depending on the org", never "is".
- Next in line if time allows: "Does the card carry the audio?" Answer: no, Webex cards do not support a `Media` element, and by design the message carries text and a consented link [1].

## 5. Further honest uses of the sponsor's technology
| Use | Verified on a Cisco page | Where it sits | Caveat |
|---|---|---|---|
| `Action.OpenUrl` button "Listen (expires in 7 days)" on the card | Yes, the Create a Message spec's card example includes it [2] | Replaces a bare link in the card; text fallback still carries the link; on the mock the button and expiry are labelled proposed, link synthetic | Expiry is our storage's job, not Webex's |
| "I'll take this" button (`Action.Submit`) and a webhook on `attachmentActions` | Yes [1] | Shows the teacher's reply path: the app turns it into the next cue | Needs a running public endpoint; proposed only, not for Wednesday |
| Delete the bot message when sharing is revoked | Yes, Delete a Message exists [2] | Matches the privacy design's revoke step | Cannot recall a download or undo a notification; revoke at the take host first, then delete the message; edit is not an option for card messages |
- All three are text-and-link only, so privacy-design-v0.md s1 holds.
- Not added: Webex Meetings recording, AI Defense, Meraki. They need audio or a hosted service we do not have.

## 6. Codex re-check of this file (gpt-6-sol, medium, names stripped)
- Run: gpt-6-sol, medium, no web, exit 0. Eight points flagged; what survived my check, and what it still flags:
  o Kept (edits applied): revoke order, "revoke at the take host first, then delete the Webex message"; the Listen button and seven-day expiry are labelled "proposed" on the mock with a synthetic link; slide wording "a future version would send" for any delivery claim.
  o Rejected: "limits may change, drop exact numbers": they are read from the live spec on 6 Nov [2]; kept in section 1 as an implementation checklist, off the pitch. "Bytes or characters": the spec says bytes.
  o Partly kept: guest tokens "too broad". Section 0 already leads with the ordinary `webLink`; the Service App route stays an untested option subject to current licensing.
  o Still flagged, unresolved: where a teacher's Webex space would store messages (Australia Messaging cell not read cleanly); notification behaviour of the fallback text (docs say the notification is generic, not tested); "Cisco started Connected North" could be softened to "an example of Cisco's education work" (adopt it if the team wants zero endorsement risk).

## Method
- Read: v0 note, the Codex no-web check of v0, handoff-design-v0 s8, privacy-design-v0 s1, self-assessment-v0 sponsor rows (8, 10), verification-overdrive fix list, freeze-and-rehearsal-playbook s5, COMMON-RULES.
- Web: Webex developer pages fetched as raw HTML with curl and searched for the exact sentences (the rendered pages are JavaScript and the fetch tool returned only titles). Opened: Create a Message, Buttons and Cards, API basics, Meetings changelog, Service App guests guide, Create a Meeting, Webex data-residency help page (partial), NIIN page.
- Codex: the v0 check by an engineer with no web was supplied as input (not re-run). Re-check of v1 at the end: see section 6.
- Not re-verified in v1: bot token shown once, group-space @mention rule, 13+ age, Duo, Connected North, Curtin (carried from v0 sources).
- 6 to 7 Nov overnight: corrected from verification-overdrive-v2.md section 2 (D3, Connected North wording)

## Open questions
- Real test message by Tuesday 15:00, or the designed mock only? The speaker's word ("test message" or "mock") depends on it.
- Does the stand have a second screen and a network that holds a Webex login? If not, screenshot only.
- Does any sponsor university's teacher side run Webex, and in which data region? Ask the Cisco representative.
- Is the Connected North line welcome to a Cisco judge? Ask before using it on stage.
- Who hosts a shared take (owner, location, delete date)? Webex carries the message, not the file.
- Is the model step (self-assessment row 8) going to run? Until it does, line 13 stays unsaid.
- Reconcile qa-prep Q20 ("IP terms not in our sources") with key-facts s4 (carried from v0).

## Sources
1. Webex for Developers, Buttons and Cards guide, https://developer.webex.com/messaging/docs/buttons-and-cards , accessed 2026-11-06, opened (raw HTML).
2. Webex for Developers, Create a Message (also Edit and Delete a Message specs, embedded in the same page data), https://developer.webex.com/docs/api/v1/messages/create-a-message , accessed 2026-11-06, opened (raw HTML).
3. Webex for Developers, Meetings changelog, "New Guest Issuers only via Service App" (21 Jan 2026), https://developer.webex.com/meeting/docs/api/changelog/webex-meetings , accessed 2026-11-06, opened (raw HTML).
4. Webex for Developers, Service App Guests (Guest Management), https://developer.webex.com/create/docs/sa-guest-management , accessed 2026-11-06, opened (raw HTML).
5. Webex for Developers, Create a Meeting (`webLink` in response), https://developer.webex.com/meeting/docs/api/v1/meetings/create-a-meeting , accessed 2026-11-06, opened (raw HTML).
6. Webex for Developers, API basics (attachments limited to 100MB each), https://developer.webex.com/messaging/docs/basics , accessed 2026-11-06, opened (raw HTML).
7. Webex Help Center, Data Residency in Webex (updated 24 Sep 2026; Control Hub, Account, Info, Data Locations), https://help.webex.com/en-us/article/oybc4fb/Data-Residency-in-Webex , accessed 2026-11-06, opened (partial; Australia Messaging cell and space-owner text not read cleanly).
8. Cisco, National Industry Innovation Network (Australia), https://www.cisco.com/site/au/en/solutions/global-partners/niin.html , accessed 2026-11-06, opened.
- v0 sources [v0-1] to [v0-24] remain in cisco-fit-note.md.
- Team files used as context, not web sources: privacy-design-v1.md (Webex data-flow row), cisco-fit-note.md, handoff-design-v0.md, privacy-design-v0.md, self-assessment-v0.md, verification-overdrive.md, freeze-and-rehearsal-playbook.md.
