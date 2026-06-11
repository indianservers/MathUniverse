import { Link } from "react-router-dom";
import SectionCard from "../ui/SectionCard";
import { buildSyllabusTopicUpgradeTargets, unitUpgradeSummary, type UnitUpgradeTarget } from "../../data/unitUpgradePlan";
import type { SyllabusTopic } from "../../data/syllabus";

type UnitUpgradeDashboardProps = {
  topics: SyllabusTopic[];
};

const priorityClasses: Record<UnitUpgradeTarget["priority"], string> = {
  High: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
  Medium: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
};

function compactTargets(targets: UnitUpgradeTarget[]) {
  const byUnit = new Map<string, UnitUpgradeTarget>();
  for (const target of targets) {
    const current = byUnit.get(target.unit);
    if (!current || (target.priority === "High" && current.priority !== "High")) byUnit.set(target.unit, target);
  }
  return Array.from(byUnit.values()).sort((a, b) => {
    const priorityRank = { High: 0, Medium: 1, Low: 2 };
    return priorityRank[a.priority] - priorityRank[b.priority] || a.unit.localeCompare(b.unit);
  });
}

export default function UnitUpgradeDashboard({ topics }: UnitUpgradeDashboardProps) {
  const targets = compactTargets(buildSyllabusTopicUpgradeTargets(topics));
  const summary = unitUpgradeSummary(targets);

  return (
    <SectionCard
      title="Unit Upgrade Dashboard"
      description="Tracked fixes and upgrades for every visible syllabus unit, with native routes and quality targets kept close to the lesson list."
      headerAction={<Link to="/workspace?mode=guided" className="action-secondary">Open workspace</Link>}
    >
      <div className="grid gap-2 sm:grid-cols-4">
        {[
          ["Targets", summary.total],
          ["High priority", summary.highPriority],
          ["Native routes", summary.nativeRoutes],
          ["Units", summary.unitCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {targets.map((target) => (
          <article key={target.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950 dark:text-white">{target.unit}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{target.title}</p>
              </div>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold ${priorityClasses[target.priority]}`}>{target.priority}</span>
            </div>
            <div className="mt-3 space-y-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
              <p><span className="font-bold text-slate-800 dark:text-slate-100">Fix:</span> {target.modifications[0]}</p>
              <p><span className="font-bold text-slate-800 dark:text-slate-100">Upgrade:</span> {target.upgrades[0]}</p>
              <p><span className="font-bold text-slate-800 dark:text-slate-100">Target:</span> {target.qualityTargets[0]}</p>
            </div>
            <Link to={target.route} className="mt-3 inline-flex text-sm font-bold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100">
              Open unit
            </Link>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
