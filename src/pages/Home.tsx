import { BookOpen, FlaskConical, Trophy, Route } from "lucide-react";
import DashboardCard from "../components/ui/DashboardCard";
import AITutorPanel from "../components/ui/AITutorPanel";
import StatCard from "../components/ui/StatCard";
import { iconMap } from "../components/layout/navItems";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";

const demoFlow = [
  "Algebra line graph",
  "Geometry 3D shape",
  "Trigonometry unit circle",
  "Calculus derivative",
  "Euler 3D visualization",
  "Statistics simulator",
  "Linear algebra transformation",
  "AI gradient descent",
  "Quiz result",
];

export default function Home() {
  const { getTopicProgress, getOverallProgress } = useProgress();
  const labs = topics.reduce((sum, topic) => sum + topic.labCount, 0);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/60 bg-gradient-to-br from-white via-cyan-50 to-violet-100 p-6 shadow-glow dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950 md:p-8">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Math Universe</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">Explore mathematics visually — from simple equations to AI, waves, geometry, calculus, and complex numbers.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Topics" value={topics.length} icon={BookOpen} accent="from-cyan-500 to-blue-600" />
        <StatCard label="Interactive Labs" value={labs} icon={FlaskConical} accent="from-violet-500 to-fuchsia-600" />
        <StatCard label="Quizzes" value="3+" icon={Trophy} accent="from-amber-400 to-orange-600" />
        <StatCard label="Progress" value={`${getOverallProgress()}%`} icon={Route} accent="from-emerald-400 to-cyan-600" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => {
          const Icon = iconMap[topic.iconName as keyof typeof iconMap] ?? BookOpen;
          return <DashboardCard key={topic.id} title={topic.title} description={topic.description} concepts={topic.concepts} icon={Icon} route={topic.route} progress={getTopicProgress(topic.id)} colorGradient={topic.colorGradient} />;
        })}
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
