# Carmen curriculum coverage matrix

Generated from `src/data/curriculum.ts`, the lesson files and `src/data/pathways.plan.json` by
`src/data/matrix.test.ts`. Do not edit by hand; change the content and regenerate
(`UPDATE_MATRIX=1 npx vitest run src/data/matrix.test.ts`).

## What the status words mean

- **Draft**: written for the prototype. Not checked by a primary music educator. Not for claims.
- **Reviewed**: a named primary music educator has checked the musical content, the sequence and
  the wording, and their name and date are recorded in the lesson's `reviewStatus`.
- **Validated**: reviewed, and used with learners in a pilot with results recorded (docs/PILOT.md).

Today: **21 draft, 0 reviewed, 0 validated** of 21 activities.
Nothing here is certified, endorsed or aligned by a curriculum authority. The curriculum codes are
for orientation: they show which content descriptions an activity was written towards, not that it
meets them. The pathway plan itself records `humanEducatorApproved: false`.

## Activities

Level is musical demand (1 to 4), never an age. Reading and input demand are separate facts.

| Id | Activity | Track | Learners will | Level | Reading | Input | What Carmen checks | Evidence it produces | Suggested starting bands | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| L00 | Sound and silence | Rhythm basics | Explore how sounds start, stop and change. | 1 | none | tap | Described, not marked | Exploration; nothing is marked | F | Draft |
| L01 | Steady beat | Rhythm basics | Play along with a regular pulse. | 1 | symbols | tap | timing against the beat | Practice, then a different pattern on their own with hints hidden | F, 1–2 | Draft |
| L02 | Crotchet rests | Rhythm basics | Keep counting through a one-beat rest. | 1 | symbols | tap | timing against the beat, silence in rests | Practice, then a different pattern on their own with hints hidden | 1–2 | Draft |
| L03 | Crotchets and quavers | Rhythm basics | Play one crotchet or two even quavers per beat. | 2 | symbols | tap | timing against the beat | Practice, then a different pattern on their own with hints hidden | 1–2 | Draft |
| F_SOUND_STORY | Dynamics: a sound story | Rhythm basics | Use loud and soft sounds to tell a story. | 1 | none | make | Completion and the learner’s own choices; not marked | A fresh intentional sound choice or accessible response; adult observation if not captured. | F | Draft |
| L04 | Pitch: high and low | Piano | Listen and play notes that rise and fall. | 1 | none | keys | which sound or note | Practice, then a different pattern on their own with hints hidden | F, 3–4 | Draft |
| L05 | Keyboard notes: C, D and E | Piano | Find the three keys and play a short pattern. | 1 | none | keys | which sound or note | Practice, then a different pattern on their own with hints hidden | 3–4 | Draft |
| L06 | Treble clef: C, D and E | Piano | Read the notes on the stave and play the matching keys. | 2 | stave | keys | which sound or note | Practice, then a different pattern on their own with hints hidden | 3–4, 7+ | Draft |
| P01 | Piano patterns: C to G | Piano | Play five notes up and down the keyboard. | 2 | stave | keys | which sound or note | Practice, then a different pattern on their own with hints hidden | none | Draft |
| L07 | Minims and crotchets | Piano | Play one-beat and two-beat notes in 4/4 time. | 2 | stave | hold | which sound or note, timing against the beat, note length | Practice, then a different pattern on their own with hints hidden | 5–6 | Draft |
| P34_MELODIC_REPLY | Melodic call and response | Piano | Create a melody and compare a higher or lower reply. | 2 | stave | make | Completion and the learner’s own choices; not marked | A new comparison or controlled musical response without teaching hints; representation/input support retained. | 3–4 | Draft |
| L08 | Reading notes and rests | Piano | Read and play a two-bar melody with rests. | 3 | stave | hold | which sound or note, timing against the beat, note length, silence in rests | Practice, then a different pattern on their own with hints hidden | 5–6, 7+ | Draft |
| P02 | Melodic steps and skips | Piano | Compare notes that move by step with notes that skip. | 3 | stave | keys | which sound or note | Practice, then a different pattern on their own with hints hidden | none | Draft |
| P03 | Reading the bass clef | Piano | Read and play a short melody using the lower notes. | 4 | stave | keys | which sound or note | Practice, then a different pattern on their own with hints hidden | none | Draft |
| D01 | Rock beat: bass drum and snare | Drums | Play bass drum on beats 1 and 3, and snare on 2 and 4. | 2 | symbols | tap | timing against the beat | Practice, then a different pattern on their own with hints hidden | none | Draft |
| P12_RHYTHMIC_CONVERSATION | Rhythm call and response | Drums | Listen to a rhythm and create your answer. | 2 | symbols | make | Completion and the learner’s own choices; not marked | Listening discrimination and actual played timing recorded separately; do not credit construction as live performance. | 1–2 | Draft |
| D02 | Quaver hi-hat patterns | Drums | Play steady quavers on the hi-hat with snare on beats 2 and 4. | 3 | symbols | tap | timing against the beat | Practice, then a different pattern on their own with hints hidden | none | Draft |
| D03 | Introduction to drum fills | Drums | Play a short tom pattern ending on the crash cymbal. | 4 | symbols | tap | timing against the beat | Practice, then a different pattern on their own with hints hidden | none | Draft |
| L09 | Compose a musical response | Create | Create a short phrase in response to a musical idea. | 2 | none | make | Described, not marked | Exploration; nothing is marked | 5–6, 7+ | Draft |
| P56_FORM_AND_TEXTURE | Musical form: A and B | Create | Create two contrasting sections and arrange them into a piece. | 3 | symbols | make | Completion and the learner’s own choices; not marked | A fresh structural choice and explanation with authorship/support visible. | 5–6 | Draft |
| OLDER_EXTENSION | Arranging a second part | Create | Add another musical part and decide how it changes the piece. | 4 | stave | make | Completion and the learner’s own choices; not marked | An independently justified decision; analytical depth can increase without raising motor demands. | 7+ | Draft |

## Bands and the content descriptions they were written towards

Australian Curriculum: The Arts (Music), Version 9.0. A band's pathway is a suggested starting
point a learner or teacher picks; it is never stored as an age.

| Band | Content descriptions (orientation only) | Focus | Activities suggested | Status |
|---|---|---|---|---|
| Foundation | AC9AMUFE01, AC9AMUFD01, AC9AMUFC01, AC9AMUFP01 | sound and silence; contrast; intentional musical play; sharing | L00, L01, L04, F_SOUND_STORY | Draft |
| Years 1-2 | AC9AMU2E01, AC9AMU2E02, AC9AMU2D01, AC9AMU2C01, AC9AMU2P01 | beat and rhythm; short patterns; combining elements; informal performance | L01, L02, L03, P12_RHYTHMIC_CONVERSATION | Draft |
| Years 3-4 | AC9AMU4E01, AC9AMU4E02, AC9AMU4D01, AC9AMU4C01, AC9AMU4P01 | motif and contrast; musical purpose; rehearsal; learner-authored work | L04, L05, L06, P34_MELODIC_REPLY | Draft |
| Years 5-6 | AC9AMU6E01, AC9AMU6E02, AC9AMU6D01, AC9AMU6C01, AC9AMU6P01 | expressive decisions; compositional devices; documentation; refinement | L07, L08, L09, P56_FORM_AND_TEXTURE | Draft |
| Older (extension) | not mapped | arranging with a partner part | L06, L08, L09, OLDER_EXTENSION | Draft |

## Known gaps (from the pathway plan)

- Complete reviewed sequential content across all domains and bands
- Authorised First Nations content and context for E02 descriptions
- Appropriate vocal/physical/group performance experiences
- Jurisdiction-specific secondary/senior mappings
- Pilot evidence for all bands and relevant access needs
- Singing, movement and group performance are outside what the app can hear or check.
- Guitar and wind instruments are not offered.

## What needs a primary music educator before any status changes

1. The order of activities in each track, and the prerequisites between them.
2. Every learner-facing instruction, hint and feedback sentence (accuracy and age-appropriate wording).
3. The on-time window and note-length tolerance used when Carmen checks timing (8 lessons check timing).
4. Whether each "on your own" pattern is a fair test of the same idea as its practice pattern.
5. The teacher moves suggested in the Teacher area, and the wording of the status board.
6. The curriculum-code orientation above, band by band.
7. The 5 projects: what counts as evidence, and what must not be inferred.
8. Any First Nations content or context: none is included, and none should be added without authorised sources.
