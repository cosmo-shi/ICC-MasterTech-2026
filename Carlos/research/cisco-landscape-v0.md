# Cisco landscape v0: what else Cisco has that could help the build or appeal to Cisco reviewers

- Date: Sat 7 Nov 2026 10:20 (AEDT), research sweep by a delegated agent from the question Carlos asked at 10:17; reviewed by the session at 10:30.
- Question (Carlos's): what else has Cisco done that could help us build or present, or appeal to Cisco reviewers?
- Scope: 18 candidates beyond cisco-fit-note and cisco-fit-note-v1 (Webex messaging API, cards, bot, guest join, NIIN page, data residency, three card uses). Those are not repeated.
- Status: research draft for the team; proposes only; verify before the pitch. Source numbers in [brackets] point to `## Sources`.
- Access date for every figure: 2026-11-07, unless a row says otherwise.

## 0. Recommendation (conclusion first)
- Rank 1, talking point: the 2024 MasterTech edition shows the format Cisco and NIIN reward. [6][8]
  o Sponsor-set theme, five hubs, real-time personal guidance as the winning idea. Describe by theme only.
  o Use at the desk: "we read the 2024 edition; ours is a home-practice companion, not a stage gimmick".
- Rank 2, roadmap line: Webex Music mode for the mentor call, never for the coach's own pickup. [2][3]
  o Cisco documents Music mode for remote music lessons; noise removal switches off when it is on.
- Rank 3, usable now (rehearsal only): the free Webex developer account and sandbox for the mock bot. [12]
  o Needed only if the team sends one real test message; stage stays offline.
- Rank 4, talking point: Webex accessibility options for the mentor call (captions, screen reader, keyboard). [10]
  o Supports the access story; says nothing about our own app, which has its own accessibility design.
- Rank 5, roadmap line: Vidcast for a learner clip to the mentor without a live call. [11]
  o Free plan lists Vidcast; age rules for under-15 users are NOT verified, so desk talk only.
- Everything else is "say nothing" or a footnote (see table).

## 1. Candidates
| # | What it is | Verified fact (one line) | How it helps the build or the story | Why a Cisco reviewer cares | Honest status | Source |
|---|---|---|---|---|---|---|
| 1 | Webex Meetings SDK / Browser SDK / embedded apps | Browser SDK background noise reduction exists but treats music as noise; Music mode listed unsupported in 2022 post; no newer source found saying it now is | Launching the mentor call from the page is possible in principle; an account and a live network are needed, so not on stage | Shows we read the developer docs and did not overclaim | roadmap line | [1] opened; SDK wiki [13] opened (only a menu entry "Music Mode", no detail) |
| 2 | Vidcast (Webex async video) | Webex free plan page says the Suite menu lets users "record and share video messages, without requiring a meeting"; store listing rates the app 4+ (age rule not stated) | A learner could send a short clip to the mentor with no live call | Uses a Cisco product for async human help | roadmap line | [11] opened; Vidcast store and pricing: snippet [14] |
| 3 | Cisco AI Assistant (meeting summaries) | Help pages say a summary with action items is created when the host turns it on; English only; plan inclusion only from third-party pages | Could give the teacher a written recap of a mentor call | Cisco is pushing AI assistants; recap suits a teacher's time | talking point | [15] snippet |
| 4 | Webex Education Connector (LMS, LTI) | Installs in Canvas, Moodle, Blackboard and others through LTI; status page not found; community users raised privacy and access questions | Possible school path later; ACT school LMS unknown | Education integrations are a Cisco theme | talking point | [16] snippet |
| 5 | Webex Connect (CPaaS) SMS to parents | Not verified by a Cisco page in this run; under-15 privacy limit applies anyway | None now | None | unverified, not used | none |
| 6 | Webex accessibility | Webex App help: Tab and Shift+Tab navigation, JAWS 18 or later and VoiceOver, automatic captions or a human captioner | The mentor call has accessibility options we do not have to build | Reviewers value inclusive design (NIIN page says "inclusive" per team judge-lens) | talking point | [10] opened |
| 7 | Cisco Networking Academy / Skills for All | Skills for All: free, self-paced online courses; 12,100 organisations globally; no current Australian school counts found | Outreach story only; no learner numbers for Australia | Cisco's flagship education programme | talking point | [17] snippet |
| 8 | Country Digital Acceleration (CDA) Australia | 2019 launch, A$61 million over three years; digital government includes K-12 and higher education; a Curtin and Cisco Webex pilot reached remote and regional students (WA impact plan) | Precedent for remote, regional learner outreach | Shows Cisco has funded regional education before | talking point (label "precedent, not a partner") | [18] snippet |
| 9 | Cisco purpose and impact goals | Goal of 1 billion people positively impacted reached in Dec 2023, a year early (snippet); FY25 hub "154M" and NetAcad "25 million by 2032" not read in the PDF | One sentence of alignment at most | Cisco counts impact reach | unverified, not used (figures); goal wording only as snippet | [19] snippet |
| 10 | NIIN and past MasterTech | NIIN est. 2020, "Cisco's flagship industry-university collaboration initiative in Australia"; 2024 edition: five hubs, sponsor-set theme "sustainable stores of the future", a Canberra hub entry won with real-time personalised guidance | Tells us the judging taste: a clear user, one sponsor-aligned idea | The people at the desk run NIIN | usable now (as context) | [8] opened; [6] opened; 2025 results: none found |
| 11 | Cisco hubs at sponsor universities | Snippets: Innovation Central Melbourne at La Trobe (Digital Innovation Hub, Nov 2023); Adelaide at Flinders (2022); Canberra hub announced Oct 2022; NIIN Cyber Alliance managed by the University of Canberra (opened on NIIN page [8]) | Follow-on path: pilots through a hub, if a university asks | Reviewers represent these hubs | talking point | [20] snippet; [8] opened |
| 12 | Webex developer account and sandbox | Sandbox "unlocks the ability to make Webex API calls that require Admin user permissions"; a snippet says a 10-user cap; cost and expiry not stated on the opened page | Free, legal way to rehearse a real test post | Shows we respect the platform terms | usable now (rehearsal) | [12] opened; cap snippet [21] |
| 13 | Meraki in schools | Meraki K-12 collateral exists (wireless, dashboard, E-Rate is a US scheme); no Australian education page opened | None; our app handles offline itself | None | say nothing | [22] snippet |
| 14 | Cisco AI Defense | Vendor pages: algorithmic red teaming (200+ categories) and runtime guardrails; deployment SaaS, VPC or data centre, so a hosted service | Roadmap line only: test the one-sentence output | Cisco is pushing AI security | roadmap line (needs a hosted service we do not have) | [23] snippet |
| 15 | Foundation AI open-weight models | Model card: Foundation-Sec-8B is "an open-weight, 8-billion parameter base language model specialized for cybersecurity", Apache 2.0, for local deployment where data control matters | Shows Cisco ships open-weight models; it is a security model, wrong for coaching text | Cisco AI story is local and open as well as cloud | talking point (never as our model) | [9] opened |
| 16 | Cisco Live Melbourne 2026 | Runs 9 to 12 Nov; Cisco CX stand themes: agentic AI, AI infrastructure, Cisco IQ, resilience, "One Cisco" | Know what the hall is about before the desk talk | Our idea is an education and access angle, not their themes | talking point | [7] opened |
| 17 | Cisco or Webex music-education case study | None found from Cisco; one school study reports Webex used for live music lessons in spring 2020 (research paper, not Cisco) | Do not claim a Cisco music precedent | None | say nothing | [24] snippet |
| 18 | Webex data residency, government assurances | No new facts beyond cisco-fit-note-v1 (see cisco-fit-note-v1 section 4, challenge 2) | None new | None new | say nothing | see cisco-fit-note-v1 |

## 2. Audio capture
| Item | Fact | Status | Source |
|---|---|---|---|
| Browser SDK BNR | "BNR assumes the music is a background noise and reduces it"; enable only after joining; not on by default; webex-js-sdk@2.19.1; Music mode listed unsupported; post dated 18 Oct 2022 | opened. Newer source saying SDK now supports Music mode: none found (a snippet says the post later said such features are expected at a later point) | [1] |
| Music mode, devices | Page n5lfeod covers Board, Desk and Room Series devices; Music mode "is useful for remote music lessons, testing musical instruments" | opened | [2] |
| Music mode, meeting app | "If Noise removal is turned on, it turns off when you turn on Music mode"; "Music mode defaults to encoding Fullband audio quality"; each participant enables it; admins can request the toggle be disabled | opened | [3] |
| Webex AI Codec | "a novel AI-based speech codec"; page gives no bandwidth figure (the "16x" claim lives in a PDF that returned 403): unverified | opened (blog), PDF not opened | [4] |
| Browser pickup | echoCancellation, noiseSuppression, autoGainControl are speech features; switch them off for an instrument | opened | [5] |

- Conclusion: Cisco audio technology fits the mentor call, not the coach's own pickup.
- Note: n5lfeod is a device page; do not tell a reviewer it covers the Webex app. k0yf2g does.
- Spoken feedback could ride the codec in a call, but only speech; instruments must use Music mode.

## 3. Three desk lines
- Line 1 (row 2, section 2): "Webex has a Music mode for music lessons that turns noise removal off; our coach hears the keyboard directly."
- Line 2 (row 10, 11): "NIIN links universities and industry; we would ask how a home-practice companion could reach a school pilot. Nothing is agreed."
- Line 3 (row 6): "Our teacher hand-off is a mock Webex message; Webex already offers captions and screen-reader support for a mentor call."

## 4. What not to claim
| Claim | Why it fails | What to say instead |
|---|---|---|
| "Built on Cisco" or "integrated with Webex" | Hand-off is a mock | "We mocked a Webex teacher hand-off." |
| "Webex Music mode works in the Browser SDK" | 2022 post says unsupported; no newer source found | "Music mode exists in the Webex meeting app; the SDK is unconfirmed." |
| "Webex AI Codec carries the music" | Cisco calls it a speech codec | "Spoken feedback could ride it; instruments need Music mode." |
| "Cisco will pilot or fund us" | No agreement; NIIN page names no such scheme for teams | "We would ask about a pilot through the hub." |
| "Vidcast is safe for under-15s" | No age rule found on opened pages | "We have not checked age rules." |
| "Cisco has a music-education programme" | None found | Say nothing. |
| "Foundation-Sec is our model" | It is a cybersecurity model | "Cisco publishes open-weight models; ours is a different job." |
| Any figure from rows 7 to 9 as exact | Snippet only | Omit or mark "reported". |

## 5. Cisco Live Melbourne 2026 and NIIN context
| Fact | Value | Status | Source |
|---|---|---|---|
| Event dates | 9 to 12 Nov 2026 | opened | [7] |
| Venue | Melbourne Convention and Exhibition Centre, World of Solutions, NIIN stand (info pack p3, p4) | team file | key-facts-info-pack.md |
| Cisco stand themes | Agentic AI, AI infrastructure, Cisco IQ, resilience, "One Cisco" | opened | [7] |
| Keynote topics 2026 | Not found | none found | none |
| NIIN | Established 2020; partnership of Cisco and Australian universities; Cyber Alliance managed by the University of Canberra | opened | [8] |
| 2024 MasterTech | Five hub teams, theme "sustainable stores of the future", sponsor a retailer, a Canberra hub entry won | opened | [6] |
| 2025 MasterTech | No results found | none found | [25] |
| Innovation Central Sydney | Reported launched March 2026 | snippet | [20] |

## Method
- Searched with WebSearch (standard mode) and opened pages with WebFetch; each opened page was summarised by the fetch tool's reader, so quotes are as returned, not read raw.
- Could not open: Webex AI Codec PDF (403); Cisco Purpose Report PDF, Networking Academy, CDA, Meraki, AI Defense pages (not fetched, snippets only).
- Read inside the folder only: session-rules.md, cisco-fit-note-v1.md, key-facts, judge-lens-v1 (grep only).
- No Codex, no local model, no bus. No names beyond session-rules.

## Open questions
- Does the Canberra hub team want Cisco products named at all, given most judging is desk conversations?
- Is a real Webex test message planned? If not, rows 2 and 12 stay talk only.
- Can the organiser say whether the 2025 edition had a theme and winning pattern?
- Which Webex org would a teacher use, and is Music mode enabled by its admin?
- Any Vidcast age rule for under-15 users: ask the Cisco representative.

## Sources
1. Webex developer blog, Background Noise Reduction added to Webex Browser SDK, https://developer.webex.com/blog/background-noise-reduction-added-to-webex-browser-sdk, opened 2026-11-07 (opened earlier today). "BNR assumes the music is a background noise and reduces it."
2. Webex Help, Music mode on Board, Desk and Room Series, https://help.webex.com/en-us/article/n5lfeod/, opened 2026-11-07. "Music mode is useful for remote music lessons, testing musical instruments."
3. Webex Help, Music mode in meetings, https://help.webex.com/en-US/article/k0yf2g/, opened 2026-11-07. "If Noise removal is turned on, it turns off when you turn on Music mode."
4. Webex blog, Next level audio with Webex AI Codec, https://blog.webex.com/hybrid-work/next-level-audio-with-webex-ai-codec/, opened 2026-11-07. "a novel AI-based speech codec". PDF https://www.webex.com/content/dam/www/us/en/documents/pdf/webex-ai-codec-at-a-glance.pdf: 403, snippet only.
5. MDN, MediaTrackConstraints, https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints, opened 2026-11-07 (earlier today). Lists echoCancellation, noiseSuppression, autoGainControl.
6. University of Canberra newsroom, 10 Dec 2024, https://www.canberra.edu.au/about-uc/media/newsroom/2024/december/ucs-icc-team-takes-top-spot-at-first-mastertech-hackathon, opened 2026-11-07. "Five Innovation Central teams from different universities".
7. Cisco blog, CX at Cisco Live Melbourne 2026, https://blogs.cisco.com/?p=499451, opened 2026-11-07. "from November 9-12"; Agentic AI, AI infrastructure, Cisco IQ.
8. Cisco, NIIN Australia, https://www.cisco.com/site/au/en/solutions/global-partners/niin.html, opened 2026-11-07. "Cisco's flagship industry-university collaboration initiative in Australia."
9. Hugging Face, Foundation-Sec-8B, https://huggingface.co/fdtn-ai/Foundation-Sec-8B, opened 2026-11-07. "an open-weight, 8-billion parameter base language model specialized for cybersecurity applications."
10. Webex Help, Accessibility support features, https://help.webex.com/en-us/article/0ix72j, opened 2026-11-07. "invite a captioner to your meeting".
11. Webex Help, free plan features, https://help.webex.com/en-us/article/pagh8z/Webex-Meetings-free-plan-features, opened 2026-11-07. "record and share video messages, without requiring a meeting"; 40-minute meetings, 100 attendees.
12. Webex developer blog, Developer sandbox now available, https://developer.webex.com/blog/developer-sandbox-now-available, opened 2026-11-07. "unlocks the ability to make Webex API calls that require Admin user permissions".
13. webex-js-sdk wiki, Meetings, https://github.com/webex/webex-js-sdk/wiki/webex-Meetings, opened 2026-11-07. Menu entry "Music Mode"; page says docs no longer current.
14. Vidcast store, pricing and Webex pricing pages, search result 2026-11-07, snippet (https://apps.apple.com/us/app/-/id6742194636, https://pricing.webex.com/au/en/hybrid-work/meetings/all-features/).
15. Webex Help, Post-meeting summaries with Cisco AI Assistant, https://help.webex.com/article/gkzgoe/, snippet 2026-11-07.
16. Webex Education Connector help and community pages, https://help.webex.com/en-US/article/ngd7brv/The-Cisco-Webex-Education-Connector-for-Teachers, snippet 2026-11-07.
17. Cisco Networking Academy Skills for All, https://blogs.cisco.com/our-corporate-purpose/cisco-networking-academy-launches-free-it-education-to-empower-all-people-with-career-possibilities/, snippet 2026-11-07.
18. Cisco CDA and WA impact plan, https://cisco.com/au/cda and https://www.cisco.com/c/dam/global/en_au/assets/pdfs/cisco-wa-state-impact-plan.pdf, snippet 2026-11-07.
19. Cisco Purpose Report 2025, https://www.cisco.com/content/dam/m/en_us/about/purpose/reporting-hub/_pdf/purpose-report-2025.pdf, snippet 2026-11-07 (not opened).
20. Innovation Central hubs: https://www.canberra.edu.au/about-uc/media/media-releases/2022/october/university-of-canberra-and-cisco-establish-a-national-cybersecurity-partnership, https://www.techpartner.news/news/cisco-uts-unveil-innovation-central-sydney-624348, snippet 2026-11-07.
21. Webex developer sandbox guide, https://developer-usgov.webex.com/docs/developer-sandbox-guide, snippet 2026-11-07 (10-user cap).
22. Cisco Meraki for K-12, https://meraki.cisco.com/product-collateral/meraki-for-k-12/?file, snippet 2026-11-07.
23. Cisco AI Defense, https://www.cisco.com/c/en/us/customer-success/video/demo/cisco-ai-defense-overview.html, snippet 2026-11-07.
24. Thessaloniki school Webex music study, https://ejournals.epublishing.ekt.gr/index.php/openjournal/article/view/24290, snippet 2026-11-07.
25. Cisco Live Melbourne 2025 and MasterTech 2025 search, https://netboxlabs.com/events/cisco-live-2025-melbourne/, snippet 2026-11-07.
