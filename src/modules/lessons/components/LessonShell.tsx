import { ArrowLeft, ArrowRight, CheckCircle2, Circle, ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adjacentLessons } from "../catalog/lessonCatalog";
import { checkLessonAnswer, createLessonChallenge } from "../engine/lessonRuntime";
import { createLegacyInteractionEvent, hasRequiredLessonEvidence } from "../engine/lessonInteraction";
import { clearLessonProgress, defaultLessonProgress, readLessonProgress, writeLessonProgress } from "../engine/lessonPersistence";
import type { LessonDefinition, LessonProgress, LessonStage } from "../types";
import LessonSurface from "./LessonSurface";

const stages: Array<{ id: LessonStage; label: string }> = [
  { id: "discover", label: "Discover" },
  { id: "explore", label: "Explore" },
  { id: "try", label: "Try" },
  { id: "check", label: "Check" },
];

export default function LessonShell({ lesson }: { lesson: LessonDefinition }) {
  const [progress, setProgress] = useState<LessonProgress>(() => readLessonProgress(lesson));
  const [resetToken, setResetToken] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const interacted = useMemo(() => hasRequiredLessonEvidence(lesson, progress.interactionHistory), [lesson, progress.interactionHistory]);
  const challenge = useMemo(() => createLessonChallenge(lesson, progress.seed, progress.interactionHistory), [lesson, progress.interactionHistory, progress.seed]);
  const adjacent = useMemo(() => adjacentLessons(lesson), [lesson]);

  useEffect(() => { setProgress(readLessonProgress(lesson)); setFeedback(""); }, [lesson]);
  useEffect(() => { writeLessonProgress(lesson.id, progress); }, [lesson.id, progress]);

  const patchProgress = (patch: Partial<LessonProgress>) => setProgress((current) => ({ ...current, ...patch, updatedAt: Date.now() }));
  const reset = () => {
    clearLessonProgress(lesson.id);
    setProgress(defaultLessonProgress(lesson));
    setFeedback("");
    setResetToken((value) => value + 1);
  };
  const share = async () => {
    const url = window.location.href;
    await navigator.clipboard?.writeText(url);
    setShareStatus("Lesson link copied.");
  };
  const check = () => {
    const result = checkLessonAnswer(challenge, progress.answer, interacted);
    setFeedback(result.feedback);
    if (result.correct) patchProgress({ completed: true, stage: "check" });
  };

  return (
    <div className="space-y-3" data-testid="lesson-page" data-lesson-id={lesson.id}>
      <header className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300"><Link to={`/lessons/${lesson.categorySlug}`}>{lesson.category}</Link><span>•</span><span>{lesson.topic}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-white/10 dark:text-slate-300">Phase {lesson.phase} · #{lesson.id}</span></div>
            <h1 className="mt-1 break-words text-xl font-black text-slate-950 dark:text-white sm:text-2xl">{lesson.title}</h1>
            <p className="mt-1 max-w-3xl text-sm font-semibold text-slate-600 dark:text-slate-300">{lesson.purpose}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="action-secondary" onClick={reset}><RotateCcw className="h-4 w-4" />Reset</button>
            <button type="button" className="action-secondary" onClick={() => void share()}><Share2 className="h-4 w-4" />Share</button>
            <Link className="action-secondary" to={workspaceRoute(lesson)}><ExternalLink className="h-4 w-4" />Workspace</Link>
          </div>
        </div>
        <p className="sr-only" role="status" aria-live="polite">{shareStatus}</p>
        <nav className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/10" aria-label="Lesson stages">
          {stages.map((stage, index) => {
            const active = progress.stage === stage.id;
            const locked = (index >= 1 && !progress.prediction.trim()) || (index >= 2 && !interacted);
            const lockedReason = index >= 1 && !progress.prediction.trim() ? "Record a prediction first." : index >= 2 && !interacted ? `Use ${lesson.contract.requiredInteractionVerbs[0]} on the live model first.` : undefined;
            return <button key={stage.id} type="button" disabled={locked} aria-description={lockedReason} title={lockedReason} onClick={() => patchProgress({ stage: stage.id })} className={active ? "min-h-10 rounded-lg bg-cyan-500 px-2 text-xs font-black text-white shadow" : "min-h-10 rounded-lg px-2 text-xs font-black text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-white/10"}>{progress.completed && stage.id === "check" ? <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> : null}{stage.label}</button>;
          })}
        </nav>
      </header>

      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <LessonSurface lesson={lesson} resetToken={resetToken} onInteraction={(event) => { const interaction = event ?? createLegacyInteractionEvent(lesson); setProgress((current) => ({ ...current, interactionHistory: [...current.interactionHistory, interaction].slice(-40), ...(current.stage === "discover" && current.prediction.trim() ? { stage: "explore" as const } : {}), updatedAt: Date.now() })); }} />
        <aside className="space-y-3 xl:sticky xl:top-20">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            {progress.stage === "discover" ? <PredictionPanel value={progress.prediction} onChange={(prediction) => patchProgress({ prediction })} onContinue={() => patchProgress({ stage: "explore" })} /> : null}
            {progress.stage === "explore" ? <ExplorePanel lesson={lesson} interacted={interacted} onContinue={() => patchProgress({ stage: "try" })} /> : null}
            {progress.stage === "try" || progress.stage === "check" ? <ChallengePanel prompt={challenge.prompt} hint={challenge.hint} answer={progress.answer} feedback={feedback} completed={progress.completed} onAnswer={(answer) => patchProgress({ answer })} onCheck={check} /> : null}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-2"><span className="font-black">{lesson.level}</span><span className="rounded-full bg-cyan-50 px-2 py-1 font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{lesson.mode}</span></div>
            <p className="mt-2 leading-5 text-slate-500 dark:text-slate-300">{lesson.outcome}</p>
          </section>
        </aside>
      </div>

      <nav className="flex items-center justify-between gap-3" aria-label="Adjacent lessons">
        {adjacent.previous ? <Link className="action-secondary" to={adjacent.previous.route}><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">{adjacent.previous.title}</span><span className="sm:hidden">Previous</span></Link> : <span />}
        {adjacent.next ? <Link className="action-secondary" to={adjacent.next.route}><span className="hidden sm:inline">{adjacent.next.title}</span><span className="sm:hidden">Next</span><ArrowRight className="h-4 w-4" /></Link> : <span />}
      </nav>
    </div>
  );
}

function PredictionPanel({ value, onChange, onContinue }: { value: string; onChange: (value: string) => void; onContinue: () => void }) {
  return <div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-600">Discover</p><h2 className="mt-1 text-lg font-black">Predict first</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">What do you expect to change when you use the main control?</p><textarea aria-label="Lesson prediction" className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" value={value} onChange={(event) => onChange(event.target.value)} placeholder="I predict…" /><button type="button" className="action-primary mt-3 w-full justify-center" disabled={!value.trim()} onClick={onContinue}>Record prediction</button></div>;
}

function ExplorePanel({ lesson, interacted, onContinue }: { lesson: LessonDefinition; interacted: boolean; onContinue: () => void }) {
  return <div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-600">Explore</p><h2 className="mt-1 text-lg font-black">Change and observe</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.description}</p><div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-100 p-3 text-sm font-bold dark:bg-white/10">{interacted ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-400" />}{interacted ? "Interaction recorded" : "Use a control on the live model"}</div><button type="button" className="action-primary mt-3 w-full justify-center" disabled={!interacted} onClick={onContinue}>Try a challenge</button></div>;
}

function ChallengePanel({ prompt, hint, answer, feedback, completed, onAnswer, onCheck }: { prompt: string; hint: string; answer: string; feedback: string; completed: boolean; onAnswer: (value: string) => void; onCheck: () => void }) {
  return <div><p className="text-[10px] font-black uppercase tracking-wide text-cyan-600">{completed ? "Check complete" : "Try"}</p><h2 className="mt-1 text-lg font-black">{prompt}</h2><input className="mt-3 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm dark:border-white/10 dark:bg-slate-900" value={answer} onChange={(event) => onAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onCheck(); }} aria-label="Challenge answer" /><button type="button" className="action-primary mt-3 w-full justify-center" onClick={onCheck}>Check answer</button>{feedback ? <p className={completed ? "mt-3 rounded-xl bg-emerald-100 p-3 text-sm font-bold text-emerald-900" : "mt-3 rounded-xl bg-amber-100 p-3 text-sm font-bold text-amber-900"} role="status">{feedback}</p> : <p className="mt-2 text-xs text-slate-500">Hint available after an attempt: {hint}</p>}</div>;
}

function workspaceRoute(lesson: LessonDefinition) {
  if (lesson.adapter === "calculator") return "/calculator";
  if (lesson.adapter === "algebra") return "/workspace/graph";
  if (lesson.adapter === "graph" || lesson.adapter === "trigonometry") return "/workspace/graph";
  if (lesson.adapter === "geometry2d" || lesson.adapter === "vector") return "/workspace/geometry";
  if (lesson.adapter === "algebra-cas" || lesson.adapter === "cas") return "/workspace/data/cas";
  if (lesson.adapter === "calculus") return "/workspace/graph";
  if (lesson.adapter === "spreadsheet") return "/workspace/data/spreadsheet";
  if (lesson.adapter === "statistics" || lesson.adapter === "probability" || lesson.adapter === "inference") return "/workspace/data/analysis";
  if (lesson.adapter === "geometry3d") return "/workspace/3d";
  if (lesson.adapter === "discrete") return "/modules/discrete-world";
  if (lesson.adapter === "finance") return "/workspace/data/spreadsheet";
  if (lesson.adapter === "sequence" || lesson.adapter === "matrix" || lesson.adapter === "complex") return "/workspace";
  if (lesson.adapter === "authoring" || lesson.adapter === "learning") return "/workspace/teach";
  return "/workspace";
}
