import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  CalendarClock,
  CheckCircle2,
  Filter,
  Flag,
  Gauge,
  Grid3X3,
  Hash,
  Layers3,
  LibraryBig,
  Map,
  PauseCircle,
  Play,
  RotateCcw,
  Route,
  ShieldCheck,
  Shapes,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { olympyardQuestionCount } from "../data/olympyardQuestions";
import {
  getWeakOlympyardTopics,
  initialOlympyardProgress,
  normalizeOlympyardProgress,
  OLYMPYARD_PROGRESS_STORAGE_KEY,
  summarizeOlympyardMastery,
  type OlympyardProgress,
} from "../data/olympyardProgress";
import { buildPracticeSpine } from "../data/olympyardPracticeSpine";
import {
  filterOlympyardTopics,
  olympyardDifficulties,
  olympyardGradeBands,
  olympyardTopicById,
  olympyardTopics,
  type OlympyardDifficulty,
  type OlympyardGradeBand,
  type OlympyardMode,
  type OlympyardTopic,
} from "../data/olympyardTopics";

const topicIcons: Record<string, typeof Hash> = {
  "number-sense": Hash,
  "arithmetic-tricks": Sparkles,
  "fractions-decimals": Layers3,
  "ratios-proportions": Route,
  "patterns-sequences": Grid3X3,
  "logical-reasoning": BrainCircuit,
  "number-theory": Hash,
  "divisibility-rules": CheckCircle2,
  "factors-multiples": Grid3X3,
  "geometry-reasoning": Shapes,
  "area-perimeter": Shapes,
  "counting-combinatorics": Map,
  "probability-puzzles": Gauge,
  "data-interpretation": BarChart3,
  "clock-calendar": CalendarClock,
  "algebraic-thinking": BrainCircuit,
  "word-problems": LibraryBig,
  "mixed-mock-test": Trophy,
};

export default function Olympyard() {
  const [grade, setGrade] = useLocalStorage<"all" | OlympyardGradeBand>("math-universe-olympyard-grade", "all");
  const [difficulty, setDifficulty] = useLocalStorage<"all" | OlympyardDifficulty>("math-universe-olympyard-difficulty", "all");
  const [mode, setMode] = useLocalStorage<OlympyardMode>("math-universe-olympyard-mode", "beginner");
  const [progress, setProgress] = useLocalStorage<OlympyardProgress>(OLYMPYARD_PROGRESS_STORAGE_KEY, initialOlympyardProgress);

  const safeProgress = normalizeOlympyardProgress(progress);
  const visibleTopics = filterOlympyardTopics(olympyardTopicsSorted(), grade, difficulty);
  const lastTopic = olympyardTopicById(safeProgress.lastTopicId);
  const practiceSpine = buildPracticeSpine(safeProgress);
  const mastery = summarizeOlympyardMastery(safeProgress);

  function rememberTopic(topicId: string) {
    setProgress((current) => ({
      ...normalizeOlympyardProgress(current),
      lastTopicId: topicId,
    }));
  }

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Olympyard"
        subtitle="Olympiad-style visual maths practice"
        difficulty={mode === "beginner" ? "Visual-first" : "Olympiad Mode"}
        estimatedMinutes={25}
        formula={{
          title: "Training loop",
          formula: "see -> think -> check -> learn -> retry",
          explanation: "Topic practice, mixed practice, speed rounds, mock tests, and local progress all stay in this browser.",
        }}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase text-cyan-700 dark:text-cyan-200">Contest garden</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Choose a track, then build speed with visual reasoning.</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Olympyard now powers the app-wide practice spine: learn in any lab, return here for adaptive practice, then review weak areas with hints and solution trails.
              </p>
            </div>
            <OlympyardModeToggle mode={mode} onMode={setMode} />
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <OlympyardGradeSelector value={grade} onChange={setGrade} />
            <OlympyardDifficultySelector value={difficulty} onChange={setDifficulty} mode={mode} />
          </div>
        </div>

        <OlympyardProgressSummary progress={safeProgress} lastTopic={lastTopic} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ContinuePracticeCard lastTopic={lastTopic} mode={mode} onRemember={rememberTopic} />
        <MockTestEntry mode={mode} progress={safeProgress} onRemember={() => rememberTopic("mixed-mock-test")} />
      </section>

      <PracticeSpinePanel spine={practiceSpine} mastery={mastery} />

      <PracticeModeGrid progress={safeProgress} />

      <OlympyardTopicMap topics={visibleTopics} progress={safeProgress} mode={mode} onRemember={rememberTopic} />
    </div>
  );
}

function OlympyardModeToggle({ mode, onMode }: { mode: OlympyardMode; onMode: (mode: OlympyardMode) => void }) {
  return (
    <div aria-label="Olympyard mode" className="flex w-full max-w-md rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
      <button
        type="button"
        aria-pressed={mode === "beginner"}
        className={mode === "beginner" ? "action-primary min-h-11 flex-1 justify-center" : "tool-button min-h-11 flex-1 justify-center"}
        onClick={() => onMode("beginner")}
      >
        <PauseCircle className="h-4 w-4" />
        Beginner
      </button>
      <button
        type="button"
        aria-pressed={mode === "olympiad"}
        className={mode === "olympiad" ? "action-primary min-h-11 flex-1 justify-center" : "tool-button min-h-11 flex-1 justify-center"}
        onClick={() => onMode("olympiad")}
      >
        <Flag className="h-4 w-4" />
        Olympiad
      </button>
    </div>
  );
}

function OlympyardGradeSelector({ value, onChange }: { value: "all" | OlympyardGradeBand; onChange: (value: "all" | OlympyardGradeBand) => void }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
        <Filter className="h-4 w-4 text-cyan-600" />
        Grade / class
      </span>
      <select
        aria-label="Grade / class"
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-950"
        value={value}
        onChange={(event) => onChange(event.target.value as "all" | OlympyardGradeBand)}
      >
        {olympyardGradeBands.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </label>
  );
}

function OlympyardDifficultySelector({ value, onChange, mode }: { value: "all" | OlympyardDifficulty; onChange: (value: "all" | OlympyardDifficulty) => void; mode: OlympyardMode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
        <Target className="h-4 w-4 text-violet-600" />
        Difficulty
      </span>
      <select
        aria-label="Difficulty"
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold dark:border-white/10 dark:bg-slate-950"
        value={value}
        onChange={(event) => onChange(event.target.value as "all" | OlympyardDifficulty)}
      >
        {olympyardDifficultiesForMode(mode).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </label>
  );
}

function OlympyardProgressSummary({ progress, lastTopic }: { progress: OlympyardProgress; lastTopic?: OlympyardTopic }) {
  const accuracy = progress.attempted ? Math.round((progress.correct / progress.attempted) * 100) : 0;
  const weakTopics = getWeakOlympyardTopics(progress);
  return (
    <SectionCard title="Local Progress" description="Browser-only foundation for Olympyard practice.">
      <div className="grid grid-cols-2 gap-3">
        <ProgressMetric icon={Target} label="Attempted" value={String(progress.attempted)} />
        <ProgressMetric icon={CheckCircle2} label="Correct" value={String(progress.correct)} />
        <ProgressMetric icon={BadgeCheck} label="Accuracy" value={`${accuracy}%`} />
        <ProgressMetric icon={Trophy} label="Streak" value={String(progress.streak)} />
      </div>
      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-slate-500">Last topic</p>
        <p className="mt-1 text-sm font-bold">{lastTopic?.title ?? "Not started yet"}</p>
      </div>
      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-slate-500">Weak topics</p>
        <p className="mt-1 text-sm font-bold">{weakTopics.length ? weakTopics.map((topic) => olympyardTopicById(topic.topicId)?.title ?? topic.topicId).join(", ") : "None yet"}</p>
      </div>
      {progress.badges.length ? (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Local badges">
          {progress.badges.map((badge) => <span key={badge} className="mini-chip bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{badge}</span>)}
        </div>
      ) : null}
    </SectionCard>
  );
}

function ProgressMetric({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
      <p className="mt-2 text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function ContinuePracticeCard({ lastTopic, mode, onRemember }: { lastTopic?: OlympyardTopic; mode: OlympyardMode; onRemember: (topicId: string) => void }) {
  const target = lastTopic ?? olympyardTopics[0];
  return (
    <SectionCard title="Continue Practice" description={lastTopic ? "Resume the most recent Olympyard track." : "Start with a foundational visual track."}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-lg font-black">{target.title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{mode === "beginner" ? "Visual-first, no timers by default." : "Tougher pacing, optional timer later."}</p>
        </div>
        <Link to={`/olympyard/practice/${target.id}`} className="action-primary" onClick={() => onRemember(target.id)}>
          Start Practice
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </SectionCard>
  );
}

function MockTestEntry({ mode, progress, onRemember }: { mode: OlympyardMode; progress: OlympyardProgress; onRemember: () => void }) {
  const lastScore = progress.mockHistory.at(-1);
  return (
    <SectionCard title="Mock Test Entry" description="Mixed contest practice with optional timer, skip, review, and retry incorrect.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-lg font-black">Mixed Review</p>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
            {lastScore ? `Last mock: ${lastScore.score}/${lastScore.total} (${lastScore.accuracy}%).` : mode === "beginner" ? "Preview mixed topics without pressure." : "Use speed-round filters with the optional timer."}
          </p>
        </div>
        <Link to="/olympyard/mock-test" className="action-secondary" onClick={onRemember}>
          Open Mock
          <Play className="h-4 w-4" />
        </Link>
      </div>
    </SectionCard>
  );
}

function PracticeModeGrid({ progress }: { progress: OlympyardProgress }) {
  const weakCount = getWeakOlympyardTopics(progress).length;
  return (
    <SectionCard title="Practice Modes" description="Choose a session style. Timers are optional and never required.">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <ModeCard to="/olympyard/mock-test?mode=adaptive" icon={ShieldCheck} title="Adaptive Spine" body="Balances weak, new, and building topics from local mastery." />
        <ModeCard to="/olympyard/practice/number-sense" icon={Target} title="Topic Practice" body="Focused practice inside one topic." />
        <ModeCard to="/olympyard/mock-test?mode=mixed" icon={Grid3X3} title="Mixed Practice" body="Interleaved questions from many topics." />
        <ModeCard to="/olympyard/mock-test?mode=weak" icon={RotateCcw} title="Weak Area Practice" body={weakCount ? `${weakCount} weaker topic(s) detected.` : "Starts broad until local data exists."} />
        <ModeCard to="/olympyard/mock-test?mode=speed&timer=1" icon={Gauge} title="Speed Round" body="Optional timer with short contest items." />
      </div>
    </SectionCard>
  );
}

function PracticeSpinePanel({ spine, mastery }: { spine: ReturnType<typeof buildPracticeSpine>; mastery: ReturnType<typeof summarizeOlympyardMastery> }) {
  return (
    <SectionCard title="Adaptive Practice Spine" description="One practice engine connects the full platform: topic labs, visual proofs, quizzes, mock tests, and weak-area review.">
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-xl bg-slate-100 p-4 dark:bg-white/10">
          <p className="text-xs font-black uppercase text-slate-500">Recommended now</p>
          <h2 className="mt-2 text-xl font-black">{spine.primaryTopic?.title ?? "Number Sense"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {mastery.hasPracticeSignal ? "Chosen from local mastery, weak areas, and under-sampled topics." : "Start here to seed the adaptive engine with a few answers."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to={spine.primaryPracticeRoute} className="action-primary">Practice next</Link>
            <Link to={spine.adaptiveRoute} className="action-secondary">Adaptive session</Link>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {spine.areaReadiness.map((area) => (
            <Link key={area.id} to={area.practiceRoute} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-black">{area.title}</h3>
                <span className="mini-chip capitalize">{area.state}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{area.description}</p>
              <p className="mt-3 text-xs font-black uppercase text-slate-500">{area.attempted ? `${area.accuracy}% local accuracy` : "No local signal yet"}</p>
            </Link>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function ModeCard({ to, icon: Icon, title, body }: { to: string; icon: typeof Target; title: string; body: string }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:border-white/10 dark:bg-white/5">
      <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-200" />
      <p className="mt-3 text-sm font-black">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{body}</p>
    </Link>
  );
}

function OlympyardTopicMap({ topics, progress, mode, onRemember }: { topics: OlympyardTopic[]; progress: OlympyardProgress; mode: OlympyardMode; onRemember: (topicId: string) => void }) {
  return (
    <section aria-labelledby="olympyard-topic-map" className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="olympyard-topic-map" className="text-2xl font-black">Topic Map</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{topics.length} tracks match the current filters.</p>
        </div>
        <span className="mini-chip">{mode === "beginner" ? "Beginner: visual-first, timers off" : "Olympiad: tougher, fewer hints first"}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <OlympyardTopicCard
            key={topic.id}
            topic={topic}
            active={progress.lastTopicId === topic.id}
            onRemember={onRemember}
          />
        ))}
      </div>
    </section>
  );
}

function OlympyardTopicCard({ topic, active, onRemember }: { topic: OlympyardTopic; active: boolean; onRemember: (topicId: string) => void }) {
  const Icon = topicIcons[topic.id] ?? Sparkles;
  return (
    <article className={`flex min-h-[280px] flex-col rounded-2xl border bg-white/85 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0 dark:bg-white/5 ${active ? "border-cyan-400 ring-2 ring-cyan-200 dark:ring-cyan-400/30" : "border-slate-200 dark:border-white/10"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-950 text-cyan-200 dark:bg-white/10">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-200">
          {olympyardQuestionCount(topic.id)} questions
        </span>
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">{topic.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{topic.description}</p>
      <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-slate-500">Visual model</p>
        <p className="mt-1 text-sm font-bold">{topic.visualModel}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {topic.gradeBands.map((band) => <span key={band} className="mini-chip">{gradeLabel(band)}</span>)}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {topic.difficultyRange.map((level) => <span key={level} className="mini-chip bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{difficultyLabel(level)}</span>)}
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <span className={active ? "text-xs font-black text-cyan-700 dark:text-cyan-200" : "text-xs font-bold text-slate-500"}>
          {active ? "Continue here" : "Ready"}
        </span>
        <Link to={`/olympyard/practice/${topic.id}`} className="action-primary min-h-10 px-3 py-2 text-sm" onClick={() => onRemember(topic.id)}>
          Start Practice
        </Link>
      </div>
    </article>
  );
}

function olympyardTopicsSorted() {
  return [...olympyardTopics].sort((left, right) => left.title.localeCompare(right.title));
}

function olympyardDifficultiesForMode(mode: OlympyardMode) {
  if (mode === "beginner") return olympyardDifficulties.filter((item) => !["advanced", "speed"].includes(item.id));
  return olympyardDifficulties;
}

function gradeLabel(value: OlympyardGradeBand) {
  return olympyardGradeBands.find((band) => band.id === value)?.label ?? value;
}

function difficultyLabel(value: OlympyardDifficulty) {
  return olympyardDifficulties.find((difficulty) => difficulty.id === value)?.label ?? value;
}
