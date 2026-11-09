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
import { skillsForActivity } from "../ai/learner.ts";
import { LessonSummary } from "./LessonSummary.tsx";
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
  const lesson = lessonById(lessonId)!;
  const { prefs } = usePrefs();
  const pathway = pathwayById(prefs.pathway);
  const [mode, setMode] = useState<Mode>("practice");
  const [stage, setStage] = useState<"hear" | "learn" | "try">("hear");
  const [phase, setPhase] = useState<Phase>("ready");
  const [slower, setSlower] = useState(false);
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
  const recorder = useRef<Recorder | null>(null);
  const attemptId = useRef<string>("");
  const player = usePlayer();
  const listen = usePlayer();

  const target: Phrase = (
    mode === "practice" ? lesson.practice : lesson.independent
  )!;
  const tempo = Math.round(lesson.tempoBpm * (slower ? 0.8 : 1));
  const timed = lesson.assessment.checkTiming;
  const expected = soundingEvents(target);
  const totalBeats = target.totalTicks / TPQ;

  // Hint level 2+ in practice shows the target keys/pads. Never in an independent check.
  const showTargets = mode === "practice" && hintLevel >= 2;
  const highlightNotes = useMemo(
    () =>
      new Set(
        showTargets
          ? expected
              .filter((e) => e.kind === "note")
              .map((e) => (e as { midi: number }).midi)
          : [],
      ),
    [showTargets, expected],
  );
  const highlightPads = useMemo(
    () =>
      new Set<DrumSound>(
        showTargets
          ? expected
              .filter((e) => e.kind === "drum")
              .map((e) => (e as { sound: DrumSound }).sound)
          : [],
      ),
    [showTargets, expected],
  );

  const finish = useCallback(() => {
    const rec = recorder.current;
    if (!rec) return;
    recorder.current = null;
    rec.closeAll((totalBeats + 1) * (60000 / tempo));
    const res = checkAttempt(target, rec.inputs, lesson.assessment, tempo);
    const d = decide({
      target,
      inputs: rec.inputs,
      result: res,
      aiEnabled: prefs.aiEnabled,
      independentCheck: mode === "independent",
      tempoBpm: tempo,
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
        heardExample,
        largeControls: prefs.large,
        simplified: prefs.simplified,
        aiEnabled: prefs.aiEnabled,
        slower,
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
  ]);

  const start = async () => {
    listen.stop();
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

  const reflect = (id: string | null) => {
    if (!attemptId.current) return;
    store.all<AttemptRecord>("attempts").then((rows) => {
      const r = rows.find((x) => x.id === attemptId.current);
      if (r) void store.put("attempts", { ...r, reflection: id ?? "skipped" });
    });
  };

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

  const hearExample = async () => {
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
        <div className="lp-music">{notation}</div>
      </div>
    );
    foot = (
      <button
        type="button"
        className="btn btn-big btn-block"
        onClick={() => {
          listen.stop();
          setStage(topic || lesson.explanation ? "learn" : "try");
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
        onClick={() => setStage("try")}
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
          <div className="lp-music">{notation}</div>
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
                <Icon name={listen.playing ? "stop" : "ear"} size={18} />{" "}
                {listen.playing ? "Stop" : "Hear it"}
              </button>
              <button
                type="button"
                className={`chip${slower ? " is-on" : ""}`}
                aria-pressed={slower}
                onClick={() => setSlower((s) => !s)}
                disabled={busy}
              >
                Slower
              </button>
              <button
                type="button"
                className={`chip${showNotation ? " is-on" : ""}`}
                aria-pressed={showNotation}
                onClick={() => setShowNotation((s) => !s)}
              >
                Music
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

  const sheet =
    stage === "try" && phase === "review" && result && decision ? (
      <section
        className={`check-sheet tone-${tone}`}
        aria-labelledby="review-h"
        role="dialog"
        aria-modal="false"
      >
        <div className="check-inner">
          <h2 id="review-h" className="check-title">
            {result.passed
              ? mode === "independent"
                ? "You did it on your own!"
                : "That matched!"
              : tone === "near"
                ? "Nearly!"
                : "Not yet"}
          </h2>
          {saveState === "failed" && (
            <p className="support warn">This try couldn’t be saved.</p>
          )}
          <FactList result={result} />
          <LiveStatus
            text={`${result.summary.correctSound} of ${result.summary.expected} sounds matched.`}
          />
          <div className="chips">
            <button
              type="button"
              className="chip"
              onClick={() =>
                listen.playing ? listen.stop() : void listenBack()
              }
              disabled={!takeInputs.length}
            >
              <Icon name={listen.playing ? "stop" : "ear"} size={18} />{" "}
              {listen.playing ? "Stop" : "Listen back"}
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => void hearExample()}
            >
              <span aria-hidden="true">▶ </span>Hear it again
            </button>
          </div>
          <CoachCard
            decision={decision}
            onChoice={recordChoice}
            onReflect={mode === "practice" ? reflect : undefined}
          />
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
                onClick={mode === "practice" ? goIndependent : toSummary}
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-quiet"
                onClick={mode === "practice" ? toSummary : toSummary}
              >
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
      steps={5}
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
