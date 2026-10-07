import { BookOpen, BrainCircuit, Calculator, CheckCircle2, ChevronDown, Cuboid, FlaskConical, FolderTree, Gauge, GraduationCap, HelpCircle, Layers3, LibraryBig, MonitorSmartphone, PlayCircle, Rocket, Route, Search, Sparkles, Trophy, Wand2, X, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import DashboardCard from "../components/ui/DashboardCard";
import AITutorPanel from "../components/ui/AITutorPanel";
import { iconMap, navSections, type NavItem } from "../components/layout/navItems";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import { recentRouteItems } from "../components/layout/GlobalUx";
import { MathWorkspacesHomeSection } from "../components/workspace/MathWorkspaceNavigation";
import UniverseHero from "../components/home/UniverseHero";

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
  const recentItems = recentRouteItems(5);
  const [tourOpen, setTourOpen] = useState(false);
  const [homeFilter, setHomeFilter] = useState<"all" | "core" | "tools" | "practice" | "advanced">("all");
  const [homeQuery, setHomeQuery] = useState("");
  const [activePath, setActivePath] = useState<(typeof learnerPaths)[number]["id"]>("student");
  const labs = topics.reduce((sum, topic) => sum + topic.labCount, 0);
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
  return (
    <div className="space-y-4">
      <GuidedTourOverlay open={tourOpen} onClose={() => setTourOpen(false)} />

      <UniverseHero labs={labs} topicCount={topics.length} progress={getOverallProgress()} onTour={() => setTourOpen(true)} />
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

      <Link
        to="/lessons"
        className="home-lessons-featured group relative isolate overflow-hidden rounded-[1.35rem] border p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        aria-labelledby="home-lessons-title"
      >
        <div className="absolute -right-10 -top-16 -z-10 h-40 w-40 rounded-full bg-fuchsia-400/30 blur-3xl" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-white shadow-lg">
              <BookOpen className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-700 dark:text-fuchsia-200">Featured learning path</span>
              <strong id="home-lessons-title" className="mt-0.5 block text-xl font-black text-slate-950 dark:text-white">Lessons</strong>
              <span className="mt-1 block text-sm font-semibold text-slate-600 dark:text-slate-300">Guided interactive lessons, advanced concepts, and school learning paths.</span>
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition group-hover:bg-fuchsia-700 dark:bg-white dark:text-slate-950">
            Open Lessons <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      <Link
        to="/math-lab/3d-graphing"
        className="group grid max-w-md grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-cyan-100 bg-white/85 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-300/40 dark:hover:bg-cyan-400/10"
        aria-labelledby="home-3d-graph-title"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
          <Cuboid className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-[10px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Interactive 3D graph</span>
          <span id="home-3d-graph-title" className="mt-0.5 block truncate text-sm font-black text-slate-950 dark:text-white">Current 3D surface lab preserved</span>
        </span>
        <ArrowRight className="h-4 w-4 text-cyan-600 transition group-hover:translate-x-0.5 dark:text-cyan-300" />
      </Link>

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
      <HomePageDirectory query={normalizedQuery} />
    </div>
  );
}

function HomePageDirectory({ query }: { query: string }) {
  const visibleSections = navSections
    .map((section) => ({
      section,
      items: section.items.filter((item) => navItemMatches(item, query, section.title)),
    }))
    .filter(({ items }) => items.length > 0);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => ({
    [navSections[0]?.title ?? ""]: true,
  }));
  const searchIsActive = Boolean(query);
  const allExpanded = visibleSections.every(({ section }) => searchIsActive || expandedCategories[section.title]);
  const setAllCategories = (expanded: boolean) => {
    setExpandedCategories(Object.fromEntries(visibleSections.map(({ section }) => [section.title, expanded])));
  };

  return (
    <section className="home-page-directory" aria-labelledby="home-page-directory-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Everything in Math Universe</p>
          <h2 id="home-page-directory-title" className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Categories &amp; subcategories</h2>
          <p className="mt-1 max-w-3xl text-sm font-semibold text-slate-600 dark:text-slate-300">Open a category, then choose a subcategory or page.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="mini-chip"><FolderTree className="h-3.5 w-3.5" />{visibleSections.length} categories</span>
          <button
            type="button"
            className="home-directory-expand-all"
            onClick={() => setAllCategories(!allExpanded)}
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>
      <div className="mt-3 grid items-start gap-3 lg:grid-cols-2">
        {visibleSections.map(({ section, items }) => (
          <HomeCategoryPanel
            key={section.title}
            section={section}
            items={items}
            query={query}
            open={searchIsActive || Boolean(expandedCategories[section.title])}
            onToggle={() => setExpandedCategories((current) => ({
              ...current,
              [section.title]: !current[section.title],
            }))}
          />
        ))}
      </div>
    </section>
  );
}

function HomeCategoryPanel({ section, items, query, open, onToggle }: {
  section: (typeof navSections)[number];
  items: NavItem[];
  query: string;
  open: boolean;
  onToggle: () => void;
}) {
  const SectionIcon = iconMap[section.icon];
  const panelId = `home-category-${slugForId(section.title)}`;
  const pageCount = items.reduce((total, item) => total + countDirectoryPages(item), 0);
  return (
    <section className={`home-page-category${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="home-category-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="home-category-icon"><SectionIcon className="h-5 w-5" /></span>
        <span className="min-w-0 text-left">
          <span className="block text-base font-black text-slate-950 dark:text-white">{section.title}</span>
          <span className="mt-0.5 block text-xs font-bold text-slate-500 dark:text-slate-400">{items.length} subcategories · {pageCount} pages</span>
        </span>
        <ChevronDown className="home-directory-chevron ml-auto h-5 w-5 shrink-0" />
      </button>
      {open && (
        <div id={panelId} className="home-category-content">
          {items.map((item) => <HomeDirectoryItem key={`${item.title}-${item.route}`} item={item} query={query} />)}
        </div>
      )}
    </section>
  );
}

function HomeDirectoryItem({ item, query, depth = 0 }: { item: NavItem; query: string; depth?: number }) {
  const Icon = iconMap[item.icon];
  const children = (item.children ?? []).filter((child) => navItemMatches(child, query, item.title));
  const [expanded, setExpanded] = useState(false);
  const open = Boolean(query) || expanded;
  const childrenId = `home-subcategory-${slugForId(`${item.title}-${item.route}`)}`;

  if (children.length > 0) {
    return (
      <div className={`home-directory-item home-directory-subcategory${open ? " is-open" : ""}`} style={{ "--directory-depth": depth } as CSSProperties}>
        <button
          type="button"
          className="home-subcategory-toggle"
          aria-expanded={open}
          aria-controls={childrenId}
          onClick={() => setExpanded((value) => !value)}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span>{item.title}</span>
          <span className="home-directory-count">{children.length}</span>
          <ChevronDown className="home-directory-chevron h-4 w-4 shrink-0" />
        </button>
        {open && (
          <div id={childrenId} className="home-directory-children">
            <DirectoryLink item={item} label={`${item.title} overview`} />
            {children.map((child) => <HomeDirectoryItem key={`${child.title}-${child.route}`} item={child} query={query} depth={depth + 1} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="home-directory-item" style={{ "--directory-depth": depth } as CSSProperties}>
      <DirectoryLink item={item} />
    </div>
  );
}

function DirectoryLink({ item, label = item.title }: { item: NavItem; label?: string }) {
  const Icon = iconMap[item.icon];
  return item.isExternal ? (
    <a href={item.route} target="_blank" rel="noreferrer" className="home-directory-link"><Icon className="h-4 w-4 shrink-0" /><span>{label}</span></a>
  ) : (
    <Link to={item.route} className="home-directory-link"><Icon className="h-4 w-4 shrink-0" /><span>{label}</span></Link>
  );
}

function navItemMatches(item: NavItem, query: string, category: string) {
  if (!query) return true;
  const matchesSelf = `${category} ${item.title} ${item.route} ${item.description ?? ""} ${(item.searchTerms ?? []).join(" ")}`.toLowerCase().includes(query);
  return matchesSelf || (item.children ?? []).some((child) => navItemMatches(child, query, item.title));
}

function countDirectoryPages(item: NavItem): number {
  return 1 + (item.children ?? []).reduce((total, child) => total + countDirectoryPages(child), 0);
}

function slugForId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
    { title: "Algebra", text: "Master expressions, equations, and patterns visually.", route: "/algebra", className: "algebra" },
    { title: "Geometry", text: "Explore shapes, theorems, and spatial reasoning.", route: "/geometry", className: "geometry" },
    { title: "Trigonometry", text: "Understand angles, identities, and wave functions.", route: "/trigonometry", className: "trig" },
    { title: "Calculus Studio", text: "Visualize change, limits, and area under curves.", route: "/calculus", className: "calculus" },
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

