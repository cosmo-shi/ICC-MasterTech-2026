# Copy audit: before and after

Branch `review/master-brief` against `main` at `a85bbd5`. Part 1 is the music theory register (brief section 7). Part 2 is every learner- or teacher-facing string literal that changed, pulled from the diff by `docs/review/2026-11-11/copy-diff.py`, so nothing is left out by hand. Strings that only moved are not listed.

## Part 1: music theory cards

| Topic | Group before → after | Title before | Title after | Short before | Short after |
|---|---|---|---|---|---|
| `sound-silence` | new → Sound and notes | — | Sound and silence | — | Music is made of sounds and the silences between them. |
| `what-is-a-note` | new → Sound and notes | — | What is a musical note? | — | A note is one of the sounds we use to make music. Hear one. |
| `pulse` | Beat and rhythm → Keeping time | The beat | Steady beat | The steady pulse under the music, like a heartbeat. | Hear a regular musical pulse. Can you tap along? |
| `rhythm` | Beat and rhythm → Keeping time | Rhythm | How rhythm works | The pattern of long and short sounds on top of the beat. | Make patterns with sounds and silences of different lengths. |
| `tempo` | Beat and rhythm → Keeping time | Tempo | Tempo: fast and slow | How fast or slow the beat goes. | Hear how changing the speed changes the music. |
| `metronome` | Beat and rhythm → Keeping time | Metronome | Metronome | A tool that plays a steady beat for you to play along with. | Choose a speed and practise following a steady click. |
| `note-values` | Beat and rhythm → Keeping time | Long and short notes | How long notes last | Each note shape tells you how many beats it lasts. | Some notes last longer than others. Hear a crotchet and a minim in 4/4 time. |
| `quavers` | Beat and rhythm → Keeping time | Two sounds in a beat | Crotchets and quavers | Quavers: two even sounds fit in one beat. | Hear one crotchet and two even quavers sharing a beat in this exercise. |
| `rests` | Beat and rhythm → Keeping time | Rests | Rests: counting the silence | A rest is a silence that still counts beats. | When you see a rest, keep counting without playing. |
| `metre` | Beat and rhythm → Keeping time | Bars and time signatures | Bars and 4/4 time | Beats come in groups called bars. | Bar lines divide written music. In 4/4, each bar contains four crotchet beats. |
| `pitch` | High and low → Discovering notes and pitch | High and low | Pitch: hear high and low | Pitch is how high or low a sound is. | Listen to two notes and notice which sounds higher. |
| `note-names` | High and low → Discovering notes and pitch | Note names | Meet the note names | Notes are named with seven letters: C D E F G A B. | In Western note naming, the letters A to G repeat. Hear C, D and E. |
| `stave` | High and low → Discovering notes and pitch | The stave and clefs | Reading the stave | Five lines that show how high or low to play. | A stave has five lines. A clef helps us identify the written pitches. |
| `sharps-flats` | new → Discovering notes and pitch | — | Sharps, flats and naturals | — | A sharp raises a note by one semitone. A flat lowers it by one. |
| `melody` | High and low → Discovering notes and pitch | Melody | Make a melody | A tune: notes one after another that make sense together. | Listen to notes form a musical idea. Then make a short melody of your own. |
| `dynamics` | How it sounds → Expression and sound | Loud and soft | Dynamics: loud and soft | Dynamics: how loud or soft the music is. | Change how loudly or softly a phrase is played. Hear the difference. |
| `timbre` | How it sounds → Expression and sound | Tone colour | Timbre: the character of a sound | Timbre: what makes a piano sound different from a drum. | Hear how two instruments sound different, even when playing at similar loudness. |
| `form` | Building music → Building music | Form: A and B | Musical form: A and B | How a piece is built from parts. | Hear two contrasting musical ideas, then arrange them into a piece. |

Rows in Part 2 are paired in order within each file. A blank cell means the string was only added or only removed, and the two sides of a row are not always the same sentence. New files (`guided.ts`, `GuidedLesson.tsx`) show only added text.

## Part 2: every changed string literal, by file

| File | Before (removed) | After (added) |
|---|---|---|
| `data/coach.json` | Note {count} was {played}. The music asked for {expected}. | You played {played} for note {count}, but this phrase uses {expected}. |
| `data/curriculum.ts` | Hear a short idea, then make up your own answer. | Feel a steady beat, then make a rhythm with sounds and silences. |
| `data/curriculum.ts` |  | Hear a note, tell which of two notes is higher, and meet C, D and E. |
| `data/curriculum.ts` |  | Hear and play C and C♯, one semitone apart. |
| `data/curriculum.ts` |  | Listen to a short phrase. Create an answer using notes of your own. |
| `data/guided.ts` |  | ; title: string; say: string; first: number; second: number; ask: |
| `data/guided.ts` |  | What is a musical note? |
| `data/guided.ts` |  | Hear a note, tell which of two notes is higher, and meet the note names C, D and E. |
| `data/guided.ts` |  | Let’s listen. |
| `data/guided.ts` |  | A piano key makes a pitched sound. Press Hear a note and watch the key. |
| `data/guided.ts` |  | A note is one of the sounds we use to make music. |
| `data/guided.ts` |  | Each piano key plays a different note. Listen again. |
| `data/guided.ts` |  | In written music, “note” can also mean the sign that tells musicians which pitch to play and how long to hold it. Some sounds, like most drums, don’t have a fixed pitch. |
| `data/guided.ts` |  | Hear the note again |
| `data/guided.ts` |  | Hear two notes. |
| `data/guided.ts` |  | Listen to the first note, then the second note. |
| `data/guided.ts` |  | Now change how long it lasts. |
| `data/guided.ts` |  | Tap the key quickly for a short note. Then hold it down for a long note. |
| `data/guided.ts` |  | How long a note lasts is called its duration. It is not the same as how high it is, or how loud it is. |
| `data/guided.ts` |  | Notes can have names. |
| `data/guided.ts` |  | In this note-naming system, letters help musicians talk about pitches. Here are C, D and E. |
| `data/guided.ts` |  | The letters A B C D E F G repeat higher and lower across the keyboard. The C in the middle of the piano is called middle C, or C4. |
| `data/guided.ts` |  | Find C, then play D and E. |
| `data/guided.ts` |  | The keys you need are lit. Play C, D, E. |
| `data/guided.ts` |  | Show what you noticed. |
| `data/guided.ts` |  | Listen to two notes. Which one sounds higher? |
| `data/guided.ts` |  | You explored your first notes. |
| `data/guided.ts` |  | You listened to and played three notes. Concept completed. |
| `data/guided.ts` |  | Feeling the beat and making rhythm |
| `data/guided.ts` |  | Feel a steady beat, hear a rhythm over it, and make a rhythm with sounds and silences. |
| `data/guided.ts` |  | Hear a steady beat. |
| `data/guided.ts` |  | Listen to four beats. Then tap along. There’s no score for this one. |
| `data/guided.ts` |  | The beat is the steady pulse we follow. |
| `data/guided.ts` |  | Each beat lights up as it sounds. Tap with it. |
| `data/guided.ts` |  | You can make the beat slower or faster. That speed is called the tempo. |
| `data/guided.ts` |  | Hear a rhythm over the beat. |
| `data/guided.ts` |  | In this example, the beat stays steady while the rhythm changes. Listen for the longer sounds, the quicker sounds and the silent beat. |
| `data/guided.ts` |  | Rhythm is the pattern of sounds and silences in time. Try saying “ap-ple” evenly, then “wa-ter-mel-on”. The syllables make different patterns over the same beat. |
| `data/guided.ts` |  | Make a rhythm. |
| `data/guided.ts` |  | Tap each beat to choose a sound or a silence. Use at least one of each, then play it. |
| `data/guided.ts` |  | Now see it written. |
| `data/guided.ts` |  | In this 4/4 exercise, a crotchet lasts one beat. Two even quavers share one beat. A crotchet rest means count a beat without playing. |
| `data/guided.ts` |  | Count “1, 2 and, 3, 4”. Keep counting on beat 3, but leave it silent. |
| `data/guided.ts` |  | Which one has a silent beat? |
| `data/guided.ts` |  | Listen to both rhythms. Choose the one with a rest. |
| `data/guided.ts` |  | ], without: [ |
| `data/guided.ts` |  | You felt the beat and made a rhythm. |
| `data/guided.ts` |  | You tapped a steady beat, made a rhythm with a silence and found the rest by listening. Concept completed. |
| `data/guided.ts` |  | C and C♯: a closer step |
| `data/guided.ts` |  | Hear and play C and C♯, the next note up, a semitone higher. |
| `data/guided.ts` |  | A sharp (♯) raises a note by one semitone. On this keyboard, C♯ is the black key just to the right of C, between C and D. Listen to C and C♯. |
| `data/guided.ts` |  | A semitone is the smallest step on the piano: from one key to the very next key, black or white. A sharp doesn’t always mean a black key: E♯ is played on the white key F. |
| `data/guided.ts` |  | Hear C, then C♯ |
| `data/guided.ts` |  | Play C, then C♯. |
| `data/guided.ts` |  | The two keys are lit. |
| `data/guided.ts` |  | C♯ has another name. |
| `data/guided.ts` |  | The same key can also be called D♭ (D flat), because a flat lowers D by one semitone. Musicians choose the name that fits the music. |
| `data/guided.ts` |  | Which one is higher? |
| `data/guided.ts` |  | Listen to C and C♯. Which one sounds higher? |
| `data/guided.ts` |  | You heard a semitone. |
| `data/guided.ts` |  | You played C and C♯ and heard that C♯ is one semitone higher. Concept completed. |
| `data/lessons.seed.json` | Answer a musical idea | Make a musical reply |
| `data/theory.ts` | Beat and rhythm | Sound and notes |
| `data/theory.ts` | High and low | Sound and silence |
| `data/theory.ts` | How it sounds | Music is made of sounds and the silences between them. |
| `data/theory.ts` | Beat and rhythm | A sound starts, lasts for a while and stops. The silence after it is part of the music too. |
| `data/theory.ts` | The steady pulse under the music, like a heartbeat. | You can make sounds with your voice, your body, objects around you or instruments. Each one sounds different. |
| `data/theory.ts` | Beat and rhythm | Sound, sound, silence, sound |
| `data/theory.ts` | The pattern of long and short sounds on top of the beat. | Sound and notes |
| `data/theory.ts` | The beat stays the same. The rhythm changes: some sounds are long, some are short, and some beats are silent. | What is a musical note? |
| `data/theory.ts` | Say “Ap-ple pie” or “Wa-ter-mel-on” and you are saying a rhythm. | A note is one of the sounds we use to make music. Hear one. |
| `data/theory.ts` | A rhythm over the beat | A piano key makes a pitched sound: a note. Each key plays a different note, some higher and some lower. |
| `data/theory.ts` | Beat and rhythm | In written music, “note” also means the sign that tells musicians which pitch to play and how long to hold it. Some sounds, like most drums, don’t have a fixed pitch. |
| `data/theory.ts` | How fast or slow the beat goes. | Two notes: C, then E |
| `data/theory.ts` | Beat and rhythm | Keeping time |
| `data/theory.ts` | A tool that plays a steady beat for you to play along with. | Hear a regular musical pulse. Can you tap along? |
| `data/theory.ts` | Beat and rhythm | Keeping time |
| `data/theory.ts` | Long and short notes | How rhythm works |
| `data/theory.ts` | Each note shape tells you how many beats it lasts. | Make patterns with sounds and silences of different lengths. |
| `data/theory.ts` | 4 beats (an open note, no stem) | Rhythm is the pattern of sounds and silences in time. Notes can last for different lengths, and rests make space in the pattern. |
| `data/theory.ts` | 2 beats (an open note with a stem) | In this example, the beat stays steady while the rhythm changes. Listen for the longer sounds, quicker sounds and silent beat. |
| `data/theory.ts` | 1 beat (a filled note with a stem) | Try saying “ap-ple” evenly, then “wa-ter-mel-on”. Can you hear how the syllables make different patterns? Now clap along with a steady beat. (These are playful speech patterns, not exact note values.) |
| `data/theory.ts` | half a beat (a filled note with a flag, often joined in pairs) | Hear the rhythm while the beat continues |
| `data/theory.ts` | Beat and rhythm | Keeping time |
| `data/theory.ts` | Two sounds in a beat | Tempo: fast and slow |
| `data/theory.ts` | Quavers: two even sounds fit in one beat. | Hear how changing the speed changes the music. |
| `data/theory.ts` | A quaver lasts half a beat, so two quavers fill one beat. They are often joined by a beam. | Keeping time |
| `data/theory.ts` | Say “ti-ti” for two quavers and “ta” for a crotchet. | Choose a speed and practise following a steady click. |
| `data/theory.ts` | Beat and rhythm | Keeping time |
| `data/theory.ts` | A rest is a silence that still counts beats. | How long notes last |
| `data/theory.ts` | Beat and rhythm | Some notes last longer than others. Hear a crotchet and a minim in 4/4 time. |
| `data/theory.ts` | Bars and time signatures | In 4/4 time, where the beat is a crotchet, the note lengths below are counted in beats. In other time signatures the beat can be a different note, so the counts change. |
| `data/theory.ts` | Beats come in groups called bars. | 4 beats in 4/4 (an open note, no stem) |
| `data/theory.ts` | Music is split into bars by bar lines. The time signature at the start says how many beats are in each bar. | 2 beats in 4/4 (an open note with a stem) |
| `data/theory.ts` | 4/4 means four crotchet beats in a bar. 3/4 means three, like a waltz: STRONG-two-three. | 1 beat in 4/4 (a filled note with a stem) |
| `data/theory.ts` | High and low | half a beat in 4/4 (a filled note with a flag, often joined in pairs) |
| `data/theory.ts` | High and low | Keeping time |
| `data/theory.ts` | Pitch is how high or low a sound is. | Crotchets and quavers |
| `data/theory.ts` | Keys to the right on a keyboard sound higher. Keys to the left sound lower. | Hear one crotchet and two even quavers sharing a beat in this exercise. |
| `data/theory.ts` | A tune can step up, step down, leap or stay the same. | In this 4/4 exercise the beat is a crotchet. A quaver lasts half a beat, so two even quavers share one beat. They are often joined by a beam. |
| `data/theory.ts` | High and low | Count “1, 2, 3 and, 4”: the “and” is the second quaver. Some classes say “ta” for a crotchet and “ti-ti” for two quavers. |
| `data/theory.ts` | Notes are named with seven letters: C D E F G A B. | Keeping time |
| `data/theory.ts` | After B the letters start again at C. Every white key has a letter. | Rests: counting the silence |
| `data/theory.ts` | Find C just to the left of each pair of black keys. Middle C is the C nearest the middle of the keyboard. | When you see a rest, keep counting without playing. |
| `data/theory.ts` | the key just above, often a black key | Keeping time |
| `data/theory.ts` | High and low | Bars and 4/4 time |
| `data/theory.ts` | The stave and clefs | Bar lines divide written music. In 4/4, each bar contains four crotchet beats. |
| `data/theory.ts` | Five lines that show how high or low to play. | Bar lines divide written music into bars. The time signature at the start says how many beats are in each bar, and which note gets one beat. |
| `data/theory.ts` | Notes sit on the lines or in the spaces of the stave. Higher on the stave means a higher sound. | In 4/4, the top 4 means four beats in a bar and the bottom 4 means each beat is a crotchet. In 3/4 there are three crotchet beats, like a waltz: STRONG-two-three. |
| `data/theory.ts` | The treble clef (G clef) is used for higher notes. The bass clef (F clef) is used for lower notes. | Discovering notes and pitch |
| `data/theory.ts` | High and low | Pitch: hear high and low |
| `data/theory.ts` | A tune: notes one after another that make sense together. | Listen to two notes and notice which sounds higher. |
| `data/theory.ts` | How it sounds | Pitch is how high or low a note sounds. It is not the same as loud or soft: a high note can be quiet and a low note can be loud. |
| `data/theory.ts` | Loud and soft | On a keyboard, keys to the right sound higher and keys to the left sound lower. A tune can step up, step down, leap or stay the same. |
| `data/theory.ts` | Dynamics: how loud or soft the music is. | Discovering notes and pitch |
| `data/theory.ts` | Musicians use Italian words for loud and soft. Changing the loudness tells a story. | Meet the note names |
| `data/theory.ts` | How it sounds | In Western note naming, the letters A to G repeat. Hear C, D and E. |
| `data/theory.ts` | Timbre: what makes a piano sound different from a drum. | Names let musicians talk about pitches: “play E” is quicker than “play the third white key”. In Western music the seven letters A B C D E F G name the white keys, then repeat higher and lower. |
| `data/theory.ts` | Form: A and B | Find C just to the left of each pair of black keys. Middle C is the C nearest the middle of the keyboard. Other music traditions name and write pitches in other ways. |
| `data/theory.ts` | How a piece is built from parts. | Discovering notes and pitch |
| `data/theory.ts` | Beat and rhythm | Reading the stave |
| `data/theory.ts` | High and low | A stave has five lines. A clef helps us identify the written pitches. |
| `data/theory.ts` | How it sounds | Notes sit on the lines or in the spaces of the stave. Under the same clef, higher on the stave means a higher sound. |
| `data/theory.ts` |  | The clef tells you which line is which note. The treble clef (G clef) curls around the G line and is used for higher notes. The bass clef (F clef) puts its two dots around the F line and is used for lower notes, so the same line means a different note in each clef. |
| `data/theory.ts` |  | Discovering notes and pitch |
| `data/theory.ts` |  | Sharps, flats and naturals |
| `data/theory.ts` |  | A sharp raises a note by one semitone. A flat lowers it by one. |
| `data/theory.ts` |  | A semitone is the smallest step on the keyboard: from one key to the very next key, black or white. |
| `data/theory.ts` |  | C♯ (C sharp) is the black key just to the right of C. The same key can be called D♭ (D flat). A natural (♮) cancels a sharp or flat. |
| `data/theory.ts` |  | A sharp doesn’t always mean a black key: E♯ is played on the white key F, because there is no black key between E and F. |
| `data/theory.ts` |  | Discovering notes and pitch |
| `data/theory.ts` |  | Make a melody |
| `data/theory.ts` |  | Listen to notes form a musical idea. Then make a short melody of your own. |
| `data/theory.ts` |  | Expression and sound |
| `data/theory.ts` |  | Dynamics: loud and soft |
| `data/theory.ts` |  | Change how loudly or softly a phrase is played. Hear the difference. |
| `data/theory.ts` |  | Dynamics are how loudly or softly music is played. The two examples below are the same notes: only the loudness changes, not the pitch. |
| `data/theory.ts` |  | Musicians use Italian words for loud and soft. Changing the loudness can tell a story. |
| `data/theory.ts` |  | Expression and sound |
| `data/theory.ts` |  | Timbre: the character of a sound |
| `data/theory.ts` |  | Hear how two instruments sound different, even when playing at similar loudness. |
| `data/theory.ts` |  | Musical form: A and B |
| `data/theory.ts` |  | Hear two contrasting musical ideas, then arrange them into a piece. |
| `data/theory.ts` |  | Sound and notes |
| `data/theory.ts` |  | Discovering notes and pitch |
| `data/theory.ts` |  | Keeping time |
| `data/theory.ts` |  | Expression and sound |
| `screens/GuidedLesson.tsx` |  | Two quick sounds |
| `screens/GuidedLesson.tsx` |  | , kind: 'drum', onset, duration, sound: 'snare', velocity: 0.75 } : { id: |
| `screens/GuidedLesson.tsx` |  | , kind: 'note', onset, duration, midi: 60, velocity: 0.7 }; if (b === 'rest') events.push({ id: |
| `screens/GuidedLesson.tsx` |  | } : null); if (n === step.notes.length) finish(); } else { onTry(); setMsg({ tone: 'miss', text: |
| `screens/GuidedLesson.tsx` |  | : k === found ? |
| `screens/GuidedLesson.tsx` |  | }> {k < found && <Icon name="check" size={16} />} {midiToName(m)} </span> ))} </p> {msg && <p className={ |
| `screens/GuidedLesson.tsx` |  | First note |
| `screens/GuidedLesson.tsx` |  | btn btn-big${answer === 'second' ? ' is-picked' : ''} |
| `screens/GuidedLesson.tsx` |  | Second note |
| `screens/GuidedLesson.tsx` |  | Press Hear both notes first. |
| `screens/GuidedLesson.tsx` |  | gl-msg is-${answer === right ? 'good' : 'miss'} |
| `screens/GuidedLesson.tsx` |  | Hide the note names |
| `screens/GuidedLesson.tsx` |  | Can’t hear it? Show the notes on the keys |
| `screens/GuidedLesson.tsx` |  | The keys light up as each note plays. A key further to the right plays a higher note. Seeing this is not the same as hearing it, and that’s fine. |
| `screens/GuidedLesson.tsx` |  | } size={24} /> {player.playing ? |
| `screens/GuidedLesson.tsx` |  | Hear the beat |
| `screens/GuidedLesson.tsx` |  | ${bpm} beats a minute |
| `screens/GuidedLesson.tsx` |  | : now !== null && k < now ? |
| `screens/GuidedLesson.tsx` |  | \|\| e.key === |
| `screens/GuidedLesson.tsx` |  | ${taps} ${taps === 1 ? 'tap' : 'taps'}. |
| `screens/GuidedLesson.tsx` |  | Tap the big button with the beat. |
| `screens/GuidedLesson.tsx` |  | Press Hear the beat, then tap along. |
| `screens/GuidedLesson.tsx` |  | }>; player: Player; inst: |
| `screens/GuidedLesson.tsx` |  | } size={24} /> {player.playing ? |
| `screens/GuidedLesson.tsx` |  | Hear the rhythm while the beat continues |
| `screens/GuidedLesson.tsx` |  | Play the beat too |
| `screens/GuidedLesson.tsx` |  | } size={24} /> {player.playing ? |
| `screens/GuidedLesson.tsx` |  | Play my rhythm |
| `screens/GuidedLesson.tsx` |  | Your rhythm has sounds and a silence. Play it to hear the pattern. |
| `screens/GuidedLesson.tsx` |  | Add at least one sound. |
| `screens/GuidedLesson.tsx` |  | Tap a beat to make it a silent beat. |
| `screens/GuidedLesson.tsx` |  | }>; player: Player; inst: |
| `screens/GuidedLesson.tsx` |  | Rhythm ${rightN === 1 ? 2 : 1} has a sound on every beat. In rhythm ${rightN}, beat ${step.restBeat} is a crotchet rest: keep counting through beat ${step.restBeat}, but don’t play a sound. Listen once more, then try again. |
| `screens/GuidedLesson.tsx` |  | Hear rhythm 1 |
| `screens/GuidedLesson.tsx` |  | Hear rhythm 2 |
| `screens/GuidedLesson.tsx` |  | The beat clicks under both rhythms. Count 1, 2, 3, 4. |
| `screens/GuidedLesson.tsx` |  | Which rhythm has a silent beat? |
| `screens/GuidedLesson.tsx` |  | btn btn-big${answer === 1 ? ' is-picked' : ''} |
| `screens/GuidedLesson.tsx` |  | Rhythm 1 |
| `screens/GuidedLesson.tsx` |  | btn btn-big${answer === 2 ? ' is-picked' : ''} |
| `screens/GuidedLesson.tsx` |  | Rhythm 2 |
| `screens/GuidedLesson.tsx` |  | Hear both rhythms first. |
| `screens/GuidedLesson.tsx` |  | Try a fresh pair |
| `screens/TheoryScreen.tsx` | Beat and rhythm | Sound and notes |
| `screens/TheoryScreen.tsx` | High and low | Discovering notes and pitch |
| `screens/TheoryScreen.tsx` | How it sounds | Keeping time |
| `screens/TheoryScreen.tsx` | Beat and rhythm | Expression and sound |
| `screens/TheoryScreen.tsx` | How music moves in time: the beat, note lengths, rests and bars. | Sound and notes |
| `screens/TheoryScreen.tsx` | High and low | Start here: what sound, silence and a musical note are. |
| `screens/TheoryScreen.tsx` | Where notes sit: pitch, the stave, clefs, sharps and flats. | Discovering notes and pitch |
| `screens/TheoryScreen.tsx` | How it sounds | Start by hearing how notes can sound higher or lower. Later, learn how musicians name and write them. |
| `screens/TheoryScreen.tsx` | Loud and soft, fast and slow, smooth and short. | Keeping time |
| `screens/TheoryScreen.tsx` | How ideas join up: patterns, phrases, call and response, form. | Feel the beat first, then rhythm, note lengths, rests and bars. |
| `screens/TheoryScreen.tsx` | The words musicians use, each with real notation you can hear. | Expression and sound |
| `screens/TheoryScreen.tsx` | Play with it | Loud and soft, and the character of different instruments. |
| `screens/TheoryScreen.tsx` |  | How ideas join up: melody, phrases, call and response, form. |
| `screens/TheoryScreen.tsx` |  | ${t.title} ${t.short} ${t.body.join(' ')} ${(t.facts ?? []).flat().join(' ')} |
| `screens/TheoryScreen.tsx` |  | Look up a music word. Each one has notation you can hear and links to the lesson that teaches it. For a course in order, use Lessons. |
| `screens/TheoryScreen.tsx` |  | Play it yourself |
| `screens/learn/Library.tsx` | Practise again | Explore sounds |
| `screens/learn/Library.tsx` | Try the rhythm | Hear the example |
| `screens/learn/Library.tsx` | && i.a.kind === | Tap the beat |
| `screens/learn/Library.tsx` | ? ` · ${i.stars} of 3` : | Tap the beat |
| `screens/learn/Library.tsx` | Lesson details | Practise counted rests |
| `screens/learn/Library.tsx` | Your next lesson | Practise crotchets and quavers |
| `screens/learn/Library.tsx` | }> <div className="lxa-unit-head"> <span className="lxa-num" aria-hidden="true"> {two(ui)} </span> <div> <h2 id={ | Practise minims and crotchets |
| `screens/learn/Library.tsx` | Write and play your own music. | Hear high and low |
| `screens/learn/Library.tsx` |  | Hear C and C♯ |
| `screens/learn/Library.tsx` |  | Read the notes |
| `screens/learn/Library.tsx` |  | Read the melody |
| `screens/learn/Library.tsx` |  | Read the notes |
| `screens/learn/Library.tsx` |  | \|\| a.input === |
| `screens/learn/Library.tsx` |  | \|\| i.a.input === |
| `screens/learn/Library.tsx` |  | What you’ll learn |
| `screens/learn/Library.tsx` |  | }> <div className="lxa-unit-head"> <span className="lxa-num" aria-hidden="true"> {two(ui)} </span> <div className="lxa-unit-words"> <p className="lx-kicker">Unit {ui + 1}</p> <h2 id={ |
| `screens/learn/Library.tsx` |  | } className="lx-display lxa-unit-title"> {u.title} </h2> <p className="lx-about">{u.about}</p> <div className="lxa-unit-progress"> <span className="lxa-bar" role="progressbar" aria-label={ |
| `screens/learn/Library.tsx` |  | } aria-valuemin={0} aria-valuemax={u.items.length} aria-valuenow={done}> <span style={{ width: |
| `screens/learn/Library.tsx` |  | Listen to an idea, then create a musical reply. |
| `screens/learn/Library.tsx` |  | Your music projects: experiment, save and improve your ideas. These projects aren’t scored. |
| `ui/Workspace.tsx` |  | Letters in boxes are computer keys, not note names. |

## Part 3: changed strings the extractor cannot see (short, built from parts, or in labels)

| Where | Before | After |
|---|---|---|
| `teach/music.ts` wrong-note line | Note 3 was E. You played G. | You played G for note 3, but this phrase uses E. |
| `teach/music.ts` wrong-note title | The note was E | Note 3 is E |
| `screens/TeacherDashboard.tsx` empty state | No players on this device yet. | No learners on this device yet. |
| `screens/TeacherDashboard.tsx` picker label | Choose a player | Choose a learner |
| `screens/TeacherDashboard.tsx` | Manage player | Manage learner |
| `screens/TeacherDashboard.tsx` | Remove player | Remove learner |
| `screens/learn/Library.tsx` item button | By input type: Try the rhythm, Find the notes, Start playing, Start composing; then Continue, Practise again | The first action for that lesson: Explore sounds, Hear the example, Tap the beat, Practise counted rests, Practise crotchets and quavers, Practise minims and crotchets, Hear high and low, Find the notes, Hear C and C♯, Start playing, Read the notes, Read the melody. Then Continue, then Review. Projects: Start composing. |
| `screens/learn/Library.tsx` details link | Lesson details | What you’ll learn |
| `screens/learn/Library.tsx` progress | (none) | Unit N · x of y explored · Up next |
| `screens/TheoryScreen.tsx` card action | (none) | Read and listen |
| `screens/TheoryScreen.tsx` topic button | Play with it | Play it yourself |
| `screens/TheoryScreen.tsx` | (none) | Helps to know first · Lesson: {title} · Next word |
| `ui/Workspace.tsx` | (none) | Letters in boxes are computer keys, not note names. |
| `App.tsx` header | Stop all sound (icon-only square button) | removed; sound still stops on every screen change |
| `data/lessons.seed.json` L09 title | Answer a musical idea | Make a musical reply |

Teacher headings (Review recommended, Suggested practice groups, Skill progress, practice attempts, compositions, No practice recorded yet.) were already in this wording on `main` before this brief, so they are not listed.
