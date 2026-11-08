# Privacy design v1: an app that listens to a learner practising music

- Date: Fri 6 Nov 2026 (AEDT), overnight. Purpose: revise v0 against a critique and the new team files; add the data-flow table, guardian loop and pilot checklist.
- Scope: Privacy Act and APPs, 2024 amendments, under-18 consent, university and ethics expectations, data flows, stage line, pilot checklist.
- Conclusion: audio stays on the phone by default; the cloud coach gets numbers AND the learner's typed words; the LLM provider offers no Australian region; a children's pilot needs a PIA and guardian loop first.
- Status: overnight draft for the team; verify before the pitch. Design note with risk triage, not legal advice. Source numbers in [brackets] point to `## Sources`; team files are [T1] to [T8].

## 0. Change log (v0 to v1)
| Section | v0 said | v1 says | Reason |
|---|---|---|---|
| 1 | Cloud gets "only numbers (pitch, timing)" | Cloud coach gets features plus `learner_goal`, `learner_words`, last two cues | Team file [T3]: the LLM input table carries free text; "numbers only" was false |
| 1 | On-device audio "arguably not collected" | Downgraded: depends on whether the operator can reach or back up the audio ("holds" = possession or control) | Verified lead C1 [8] |
| 1 | No logs tied to IP | Proxy logs features and answer and rate-limits per device; keep the limiter in memory, logs without IP, short life | Team file [T3] section 7 and 8 versus v0 rule; open for tech |
| 2 | Small-business row: three exceptions | Full list of exceptions; operator unknown, so exemption is `unverified` | Verified lead C7 [3] |
| 2 | University row: "state or territory law for the rest" | Per institution: Flinders says neither Act nor state law binds it but it upholds the APPs; UC and La Trobe `unverified` | Verified lead C8/C9 [20] |
| 2 | APP 8 row: contract is "reasonable step" | Contract generally expected plus monitoring; effective control can make it a "use"; APP 8.2 exceptions listed | Verified lead C11/C12 [6] |
| 2 | Children's Code scope: social media, relevant electronic or designated internet service, likely to be accessed by children | Adds "primarily concerned with the activities of children" and the health-service carve-out; commencement still "[to be drafted]"; v0 line "costs little" dropped | Verified lead C13 [17] |
| 2 | Tort: any defendant | Adds elements; intentional or reckless and serious are snippet-level | C14 [9][24] |
| 2 | (absent) | New row: automated-decision disclosure from 10 Dec 2026 | Verified lead C16 [18] |
| 2 | (absent) | New row: LLM provider retention and region (US or global only) | Team file [T3] plus [21][22] |
| 3 | 15 is a fallback presumption | Both: Privacy Act guidance = fallback; draft Code s13 = hard line (15, with reasonable steps to confirm the guardian) for entities it binds; under 15 presumed without capacity | C18 [8][17] |
| 3 | (absent) | 3.1 guardian loop for a university-run pilot | Task item 4; draft Code s13 to s21 [17] |
| 4 | PIA mandate binds agencies only | Same, plus "high privacy risk" wording; draft Code s38 would require a PIA; run one regardless | C20 [14][17] |
| 4 | "Adults and teammates only" | Adults do not bypass ethics: written determination first; teammates-only rehearsal is the fallback | C21 [23][T5] |
| 5 | Retention "until deleted" for several rows | Fixed proposed periods for every row; deletion on request is a promise, not an APP right | C6 [2] |
| 5 | Table of 7 rows | Same table fixed plus 5.1 data-flow table, 10 rows | Task item 3 |
| 6 | "Features only" stage line | One 23-word line; three sentences never to say | Task item 5; C-stage |
| 7 | (absent) | 10-line pilot checklist | Task item 6 |

## 0.1 Critique ledger (every point from the Codex critique, with a verdict)
- Verdicts: accepted (URL = what verified it), rejected (why), unverified (kept out or marked).
| # | Critique point | Verdict | Verification or reason |
|---|---|---|---|
| C1 | On-device audio "uncollected": location is not enough; "holds" includes possession or control | Accepted | B.82 "possession or control", B.84 right or power to deal with a record [8] |
| C2 | Biometric sensitivity wording: "to be used", templates independent | Accepted | B.141: "to be used for the purpose of automated biometric verification" plus "biometric templates" [8]. Design: no voiceprint, no speaker ID |
| C3 | APP 3 "reasonably necessary" for organisations, agencies add "directly related"; sensitive needs consent | Accepted | APP 3.1, 3.2, 3.3 quoted on the APP page [2] |
| C4 | APP list missing 2, 4, 10, 13; assess 7, 9 | Accepted | APP 2 and APP 4 headlines [2]. Applied: pseudonym via local mode (APP 2); background voices and free text are unsolicited-information risks (APP 4). APP 7 and 9: not applicable by design (no marketing, no government identifiers) |
| C5 | APP 6 and 12 have exceptions; consent not universal | Accepted | APP 6.1 plus 6.2, 6.3; APP 12 organisation exceptions [2] |
| C6 | APP 11 destruction exceptions; no general deletion-on-demand right | Accepted | APP 11.2 excepts Commonwealth records and legal retention [2]. Deletion on request becomes a design promise |
| C7 | $3m exemption conditional; more exceptions | Accepted | Full list incl. related bodies corporate, Commonwealth contractors, trading qualified by consent or authority, opt-in [3] |
| C8 | "State law covers the rest" overbroad | Accepted | Rewritten per institution (section 2) |
| C9 | UC: ACT TPPs and health-record law; La Trobe: Victorian laws; Flinders: neither binds but adopts APPs | Partly accepted | Flinders opened (policy PDF read by download): "neither this Act nor any State privacy legislation actually binds the University", upholds APPs [20]. La Trobe page 403; UC policy not opened: both `unverified` |
| C10 | WA public-sector regime from 1 Jul 2026, breach rules 1 Jan 2027 | Partly accepted | Page: IPPs apply to the WA public sector from 1 Jul 2026; breach notification 1 Jan 2027; does not name public universities [19]. Not relevant to the three sponsors (ACT, SA, Vic) |
| C11 | Overseas contractor: effective control can make it a use; contract alone not enough | Accepted | Paras 8.14 to 8.17, 8.60 to 8.63 [6] |
| C12 | APP 8 exceptions omitted | Accepted | 8.20 comparable protection, 8.31 consent after being told APP 8 will not apply, 8.38, 8.41 [6]. 2024 Act text on legislation.gov.au not opened |
| C13 | Children's Code scope also "primarily concerned"; deadline 10 Dec 2026; commencement blank; "costs little" unsupported | Accepted | Exposure draft ss 5, 7 and commencement "[to be drafted]" [17]; deadline [7] |
| C14 | Tort needs intentional or reckless, serious, expectation, public-interest balance; no damage needed; public-authority defence | Partly accepted | OAIC page gives invasion, reasonable expectation, public interest, defence of consent or lawful authority [9]; "intentional or reckless", "serious" and "no damage" from law-firm summaries (snippet) [24]; public-authority good-faith defence `unverified (Codex knowledge)` |
| C15 | Add enhanced enforcement and security measures from 2024 reform; 2025 Regulations | Rejected | Not needed for any design decision; not verified; dropped |
| C16 | Automated decisions disclosure from 10 Dec 2026 | Accepted | OAIC: from 10 Dec 2026, entities using personal information in ADM with "the potential to affect rights or interests" disclose it in privacy policies; scope still under consultation [18]. Critique's "significantly consequential" wording is not on the page |
| C17 | Tranche two: consultation is not enactment | Accepted | Already in v0 [10]; unchanged |
| C18 | Age table: 15 is a fallback, 16 not guaranteed, guardian access not automatic | Accepted | B.59 to B.61: no set age, 15 presumption only when case-by-case is impracticable, under 15 presumed without capacity; the page is silent on guardian access, so access is `unverified` [8] |
| C19 | "No account without consent" is a design rule | Accepted | Reworded; three consents kept separate (privacy, account contract, research) |
| C20 | Agencies Code PIA is for "high privacy risk"; other policies can require PIAs | Accepted | OAIC page: "high privacy risk" wording, binds agencies [14]; draft Children's Code s38 [17] |
| C21 | National Statement: capable young person consents, or assent plus authorised consent; adults do not bypass ethics | Accepted | Chapter 4.3 opened: child = under 18; assent only alongside consent; researchers state whether they obtain assent with guardian consent or young-person consent only [23] |
| Q1 | Who answers for harm? | Accepted | Section 7 line 1: named university operator role |
| Q2 | Can participation be voluntary? | Accepted | Local mode plus refusal-costs-nothing line (section 3.1) |
| Q3 | What actually leaves the device? | Accepted | Table 5.1 |
| Q4 | Can sharing and deletion be controlled? | Accepted | Sections 3.1, 5; backups and downloads stay open |
| Q5 | Why expose children to this pilot? | Accepted | Necessity statement in section 4: local mode needs no data; only the hand-off needs a clip |
| G1 | Retention periods for buffers, features, accounts, consent evidence, logs, backups, teacher copies | Accepted | Section 5 |
| G2 | Guardian loop: verify proportionately, record notice, notify child, withdrawal, disputes | Accepted | Section 3.1 |
| G3 | Teacher link: bind to a named teacher, stop forwarding, downloads, deletion duty | Accepted | Section 5 and 5.1; streamed, signed-in, no download button [T1] |
| G4 | Analytics and crash inventory | Accepted | 5.1: none by design; hosting, proxy and CDN logs still exist |
| G5 | LLM: exact fields, provider, regions, retention, training | Accepted | 5.1 and [21][22][T3] |
| G6 | PIA: purposes, flows, consultation, residual risk | Accepted | Section 7 line 6; draft Code s38(2) lists the content [17] |
| S1 | Stage sentence "We propose on-device audio analysis..." | Rejected | Wording kept out: "propose" undersells a design and omits the typed-goal flow; replacement in section 6 |
| S2 | Never say: compliant; numbers anonymous; expiring links erase every copy | Accepted | Section 6 keeps the first two, swaps the third for the Australian-hosting claim; expiry limit stays in section 1 |
| S3 | 10-line checklist | Accepted | Section 7, reworked and verified items marked |

## 1. Recommendation (conclusion first)
- Raw audio stays on the phone by default. The cloud coach gets the feature JSON plus the learner's typed goal and words [T3].
  o Not "numbers only": a typed goal such as "sing at Gran's 80th" is personal information; strip names and places in the proxy and cap length.
  o Whether on-device audio is "collected" or "held" depends on operator reach: no sync, no backup to our cloud, no remote read [8] (B.82, B.84). Android or browser backups are `unverified`; test before claiming.
- No voiceprint, no speaker identification, no template: pitch contour per note only, so the biometric limb stays out [8] (B.141).
- Sharing a recording with a teacher is a separate opt-in per recording: signed-in named teacher, streamed, no download button, 7-day expiry, cancel any time [T1].
- No account for a child under 15 without a guardian; no advertising, no third-party analytics, no direct marketing.
- The LLM call is overseas: the provider's data-residency control offers `us` and `global` only [22]. Treat it as an APP 8 matter: enforceable contract, monitoring, informed consent as an exception route [6].
- Limits to say plainly:
  o Features are not automatically de-identified: contour plus goal text plus device or IP rate-limit data can single out a learner.
  o An expiring link cannot recall a download or a listen that already happened; a Webex message stays under its org's retention.
  o Deletion on request is a promise we design; the APPs give correction (APP 13), not a general deletion right [2].
  o Tort needs a serious, intentional or reckless invasion and a public-interest balance [9][24].
  o Controls here are proposed, not built.
- Design as if the APPs apply and as if the draft Children's Code applies; it is not law yet and a PIA is the real cost (section 4).

## 2. What the law says (verified; status as of 6 Nov 2026)
| Question | Answer | Src |
|---|---|---|
| Is a voice recording personal information? | Yes when the speaker is reasonably identifiable. OAIC lists "sounds (voice or tape recordings)". Objective test | [1] |
| Is it sensitive? | Not by default. Biometric information is sensitive if "to be used for the purpose of automated biometric verification" (or identification), and biometric templates are sensitive. Pitch feedback is neither; a recording can still reveal health information | [8] |
| "Collects" and "holds" | Collects = for inclusion in a record or publication (B.26). Holds = possession or control, including a right or power to deal with the record, such as data stored by a third party (B.82, B.84) | [8] |
| APPs that bite | 1 policy; 2 anonymity or pseudonym; 3 collect only what is reasonably necessary (organisations); agencies: reasonably necessary or directly related to a function; sensitive information needs consent; 4 unsolicited information; 5 notice; 6 use and disclosure; 8 overseas disclosure; 10 quality; 11 security, destroy or de-identify unless law or a Commonwealth record requires keeping; 12 access (exceptions exist); 13 correction | [2] |
| Small-business exemption | $3m turnover or less is exempt, but not if: health service provider; trading in personal information without consent or legal authority; Commonwealth contractor; related to a larger body corporate; reporting entity; and other listed kinds; opt-in is possible. Operator is not yet identified, so exemption is `unverified` and not a stable basis | [3] |
| University partner covered? | Per institution. Flinders: neither the Privacy Act nor state law binds it, but it upholds the APPs and treats breaches as if bound [20]. UC notices cite the ACT Information Privacy Act and the Privacy Act where required [snippet] [5]; La Trobe `unverified` (page blocked). Assume the APPs as the standard | [5][20] |
| APP 8 and an LLM API | Providing to an overseas recipient is usually a disclosure; where the entity keeps effective control under a binding contract (storage and access only, subcontractors bound) it may be a "use", but the entity still "holds" and can breach (8.14, 8.15). Enforceable contract is "generally expected", plus monitoring (8.16, 8.17). Exceptions: comparable protection (8.20), express consent after being told APP 8 will not apply (8.31), law (8.38), general situations (8.41). Accountability under s 16C (8.60 to 8.63) | [6] |
| LLM provider terms (Anthropic API) | Docs: conversation content "not retained by default", except models that require 30-day retention; retained data not used for training without permission; zero data retention is by agreement. The privacy centre says 30-day deletion (snippet). Residency: inference `us` or `global`; workspace geo `us` only; no Australian option | [21][22][25] |
| Children's Online Privacy Code | Not registered. OAIC must register it by 10 Dec 2026. Exposure draft: binds a social media, relevant electronic or designated internet service "primarily concerned with the activities of children" (not a health service) and applies to services "likely to be accessed by children or primarily concerned" with them (ss 5, 7). Commencement "[to be drafted]". Whether a practice app is inside is `unverified` | [7][17] |
| What the draft would require (if it applies) | Default collection only if strictly necessary (s 9); consent: child only from 15, under 15 the guardian, with reasonable steps to confirm the guardian (s 13); consent voluntary, informed, current, withdrawable, specific (ss 14 to 18); child notice at age 10 to 12 level unless the service targets a range; PIA before launch (s 38) | [17] |
| Statutory tort | In force 10 Jun 2025. Elements: invasion (intrusion or misuse of information), reasonable expectation of privacy, public interest in privacy outweighs the countervailing interest; defence of consent or lawful authority [9]. Intentional or reckless, serious, and no damage needed: law-firm summaries (snippet) [24] | [9][24] |
| Automated decisions | From 10 Dec 2026, entities using personal information in automated decisions with "the potential to affect rights or interests" state it in their privacy policy; scope under consultation. The miss-3 hand-off offer is automated but only offers a human teacher; disclose it in the policy anyway | [18] |
| Tranche two | Exposure draft Privacy Amendment (Personal Data Protection) Bill 2026, submissions closed 18 Sep 2026; not law; small-business exemption outcome `unverified` | [10][11] |

## 3. Consent by age
- Privacy Act guidance: no set age; capacity is case by case; if impracticable, an entity may presume capacity at 15 or over; under 15 is presumed without capacity [8] (B.59 to B.61) and [12].
- Draft Code (not law): a child consents alone only from 15; under 15 needs a guardian, with reasonable steps to confirm who they are (s 13) [17].
| Learner | Sign-up | Cloud coach | Sharing a recording |
|---|---|---|---|
| Under 15 | Guardian sets up with guardian email; no child email; child notice in plain words | Off until the guardian turns it on | Guardian taps each share; child and guardian see what is sent |
| 15 to 17 | Own sign-up with age band if capacity is judged; sixteen does not guarantee capacity | Own choice | Own opt-in per recording; the learner decides, age-appropriately, whether a guardian sees the share log (default: offered, never forced; safeguarding concerns go to the child-safety officer) |
| Adult | Own sign-up or none | Own choice | Own opt-in per recording |
- Ask for an age band, not a date of birth; a band does the job (APP 3 minimisation, our reading).
- Three consents stay separate: privacy consent (APPs), account contract (capacity to contract), research consent (ethics, section 4).
### 3.1 Guardian consent loop (university-run pilot, learners under 18)
- Sensitive and bystander content: a clip or typed goal can reveal health information (a hoarse voice, "my throat hurts") or capture other people's voices; keep clips short, tell the learner, give a delete button, treat unsolicited material under APP 4 [2].
- Honest line: the Children's Online Privacy Code is not yet registered (due 10 Dec 2026, commencement undrafted) [7][17]; this loop copies the draft's shape as a hedge, not as a legal claim.
| Step | Who | What happens | Record kept |
|---|---|---|---|
| 1 Invite | University programme coordinator | Invitation goes through the programme or school; the team never receives the recruitment list | Programme's own enrolment record |
| 2 Inform | Coordinator | One-page notice for the guardian and a plain-words notice for the child, written at about age 10 to 12 level [17] (s "age appropriate") | Notice version number |
| 3 Verify | Coordinator | Guardian is confirmed from the programme enrolment form or a school contact, not an ID upload (proportionate "reasonable steps", s 13(2)(b)) [17] | Who confirmed, date |
| 4 Consent in three switches | Guardian (under 15) or learner (15 to 17, if capable) | Switch A local practice (no data to us); B cloud coach tips (features plus typed goal, overseas); C each clip share, per recording. Unbundled; B and C can be refused with A still working | Consent record: scope, notice version, date, who |
| 5 Tell the child | App | After guardian consent the child sees a notice: what, why, how long, what refusing costs, how to withdraw, who receives it (s 13(3)) [17] | Notice version |
| 6 Each share | Guardian taps (under 15); learner taps (15 to 17) | Card shows the clip, goal, fixes tried and the teacher type; 7-day link | Share log: case ID, what, who opened, when, reply, deletion |
| 7 Withdraw | Guardian or learner | Button in the app; cloud coach stops; cloud copies deleted within 7 days (proposed); log shows deletion | Withdrawal date, deletion confirmed by supervisor |
| 8 Dispute or change | Coordinator | Disputed guardianship: sharing stops until the coordinator resolves it. At 15 the learner is asked to confirm or take over their own consent | Note of decision |
| 9 Refusal costs nothing | Programme | Declining B or C never removes local practice or the outreach place | Programme rule |
| 10 Close | Coordinator, team | At week 12 delete cloud copies, reconcile logs, confirm to guardians | Deletion evidence |
- Not claimed: that a guardian may see a child's data as of right (Privacy Act guidance is silent on access [8]); for 15 to 17 the guardian sees the log only if the learner agrees, except through the child-safety route; under 15 the guardian sees it by design.

## 4. University and ethics expectations
- Software pilots pass central IT and privacy review, not the convenor alone; La Trobe adds an AI risk assessment (universities-brief.md, snippet).
- PIA: OAIC's PIA guide is the template [13]. The Agencies Code mandates a PIA for projects of "high privacy risk" and binds Commonwealth agencies only [14]; it does not bind UC, Flinders or La Trobe on its own terms. The draft Children's Code s 38 would require a PIA before a new service likely to be accessed by children launches, covering flows, strict necessity, best interests and harm [17].
  o Our trigger: children's data, an overseas LLM, cloud storage, a share to a third party. Run a PIA before any minors pilot, whoever is bound.
- Necessity (Q5): local mode needs no data to us; only the cloud tip and the hand-off need data; a child can refuse both.
- Ethics for the nine-adult test: written determination before recruiting; our design trips three NHMRC review triggers (control groups, cohort comparison, prototype) [T5].
  o National Statement 2025 chapter 4.3: child = under 18; assent only alongside consent; researchers state whether they obtain assent plus guardian consent or consent from the young person only [23].
  o Adults and teammates do not bypass ethics review; fallback is a teammates-only rehearsal, or drop groups B and C [T5].
  o Lead times in universities-brief.md: UC about 2 weeks, Flinders 2 months, La Trobe 8 weeks. Minors pathway = the pilot step, not the Wednesday test.
- What "features not audio" buys: smaller APP 8 exposure, smaller breach impact, simpler ethics file. It does not remove APP 8 while features, goal text or IDs link to an identifiable learner [6].

## 5. Design table (retention periods are proposals unless marked)
| Data item | Lives | Retention | Who sees | User control | Default |
|---|---|---|---|---|---|
| Live audio buffer | Device memory | Discarded after analysis | Learner | None needed | On device |
| Recorded take | Device | 30-day auto-delete | Learner | Delete, export | On device, off network |
| Derived features | Device; proxy for the LLM tip | Device: with the take; proxy logs: 14 days, no IP | Learner; proxy; LLM provider | Offline tips | Cloud coach off for under 15 |
| Typed goal and words | Device; proxy; LLM provider | As features | As features | Edit or skip | Optional; names and places stripped |
| Progress history | Device; cloud only with an account | Until deleted, review at 12 months | Learner; guardian under 15 | Delete, export | Device |
| Account (guardian email, age band) | Cloud | Until closure plus 30 days | Operator | Delete, export | None needed for local mode |
| Consent record | Cloud | Pilot length plus the university's records rule `unverified` | Coordinator, supervisor | View | Required before B or C |
| Shared recording | Temporary cloud object | 7 days, then deleted; backups purge within 35 days | Signed-in named teacher, streamed | Cancel, extend | Off; per recording |
| Share log | Cloud | Pilot end plus 90 days, then deleted | Learner, guardian, supervisor | View | On |
| Teacher reply | Teacher, learner | With the case | Teacher, learner, guardian under 15 | Delete | Off |
| Advertising, third-party analytics | None | n/a | n/a | n/a | None |
- No raw logs of IPs: the rate limit [T3] lives in memory; hosting and CDN platform logs are a separate set to switch off or shorten (tech to check).
- Teacher link: bind to a named teacher account; no forwarding; the supervisor owns deletion; downloads blocked by design but a screen recording cannot be prevented.
### 5.1 Data-flow table
| Step | Data item | Where it is | Who can see | Leaves device | Retention | Legal basis or consent | Source |
|---|---|---|---|---|---|---|---|
| Audio capture | Live mic buffer; optional saved take | Phone memory; local store | Learner | No | Buffer: seconds; take: 30 days | Collected only if operator can reach it (C1); learner choice; notice [8] | [8][T4] |
| Features | Per-note pitch error, timing, wobbles, range; about 2 KB per take | Phone; sent for the tip | Learner; proxy; LLM provider | Yes, if cloud coach on | Proxy logs 14 days | Consent B (3.1); APP 3, 5, 6; APP 8 for the overseas provider | [T3][6] |
| The LLM call | Features, rule candidates, typed goal, typed words, last two cues, level; reply JSON | Proxy; Anthropic API (inference `us` or `global`) | Proxy operator; provider staff under its terms | Yes | Provider: not retained by default except 30-day models; ZDR by agreement | APP 8 route is separate from consent B: enforceable contract plus monitoring, or the 8.31 exception only with the specific warning that APP 8 will not apply; no AU region [6][21][22] | [T3][21][22] |
| Hand-off share link | One 10 to 30 s clip, goal, fixes tried, instrument, age band, case ID | Temporary cloud object | Signed-in named teacher; supervisor | Yes, per clip | 7 days; log 90 days after pilot | Per-clip opt-in; guardian under 15 | [T1] |
| Webex message | Text and link only: goal, fix, proof line; no audio, no learner name; goal text can still identify | Webex space of the teacher's org | Every member of the space, not only the named teacher: list them in the share notice or use a 1:1 message | Yes (text) | Webex org's retention `unverified`; Australian residency available, not assured | Covered by the share consent; do not claim erasure | [T2] |
| Offline queue | Hand-off report waiting for network | IndexedDB on the phone | Learner | No until online | Until sent or cancelled | Consent already given | [T4] |
| Crash and analytics | None collected by the team; hosting, proxy and CDN logs exist | Platform logs | Platform, operator | Yes (platform) | Shorten; no IP; tech to confirm | Notice names them | Design |
| Account and consent record | Guardian email, age band, consent scope | Cloud | Operator, coordinator | Yes | Closure plus 30 days; consent rule `unverified` | Contract plus consent | Section 3.1 |
| Stand demo | No personal data; keyboard or on-screen keys; seeded demo | Demo device; paper tally | Stand team | No | Clear local store each visitor block and at day end | No personal data collected; treat any visitor as possibly under 18 | [T6] |
| Nine-adult test | Sung phrase (audio on the phone, deleted in front of the participant), pseudonymous ID (small cohort: may be re-identifiable), pitch numbers, ratings, short comments | Phone; data sheet with no names | Test team | Numbers only to the sheet | Sheet deleted after the pitch | Verbal consent logged; ethics determination first | [T5] |
- The stand loop reset does not prove deletion; do not tell visitors "nothing is stored" until the build is checked [T6].
- Conflict: the Webex mock in [T2] shows "First name or Learner 12" in the card; the hand-off design says no name. v1 rule: no first name.

## 6. On stage
- One honest sentence (23 words): "Audio stays on the device; the cloud coach sees numbers and your typed goal; a teacher hears a clip only if you share."
  o True of the design; true of the demo only if the build matches (check Tuesday).
- Never say:
  o "We are privacy compliant."
  o "Only anonymous numbers leave the phone."
  o "Your data stays in Australia."
- Demo moment: a "stays on your phone" badge on the live pitch screen; airplane mode and the loop keeps working (R12); then tap share and show the expiring link [T4].
- If asked "where does the cloud coach run?": "Overseas: the provider offers no Australian region today; a pilot would decide that in the PIA."
- If asked about minors: "Under 15, a guardian approves each share and sees the log. We design to the draft Children's Code, which is due to be registered by 10 December."
- A judge may ask for the flow: one-line diagram, phone, optional cloud coach, optional teacher link.
- Do not claim "compliant" or "legal"; say "designed to".

## 7. Pilot checklist (university side by role; risk triage, not legal advice)
1. Name the accountable operator: university programme owner or the team's company; "controller" is shorthand, not the APP category.
2. Privacy officer maps each partner's regime: ACT, Privacy Act, Victorian law, SA policy; confirm per institution (UC, La Trobe `unverified`).
3. Agreement between team and sponsor: access, reuse, publication, commercialisation, deletion at week 12.
4. Programme and school agreements and teacher agreements: safeguarding, checks in the learner's state [T1].
5. Contract with the LLM provider and any host: retention, ZDR request, subprocessors, region, incident notice [6][21].
6. PIA before launch, approved by the privacy officer and IT security; written ethics determination from the ethics office [14][17][23].
7. Collection notice and privacy policy: purposes, recipients, overseas countries, rights, complaints, the automated hand-off offer [18].
8. Build capacity, guardian verification, three switches and withdrawal (section 3.1).
9. Test access controls, deletion, backups and incident response before week 1.
10. Mid-pilot review at week 6 and closure at week 12: retention reconciliation, deletion evidence, guardian confirmation.

## Method
- Codex call 1 (critique of v0, gpt-6-astra, names stripped, no web) supplied the leads; every legal point was re-checked on the pages in Sources or marked.
- Pages opened this run: OAIC chapter B, APPs, small-business, APP 8 chapter, ADM consultation, tort, Agencies Code PIA; WA government page; Flinders policy PDF; Children's Code exposure draft PDF and National Statement PDF (downloaded, read with pdftotext); Anthropic API retention and data-residency docs.
- Not verified: La Trobe (403), UC policy, 2024 Act text, tort elements beyond the OAIC page (snippet), 2025 Regulations (dropped).
- Team files read: [T1] to [T8] in Sources.
- Codex call 2 (re-check of v1, gpt-6-sol medium, no names): flagged 12 issues. Folded in: APP 3 agency wording corrected; guardian log made the learner's choice for 15 to 17; APP 8 route separated from consent B; Webex space members named as viewers; nine-adult IDs called pseudonymous; sensitive and bystander content added to 3.1.
  o Still flagged, not fixed here (need the pilot's facts): no named accountable operator; local-audio claim depends on the build; retention promises depend on backups, provider and Webex rules; provider terms are documentation, not an executed contract; ethics pathway needs a written determination; draft Code and ADM scope need a documented analysis.
  o Rejected: none outright; the "three NHMRC triggers" line is from [T5], which cites the NHMRC 2014 guidance, not an ethics ruling.
- 6 to 7 Nov overnight: corrected from consistency-audit-v1.md row 5

## Open questions
- Team: LLM provider terms: request zero data retention, accept `global` or pin `us`; neither is Australian. Decide, then say it in the notice.
- Team and tech: do the proxy and hosting platform keep IP-linked logs; can the rate limiter run in memory?
- Team: strip names and places from the typed goal before the LLM call, or drop `learner_goal` for under 15?
- Team: stage line and Webex card: remove "first name" from the card mock (conflicts with the hand-off design).
- Sponsor: who is the accountable operator in a pilot; which regime governs (ACT, Privacy Act, Victorian, SA policy)?
- Sponsor: is a minors trial research or service evaluation; what is the PIA trigger at UC, Flinders, La Trobe (`unverified`)?
- Verify: UC and La Trobe privacy statements; consent-record retention rule; the registered Children's Code text after 10 Dec 2026 and its commencement.
- Verify: whether Android or browser backups sweep the saved take off the phone.
- Verify: tort elements and the public-authority defence on legislation.gov.au (Schedule 2).

## Sources
1. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/handling-personal-information/what-is-personal-information, 2026-11-06, opened (v0)
2. https://www.oaic.gov.au/privacy/australian-privacy-principles/read-the-australian-privacy-principles, 2026-11-06, opened (re-read for APP 2, 3, 4, 6, 11, 12)
3. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business, 2026-11-06, opened (re-read for exceptions)
4. https://www.mq.edu.au/about/about-the-university/structure-governance/privacy/privacy-act-1988 and https://www.minterellison.com/articles/privacy-reforms-in-australias-higher-education-sector, 2026-11-06, snippet
5. https://www.canberra.edu.au/content/dam/uc/documents/future-students/ssaf/student-collection-notice.pdf, 2026-11-06, snippet
6. https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-8-app-8-cross-border-disclosure-of-personal-information, 2026-11-06, opened (re-read, paras 8.10 to 8.63)
7. https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code and https://www.oaic.gov.au/privacy/privacy-for-kids/official-exposure-draft-of-the-childrens-online-privacy-code, 2026-11-06, opened (v0)
8. https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-b-key-concepts (B.26, B.59 to B.61, B.82, B.84, B.141), 2026-11-06, opened (first 100,000 characters)
9. https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/statutory-tort-for-serious-invasions-of-privacy, 2026-11-06, opened
10. https://consultations.ag.gov.au/rights-and-protections/privacy-reform/, 2026-11-06, opened (v0)
11. https://www.maddocks.com.au/insights/privacy-reform-2026-australias-biggest-privacy-overhaul-in-a-decade and https://www.hsfkramer.com/insights/2026-09/the-draft-tranche-2-privacy-act-reforms-whats-there-whats-new-and-whats-missing, 2026-11-06, snippet
12. https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/children-and-young-people, 2026-11-06, opened (v0)
13. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/privacy-impact-assessments/guide-to-undertaking-privacy-impact-assessments, 2026-11-06, snippet
14. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/government-agencies/australian-government-agencies-privacy-code/when-do-agencies-need-to-conduct-a-privacy-impact-assessment, 2026-11-06, opened
15. https://canberra.edu.au/research/graduate-research/current-research-students/study/research-project-management/integrity-and-ethics/ethics/accordion/human-ethics, 2026-11-06, snippet (404 on fetch)
16. https://www.nhmrc.gov.au/research-policy/ethics/national-statement-ethical-conduct-human-research, 2026-11-06, snippet
17. https://www.oaic.gov.au/__data/assets/pdf_file/0020/262631/Exposure-Draft-Childrens-Online-Privacy-Code.pdf (ss 5, 7, 9, 13 to 18, 38; "age appropriate" definition), 2026-11-06, opened (downloaded, pdftotext)
18. https://www.oaic.gov.au/engage-with-us/consultations/consultation-on-guidance-for-transparency-in-automated-decision-making, 2026-11-06, opened
19. https://www.wa.gov.au/organisation/office-of-the-information-commissioner/personal-information-collected-and-after-1-july-2026, 2026-11-06, opened
20. https://www.flinders.edu.au/content/dam/documents/staff/policies/facilities-info-management/privacy-policy.pdf, 2026-11-06, opened (downloaded, pdftotext)
21. https://platform.claude.com/docs/en/manage-claude/api-and-data-retention, 2026-11-06, opened
22. https://platform.claude.com/docs/en/manage-claude/data-residency, 2026-11-06, opened
23. https://www.nhmrc.gov.au/sites/default/files/documents/attachments/publications/National-Statement-on-Ethical-Conduct-Human-Research-2025.pdf (chapter 4.3), 2026-11-06, opened (downloaded, pdftotext)
24. https://www.minterellison.com/articles/statutory-tort-for-serious-invasions-of-privacy-comes-into-force and https://landers.com.au/legal-insights-news/australia-introduces-landmark-privacy-tort-what-does-it-mean-for-you, 2026-11-06, snippet (elements: intentional or reckless, serious, no proof of damage)
25. https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data (linked from [21]; 30-day wording from search results), 2026-11-06, snippet
- Team files (this folder): [T1] handoff-design-v0.md sections 3 to 6; [T2] cisco-fit-note.md section 4; [T3] tech-feedback-layer.md sections 2, 4, 7, 8; [T4] accessibility-design-v0.md section 5; [T5] nine-student-test-plan.md sections 1, 3; [T6] freeze-and-rehearsal-playbook.md section 6; [T7] business-case-v0.md section 3; [T8] take-data-contract.md did not exist when read.
