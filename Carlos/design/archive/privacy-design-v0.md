# Privacy design v0: an app that listens to a learner practising music

- Date: 6 Nov 2026 (AEDT). Purpose: privacy design for a practice app that listens to a learner, often under 18, in Australia.
- Scope: Privacy Act and APPs, 2024 amendments, under-18 consent, university expectations, design table, stage line.
- Status: overnight draft for the team; verify before the pitch. Risk triage, not legal advice. Source numbers in [brackets] point to `## Sources`.

## 1. Recommendation (conclusion first)
- Raw audio never leaves the phone by default; only numbers (pitch, timing) go to any cloud, with no account ID attached.
  o On-device-only audio that the operator cannot reach is arguably not "collected" at all: APP "collects" means included in a record the entity holds [8]. Inference, confirm with the university privacy officer.
- Sharing a recording with a teacher is a separate opt-in per recording, a link that expires, revocable.
- No account for a child without capacity or a guardian (a 16-year-old with capacity may sign up alone, section 3); no advertising; no third-party analytics.
- Limits to say plainly (Codex critique, kept after check):
  o Numbers are not automatically de-identified: contour plus IP address plus session can single out a learner; send no IP-linked logs, keep sessions unlinkable.
  o An expiring link cannot recall a file already downloaded; the teacher should sign in, and access is logged.
  o Tort needs a serious invasion and a public-interest balance [9]; omitted APPs 10 and 13 (quality, correction) also apply to held data.
  o Controls here are proposed, not built.
- Design as if the APPs and the draft Children's Online Privacy Code both apply: it costs little and survives a judge's question.

## 2. What the law says (verified; status as of 6 Nov 2026)
| Question | Answer | Src |
|---|---|---|
| Is a voice recording personal information? | Yes when the speaker is reasonably identifiable. OAIC lists "sounds (voice or tape recordings)". Test is objective, not name-based | [1] |
| Is it sensitive information? | Not by default. Biometric information is sensitive only if used for automated biometric verification or identification, or as a biometric template. Pitch feedback is neither. A recording may still reveal health information | [8] |
| Which APPs bite | 1 policy; 3 collect only what is needed; 5 collection notice; 6 use and disclosure limited to purpose; 8 overseas disclosure; 11 security and destroy or de-identify when not needed; 12 access on request | [2] |
| Small business exemption | Turnover $3m or less is exempt. No exemption for health service providers, traders in personal information, Commonwealth contractors, or opt-in. A student team would likely be exempt, and an unregistered team is not a stable basis to rely on | [3] |
| University partner covered? | Not automatic. Sector practice is mixed: one law-firm source says only private universities and ANU fall under the Privacy Act, with state or territory law for the rest [snippet] [4]. UC's own notices cite the ACT Information Privacy Act 2014 (Territory Privacy Principles) and the Privacy Act where required [snippet] [5]. Treat the APPs as the standard anyway | [4][5] |
| APP 8 and an LLM API | Giving personal information to an overseas contractor is "in most circumstances" a disclosure; entity stays accountable (s 16C) for the recipient's breaches. Reasonable step: an enforceable contract. Features that are not reasonably identifiable are outside APP 8; features tied to an account are not | [6] |
| Children's Online Privacy Code | Not yet registered. OAIC must register it by 10 Dec 2026. Exposure draft 31 Mar 2026, consultation 31 Mar to 5 Jun 2026. Commencement date not stated. Applies to APP entities providing a social media, relevant electronic or designated internet service under the Online Safety Act 2021, likely to be accessed by children, and not a health service. Whether a practice app falls inside is `unverified` | [7] |
| Statutory tort | In force since 10 Jun 2025. Defendant can be any person or organisation, so it is broader than the Privacy Act. Defences: consent, lawful authority. Applies even if the small business exemption does | [9] |
| Tranche two | Exposure draft Privacy Amendment (Personal Data Protection) Bill 2026 opened 31 Aug 2026, submissions closed 18 Sep 2026; "remains subject to further consideration by government". Not law. Small business exemption fate: commentary conflicts, `unverified` | [10][11] |

## 3. Consent by age (OAIC guidance)
- OAIC: no fixed age; capacity is judged case by case; if that is impractical, assume capacity from age 15 unless unsure; otherwise a parent or guardian may consent [12].
| Learner | Sign-up flow | Sharing a recording |
|---|---|---|
| 10 | Guardian sets up (guardian email, no child email); child-readable "stays on this phone" notice; local-only mode works with no account | Guardian approves each share; child sees what is sent |
| 16 | Own sign-up with age band; plain notice; guardian not required, offered | Own opt-in per recording; teacher link visible to the learner |
| Adult | Own sign-up or none; plain notice | Own opt-in per recording |
- Do not ask date of birth when an age band does the job (APP 3 data minimisation, our reading).
  o Under 15 with no capacity doubt resolved: treat as guardian-consent; the 15 presumption is a fallback, not a rule [12].

## 4. University and ethics expectations
- Software pilots pass central IT and privacy review, not the convenor alone; La Trobe adds an AI risk assessment (universities-brief.md, snippet-level there).
- PIA: OAIC's PIA guide is the template [13]; the Agencies Code that mandates PIAs binds Commonwealth agencies only (ANU, not UC) [snippet] [14]. UC, Flinders and La Trobe PIA triggers: not found, `unverified`; ask the privacy officer.
- Human research ethics for the nine-student test: UC requires HREC approval for research with human participants and follows the National Statement [snippet] [15].
  o 2025 National Statement in effect since 23 Jun 2026; children and young people are chapter 4.3, with assent introduced [snippet] [16]. Usually child plus parent consent; details not opened, `unverified`.
  o Lead times already in universities-brief.md: UC low-risk about 2 weeks, Flinders 2 months, La Trobe 8 weeks. Not enough time before Wednesday: test with adults and teammates only, pitch the minors pathway as the pilot step.
- What "features not audio" buys: smaller APP 8 exposure, smaller breach impact, simpler ethics file. It does not remove APP 8 if features stay linked to an identifiable learner [6].

## 5. Design table
| Data item | Lives | Retention | Who sees | User control | Default |
|---|---|---|---|---|---|
| Raw audio of practice | Device only | Live buffer discarded after analysis; recorded take kept until user deletes (proposed 30-day auto-delete) | Learner | Delete, export | On device, off the network |
| Derived features (pitch contour, timing, one-fix result) | Device; cloud only for the LLM tip | Not stored server side (needs provider contract: `unverified`) | Learner; LLM provider sees numbers with a random session ID | Switch to offline tips | Features only, no account ID |
| Progress history | Device; cloud sync only with an account | Until deleted | Learner (guardian for under 15) | Delete, export | Device |
| Account (guardian email, age band) | Cloud | Until deletion plus a short grace period (team to set) | Operator | Delete, export | None needed for local mode |
| Shared recording for hand-off | Temporary cloud object | Link expires (proposed 7 days), file deleted on expiry | Named teacher via the link | Revoke, extend | Off; per recording opt-in |
| Teacher fix list | Teacher and learner | With the recording | Teacher, learner, guardian if under 15 | Delete | Off |
| Advertising, third-party analytics | None | n/a | n/a | n/a | None |

## 6. On stage
- Slide line: "Your voice stays on your phone. Only what you choose to share leaves it." Accurate only if features go to the cloud on opt-in too; else say "Your voice never leaves your phone unless you share it."
  o Decision for the team: make the cloud tip opt-in, or the line must say "your voice, not numbers".
- Demo moment: a "stays on your phone" badge on the live pitch screen; switch to airplane mode and the loop keeps working (R12), then tap share and show the expiring link.
- A judge will ask for the data flow: show a one-line diagram (phone, optional LLM numbers, optional teacher link).
- If asked about data from minors:
  o "A child's recording never leaves the phone unless a guardian approves one share, and the link expires."
  o "We send numbers, not sound, and we are designing to the draft Children's Online Privacy Code, which is due to be registered by 10 December."
- Do not claim "compliant" or "legal"; say "designed to".

## Method
- Codex call 1: gpt-6-sol medium, knowledge draft of the law (no team context in the prompt). Kept the structure and URLs; rejected as unverified its universities claim (checked: partly right), checked the Code deadline, tort date, tranche-two dates and NHMRC 4.3 on the web (all confirmed).
- Codex call 2: gpt-6-sol high, critique of sections 1 to 6 (names none). Kept: stage-line precision, consent inconsistency, bearer-link limit, features-not-de-identified, tort thresholds. Not verified: its UC ethics coursework path and de-identification link (not opened).
- Calls used about 29 of 90; no unverified Codex claim entered the file unmarked.
- Opened pages: OAIC Code exposure-draft page, Code registry page, children-and-young-people, what-is-personal-information, tort, small-business, APP 8 chapter, key concepts, read-the-APPs; AGD consultation page. Search snippets only: university coverage, UC, NHMRC.

## Open questions
- Team: age band to design for (state-of-play section 7 is open); the 30-day and 7-day defaults are proposals.
- Team: which LLM provider, where hosted, zero-retention terms; until known, APP 8 stays open.
- Sponsor: who is the data controller in a pilot (university, the team, or both); which privacy regime governs (ACT TPPs, APPs, or both).
- Sponsor: ethics timeline and whether a music-practice trial with minors counts as research or as service evaluation.
- Verify: whether a practice app is inside the Children's Code scope; the final registered text after 10 Dec 2026.
- Verify: UC, Flinders, La Trobe PIA triggers (not found online); chapter 4.3 consent wording.

## Sources
1. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/handling-personal-information/what-is-personal-information, 2026-11-06, opened
2. https://www.oaic.gov.au/privacy/australian-privacy-principles/read-the-australian-privacy-principles, 2026-11-06, opened
3. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business, 2026-11-06, opened
4. Macquarie / law-firm summary via search (Macquarie page returned 403): https://www.mq.edu.au/about/about-the-university/structure-governance/privacy/privacy-act-1988 and https://www.minterellison.com/articles/privacy-reforms-in-australias-higher-education-sector, 2026-11-06, snippet
5. https://www.canberra.edu.au/content/dam/uc/documents/future-students/ssaf/student-collection-notice.pdf (PDF unreadable by tool; wording from search result), 2026-11-06, snippet
6. https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-8-app-8-cross-border-disclosure-of-personal-information, 2026-11-06, opened
7. https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code and https://www.oaic.gov.au/privacy/privacy-for-kids/official-exposure-draft-of-the-childrens-online-privacy-code, 2026-11-06, opened
8. https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-b-key-concepts (B.26, B.141), 2026-11-06, opened (first 100,000 characters)
9. https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/statutory-tort-for-serious-invasions-of-privacy, 2026-11-06, opened
10. https://consultations.ag.gov.au/rights-and-protections/privacy-reform/, 2026-11-06, opened
11. https://www.maddocks.com.au/insights/privacy-reform-2026-australias-biggest-privacy-overhaul-in-a-decade and https://www.hsfkramer.com/insights/2026-09/the-draft-tranche-2-privacy-act-reforms-whats-there-whats-new-and-whats-missing, 2026-11-06, snippet
12. https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/children-and-young-people, 2026-11-06, opened
13. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/privacy-impact-assessments/guide-to-undertaking-privacy-impact-assessments, 2026-11-06, snippet (named by Codex, not opened)
14. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/government-agencies/australian-government-agencies-privacy-code/when-do-agencies-need-to-conduct-a-privacy-impact-assessment, 2026-11-06, snippet
15. https://canberra.edu.au/research/graduate-research/current-research-students/study/research-project-management/integrity-and-ethics/ethics/accordion/human-ethics (page 404 on fetch; wording from search result), 2026-11-06, snippet
16. https://nhmrc.gov.au/sites/default/files/documents/attachments/publications/National-Statement-on-Ethical-Conduct-Human-Research-2025.pdf and https://www.nhmrc.gov.au/research-policy/ethics/national-statement-ethical-conduct-human-research, 2026-11-06, snippet
