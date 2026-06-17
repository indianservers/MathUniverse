import { ArrowLeft, BarChart3, CheckCircle2, Clock, Filter, Gauge, ListRestart, RotateCcw, SkipForward, Target, Trophy, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { OlympyardChallengeCard, OlympyardSolutionReveal } from "../components/olympyard/OlympyardQuestionRenderer";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { type OlympyardQuestion, type OlympyardValidationResult } from "../data/olympyardQuestions";
import {
  olympyardDifficulties,
  olympyardGradeBands,
  type OlympyardDifficulty,
  type OlympyardGradeBand,
} from "../data/olympyardTopics";
import {
  formatOlympyardTime,
  initialOlympyardProgress,
  normalizeOlympyardProgress,
  OLYMPYARD_PROGRESS_STORAGE_KEY,
  selectOlympyardQuestions,
  summarizeOlympyardSession,
  updateOlympyardProgress,
  type OlympyardAttemptRecord,
  type OlympyardProgress,
  type OlympyardSessionMode,
} from "../data/olympyardProgress";
import { useLocalStorage } from "../hooks/useLocalStorage";

const questionCounts = [10, 20, 30] as const;

export default function OlympyardMockTest() {
  const [params] = useSearchParams();
  const initialMode = readMode(params.get("mode"));
  const [grade, setGrade] = useLocalStorage<"all" | OlympyardGradeBand>("math-universe-olympyard-grade", "all");
  const [difficulty, setDifficulty] = useLocalStorage<"all" | OlympyardDifficulty>("math-universe-olympyard-difficulty", "all");
  const [progress, setProgress] = useLocalStorage<OlympyardProgress>(OLYMPYARD_PROGRESS_STORAGE_KEY, initialOlympyardProgress);
  const [mode, setMode] = useState<OlympyardSessionMode>(initialMode);
  const [questionCount, setQuestionCount] = useState<(typeof questionCounts)[number]>(10);
  const [timerEnabled, setTimerEnabled] = useState(params.get("timer") === "1");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, OlympyardAttemptRecord>>({});
  const safeProgress = normalizeOlympyardProgress(progress);

  const questions = useMemo(() => selectOlympyardQuestions({
    mode,
    grade,
    difficulty,
    questionCount,
  }, safeProgress), [difficulty, grade, mode, questionCount, safeProgress]);
  const currentQuestion = questions[currentIndex];
  const summary = summarizeOlympyardSession(attempts, questions, elapsedSeconds);
  const remainingSeconds = Math.max(0, questionCount * 60 - elapsedSeconds);

  useEffect(() => {
    if (!started || finished || !timerEnabled) return undefined;
    const id = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(id);
  }, [finished, started, timerEnabled]);

  useEffect(() => {
    if (timerEnabled && started && !finished && remainingSeconds <= 0) finishSession();
  });

  function startSession() {
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setAttempts({});
  }

  function recordAttempt(question: OlympyardQuestion, result: OlympyardValidationResult) {
    setAttempts((current) => ({
      ...current,
      [question.id]: { questionId: question.id, topicId: question.topicId, correct: result.correct },
    }));
  }

  function skipQuestion() {
    setCurrentIndex((index) => Math.min(index + 1, Math.max(0, questions.length - 1)));
  }

  function finishSession() {
    const nextSummary = summarizeOlympyardSession(attempts, questions, elapsedSeconds);
    setFinished(true);
    setProgress((current) => updateOlympyardProgress(current, Object.values(attempts), {
      lastTopicId: nextSummary.recommendedTopics[0]?.topicId ?? "mixed-mock-test",
      sessionLabel: modeLabel(mode),
      mockResult: {
        mode,
        score: nextSummary.score,
        total: nextSummary.total,
        accuracy: nextSummary.accuracy,
      },
    }));
  }

  function retryIncorrect() {
    const incorrect = summary.incorrectQuestions;
    if (!incorrect.length) return;
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setAttempts({});
    setMode("weak");
  }

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Olympyard Mock Test"
        subtitle="Mixed practice, speed rounds, weak-area review, and browser-local score history"
        difficulty={timerEnabled ? "Optional timer on" : "Timer off"}
        estimatedMinutes={questionCount}
        formula={{
          title: modeLabel(mode),
          formula: "select -> solve -> skip/review -> retry",
          explanation: "The timer is optional. Every task remains answerable by keyboard, click, or typed input.",
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Link to="/olympyard" className="action-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Olympyard
        </Link>
        <Link to="/olympyard/practice/number-sense" className="tool-button">
          <Target className="h-4 w-4" />
          Topic Practice
        </Link>
      </div>

      {!started ? (
        <SetupPanel
          grade={grade}
          difficulty={difficulty}
          mode={mode}
          questionCount={questionCount}
          timerEnabled={timerEnabled}
          progress={safeProgress}
          onGrade={setGrade}
          onDifficulty={setDifficulty}
          onMode={setMode}
          onQuestionCount={setQuestionCount}
          onTimer={setTimerEnabled}
          onStart={startSession}
        />
      ) : null}

      {started && !finished && currentQuestion ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="text-xs font-black uppercase text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
                <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{modeLabel(mode)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="tool-button" onClick={skipQuestion}>
                  <SkipForward className="h-4 w-4" />
                  Skip
                </button>
                <button type="button" className="action-primary" onClick={finishSession}>
                  Finish & Review
                </button>
              </div>
            </div>
            <OlympyardChallengeCard
              key={currentQuestion.id}
              question={currentQuestion}
              index={currentIndex}
              total={questions.length}
              onAttempt={recordAttempt}
            />
            <div className="flex flex-wrap justify-between gap-2">
              <button type="button" className="action-secondary" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0}>
                Previous
              </button>
              <button type="button" className="action-primary" onClick={() => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))} disabled={currentIndex >= questions.length - 1}>
                Next
              </button>
            </div>
          </div>
          <SessionSidePanel summary={summary} timerEnabled={timerEnabled} elapsedSeconds={elapsedSeconds} remainingSeconds={remainingSeconds} progress={safeProgress} />
        </section>
      ) : null}

      {finished ? (
        <ResultScreen
          summary={summary}
          questions={questions}
          attempts={attempts}
          elapsedSeconds={elapsedSeconds}
          onRestart={startSession}
          onRetryIncorrect={retryIncorrect}
        />
      ) : null}
    </div>
  );
}

function SetupPanel(props: {
  grade: "all" | OlympyardGradeBand;
  difficulty: "all" | OlympyardDifficulty;
  mode: OlympyardSessionMode;
  questionCount: 10 | 20 | 30;
  timerEnabled: boolean;
  progress: OlympyardProgress;
  onGrade: (value: "all" | OlympyardGradeBand) => void;
  onDifficulty: (value: "all" | OlympyardDifficulty) => void;
  onMode: (value: OlympyardSessionMode) => void;
  onQuestionCount: (value: 10 | 20 | 30) => void;
  onTimer: (value: boolean) => void;
  onStart: () => void;
}) {
  return (
    <SectionCard title="Mock Test Setup" description="Choose a mode. Timer is optional and can stay off for beginners.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SelectField label="Practice mode" icon={Gauge} value={props.mode} onChange={(value) => props.onMode(readMode(value))}>
          <option value="adaptive">Adaptive Spine</option>
          <option value="mock">Mock Test</option>
          <option value="mixed">Mixed Practice</option>
          <option value="weak">Weak Area Practice</option>
          <option value="speed">Speed Round</option>
        </SelectField>
        <SelectField label="Grade band" icon={Filter} value={props.grade} onChange={(value) => props.onGrade(value as "all" | OlympyardGradeBand)}>
          {olympyardGradeBands.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </SelectField>
        <SelectField label="Difficulty" icon={Target} value={props.difficulty} onChange={(value) => props.onDifficulty(value as "all" | OlympyardDifficulty)}>
          {olympyardDifficulties.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </SelectField>
        <SelectField label="Question count" icon={BarChart3} value={String(props.questionCount)} onChange={(value) => props.onQuestionCount(Number(value) as 10 | 20 | 30)}>
          {questionCounts.map((count) => <option key={count} value={count}>{count} questions</option>)}
        </SelectField>
        <label className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
            <Clock className="h-4 w-4 text-cyan-600" />
            Timer
          </span>
          <span className="mt-3 flex min-h-11 items-center gap-3">
            <input type="checkbox" checked={props.timerEnabled} onChange={(event) => props.onTimer(event.target.checked)} />
            <span className="text-sm font-bold">{props.timerEnabled ? "Enabled" : "Disabled"}</span>
          </span>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-cyan-50 p-4 dark:bg-cyan-400/10">
        <p className="text-sm font-bold text-cyan-950 dark:text-cyan-50">
          Local progress: {props.progress.correct}/{props.progress.attempted || 0} correct, streak {props.progress.streak}. Badges: {props.progress.badges.length || "none yet"}.
        </p>
        <button type="button" className="action-primary" onClick={props.onStart}>
          Start Session
        </button>
      </div>
    </SectionCard>
  );
}

function SelectField({ label, icon: Icon, value, onChange, children }: {
  label: string;
  icon: typeof Trophy;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
        <Icon className="h-4 w-4 text-cyan-600" />
        {label}
      </span>
      <select
        aria-label={label}
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-950"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}

function SessionSidePanel({ summary, timerEnabled, elapsedSeconds, remainingSeconds, progress }: {
  summary: ReturnType<typeof summarizeOlympyardSession>;
  timerEnabled: boolean;
  elapsedSeconds: number;
  remainingSeconds: number;
  progress: OlympyardProgress;
}) {
  return (
    <aside className="space-y-3">
      <SectionCard title="Session" description="Live score and pacing.">
        <div className="grid grid-cols-2 gap-3">
          <Metric icon={CheckCircle2} label="Score" value={`${summary.score}/${summary.attempted}`} />
          <Metric icon={Trophy} label="Accuracy" value={`${summary.accuracy}%`} />
          <Metric icon={Clock} label={timerEnabled ? "Remaining" : "Elapsed"} value={formatOlympyardTime(timerEnabled ? remainingSeconds : elapsedSeconds)} />
          <Metric icon={Gauge} label="Streak" value={String(progress.streak)} />
        </div>
      </SectionCard>
    </aside>
  );
}

function ResultScreen({ summary, questions, attempts, elapsedSeconds, onRestart, onRetryIncorrect }: {
  summary: ReturnType<typeof summarizeOlympyardSession>;
  questions: OlympyardQuestion[];
  attempts: Record<string, OlympyardAttemptRecord>;
  elapsedSeconds: number;
  onRestart: () => void;
  onRetryIncorrect: () => void;
}) {
  return (
    <div className="space-y-4">
      <SectionCard title="Score Summary" description="Review what worked, what needs practice, and the exact solution path.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={Trophy} label="Score" value={`${summary.score}/${summary.total}`} />
          <Metric icon={CheckCircle2} label="Accuracy" value={`${summary.accuracy}%`} />
          <Metric icon={Clock} label="Time taken" value={formatOlympyardTime(elapsedSeconds)} />
          <Metric icon={XCircle} label="Incorrect" value={String(summary.incorrectQuestions.length)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="action-primary" onClick={onRestart}>
            <RotateCcw className="h-4 w-4" />
            Restart
          </button>
          <button type="button" className="action-secondary" onClick={onRetryIncorrect} disabled={!summary.incorrectQuestions.length}>
            <ListRestart className="h-4 w-4" />
            Retry Incorrect
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Topic Breakdown" description="Accuracy is shown with text, not color alone.">
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(summary.topicBreakdown).map(([topicId, item]) => {
            const accuracy = item.attempted ? Math.round((item.correct / item.attempted) * 100) : 0;
            return (
              <div key={topicId} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
                <p className="font-black">{item.title}</p>
                <p className="mt-1 text-sm font-semibold">{item.correct}/{item.attempted} correct, {accuracy}% accuracy</p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {summary.recommendedTopics.length ? (
        <SectionCard title="Recommended Next Topics" description="Based on this session's lower-accuracy areas.">
          <div className="flex flex-wrap gap-2">
            {summary.recommendedTopics.map((topic) => (
              <Link key={topic.topicId} to={`/olympyard/practice/${topic.topicId}`} className="action-secondary">
                {topic.title} ({topic.accuracy}%)
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Solution Review" description="Incorrect and skipped questions stay reviewable.">
        <div className="space-y-3">
          {questions.map((question, index) => {
            const attempt = attempts[question.id];
            return (
              <details key={question.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <summary className="cursor-pointer text-sm font-black">
                  {index + 1}. {question.title} - {attempt ? (attempt.correct ? "correct" : "incorrect") : "skipped"}
                </summary>
                <p className="mt-3 text-sm font-semibold leading-6">{question.prompt}</p>
                <OlympyardSolutionReveal question={question} />
              </details>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
      <p className="mt-2 text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function readMode(value: string | null): OlympyardSessionMode {
  if (value === "adaptive" || value === "mixed" || value === "weak" || value === "speed" || value === "mock") return value;
  return "mock";
}

function modeLabel(mode: OlympyardSessionMode) {
  if (mode === "adaptive") return "Adaptive Spine";
  if (mode === "mixed") return "Mixed Practice";
  if (mode === "weak") return "Weak Area Practice";
  if (mode === "speed") return "Speed Round";
  return "Mock Test";
}
