import { BarChart3, CircleDot, FunctionSquare, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../../../components/ui/SectionCard";
import TopicHeader from "../../../components/ui/TopicHeader";
import { distributionSpecs, type DistributionKind } from "../data/distributionAtlas";

const filters: Array<DistributionKind | "all"> = ["all", "discrete", "continuous"];

export default function DistributionAtlasPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DistributionKind | "all">("all");
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return distributionSpecs.filter((item) => {
      const matchesFilter = filter === "all" || item.kind === filter;
      const haystack = `${item.name} ${item.kind} ${item.family} ${item.shortUse} ${item.formula}`.toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [filter, query]);

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Distribution Atlas"
        subtitle="Separate probability distribution pages with live charts, parameters, formulas, theory, and model-selection notes."
        difficulty="Phase 1"
        estimatedMinutes={16}
      />

      <SectionCard title="Find a Distribution" description="Search by name, formula, family, or real-world use.">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold dark:border-white/10 dark:bg-slate-950/60">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent outline-none"
              placeholder="Search beta, Weibull, waiting time, counts..."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-100" : "mini-chip"}
                onClick={() => setFilter(item)}
              >
                {item === "all" ? "All" : item}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <Link
            key={item.id}
            to={item.route}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/70 dark:hover:border-cyan-400/40"
          >
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">
                {item.kind === "discrete" ? <BarChart3 className="h-5 w-5" /> : <FunctionSquare className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-black text-slate-950 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-100">{item.name}</h2>
                <p className="mt-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{item.kind} · {item.family}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-5 text-slate-600 dark:text-slate-300">{item.shortUse}</p>
            <code className="mt-3 block overflow-hidden text-ellipsis rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-cyan-100">
              {item.formula}
            </code>
          </Link>
        ))}
      </section>

      {visible.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm font-semibold text-slate-500 dark:border-white/15 dark:text-slate-400">
          No matching distribution found.
        </div>
      )}

      <SectionCard title="Phase 1 Model Families" description="This first pass covers the distributions most learners expect before advanced modelling.">
        <div className="grid gap-3 md:grid-cols-3">
          <Family label="Counts and trials" detail="Bernoulli, binomial, geometric, negative binomial, hypergeometric, Poisson, Poisson-binomial." />
          <Family label="Continuous shapes" detail="Uniform, normal, exponential, gamma, beta, lognormal, Weibull, Cauchy, Laplace, logistic." />
          <Family label="Inference laws" detail="Student t, chi-square, F, beta-binomial, Pareto, Rayleigh, triangular." />
        </div>
      </SectionCard>
    </div>
  );
}

function Family({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white"><CircleDot className="h-4 w-4 text-cyan-500" />{label}</p>
      <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{detail}</p>
    </div>
  );
}
