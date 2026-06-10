import { ArrowRight, BrainCircuit, Gauge, Route, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { buildSyllabusIntelligence, recommendedLearningPath, syllabusCoverageSummary } from "../../data/syllabusIntelligence";
import type { SyllabusTopic } from "../../data/syllabus";
import SectionCard from "../ui/SectionCard";

export default function SmartSyllabusPlanner({ topics, levelId }: { topics: SyllabusTopic[]; levelId: string }) {
  const summary = syllabusCoverageSummary(topics);
  const units = buildSyllabusIntelligence(topics).slice(0, 6);
  const path = recommendedLearningPath(levelId, 6);

  return (
    <SectionCard title="Smart Syllabus Intelligence" description="Browser-only planner that ranks coverage, recommends guided workspace templates, and turns syllabus gaps into launchable teaching paths.">
      <div className="grid gap-4 lg:grid-cols-4">
        <Metric label="Readiness" value={`${summary.readiness}%`} icon={<Gauge className="h-5 w-5" />} />
        <Metric label="Available" value={summary.available} icon={<Sparkles className="h-5 w-5" />} />
        <Metric label="Mapped" value={summary.mapped} icon={<Route className="h-5 w-5" />} />
        <Metric label="Future" value={summary.future} icon={<Target className="h-5 w-5" />} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200"><BrainCircuit className="h-5 w-5" /></span>
            <div>
              <h3 className="font-bold">Unit Priority Engine</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Highest scores need new visual depth or stronger guided paths.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {units.map((unit) => (
              <div key={unit.unit} className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{unit.unit}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{unit.reason}</p>
                  </div>
                  <span className="mini-chip">score {unit.priorityScore}</span>
                </div>
                <div className="mt-3 grid gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 sm:grid-cols-4">
                  <span>{unit.total} topics</span>
                  <span>{unit.available} available</span>
                  <span>{unit.mapped} mapped</span>
                  <span>{unit.readiness}% ready</span>
                </div>
                <Link to={unit.recommendedRoute} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-300">
                  Launch recommended path <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-bold">Recommended Next Lessons</h3>
          <div className="mt-4 space-y-3">
            {path.map((item) => (
              <div key={item.topic.id} className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{item.topic.classLevel} / {item.topic.unit}</p>
                    <p className="mt-1 font-bold">{item.topic.title}</p>
                  </div>
                  <span className="mini-chip">{item.score}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.action}</p>
                {item.gap && <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Gap note: {item.gap.recommendedBuild}</p>}
                {item.workspaceRoute.startsWith("http") ? (
                  <a href={item.workspaceRoute} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-300">Open lab <ArrowRight className="h-4 w-4" /></a>
                ) : (
                  <Link to={item.workspaceRoute} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-300">Open guided lab <ArrowRight className="h-4 w-4" /></Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: JSX.Element }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 inline-flex rounded-2xl bg-slate-950 p-3 text-white dark:bg-white dark:text-slate-950">{icon}</div>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
