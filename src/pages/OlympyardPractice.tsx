import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock, Filter, Gauge, Layers3, Route, ShieldCheck, Target, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { OlympyardChallengeCard } from "../components/olympyard/OlympyardQuestionRenderer";
import { type OlympyardQuestion, type OlympyardValidationResult } from "../data/olympyardQuestions";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  olympyardDifficulties,
  olympyardGradeBands,
  olympyardTopicById,
  type OlympyardDifficulty,
  type OlympyardGradeBand,
} from "../data/olympyardTopics";
import {
  initialOlympyardProgress,
  normalizeOlympyardProgress,
  OLYMPYARD_PROGRESS_STORAGE_KEY,
  selectOlympyardQuestions,
  summarizeOlympyardSession,
  updateOlympyardProgress,
  type OlympyardAttemptRecord,
  type OlympyardProgress,
} from "../data/olympyardProgress";

export default function OlympyardPractice() {
  const { topicId } = useParams();
  const topic = olympyardTopicById(topicId);
  const [grade, setGrade] = useLocalStorage<"all" | OlympyardGradeBand>("math-universe-olympyard-grade", "all");
  const [difficulty, setDifficulty] = useLocalStorage<"all" | OlympyardDifficulty>("math-universe-olympyard-difficulty", "all");
  const [progress, setProgress] = useLocalStorage<OlympyardProgress>(OLYMPYARD_PROGRESS_STORAGE_KEY, initialOlympyardProgress);
  const [sessionAttempts, setSessionAttempts] = useState<Record<string, OlympyardAttemptRecord>>({});
  const safeProgress = normalizeOlympyardProgress(progress);
  const topicQuestions = useMemo(() => selectOlympyardQuestions({ mode: "topic", topicId, grade: "all", difficulty: "all" }), [topicId]);
  const questions = useMemo(() => selectOlympyardQuestions({ mode: "topic", topicId, grade, difficulty }), [topicId, grade, difficulty]);
  const summary = summarizeOlympyardSession(sessionAttempts, questions);

  function recordAttempt(question: OlympyardQuestion, result: OlympyardValidationResult) {
    const attempt = { questionId: question.id, topicId: question.topicId, correct: result.correct };
    setSessionAttempts((current) => ({ ...current, [question.id]: attempt }));
    setProgress((current) => updateOlympyardProgress(current, [attempt], {
      lastTopicId: question.topicId,
      sessionLabel: `${topic?.title ?? "Topic"} Practice`,
    }));
  }

  return (
    <div className="space-y-5">
      <TopicHeader
        title={topic ? `${topic.title} Practice` : "Olympyard Sample Practice"}
        subtitle="Topic practice with local progress, session score, hints, and solution review"
        difficulty="Phase 4"
        estimatedMinutes={12}
        formula={{
          title: "Topic Practice",
          formula: "try -> hint -> check -> solution",
          explanation: "Attempts update browser-local progress. Hints and solutions stay available with no timer pressure.",
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Link to="/olympyard" className="action-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Topic Map
        </Link>
        {topic?.route ? (
          <Link to={topic.route} className="tool-button">
            <Route className="h-4 w-4" />
            Open Related Lab
          </Link>
        ) : null}
        <Link to="/olympyard/mock-test" className="action-primary">
          <Gauge className="h-4 w-4" />
          Open Mock Test
        </Link>
      </div>

      <SectionCard
        title="Question Filters"
        description="Filters use browser-local Olympyard settings. Timers are not required in topic practice."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
              <Filter className="h-4 w-4 text-cyan-600" />
              Grade / class
            </span>
            <select
              aria-label="Practice grade / class"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-950"
              value={grade}
              onChange={(event) => setGrade(event.target.value as "all" | OlympyardGradeBand)}
            >
              {olympyardGradeBands.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
              <Target className="h-4 w-4 text-violet-600" />
              Difficulty
            </span>
            <select
              aria-label="Practice difficulty"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-950"
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as "all" | OlympyardDifficulty)}
            >
              {olympyardDifficulties.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <StatusTile icon={BookOpenCheck} label="Questions shown" value={`${questions.length} of ${topicQuestions.length}`} />
          <StatusTile icon={Trophy} label="Question types" value={Array.from(new Set(questions.map((question) => question.type))).join(", ")} />
          <StatusTile icon={CheckCircle2} label="Session score" value={`${summary.score}/${summary.attempted || questions.length}`} />
          <StatusTile icon={Clock} label="All-time accuracy" value={`${safeProgress.attempted ? Math.round((safeProgress.correct / safeProgress.attempted) * 100) : 0}%`} />
        </div>
      </SectionCard>

      <SectionCard title="Practice Modes" description="Use the route that matches today: slow topic learning, mixed practice, weak areas, speed, or mock test.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <ModeLink to="/olympyard/mock-test?mode=adaptive" icon={ShieldCheck} title="Adaptive Spine" body="Let local mastery choose what comes next." />
          <ModeLink to={topic ? `/olympyard/practice/${topic.id}` : "/olympyard"} icon={Target} title="Topic Practice" body="Focused, untimed practice for one topic." />
          <ModeLink to="/olympyard/mock-test?mode=mixed" icon={Layers3} title="Mixed Practice" body="Interleaved topics without strict pressure." />
          <ModeLink to="/olympyard/mock-test?mode=weak" icon={Route} title="Weak Area Practice" body="Uses local progress to choose lower-accuracy topics." />
          <ModeLink to="/olympyard/mock-test?mode=speed&timer=1" icon={Gauge} title="Speed Round" body="Shorter questions with an optional timer." />
        </div>
      </SectionCard>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <OlympyardChallengeCard key={question.id} question={question} index={index} total={questions.length} onAttempt={recordAttempt} />
        ))}
      </div>
    </div>
  );
}

function ModeLink({ to, icon: Icon, title, body }: { to: string; icon: typeof Trophy; title: string; body: string }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:border-white/10 dark:bg-white/5">
      <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-200" />
      <p className="mt-3 text-sm font-black">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{body}</p>
    </Link>
  );
}

function StatusTile({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
      <p className="mt-2 text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black capitalize">{value}</p>
    </div>
  );
}
