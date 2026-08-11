import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardCheck,
  ExternalLink,
  Eye,
  HelpCircle,
  Keyboard,
  Languages,
  Layers3,
  Lightbulb,
  ListChecks,
  Lock,
  MousePointer2,
  NotebookText,
  PanelTop,
  RotateCcw,
  Route,
  Share2,
  ShieldCheck,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../../../components/ui/MathExpression";
import { adjacentLessons } from "../catalog/lessonCatalog";
import { createLegacyInteractionEvent, hasRequiredLessonEvidence } from "../engine/lessonInteraction";
import { isLessonLanguageCode, lessonLanguageOptions, loadLessonLocalizedContent } from "../engine/lessonLanguages";
import { clearLessonProgress, defaultLessonProgress, readLessonProgress, writeLessonProgress } from "../engine/lessonPersistence";
import { checkLessonAnswer, createLessonChallenge } from "../engine/lessonRuntime";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";
import type { LessonContent, LessonDefinition, LessonLanguageCode, LessonProgress, LessonStage } from "../types";
import LessonSurface from "./LessonSurface";

const stages: Array<{ id: LessonStage; label: string; short: string; description: string }> = [
  { id: "discover", label: "Discover", short: "Predict", description: "Write what you expect before touching the model." },
  { id: "explore", label: "Explore", short: "Interact", description: "Change controls and observe linked outputs." },
  { id: "try", label: "Try", short: "Solve", description: "Use the model and formula to answer a challenge." },
  { id: "check", label: "Check", short: "Verify", description: "Confirm the answer and lock in the learning." },
];

const predictionStarters = [
  "I predict the output will increase when the main control increases.",
  "I predict the visual and formula will change together.",
  "I predict one representation will explain the other.",
];

export default function LessonShell({ lesson }: { lesson: LessonDefinition }) {
  const [progress, setProgress] = useState<LessonProgress>(() => readLessonProgress(lesson));
  const [resetToken, setResetToken] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [languageCode, setLanguageCode] = useState<LessonLanguageCode>("en");
  const [languageContent, setLanguageContent] = useState<LessonContent | null>(null);
  const [languageStatus, setLanguageStatus] = useState("");
  const interacted = useMemo(() => hasRequiredLessonEvidence(lesson, progress.interactionHistory), [lesson, progress.interactionHistory]);
  const challenge = useMemo(() => createLessonChallenge(lesson, progress.seed, progress.interactionHistory), [lesson, progress.interactionHistory, progress.seed]);
  const adjacent = useMemo(() => adjacentLessons(lesson), [lesson]);
  const strengthenedLesson = useMemo(() => getStrengthenedFoundationLesson(lesson.id), [lesson.id]);
  const selectedLanguage = lessonLanguageOptions.find((option) => option.code === languageCode) ?? lessonLanguageOptions[0];
  const localizedContent = languageContent ?? lesson.content;
  const stageIndex = Math.max(0, stages.findIndex((stage) => stage.id === progress.stage));
  const completionChecks = [
    Boolean(progress.prediction.trim()),
    interacted,
    Boolean(progress.answer.trim()),
    progress.completed,
  ];
  const completedChecks = completionChecks.filter(Boolean).length;
  const progressPercent = progress.completed ? 100 : Math.max(12, Math.round((completedChecks / completionChecks.length) * 100));

  useEffect(() => { setProgress(readLessonProgress(lesson)); setFeedback(""); setShareStatus(""); }, [lesson]);
  useEffect(() => { writeLessonProgress(lesson.id, progress); }, [lesson.id, progress]);
  useEffect(() => {
    let cancelled = false;
    if (languageCode === "en") {
      setLanguageContent(null);
      setLanguageStatus("");
      return () => { cancelled = true; };
    }
    setLanguageContent(null);
    setLanguageStatus("Loading language pack...");
    void loadLessonLocalizedContent(languageCode, lesson).then((content) => {
      if (cancelled) return;
      setLanguageContent(content);
      setLanguageStatus(`${selectedLanguage.englishName} lesson language loaded for this lesson.`);
    }).catch(() => {
      if (cancelled) return;
      setLanguageContent(null);
      setLanguageStatus("Language pack could not be loaded. Showing English.");
    });
    return () => { cancelled = true; };
  }, [languageCode, lesson, selectedLanguage.englishName]);

  const patchProgress = (patch: Partial<LessonProgress>) => setProgress((current) => ({ ...current, ...patch, updatedAt: Date.now() }));
  const reset = () => {
    clearLessonProgress(lesson.id);
    setProgress(defaultLessonProgress(lesson));
    setFeedback("");
    setShareStatus("");
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
      <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-cyan-950/5 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500" />
        <div className="p-3 sm:p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide">
                <Link className="rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-300/10 dark:text-cyan-100" to={`/lessons/${lesson.categorySlug}`}>{lesson.category}</Link>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-300">{lesson.topic}</span>
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700 dark:bg-violet-300/10 dark:text-violet-100">Phase {lesson.phase}</span>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700 dark:bg-amber-300/10 dark:text-amber-100">Lesson #{lesson.id}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-100">{lesson.priority}</span>
              </div>
              <h1 className="mt-2 break-words text-2xl font-black leading-tight text-slate-950 dark:text-white sm:text-3xl">{lesson.title}</h1>
              <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{lesson.purpose}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <InfoChip icon={<Award className="h-3.5 w-3.5" />} label={lesson.level} />
                <InfoChip icon={<Zap className="h-3.5 w-3.5" />} label={lesson.mode} />
                <InfoChip icon={<PanelTop className="h-3.5 w-3.5" />} label={lesson.feature} />
                <InfoChip icon={<Timer className="h-3.5 w-3.5" />} label="6-10 min" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200" title="Load a lesson language pack on demand">
                <Languages className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                <select
                  className="bg-transparent text-xs font-black outline-none"
                  aria-label="Lesson language"
                  value={languageCode}
                  onChange={(event) => {
                    const nextCode = event.target.value;
                    if (isLessonLanguageCode(nextCode)) setLanguageCode(nextCode);
                  }}
                >
                  {lessonLanguageOptions.map((option) => <option key={option.code} value={option.code}>{option.nativeName} ({option.englishName})</option>)}
                </select>
              </label>
              <button type="button" className="action-secondary" onClick={reset} title="Reset lesson progress"><RotateCcw className="h-4 w-4" />Reset</button>
              <button type="button" className="action-secondary" onClick={() => void share()} title="Copy lesson link"><Share2 className="h-4 w-4" />Share</button>
              <Link className="action-secondary" to={workspaceRoute(lesson)} title="Open related workspace"><ExternalLink className="h-4 w-4" />Workspace</Link>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
              <div className="mb-2 flex items-center justify-between gap-2 px-1 text-xs font-black text-slate-600 dark:text-slate-300">
                <span>Learning progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <nav className="mt-2 grid grid-cols-4 gap-1" aria-label="Lesson stages">
                {stages.map((stage, index) => {
                  const active = progress.stage === stage.id;
                  const done = completionChecks[index] || (progress.completed && index <= stageIndex);
                  const locked = (index >= 1 && !progress.prediction.trim()) || (index >= 2 && !interacted);
                  const lockedReason = index >= 1 && !progress.prediction.trim() ? "Record a prediction first." : index >= 2 && !interacted ? `Use ${lesson.contract.requiredInteractionVerbs[0]} on the live model first.` : undefined;
                  return (
                    <button key={stage.id} type="button" disabled={locked} aria-description={lockedReason} title={lockedReason ?? stage.description} onClick={() => patchProgress({ stage: stage.id })} className={active ? "min-h-14 rounded-lg bg-cyan-500 px-2 text-xs font-black text-white shadow" : "min-h-14 rounded-lg px-2 text-xs font-black text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-white/10"}>
                      <span className="mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">{locked ? <Lock className="h-3 w-3" /> : done ? <Check className="h-3 w-3" /> : index + 1}</span>
                      <span className="block">{stage.label}</span>
                      <span className="hidden text-[10px] font-bold opacity-80 sm:block">{stage.short}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-center gap-2 font-black text-slate-800 dark:text-slate-100"><Route className="h-4 w-4 text-cyan-600" />Current step</div>
              <p className="mt-2 leading-5 text-slate-600 dark:text-slate-300">{stages[stageIndex]?.description}</p>
              {shareStatus ? <p className="mt-2 rounded-lg bg-emerald-50 p-2 font-black text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100" role="status">{shareStatus}</p> : null}
            </div>
          </div>
        </div>
      </header>

      <QuickAnchorBar />

      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-3">
          <section id="lesson-live" className="rounded-2xl border border-cyan-100 bg-white/90 p-3 shadow-lg shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75" aria-label="Lesson interaction and visualization">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">Interaction + visualization</p>
                <h2 className="mt-1 text-base font-black text-slate-950 dark:text-white">Move the model first</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill active={interacted} activeText="Live evidence recorded" idleText="Awaiting interaction" />
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">{progress.interactionHistory.length} actions</span>
              </div>
            </div>
            <div className="mb-3 grid gap-2 md:grid-cols-3">
              <MiniMetric icon={<MousePointer2 className="h-4 w-4" />} label="Primary actions" value={lesson.contract.requiredInteractionVerbs.join(", ")} />
              <MiniMetric icon={<Eye className="h-4 w-4" />} label="Observe" value={lesson.contract.observableOutputs.join(", ")} />
              <MiniMetric icon={<Layers3 className="h-4 w-4" />} label="Representations" value={lesson.contract.requiredRepresentations.join(", ")} />
            </div>
            <LessonVisualBrief lesson={lesson} strengthenedLesson={strengthenedLesson} />
            <LessonSurface lesson={lesson} resetToken={resetToken} onInteraction={(event) => { const interaction = event ?? createLegacyInteractionEvent(lesson); setProgress((current) => ({ ...current, interactionHistory: [...current.interactionHistory, interaction].slice(-40), ...(current.stage === "discover" && current.prediction.trim() ? { stage: "explore" as const } : {}), updatedAt: Date.now() })); }} />
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {lesson.contract.requiredControlIds.map((control) => <Tag key={control} icon={<SlidersHorizontal className="h-3.5 w-3.5" />} label={control} />)}
              {lesson.contract.workspaceObjects.slice(0, 3).map((object) => <Tag key={object} icon={<PanelTop className="h-3.5 w-3.5" />} label={object} />)}
            </div>
          </section>
          <LessonContentPanel lesson={lesson} content={localizedContent} language={selectedLanguage} status={languageStatus} />
        </main>

        <aside className="space-y-3 xl:sticky xl:top-20">
          <StageCoach
            lesson={lesson}
            progress={progress}
            interacted={interacted}
            completedChecks={completedChecks}
            totalChecks={completionChecks.length}
          />
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
            {progress.stage === "discover" ? <PredictionPanel value={progress.prediction} onChange={(prediction) => patchProgress({ prediction })} onContinue={() => patchProgress({ stage: "explore" })} /> : null}
            {progress.stage === "explore" ? <ExplorePanel lesson={lesson} interacted={interacted} onContinue={() => patchProgress({ stage: "try" })} /> : null}
            {progress.stage === "try" || progress.stage === "check" ? <ChallengePanel prompt={challenge.prompt} hint={challenge.hint} answer={progress.answer} feedback={feedback} completed={progress.completed} onAnswer={(answer) => patchProgress({ answer })} onCheck={check} /> : null}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between gap-2"><span className="font-black">Outcome</span><span className="rounded-full bg-cyan-50 px-2 py-1 font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{lesson.mode}</span></div>
            <p className="mt-2 leading-5 text-slate-500 dark:text-slate-300">{lesson.outcome}</p>
            <p className="mt-3 rounded-xl bg-slate-50 p-2 font-bold leading-5 text-slate-600 dark:bg-white/10 dark:text-slate-300">{lesson.contract.screenReaderSummary}</p>
          </section>
        </aside>
      </div>

      <nav className="grid gap-3 sm:grid-cols-2" aria-label="Adjacent lessons">
        {adjacent.previous ? <Link className="action-secondary justify-start" to={adjacent.previous.route}><ArrowLeft className="h-4 w-4" /><span><span className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-300">Previous</span><span className="line-clamp-1">{adjacent.previous.title}</span></span></Link> : <span />}
        {adjacent.next ? <Link className="action-secondary justify-end text-right" to={adjacent.next.route}><span><span className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-300">Next</span><span className="line-clamp-1">{adjacent.next.title}</span></span><ArrowRight className="h-4 w-4" /></Link> : <span />}
      </nav>
    </div>
  );
}

function LessonVisualBrief({ lesson, strengthenedLesson }: { lesson: LessonDefinition; strengthenedLesson: StrengthenedLesson | null }) {
  const representations = strengthenedLesson?.representations.length ? strengthenedLesson.representations : lesson.contract.requiredRepresentations.map((representation) => ({
    id: representation,
    type: "text_table" as const,
    learningPurpose: `Use the ${representation} representation to inspect ${lesson.title}.`,
  }));
  const misconception = strengthenedLesson?.misconceptions[0];
  const exitCheck = strengthenedLesson?.exitCheck[0];
  return (
    <section className="mb-3 rounded-2xl border border-sky-200 bg-sky-50/80 p-3 dark:border-sky-300/20 dark:bg-sky-300/10" aria-label="Lesson-specific visual requirements">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle icon={<Eye className="h-4 w-4" />} label="Visual requirement" />
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-sky-700 dark:bg-white/10 dark:text-sky-100">
          {strengthenedLesson ? "Strengthened" : "Contract"}
        </span>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {representations.slice(0, 4).map((representation) => (
          <article key={representation.id} className="rounded-xl border border-sky-100 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-950/50">
            <p className="text-[10px] font-black uppercase text-sky-700 dark:text-sky-200">{representation.type.replace(/_/g, " ")}</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">{representation.learningPurpose}</p>
          </article>
        ))}
      </div>
      <div className="mt-2 grid gap-2 lg:grid-cols-2">
        {misconception ? <p className="rounded-xl bg-white/85 p-3 text-xs font-bold leading-5 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200"><strong>Do not make it generic:</strong> {misconception.correction}</p> : null}
        {exitCheck ? <p className="rounded-xl bg-white/85 p-3 text-xs font-bold leading-5 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200"><strong>Visual must prove:</strong> {exitCheck.criterion}</p> : null}
      </div>
    </section>
  );
}

function LessonContentPanel({ lesson, content, language, status }: { lesson: LessonDefinition; content: LessonContent; language: (typeof lessonLanguageOptions)[number]; status: string }) {
  return (
    <section id="lesson-explain" className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/70" aria-label="Lesson learning content" lang={language.code} dir={language.direction ?? "ltr"}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-violet-50 p-4 dark:border-cyan-300/20 dark:from-cyan-300/10 dark:via-slate-950 dark:to-violet-300/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle icon={<BookOpen className="h-4 w-4" />} label="Simple explanation" />
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase text-cyan-700 dark:bg-white/10 dark:text-cyan-100">{language.nativeName} lesson</span>
          </div>
          {status ? <p className="mt-3 rounded-lg bg-slate-50 p-2 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300" role="status">{status}</p> : null}
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{content.summary}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{content.explanation}</p>
          <p className="mt-3 rounded-xl border border-cyan-100 bg-white/80 p-3 text-sm font-bold leading-6 text-cyan-950 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">{content.workedConnection}</p>
        </div>
        <div className="grid gap-2">
          <MiniMetric icon={<Target className="h-4 w-4" />} label="Concept" value={lesson.contract.concept} />
          <MiniMetric icon={<ClipboardCheck className="h-4 w-4" />} label="Challenge type" value={lesson.contract.challengeFactory} />
          <MiniMetric icon={<ShieldCheck className="h-4 w-4" />} label="Reset checks" value={lesson.contract.resetAssertions.join(", ")} />
        </div>
      </div>

      <div id="lesson-examples" className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle icon={<Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-300" />} label="Real-time examples" muted />
            <span className="text-xs font-black text-slate-500 dark:text-slate-300">{content.realWorldExamples.length} examples</span>
          </div>
          <div className="mt-3 grid gap-2">
            {content.realWorldExamples.map((example, index) => (
              <article key={example} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-amber-200 hover:bg-amber-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-amber-300/10">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800 dark:bg-amber-300/15 dark:text-amber-100">{index + 1}</span>
                <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{example}</p>
              </article>
            ))}
          </div>
          <ul className="mt-3 space-y-2">
            {content.keyIdeas.map((idea, index) => <li key={idea} className="flex gap-2 rounded-xl bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-700 dark:bg-white/10 dark:text-slate-200"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-600" /><span><strong>Idea {index + 1}:</strong> {idea}</span></li>)}
          </ul>
        </section>

        <div className="space-y-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <SectionTitle icon={<SlidersHorizontal className="h-4 w-4" />} label="Interact with controls" />
            <ol className="mt-3 space-y-2">
              {content.controlGuide.map((step, index) => <li key={step} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-100">{index + 1}</span><span>{step}</span></li>)}
            </ol>
            <div className="mt-3 rounded-xl border border-dashed border-cyan-200 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100"><Keyboard className="mr-1 inline h-3.5 w-3.5" />{lesson.contract.keyboardAlternative}</div>
          </section>
          <section id="lesson-formulas" className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <SectionTitle icon={<Sigma className="h-4 w-4" />} label="Formulas" />
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300">{content.formulas.length} related</span>
            </div>
            <div className="mt-3 space-y-2">
              {content.formulas.map((item, index) => (
                <article key={`${item.label}-${item.expression}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black text-slate-700 dark:text-slate-100">{item.label}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-500 dark:bg-slate-900 dark:text-slate-300">F{index + 1}</span>
                  </div>
                  <div className="mt-2 overflow-x-auto rounded-lg bg-white px-2 py-2 font-semibold dark:bg-slate-900"><MathExpression value={item.expression} /></div>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{item.explanation}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <details id="lesson-know-more" className="group rounded-xl border border-violet-200 bg-violet-50/70 p-2 dark:border-violet-300/20 dark:bg-violet-300/10">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-black text-violet-900 transition hover:bg-white/70 dark:text-violet-100 dark:hover:bg-white/10">
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" />Know more</span>
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="grid gap-2 px-2 pb-2 pt-1 sm:grid-cols-2">
          {content.knowMore.map((item) => <p key={item} className="rounded-lg bg-white/85 p-3 text-sm font-semibold leading-6 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">{item}</p>)}
        </div>
      </details>
    </section>
  );
}

function StageCoach({ lesson, progress, interacted, completedChecks, totalChecks }: { lesson: LessonDefinition; progress: LessonProgress; interacted: boolean; completedChecks: number; totalChecks: number }) {
  const checks = [
    { label: "Prediction recorded", done: Boolean(progress.prediction.trim()) },
    { label: "Live model used", done: interacted },
    { label: "Challenge answer typed", done: Boolean(progress.answer.trim()) },
    { label: "Lesson checked", done: progress.completed },
  ];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white"><ListChecks className="h-4 w-4 text-cyan-600" />Lesson checklist</div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{completedChecks}/{totalChecks}</span>
      </div>
      <div className="mt-3 space-y-2">
        {checks.map((item) => <div key={item.label} className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{item.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-400" />}{item.label}</div>)}
      </div>
      <div className="mt-3 grid gap-2">
        <Tag icon={<Eye className="h-3.5 w-3.5" />} label={lesson.contract.observableOutputs[0]} />
        <Tag icon={<Keyboard className="h-3.5 w-3.5" />} label="Keyboard supported" />
      </div>
    </section>
  );
}

function PredictionPanel({ value, onChange, onContinue }: { value: string; onChange: (value: string) => void; onContinue: () => void }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wide text-cyan-600">Discover</p>
      <h2 className="mt-1 text-lg font-black">Predict first</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">What do you expect to change when you use the main control?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {predictionStarters.map((starter) => <button key={starter} type="button" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-bold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-300" onClick={() => onChange(starter)}>{starter}</button>)}
      </div>
      <textarea aria-label="Lesson prediction" className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" value={value} onChange={(event) => onChange(event.target.value)} placeholder="I predict..." />
      <div className="mt-1 flex items-center justify-between text-xs font-bold text-slate-500"><span>{value.trim() ? "Prediction ready" : "Add one sentence to unlock Explore"}</span><span>{value.length}/240</span></div>
      <button type="button" className="action-primary mt-3 w-full justify-center" disabled={!value.trim()} onClick={onContinue}>Record prediction</button>
    </div>
  );
}

function ExplorePanel({ lesson, interacted, onContinue }: { lesson: LessonDefinition; interacted: boolean; onContinue: () => void }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wide text-cyan-600">Explore</p>
      <h2 className="mt-1 text-lg font-black">Change and observe</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lesson.description}</p>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-100 p-3 text-sm font-bold dark:bg-white/10">{interacted ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5 text-slate-400" />}{interacted ? "Interaction recorded" : "Use a control on the live model"}</div>
      <div className="mt-3 grid gap-2">
        {lesson.contract.requiredInteractionVerbs.map((verb) => <Tag key={verb} icon={<MousePointer2 className="h-3.5 w-3.5" />} label={verb} />)}
      </div>
      <button type="button" className="action-primary mt-3 w-full justify-center" disabled={!interacted} onClick={onContinue}>Try a challenge</button>
    </div>
  );
}

function ChallengePanel({ prompt, hint, answer, feedback, completed, onAnswer, onCheck }: { prompt: string; hint: string; answer: string; feedback: string; completed: boolean; onAnswer: (value: string) => void; onCheck: () => void }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-wide text-cyan-600">{completed ? "Check complete" : "Try"}</p>
      <h2 className="mt-1 text-lg font-black">{prompt}</h2>
      <input className="mt-3 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm dark:border-white/10 dark:bg-slate-900" value={answer} onChange={(event) => onAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") onCheck(); }} aria-label="Challenge answer" />
      <div className="mt-1 flex items-center justify-between text-xs font-bold text-slate-500"><span>{answer.trim() ? "Answer ready to check" : "Use the visual before answering"}</span><span>Enter submits</span></div>
      <button type="button" className="action-primary mt-3 w-full justify-center" onClick={onCheck}>Check answer</button>
      <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/10">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-200"><HelpCircle className="h-4 w-4 text-cyan-600" />Hint</summary>
        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-300">{hint}</p>
      </details>
      {feedback ? <p className={completed ? "mt-3 rounded-xl bg-emerald-100 p-3 text-sm font-bold text-emerald-900" : "mt-3 rounded-xl bg-amber-100 p-3 text-sm font-bold text-amber-900"} role="status">{feedback}</p> : null}
    </div>
  );
}

function QuickAnchorBar() {
  const anchors = [
    { href: "#lesson-live", label: "Live", icon: <MousePointer2 className="h-3.5 w-3.5" /> },
    { href: "#lesson-explain", label: "Explain", icon: <NotebookText className="h-3.5 w-3.5" /> },
    { href: "#lesson-examples", label: "Examples", icon: <Lightbulb className="h-3.5 w-3.5" /> },
    { href: "#lesson-formulas", label: "Formulas", icon: <Sigma className="h-3.5 w-3.5" /> },
    { href: "#lesson-know-more", label: "Know more", icon: <Sparkles className="h-3.5 w-3.5" /> },
  ];
  return (
    <nav className="mobile-safe-scroll flex gap-2 rounded-2xl border border-slate-200 bg-white/85 p-2 shadow-sm dark:border-white/10 dark:bg-slate-950/70" aria-label="Lesson quick links">
      {anchors.map((anchor) => <a key={anchor.href} href={anchor.href} className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-black text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-300/10 dark:hover:text-cyan-100">{anchor.icon}{anchor.label}</a>)}
    </nav>
  );
}

function SectionTitle({ icon, label, muted = false }: { icon: ReactNode; label: string; muted?: boolean }) {
  return <div className="flex items-center gap-2">{icon}<h2 className={muted ? "text-sm font-black uppercase tracking-wide text-slate-700 dark:text-slate-200" : "text-sm font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300"}>{label}</h2></div>;
}

function InfoChip({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">{icon}{label}</span>;
}

function StatusPill({ active, activeText, idleText }: { active: boolean; activeText: string; idleText: string }) {
  return <span className={active ? "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100" : "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"}>{active ? activeText : idleText}</span>;
}

function MiniMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">{icon}{label}</div><p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">{value}</p></div>;
}

function Tag({ icon, label }: { icon: ReactNode; label: string }) {
  return <span className="inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">{icon}{label}</span>;
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
