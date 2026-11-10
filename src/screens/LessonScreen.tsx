import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { audio } from "../audio/engine.ts";
import { type CoachDecision, decide } from "../ai/coach.ts";
import { lessonById, pathwayById } from "../data/catalog.ts";
import { Icon } from "../ui/icons.tsx";
import { checkAttempt, type CheckResult } from "../engine/checker.ts";
import { Recorder } from "../music/capture.ts";
import {
  type DrumSound,
  type Phrase,
  soundingEvents,
  TPQ,
} from "../music/events.ts";
import { usePrefs } from "../state/prefs.tsx";
import { type AttemptRecord, newId, stamp, store } from "../store/db.ts";
import { BeatDots, FactList, factMark } from "../ui/common.tsx";
import { FeedbackSheet } from "../ui/FeedbackSheet.tsx";
import { attemptFeedback, unclearAttempt } from "../teach/attempt.ts";
import { MoreDetail } from "../ui/MoreDetail.tsx";
import { Notation, describePhrase } from "../ui/Notation.tsx";
import { usePlayer } from "../ui/usePlayer.ts";
import { type LiveEvent, Workspace } from "../ui/Workspace.tsx";
import { FreeLesson } from "./FreeLesson.tsx";
import { inputsToPhrase } from "../ai/coach.ts";
import { coachFocus, LESSON_INFOS, skillsForActivity, supportFor } from "../ai/learner.ts";
import { CHECK_CARDS, TRICKY, type CheckKind, type SupportId, checkInOffer, rulesCheckInOffer } from "../ai/checkin.ts";
import { CheckPanel, CheckResult as CheckResultCard } from "../ui/CheckPanel.tsx";
import { freshRelated, restSpans } from "../music/versions.ts";
import { activityById, instrumentFor, lessonFor } from "../data/curriculum.ts";
import { useMyLearning } from "../ui/useAttempts.ts";
import type { InstrumentId } from "../music/events.ts";
import { LessonSummary } from "./LessonSummary.tsx";
import { MakeStep } from "./MakeStep.tsx";
import { LessonShell } from "./LessonShell.tsx";
import { topicById } from "../data/theory.ts";
import type { CapturedInput } from "../engine/checker.ts";
import { listening } from "../input/session.ts";
import { rhythmClarity } from "../listen/compare.ts";


type Phase = "ready" | "countin" | "playing" | "review";
type Mode = "practice" | "independent";

interface Props {
  lessonId: string;
  go: (route: string) => void;
  /** 'summary' opens the end-of-lesson summary (for example after "Make it yours"). */
  view?: string;
}

export function LessonScreen({ lessonId, go, view }: Props) {
  const lesson = lessonById(lessonId);
  if (!lesson)
    return (
      <div className="panel" role="alert">
        <p>That activity was not found. It may have been renamed.</p>
        <button type="button" className="btn" onClick={() => go("#/learn")}>
          See all activities
        </button>
      </div>
    );
  if (view === "make") return <MakeStep key={lessonId} lessonId={lessonId} go={go} />;
  if (view === "summary")
    return <LessonSummary key={lessonId} lessonId={lessonId} go={go} />;
  if (
    lesson.assessment.mode === "free-exploration" ||
    lesson.assessment.mode === "creative-completion"
  )
    return <FreeLesson lesson={lesson} go={go} />;
  return <AssessedLesson key={lessonId} lessonId={lessonId} go={go} />;
}

function AssessedLesson({ lessonId, go }: Props) {
  const base = lessonById(lessonId)!;
  const { prefs, set: setPref } = usePrefs();
  const act = activityById(lessonId);
  // Shared ideas (Rhythm basics) are practised on the instrument the learner picks; the
  // exercise, controls and score all change with it.
  const [inst, setInst] = useState<InstrumentId>(() => instrumentFor(lessonId, base.practice?.instrument ?? prefs.instrument));
  const lesson = useMemo(() => lessonFor(base, inst), [base, inst]);
  // Bayesian learner model: how much support to offer at the start, and which fact to talk about first.
  const { planning, context } = useMyLearning();
  const tctx = context({ currentLessonId: lessonId });
  const support = supportFor(planning, lessonId, tctx);
  const focusHint = coachFocus(planning, lessonId, tctx);
  const pathway = pathwayById(prefs.pathway);
  const [mode, setMode] = useState<Mode>("practice");
  const [stage, setStage] = useState<"hear" | "learn" | "try">("hear");
  const [phase, setPhase] = useState<Phase>("ready");
  const [slowerChoice, setSlowerChoice] = useState<boolean | null>(null);
  // Starts slower when the model suggests it; the learner can always switch it off.
  const slower = mode === "practice" && (slowerChoice ?? support.start.includes("slower"));
  const setSlower = (f: (s: boolean) => boolean) => setSlowerChoice(f(slower));
  const [demoOn, setDemoOn] = useState(false);
  const [demoWatched, setDemoWatched] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [heardExample, setHeardExample] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [decision, setDecision] = useState<CoachDecision | null>(null);
  // The feedback sheet can be closed and opened again; the attempt stays until the next one starts.
  const [sheetOpen, setSheetOpen] = useState(false);
  // What a support choice just changed, said once on the try screen.
  const [applied, setApplied] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "failed"
  >("idle");
  const [showNotation, setShowNotation] = useState(
    pathway ? pathway.showNotationByDefault || lesson.showStave : true,
  );
  const [liveCount, setLiveCount] = useState(0);
  const [takeInputs, setTakeInputs] = useState<CapturedInput[]>([]);
  const [tries, setTries] = useState(0);
  // "What's getting in the way?" checks, and the supports the learner chose.
  const [missesInARow, setMissesInARow] = useState(0);
  const [checking, setChecking] = useState<CheckKind | null>(null);
  const [checkAnswer, setCheckAnswer] = useState<boolean | null>(null);
  const [checksDone, setChecksDone] = useState<CheckKind[]>([]);
  const [checkDeclined, setCheckDeclined] = useState(false);
  const [playCheck, setPlayCheck] = useState(false);
  const [autoHear, setAutoHear] = useState(false);
  const [counting, setCounting] = useState(false);
  const [fresh, setFresh] = useState<Phrase | null>(null);
  const [lastTake, setLastTake] = useState<Phrase | null>(null);
  const checkId = useRef("");
  const largeBefore = useRef<boolean | null>(null);
  const recorder = useRef<Recorder | null>(null);
  // Beat 1 of the current take, and whether the device's clock looked wrong when it was set.
  const beat0Ref = useRef(0);
  const clockFault = useRef(false);
  // A take Carmen couldn't judge fairly (microphone unclear, device clock wrong): said plainly, never graded.
  const [unclear, setUnclear] = useState<ReturnType<typeof unclearAttempt> | null>(null);
  // The microphone is for this lesson only.
  useEffect(() => () => listening.stopMic(), []);
  const attemptId = useRef<string>("");
  const player = usePlayer();
  const listen = usePlayer();

  const target: Phrase = (
    mode === "practice" ? (fresh ?? lesson.practice) : lesson.independent
  )!;
  const tempo = Math.round(lesson.tempoBpm * (playCheck ? 0.75 : slower ? 0.8 : 1));
  const info = LESSON_INFOS.find((l) => l.id === lessonId);
  // The learner model offers checks from evidence; with the model off, the rules baseline does.
  const offer = prefs.aiEnabled ? checkInOffer(planning, info, true) : rulesCheckInOffer(missesInARow, info);
  const checkSkill = offer?.skill ?? info?.skills[0] ?? "pulse";

  function recordCheck(kind: CheckKind, right: boolean) {
    const id = newId("chk");
    checkId.current = id;
    setChecksDone((d) => (d.includes(kind) ? d : [...d, kind]));
    void store.put("attempts", {
      id,
      createdAt: stamp(),
      activityId: lessonId,
      activityVersion: base.version,
      kind: "check",
      instrument: inst,
      tempoBpm: tempo,
      support: { hintLevel: 0, heardExample: false, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower: false },
      inputs: [],
      passed: false,
      probe: { skill: checkSkill, check: kind, right, offeredBy: offer?.by ?? "rules" },
    } satisfies AttemptRecord);
  }
  const noteSupport = (support: SupportId, taken: boolean) =>
    store.all<AttemptRecord>("attempts").then((rows) => {
      const r = rows.find((x) => x.id === checkId.current);
      if (r?.probe) void store.put("attempts", { ...r, probe: { ...r.probe, support, supportTaken: taken } });
    });
  const restoreControls = () => {
    if (largeBefore.current !== null) setPref("large", largeBefore.current);
    largeBefore.current = null;
  };
  const openCheck = (k: CheckKind) => {
    listen.stop();
    setResult(null);
    setDecision(null);
    setCheckAnswer(null);
    setPhase("ready");
    if (k === "play") {
      // Same music, easier controls: bigger keys or pads and a slower beat.
      if (largeBefore.current === null) largeBefore.current = prefs.large;
      setPref("large", true);
      setChecking(null);
      setPlayCheck(true);
    } else setChecking(k);
  };
  const closeCheck = (support?: SupportId) => {
    if (support) {
      if (support === "hear-first") setAutoHear(true);
      if (support === "count-aloud") setCounting(true);
      if (support === "slower") setSlowerChoice(true);
      if (support === "bigger-controls") largeBefore.current = null; // keep the bigger controls
      // Then a fresh pattern with the same idea, so the support is tried on something new.
      if (lesson.practice) setFresh(freshRelated(lesson.practice, tries + checksDone.length));
    }
    restoreControls();
    setChecking(null);
    setCheckAnswer(null);
    setCheckDeclined(true);
    setPhase("ready");
  };
  const timed = lesson.assessment.checkTiming;
  const expected = soundingEvents(target);
  const totalBeats = target.totalTicks / TPQ;

  // Hint level 2+ in practice shows the target keys/pads. Never in an independent check.
  // A demonstration lights each key or drum as it sounds.
  const showTargets = mode === "practice" && hintLevel >= 2;
  const demoTick = demoOn ? listen.tick : null;
  const lit =
    demoTick != null
      ? expected.filter((e) => e.onset <= demoTick && demoTick < e.onset + Math.max(120, e.duration * 0.8))
      : showTargets
        ? expected
        : [];
  const highlightNotes = new Set(lit.filter((e) => e.kind === "note").map((e) => (e as { midi: number }).midi));
  const highlightPads = new Set<DrumSound>(lit.filter((e) => e.kind === "drum").map((e) => (e as { sound: DrumSound }).sound));

  const finish = useCallback(() => {
    const rec = recorder.current;
    if (!rec) return;
    recorder.current = null;
    rec.closeAll((totalBeats + 1) * (60000 / tempo));
    const micTake = listening.mode === "mic" && target.instrument === "drums" && timed;
    let unclearWhy: Parameters<typeof unclearAttempt>[0] | null = clockFault.current ? "device" : null;
    if (!unclearWhy && micTake) {
      const beatMs = 60000 / tempo;
      const heard = listening.heardSince(beat0Ref.current - beatMs / 2).filter((h) => h.kind === "onset" && h.tPerf <= beat0Ref.current + (totalBeats + 0.75) * beatMs);
      const clear = rhythmClarity(heard.map((h) => ({ kind: "onset" as const, time: h.time, strength: 0, confidence: h.kind === "onset" ? h.confidence : 0 })), expected.length, listening.latency !== null);
      if (!clear.clear) unclearWhy = clear.reason ?? "too-few";
    }
    if (unclearWhy && !playCheck) {
      // Kept for the record (the teacher can see it), with no weight as evidence.
      const id = newId("att");
      attemptId.current = id;
      void store.put("attempts", {
        id,
        createdAt: stamp(),
        activityId: lesson.id,
        activityVersion: lesson.version,
        kind: mode,
        instrument: target.instrument,
        tempoBpm: tempo,
        support: { hintLevel: mode === "independent" ? 0 : hintLevel, heardExample: heardExample || demoWatched, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower, counting: mode === "practice" && counting },
        inputs: rec.inputs,
        passed: false,
        input: { mode: micTake ? "mic" : listening.mode, unclear: true, reason: unclearWhy },
      } satisfies AttemptRecord);
      setUnclear(unclearAttempt(unclearWhy));
      setPhase("ready");
      setSheetOpen(true);
      return;
    }
    const res = checkAttempt(target, rec.inputs, lesson.assessment, tempo);
    if (playCheck) {
      // The playing check is one response about the controls: stored for the teacher, never evidence.
      setPlayCheck(false);
      setPhase("ready");
      setChecking("play");
      setCheckAnswer(res.passed);
      recordCheck("play", res.passed);
      return;
    }
    if (mode === "practice") setMissesInARow((m) => (res.passed ? 0 : m + 1));
    setLastTake(inputsToPhrase(rec.inputs, target, tempo));
    const d = decide({
      target,
      inputs: rec.inputs,
      result: res,
      aiEnabled: prefs.aiEnabled,
      independentCheck: mode === "independent",
      tempoBpm: tempo,
      focusHint: mode === "practice" ? focusHint : undefined,
    });
    setResult(res);
    setDecision(d);
    setPhase("review");
    setSheetOpen(true);
    setTakeInputs(rec.inputs);
    setTries((t) => t + 1);
    const id = newId("att");
    attemptId.current = id;
    const record: AttemptRecord = {
      id,
      createdAt: stamp(),
      activityId: lesson.id,
      activityVersion: lesson.version,
      kind: mode,
      instrument: target.instrument,
      tempoBpm: tempo,
      support: {
        hintLevel: mode === "independent" ? 0 : hintLevel,
        heardExample: heardExample || demoWatched,
        largeControls: prefs.large,
        simplified: prefs.simplified,
        aiEnabled: prefs.aiEnabled,
        slower,
        counting: mode === "practice" && counting,
      },
      inputs: rec.inputs,
      input: listening.mode === "screen" ? undefined : { mode: listening.mode },
      summary: res.summary,
      passed: res.passed,
      checkerVersion: res.checkerVersion,
      coach: {
        focus: d.focus,
        label: d.label,
        patternSource: d.patternSource,
        pattern: d.pattern,
        modelId: d.model?.modelId,
        modelVersion: d.model?.modelVersion,
        modelStatus: d.model?.status,
        confidence: d.model?.confidence,
        latencyMs: d.model?.latencyMs,
        replyPlanId: d.reply?.plan.planId,
        replyOp: d.reply?.plan.params.op,
        verified: d.reply?.verification.verified,
        rejected: d.replyRejected,
        tailor: {
          provenance: support.start.length || support.demo || d.focusFromLearner ? "learner-model" : "rules",
          focusFromLearner: d.focusFromLearner,
          startTipUsed: [slower && support.start.includes("slower") ? "slower" : "", demoWatched && support.demo ? "demo" : ""].filter(Boolean).join(", ") || undefined,
        },
      },
    };
    setSaveState("saving");
    store.put("attempts", record).then(
      () => setSaveState("saved"),
      () => setSaveState("failed"),
    );
  }, [
    target,
    lesson,
    tempo,
    prefs,
    mode,
    hintLevel,
    heardExample,
    slower,
    totalBeats,
    demoWatched,
    support,
    focusHint,
    playCheck,
    counting,
    timed,
    expected.length,
  ]);

  // "Hear it before each try" (a support the learner chose) plays the music, then starts.
  const start = async () => {
    if (autoHear && mode === "practice" && !playCheck) {
      setHeardExample(true);
      setDemoOn(false);
      await listen.play([{ events: target.events }], tempo, { totalTicks: target.totalTicks, countInBeats: 0, onEnd: () => void begin() });
      return;
    }
    await begin();
  };
  const begin = async () => {
    listen.stop();
    setDemoOn(false);
    setResult(null);
    setDecision(null);
    setLiveCount(0);
    setSaveState("idle");
    setUnclear(null);
    setSheetOpen(false);
    setApplied(null);
    clockFault.current = false;
    if (!audio.running) await audio.start();
    if (timed) {
      setPhase("countin");
      await player.play([], tempo, {
        countInBeats: prefs.countIn,
        // With the microphone on, only the count-in clicks: the learner's taps are all it should hear.
        click: !(listening.listening && target.instrument === "drums"),
        totalTicks: target.totalTicks,
        tailBeats: 0.75,
        onBeat0: (pb) => {
          const wait = pb.beat0PerfMs - performance.now();
          // The first beat should be one count-in away. If the clock says otherwise, the device is
          // at fault (seen in Safari), and this take is not marked.
          if (wait < -50 || wait > prefs.countIn * (60000 / tempo) + 1500) clockFault.current = true;
          beat0Ref.current = pb.beat0PerfMs;
          recorder.current = new Recorder(pb.beat0PerfMs);
          window.setTimeout(
            () => setPhase((p) => (p === "countin" ? "playing" : p)),
            Math.max(0, pb.beat0PerfMs - performance.now()),
          );
        },
        onEnd: finish,
      });
    } else {
      recorder.current = new Recorder(performance.now());
      setPhase("playing");
    }
  };

  const onEvent = useCallback(
    (e: LiveEvent) => {
      const rec = recorder.current;
      if (!rec) return;
      const inp = rec.handle(e);
      if (inp) {
        setLiveCount((c) => {
          const n = c + 1;
          // Untimed pitch tasks finish after the expected number of notes (with a short pause for release).
          if (!timed && n >= expected.length) window.setTimeout(finish, 450);
          return n;
        });
      }
    },
    [timed, expected.length, finish],
  );

  useEffect(() => {
    // Leaving or switching mode cancels any capture so nothing is graded silently.
    return () => {
      recorder.current = null;
    };
  }, [mode]);

  const recordChoice = (choice: string) => {
    store.all<AttemptRecord>("attempts").then((rows) => {
      const r = rows.find((x) => x.id === attemptId.current);
      if (r && r.coach)
        void store.put("attempts", {
          ...r,
          coach: { ...r.coach, learnerChoice: choice },
        });
    });
  };

  const watchDemo = async () => {
    setDemoOn(true);
    setDemoWatched(true);
    await listen.play([{ events: target.events }], tempo, {
      totalTicks: target.totalTicks,
      countInBeats: 0,
      onEnd: () => setDemoOn(false),
    });
  };

  const hearExample = async () => {
    setDemoOn(false);
    setHeardExample(true);
    await listen.play([{ events: target.events }], tempo, {
      totalTicks: target.totalTicks,
      countInBeats: timed ? 4 : 0,
      click: timed,
    });
  };

  // Yours first, a short gap, then the music: the difference is easier to hear side by side.
  const hearDifference = async () => {
    listen.stop();
    const take = inputsToPhrase(takeInputs, target, tempo);
    const gap = target.totalTicks + 480;
    const theirs = target.events.map((e) => ({ ...e, id: `m-${e.id}`, onset: e.onset + gap }));
    await listen.play([{ events: [...take.events, ...theirs] }], tempo, { totalTicks: gap + target.totalTicks, countInBeats: 0 });
  };
  const inputKind = listening.mode === "mic" ? "mic" : listening.mode === "midi" ? "midi" : "screen";
  const fb = result && decision ? attemptFeedback({ target, result, decision, independent: mode === "independent", input: inputKind }) : null;
  // One player for every example, so two never sound at once.
  const playCompare = () => {
    if (listen.playing) return listen.stop();
    if (fb?.compare?.kind === "reply" && decision?.reply) {
      const r = decision.reply;
      recordChoice(`hear-reply:${r.plan.planId}`);
      void listen.play(r.render.tracks, r.render.tempoBpm, { totalTicks: r.render.totalTicks, countInBeats: 0 });
    } else {
      recordChoice("hear-difference");
      void hearDifference();
    }
  };
  // A support chosen from "More help" is applied, said on the try screen, and waits for Start.
  const applySupport = (what: string, apply: () => void) => {
    recordChoice(what);
    listen.stop();
    apply();
    setSheetOpen(false);
    setPhase("ready");
  };

  const theoryId = skillsForActivity(lesson.id)[0]?.theory;

  const marks = result ? result.facts.map(factMark) : undefined;
  const activeIndex = phase === "playing" && !timed ? liveCount : undefined;
  const beatNow = player.beat ?? listen.beat;

  const hints = lesson.hints;
  const goIndependent = () => {
    recordChoice("independent-check");
    setMode("independent");
    setPhase("ready");
    setResult(null);
    setDecision(null);
    setHintLevel(0);
    setHeardExample(false);
  };

  const stepNo =
    stage === "hear" ? 1 : stage === "learn" ? 2 : mode === "practice" ? 3 : 4;
  const busy = phase === "countin" || phase === "playing";
  const topic = theoryId ? topicById(theoryId) : undefined;
  const toSummary = () => {
    recordChoice("finish");
    go(`#/lesson/${lesson.id}/summary`);
  };

  const notation = showNotation ? (
    <Notation phrase={target} marks={marks} activeIndex={activeIndex} />
  ) : (
    <p className="note-text">Music: {describePhrase(target)}</p>
  );

  let body: React.ReactNode;
  let foot: React.ReactNode;
  if (stage === "hear") {
    body = (
      <div className="lp-center">
        <p className="kicker">Listen</p>
        <h1 className="lp-title" tabIndex={-1}>
          {lesson.title}
        </h1>
        <button
          type="button"
          className={`big-play${listen.playing ? " is-on" : ""}`}
          onClick={() => (listen.playing ? listen.stop() : void hearExample())}
          aria-label={listen.playing ? "Stop" : "Hear it"}
        >
          <Icon name={listen.playing ? "stop" : "ear"} size={48} />
        </button>
        <p className="lp-say">{lesson.instruction}</p>
        {act?.crossInstrument && (
          <div className="segmented inst-switch" role="radiogroup" aria-label="Play on">
            {(["drums", "keyboard"] as const).map((i) => (
              <button key={i} type="button" role="radio" aria-checked={inst === i} className="segment" onClick={() => { listen.stop(); setInst(i); }}>
                <Icon name={i === "drums" ? "drum" : "piano"} size={20} /> {i === "drums" ? "Drums" : "Piano"}
              </button>
            ))}
          </div>
        )}
        <div className="lp-music">{notation}</div>
        {(support.start.length > 0 || support.demo) && (
          <div className="suggest" role="note">
            <p className="suggest-why">{support.reason ?? "Some help to start with."}</p>
            <ul className="suggest-list">
              {support.start.includes("slower") && <li><Icon name="check" size={16} /> Starting slower</li>}
              {support.demo && <li><Icon name="check" size={16} /> Watch it on the {inst === "drums" ? "drums" : "keys"} first</li>}
            </ul>
          </div>
        )}
        {support.ready && mode === "practice" && (
          <button type="button" className="btn-text" onClick={() => { listen.stop(); goIndependent(); setStage("try"); }}>
            You know this one. Go straight to on your own
          </button>
        )}
      </div>
    );
    foot = (
      <button
        type="button"
        className="btn btn-big btn-block"
        onClick={() => {
          listen.stop();
          const next = topic || lesson.explanation ? "learn" : "try";
          setStage(next);
          if (next === "try" && support.demo && !demoWatched) void watchDemo();
        }}
      >
        Continue
      </button>
    );
  } else if (stage === "learn") {
    body = (
      <div className="lp-center">
        <p className="kicker">Learn</p>
        <h1 className="lp-title" tabIndex={-1}>
          {topic?.title ?? lesson.goal}
        </h1>
        <div className="concept">
          {topic && <p className="concept-big">{topic.short}</p>}
          <p>{lesson.explanation}</p>
          <MoreDetail lessonId={lesson.id} />
        </div>
        {topic && (
          <button
            type="button"
            className="btn-text"
            onClick={() => go(`#/theory/${topic.id}`)}
          >
            <Icon name="notes" size={20} /> More about{" "}
            {topic.title.toLowerCase()}
          </button>
        )}
      </div>
    );
    foot = (
      <button
        type="button"
        className="btn btn-big btn-block"
        onClick={() => {
          setStage("try");
          if (support.demo && !demoWatched) void watchDemo();
        }}
      >
        I’m ready to try
      </button>
    );
  } else {
    body = (
      <div className="lp-try">
        <div className="lp-task">
          <p className="kicker">
            {mode === "practice" ? "Your turn" : "On your own"}
          </p>
          <h1 className="lp-title small" tabIndex={-1}>
            {mode === "practice"
              ? lesson.instruction
              : "A new one. No hints this time."}
          </h1>
          {demoOn && <p className="lp-status" role="status">Watch the {inst === "drums" ? "drums" : "keys"} light up.</p>}
          {playCheck && <p className="lp-status" role="status">Check: the same music with a slower beat and bigger controls.</p>}
          {!playCheck && fresh && mode === "practice" && <p className="lp-status">A new pattern with the same idea.</p>}
          {mode === "practice" && hintLevel > 0 && (
            <ol className="hint-list" aria-live="polite">
              {hints.slice(0, hintLevel).map((h) => (
                <li key={h.level} className={`hint hint-${h.level}`}>
                  <span className="hint-kind">
                    {h.level === "question"
                      ? "Think"
                      : h.level === "clue"
                        ? "Clue"
                        : "Answer"}
                  </span>{" "}
                  {h.text}
                </li>
              ))}
            </ol>
          )}
          {applied && phase !== "countin" && phase !== "playing" && (
            <p className="lp-status" role="status">
              <Icon name="check" size={20} /> {applied}
            </p>
          )}
          <div className="lp-music">
            {notation}
            {counting && mode === "practice" && <BeatCount phrase={target} now={phase === "playing" ? beatNow : null} />}
          </div>
          <div className="lp-row">
            {timed && (
              <BeatDots
                beats={phase === "countin" ? prefs.countIn : totalBeats}
                current={
                  phase === "countin"
                    ? prefs.countIn + (beatNow ?? -prefs.countIn)
                    : (beatNow ?? -1)
                }
                countIn={phase === "countin"}
              />
            )}
            <div className="chips lp-tools">
              {(phase === "review" || unclear) && !sheetOpen && (
                <button type="button" className="chip chip-feedback" onClick={() => setSheetOpen(true)}>
                  <Icon name="ear" size={20} /> See feedback
                </button>
              )}
              <button
                type="button"
                className="chip"
                onClick={() =>
                  listen.playing ? listen.stop() : void hearExample()
                }
                disabled={busy}
              >
                <Icon name={listen.playing && !demoOn ? "stop" : "ear"} size={20} />{" "}
                {listen.playing && !demoOn ? "Stop" : "Hear it"}
              </button>
              {mode === "practice" && (
                <button
                  type="button"
                  className={`chip${demoOn ? " is-on" : ""}${support.demo && !demoWatched ? " is-suggested" : ""}`}
                  aria-pressed={demoOn}
                  onClick={() => (demoOn ? listen.stop() : void watchDemo())}
                  disabled={busy}
                >
                  <Icon name="playback" size={20} /> Watch it
                </button>
              )}
              {mode === "practice" && (
              <button
                type="button"
                className={`chip${slower ? " is-on" : ""}`}
                aria-pressed={slower}
                onClick={() => setSlower((s) => !s)}
                disabled={busy}
              >
                Slower
              </button>
              )}
              <button
                type="button"
                className={`chip${showNotation ? " is-on" : ""}`}
                aria-pressed={showNotation}
                onClick={() => setShowNotation((s) => !s)}
              >
                Music
              </button>
              {/* Access, not help: stays available when playing on your own. */}
              <button
                type="button"
                className={`chip${prefs.large ? " is-on" : ""}`}
                aria-pressed={prefs.large}
                onClick={() => setPref("large", !prefs.large)}
                disabled={busy || playCheck}
              >
                Bigger controls
              </button>
            </div>
          </div>
        </div>
        <div className="lp-instrument">
          <Workspace
            instrument={target.instrument}
            onEvent={onEvent}
            highlightNotes={highlightNotes}
            highlightPads={highlightPads}
            playOn
          />
        </div>
      </div>
    );
    foot = busy ? (
      <div className="lp-foot-row">
        <p className="status-big" role="status">
          {phase === "countin"
            ? `Get ready… ${prefs.countIn} beats`
            : timed
              ? "Play now"
              : `Play the notes (${liveCount} of ${expected.length})`}
        </p>
        <button
          type="button"
          className="btn-quiet"
          onClick={() => {
            player.stop();
            finish();
          }}
        >
          I’m done
        </button>
      </div>
    ) : (
      <button type="button" className="btn btn-big btn-block" onClick={start}>
        {playCheck ? "Start the check" : tries ? "Start again" : "Start"}
      </button>
    );
  }

  if (stage === "try" && checking) {
    body = (
      <div className="lp-center check-view">
        <p className="kicker">Check · {CHECK_CARDS[checking].title}</p>
        {checking !== "play" ? (
          <CheckPanel
            key={checking}
            kind={checking}
            skill={checkSkill}
            target={lesson.practice ?? target}
            take={lastTake}
            tempo={Math.round(lesson.tempoBpm * 0.9)}
            seed={tries}
            onAnswer={(r) => {
              setCheckAnswer(r);
              recordCheck(checking, r);
            }}
          />
        ) : (
          <h2 className="check-q-title">{checkAnswer ? "That went better with easier controls." : "Still tricky with easier controls."}</h2>
        )}
        {checkAnswer !== null && (
          <CheckResultCard
            kind={checking}
            right={checkAnswer}
            onUse={(sp) => {
              void noteSupport(sp, true);
              closeCheck(sp);
            }}
            onSkip={() => {
              void noteSupport("hear-first", false);
              closeCheck();
            }}
            others={(["listen", "read", "play"] as const).filter((k) => !checksDone.includes(k))}
            onOther={openCheck}
          />
        )}
      </div>
    );
    foot = (
      <button type="button" className="btn-quiet btn-block" onClick={() => closeCheck()}>
        Back to the music
      </button>
    );
  }

  const helped = mode === "practice" && (hintLevel > 0 || slower || demoWatched || counting || autoHear);
  const retry = () => {
    recordChoice("retry");
    listen.stop();
    setSheetOpen(false);
    void start();
  };
  const sheet =
    stage === "try" && unclear ? (
      <FeedbackSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        returnFocus={() => document.querySelector<HTMLElement>(".lp-foot .btn-big")}
        tone="unclear"
        title={unclear.title}
        observed={unclear.observed}
        why={`${unclear.why} ${unclear.advice}`}
        primary={{ label: "Try again", onClick: retry }}
        secondary={
          listening.mode === "mic"
            ? {
                label: "Use the screen instead",
                onClick: () => {
                  listening.chooseScreen();
                  setUnclear(null);
                  setSheetOpen(false);
                  setApplied("Using the screen now. Press Start when you’re ready.");
                },
              }
            : undefined
        }
      />
    ) : stage === "try" && phase === "review" && result && decision && fb ? (
      <FeedbackSheet
        open={sheetOpen}
        onClose={() => {
          listen.stop();
          setSheetOpen(false);
        }}
        returnFocus={() => document.querySelector<HTMLElement>(".chip-feedback") ?? document.querySelector<HTMLElement>(".lp-foot .btn-big")}
        tone={fb.tone}
        title={fb.title}
        observed={fb.observed}
        why={fb.why}
        tag={mode === "independent" ? "On your own" : slower ? "Slower was on" : helped ? "With help" : undefined}
        warning={saveState === "failed" ? "This try couldn’t be saved on this device, so it won’t show in your progress." : undefined}
        compare={fb.compare && takeInputs.length > 0 ? { label: fb.compare.label, playing: listen.playing, onToggle: playCompare } : undefined}
        primary={
          fb.next === "independent"
            ? { label: fb.nextLabel, onClick: () => { setSheetOpen(false); goIndependent(); } }
            : fb.next === "continue"
              ? { label: fb.nextLabel, onClick: () => { recordChoice("make"); go(`#/lesson/${lesson.id}/make`); } }
              : { label: fb.nextLabel, onClick: retry }
        }
        secondary={result.passed ? { label: "Again", onClick: retry } : { label: "Finish for now", onClick: toSummary }}
        moreHelp={
          <>
            {!result.passed && mode === "practice" && (
              <div className="help-options" role="group" aria-label="Ways to practise">
                {timed && (
                  <button type="button" className="help-option" aria-pressed={slower} onClick={() => applySupport("slower", () => { setSlower(() => !slower); setApplied(slower ? "Back to the usual speed. Press Start when you’re ready." : "Slower is on. Press Start when you’re ready."); })}>
                    <Icon name="click" size={24} />
                    <span>
                      <span className="help-title">{slower ? "Back to the usual speed" : "Practise it slower"}</span>
                      <span className="help-about">The same music at a slower beat.</span>
                    </span>
                  </button>
                )}
                <button type="button" className="help-option" onClick={() => applySupport("demo", () => { setApplied(null); void watchDemo(); })}>
                  <Icon name="playback" size={24} />
                  <span>
                    <span className="help-title">Watch it</span>
                    <span className="help-about">Carmen plays it and lights each {inst === "drums" ? "drum" : "key"}.</span>
                  </span>
                </button>
                {hintLevel < 3 && (
                  <button type="button" className="help-option" onClick={() => applySupport("hint", () => { setHintLevel((h) => h + 1); setApplied(null); })}>
                    <Icon name="hint" size={24} />
                    <span>
                      <span className="help-title">{hintLevel ? "Another hint" : "A hint"}</span>
                      <span className="help-about">A clue appears above the music.</span>
                    </span>
                  </button>
                )}
              </div>
            )}
            {!result.passed && mode === "practice" && offer && !checkDeclined && (
              <div className="checkin" role="group" aria-labelledby="checkin-h">
                <p id="checkin-h" className="checkin-q">
                  {TRICKY[offer.skill]} has been tricky a few times. Find out what’s getting in the way:
                </p>
                <div className="help-options">
                  {(["listen", "read", "play"] as const).map((k) => (
                    <button key={k} type="button" className="help-option" onClick={() => { setSheetOpen(false); openCheck(k); }}>
                      <Icon name={k === "listen" ? "ear" : k === "read" ? "notes" : inst === "drums" ? "drum" : "piano"} size={24} />
                      <span>
                        <span className="help-title">{CHECK_CARDS[k].title}</span>
                        <span className="help-about">{CHECK_CARDS[k].about}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <h3 className="help-h">Sound by sound</h3>
            <FactList result={result} />
          </>
        }
      />
    ) : null;

  const side =
    stage === "try" && mode === "practice" && hintLevel < 3 && !busy ? (
      <button
        type="button"
        className="icon-btn quiet"
        aria-label={hintLevel ? "Another hint" : "Hint"}
        onClick={() => setHintLevel((h) => h + 1)}
      >
        <Icon name="hint" size={24} />
      </button>
    ) : null;

  return (
    <LessonShell
      step={stepNo}
      steps={6}
      stepKey={`${stage}-${mode}`}
      onClose={() => {
        player.stop();
        listen.stop();
        go("#/learn");
      }}
      side={side}
      foot={foot}
      sheet={sheet}
    >
      {body}
    </LessonShell>
  );
}

/** Counting under the music: beat numbers, and "rest" on silent beats. A support the learner chose. */
function BeatCount({ phrase, now }: { phrase: Phrase; now: number | null }) {
  const spans = restSpans(phrase);
  const beats = Math.round(phrase.totalTicks / TPQ);
  return (
    <ol className="beat-count" aria-label="Counting">
      {Array.from({ length: beats }, (_, i) => {
        const silent = spans.some(([a, b]) => a <= i * TPQ && (i + 1) * TPQ <= b);
        return (
          <li key={i} className={`${silent ? "is-rest" : ""}${now === i ? " is-now" : ""}`}>
            {silent ? "rest" : String((i % 4) + 1)}
          </li>
        );
      })}
    </ol>
  );
}
