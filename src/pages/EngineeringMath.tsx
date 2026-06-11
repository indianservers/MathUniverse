import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, FlaskConical, Layers3, PlayCircle, Route, Search, Sigma, Target, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TopicHeader from "../components/ui/TopicHeader";
import { assessmentSummary, buildEngineeringAssessmentPlans, engineeringExamSprints, sprintReadiness } from "../data/engineeringAssessmentPlanner";
import { caseStudiesForDomain, caseStudySummary } from "../data/engineeringCaseStudies";
import { dependenciesForDomain, dependencyGraphSummary, learningPathsForDomain, unlocksForDomain } from "../data/engineeringDependencyGraph";
import { formulaAtlasSummary, formulasForDomain } from "../data/engineeringFormulaAtlas";
import {
  engineeringCoverageGaps,
  engineeringDomainById,
  engineeringMathDomains,
  engineeringMathMilestones,
  engineeringMathSummary,
} from "../data/engineeringMathBlueprint";
import { launcherCoverageSummary, launchersForDomain } from "../data/engineeringLabLaunchers";
import { engineeringSolverPresets } from "../data/engineeringMathSolvers";
import { practiceCoverageSummary, practicePackForDomain } from "../data/engineeringPracticePacks";
import { projectsForDomain, projectSummary } from "../data/engineeringProjects";
import { workedExamplesForDomain, workedExampleSummary } from "../data/engineeringWorkedExamples";

const semesterFilters = ["All", "M1", "M2", "M3", "M4"] as const;
const launcherFilters = ["all", "concept-lab", "workspace", "formula-map", "practice"] as const;

type SemesterFilter = (typeof semesterFilters)[number];
type LauncherFilter = (typeof launcherFilters)[number];

export default function EngineeringMath() {
  const [selectedId, setSelectedId] = useState(engineeringMathDomains[0]?.id ?? "");
  const [semesterFilter, setSemesterFilter] = useState<SemesterFilter>("All");
  const [launcherFilter, setLauncherFilter] = useState<LauncherFilter>("all");
  const [query, setQuery] = useState("");
  const selected = engineeringDomainById(selectedId) ?? engineeringMathDomains[0];
  const gaps = useMemo(() => engineeringCoverageGaps().filter((gap) => gap.domainId === selected?.id), [selected?.id]);
  const launchers = useMemo(() => {
    const base = launchersForDomain(selected?.id ?? "");
    return launcherFilter === "all" ? base : base.filter((launcher) => launcher.kind === launcherFilter);
  }, [launcherFilter, selected?.id]);
  const launcherSummary = useMemo(() => launcherCoverageSummary(), []);
  const visibleDomains = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return engineeringMathDomains.filter((domain) => {
      const semesterMatch = semesterFilter === "All" || domain.semesterBand.includes(semesterFilter);
      const haystack = [domain.title, domain.purpose, domain.semesterBand, ...domain.formulaFamilies, ...domain.applicationAreas, ...domain.workspaceTargets].join(" ").toLowerCase();
      return semesterMatch && (!normalized || haystack.includes(normalized));
    });
  }, [query, semesterFilter]);
  const quickStarts = useMemo(() => buildQuickStarts(), []);
  const readinessRows = useMemo(() => buildReadinessRows(), []);
  const solverPresets = useMemo(() => engineeringSolverPresets.filter((preset) => preset.domainId === selected?.id), [selected?.id]);
  const practicePack = useMemo(() => practicePackForDomain(selected?.id ?? ""), [selected?.id]);
  const practiceSummary = useMemo(() => practiceCoverageSummary(), []);
  const assessmentPlans = useMemo(() => buildEngineeringAssessmentPlans(), []);
  const selectedAssessment = useMemo(() => assessmentPlans.find((plan) => plan.domainId === selected?.id), [assessmentPlans, selected?.id]);
  const assessmentStats = useMemo(() => assessmentSummary(), []);
  const examSprints = useMemo(() => engineeringExamSprints.map(sprintReadiness), []);
  const formulaCards = useMemo(() => formulasForDomain(selected?.id ?? ""), [selected?.id]);
  const formulaSummary = useMemo(() => formulaAtlasSummary(), []);
  const dependencySummary = useMemo(() => dependencyGraphSummary(), []);
  const selectedDependencies = useMemo(() => dependenciesForDomain(selected?.id ?? ""), [selected?.id]);
  const selectedUnlocks = useMemo(() => unlocksForDomain(selected?.id ?? ""), [selected?.id]);
  const selectedLearningPaths = useMemo(() => learningPathsForDomain(selected?.id ?? ""), [selected?.id]);
  const workedExamples = useMemo(() => workedExamplesForDomain(selected?.id ?? ""), [selected?.id]);
  const workedSummary = useMemo(() => workedExampleSummary(), []);
  const projects = useMemo(() => projectsForDomain(selected?.id ?? ""), [selected?.id]);
  const projectsSummary = useMemo(() => projectSummary(), []);
  const caseStudies = useMemo(() => caseStudiesForDomain(selected?.id ?? ""), [selected?.id]);
  const caseStudiesSummary = useMemo(() => caseStudySummary(), []);

  return (
    <div className="space-y-3">
      <TopicHeader
        title="Engineering Mathematics"
        subtitle="B.Tech M1-M4 roadmap for calculus, differential equations, transforms, PDEs, numerical methods, probability, optimization, and field mathematics."
        difficulty="Engineering"
        estimatedMinutes={90}
      />

      <section className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Domains" value={engineeringMathSummary.domainCount} />
        <MetricCard label="Topics" value={engineeringMathSummary.topicCount} />
        <MetricCard label="Native routes" value={engineeringMathSummary.nativeRouteCount} />
        <MetricCard label="Formula families" value={engineeringMathSummary.formulaFamilyCount} />
        <MetricCard label="Worked examples" value={workedSummary.exampleCount} />
        <MetricCard label="Portfolio tasks" value={projectsSummary.projectCount} />
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Engineering Math Hub</p>
              <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Semester Command Center</h2>
            </div>
            <label className="flex min-h-10 min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/30 dark:border-white/10 dark:bg-white/5">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search PDE, rank, Laplace..." className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-slate-400" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {semesterFilters.map((filter) => (
              <button key={filter} type="button" onClick={() => setSemesterFilter(filter)} className={semesterFilter === filter ? "action-primary min-h-9 px-4 py-2 text-sm" : "action-secondary min-h-9 px-4 py-2 text-sm"}>
                {filter}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
            {visibleDomains.map((domain) => (
              <button key={domain.id} type="button" onClick={() => setSelectedId(domain.id)} className={`rounded-lg border p-3 text-left transition ${selected?.id === domain.id ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/40 dark:bg-cyan-300/15" : "border-slate-200 bg-slate-50 hover:border-cyan-200 dark:border-white/10 dark:bg-white/5"}`}>
                <span className="text-sm font-black text-slate-950 dark:text-white">{domain.title}</span>
                <span className="mt-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{domain.semesterBand} | {domain.topics.length} topics | {launchersForDomain(domain.id).length} launchers</span>
              </button>
            ))}
          </div>
          {visibleDomains.length === 0 && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">No engineering domains match this filter.</p>}
        </div>

        <Panel title="Quick Start Paths" icon={<Target className="h-4 w-4" />}>
          <div className="space-y-2">
            {quickStarts.map((path) => (
              <div key={path.title} className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                <p className="text-sm font-black text-slate-950 dark:text-white">{path.title}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{path.steps.join(" -> ")}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="desktop-sidebar-panel scroll-panel space-y-2 xl:sticky xl:top-24">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Main Menu</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-500 dark:bg-white/10 dark:text-slate-300">M1-M4</span>
          </div>
          {visibleDomains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => setSelectedId(domain.id)}
              className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                selected?.id === domain.id
                  ? "border-cyan-300 bg-cyan-50 text-slate-950 shadow-sm dark:border-cyan-300/40 dark:bg-cyan-300/15 dark:text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-cyan-300/10"
              }`}
            >
              <span className="block text-sm font-black">{domain.title}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{domain.semesterBand} | {domain.topics.length} mapped topics</span>
            </button>
          ))}
          {visibleDomains.length === 0 && <p className="rounded-lg bg-slate-100 p-3 text-xs font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">Adjust semester or search filters.</p>}
        </aside>

        {selected && (
          <main className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{selected.semesterBand}</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{selected.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{selected.purpose}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge label={selected.priority} tone={selected.priority === "High" ? "hot" : "cool"} />
                <Badge label={selected.status} tone={selected.status === "Live" ? "live" : "cool"} />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <Panel title="Workspace Targets" icon={<Wrench className="h-4 w-4" />}>
                <ChipList items={selected.workspaceTargets} />
              </Panel>
              <Panel title="Prerequisite Units" icon={<BookOpen className="h-4 w-4" />}>
                <ChipList items={selected.prerequisiteUnits} />
              </Panel>
              <Panel title="Application Areas" icon={<FlaskConical className="h-4 w-4" />}>
                <ChipList items={selected.applicationAreas} />
              </Panel>
              <Panel title="Formula Families" icon={<Sigma className="h-4 w-4" />}>
                <ChipList items={selected.formulaFamilies} />
              </Panel>
            </div>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <Route className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Dependency Map
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{dependencySummary.edgeCount} links</span>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Study Before</p>
                  <div className="mt-2 space-y-2">
                    {selectedDependencies.length ? selectedDependencies.map((dependency) => (
                      <button key={`${dependency.from}-${dependency.to}`} type="button" onClick={() => setSelectedId(dependency.from)} className="w-full rounded-lg bg-slate-50 p-2 text-left text-xs font-bold leading-5 text-slate-600 transition hover:bg-cyan-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-cyan-300/10">
                        <span className="block font-black text-slate-950 dark:text-white">{dependency.fromTitle}</span>
                        {dependency.reason}
                      </button>
                    )) : <p className="text-xs font-bold text-slate-500 dark:text-slate-400">This domain can start a path.</p>}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Unlocks Next</p>
                  <div className="mt-2 space-y-2">
                    {selectedUnlocks.length ? selectedUnlocks.map((unlock) => (
                      <button key={`${unlock.from}-${unlock.to}`} type="button" onClick={() => setSelectedId(unlock.to)} className="w-full rounded-lg bg-slate-50 p-2 text-left text-xs font-bold leading-5 text-slate-600 transition hover:bg-cyan-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-cyan-300/10">
                        <span className="block font-black text-slate-950 dark:text-white">{unlock.toTitle}</span>
                        {unlock.reason}
                      </button>
                    )) : <p className="text-xs font-bold text-slate-500 dark:text-slate-400">This domain is mostly a capstone target.</p>}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                  <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Learning Paths</p>
                  <div className="mt-2 space-y-2">
                    {selectedLearningPaths.map((path) => (
                      <div key={path.id} className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                        <p className="text-xs font-black text-slate-950 dark:text-white">{path.title}</p>
                        <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500 dark:text-slate-400">{path.outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <PlayCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Native Lab Launchers
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{launchers.length} of {launcherSummary.launcherCount} ready</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {launcherFilters.map((filter) => (
                  <button key={filter} type="button" onClick={() => setLauncherFilter(filter)} className={`rounded-full px-3 py-1.5 text-xs font-black capitalize transition ${launcherFilter === filter ? "bg-cyan-500 text-white" : "bg-white text-slate-600 hover:bg-cyan-50 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-cyan-300/10"}`}>
                    {filter.replace("-", " ")}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {launchers.map((launcher) => (
                  <Link key={launcher.id} to={launcher.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                    <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                      {launcher.title}
                      <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black uppercase text-slate-500 dark:bg-white/10 dark:text-slate-300">{launcher.kind}</span>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{launcher.outcome}</p>
                    <p className="mt-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">{launcher.preset}</p>
                  </Link>
                ))}
              </div>
              {launchers.length === 0 && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">No launchers match this type for the selected domain.</p>}
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <Sigma className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Solver Presets
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{solverPresets.length} deterministic</span>
              </div>
              {solverPresets.length ? (
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {solverPresets.map((preset) => (
                    <Link key={preset.id} to={preset.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                      <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                        {preset.title}
                        <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                      </span>
                      <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{preset.summary}</p>
                      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                        <span className="font-mono text-[11px] font-black text-slate-500 dark:text-slate-300">{preset.formula}</span>
                        <span className="rounded-full bg-cyan-100 px-2 py-1 text-[11px] font-black text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">{preset.metricLabel}: {preset.metricValue}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">Solver presets for this domain are scheduled after the current numerical, transforms, PDE, stochastic, and vector-field set.</p>
              )}
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <BookOpen className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Formula Intelligence
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{formulaCards.length} of {formulaSummary.formulaCount}</span>
              </div>
              <div className="mt-3 grid gap-2 lg:grid-cols-2">
                {formulaCards.map((formula) => (
                  <Link key={formula.id} to={formula.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                    <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                      {formula.title}
                      <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                    </span>
                    <p className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-xs font-black text-slate-700 dark:bg-white/5 dark:text-slate-200">{formula.formula}</p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{formula.useCase}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formula.symbols.map((symbol) => <span key={symbol} className="mini-chip">{symbol}</span>)}
                    </div>
                    <p className="mt-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">Needs: {formula.prerequisites.join(", ")}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <ClipboardList className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Worked Examples
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{workedExamples.length} of {workedSummary.exampleCount}</span>
              </div>
              <div className="mt-3 grid gap-2 lg:grid-cols-2">
                {workedExamples.map((workedExample) => (
                  <Link key={workedExample.id} to={workedExample.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                    <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                      {workedExample.title}
                      <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                    </span>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">{workedExample.problem}</p>
                    <ol className="mt-2 space-y-1">
                      {workedExample.steps.slice(0, 3).map((step, index) => (
                        <li key={step} className="rounded-lg bg-slate-50 p-2 text-[11px] font-semibold leading-4 text-slate-600 dark:bg-white/5 dark:text-slate-300">{index + 1}. {step}</li>
                      ))}
                    </ol>
                    <p className="mt-2 rounded-lg bg-cyan-50 p-2 text-[11px] font-bold leading-4 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">Check: {workedExample.answerCheck}</p>
                    <p className="mt-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">{workedExample.application}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Portfolio Projects
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{projects.length} of {projectsSummary.projectCount}</span>
              </div>
              <div className="mt-3 grid gap-2 lg:grid-cols-2">
                {projects.map((project) => (
                  <Link key={project.id} to={project.workspaceRoute} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                    <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                      {project.title}
                      <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                    </span>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge label={project.difficulty} tone={project.difficulty === "capstone" ? "hot" : project.difficulty === "studio" ? "cool" : "live"} />
                      <span className="mini-chip">{project.estimatedMinutes} min</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{project.brief}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.deliverables.map((deliverable) => <span key={deliverable} className="mini-chip">{deliverable}</span>)}
                    </div>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                        <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Rubric</p>
                        <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-600 dark:text-slate-300">{project.rubric.slice(0, 2).join(" | ")}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                        <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Evidence</p>
                        <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-600 dark:text-slate-300">{project.evidence.slice(0, 2).join(" | ")}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <FlaskConical className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Industry Case Studies
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{caseStudies.length} of {caseStudiesSummary.caseStudyCount}</span>
              </div>
              <div className="mt-3 grid gap-2 lg:grid-cols-2">
                {caseStudies.map((caseStudy) => (
                  <div key={caseStudy.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-black text-slate-950 dark:text-white">{caseStudy.title}</p>
                        <p className="mt-1 text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-200">{caseStudy.industry}</p>
                      </div>
                      <span className="mini-chip">{caseStudy.estimatedMinutes} min</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{caseStudy.scenario}</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                        <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Math Focus</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {caseStudy.mathFocus.map((focus) => <span key={focus} className="mini-chip">{focus}</span>)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                        <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">Evidence</p>
                        <p className="mt-1 text-[11px] font-semibold leading-4 text-slate-600 dark:text-slate-300">{caseStudy.portfolioEvidence.join(" | ")}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {caseStudy.labRoutes.slice(0, 2).map((route) => (
                        <Link key={route} to={route} className="mini-chip hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-400/15">
                          {route}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] font-bold text-slate-400 dark:text-slate-500">Success: {caseStudy.successCriteria.slice(0, 2).join(" | ")}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <ClipboardList className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Practice Pack
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{practicePack?.prompts.length ?? 0} of {practiceSummary.promptCount} prompts</span>
              </div>
              {practicePack ? (
                <div className="mt-3 space-y-3">
                  <div className="grid gap-3 lg:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Exam Focus</p>
                      <ChipList items={practicePack.examFocus} />
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Skills</p>
                      <ChipList items={practicePack.skills} />
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Mistake Traps</p>
                      <ChipList items={practicePack.commonMistakes} />
                    </div>
                  </div>
                  <div className="grid gap-2 lg:grid-cols-3">
                    {practicePack.prompts.map((practicePrompt) => (
                      <Link key={practicePrompt.id} to={practicePrompt.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                        <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                          {practicePrompt.title}
                          <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                        </span>
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black uppercase text-slate-500 dark:bg-white/10 dark:text-slate-300">{practicePrompt.level}</span>
                        <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{practicePrompt.prompt}</p>
                        <p className="mt-2 rounded-lg bg-cyan-50 p-2 text-[11px] font-bold leading-4 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">{practicePrompt.expected}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">Practice pack is scheduled for this domain.</p>
              )}
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Exam Readiness Planner
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedAssessment?.score ?? 0}%</span>
              </div>
              {selectedAssessment && (
                <div className="mt-3 grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                    <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Selected Domain</p>
                    <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{selectedAssessment.score}%</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-full bg-cyan-500" style={{ width: `${selectedAssessment.score}%` }} />
                    </div>
                    <Badge label={selectedAssessment.band} tone={selectedAssessment.band === "Exam ready" ? "live" : selectedAssessment.band === "Needs foundation" ? "hot" : "cool"} />
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                    <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Next Action</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{selectedAssessment.nextAction}</p>
                    <Link to={selectedAssessment.drillRoute} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-cyan-600">
                      Drill: {selectedAssessment.checkpoint}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedAssessment.evidence.map((item) => <span key={item} className="mini-chip">{item}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black text-slate-950 dark:text-white">Mapped Engineering Topics</h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{selected.topics.length} topics</span>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {selected.topics.map((topic) => (
                  <Link key={topic.id} to={topic.linkedVisualization.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                    <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                      {topic.title}
                      <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{topic.linkedVisualization.route}</span>
                  </Link>
                ))}
              </div>
            </section>
          </main>
        )}

        <aside className="space-y-3">
          <Panel title="Domain Readiness" icon={<Layers3 className="h-4 w-4" />}>
            <div className="space-y-2">
              {readinessRows.slice(0, 6).map((row) => (
                <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} className="w-full rounded-lg bg-slate-50 p-2 text-left transition hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-300/10">
                  <span className="flex items-center justify-between gap-2 text-xs font-black text-slate-950 dark:text-white">
                    {row.shortTitle}
                    <span className="text-cyan-600 dark:text-cyan-200">{row.score}/4</span>
                  </span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><span className="block h-full bg-cyan-500" style={{ width: `${row.score * 25}%` }} /></span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Exam Planner" icon={<Target className="h-4 w-4" />}>
            <div className="space-y-2">
              <p className="rounded-lg bg-slate-50 p-2 text-xs font-bold leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                Average {assessmentStats.averageScore}% | {assessmentStats.examReadyCount} exam-ready | next focus {assessmentStats.nextFocus}
              </p>
              {assessmentPlans.slice(-3).reverse().map((plan) => (
                <button key={plan.domainId} type="button" onClick={() => setSelectedId(plan.domainId)} className="w-full rounded-lg bg-slate-50 p-2 text-left transition hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-300/10">
                  <span className="flex items-center justify-between gap-2 text-xs font-black text-slate-950 dark:text-white">
                    {plan.title}
                    <span className="text-cyan-600 dark:text-cyan-200">{plan.score}%</span>
                  </span>
                  <span className="mt-1 block text-[11px] font-bold text-slate-500 dark:text-slate-400">{plan.nextAction}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Native Routes" icon={<Route className="h-4 w-4" />}>
            <div className="space-y-2">
              {selected?.nativeRoutes.map((route) => (
                <Link key={route} to={route} className="mini-chip w-full justify-between hover:bg-cyan-100 hover:text-cyan-700 dark:hover:bg-cyan-400/15">
                  {route}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Coverage Status" icon={<CheckCircle2 className="h-4 w-4" />}>
            {gaps.length === 0 ? (
              <p className="text-sm font-semibold leading-6 text-emerald-700 dark:text-emerald-200">Domain has syllabus topics, native route targets, workspace targets, and formula families.</p>
            ) : (
              <div className="space-y-2">
                {gaps.map((gap) => <p key={gap.gap} className="rounded-lg bg-amber-50 p-2 text-sm font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{gap.gap}</p>)}
              </div>
            )}
          </Panel>

          <Panel title="Phase Milestones" icon={<FlaskConical className="h-4 w-4" />}>
            <div className="space-y-2">
              {engineeringMathMilestones.map((milestone) => (
                <div key={milestone.id} className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                  <p className="text-sm font-black text-slate-950 dark:text-white">{milestone.title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{milestone.deliverables.join(", ")}</p>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel title="Domain Comparison Matrix" icon={<ClipboardList className="h-4 w-4" />}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-2">Domain</th>
                  <th className="p-2">Semester</th>
                  <th className="p-2">Topics</th>
                  <th className="p-2">Launchers</th>
                  <th className="p-2">Formula Families</th>
                  <th className="p-2">Primary Applications</th>
                </tr>
              </thead>
              <tbody>
                {readinessRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 dark:border-white/10">
                    <td className="p-2 font-black text-slate-950 dark:text-white">{row.title}</td>
                    <td className="p-2 font-bold text-slate-500 dark:text-slate-300">{row.semesterBand}</td>
                    <td className="p-2 font-bold">{row.topicCount}</td>
                    <td className="p-2 font-bold">{row.launcherCount}</td>
                    <td className="p-2 font-bold">{row.formulaCount}</td>
                    <td className="p-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{row.applications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Build Priorities" icon={<CheckCircle2 className="h-4 w-4" />}>
          <div className="space-y-2">
            {readinessRows.filter((row) => row.priority === "High").slice(0, 5).map((row) => (
              <button key={row.id} type="button" onClick={() => setSelectedId(row.id)} className="group w-full rounded-lg bg-slate-50 p-3 text-left transition hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-300/10">
                <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                  {row.title}
                  <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{row.recommendation}</span>
              </button>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-3 xl:grid-cols-4">
        {examSprints.map((sprint) => (
          <Link key={sprint.id} to={sprint.route} className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/60 dark:hover:bg-cyan-300/10">
            <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
              {sprint.title}
              <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
            </span>
            <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">{sprint.minutes} min | {sprint.averageScore}% ready</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{sprint.objective}</p>
            <p className="mt-2 rounded-lg bg-slate-50 p-2 text-[11px] font-bold text-slate-500 dark:bg-white/5 dark:text-slate-300">Weakest: {sprint.weakestDomain}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

function MetricCard({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}{suffix}</p>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "hot" | "cool" | "live" }) {
  const classes = tone === "hot"
    ? "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-100"
    : tone === "live"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100"
      : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200";
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${classes}`}>{label}</span>;
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
      <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
        <span className="text-cyan-600 dark:text-cyan-200">{icon}</span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => <span key={item} className="mini-chip">{item}</span>)}
    </div>
  );
}

function buildQuickStarts() {
  return [
    { title: "M1 Core Path", steps: ["Engineering Calculus", "Differential Equations", "Linear Algebra", "Practice"] },
    { title: "Signals Path", steps: ["Transforms", "Fourier", "Z-Transform", "Control Response"] },
    { title: "Simulation Path", steps: ["PDE", "Numerical Methods", "Data Workspace", "Export"] },
    { title: "AI/ML Math Path", steps: ["Linear Algebra", "Probability", "Optimization", "Applications"] },
  ];
}

function buildReadinessRows() {
  return engineeringMathDomains.map((domain) => {
    const domainLaunchers = launchersForDomain(domain.id);
    const score = [
      domain.topics.length > 0,
      domain.nativeRoutes.length > 0,
      domain.formulaFamilies.length >= 4,
      domainLaunchers.length >= 4,
    ].filter(Boolean).length;
    return {
      id: domain.id,
      title: domain.title,
      shortTitle: domain.title.replace("Engineering ", "").replace(" and ", " + "),
      semesterBand: domain.semesterBand,
      topicCount: domain.topics.length,
      launcherCount: domainLaunchers.length,
      formulaCount: domain.formulaFamilies.length,
      applications: domain.applicationAreas.slice(0, 3).join(", "),
      priority: domain.priority,
      score,
      recommendation: score === 4 ? "Ready for deeper simulations and assessment packs." : "Needs more route, formula, or launcher coverage.",
    };
  });
}
