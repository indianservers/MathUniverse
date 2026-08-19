import { BookOpen, BrainCircuit, Calculator, CheckCircle2, Compass, Cuboid, FlaskConical, Gauge, GraduationCap, HelpCircle, Layers3, LibraryBig, MonitorSmartphone, PlayCircle, Rocket, Route, Search, ShieldCheck, Sparkles, Target, Trophy, Wand2, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties, type PointerEvent } from "react";
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
import { MathWorkspacesHomeSection } from "../components/workspace/MathWorkspaceNavigation";
import InteractiveMathHero from "../components/home/InteractiveMathHero";
import MathExpression from "../components/ui/MathExpression";

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
      description: "Interactive visual tools and a step-by-step solving workspace for graphing, symbolic algebra, calculus, statistics, probability, geometry, linear algebra, and 3D graphs.",
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
      description: "Unified mathematics workspace with command input, graphing, result cards, and dynamic geometry construction.",
      concepts: ["Graphing", "Commands", "Geometry", "Measurements"],
      icon: Calculator,
      route: "/workspace",
      colorGradient: "from-cyan-500 to-indigo-600",
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

      <HomeMathStudioHero labs={labs} topicCount={topics.length} progress={getOverallProgress()} onTour={() => setTourOpen(true)} />
      <HomeUnderstandingSection />

      <div className="hidden"><section className="home-hero relative isolate overflow-hidden rounded-[1.8rem] border border-white/35 text-white shadow-2xl shadow-indigo-500/25">
        <div className="home-hero-grid absolute inset-0 -z-10" aria-hidden="true" />
        <div className="absolute -left-16 -top-24 -z-10 h-72 w-72 rounded-full bg-cyan-300/35 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 left-1/3 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-16 top-8 -z-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" aria-hidden="true" />
        <div className="grid gap-4 p-4 md:p-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mini-chip border-white/20 bg-white/15 text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                2026 welcome screen
              </span>
              <span className="mini-chip border-white/20 bg-emerald-300/20 text-emerald-50 backdrop-blur-md">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {getOverallProgress()}% local progress
              </span>
              <span className="mini-chip border-white/20 bg-violet-300/20 text-violet-50 backdrop-blur-md">
                <Gauge className="h-3.5 w-3.5" />
                {topics.length} worlds · {labs} labs
              </span>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-black tracking-tight text-white drop-shadow-sm md:text-6xl">
              See mathematics come alive.
            </h1>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-cyan-50/90 md:text-lg">
              A visual learning cockpit for formulas, proofs, graphing, NCERT practice, AR/XR, geometry, calculus, and problem solving.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <Link to="/math-lab" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-indigo-800 shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-cyan-50">
                <PlayCircle className="h-4 w-4" />
                Start Lab
              </Link>
              <Link to="/problem-solver" className="home-hero-action justify-center rounded-2xl py-3">
                <Wand2 className="h-4 w-4" />
                Solve
              </Link>
              <Link to="/visual-formulas" className="home-hero-action justify-center rounded-2xl py-3">
                <Sparkles className="h-4 w-4" />
                Formulas
              </Link>
              <button type="button" className="home-hero-action justify-center rounded-2xl py-3" onClick={() => setTourOpen(true)}>
                <HelpCircle className="h-4 w-4" />
                Tour
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/20 bg-white/10 p-3 text-white shadow-xl backdrop-blur-xl">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-300 via-emerald-300 to-fuchsia-400 p-[1px]">
              <div className="rounded-2xl bg-indigo-950/80 p-4 backdrop-blur-xl">
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
      </section></div>

      <section className="home-path-section" aria-labelledby="home-path-title">
        <div className="home-path-heading"><span>Choose how you want to explore</span><h2 id="home-path-title">A clear path for every curious mind</h2></div>
        <div className="home-path-grid">{learnerPaths.map((path) => { const Icon = path.icon; return <Link key={path.id} to={path.route} className={`home-path-card is-${path.id}`} onMouseEnter={() => setActivePath(path.id)}><span className="home-path-icon"><Icon /></span><span><strong>{path.label}</strong><small>{path.description}</small><b>{path.id === "student" ? "Start learning" : path.id === "teacher" ? "Open studio" : "Explore tools"}<ArrowRight /></b></span></Link>; })}</div>
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
              <Link key={item.route} to={item.route} className="home-shortcut-card shrink-0 rounded-2xl border px-3 py-2 shadow-sm transition hover:-translate-y-0.5">
                <span className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white"><Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />{item.label}</span>
                <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{item.hint}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <MathWorkspacesHomeSection />

      <section className="rounded-[1.4rem] border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]" aria-labelledby="home-3d-graph-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Interactive 3D graph</p>
            <h2 id="home-3d-graph-title" className="text-xl font-black text-slate-950 dark:text-white">Current 3D surface lab preserved</h2>
          </div>
          <Link to="/math-lab/3d-graphing" className="mini-chip">Open full 3D graph</Link>
        </div>
        <InteractiveMathHero />
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
          <div key={label} className="home-stat-card rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
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

      <section className="grid gap-3">
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
      {homeFilter === "all" && <FormulaMuseumSection />}
      {homeFilter === "all" && <AITutorPanel />}
    </div>
  );
}

type HomeMathStudioHeroProps = {
  labs: number;
  topicCount: number;
  progress: number;
  onTour: () => void;
};

function HomeMathStudioHero({ labs, topicCount, progress, onTour }: HomeMathStudioHeroProps) {
  const [amplitude, setAmplitude] = useState(1.05);
  const [phase, setPhase] = useState(0);
  const [frequency, setFrequency] = useState(1);
  const [graphPointer, setGraphPointer] = useState({ active: false, t: 0.65 });

  function updateGraphFromPointer(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const localY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    const nextAmplitude = Math.min(1.7, Math.max(0.5, 0.55 + Math.abs(localY - 0.5) * 2.3));
    setGraphPointer({ active: true, t: localX });
    setPhase((localX - 0.5) * Math.PI * 2);
    setFrequency(Number((0.7 + localX * 1.1).toFixed(2)));
    setAmplitude(Number(nextAmplitude.toFixed(2)));
  }

  function handleGraphPointerDown(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateGraphFromPointer(event);
  }

  const wavePath = Array.from({ length: 92 }, (_, index) => {
    const t = index / 91;
    const x = 48 + t * 640;
    const y = 174 - Math.sin(t * Math.PI * 2 * frequency + phase) * 68 * amplitude;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const softWavePath = Array.from({ length: 92 }, (_, index) => {
    const t = index / 91;
    const x = 48 + t * 640;
    const y = 174 - Math.cos(t * Math.PI * 2 * 0.75 + phase * 0.55) * 42;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const liveValue = Math.sin(graphPointer.t * Math.PI * 2 * frequency + phase) * amplitude;
  const liveX = 48 + graphPointer.t * 640;
  const liveY = 174 - liveValue * 68;
  const stats = [
    { label: "Interactive Labs", value: `${labs}+`, icon: FlaskConical, hint: "Simulations you can explore" },
    { label: "Visual Concepts", value: `${Math.max(300, topicCount * 18)}+`, icon: Cuboid, hint: "From basics to advanced" },
    { label: "Grades 4-10", value: "CBSE", icon: GraduationCap, hint: "Curriculum aligned" },
    { label: "Learn by Exploring", value: `${progress}%`, icon: Compass, hint: "Visual. Interactive. Intuitive." },
  ];

  return (
    <section className="home-studio-hero" aria-labelledby="home-studio-title">
      <div className="home-studio-grid">
        <div className="home-studio-copy">
          <span className="home-studio-eyebrow"><Sparkles /> About Math Universe</span>
          <h1 id="home-studio-title" className="home-studio-title">
            Mathematics you can <span className="accent-cyan">see</span>, <span className="accent-violet">touch</span>, and understand
          </h1>
          <p>
            Math Universe turns abstract ideas into vivid, interactive experiences so every learner can explore, experiment, and truly understand mathematics.
          </p>
          <div className="home-studio-actions">
            <Link to="/math-lab" className="home-studio-primary"><Sparkles /> Explore Math Lab</Link>
            <Link to="/learning-paths" className="home-studio-secondary"><BookOpen /> View Learning Paths</Link>
            <button type="button" className="home-studio-icon-action" onClick={onTour} aria-label="Open guided tour"><HelpCircle /></button>
          </div>
        </div>

        <div className="home-studio-visual" aria-label="Interactive math studio preview">
          <svg
            className="home-studio-graph"
            viewBox="0 0 740 350"
            role="img"
            aria-label="Interactive sine graph. Drag across the graph to change amplitude, phase, and frequency."
            onPointerDown={handleGraphPointerDown}
            onPointerMove={(event) => {
              if (event.buttons === 1) updateGraphFromPointer(event);
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId);
              setGraphPointer((current) => ({ ...current, active: false }));
            }}
          >
            <defs>
              <pattern id="homeGraphGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#8fdcff" strokeOpacity="0.28" strokeWidth="1" />
              </pattern>
              <linearGradient id="homeWaveGradient" x1="0" x2="1">
                <stop offset="0%" stopColor="#00c8ff" />
                <stop offset="48%" stopColor="#38d6ff" />
                <stop offset="100%" stopColor="#b45cff" />
              </linearGradient>
              <filter id="homeWaveGlow" x="-8%" y="-28%" width="116%" height="156%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feColorMatrix in="blur" values="0 0 0 0 0.1 0 0 0 0 0.72 0 0 0 0 1 0 0 0 .55 0" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="0" y="0" width="740" height="350" rx="20" fill="url(#homeGraphGrid)" />
            <path d="M48 174H688" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <path d="M370 36V310" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <path d="M680 168L692 174L680 180" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M364 48L370 36L376 48" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {[-3, -2, -1, 1, 2, 3].map((tick) => (
              <g key={tick}>
                <path d={`M ${370 + tick * 82} 166 V 182`} stroke="#3b82f6" strokeWidth="1.5" />
                <text x={370 + tick * 82} y="202" textAnchor="middle" fill="#1d4ed8" fontSize="15" fontWeight="800">{tick}</text>
              </g>
            ))}
            {[-2, -1, 1, 2].map((tick) => (
              <g key={tick}>
                <path d={`M 362 ${174 - tick * 56} H 378`} stroke="#3b82f6" strokeWidth="1.5" />
                <text x="346" y={179 - tick * 56} textAnchor="end" fill="#1d4ed8" fontSize="15" fontWeight="800">{tick}</text>
              </g>
            ))}
            <text x="704" y="162" fill="#3b82f6" fontSize="22" fontStyle="italic" fontWeight="800">x</text>
            <text x="345" y="31" fill="#3b82f6" fontSize="22" fontStyle="italic" fontWeight="800">y</text>
            <path d={softWavePath} fill="none" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" opacity="0.55" filter="url(#homeWaveGlow)" />
            <path d={wavePath} fill="none" stroke="url(#homeWaveGradient)" strokeWidth="5" strokeLinecap="round" filter="url(#homeWaveGlow)" />
            <line x1={liveX} x2={liveX} y1="54" y2="294" stroke={graphPointer.active ? "#ffffff" : "#8b5cf6"} strokeWidth="2.5" strokeDasharray="8 8" opacity="0.88" />
            <circle cx={liveX} cy={liveY} r={graphPointer.active ? 10 : 7} fill="#7c3aed" stroke="white" strokeWidth="3" />
          </svg>

          <div className="home-floating-card home-function-card"><span />f(x) = {amplitude.toFixed(1)}sin({frequency.toFixed(1)}x)</div>
          <div className="home-floating-card home-theorem-card">
            <strong>Pythagorean Theorem</strong>
            <b>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></b>
            <svg viewBox="0 0 150 100" aria-hidden="true">
              <path d="M24 78H128L24 18Z" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M24 78V62H40" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="home-floating-card home-formula-card">
            <strong>Quadratic Formula</strong>
            <div className="home-quadratic-display" aria-hidden="true">
              <span>x =</span>
              <span className="home-quadratic-fraction">
                <span className="home-quadratic-numerator">
                  -b &plusmn; <span className="home-radical">&radic;<span>b<sup>2</sup> - 4ac</span></span>
                </span>
                <span className="home-quadratic-denominator">2a</span>
              </span>
            </div>
            <MathExpression className="sr-only" display value={"x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}"} />
          </div>
          <div className="home-floating-card home-circle-card">
            <strong>Circle Equation</strong>
            <b>x<sup>2</sup> + y<sup>2</sup> = r<sup>2</sup></b>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M18 60H102M60 18V102M60 60H96" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="home-torus-object" aria-hidden="true">
            <svg viewBox="0 0 180 90">
              {Array.from({ length: 11 }, (_, i) => <ellipse key={i} cx="90" cy="45" rx={74 - i * 3.1} ry={25 + i * 1.1} fill="none" stroke="#38bdf8" strokeOpacity={0.2 + i * 0.05} strokeWidth="1.5" />)}
            </svg>
          </div>
          <div className="home-cube-3d" aria-hidden="true">
            <span className="front" /><span className="back" /><span className="right" /><span className="left" /><span className="top" /><span className="bottom" />
          </div>
          <div className="home-studio-controls" aria-label="Graph controls">
            <label><span>Amplitude</span><input type="range" min="0.5" max="1.7" step="0.05" value={amplitude} onChange={(event) => setAmplitude(Number(event.target.value))} /></label>
            <label><span>Phase</span><input type="range" min="-2" max="2" step="0.1" value={phase} onChange={(event) => setPhase(Number(event.target.value))} /></label>
            <label><span>Frequency</span><input type="range" min="0.7" max="1.8" step="0.05" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} /></label>
          </div>
        </div>
      </div>
      <div className="home-studio-stats">
        {stats.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="home-studio-stat">
            <span><Icon /></span>
            <div>
              <strong>{value}</strong>
              <b>{label}</b>
              <small>{hint}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeUnderstandingSection() {
  const cards = [
    {
      title: "Explore concepts",
      text: "Dive into interactive models and uncover patterns.",
      art: (
        <svg viewBox="0 0 210 90" aria-hidden="true">
          <path d="M20 68C50 68 54 20 84 20C112 20 111 48 138 48C160 48 171 22 194 14" fill="none" stroke="#0ea5e9" strokeWidth="4" />
          <path d="M20 68H190M28 16V78" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="84" cy="20" r="8" fill="#38bdf8" stroke="#2563eb" strokeWidth="3" />
        </svg>
      ),
    },
    {
      title: "Manipulate variables",
      text: "Change values in real time and see instant results.",
      art: (
        <div className="home-slider-art" aria-hidden="true">
          <span><i style={{ left: "42%" }} /></span>
          <span><i style={{ left: "74%" }} /></span>
          <span><i style={{ left: "24%" }} /></span>
        </div>
      ),
    },
    {
      title: "Understand why",
      text: "Connect visuals to logic and build lasting intuition.",
      art: (
        <svg viewBox="0 0 210 90" aria-hidden="true">
          <path d="M42 70L103 16L166 70Z" fill="rgba(168,85,247,.12)" stroke="#8b5cf6" strokeWidth="3" />
          <path d="M103 16V70L42 70M103 70L166 70M103 16L126 72" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M126 72L137 64L147 72" fill="none" stroke="#0ea5e9" strokeWidth="2" />
        </svg>
      ),
    },
  ];
  const worlds = [
    { title: "Algebra", text: "Master expressions, equations, and patterns visually.", route: "/math/algebra", className: "algebra" },
    { title: "Geometry", text: "Explore shapes, theorems, and spatial reasoning.", route: "/math/geometry", className: "geometry" },
    { title: "Trigonometry", text: "Understand angles, identities, and wave functions.", route: "/math/trigonometry", className: "trig" },
    { title: "Calculus", text: "Visualize change, limits, and area under curves.", route: "/math/calculus", className: "calculus" },
  ];

  return (
    <>
      <section className="home-understanding" aria-labelledby="home-understanding-title">
        <h2 id="home-understanding-title">Built for visual understanding</h2>
        <div className="home-understanding-grid">
          {cards.map((card) => (
            <article key={card.title} className="home-understanding-card">
              <div>{card.art}</div>
              <span><strong>{card.title}</strong><small>{card.text}</small></span>
            </article>
          ))}
        </div>
      </section>
      <section className="home-learning-universe" aria-labelledby="home-learning-title">
        <h2 id="home-learning-title">Learning universe</h2>
        <div className="home-learning-grid">
          {worlds.map((world) => (
            <Link key={world.title} to={world.route} className={`home-learning-card ${world.className}`}>
              <strong>{world.title}</strong>
              <span>{world.text}</span>
              <i aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function FormulaMuseumSection() {
  const exhibits = [
    {
      title: "Derivative Tangent Sculpture",
      route: "/math/derivatives",
      formula: "f'(x)=lim(h->0)(f(x+h)-f(x))/h",
      note: "A moving tangent beam rides along a curve and reveals instantaneous slope.",
      className: "museum-derivative",
    },
    {
      title: "Integral Slab Gallery",
      route: "/math/integration",
      formula: "integral_a^b f(x) dx",
      note: "Area becomes stacked translucent slabs, from rough rectangles to smooth accumulation.",
      className: "museum-integral",
    },
    {
      title: "Matrix Transform Room",
      route: "/math/matrix-transformations",
      formula: "A[x,y]^T",
      note: "Step into a grid room where a matrix rotates, shears, stretches, and reflects space.",
      className: "museum-matrix",
    },
    {
      title: "Probability Branch Atrium",
      route: "/probability-statistics",
      formula: "P(A|B)=P(A)P(B|A)/P(B)",
      note: "Branching paths turn conditional probability into a walkable decision tree.",
      className: "museum-probability",
    },
  ];

  return (
    <section className="formula-museum overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20 dark:border-white/10" aria-label="3D Formula Museum">
      <div className="grid gap-4 p-4 md:p-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex min-h-[420px] flex-col justify-between">
          <div>
            <span className="mini-chip border-cyan-300/30 bg-cyan-300/10 text-cyan-100">
              <Cuboid className="h-3.5 w-3.5" />
              3D Formula Museum
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Explore formulas as interactive models.
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-300 md:text-base">
              Derivatives become tangent sculptures, integrals stack into area slabs, matrices reshape rooms, and probability grows into branching pathways.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/visual-formulas" className="action-primary">
              <Sparkles className="h-4 w-4" />
              Open formula atlas
            </Link>
            <Link to="/math-lab/3d-graphing" className="action-secondary border-white/15 bg-white/10 text-white hover:bg-white/15">
              <Cuboid className="h-4 w-4" />
              Open 3D lab
            </Link>
          </div>
        </div>

        <div className="formula-museum-stage" aria-hidden="true">
          <div className="museum-floor" />
          <div className="museum-exhibit museum-derivative">
            <span className="museum-curve" />
            <span className="museum-tangent" />
            <span className="museum-label">f'(x)</span>
          </div>
          <div className="museum-exhibit museum-integral">
            {Array.from({ length: 8 }, (_, index) => <span key={index} style={{ "--i": index } as CSSProperties} />)}
            <span className="museum-label">area</span>
          </div>
          <div className="museum-exhibit museum-matrix">
            <span />
            <span />
            <span />
            <span className="museum-label">A</span>
          </div>
          <div className="museum-exhibit museum-probability">
            <span />
            <span />
            <span />
            <span className="museum-label">P</span>
          </div>
        </div>
      </div>

      <div className="grid gap-2 border-t border-white/10 p-4 md:grid-cols-2 xl:grid-cols-4">
        {exhibits.map((exhibit) => (
          <Link key={exhibit.title} to={exhibit.route} className="group rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/[0.09]">
            <div className={`museum-card-icon ${exhibit.className}`} />
            <h3 className="mt-3 text-sm font-black text-white">{exhibit.title}</h3>
            <p className="mt-1 font-mono text-[11px] font-black text-cyan-200">{exhibit.formula}</p>
            <p className="mt-2 line-clamp-3 text-xs font-semibold leading-5 text-slate-300">{exhibit.note}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-xs font-black text-cyan-200">
              Enter exhibit <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
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
