import { BookOpen, Calculator, Cuboid, FlaskConical, LibraryBig, Trophy, Route } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardCard from "../components/ui/DashboardCard";
import AITutorPanel from "../components/ui/AITutorPanel";
import StatCard from "../components/ui/StatCard";
import { iconMap } from "../components/layout/navItems";
import { allSyllabusTopics } from "../data/syllabus";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import InquirySimulationLabs from "../components/inquiry/InquirySimulationLabs";

const demoFlow = [
  "Algebra line graph",
  "Geometry 3D shape",
  "Trigonometry unit circle",
  "Calculus derivative",
  "Euler 3D visualization",
  "Anveshak statistics app",
  "Linear algebra transformation",
  "AI gradient descent",
  "Quiz result",
];

export default function Home() {
  const { getTopicProgress, getOverallProgress } = useProgress();
  const labs = topics.reduce((sum, topic) => sum + topic.labCount, 0);
  const extraCards = [
    {
      title: "Math Lab",
      description: "GeoGebra-style visual tools and WolframAlpha-style solving workspace for graphing, solving, symbolic algebra, calculus, statistics, probability, geometry, linear algebra, and 3D graphs.",
      concepts: ["Graphing", "Solving", "CAS", "3D graphs"],
      icon: FlaskConical,
      route: "/math-lab",
      colorGradient: "from-slate-950 to-cyan-600",
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

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-white via-cyan-50 to-violet-100 p-6 shadow-glow dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950 md:p-8">
        <div className="absolute right-6 top-6 hidden rounded-full border border-cyan-200 bg-white/70 px-4 py-2 text-xs font-bold text-cyan-700 dark:border-cyan-400/20 dark:bg-white/10 dark:text-cyan-200 md:block">Competition demo ready</div>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Math Universe</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">Explore mathematics visually, from simple equations to AI, waves, geometry, calculus, and complex numbers.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Interactive", "Visual", "Browser-only", "Progress-aware"].map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/syllabus" className="action-primary w-fit">Open Syllabus Universe</Link>
          <Link to="/calculator" className="action-secondary w-fit">
            <Calculator className="h-4 w-4" />
            Open Scientific Calculator
          </Link>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Topics" value={topics.length} icon={BookOpen} accent="from-cyan-500 to-blue-600" />
        <StatCard label="Interactive Labs" value={labs} icon={FlaskConical} accent="from-violet-500 to-fuchsia-600" />
        <StatCard label="Syllabus Topics" value={allSyllabusTopics.length} icon={LibraryBig} accent="from-amber-400 to-orange-600" />
        <StatCard label="Progress" value={`${getOverallProgress()}%`} icon={Route} accent="from-emerald-400 to-cyan-600" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard label="Quiz Topics" value="8" icon={Trophy} accent="from-rose-400 to-orange-600" />
        <StatCard label="Learning Tools" value="2" icon={Calculator} accent="from-sky-500 to-violet-600" />
      </div>
      <InquirySimulationLabs />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => {
          const Icon = iconMap[topic.iconName as keyof typeof iconMap] ?? BookOpen;
          return <DashboardCard key={topic.id} title={topic.title} description={topic.description} concepts={topic.concepts} icon={Icon} route={topic.route} isExternal={topic.isExternal} progress={getTopicProgress(topic.id)} colorGradient={topic.colorGradient} />;
        })}
        {extraCards.map((card) => <DashboardCard key={card.title} title={card.title} description={card.description} concepts={card.concepts} icon={card.icon} route={card.route} progress={0} colorGradient={card.colorGradient} />)}
      </div>
      <section className="glass-card rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Recommended Demo Flow</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">A clean path for a short LinkedIn walkthrough.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {demoFlow.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-white">{index + 1}</span>
              <span className="text-sm font-semibold">{step}</span>
            </div>
          ))}
        </div>
      </section>
      <AITutorPanel />
    </div>
  );
}
