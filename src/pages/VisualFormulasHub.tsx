import {
  ArrowRight,
  BarChart3,
  Calculator,
  ChartSpline,
  CircleHelp,
  Cuboid,
  FunctionSquare,
  Grid3X3,
  Hash,
  Network,
  Search,
  Shapes,
  Sigma,
  Sparkles,
  Waves,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../components/ui/MathExpression";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { formulaVisualizerConfigs, type FormulaVisualizerRouteConfig } from "../data/formulaVisualizerRoutes";

type VisualFormulaGroup = "All" | "Algebra" | "Geometry" | "Calculus" | "Data" | "Discrete" | "Advanced";

const groups: VisualFormulaGroup[] = ["All", "Algebra", "Geometry", "Calculus", "Data", "Discrete", "Advanced"];

const groupRules: Array<{ group: Exclude<VisualFormulaGroup, "All">; ids: string[] }> = [
  { group: "Algebra", ids: ["algebra", "polynomials", "inequalities", "number-systems", "relations-functions", "sequences-series", "complex-numbers"] },
  { group: "Geometry", ids: ["geometry", "coordinate-geometry", "mensuration", "trigonometry", "vectors"] },
  { group: "Calculus", ids: ["derivatives", "integration", "limits-continuity", "differential-equations", "multivariable-calculus"] },
  { group: "Data", ids: ["probability", "statistics", "probability-distributions"] },
  { group: "Discrete", ids: ["combinatorics", "set-theory", "discrete-math", "information-theory", "cryptography"] },
];

export default function VisualFormulasHub() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<VisualFormulaGroup>("All");
  const formulaCount = formulaVisualizerConfigs.reduce((total, config) => total + config.formulas.length, 0);
  const categories = new Set(formulaVisualizerConfigs.map((config) => getGroup(config))).size;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return formulaVisualizerConfigs.filter((config) => {
      const matchesGroup = group === "All" || getGroup(config) === group;
      const matchesQuery =
        !normalized ||
        [
          config.title,
          config.shortTitle,
          config.category,
          config.subtitle,
          config.description,
          config.route,
          ...config.searchTerms,
          ...config.formulas.flatMap((formula) => [formula.title, formula.group, formula.difficulty, formula.plainText, ...formula.tags]),
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesGroup && matchesQuery;
    });
  }, [group, query]);

  return (
    <main className="desktop-page-shell" data-testid="visual-formulas-hub-page">
      <div className="mx-auto flex w-full max-w-[1580px] flex-col gap-3">
        <TopicHeader
          title="Visual Formulas"
          subtitle="Launch every interactive formula visualizer from one compact classroom hub."
          difficulty="Formula Lab"
          estimatedMinutes={12}
          progress={100}
        />

        <section className="overflow-hidden rounded-xl border border-cyan-200/70 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20 dark:border-cyan-300/20">
          <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:p-5">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Formula launchpad
              </p>
              <h2 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Pick a concept, open the visual formula lab, teach from the model.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50/75">
                Cards are generated from the formula visualizer registry, so this page stays aligned with the real routes and formulas already implemented in the app.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/trigonometry/formula-visualizer" className="action-primary">
                  Launch Trigonometry
                </Link>
                <Link to="/algebra/formula-visualizer" className="action-secondary">
                  Launch Algebra
                </Link>
                <Link to="/geometry/formula-visualizer" className="action-secondary">
                  Launch Geometry
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <HubStat label="Visualizers" value={formulaVisualizerConfigs.length} />
              <HubStat label="Formulas" value={formulaCount} />
              <HubStat label="Groups" value={categories} />
            </div>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="cinematic-control-panel scroll-panel lg:sticky lg:top-24">
            <label className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400" htmlFor="visual-formula-search">
              Find visual formulas
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-cyan-100 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <Search className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              <input
                id="visual-formula-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search concept, formula, tag..."
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {groups.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGroup(item)}
                  className={item === group ? "action-primary min-h-10 justify-center px-3 py-2 text-sm" : "action-secondary min-h-10 justify-center px-3 py-2 text-sm"}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-cyan-100 bg-cyan-50/80 p-3 text-sm text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
              <p className="font-black">Teacher flow</p>
              <p className="mt-1 leading-5">Open the relevant card, use the visual formula bank tab, then jump to the formula library or related proof from inside the visualizer.</p>
            </div>
          </aside>

          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-100 bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-sm font-black text-slate-900 dark:text-white">{filtered.length} visual formula pages</p>
              <Link to="/formulas" className="text-sm font-black text-cyan-700 hover:text-cyan-900 dark:text-cyan-200">
                Open formula library
              </Link>
            </div>

            {filtered.length === 0 ? (
              <SectionCard title="No visualizer found" description="Try a broader concept name such as algebra, geometry, calculus, probability, or matrices." />
            ) : (
              <div className="grid gap-3 xl:grid-cols-2">
                {filtered.map((config) => (
                  <VisualFormulaCard key={config.id} config={config} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function VisualFormulaCard({ config }: { config: FormulaVisualizerRouteConfig }) {
  const Icon = iconForConfig(config);
  const defaultFormula = config.formulas.find((formula) => formula.id === config.defaultFormulaId) ?? config.formulas[0];
  const groups = Array.from(new Set(config.formulas.map((formula) => formula.group))).slice(0, 4);
  const difficulties = Array.from(new Set(config.formulas.map((formula) => formula.difficulty))).join(" / ");

  return (
    <article className="group rounded-xl border border-cyan-100 bg-white p-3 shadow-lg shadow-cyan-100/40 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/80 dark:shadow-black/20 dark:hover:border-cyan-300/40">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white shadow-lg shadow-cyan-200/50 dark:shadow-cyan-950/30">
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{config.category}</p>
          <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950 dark:text-white">{config.shortTitle}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{config.subtitle}</p>
        </div>
      </div>

      {defaultFormula && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Starts with</p>
          <div className="mt-1 text-base font-black text-slate-950 dark:text-white">
            <MathExpression value={defaultFormula.latex} />
          </div>
          <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{defaultFormula.title}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge label={`${config.formulas.length} formulas`} />
        <Badge label={difficulties} />
        {groups.map((item) => (
          <Badge key={item} label={item} />
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <Link to={config.route} className="action-primary justify-center">
          Launch {config.shortTitle} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to={config.formulaLibraryRoute} className="action-secondary justify-center">
          Library
        </Link>
      </div>
    </article>
  );
}

function HubStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-cyan-100/75">{label}</p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-black text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
      {label}
    </span>
  );
}

function getGroup(config: FormulaVisualizerRouteConfig): Exclude<VisualFormulaGroup, "All"> {
  const found = groupRules.find((rule) => rule.ids.includes(config.id));
  if (found) return found.group;
  if (config.category.toLowerCase().includes("calculus")) return "Calculus";
  if (config.category.toLowerCase().includes("probability") || config.category.toLowerCase().includes("statistics")) return "Data";
  if (config.category.toLowerCase().includes("geometry")) return "Geometry";
  if (config.category.toLowerCase().includes("algebra")) return "Algebra";
  return "Advanced";
}

function iconForConfig(config: FormulaVisualizerRouteConfig): LucideIcon {
  if (config.id === "trigonometry") return Waves;
  if (config.id.includes("geometry") || config.id === "mensuration") return Shapes;
  if (config.id.includes("derivatives") || config.id.includes("integration") || config.id.includes("calculus")) return Sigma;
  if (config.id.includes("matrices")) return Grid3X3;
  if (config.id.includes("vectors")) return Workflow;
  if (config.id.includes("probability")) return CircleHelp;
  if (config.id.includes("statistics")) return BarChart3;
  if (config.id.includes("number")) return Hash;
  if (config.id.includes("set") || config.id.includes("discrete")) return Network;
  if (config.id.includes("relation") || config.id.includes("function")) return FunctionSquare;
  if (config.id.includes("sequence")) return ChartSpline;
  if (config.id.includes("mensuration") || config.id.includes("three-d")) return Cuboid;
  return Calculator;
}
