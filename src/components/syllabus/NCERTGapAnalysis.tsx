import { AlertTriangle, CheckCircle2, ExternalLink, Hammer, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { ncertGapItems, ncertGapSummary, type NCERTGapStatus } from "../../data/ncertGapAnalysis";
import SectionCard from "../ui/SectionCard";

const statusMeta: Record<NCERTGapStatus, { label: string; className: string }> = {
  strong: { label: "Strong", className: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200" },
  partial: { label: "Partial", className: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200" },
  missing: { label: "Missing", className: "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200" },
  external: { label: "External", className: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200" },
};

const classLevels = ["Class 7", "Class 8", "Class 9", "Class 10"] as const;

export default function NCERTGapAnalysis() {
  return (
    <SectionCard title="NCERT Classes 7-10 Gap Analysis" description="Chapter-by-chapter coverage against the current Math Universe app. Strong means a focused visual lab exists; partial means related support exists; missing means we should build a new module.">
      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <SummaryTile label="Strong coverage" value={ncertGapSummary.strong} icon={<CheckCircle2 className="h-5 w-5" />} tone="from-emerald-400 to-cyan-500" />
        <SummaryTile label="Partial coverage" value={ncertGapSummary.partial} icon={<Layers className="h-5 w-5" />} tone="from-cyan-400 to-blue-500" />
        <SummaryTile label="Missing modules" value={ncertGapSummary.missing} icon={<AlertTriangle className="h-5 w-5" />} tone="from-rose-400 to-orange-500" />
        <SummaryTile label="External Anveshak" value={ncertGapSummary.external} icon={<ExternalLink className="h-5 w-5" />} tone="from-violet-400 to-fuchsia-500" />
      </div>

      <div className="space-y-5">
        {classLevels.map((level) => {
          const items = ncertGapItems.filter((item) => item.classLevel === level);
          return (
            <div key={level} className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-slate-950/45">
              <div className="gradient-line" />
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <h3 className="text-lg font-black">{level}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{items.length} NCERT chapters mapped</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["strong", "partial", "missing", "external"] as NCERTGapStatus[]).map((status) => (
                    <span key={status} className={`rounded-full border px-3 py-1 text-xs font-bold ${statusMeta[status].className}`}>
                      {statusMeta[status].label}: {items.filter((item) => item.status === status).length}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 p-4 pt-0 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article key={`${item.classLevel}-${item.chapter}`} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold">{item.chapter}</h4>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusMeta[item.status].className}`}>{statusMeta[item.status].label}</span>
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Current</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.currentCoverage}</p>
                    <p className="mt-3 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Build next</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.recommendedBuild}</p>
                    {item.route && (
                      item.route.startsWith("http") ? (
                        <a href={item.route} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-300">Open related lab <ExternalLink className="h-3.5 w-3.5" /></a>
                      ) : (
                        <Link to={item.route} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-300">Open related lab <ExternalLink className="h-3.5 w-3.5" /></Link>
                      )
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-white/10 p-3"><Hammer className="h-5 w-5 text-amber-300" /></span>
          <div>
            <p className="font-bold">Highest priority missing builds</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Number system labs for Classes 7-10, comparing quantities, exponents, square/cube roots, AP, Euclid algorithm, Heron's formula workflow, and heights-and-distances trigonometry.</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function SummaryTile({ label, value, icon, tone }: { label: string; value: number; icon: JSX.Element; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div className={`mb-3 inline-flex rounded-2xl bg-gradient-to-br ${tone} p-3 text-white shadow-lg`}>{icon}</div>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}
