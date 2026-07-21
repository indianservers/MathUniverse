import SectionCard from "../components/ui/SectionCard";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ApplicationVisualCard from "../components/ui/ApplicationVisualCard";
import TopicHeader from "../components/ui/TopicHeader";
import TopicProgressActions from "../components/ui/TopicProgressActions";
import TopicTabs from "../components/ui/TopicTabs";
import ConceptAccuracyPanel from "../components/ui/ConceptAccuracyPanel";
import ContinueCard from "../components/ui/ContinueCard";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import FormulaVisualizationAtlas from "../visualizations/formulas/FormulaVisualizationAtlas";
import CalculusConceptAtlas from "../visualizations/calculus/CalculusConceptAtlas";
import DerivativeSlopeVisualizer from "../visualizations/calculus/DerivativeSlopeVisualizer";
import IntegrationAreaVisualizer from "../visualizations/calculus/IntegrationAreaVisualizer";
import LimitsVisualizer from "../visualizations/calculus/LimitsVisualizer";
import MotionVisualizer from "../visualizations/calculus/MotionVisualizer";
import SeriesBlockAccumulation from "../visualizations/calculus/SeriesBlockAccumulation";
import CalculusFundamentalsProblems from "../visualizations/calculus/CalculusFundamentalsProblems";
import {
  Activity,
  BookOpenCheck,
  Calculator,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  FlaskConical,
  FunctionSquare,
  GraduationCap,
  Lightbulb,
  ListChecks,
  MoveRight,
  Orbit,
  Route,
  Search,
  Sigma,
  Sparkles,
  Target,
  TrendingUp,
  Waves,
} from "lucide-react";

type CalculusLevel = "All" | "Class 11" | "Class 12" | "JEE" | "Degree" | "Engineering";
type StudyMode = "Learn" | "Practice" | "Exam" | "Teach";
type CalculusPage = "overview" | "limits" | "derivatives" | "integrals" | "motion" | "practice" | "proof-problems" | "series-blocks" | "atlas" | "formulas" | "applications";

const calculusApplications = [
  { title: "Physics", visual: "physics", description: "Derivatives connect position, velocity, acceleration, and force." },
  { title: "Optimization", visual: "optimization", description: "Critical points reveal efficient designs and best operating ranges." },
  { title: "Economics", visual: "economics", description: "Marginal cost and revenue curves guide production decisions." },
  { title: "AI training", visual: "gradient-descent", description: "Gradients update model weights to reduce prediction error." },
  { title: "Engineering", visual: "engineering", description: "Integrals and rates model loads, flow, heat, and control response." },
] as const;

const quickLaunchers = [
  { title: "Limits Lab", route: "/math/limits-continuity", icon: Route, tag: "Continuity", level: "Class 11", note: "One-sided limits, holes, jumps, and asymptotes." },
  { title: "Derivative Pane", route: "/math/derivatives", icon: TrendingUp, tag: "Slope", level: "Class 12", note: "Tangent, secant, derivative graph, and rate." },
  { title: "Integration Pane", route: "/math/integration", icon: ChartNoAxesCombined, tag: "Area", level: "Class 12", note: "Riemann sums, signed area, and accumulation." },
  { title: "Slope Fields", route: "/math/slope-fields", icon: Waves, tag: "ODE", level: "Degree", note: "Direction fields and solution curves." },
  { title: "Functions", route: "/math/functions-graphs", icon: FunctionSquare, tag: "Graphs", level: "Class 11", note: "Domains, transforms, intercepts, and behavior." },
  { title: "Formula Visualizer", route: "/math/derivatives/formula-visualizer", icon: Sigma, tag: "Formulas", level: "JEE", note: "Derivative formula meanings and examples." },
  { title: "Integral Formulas", route: "/math/integration/formula-visualizer", icon: Sigma, tag: "Formulas", level: "Class 12", note: "Antiderivatives and definite integral rules." },
  { title: "Differential Equations", route: "/math/differential-equations/formula-visualizer", icon: Activity, tag: "ODE", level: "Engineering", note: "Growth, decay, logistic, and separable models." },
] as const;

const learningTracks = [
  { title: "Limits to continuity", level: "Class 11", minutes: 12, icon: Route, checkpoints: ["approach", "left/right", "hole", "jump"], route: "/calculus/limits" },
  { title: "Secant to tangent", level: "Class 12", minutes: 10, icon: TrendingUp, checkpoints: ["secant", "h -> 0", "slope", "derivative"], route: "/calculus/derivatives" },
  { title: "Derivative rules", level: "JEE", minutes: 14, icon: ListChecks, checkpoints: ["power", "product", "chain", "implicit"], route: "/math/derivatives/formula-visualizer" },
  { title: "Area to integral", level: "Class 12", minutes: 11, icon: ChartNoAxesCombined, checkpoints: ["rectangles", "signed area", "FTC", "average"], route: "/calculus/integrals" },
  { title: "Series approximation", level: "Degree", minutes: 16, icon: Orbit, checkpoints: ["sequence", "sum", "error", "Taylor"], route: "/calculus/series-blocks" },
  { title: "Differential models", level: "Engineering", minutes: 18, icon: Waves, checkpoints: ["slope field", "initial value", "growth", "stability"], route: "/math/slope-fields" },
] as const;

const calculusPages = [
  { id: "overview", label: "Start", route: "/calculus", icon: Sigma, description: "Fast launch" },
  { id: "limits", label: "Limits", route: "/calculus/limits", icon: Route, description: "Approach and continuity" },
  { id: "derivatives", label: "Derivatives", route: "/calculus/derivatives", icon: TrendingUp, description: "Slope and tangent" },
  { id: "integrals", label: "Integrals", route: "/calculus/integrals", icon: ChartNoAxesCombined, description: "Area and accumulation" },
  { id: "motion", label: "Motion", route: "/calculus/motion", icon: Activity, description: "Position, velocity, acceleration" },
  { id: "practice", label: "Practice", route: "/calculus/practice", icon: ListChecks, description: "Checks and readiness" },
  { id: "proof-problems", label: "Proofs", route: "/calculus/proof-problems", icon: Sparkles, description: "Fundamental problems" },
  { id: "series-blocks", label: "Series", route: "/calculus/series-blocks", icon: Orbit, description: "Accumulation blocks" },
  { id: "atlas", label: "Atlas", route: "/calculus/atlas", icon: BookOpenCheck, description: "Concept map" },
  { id: "formulas", label: "Formulas", route: "/calculus/formulas", icon: Sigma, description: "Formula visual atlas" },
  { id: "applications", label: "Uses", route: "/calculus/applications", icon: FlaskConical, description: "Real-world models" },
] satisfies Array<{ id: CalculusPage; label: string; route: string; icon: typeof Sigma; description: string }>;

const formulaEssentials = [
  { title: "Limit definition", math: "lim x->a f(x)=L", cue: "Approach, not necessarily equal at a." },
  { title: "Derivative from first principles", math: "f'(x)=lim h->0 [f(x+h)-f(x)]/h", cue: "Secant slope becomes tangent slope." },
  { title: "Power rule", math: "d/dx x^n = n x^(n-1)", cue: "Exponent comes down, power drops by one." },
  { title: "Chain rule", math: "d/dx f(g(x)) = f'(g(x))g'(x)", cue: "Outer rate times inner rate." },
  { title: "Definite integral", math: "integral_a^b f(x) dx", cue: "Signed accumulation over an interval." },
  { title: "FTC", math: "d/dx integral_a^x f(t)dt = f(x)", cue: "Accumulation and rate undo each other." },
] as const;

const misconceptionFixes = [
  { trap: "Limit equals f(a)", fix: "Only when the function is continuous at a." },
  { trap: "Derivative is always positive if graph is above x-axis", fix: "Derivative reads direction, not height." },
  { trap: "Integral always means area", fix: "Definite integral is signed area unless total area is requested." },
  { trap: "Critical point always means maximum", fix: "Use sign change or second derivative to classify." },
  { trap: "More rectangles always overestimate", fix: "Left/right estimates depend on increasing or decreasing behavior." },
  { trap: "A slope field gives one curve", fix: "It gives a family; an initial condition selects one." },
] as const;

const theoremCards = [
  { title: "Intermediate Value Theorem", when: "continuous on [a,b]", result: "all y-values between f(a) and f(b)" },
  { title: "Mean Value Theorem", when: "continuous on [a,b], differentiable inside", result: "one tangent matches average slope" },
  { title: "First Derivative Test", when: "f' changes sign", result: "classifies local max/min" },
  { title: "Second Derivative Test", when: "f'(c)=0 and f''(c) known", result: "concavity classifies turning point" },
  { title: "Fundamental Theorem", when: "continuous integrand", result: "area derivative equals original function" },
  { title: "Comparison Test", when: "positive series terms", result: "bounds decide convergence" },
] as const;

const practiceQueue = [
  "Predict left and right limits before moving the point.",
  "Shrink h and explain why the secant becomes tangent.",
  "Find where f'(x)=0, then classify using signs.",
  "Compare left, right, midpoint, and trapezoid area estimates.",
  "Match a motion graph to velocity and acceleration.",
  "Use an initial condition to choose one slope-field solution.",
] as const;

const examMoves = [
  { title: "Limit setup", cue: "Check direct substitution, factor/cancel, rationalize, then one-sided behavior." },
  { title: "Derivative setup", cue: "Identify outside function, inside function, and product/quotient structure before differentiating." },
  { title: "Optimization setup", cue: "Name the objective, write the constraint, reduce to one variable, then test critical points." },
  { title: "Area setup", cue: "Sketch top minus bottom or right minus left before integrating." },
  { title: "Motion setup", cue: "Position differentiates to velocity and acceleration; area under velocity gives displacement." },
  { title: "Series setup", cue: "Check term test first, then ratio/root/comparison depending on the expression shape." },
] as const;

export default function Calculus({ page = "overview" }: { page?: CalculusPage }) {
  const topic = topics.find((item) => item.id === "calculus")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [level, setLevel] = useState<CalculusLevel>("All");
  const [mode, setMode] = useState<StudyMode>("Learn");
  const [query, setQuery] = useState("");
  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);
  const progress = getTopicProgress(topic.id);
  const filteredLaunchers = useMemo(() => {
    const text = query.trim().toLowerCase();
    return quickLaunchers.filter((item) => {
      const levelMatch = level === "All" || item.level === level || (level === "JEE" && item.tag === "Formulas");
      const textMatch = !text || `${item.title} ${item.tag} ${item.note}`.toLowerCase().includes(text);
      return levelMatch && textMatch;
    });
  }, [level, query]);
  const filteredTracks = useMemo(() => learningTracks.filter((item) => level === "All" || item.level === level), [level]);
  const modeCopy = {
    Learn: "Build intuition in order: limit, slope, area, motion, then models.",
    Practice: "Use short prompts and visual checks before solving symbolically.",
    Exam: "Prioritize definitions, traps, derivative tests, area setup, and speed.",
    Teach: "Use prompts, misconceptions, and board-ready theorem cues.",
  } satisfies Record<StudyMode, string>;
  const activePage = calculusPages.find((item) => item.id === page) ?? calculusPages[0];
  const isOverview = activePage.id === "overview";
  return (
    <div className="desktop-page-shell" onPointerDown={() => markTopicInteracted(topic.id)}>
      <div className="desktop-page-header">
        <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      </div>
      <CalculusCommandBar level={level} mode={mode} query={query} onLevel={setLevel} onMode={setMode} onQuery={setQuery} />
      <CalculusPageNav activePage={activePage.id} />
      <div className={`desktop-tab-surface grid gap-3 ${isOverview ? "xl:grid-cols-[minmax(0,1fr)_280px]" : "xl:grid-cols-[minmax(0,1fr)_250px]"}`}>
        <div className="min-h-0 min-w-0 overflow-hidden">
          <CalculusPageContent page={activePage.id} level={level} mode={mode} modeNote={modeCopy[mode]} progress={progress} launchers={filteredLaunchers} tracks={filteredTracks} />
        </div>
        <aside className="desktop-sidebar-panel thin-scrollbar space-y-3 xl:sticky xl:top-3 xl:max-h-[calc(100vh-120px)] xl:overflow-auto" aria-label="Calculus support panel">
          <CalculusProgressPanel progress={progress} mode={mode} />
          <div className="grid gap-2">
            {!isOverview && <Link to="/calculus" className="action-primary min-h-11 w-full justify-center"><Sigma className="h-4 w-4" /> Back to calculus map</Link>}
            <Link to="/calculator" className="action-secondary min-h-11 w-full justify-center"><Calculator className="h-4 w-4" /> Calculator</Link>
            <Link to="/theorems/calculus-analysis" className="action-secondary min-h-11 w-full justify-center"><BookOpenCheck className="h-4 w-4" /> Theorems</Link>
            <Link to="/visual-proofs/calculus" className="action-secondary min-h-11 w-full justify-center"><Sparkles className="h-4 w-4" /> Proofs</Link>
            <Link to="/formulas/calculus" className="action-secondary min-h-11 w-full justify-center"><Sigma className="h-4 w-4" /> Formulas</Link>
          </div>
          <ContinueCard routePrefix="/calculus" />
          <TopicProgressActions topicId={topic.id} />
        </aside>
      </div>
    </div>
  );
}

function CalculusPageNav({ activePage }: { activePage: CalculusPage }) {
  return (
    <nav className="mobile-safe-scroll thin-scrollbar rounded-2xl border border-cyan-200 bg-white/85 p-2 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/70" aria-label="Calculus pages">
      <div className="inline-flex min-w-full gap-2 md:min-w-0">
        {calculusPages.map((item) => {
          const Icon = item.icon;
          const active = item.id === activePage;
          return (
            <Link key={item.id} to={item.route} className={`group flex min-w-32 shrink-0 items-center gap-2 rounded-xl border px-3 py-2 transition ${active ? "border-cyan-300 bg-cyan-100 text-cyan-950 shadow-sm dark:border-cyan-300/40 dark:bg-cyan-300/15 dark:text-white" : "border-slate-200 bg-white/70 text-slate-600 hover:border-cyan-200 hover:text-cyan-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-cyan-100"}`}>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${active ? "bg-cyan-500 text-white dark:bg-cyan-300 dark:text-slate-950" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}><Icon className="h-4 w-4" /></span>
              <span className="min-w-0">
                <span className="block text-sm font-black leading-4">{item.label}</span>
                <span className="block truncate text-[11px] font-semibold opacity-75">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function CalculusPageContent({ page, level, mode, modeNote, progress, launchers, tracks }: { page: CalculusPage; level: CalculusLevel; mode: StudyMode; modeNote: string; progress: number; launchers: typeof quickLaunchers[number][]; tracks: typeof learningTracks[number][] }) {
  if (page === "limits") return <FocusedPage title="Limits and continuity" description="Approach values from both sides, then compare with the function value."><LimitsVisualizer /></FocusedPage>;
  if (page === "derivatives") return <FocusedPage title="Derivatives and tangent slope" description="Move the point, shrink the secant, and read local rate of change."><DerivativeSlopeVisualizer /></FocusedPage>;
  if (page === "integrals") return <FocusedPage title="Integrals and area" description="Use rectangles and signed area to connect accumulation with antiderivatives."><IntegrationAreaVisualizer /></FocusedPage>;
  if (page === "motion") return <FocusedPage title="Motion calculus" description="Connect position, velocity, acceleration, and area under velocity."><MotionVisualizer /></FocusedPage>;
  if (page === "practice") return <CalculusPracticePanel mode={mode} />;
  if (page === "proof-problems") return <FocusedPage title="Proof problems" description="Short visual proof tasks without crowding the main calculus page."><CalculusFundamentalsProblems /></FocusedPage>;
  if (page === "series-blocks") return <FocusedPage title="Series blocks" description="Build sums as visual accumulation blocks."><SeriesBlockAccumulation /></FocusedPage>;
  if (page === "atlas") return <FocusedPage title="Calculus atlas" description="A compact concept map for limits, derivatives, integrals, series, and models."><CalculusConceptAtlas /></FocusedPage>;
  if (page === "formulas") return <FocusedPage title="Formula atlas" description="Visual formula cards for calculus rules and patterns."><FormulaVisualizationAtlas topic="calculus" /></FocusedPage>;
  if (page === "applications") return <CalculusApplicationsPage />;
  return <CalculusOverview level={level} mode={mode} modeNote={modeNote} progress={progress} launchers={launchers} tracks={tracks} />;
}

function FocusedPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="grid gap-3">
      <SectionCard title={title} description={description} compact>
        {children}
      </SectionCard>
    </div>
  );
}

function CalculusCommandBar({ level, mode, query, onLevel, onMode, onQuery }: { level: CalculusLevel; mode: StudyMode; query: string; onLevel: (value: CalculusLevel) => void; onMode: (value: StudyMode) => void; onQuery: (value: string) => void }) {
  return (
    <section className="rounded-2xl border border-cyan-200 bg-white/90 p-3 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/75">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-black text-white dark:bg-cyan-300 dark:text-slate-950"><Sigma className="h-4 w-4" /> Calculus cockpit</span>
          {(["Learn", "Practice", "Exam", "Teach"] as const).map((item) => (
            <button key={item} type="button" onClick={() => onMode(item)} className={mode === item ? "action-primary min-h-10 px-3" : "tool-button min-h-10 px-3"}>
              {item === "Learn" && <Lightbulb className="h-4 w-4" />}
              {item === "Practice" && <ListChecks className="h-4 w-4" />}
              {item === "Exam" && <Target className="h-4 w-4" />}
              {item === "Teach" && <GraduationCap className="h-4 w-4" />}
              {item}
            </button>
          ))}
        </div>
        <label className="relative min-w-0 xl:w-80">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Find limit, tangent, area..." className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-950" />
        </label>
      </div>
      <div className="mobile-safe-scroll thin-scrollbar mt-3">
        <div className="inline-flex min-w-full gap-2 md:min-w-0">
          {(["All", "Class 11", "Class 12", "JEE", "Degree", "Engineering"] as const).map((item) => (
            <button key={item} type="button" onClick={() => onLevel(item)} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-black transition ${level === item ? "bg-cyan-500 text-white shadow-sm dark:bg-cyan-300 dark:text-slate-950" : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalculusOverview({ level, mode, modeNote, progress, launchers, tracks }: { level: CalculusLevel; mode: StudyMode; modeNote: string; progress: number; launchers: typeof quickLaunchers[number][]; tracks: typeof learningTracks[number][] }) {
  return (
    <div className="grid gap-3">
      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title={`${mode} Workspace`} description={modeNote} compact>
          <div className="grid gap-3 md:grid-cols-4">
            <Kpi icon={<Route className="h-4 w-4" />} label="Level filter" value={level} />
            <Kpi icon={<Clock3 className="h-4 w-4" />} label="Fast path" value="18 min" />
            <Kpi icon={<CheckCircle2 className="h-4 w-4" />} label="Progress" value={`${progress}%`} />
            <Kpi icon={<FlaskConical className="h-4 w-4" />} label="Labs" value="8+" />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
            {launchers.slice(0, 8).map((item) => <LauncherCard key={item.route} item={item} />)}
          </div>
        </SectionCard>
        <SectionCard title="Learning Path" description="Small steps, not a long scroll." compact>
          <div className="grid max-h-[390px] gap-2 overflow-auto pr-1 thin-scrollbar">
            {(tracks.length ? tracks : learningTracks).map((track, index) => <TrackCard key={track.title} track={track} index={index + 1} />)}
          </div>
        </SectionCard>
      </section>
      <TopicTabs tabs={[
        { id: "theorems", label: "Theorems", content: <TheoremStrip /> },
        { id: "traps", label: "Traps", content: <MisconceptionPanel /> },
        { id: "exam", label: "Exam Moves", content: <ExamMovesPanel /> },
        { id: "formulas", label: "Essentials", content: <FormulaEssentialsPanel /> },
        { id: "accuracy", label: "Accuracy & Examples", content: <ConceptAccuracyPanel domain="calculus" /> },
      ]} />
    </div>
  );
}

function CalculusApplicationsPage() {
  return (
    <SectionCard title="Applications" description="Pick one model family at a time instead of reading a long page." compact>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {calculusApplications.map((item) => (
          <ApplicationVisualCard key={item.title} title={item.title} description={item.description} visual={item.visual} compact />
        ))}
      </div>
    </SectionCard>
  );
}

function CalculusPracticePanel({ mode }: { mode: StudyMode }) {
  const title = mode === "Exam" ? "Exam Sprint" : mode === "Teach" ? "Teacher Prompts" : mode === "Practice" ? "Practice Queue" : "Concept Checks";
  return (
    <div className="grid gap-3 xl:grid-cols-[.8fr_1.2fr]">
      <SectionCard title={title} description="Use short tasks that connect a visual move to a symbolic reason." compact>
        <div className="grid gap-2">
          {practiceQueue.map((prompt, index) => (
            <div key={prompt} className="flex gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-cyan-100 text-sm font-black text-cyan-900 dark:bg-cyan-300/20 dark:text-cyan-100">{index + 1}</span>
              <p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{prompt}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Readiness Grid" description="A compact map of prerequisite strength before jumping into advanced tabs." compact>
        <div className="grid gap-2 sm:grid-cols-2">
          {["Functions", "Graph reading", "Algebraic simplification", "Trigonometry", "Area formulas", "Sequences", "Vectors", "Units and rates"].map((item, index) => (
            <div key={item} className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-black">{item}</span>
                <span className="mini-chip">{index < 5 ? "core" : "next"}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white dark:bg-slate-950">
                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${72 + (index % 3) * 9}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function CalculusProgressPanel({ progress, mode }: { progress: number; mode: StudyMode }) {
  return (
    <SectionCard title="Session Snapshot" compact>
      <div className="grid grid-cols-2 gap-2">
        <Kpi icon={<Sparkles className="h-4 w-4" />} label="Mode" value={mode} />
        <Kpi icon={<CheckCircle2 className="h-4 w-4" />} label="Progress" value={`${progress}%`} />
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" style={{ width: `${Math.max(8, progress)}%` }} />
      </div>
    </SectionCard>
  );
}

function TheoremStrip() {
  return (
    <SectionCard title="Theorem Strip" description="Use theorem cards as decision cues." compact>
      <div className="grid max-h-80 gap-2 overflow-auto pr-1 thin-scrollbar">
        {theoremCards.map((item) => <CompactInfo key={item.title} title={item.title} eyebrow={item.when} text={item.result} />)}
      </div>
    </SectionCard>
  );
}

function MisconceptionPanel() {
  return (
    <SectionCard title="Common Traps" description="Quick fixes before students practice." compact>
      <div className="grid max-h-80 gap-2 overflow-auto pr-1 thin-scrollbar">
        {misconceptionFixes.map((item) => <CompactInfo key={item.trap} title={item.trap} eyebrow="Fix" text={item.fix} />)}
      </div>
    </SectionCard>
  );
}

function ExamMovesPanel() {
  return (
    <SectionCard title="Exam Moves" description="Fast setup patterns for board, JEE, and college calculus tasks." compact>
      <div className="grid max-h-80 gap-2 overflow-auto pr-1 thin-scrollbar">
        {examMoves.map((item) => <CompactInfo key={item.title} title={item.title} eyebrow="Move" text={item.cue} />)}
      </div>
    </SectionCard>
  );
}

function FormulaEssentialsPanel() {
  return (
    <SectionCard title="Formula Essentials" description="Core formulas are parked here so the main page stays breathable." compact>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {formulaEssentials.map((item) => <CompactInfo key={item.title} title={item.title} eyebrow={item.math} text={item.cue} />)}
      </div>
    </SectionCard>
  );
}

function LauncherCard({ item }: { item: typeof quickLaunchers[number] }) {
  const Icon = item.icon;
  return (
    <Link to={item.route} className="group rounded-xl border border-slate-200 bg-white/85 p-3 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-100 text-cyan-800 dark:bg-cyan-300/15 dark:text-cyan-100"><Icon className="h-4 w-4" /></span>
        <span className="mini-chip">{item.tag}</span>
      </div>
      <h3 className="mt-3 text-sm font-black text-slate-950 dark:text-white">{item.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.note}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-cyan-700 dark:text-cyan-200">Open <MoveRight className="h-3 w-3 transition group-hover:translate-x-0.5" /></span>
    </Link>
  );
}

function TrackCard({ track, index }: { track: typeof learningTracks[number]; index: number }) {
  const Icon = track.icon;
  return (
    <Link to={track.route} className="rounded-xl border border-slate-200 bg-white/80 p-3 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950"><Icon className="h-4 w-4" /></span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-500">Step {index}</span>
            <span className="mini-chip">{track.level}</span>
            <span className="mini-chip">{track.minutes} min</span>
          </div>
          <h3 className="mt-1 text-sm font-black text-slate-950 dark:text-white">{track.title}</h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {track.checkpoints.map((item) => <span key={item} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{item}</span>)}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Kpi({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">{icon}{label}</div>
      <div className="mt-1 truncate text-lg font-black text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function CompactInfo({ title, eyebrow, text }: { title: string; eyebrow: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{eyebrow}</p>
      <h3 className="mt-1 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}
