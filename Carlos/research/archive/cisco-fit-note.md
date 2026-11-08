# Cisco fit note: where Cisco technology honestly touches the practice coach

- Date: Fri 6 Nov 2026 (AEDT), overnight run. Purpose: an honest Cisco fit for the pitch and the showcase.
- Recommendation: one real fit (Webex message for the teacher hand-off, mocked on Wednesday), one story fit (Cisco's own Webex outreach precedent), the rest slide-only or not at all.
- Scope: verified product table, top five fits, the Webex mock and its API call, spoken lines, two slides, the "what has this to do with Cisco" answer.
- Status: overnight draft for the team; verify before the pitch. Source numbers in [brackets] point to `## Sources`.

## 1. Recommendation
- Lead with the hand-off: when a fix needs a real teacher, a Webex message carries the fix list to a teacher.
  o Wednesday: a mock Webex screen (build-plan-v0.md section 11). Optional real post from a bot into a team test space.
  o The message carries text and a link the learner chose to share, never a raw audio attachment by default (section 4).
- Name the next step plainly: the human lesson itself could run on Webex Meetings (proposed, not shown) [24].
- Tell the precedent, do not borrow it: Cisco founded Connected North, which links remote classrooms to experts over Webex [22].
  o It shows a Cisco reviewer we know their own outreach story; it is not our product and not a music programme.
- Duo sign-in for teachers: story slide only, as already planned (friday-selection-pack section 10).
- Meraki, MV cameras, ThousandEyes, Splunk, AppDynamics, Umbrella, AI Defense, Webex Connect: leave off the pitch.
  o An offline phone app at home does not run on school network tools; claiming them is the overclaim a Cisco judge spots.
- Past MasterTech winners cited no Cisco product; sponsor fit beat Cisco fit (past-challenges-research.md).
  o So the Cisco fit is a bonus, kept small and true. The judges still include Cisco, so a true, specific fit helps.
- Advisor steers this follows (state-of-play section 4): augment the tutor; something the sponsor can act on; minimal infrastructure.

## 2. Verified product table
| Product or programme | What it is (one line) | Touches this product? | Src |
|---|---|---|---|
| Webex Messaging API | REST API; `POST https://webexapis.com/v1/messages` posts text, markdown, one file or one card to a space or a person | Yes: the hand-off message | [1][2] |
| Webex bots | Bot accounts act like users in 1:1 and group spaces; token shown once at creation; in group spaces a bot only sees messages that @mention it | Yes: the app's sender identity | [3] |
| Webex adaptive cards | A card is an attachment on a new message; one card per request; Webex supports card version 1.3; no `Media` element; text or markdown fallback required | Yes: the hand-off card | [1][4] |
| Webex data residency (Australia) | Webex blog, Mar 2026: Sydney and Melbourne data centres now provide residency for Webex Messaging, Meetings, Calling; content sits in the space-owner org's region | Privacy condition, org-dependent | [5][6] |
| Webex Meetings API | Create a Meeting returns a join link (`webLink`); guests without accounts can join through a Guest Issuer app | Proposed: the live lesson after the hand-off | [24] |
| Webex Connect | Cisco CPaaS (formerly imiconnect): flows across SMS, WhatsApp, email and 12+ channels | Weak: SMS reminders; overkill for a week | [15] snippet |
| Duo (Web SDK v4) | Two-factor via an OIDC-compliant redirect to the Duo Universal Prompt; SDKs for Python, Node, Java, Go, C#, PHP | Story: teacher and outreach-staff sign-in | [7] |
| Duo Free | $0, capped at 10 users | Makes a real teacher-login pilot affordable later | [8] snippet |
| Meraki Dashboard API | REST API to "manage and monitor Meraki networks at scale" | No: home phones are not on Meraki | [9] |
| Meraki MV cameras | Smart cameras; snapshot and camera-intelligence APIs (people counting, occupancy) | No: we listen on the learner's phone; a camera is wrong for privacy | [10] snippet |
| ThousandEyes | SaaS "network intelligence": visibility into internet apps and networks from cloud, enterprise and endpoint vantage points | No for the learner; maybe a university's ops team later | [11] |
| Splunk Observability / AppDynamics | AppDynamics now Splunk AppDynamics inside Splunk Observability; application performance monitoring | No this week; only if a hosted service exists | [12] snippet |
| Umbrella / Secure Access | Umbrella SIG and DNS end-of-sale 31 Jan 2027, support to 31 Jan 2029; DNS offers move to Cisco Secure Access DNS | No; and naming Umbrella now dates the slide | [13] |
| Cisco AI Defense | Security for AI apps, models and agents: discovery, model validation, runtime guardrails | No: on-device rules, optional tiny LLM call, off on stage | [14] |
| Networking Academy | Cisco's skills programme ("Cybersecurity, Python and more"); NIIN page says Cisco supplies NetAcad training to the network | Path only: no music content | [16][17] |
| NIIN and Innovation Centrals | "A partnership between Cisco and Australian universities"; Innovation Centrals are "the front door for industry-university collaboration" | Yes: the follow-on path after Wednesday | [17] |
| Country Digital Acceleration | Global Cisco programme in 56 countries, education leads its list of verticals; Australia launched 2019 with A$61m over three years | Weak: no current Australian education call found | [18][19][20] snippet |
| Connected North (Canada) | Cisco-founded, now run by TakingITGlobal; Webex links remote, mainly Indigenous classrooms to experts; 35,000 students in 150 schools (Oct 2023) | Story precedent for the hand-off | [22] |
| Curtin and Cisco "Connected Country" pilot | Nov 2020: Webex virtual learning for remote and regional WA students, modelled on Connected North; schools join Cisco's Digital Schools Network | Australian precedent; outcomes not reported | [21] |

## 3. Top five fits (ranked by honesty, then usefulness)
| # | Fit | What we can show in a week | What a Cisco reviewer recognises | Overclaim risk |
|---|---|---|---|---|
| 1 | Webex bot posts the hand-off card to a teacher | Mock screen styled as a Webex space (planned); optional real post to a team test space, synthetic take | Bots, adaptive cards, the Messages API; Webex is the programme's own channel | "Integrated with Webex" for a mock; implying teachers are on Webex today |
| 2 | Webex Meetings for the 10-minute lesson the card asks for | Slide-only: a "Book a lesson" button on the mock card that goes nowhere, labelled proposed | Meetings API, guest join for people without accounts [24] | Showing a lesson that never happened; implying teachers are lined up |
| 3 | Connected North pattern: remote learner reaches a human expert over Webex | Slide-only: one line, no Cisco logo | Cisco's own outreach story, 35,000 students in 150 schools as of Oct 2023 [22]; Curtin pilot in WA [21] | Implying Cisco endorses us, or that a Webex link improves music learning |
| 4 | Duo for teacher and outreach-staff sign-in before they open a shared take | Slide-only; real only with a Duo Free account, not this week | Universal Prompt, OIDC Web SDK [7] | "Duo-protected" for a mock; learners (children) never use Duo |
| 5 | NIIN and Innovation Central as the path to a university pilot | "What next" slide: pilot with a sponsor university through the hub, proposed | NIIN as Cisco's own university network [17] | "Partnership", "Cisco-backed pilot"; nothing is agreed |

- Moved out of the five after the critique: Webex Australian residency is a privacy condition, not a product fit (section 4).

- Dropped from the five, with the reason a judge would give:
  o Meraki and ThousandEyes: the learner's phone at home is outside any school network; the design is offline-first.
  o MV cameras: a camera on a child practising adds privacy risk and solves nothing we need.
  o AI Defense, Splunk, AppDynamics, Umbrella: no hosted service worth guarding or monitoring this week.

## 4. The mock the build plan can afford
### What the screen shows (Wednesday default: mock)
- A Webex-style space titled "Practice hand-off (mock)", one bot message, one card. Label "mock" in speaker notes and corner.
- Card fields (all from the app's own data, R10 and R11):
| Field | Example |
|---|---|
| Learner | First name or "Learner 12"; age band only |
| Goal | "Play Ode to Joy for mum" |
| Fix tried | "Even the left-hand timing in bar 3"; three sessions, no pass (the ceiling rule) |
| Proof so far | Before and after line in playing terms, not dB |
| Shared take | "Listen (link expires in 7 days)", only if the learner chose to share |
| Ask | "Can you show one technique for this in a 10-minute lesson?" |

### What the real API call looks like (optional Tuesday, team test space only)
- Endpoint and auth: `POST https://webexapis.com/v1/messages`, header `Authorization: Bearer <bot token>` [1][3].
- Body: `roomId` (or `toPersonEmail` for a 1:1), `markdown` up to 7,439 bytes, and `attachments` with one adaptive card [1].

```
POST https://webexapis.com/v1/messages
Authorization: Bearer $WEBEX_BOT_TOKEN        (env var, never in the repo)
Content-Type: application/json

{
  "roomId": "<team test space id>",
  "markdown": "**Practice hand-off (pilot mock)** Goal: Ode to Joy. Fix tried 3 sessions: even bar 3 timing. [Shared take, expires 7 days](<link>)",
  "attachments": [{
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": { "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard", "version": "1.3",
      "body": [ { "type": "TextBlock", "text": "Practice hand-off", "weight": "Bolder" },
                { "type": "FactSet", "facts": [ { "title": "Goal", "value": "Ode to Joy" },
                                                { "title": "Fix tried", "value": "Even bar 3 timing" } ] } ] }
  }]
}
```
- Card rules (verified [4]): version 1.3 supported; the `markdown` field is the required fallback for clients that cannot render cards, so it must carry the whole hand-off on its own.
- No `Media` element in Webex cards [4], so the take cannot play inside the card; it is always a link.
- Limits that matter (verified [1][2]): markdown up to 7,439 bytes; one file per message; `files` takes a public URL or a multipart upload; attachments up to 100 MB; previews only for files of 1 MB or less.
- Sender: a bot; its token is shown once at creation and lives in an environment variable [3].

### Privacy rules the message must respect (privacy-design-v0.md)
- Default: the message carries text and features only (goal, fix, proof line). No audio file attached.
  o Reason: a file posted to Webex sits in the Webex org's storage under its retention, not our 7-day expiring link.
- Audio leaves only by the learner's per-recording opt-in, as an expiring, revocable link.
  o Guardian approves for under 15: OAIC presumes capacity from 15 when case-by-case checks are impractical (privacy-design-v0.md s3).
- Say what the link cannot do: expiry does not erase a teacher's download, and the Webex message text stays under the org's retention (retention: unverified).
  o Mitigation already in privacy-design-v0.md: teacher signs in to open the take, and access is logged.
- The learner is never put in a Webex space: Webex lists 13+ as its minimum age (eSafety guide, snippet) [23]; the bot writes to the teacher.
- Offshore: Webex now offers Australian residency for Messaging [5]; content sits in the space-owner org's region, and a bot-created space belongs to the first non-bot member's org [6] (snippet).
  o So the take's host (our storage, not Webex) needs its own residency answer; say "can be in Australia", never "is".
- On stage: synthetic or teammate takes only; no real learner, no real teacher space, bot token out of the repo and off screen.

## 5. Spoken lines
### Three honest lines (under 25 words each)
1. "When a fix needs a teacher, the learner taps share and the teacher gets the fix list in Webex; today, a mock." (22)
2. "Cisco started Connected North to bring experts to remote classrooms over Webex. We prepare the evidence a teacher needs before that conversation." (22)
3. "Audio stays on the phone. A teacher only hears a take the learner chose to share, through a link that expires." (21)

### Three lines never to say
1. "Built on Cisco" or "integrated with Webex" while the Webex screen is a mock.
2. "Cisco is partnering with us" or "Cisco-backed pilot": nothing is agreed; the NIIN path is a proposal.
3. "Meraki or ThousandEyes keeps it working offline" or "Cisco AI listens to you": the app works offline on its own, and the listening is ours.

## 6. Two Cisco-fit slides
- Time check: a 3-minute pitch affords one Cisco strip, not two slides. Slide A goes in the pitch; slide B is the showcase and Q&A backup.
| Slide | Title | Content | Legend |
|---|---|---|---|
| A (in pitch, on the hand-off beat) | "Where the human comes in" | Practice offline, one fix, retake proof, ceiling reached, learner taps share, teacher gets the card in Webex | Built: loop. Mock: Webex card. Future: live lesson |
| B (showcase, backup) | "What it takes to run it with a university" | Webex bot for hand-offs (proposed); Duo sign-in for teachers (proposed); Webex Australian residency (if the org is set up); pilot through NIIN and the hub (proposed); Connected North as the pattern, not a partner | Built / mocked / proposed, on every item |
- Slide A visual: the hand-off card screenshot from the mock, with "mock" in the corner.
- Slide B visual (the critique's best change): a consent and data-flow strip, each box marked built, mock or proposed.
| Step | What happens | State on Wednesday |
|---|---|---|
| 1 | Take recorded and scored on the phone; audio stays | Built |
| 2 | Learner (or guardian) approves sharing this one take | Mock button |
| 3 | Take stored by us with an owner, a location and a 7-day delete | Proposed |
| 4 | Webex bot message to the teacher: fix list plus link | Mock screen |
| 5 | Teacher signs in (Duo proposed) to open the take; access logged | Proposed |
| 6 | Link expires, learner can revoke, file deleted | Proposed |

## 7. "What does this have to do with Cisco?" (works with nothing integrated)
- Our product's turning point is a human hand-off, and that is a message; Webex is Cisco's messaging platform and this programme's own channel.
- Webex documents a messages API for exactly this kind of bot post; we show a mock today and have not run it with real learners.
- Cisco-founded Connected North brings experts to remote classrooms over Webex; that is the pattern we follow, not evidence our app works.
- A university running it would want teacher sign-in and local data; Duo and Webex Australian residency are candidates we have not tested.
- NIIN and the Innovation Centrals are Cisco's own route from prototype to university pilot; using it is our ask, not an agreement.

## Method
- Read the team files named in the brief (key-facts-info-pack.md, hackathon-winning-patterns.md s2, past-challenges-research.md, build-plan-v0.md s4 and s11, friday-selection-pack s10, state-of-play s4 and s5, privacy-design-v0.md s1 to s6, qa-prep.md Q20).
- Input: a Codex (GPT-6 Sol) knowledge draft written tonight without web access; every product fact rechecked here; leftovers marked unverified.
  o Kept after checks: Webex messages and attachments, Duo OIDC Web SDK, Umbrella transition, NIIN role, CDA.
  o Changed: Webex audio attachment replaced by text plus expiring link (privacy rule); Meraki and ThousandEyes dropped from the five; Connected North and data residency added.
- Web: Webex developer pages read as raw HTML (the rendered pages are JavaScript); the create-a-message page embeds the OpenAPI spec and the attachments guide.
- Codex critique (gpt-6-sol, medium, names stripped), result checked against the Webex pages:
  o Kept: Webex Meetings above residency (re-ranked); residency recast as a privacy condition; fallback text and `$schema` (both verified in the cards guide); consent and data-flow strip; softer section 7 wording; guardian-age rationale.
  o Rejected: "remove the 1 MB preview limit" and "7,439 bytes unverified": both are in the Create a Message spec [1].
  o Marked unverified: Webex message retention under the org's policy (Codex claim, not opened).
- Unverified count: 2 (message retention; Webex Connect detail rests on snippets only). Snippet-only sources: 6, 8, 10, 12, 15, 19, 20, 23.

## Open questions
- Real post or mock only? A real post needs a bot token and a team test space by Tuesday 15:00 freeze; mock is the default.
- Does any sponsor university run Webex with Australian residency, or Duo? Ask the Cisco representative (problem-framing A9).
- Is the Connected North line welcome or presumptuous to a Cisco judge? Ask Jeff before using it on stage.
- Who hosts a shared take (owner, location, delete date)? Webex carries the message, not the file; the team must name the store.
- Book-a-lesson button on the mock card: show it as proposed, or leave it off to keep the demo tight?
- qa-prep.md Q20 says IP terms are "not in our sources"; key-facts-info-pack.md has the IP clause (La Trobe owns, assigned to the sponsor). Reconcile.

## Sources
1. Webex for Developers, Create a Message (embedded OpenAPI spec), https://developer.webex.com/docs/api/v1/messages/create-a-message , accessed 2026-11-06, opened (raw HTML).
2. Webex for Developers, Message Attachments section of the API basics guide (100 MB, multipart upload), https://developer.webex.com/docs/basics , accessed 2026-11-06, opened (text embedded in source 1).
3. Webex for Developers, Bots guide, https://developer.webex.com/messaging/docs/bots , accessed 2026-11-06, opened (raw HTML).
4. Webex for Developers, Buttons and Cards guide (limitations, fallback text), https://developer.webex.com/messaging/docs/buttons-and-cards , accessed 2026-11-06, opened (raw HTML).
5. Webex blog, Webex Expands Data Residency in Australia (2 Mar 2026), https://blog.webex.com/collaboration/webex-expands-data-residency-in-australia/ , accessed 2026-11-06, opened.
6. Webex Help Center, Data Residency in Webex (space-owner rule, bot-created spaces), https://help.webex.com/en-us/article/oybc4fb/Data-Residency-in-Webex , accessed 2026-11-06, snippet (versions conflict on Australia for Messaging).
7. Duo, Duo Web v4 SDK, https://duo.com/docs/duoweb , accessed 2026-11-06, opened.
8. Duo, Pricing, https://duo.com/pricing , accessed 2026-11-06, snippet.
9. Cisco DevNet, Meraki Dashboard API v1, https://developer.cisco.com/meraki/api-v1/ , accessed 2026-11-06, opened.
10. Cisco DevNet, Meraki MV camera intelligence APIs, https://developer.cisco.com/meraki/mv-sense/ , accessed 2026-11-06, snippet.
11. ThousandEyes docs, Getting Started, https://docs.thousandeyes.com/product-documentation/getting-started , accessed 2026-11-06, opened.
12. Splunk, AppDynamics joins Splunk, https://www.splunk.com/en_us/appdynamics-joins-splunk.html , accessed 2026-11-06, snippet.
13. Cisco, End-of-Sale and End-of-Life Announcement for Cisco Umbrella SIG and DNS, https://www.cisco.com/c/en/us/products/collateral/security/security-cloud/umbrella-sig-dns-eol.html , accessed 2026-11-06, opened.
14. Cisco, AI Defense product page, https://www.cisco.com/site/us/en/products/security/ai-defense/index.html , accessed 2026-11-06, opened.
15. Webex for Developers, Webex Connect, https://developer.webex.com/docs/webex-connect , and https://help.webexconnect.io/ , accessed 2026-11-06, snippet.
16. Cisco Networking Academy, https://www.netacad.com/ , accessed 2026-11-06, opened (title only rendered).
17. Cisco, National Industry Innovation Network, https://www.cisco.com/c/m/en_au/niin.html , accessed 2026-11-06, opened.
18. Cisco, Country Digital Acceleration, https://www.cisco.com/au/cda , accessed 2026-11-06, opened (global page; Australia not named).
19. Cisco APJC blog, A$61 million plan to accelerate Australia's digitisation (26 Feb 2019), https://news-blogs.cisco.com/apjc/2019/02/26/cisco-lays-out-61-million-investment-plan-to-accelerate-australias-digitisation-and-positively-impact-the-community-business-and-government , accessed 2026-11-06, snippet.
20. Cisco, WA State Impact Plan (2025), https://www.cisco.com/c/dam/global/en_au/assets/pdfs/cisco-wa-state-impact-plan.pdf , accessed 2026-11-06, snippet (download failed).
21. Curtin University, New interactive learning program to benefit regional and remote students (11 Nov 2020), https://www.curtin.edu.au/news/media-release/new-interactive-learning-program-to-benefit-regional-and-remote-students/ , accessed 2026-11-06, opened.
22. Cisco Newsroom, In Canada's North, Cisco helps connect Indigenous students to a world of opportunity (3 Oct 2023), https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2023/m10/in-canada-north-cisco-helps-connect-indigenous-students-to-a-world-of-opportunity.html , accessed 2026-11-06, opened.
23. eSafety Commissioner, The eSafety Guide: Webex, https://www.esafety.gov.au/key-topics/esafety-guide/webex , accessed 2026-11-06, snippet (fetch timed out).
24. Webex for Developers, Meetings guide (Create a Meeting, `webLink`, Guest Issuer), https://developer.webex.com/meeting/docs/meetings , accessed 2026-11-06, opened (raw HTML).
- Team files used as context, not as web sources: key-facts-info-pack.md, hackathon-winning-patterns.md, past-challenges-research.md, build-plan-v0.md, friday-selection-pack-2026-11-06.md, state-of-play-2026-11-06.md, privacy-design-v0.md, qa-prep.md.
