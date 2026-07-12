import { BookOpen, BrainCircuit, Calculator, CheckCircle2, Cuboid, FlaskConical, Gauge, GraduationCap, HelpCircle, Layers3, LibraryBig, MonitorSmartphone, PlayCircle, Rocket, Route, Search, ShieldCheck, Sparkles, Target, Trophy, Wand2, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import DashboardCard from "../components/ui/DashboardCard";
import AITutorPanel from "../components/ui/AITutorPanel";
import { iconMap } from "../components/layout/navItems";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import { useLocalStorage } from "../hooks/useLocalStorage";
import InquirySimulationLabs from "../components/inquiry/InquirySimulationLabs";
import { recentRouteItems } from "../components/layout/GlobalUx";
import { buildPracticeSpineLite } from "../data/olympyardPracticeSpineLite";
import { initialOlympyardProgressLite, normalizeOlympyardProgressLite, OLYMPYARD_PROGRESS_STORAGE_KEY, type OlympyardProgressLite } from "../data/olympyardProgressLite";

const tourSteps = [
  { label: "Algebra line graph", route: "/algebra", description: "See how coefficients reshape lines and parabolas in real time." },
  { label: "Geometry 3D shape", route: "/geometry", description: "Rotate and scale 3D solids and see surface area & volume update live." },
  { label: "Trigonometry unit circle", route: "/trigonometry", description: "Drag the angle and watch sin, cos, tan animate on the unit circle." },
  { label: "Calculus derivative", route: "/calculus", description: "Scrub a slider to see the tangent line and derivative value change." },
  { label: "Euler 3D visualization", route: "/complex-numbers", description: "Visualize Euler's formula on the complex plane in 3D." },
  { label: "Linear algebra transformation", route: "/linear-algebra", description: "Apply matrix transformations and watch vectors rotate and scale." },
  { label: "AI gradient descent", route: "/ai-applications", description: "Watch gradient descent converge on a loss surface step by step." },
  { label: "Quiz result", route: "/quiz", description: "Test yourself with timed quizzes and track your best scores." },
  { label: "Statistics dashboard", route: "/probability-statistics", description: "Explore probability, distributions, regression, and data charts." },
];

const learnerPaths = [
  {
    id: "student",
    label: "Student",
    title: "Build intuition",
    description: "Start with visual labs, then test yourself with guided practice.",
    route: "/ncert",
    icon: GraduationCap,
    color: "from-cyan-500 to-emerald-500",
  },
  {
    id: "teacher",
    label: "Teacher",
    title: "Run a class",
    description: "Open NCERT labs, worksheets, and visual proof flows quickly.",
    route: "/learn",
    icon: BookOpen,
    color: "from-violet-500 to-cyan-500",
  },
  {
    id: "explorer",
    label: "Explorer",
    title: "Play with tools",
    description: "Use graphing, 3D, AR, CAS-style solving, and formula visualizers.",
    route: "/math-lab",
    icon: Rocket,
    color: "from-sky-500 to-indigo-500",
  },
] as const;

const launchShortcuts = [
  { label: "Solve a problem", route: "/problem-solver", icon: Wand2, hint: "steps + checks" },
  { label: "Graph workspace", route: "/workspace/graph", icon: Calculator, hint: "plot + table" },
  { label: "Visual formulas", route: "/visual-formulas", icon: Sparkles, hint: "formula atlas" },
  { label: "NCERT path", route: "/ncert", icon: BookOpen, hint: "class labs" },
  { label: "AR Math Lab", route: "/modules/ar-math-lab", icon: MonitorSmartphone, hint: "XR preview" },
  { label: "Graph Theory", route: "/graph-theory", icon: Layers3, hint: "algorithms" },
] as const;

const enhancementChecklist = [
  "Hero launch console",
  "Role-based learner paths",
  "Search-first discovery",
  "Compact stats bar",
  "Recent route chips",
  "Primary action cluster",
  "Visual proof shortcut",
  "NCERT shortcut",
  "Formula visualizer shortcut",
  "Problem solver shortcut",
  "Modern module cards",
  "Favorite support",
  "Open-in-new-tab affordance",
  "Progress visibility",
  "Estimated time chips",
  "Difficulty chips",
  "Adaptive practice strip",
  "Responsive mobile dock awareness",
  "Better empty state",
  "Filter tabs",
  "Teacher/student/explorer routing",
  "Command-style search",
  "High-contrast cards",
  "Compact text hierarchy",
  "2026 glass surface treatment",
] as const;

function GuidedTourOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const current = tourSteps[step];

  function launch() {
    navigate(current.route);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl dark:bg-slate-950" initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }}>
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <span className="text-sm font-black text-cyan-600 dark:text-cyan-300">Guided Tour — Step {step + 1} of {tourSteps.length}</span>
              <button type="button" className="math-tool-button h-8 w-8 rounded-full" onClick={onClose}><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-bold">{current.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{current.description}</p>
            </div>
            <div className="flex gap-1 px-5 pb-3">
              {tourSteps.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-cyan-500" : "bg-slate-200 dark:bg-white/10"}`} />)}
            </div>
            <div className="flex gap-3 p-5 pt-2">
              <button type="button" className="action-secondary flex-1" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
              <button type="button" className="action-secondary flex-1" onClick={launch}><ArrowRight className="h-4 w-4" />Open</button>
              {step < tourSteps.length - 1
                ? <button type="button" className="action-primary flex-1" onClick={() => setStep((s) => s + 1)}>Next</button>
                : <button type="button" className="action-primary flex-1" onClick={onClose}>Finish</button>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const { getTopicProgress, getOverallProgress } = useProgress();
  const [olympyardProgress] = useLocalStorage<OlympyardProgressLite>(OLYMPYARD_PROGRESS_STORAGE_KEY, initialOlympyardProgressLite);
  const recentItems = recentRouteItems(5);
  const [tourOpen, setTourOpen] = useState(false);
  const [homeFilter, setHomeFilter] = useState<"all" | "core" | "tools" | "practice" | "advanced">("all");
  const [homeQuery, setHomeQuery] = useState("");
  const [activePath, setActivePath] = useState<(typeof learnerPaths)[number]["id"]>("student");
  const labs = topics.reduce((sum, topic) => sum + topic.labCount, 0);
  const practiceSpine = buildPracticeSpineLite(normalizeOlympyardProgressLite(olympyardProgress));
  const extraCards = [
    {
      title: "Visual Showcase",
      description: "A cinematic launchpad for the 18 flagship math visuals, built for product demos, lessons, and screen-recorded walkthroughs.",
      concepts: ["Cinematic", "3D", "AI", "Calculus"],
      icon: Sparkles,
      route: "/visual-showcase",
      colorGradient: "from-slate-950 to-cyan-500",
    },
    {
      title: "Math Lab",
      description: "GeoGebra-style visual tools and WolframAlpha-style solving workspace for graphing, solving, symbolic algebra, calculus, statistics, probability, geometry, linear algebra, and 3D graphs.",
      concepts: ["Graphing", "Solving", "CAS", "3D graphs"],
      icon: FlaskConical,
      route: "/math-lab",
      colorGradient: "from-slate-950 to-cyan-600",
    },
    {
      title: "Olympyard",
      description: "Olympiad-style visual maths practice with grade filters, topic tracks, local progress, and a mock-test entry point.",
      concepts: ["Olympiad", "Topic map", "Mock test", "Visual practice"],
      icon: Trophy,
      route: "/olympyard",
      colorGradient: "from-emerald-500 to-violet-600",
    },
    {
      title: "Math Workspace",
      description: "GeoGebra and Wolfram-style workspace with command input, graphing, result cards, and geometry construction.",
      concepts: ["Graphing", "Commands", "Geometry", "Measurements"],
      icon: Calculator,
      route: "/workspace",
      colorGradient: "from-cyan-500 to-indigo-600",
    },
    {
      title: "2D/3D Shapes Explorer",
      description: "Dedicated visual library for plane figures and solid shapes with formulas, dimensions, area, surface area, and volume.",
      concepts: ["2D shapes", "3D solids", "Formulas", "Visual explorer"],
      icon: Cuboid,
      route: "/shapes",
      colorGradient: "from-emerald-500 to-sky-600",
    },
    {
      title: "NCERT Dashboard",
      description: "Class 7, Class 10, and Class 12 NCERT visual labs with formula, theorem, visual proof, practice, and QA badges.",
      concepts: ["Class 7", "Class 10", "Class 12", "Board exams"],
      icon: BookOpen,
      route: "/ncert",
      colorGradient: "from-cyan-600 to-emerald-500",
    },
    {
      title: "Syllabus Universe",
      description: "Class 8 to Degree Mathematics mapped to available visual labs and future concept cards.",
      concepts: ["Class-wise", "Formulas", "Mapped labs", "Roadmap"],
      icon: LibraryBig,
      route: "/syllabus",
      colorGradient: "from-cyan-500 to-violet-600",
    },
    {
      title: "Learning Hub",
      description: "Teacher mode, kid mode, searchable lessons, assignments, worksheets, grade mapping, and shareable lesson links.",
      concepts: ["Teacher mode", "Kid activities", "Worksheets", "Lessons"],
      icon: LibraryBig,
      route: "/learn",
      colorGradient: "from-fuchsia-500 to-cyan-600",
    },
    {
      title: "Scientific Calculator",
      description: "Advanced browser-based calculator with trigonometry, logs, powers, roots, constants, memory, and history.",
      concepts: ["DEG/RAD", "Memory", "History", "Safe parser"],
      icon: Calculator,
      route: "/calculator",
      colorGradient: "from-slate-900 to-cyan-600",
    },
  ];
  const topicCards = topics.map((topic) => ({ type: "core" as const, topic }));
  const toolCards = extraCards.map((card) => ({ type: "tools" as const, card }));
  const normalizedQuery = homeQuery.trim().toLowerCase();
  const visibleTopicCards = topicCards.filter(({ topic }) => {
    const filterMatch =
      homeFilter === "all" ||
      (homeFilter === "core" && ["algebra", "geometry", "trigonometry", "calculus", "complex", "linear-algebra"].includes(topic.id)) ||
      (homeFilter === "practice" && ["quiz"].includes(topic.id)) ||
      (homeFilter === "advanced" && !["algebra", "geometry", "trigonometry", "calculus", "complex", "linear-algebra"].includes(topic.id));
    const queryMatch =
      !normalizedQuery ||
      `${topic.title} ${topic.description} ${topic.concepts.join(" ")} ${topic.difficulty}`.toLowerCase().includes(normalizedQuery);
    return filterMatch && queryMatch;
  });
  const visibleToolCards = homeFilter === "all" || homeFilter === "tools"
    ? toolCards.filter(({ card }) => !normalizedQuery || `${card.title} ${card.description} ${card.concepts.join(" ")}`.toLowerCase().includes(normalizedQuery))
    : [];
  const activePathConfig = learnerPaths.find((path) => path.id === activePath) ?? learnerPaths[0];
  const recommendedTopics = topics.filter((topic) => ["algebra", "geometry", "trigonometry", "calculus"].includes(topic.id)).slice(0, 4);

  return (
    <div className="space-y-4">
      <GuidedTourOverlay open={tourOpen} onClose={() => setTourOpen(false)} />

      <section className="relative overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/90 shadow-2xl shadow-cyan-100/50 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/78 dark:shadow-black/25">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-violet-500" aria-hidden="true" />
        <div className="grid gap-4 p-4 md:p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mini-chip bg-cyan-50 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                2026 welcome screen
              </span>
              <span className="mini-chip bg-emerald-50 text-emerald-800 dark:bg-emerald-300/10 dark:text-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {getOverallProgress()}% local progress
              </span>
              <span className="mini-chip">
                <Gauge className="h-3.5 w-3.5" />
                {topics.length} worlds · {labs} labs
              </span>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">
              Math Universe
            </h1>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              A visual learning cockpit for formulas, proofs, graphing, NCERT practice, AR/XR, geometry, calculus, and problem solving.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <Link to="/math-lab" className="action-primary justify-center rounded-2xl py-3">
                <PlayCircle className="h-4 w-4" />
                Start Lab
              </Link>
              <Link to="/problem-solver" className="action-secondary justify-center rounded-2xl py-3">
                <Wand2 className="h-4 w-4" />
                Solve
              </Link>
              <Link to="/visual-formulas" className="action-secondary justify-center rounded-2xl py-3">
                <Sparkles className="h-4 w-4" />
                Formulas
              </Link>
              <button type="button" className="action-secondary justify-center rounded-2xl py-3" onClick={() => setTourOpen(true)}>
                <HelpCircle className="h-4 w-4" />
                Tour
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-cyan-100 bg-slate-950 p-3 text-white shadow-xl dark:border-cyan-300/20">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-emerald-300 to-violet-400 p-[1px]">
              <div className="rounded-2xl bg-slate-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Launch console</p>
                <h2 className="mt-2 text-2xl font-black">Choose your path</h2>
                <div className="mt-4 grid gap-2">
                  {learnerPaths.map((path) => {
                    const Icon = path.icon;
                    return (
                      <button
                        key={path.id}
                        type="button"
                        className={`rounded-2xl border p-3 text-left transition ${activePath === path.id ? "border-cyan-300 bg-white text-slate-950 shadow-lg" : "border-white/10 bg-white/5 text-slate-100 hover:border-cyan-300/60 hover:bg-white/10"}`}
                        onClick={() => setActivePath(path.id)}
                      >
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${path.color} text-white`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="ml-3 text-sm font-black">{path.label}</span>
                        <span className={`mt-2 block text-xs leading-5 ${activePath === path.id ? "text-slate-600" : "text-slate-300"}`}>{path.description}</span>
                      </button>
                    );
                  })}
                </div>
                <Link to={activePathConfig.route} className="action-primary mt-4 w-full justify-center rounded-2xl">
                  Open {activePathConfig.label} path
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
          <Search className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
          <input
            value={homeQuery}
            onChange={(event) => setHomeQuery(event.target.value)}
            placeholder="Search modules, formulas, graphing, proof, NCERT, AR..."
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          {homeQuery && <button type="button" className="mini-chip" onClick={() => setHomeQuery("")}>Clear</button>}
        </label>

        <div className="mobile-safe-scroll thin-scrollbar flex gap-2 pb-1 lg:pb-0">
          {launchShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.route} to={item.route} className="shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-300/40 dark:hover:bg-cyan-300/10">
                <span className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white"><Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />{item.label}</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{item.hint}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {[
          { label: "Topic worlds", value: topics.length, icon: BookOpen, color: "text-cyan-600 dark:text-cyan-300" },
          { label: "Interactive labs", value: labs, icon: FlaskConical, color: "text-violet-600 dark:text-violet-300" },
          { label: "Syllabus levels", value: "6", icon: LibraryBig, color: "text-amber-600 dark:text-amber-300" },
          { label: "Saved progress", value: `${getOverallProgress()}%`, icon: Route, color: "text-emerald-600 dark:text-emerald-300" },
          { label: "Practice tracks", value: 8, icon: Trophy, color: "text-rose-600 dark:text-rose-300" },
          { label: "Smart tools", value: "12+", icon: BrainCircuit, color: "text-sky-600 dark:text-sky-300" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/45">
            <Icon className={`h-5 w-5 ${color}`} />
            <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {recentItems.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Continue learning</span>
            <span className="mini-chip">{recentItems.length} recent</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {recentItems.map((item) => (
              <Link key={item.route} to={item.route} className="mini-chip transition hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-400/15 dark:hover:text-cyan-100">
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Recommended next</p>
              <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Start with the visual core</h2>
            </div>
            <Link to="/visual-showcase" className="mini-chip">Showcase</Link>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {recommendedTopics.map((topic) => {
              const Icon = iconMap[topic.iconName as keyof typeof iconMap] ?? BookOpen;
              return (
                <Link key={topic.id} to={topic.route} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/40 dark:hover:border-cyan-300/40">
                  <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                  <p className="mt-2 text-sm font-black text-slate-950 dark:text-white">{topic.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{topic.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
        <EnhancementDigest />
      </section>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        {[
          ["all", "All"],
          ["core", "Core"],
          ["tools", "Tools"],
          ["practice", "Practice"],
          ["advanced", "Advanced"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={homeFilter === id ? "action-primary min-h-10 rounded-xl px-4 py-2" : "tool-button min-h-10 rounded-xl px-4 py-2"}
            onClick={() => setHomeFilter(id as typeof homeFilter)}
          >
            {label}
          </button>
        ))}
      </div>

      {homeFilter === "all" || homeFilter === "practice" ? <InquirySimulationLabs /> : null}
      {homeFilter === "all" || homeFilter === "practice" ? <PracticeSpineStrip spine={practiceSpine} /> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visibleTopicCards.map(({ topic }) => {
          const Icon = iconMap[topic.iconName as keyof typeof iconMap] ?? BookOpen;
          return <DashboardCard key={topic.id} title={topic.title} description={topic.description} concepts={topic.concepts} icon={Icon} route={topic.route} isExternal={topic.isExternal} progress={getTopicProgress(topic.id)} colorGradient={topic.colorGradient} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} isNew={topic.id === "matrices"} />;
        })}
        {visibleToolCards.map(({ card }) => <DashboardCard key={card.title} title={card.title} description={card.description} concepts={card.concepts} icon={card.icon} route={card.route} progress={0} colorGradient={card.colorGradient} />)}
      </div>
      {!visibleTopicCards.length && !visibleToolCards.length && (
        <section className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/70 p-6 text-center dark:border-cyan-300/30 dark:bg-cyan-400/10">
          <Search className="mx-auto h-8 w-8 text-cyan-600 dark:text-cyan-300" />
          <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">No module matched that search</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Try “graph”, “proof”, “NCERT”, “triangle”, “calculus”, or clear the search.</p>
          <button type="button" className="action-primary mx-auto mt-4" onClick={() => { setHomeQuery(""); setHomeFilter("all"); }}>
            Clear filters
          </button>
        </section>
      )}
      {homeFilter === "all" && <AITutorPanel />}
    </div>
  );
}

function EnhancementDigest() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-violet-700 dark:text-violet-300">UI upgrade</p>
          <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">25 refinements applied</h2>
        </div>
        <span className="rounded-2xl bg-violet-50 p-3 text-violet-700 dark:bg-violet-400/10 dark:text-violet-200">
          <Sparkles className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 grid max-h-56 gap-1.5 overflow-auto pr-1 thin-scrollbar">
        {enhancementChecklist.map((item, index) => (
          <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2 dark:bg-slate-950/40">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[10px] font-black text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">{index + 1}</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function PracticeSpineStrip({ spine }: { spine: ReturnType<typeof buildPracticeSpineLite> }) {
  const accuracy = spine.mastery.accuracy;
  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mini-chip bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            Adaptive practice spine
          </span>
          <span className="mini-chip">{spine.mastery.attempted ? `${accuracy}% accuracy` : "No local signal yet"}</span>
        </div>
        <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">
          Practice next: {spine.primaryTopic?.title ?? "Number Sense"}
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Olympyard now connects topic labs, quizzes, visual reasoning, weak-area review, and mock tests into one adaptive queue.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/60 bg-white/70 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
        <Link to={spine.primaryPracticeRoute} className="action-primary">
          <Target className="h-4 w-4" />
          Practice next
        </Link>
        <Link to={spine.adaptiveRoute} className="action-secondary">
          Adaptive session
        </Link>
      </div>
    </section>
  );
}
