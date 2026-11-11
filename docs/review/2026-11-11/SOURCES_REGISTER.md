# Sources and licence register

Review branch `review/master-brief`, 11 Nov 2026. This lists every outside source that shapes what Carmen ships or teaches, what it may be used for, and how it is credited. Files in the app are listed one by one, with hashes, in `ASSETS.md`. This page is the summary and covers the teaching sources too.

"Used" means it is in the app or shaped its wording. "Not used" means it was looked at and left out on purpose.

## In the app

| Source | What Carmen uses | Licence | Attribution / conditions | Where recorded |
|---|---|---|---|---|
| Versilian Community Sample Library (VCSL), Kawai grand piano | 20 piano samples: C3, E3, G3, B3, D4, F4, A4, C5, G5, C6 at two loudness layers, trimmed and converted to MP3 | CC0 1.0 | None required; credited anyway | `ASSETS.md` § Audio, with source paths and SHA-256 |
| VCSL drums and claves | 7 drum samples (kick, snare, hi-hat, crash, two toms, clave) | CC0 1.0 | None required; credited anyway | `ASSETS.md` § Audio |
| VexFlow 5 | Draws the stave and notes | MIT | Licence kept in `node_modules/vexflow` and the build | `package.json` |
| Bravura (ships with VexFlow) | Music glyphs: clefs, notes, ♯ in the note trail | SIL OFL 1.1 | OFL text travels with the font | `package.json` (via VexFlow) |
| Nunito, Bricolage Grotesque, Atkinson Hyperlegible Next, Noto Music subset | Wordmark, headings, reading text, ♯ ♭ ♮ | SIL OFL 1.1 | Self-hosted; no font CDN at run time | `ASSETS.md` § Fonts |
| Lucide | Interface icons | ISC | Licence notice in the package | `ASSETS.md` § Interface icons |
| Carmen music logo | Brand mark, app icons, favicon | Team artwork supplied by the product owner (momo), 11 Nov 2026. Not openly licensed | Not redrawn or traced; only cropped and scaled | `ASSETS.md` § Brand and app icons |

## Curriculum

| Source | What Carmen uses | Licence | Attribution |
|---|---|---|---|
| Australian Curriculum v9.0, The Arts: Music (ACARA) | Content description codes and text, achievement standard openings, strand names | CC BY 4.0 for curriculum content (not logos, trade marks or site design) | "© Australian Curriculum, Assessment and Reporting Authority (ACARA) 2010 to present, unless otherwise indicated." Stored in `src/data/curriculumAlignment.json` |
| QCAA, *Australian Curriculum v9.0 Music: sequence of content descriptions P–6* and *sequence of achievement standards P–6* | Where the code text was checked, because australiancurriculum.edu.au could not be reached from the build environment | CC BY 4.0, © State of Queensland (QCAA) 2022 | URLs stored in `curriculumAlignment.json` → `sources` |

Carmen does not claim ACARA certification or endorsement. The map is the team's own alignment and needs review by a primary music educator.

## Teaching approach (informs wording; no text copied)

These three are the references named in the owner brief. They were not re-read from this environment, so the table says what each one was used for, not that every sentence was checked against it.

| Source | How it was used | Licence | Note |
|---|---|---|---|
| Sarrazin, *Music and the Child* (Open SUNY Textbooks) | Sound before symbol order in the guided lessons: hear, notice, name, then read | CC BY-NC-SA 4.0 | Only ideas used, no text copied, so share-alike does not reach Carmen's wording. Edition and page numbers still need checking before anyone quotes it |
| Open Music Theory, 2nd edition | Standard definitions used in S01 and the theory cards: semitone, sharps and flats, enharmonic names (C♯ = D♭, E♯ = F) | CC BY-SA 4.0 | Carmen's sentences are its own; nothing copied, so share-alike does not apply |
| University of Edinburgh, *Fundamentals of Music Theory* (open course materials) | Order of rhythm ideas in B00: beat, then rhythm, then crotchet, quaver and rest in 4/4 | CC BY-NC-SA 4.0 | Ideas only, no text copied |

### Adaptation record: guided lessons

| Lesson | Wording | Based on |
|---|---|---|
| N01 What is a musical note? | Carmen's own, following the step list in the owner brief, section 5 | Owner brief |
| B00 Feeling the beat and making rhythm | Carmen's own, following the owner brief | Owner brief; order follows Sarrazin and Edinburgh |
| S01 C and C♯: a closer step | Carmen's own, following the owner brief | Owner brief; standard facts as in Open Music Theory |

## Looked at and not used

| Source | Why not |
|---|---|
| Salamander Grand Piano (CC BY 3.0) | Could be a better piano: more sample points and loudness layers. Not added, because it is larger to download and the current VCSL piano has not been judged by ear yet. Ready to try if momo wants it |
| FluidR3 GM SoundFont (MIT) | General MIDI set; sounds less real than VCSL for piano and drums |
| IDMT drum dataset | Excluded by momo. Not used for anything |
| ACARA website pages | Could not be reached from the build environment (proxy block). Codes were checked through the QCAA reproduction instead |

## What still needs a person

- Check AC9AMUFD01 on the ACARA site. The QCAA PDF prints it as "AC9AMUD01" (see `CURRICULUM_ALIGNMENT.md`).
- The list of "elements of music" comes from the owner brief. It has not been checked against an official ACARA list.
- A primary music educator should review the map and the three guided lessons before anyone shares them outside the team.
