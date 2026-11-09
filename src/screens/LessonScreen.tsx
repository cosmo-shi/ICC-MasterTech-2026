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
import { CoachCard } from "../ui/CoachCard.tsx";
import { BeatDots, FactList, LiveStatus, factMark } from "../ui/common.tsx";
import { MoreDetail } from "../ui/MoreDetail.tsx";
import { Notation, describePhrase } from "../ui/Notation.tsx";
import { usePlayer } from "../ui/usePlayer.ts";
import { type LiveEvent, Workspace } from "../ui/Workspace.tsx";
import { FreeLesson } from "./FreeLesson.tsx";
import { inputsToPhrase } from "../ai/coach.ts";
import { coachFocus, LESSON_INFOS, skillById, skillsForActivity, supportFor } from "../ai/learner.ts";
import { CHECK_CARDS, type CheckKind, type SupportId, checkInOffer, rulesCheckInOffer } from "../ai/checkin.ts";
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
    if (!audio.running) await audio.start();
    if (timed) {
      setPhase("countin");
      await player.play([], tempo, {
        countInBeats: prefs.countIn,
        click: true,
        totalTicks: target.totalTicks,
        tailBeats: 0.75,
        onBeat0: (pb) => {
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

  const listenBack = async () => {
    listen.stop();
    const take = inputsToPhrase(takeInputs, target, tempo);
    await listen.play([{ events: take.events }], tempo, {
      totalTicks: target.totalTicks,
    });
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
  const tone = result
    ? result.passed
      ? "good"
      : result.summary.correctSound * 2 >= result.summary.expected
        ? "near"
        : "miss"
    : "near";
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
          <Icon name={listen.playing ? "stop" : "ear"} size={56} />
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
            <Icon name="notes" size={18} /> More about{" "}
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
              <button
                type="button"
                className="chip"
                onClick={() =>
                  listen.playing ? listen.stop() : void hearExample()
                }
                disabled={busy}
              >
                <Icon name={listen.playing && !demoOn ? "stop" : "ear"} size={18} />{" "}
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
                  <Icon name="playback" size={18} /> Watch it
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
        {tries ? "Start again" : "Start"}
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
  const sheet =
    stage === "try" && phase === "review" && result && decision ? (
      <section
        className={`check-sheet tone-${tone}`}
        aria-labelledby="review-h"
        role="dialog"
        aria-modal="false"
      >
        <div className="check-inner">
          <div className="check-head">
            <ToneMark tone={tone} />
            <h2 id="review-h" className="check-title">
              {result.passed
                ? mode === "independent"
                  ? "You did it on your own!"
                  : "That matched!"
                : tone === "near"
                  ? "Nearly!"
                  : "Not yet"}
            </h2>
            <span className={`help-tag${helped ? " is-help" : ""}`}>
              {mode === "independent" ? "On your own" : helped ? "With help" : "Practice"}
            </span>
          </div>
          {saveState === "failed" && (
            <p className="support warn">This try couldn’t be saved.</p>
          )}
          <CoachCard decision={decision} onChoice={recordChoice} />
          <FactList result={result} />
          <LiveStatus
            text={`${result.summary.correctSound} of ${result.summary.expected} sounds matched.`}
          />
          <div className="compare" role="group" aria-label="Compare">
            <button
              type="button"
              className="chip"
              onClick={() => (listen.playing ? listen.stop() : void listenBack())}
              disabled={!takeInputs.length}
            >
              <Icon name={listen.playing ? "stop" : "playback"} size={18} /> Hear yours
            </button>
            <button type="button" className="chip" onClick={() => void hearExample()}>
              <Icon name="ear" size={18} /> Hear the music
            </button>
          </div>
          {!result.passed && mode === "practice" && offer && !checkDeclined && (
            <div className="checkin" role="group" aria-labelledby="checkin-h">
              <p id="checkin-h" className="checkin-q">
                {skillById(offer.skill).name} has been tricky a few times. Find out what’s getting in the way?
              </p>
              <div className="checkin-cards">
                {(["listen", "read", "play"] as const).map((k) => (
                  <button key={k} type="button" className="checkin-card" onClick={() => openCheck(k)}>
                    <Icon name={k === "listen" ? "ear" : k === "read" ? "notes" : inst === "drums" ? "drum" : "piano"} size={24} />
                    <span className="checkin-title">{CHECK_CARDS[k].title}</span>
                    <span className="checkin-about">{CHECK_CARDS[k].about}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="btn-text" onClick={() => setCheckDeclined(true)}>
                Not now
              </button>
            </div>
          )}
          {!result.passed && mode === "practice" && (
            <div className="chips help-row" role="group" aria-label="Get help">
              <button
                type="button"
                className={`chip${slower ? " is-on" : ""}`}
                aria-pressed={slower}
                onClick={() => setSlower((x) => !x)}
              >
                Slower
              </button>
              {hintLevel < 3 && (
                <button
                  type="button"
                  className="chip"
                  onClick={() => {
                    recordChoice("hint");
                    setHintLevel((h) => h + 1);
                    setPhase("ready");
                  }}
                >
                  <Icon name="hint" size={18} /> {hintLevel ? "Another hint" : "Hint"}
                </button>
              )}
              <button
                type="button"
                className="chip"
                onClick={() => {
                  recordChoice("demo");
                  setPhase("ready");
                  void watchDemo();
                }}
              >
                <Icon name="playback" size={18} /> Watch it
              </button>
            </div>
          )}
        </div>
        <div className="check-foot">
          {result.passed ? (
            <>
              <button
                type="button"
                className="btn-quiet"
                onClick={() => {
                  recordChoice("retry");
                  void start();
                }}
              >
                Again
              </button>
              <button
                type="button"
                className="btn btn-big"
                onClick={mode === "practice" ? goIndependent : () => { recordChoice("make"); go(`#/lesson/${lesson.id}/make`); }}
              >
                {mode === "practice" ? "Now on your own" : "Continue"}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn-quiet" onClick={toSummary}>
                Finish for now
              </button>
              <button
                type="button"
                className="btn btn-big"
                onClick={() => {
                  recordChoice("retry");
                  void start();
                }}
              >
                Try again
              </button>
            </>
          )}
        </div>
      </section>
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
      foot={sheet ? null : foot}
      sheet={sheet}
    >
      {body}
    </LessonShell>
  );
}

/** A shape for each result, so it never relies on colour: tick, half circle, open circle. */
function ToneMark({ tone }: { tone: "good" | "near" | "miss" }) {
  return (
    <svg className={`tone-mark tone-${tone}`} width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity={tone === "miss" ? 0 : 0.16} />
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      {tone === "good" && <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />}
      {tone === "near" && <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />}
    </svg>
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
