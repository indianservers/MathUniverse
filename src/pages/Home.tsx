import { BookOpen, Calculator, Cuboid, FlaskConical, LibraryBig, Trophy, Route, X, HelpCircle, ArrowRight, Sparkles, ShieldCheck, Target } from "lucide-react";
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
  const visibleTopicCards = topicCards.filter(({ topic }) => {
    if (homeFilter === "all") return true;
    if (homeFilter === "core") return ["algebra", "geometry", "trigonometry", "calculus", "complex", "linear-algebra"].includes(topic.id);
    if (homeFilter === "practice") return ["quiz"].includes(topic.id);
    if (homeFilter === "advanced") return !["algebra", "geometry", "trigonometry", "calculus", "complex", "linear-algebra"].includes(topic.id);
    return false;
  });
  const visibleToolCards = homeFilter === "all" || homeFilter === "tools" ? toolCards : [];

  return (
    <div className="space-y-3">
      <GuidedTourOverlay open={tourOpen} onClose={() => setTourOpen(false)} />

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-white/60 bg-white/85 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/75">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Math Universe</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Visual mathematics — equations, geometry, calculus, AI, and waves.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/syllabus" className="action-primary">Open Syllabus</Link>
          <Link to="/calculator" className="action-secondary"><Calculator className="h-4 w-4" />Calculator</Link>
          <button type="button" className="action-secondary" onClick={() => setTourOpen(true)}>
            <HelpCircle className="h-4 w-4" />Guided Tour
          </button>
        </div>
      </section>

      {recentItems.length > 0 && (
        <section className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500">Recent</span>
          {recentItems.map((item) => (
            <Link key={item.route} to={item.route} className="mini-chip transition hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-400/15 dark:hover:text-cyan-100">
              {item.title}
            </Link>
          ))}
        </section>
      )}

      <div className="flex gap-3 overflow-x-auto pb-1">
        {[
          { label: "Topics", value: topics.length, icon: BookOpen, color: "text-cyan-600 dark:text-cyan-300" },
          { label: "Labs", value: labs, icon: FlaskConical, color: "text-violet-600 dark:text-violet-300" },
          { label: "Syllabus", value: "6 levels", icon: LibraryBig, color: "text-amber-600 dark:text-amber-300" },
          { label: "Progress", value: `${getOverallProgress()}%`, icon: Route, color: "text-emerald-600 dark:text-emerald-300" },
          { label: "Quiz Topics", value: 8, icon: Trophy, color: "text-rose-600 dark:text-rose-300" },
          { label: "Tools", value: 2, icon: Calculator, color: "text-sky-600 dark:text-sky-300" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-sm font-black">{value}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
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
            className={homeFilter === id ? "action-primary" : "tool-button"}
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
      {homeFilter === "all" && <AITutorPanel />}
    </div>
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
      <div className="flex flex-wrap items-center gap-2">
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
