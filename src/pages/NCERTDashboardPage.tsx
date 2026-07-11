import { BookOpen, CheckCircle2, ExternalLink, FlaskConical, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import { ncertConcepts, ncertRoute, type NCERTConcept } from "../data/ncertConcepts";
import { ncertGapItems } from "../data/ncertGapAnalysis";
import { getNCERTPracticeItems } from "../data/ncertPracticeBank";
import { getNCERTConceptResourceLinks } from "../data/ncertResourceLinks";
import { emptyMasteryRecord, masteryStatus, readNCERTMasteryStore } from "../hooks/useNCERTMastery";

const priorityClasses = ["Class 7", "Class 10", "Class 12"] as const;

const classDescriptions: Record<(typeof priorityClasses)[number], string> = {
  "Class 7": "Foundational number sense, operations, equations, lines, triangles, constructions, and tilings.",
  "Class 10": "Board-exam algebra, geometry theorems, trigonometry, statistics, probability, and mensuration.",
  "Class 12": "Relations, matrices, determinants, calculus, differential equations, vectors, 3D geometry, LPP, and probability.",
};

const realVisualTypes = new Set([
  "grade7-large-numbers-lab",
  "grade7-arithmetic-expressions-lab",
  "grade7-decimal-operations-lab",
  "grade7-fraction-operations-lab",
  "grade7-constructions-tilings-lab",
  "grade7-lines-triangles-lab",
  "class12-relations-functions-lab",
  "class12-determinants-lab",
  "class12-continuity-differentiability-lab",
  "class12-integration-methods-lab",
  "class12-differential-equations-lab",
  "class12-vectors-3d-geometry-lab",
  "class12-bayes-theorem-lab",
  "class12-linear-programming-lab",
  "class12-inverse-trig-lab",
  "root-coefficients",
  "linear-method-stepper",
  "triangle-similarity-lab",
  "circle-tangent-lab",
  "circle-area-lab",
  "solids-lab",
  "grouped-statistics-lab",
  "special-trig-angles",
]);

export default function NCERTDashboardPage() {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<"All" | (typeof priorityClasses)[number]>("All");

  const visibleConcepts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ncertConcepts.filter((concept) => {
      const matchesClass = classFilter === "All" || concept.classLevel === classFilter;
      const resources = getNCERTConceptResourceLinks(concept);
      const searchable = [
        concept.classLevel,
        concept.title,
        concept.unit,
        concept.summary,
        concept.formula,
        concept.visual,
        ...concept.outcomes,
        ...concept.tasks,
        ...resources.flatMap((resource) => [resource.label, resource.href, resource.type, resource.exactness, ...(resource.keywords ?? [])]),
      ].join(" ").toLowerCase();
      return matchesClass && (!q || searchable.includes(q));
    });
  }, [classFilter, query]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-cyan-200 bg-white/95 p-5 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">NCERT visual learning index</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">NCERT Dashboard</h1>
            <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
              Browse NCERT concepts by class, jump into real visual labs, and see whether each concept has formula, theorem/proof, visualization, practice, and QA coverage.
            </p>
          </div>
          <Link to="/syllabus" className="action-secondary">
            <BookOpen className="h-4 w-4" />
            Syllabus map
          </Link>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-3">
        {priorityClasses.map((classLevel) => {
          const concepts = ncertConcepts.filter((concept) => concept.classLevel === classLevel);
          const strong = concepts.filter((concept) => realVisualTypes.has(concept.visual)).length;
          return (
            <button
              key={classLevel}
              type="button"
              onClick={() => setClassFilter(classLevel)}
              className={`rounded-3xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${classFilter === classLevel ? "border-cyan-400 bg-cyan-50 dark:border-cyan-300 dark:bg-cyan-300/10" : "border-slate-200 bg-white/90 dark:border-white/10 dark:bg-white/5"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-black">{classLevel}</h2>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white dark:bg-white dark:text-slate-950">{concepts.length} routes</span>
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{classDescriptions[classLevel]}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge label={`${strong} real visuals`} tone="emerald" />
                <Badge label={`${concepts.length - strong} needs polish`} tone="amber" />
              </div>
            </button>
          );
        })}
      </div>

      <SectionCard title="Search NCERT concepts" description="Search by class, chapter, formula, theorem word, common student term, visual type, or topic.">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex items-center gap-2 rounded-2xl border border-cyan-200 bg-white px-3 py-2 dark:border-cyan-300/20 dark:bg-slate-950">
            <Search className="h-4 w-4 text-cyan-600" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold outline-none"
              placeholder="Try tangent, determinant, fraction, BODMAS, Bayes..."
            />
          </label>
          <select value={classFilter} onChange={(event) => setClassFilter(event.target.value as typeof classFilter)} className="rounded-2xl border border-cyan-200 bg-white px-3 py-3 text-sm font-bold dark:border-cyan-300/20 dark:bg-slate-950">
            <option value="All">All priority classes</option>
            {priorityClasses.map((classLevel) => <option key={classLevel} value={classLevel}>{classLevel}</option>)}
          </select>
        </div>
      </SectionCard>

      {priorityClasses.map((classLevel) => {
        const concepts = visibleConcepts.filter((concept) => concept.classLevel === classLevel);
        if (concepts.length === 0) return null;
        return (
          <section key={classLevel} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">{classLevel}</h2>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{concepts.length} visible NCERT routes</p>
              </div>
              <Link to={`/syllabus/${classLevel.toLowerCase().replace(" ", "-")}`} className="text-sm font-black text-cyan-700 dark:text-cyan-200">
                Open class syllabus
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {concepts.map((concept) => <ConceptCard key={concept.id} concept={concept} />)}
            </div>
          </section>
        );
      })}

      <SectionCard title="Gap dashboard bridge" description="These cards are also available in the syllabus dashboard, but surfaced here so NCERT does not hide behind a generic syllabus page.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ncertGapItems.filter((item) => priorityClasses.includes(item.classLevel as (typeof priorityClasses)[number])).map((item) => (
            <article key={`${item.classLevel}-${item.chapter}`} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-black">{item.classLevel}: {item.chapter}</h3>
                <Badge label={item.status === "strong" ? "Strong" : item.status === "partial" ? "Partial" : "Missing"} tone={item.status === "strong" ? "emerald" : item.status === "partial" ? "amber" : "rose"} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.currentCoverage}</p>
              {item.route && <Link to={item.route} className="mt-3 inline-flex items-center gap-2 text-sm font-black text-cyan-700 dark:text-cyan-200">Open route <ExternalLink className="h-3.5 w-3.5" /></Link>}
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ConceptCard({ concept }: { concept: NCERTConcept }) {
  const realVisual = realVisualTypes.has(concept.visual);
  const practiceReady = concept.tasks.length >= 3;
  const resources = getNCERTConceptResourceLinks(concept);
  const hasFormula = resources.some((resource) => resource.type === "formula");
  const hasTheorem = resources.some((resource) => resource.type === "theorem");
  const hasProof = resources.some((resource) => resource.type === "visual-proof");
  const hasTool = resources.some((resource) => ["math-lab", "workspace", "ar-xr"].includes(resource.type));
  const practiceCount = getNCERTPracticeItems(concept.id).length;
  const mastery = typeof window === "undefined" ? emptyMasteryRecord() : readNCERTMasteryStore()[concept.id] ?? emptyMasteryRecord();

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{concept.unit}</p>
          <h3 className="mt-1 text-lg font-black">{concept.title}</h3>
        </div>
        <Badge label={realVisual ? "Strong" : "Needs QA"} tone={realVisual ? "emerald" : "amber"} />
      </div>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{concept.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {hasFormula && <Badge label="Formula" tone="cyan" icon={<BookOpen className="h-3 w-3" />} />}
        {hasTheorem && <Badge label="Theorem" tone="violet" icon={<ShieldCheck className="h-3 w-3" />} />}
        {hasProof && <Badge label="Proof" tone="violet" icon={<ShieldCheck className="h-3 w-3" />} />}
        {hasTool && <Badge label="Tool" tone="cyan" icon={<FlaskConical className="h-3 w-3" />} />}
        <Badge label={realVisual ? "Real Visualization" : "Visual Needs QA"} tone={realVisual ? "emerald" : "amber"} icon={<Sparkles className="h-3 w-3" />} />
        {practiceReady && <Badge label="Practice" tone="cyan" icon={<FlaskConical className="h-3 w-3" />} />}
        {practiceCount > 0 && <Badge label={`${practiceCount} checked Qs`} tone="emerald" icon={<FlaskConical className="h-3 w-3" />} />}
        {practiceCount > 0 && <Badge label="Worksheet" tone="amber" icon={<BookOpen className="h-3 w-3" />} />}
        {practiceCount > 0 && <Badge label={masteryStatus(mastery)} tone="slate" icon={<CheckCircle2 className="h-3 w-3" />} />}
        <Badge label="Browser QA" tone="slate" icon={<CheckCircle2 className="h-3 w-3" />} />
      </div>
      <div className="mt-4 rounded-2xl bg-slate-100 p-3 text-xs font-mono font-black text-slate-700 dark:bg-slate-950 dark:text-slate-200">{concept.formula}</div>
      <Link to={ncertRoute(concept.id)} className="action-primary mt-4 w-full justify-center">
        Open visual lab
        <ExternalLink className="h-4 w-4" />
      </Link>
    </article>
  );
}

function Badge({ label, tone, icon }: { label: string; tone: "emerald" | "amber" | "rose" | "cyan" | "violet" | "slate"; icon?: JSX.Element }) {
  const classes = {
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100",
    amber: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100",
    rose: "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-100",
    cyan: "border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100",
    violet: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-100",
    slate: "border-slate-300 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-100",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black ${classes}`}>{icon}{label}</span>;
}
