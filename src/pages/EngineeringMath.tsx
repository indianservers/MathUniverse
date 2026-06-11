import { ArrowRight, BookOpen, CheckCircle2, ClipboardList, FlaskConical, Layers3, PlayCircle, Route, Search, Sigma, Target, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TopicHeader from "../components/ui/TopicHeader";
import { assessmentSummary, buildEngineeringAssessmentPlans, engineeringExamSprints, sprintReadiness } from "../data/engineeringAssessmentPlanner";
import { caseStudiesForDomain, caseStudySummary } from "../data/engineeringCaseStudies";
import { buildEngineeringConceptCoverage, engineeringCoverageSummary } from "../data/engineeringConceptCoverage";
import { dependenciesForDomain, dependencyGraphSummary, learningPathsForDomain, unlocksForDomain } from "../data/engineeringDependencyGraph";
import { formulaAtlasSummary, formulasForDomain, type EngineeringFormulaCard } from "../data/engineeringFormulaAtlas";
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
import { adjustedSimulationSamples, simulationCoverageSummary, simulationsForDomain, type EngineeringSimulationScenario } from "../data/engineeringSimulationScenarios";
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
  const [visualA, setVisualA] = useState(1.2);
  const [visualB, setVisualB] = useState(0.8);
  const [visualT, setVisualT] = useState(0.45);
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
  const coverageRows = useMemo(() => buildEngineeringConceptCoverage(), []);
  const coverageSummary = useMemo(() => engineeringCoverageSummary(), []);
  const selectedCoverage = useMemo(() => coverageRows.find((row) => row.domainId === selected?.id), [coverageRows, selected?.id]);
  const simulationScenarios = useMemo(() => simulationsForDomain(selected?.id ?? ""), [selected?.id]);
  const simulationSummary = useMemo(() => simulationCoverageSummary(), []);

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
        <MetricCard label="Coverage score" value={coverageSummary.average} suffix="%" />
        <MetricCard label="Simulations" value={simulationSummary.scenarioCount} />
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

            {selectedCoverage && (
              <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                    <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                    Concept Coverage Audit
                  </h3>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedCoverage.score}/{selectedCoverage.maxScore} checks</span>
                </div>
                <div className="mt-3 grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
                    <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Selected Coverage</p>
                    <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{selectedCoverage.percent}%</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div className="h-full bg-cyan-500" style={{ width: `${selectedCoverage.percent}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] font-bold leading-4 text-slate-500 dark:text-slate-400">{selectedCoverage.missing.length === 0 ? "No core gaps remain for this domain." : `${selectedCoverage.missing.length} upgrade targets remain.`}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                    {Object.entries(selectedCoverage.counts).map(([key, value]) => (
                      <div key={key} className="rounded-lg border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/70">
                        <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{coverageLabel(key)}</p>
                        <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid gap-2 lg:grid-cols-2">
                  {selectedCoverage.nextActions.map((action) => (
                    <p key={action} className={`rounded-lg p-2 text-xs font-bold leading-5 ${selectedCoverage.missing.length === 0 ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100"}`}>{action}</p>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <FlaskConical className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Simulation Studio
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{simulationScenarios.length} of {simulationSummary.scenarioCount}</span>
              </div>
              <div className="mt-3 grid gap-2 lg:grid-cols-2">
                {simulationScenarios.map((scenario) => (
                  <SimulationScenarioCard key={scenario.id} scenario={scenario} shape={visualA} forcing={visualB} time={visualT} />
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                  <BookOpen className="h-4 w-4 text-cyan-600 dark:text-cyan-200" />
                  Formula Intelligence
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{formulaCards.length} of {formulaSummary.formulaCount}</span>
              </div>
              <div className="mt-3 grid gap-3 rounded-lg border border-cyan-200 bg-white p-3 dark:border-cyan-300/20 dark:bg-slate-950/70 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div>
                  <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Live Concept Controls</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">These controls drive every concept visual below, so each formula card becomes a small interactive lab instead of a static reference.</p>
                </div>
                <div className="grid gap-2">
                  <MiniSlider label="shape" value={visualA} min={0.4} max={2.2} step={0.05} onChange={setVisualA} />
                  <MiniSlider label="forcing" value={visualB} min={0.1} max={1.8} step={0.05} onChange={setVisualB} />
                  <MiniSlider label="time" value={visualT} min={0} max={1} step={0.01} onChange={setVisualT} />
                </div>
              </div>
              <div className="mt-3 grid gap-2 lg:grid-cols-2">
                {formulaCards.map((formula) => (
                  <Link key={formula.id} to={formula.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
                    <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
                      {formula.title}
                      <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
                    </span>
                    <EngineeringFormulaVisual formula={formula} a={visualA} b={visualB} t={visualT} />
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
            {selectedCoverage && selectedCoverage.missing.length === 0 ? (
              <p className="text-sm font-semibold leading-6 text-emerald-700 dark:text-emerald-200">Domain has complete concept coverage across topics, visuals, formulas, launchers, solvers, practice, projects, case studies, and assessment.</p>
            ) : (
              <div className="space-y-2">
                {(selectedCoverage?.missing ?? gaps.map((gap) => gap.gap)).map((gap) => <p key={gap} className="rounded-lg bg-amber-50 p-2 text-sm font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{gap}</p>)}
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
                  <th className="p-2">Solvers</th>
                  <th className="p-2">Coverage</th>
                  <th className="p-2">Formula Families</th>
                  <th className="p-2">Primary Applications</th>
                </tr>
              </thead>
              <tbody>
                {readinessRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 dark:border-white/10">
                    {(() => {
                      const coverage = coverageRows.find((item) => item.domainId === row.id);
                      return (
                        <>
                    <td className="p-2 font-black text-slate-950 dark:text-white">{row.title}</td>
                    <td className="p-2 font-bold text-slate-500 dark:text-slate-300">{row.semesterBand}</td>
                    <td className="p-2 font-bold">{row.topicCount}</td>
                    <td className="p-2 font-bold">{row.launcherCount}</td>
                    <td className="p-2 font-bold">{coverage?.counts.solvers ?? 0}</td>
                    <td className="p-2 font-bold text-cyan-700 dark:text-cyan-200">{coverage?.percent ?? 0}%</td>
                    <td className="p-2 font-bold">{row.formulaCount}</td>
                    <td className="p-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{row.applications}</td>
                        </>
                      );
                    })()}
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

function coverageLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) => value.toUpperCase());
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

function SimulationScenarioCard({ scenario, shape, forcing, time }: { scenario: EngineeringSimulationScenario; shape: number; forcing: number; time: number }) {
  const samples = adjustedSimulationSamples(scenario.samples, { shape, forcing, time });
  const path = sparklinePath(samples, 260, 86);
  const fillPath = `${path} L260 92 L0 92 Z`;
  const liveMetric = scenario.metricValue * (0.9 + forcing * 0.05 + time * 0.04);
  return (
    <Link to={scenario.route} className="group rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300/10">
      <span className="flex items-center justify-between gap-2 text-sm font-black text-slate-950 dark:text-white">
        {scenario.title}
        <ArrowRight className="h-4 w-4 text-cyan-500 transition group-hover:translate-x-0.5" />
      </span>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{scenario.model}</p>
      <svg viewBox="0 0 260 96" className="mt-3 h-28 w-full rounded-lg bg-slate-950 p-2" role="img" aria-label={`${scenario.title} simulation preview`}>
        <path d={fillPath} fill="#0891b2" opacity="0.28" />
        <path d={path} fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {samples.map((sample, index) => (
          <circle key={`${scenario.id}-${index}`} cx={(index / Math.max(1, samples.length - 1)) * 260} cy={86 - sample * 72} r={index === samples.length - 1 ? 5 : 3} fill={index === samples.length - 1 ? "#f59e0b" : "#e0f2fe"} opacity={index === samples.length - 1 ? 1 : 0.72} />
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cyan-100 px-2 py-1 text-[11px] font-black text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">{scenario.metricLabel}: {roundDisplay(liveMetric)}{scenario.metricUnit}</span>
        {scenario.variables.map((variable) => <span key={variable} className="mini-chip">{variable}</span>)}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {scenario.exportArtifacts.map((artifact) => (
          <span key={artifact} className="rounded-lg bg-slate-50 p-2 text-[11px] font-bold leading-4 text-slate-500 dark:bg-white/5 dark:text-slate-300">{artifact}</span>
        ))}
      </div>
    </Link>
  );
}

function sparklinePath(samples: number[], width: number, height: number) {
  return samples.map((sample, index) => {
    const x = (index / Math.max(1, samples.length - 1)) * width;
    const y = height - sample * (height - 14);
    return `${index === 0 ? "M" : "L"}${roundDisplay(x)} ${roundDisplay(y)}`;
  }).join(" ");
}

function roundDisplay(value: number) {
  return Math.round(value * 100) / 100;
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => <span key={item} className="mini-chip">{item}</span>)}
    </div>
  );
}

function MiniSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="grid grid-cols-[72px_minmax(0,1fr)_42px] items-center gap-2 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} className="h-2 w-full accent-cyan-500" />
      <span className="text-right font-mono text-slate-700 dark:text-slate-200">{value.toFixed(2)}</span>
    </label>
  );
}

function EngineeringFormulaVisual({ formula, a, b, t }: { formula: EngineeringFormulaCard; a: number; b: number; t: number }) {
  const id = formula.id;
  if (formula.domainId === "engineering-calculus") return <CalculusVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "engineering-differential-equations") return <OdeVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "engineering-linear-algebra") return <LinearAlgebraVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "transforms-signals") return <SignalVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "partial-differential-equations") return <PdeVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "numerical-methods") return <NumericalVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "probability-statistics-stochastic") return <ProbabilityVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "optimization-operations-research") return <OptimizationVisual id={id} a={a} b={b} t={t} />;
  if (formula.domainId === "vector-calculus-fields") return <VectorFieldVisual id={id} a={a} b={b} t={t} />;
  return <ComplexControlVisual id={id} a={a} b={b} t={t} />;
}

function VisualFrame({ children, metric }: { children: ReactNode; metric: string }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 dark:border-white/10">
      <svg viewBox="0 0 320 160" role="img" className="h-40 w-full">
        <rect width="320" height="160" fill="#020617" />
        <g opacity="0.28" stroke="#334155" strokeWidth="1">
          {Array.from({ length: 7 }, (_, index) => <line key={`v-${index}`} x1={index * 54} x2={index * 54} y1="0" y2="160" />)}
          {Array.from({ length: 5 }, (_, index) => <line key={`h-${index}`} x1="0" x2="320" y1={index * 40} y2={index * 40} />)}
        </g>
        {children}
        <text x="14" y="148" fill="#e2e8f0" fontSize="11" fontWeight="800">{metric}</text>
      </svg>
    </div>
  );
}

function CalculusVisual({ id, a, b, t }: VisualProps) {
  const curve = pathFromSamples((x) => 82 - 26 * Math.sin(a * x + t * 4) - 11 * Math.cos(b * x), 0, Math.PI * 2, 84);
  const sliceX = 55 + t * 210;
  const jacobianSkew = 22 + a * 9;
  if (id.includes("jacobian")) {
    return <VisualFrame metric={`area scale ${(a * b + 0.35).toFixed(2)}x`}><polygon points={`78,108 ${198 + jacobianSkew},100 232,48 ${106 - jacobianSkew / 3},58`} fill="#0891b2" opacity="0.38" stroke="#22d3ee" strokeWidth="3" /><polygon points="90,118 212,118 212,44 90,44" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 5" /><VectorLine x1={90} y1={118} x2={198 + jacobianSkew} y2={100} color="#38bdf8" /><VectorLine x1={90} y1={118} x2={106 - jacobianSkew / 3} y2={58} color="#fbbf24" /></VisualFrame>;
  }
  if (id.includes("double-integral")) {
    const bars = Array.from({ length: 12 }, (_, index) => {
      const x = 52 + index * 18;
      const h = 18 + 36 * Math.max(0, Math.sin(index * 0.45 + a + t * 2));
      return <rect key={index} x={x} y={118 - h} width="12" height={h} fill={index % 2 ? "#22d3ee" : "#f59e0b"} opacity="0.78" />;
    });
    return <VisualFrame metric={`sample volume ${(a * 8 + b * 4 + t * 6).toFixed(1)}`}><path d="M48 122 C86 74 142 94 178 58 C214 28 256 64 276 106 C226 132 132 142 48 122Z" fill="#0e7490" opacity="0.35" stroke="#22d3ee" strokeWidth="3" />{bars}</VisualFrame>;
  }
  if (id.includes("taylor")) {
    return <VisualFrame metric={`linear error ${(Math.abs(a - b) * (1 - t)).toFixed(2)}`}><path d={curve} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1="70" y1={118 - a * 12} x2="260" y2={80 - b * 18} stroke="#f59e0b" strokeWidth="4" /><circle cx={sliceX} cy={80 - 26 * Math.sin(a * t * Math.PI * 2)} r="6" fill="#fb7185" /></VisualFrame>;
  }
  return <VisualFrame metric={`slope x ${((a - b) * 1.7).toFixed(2)}`}><path d={curve} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1={sliceX} x2={sliceX} y1="30" y2="128" stroke="#f59e0b" strokeWidth="3" /><line x1={sliceX - 38} x2={sliceX + 38} y1={92 - a * 10} y2={68 + b * 10} stroke="#fb7185" strokeWidth="4" /><circle cx={sliceX} cy={82 - 26 * Math.sin(a * (sliceX / 320) * Math.PI * 2 + t * 4)} r="6" fill="#f8fafc" /></VisualFrame>;
}

function OdeVisual({ id, a, b, t }: VisualProps) {
  const damped = pathFromSamples((x) => 82 - 42 * Math.exp(-b * x / 5) * Math.cos(a * x + t * 4), 0, 7, 90);
  if (id.includes("separable")) return <VisualFrame metric={`separation k ${(a * b).toFixed(2)}`}><SlopeField a={a} b={b} /><path d={pathFromSamples((x) => 115 - 62 * (1 - Math.exp(-a * x / 5)) + 12 * Math.sin(b * x), 0, 7, 90)} fill="none" stroke="#22d3ee" strokeWidth="4" /></VisualFrame>;
  if (id.includes("linear-first")) return <VisualFrame metric={`steady state ${(b / (a + 0.2)).toFixed(2)}`}><path d={pathFromSamples((x) => 114 - 58 * (1 - Math.exp(-a * x / 4)) - 8 * Math.sin(t * 6), 0, 7, 90)} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1="30" y1={68 - b * 8} x2="292" y2={68 - b * 8} stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="3" /></VisualFrame>;
  if (id.includes("cauchy")) return <VisualFrame metric={`power m ${(a + b).toFixed(2)}`}><path d={pathFromSamples((x) => 126 - 16 * Math.pow(x + 0.35, 0.8 + a * 0.35), 0, 7, 90)} fill="none" stroke="#22d3ee" strokeWidth="4" /><path d={pathFromSamples((x) => 128 - 10 * Math.pow(x + 0.35, 0.8 + b * 0.45), 0, 7, 90)} fill="none" stroke="#f59e0b" strokeWidth="3" /></VisualFrame>;
  return <VisualFrame metric={`root damping ${b.toFixed(2)}`}><path d={damped} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1="28" y1="82" x2="292" y2="82" stroke="#64748b" strokeWidth="2" /><circle cx={82 + t * 170} cy={82 - 42 * Math.exp(-b * (t * 7) / 5) * Math.cos(a * t * 7 + t * 4)} r="6" fill="#f59e0b" /></VisualFrame>;
}

function LinearAlgebraVisual({ id, a, b, t }: VisualProps) {
  const angle = t * Math.PI * 2;
  const v1 = { x: 160 + Math.cos(angle) * 70 * a, y: 82 - Math.sin(angle) * 42 * b };
  const v2 = { x: 160 - Math.sin(angle) * 46 * b, y: 82 - Math.cos(angle) * 68 * a };
  if (id.includes("rank-nullity")) return <VisualFrame metric={`rank ${Math.max(1, Math.round(a * 2))}, nullity ${Math.max(0, Math.round(3 - a))}`}><MatrixGrid active={Math.round(a * 4)} /><VectorLine x1={50} y1={126} x2={v1.x} y2={v1.y} color="#22d3ee" /><VectorLine x1={50} y1={126} x2={v2.x} y2={v2.y} color="#f59e0b" /></VisualFrame>;
  if (id.includes("eigen")) return <VisualFrame metric={`lambda ${(a + b).toFixed(2)}`}><VectorLine x1={160} y1={82} x2={v1.x} y2={v1.y} color="#22d3ee" /><VectorLine x1={160} y1={82} x2={160 + (v1.x - 160) * 0.62} y2={82 + (v1.y - 82) * 0.62} color="#f59e0b" /><ellipse cx="160" cy="82" rx={60 * a} ry={28 + 18 * b} fill="none" stroke="#8b5cf6" strokeWidth="3" /></VisualFrame>;
  if (id.includes("least")) return <VisualFrame metric={`residual ${(Math.abs(a - b) * 3).toFixed(2)}`}><ScatterFit a={a} b={b} t={t} /></VisualFrame>;
  return <VisualFrame metric={`A powers ${(1 + a * t).toFixed(2)}`}><MatrixGrid active={5} /><path d={`M82 118 C128 ${60 - a * 8} 190 ${104 - b * 16} 250 42`} fill="none" stroke="#22d3ee" strokeWidth="4" /><circle cx={82 + t * 168} cy={118 - t * 70} r="7" fill="#f59e0b" /></VisualFrame>;
}

function SignalVisual({ id, a, b, t }: VisualProps) {
  if (id.includes("fourier")) return <VisualFrame metric={`${Math.round(3 + a * 5)} harmonics`}><path d={pathFromSamples((x) => 82 - 34 * Math.sin(x * a + t * 5) - 16 * Math.sin(3 * x + b), 0, Math.PI * 4, 110)} fill="none" stroke="#22d3ee" strokeWidth="4" /><SpectrumBars a={a} b={b} /></VisualFrame>;
  if (id.includes("convolution")) return <VisualFrame metric={`overlap ${(t * 100).toFixed(0)}%`}><Pulse x={50 + t * 115} color="#22d3ee" /><Pulse x={190 - t * 78} color="#f59e0b" /><path d={pathFromSamples((x) => 122 - 34 * Math.exp(-Math.pow(x - (2 + t * 3), 2) / (0.5 + b)), 0, 7, 90)} fill="none" stroke="#fb7185" strokeWidth="4" /></VisualFrame>;
  if (id.includes("z-transform")) return <VisualFrame metric={`pole radius ${(0.35 + t * a).toFixed(2)}`}><circle cx="160" cy="80" r="54" fill="none" stroke="#64748b" strokeWidth="3" /><circle cx={160 + Math.cos(t * 6.28) * 54 * a / 2.2} cy={80 - Math.sin(t * 6.28) * 54 * a / 2.2} r="8" fill="#f59e0b" /><VectorLine x1={160} y1={80} x2={160 + Math.cos(t * 6.28) * 54} y2={80 - Math.sin(t * 6.28) * 54} color="#22d3ee" /></VisualFrame>;
  return <VisualFrame metric={`s gain ${(a * 2 + b).toFixed(2)}`}><path d={pathFromSamples((x) => 120 - 82 * Math.exp(-a * x / 5) * Math.sin(b * x + t * 5), 0, 7, 95)} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1="34" y1="120" x2="292" y2="120" stroke="#64748b" strokeWidth="2" /></VisualFrame>;
}

function PdeVisual({ id, a, b, t }: VisualProps) {
  if (id.includes("classification")) return <VisualFrame metric={`D ${(b * b - 4 * a).toFixed(2)}`}><ConicFamily a={a} b={b} t={t} /></VisualFrame>;
  if (id.includes("wave")) return <VisualFrame metric={`wave speed ${(1 + a).toFixed(2)}`}><HeatGrid a={a} b={b} t={t} wave /><path d={pathFromSamples((x) => 82 - 32 * Math.sin(a * x + t * 6), 0, Math.PI * 4, 100)} fill="none" stroke="#f8fafc" strokeWidth="3" /></VisualFrame>;
  if (id.includes("laplace")) return <VisualFrame metric={`potential ${(a + b).toFixed(2)}`}><ContourMap a={a} b={b} t={t} /></VisualFrame>;
  return <VisualFrame metric={`diffusion ${(t * a).toFixed(2)}`}><HeatGrid a={a} b={b} t={t} /></VisualFrame>;
}

function NumericalVisual({ id, a, b, t }: VisualProps) {
  if (id.includes("newton")) return <VisualFrame metric={`x_n ${(1.8 - t * a).toFixed(2)}`}><path d={pathFromSamples((x) => 116 - 9 * Math.pow(x - 3.5, 2) + 12 * b, 0, 7, 90)} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1={90 + t * 120} y1="124" x2={170 + t * 100} y2="40" stroke="#f59e0b" strokeWidth="3" /><circle cx={90 + t * 120} cy={116 - 9 * Math.pow(t * 3.2 - 1.2, 2)} r="7" fill="#fb7185" /></VisualFrame>;
  if (id.includes("bisection")) return <VisualFrame metric={`bracket ${((1 - t) * 4).toFixed(2)}`}><path d={pathFromSamples((x) => 82 - 28 * Math.sin(a * x) + 8 * (x - 3.5), 0, 7, 90)} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1={55 + t * 72} y1="28" x2={55 + t * 72} y2="132" stroke="#f59e0b" strokeWidth="3" /><line x1={270 - t * 72} y1="28" x2={270 - t * 72} y2="132" stroke="#fb7185" strokeWidth="3" /></VisualFrame>;
  if (id.includes("simpson")) return <VisualFrame metric={`panels ${Math.round(4 + a * 4)}`}><path d={pathFromSamples((x) => 112 - 28 * Math.sin(x * a) - 10 * Math.cos(x * b), 0, 7, 90)} fill="none" stroke="#22d3ee" strokeWidth="4" />{Array.from({ length: 8 }, (_, i) => <rect key={i} x={50 + i * 26} y={78 + (i % 2) * 10} width="22" height={44 - (i % 2) * 10} fill="#f59e0b" opacity="0.3" />)}</VisualFrame>;
  return <VisualFrame metric={`RK4 error ${(0.12 / (a + t + 0.2)).toFixed(3)}`}><SlopeField a={a} b={b} /><path d={pathFromSamples((x) => 126 - 74 * (1 - Math.exp(-x * a / 5)), 0, 7, 90)} fill="none" stroke="#22d3ee" strokeWidth="4" /></VisualFrame>;
}

function ProbabilityVisual({ id, a, b, t }: VisualProps) {
  if (id.includes("markov")) return <VisualFrame metric={`state B ${(t * 100).toFixed(0)}%`}><StateNode x={82} y={82} label="A" active={1 - t} /><StateNode x={238} y={82} label="B" active={t} /><VectorLine x1={104} y1={82} x2={216} y2={82} color="#22d3ee" /><VectorLine x1={216} y1={98} x2={104} y2={98} color="#f59e0b" /></VisualFrame>;
  if (id.includes("queue")) return <VisualFrame metric={`rho ${(Math.min(0.98, a / (a + b))).toFixed(2)}`}><QueueVisual a={a} b={b} t={t} /></VisualFrame>;
  if (id.includes("variance")) return <VisualFrame metric={`sigma ${(a + b).toFixed(2)}`}><DistributionVisual a={a} b={b} t={t} spread /></VisualFrame>;
  return <VisualFrame metric={`E[X] ${(a * 2 + b).toFixed(2)}`}><DistributionVisual a={a} b={b} t={t} /></VisualFrame>;
}

function OptimizationVisual({ id, a, b, t }: VisualProps) {
  if (id.includes("pert")) return <VisualFrame metric={`critical ${(10 + a * 4 + b * 2).toFixed(1)} days`}><NetworkVisual t={t} /></VisualFrame>;
  if (id.includes("euler")) return <VisualFrame metric={`path cost ${(a * 8 + b * 4).toFixed(1)}`}><path d="M40 118 C98 34 192 142 280 42" fill="none" stroke="#64748b" strokeWidth="3" strokeDasharray="6 6" /><path d={`M40 118 C${90 + a * 14} ${82 - b * 20} ${200 - b * 22} ${82 + a * 8} 280 42`} fill="none" stroke="#22d3ee" strokeWidth="5" /></VisualFrame>;
  if (id.includes("duality")) return <VisualFrame metric={`shadow price ${(a + t).toFixed(2)}`}><FeasibleRegion a={a} b={b} t={t} dual /></VisualFrame>;
  return <VisualFrame metric={`Z ${(a * 22 + b * 12 + t * 8).toFixed(1)}`}><FeasibleRegion a={a} b={b} t={t} /></VisualFrame>;
}

function VectorFieldVisual({ id, a, b, t }: VisualProps) {
  if (id.includes("divergence")) return <VisualFrame metric={`div ${(a - b).toFixed(2)}`}><FieldArrows a={a} b={b} t={t} mode="div" /></VisualFrame>;
  if (id.includes("curl")) return <VisualFrame metric={`curl ${(a + b).toFixed(2)}`}><FieldArrows a={a} b={b} t={t} mode="curl" /></VisualFrame>;
  if (id.includes("stokes")) return <VisualFrame metric={`circulation ${(a * b * 2).toFixed(2)}`}><FieldArrows a={a} b={b} t={t} mode="curl" /><ellipse cx="160" cy="82" rx="76" ry="42" fill="none" stroke="#f59e0b" strokeWidth="4" /></VisualFrame>;
  return <VisualFrame metric={`|grad f| ${(a * 1.6).toFixed(2)}`}><ContourMap a={a} b={b} t={t} /><VectorLine x1={160} y1={82} x2={160 + 70 * a / 2.2} y2={82 - 38 * b / 1.8} color="#f59e0b" /></VisualFrame>;
}

function ComplexControlVisual({ id, a, b, t }: VisualProps) {
  if (id.includes("residue") || id.includes("cauchy")) return <VisualFrame metric={`winding ${(1 + Math.round(t * 3)).toFixed(0)}`}><circle cx="160" cy="80" r={44 + a * 14} fill="none" stroke="#22d3ee" strokeWidth="4" /><circle cx={160 + Math.cos(t * 6.28) * 50} cy={80 + Math.sin(t * 6.28) * 38} r="7" fill="#f59e0b" /><circle cx="160" cy="80" r="6" fill="#fb7185" /></VisualFrame>;
  if (id.includes("bessel")) return <VisualFrame metric={`mode ${Math.round(1 + a * 3)}`}><path d={pathFromSamples((x) => 82 - 42 * Math.sin(a * x + t * 4) / (1 + x * 0.14), 0, 12, 120)} fill="none" stroke="#22d3ee" strokeWidth="4" /><circle cx="160" cy="82" r={34 + b * 12} fill="none" stroke="#f59e0b" strokeWidth="3" /></VisualFrame>;
  return <VisualFrame metric={`settling ${(4 / (a + 0.4)).toFixed(2)}s`}><path d={pathFromSamples((x) => 122 - 78 * (1 - Math.exp(-a * x / 4) * Math.cos(b * x + t)), 0, 8, 100)} fill="none" stroke="#22d3ee" strokeWidth="4" /><line x1="30" y1="44" x2="292" y2="44" stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="3" /></VisualFrame>;
}

type VisualProps = { id: string; a: number; b: number; t: number };

function pathFromSamples(fn: (x: number) => number, start: number, end: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const ratio = index / (count - 1);
    const x = start + (end - start) * ratio;
    return `${index === 0 ? "M" : "L"}${30 + ratio * 260} ${Math.max(18, Math.min(136, fn(x)))}`;
  }).join(" ");
}

function VectorLine({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" strokeLinecap="round" />;
}

function SlopeField({ a, b }: { a: number; b: number }) {
  return <g>{Array.from({ length: 48 }, (_, i) => {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const x = 42 + col * 34;
    const y = 34 + row * 18;
    const tilt = Math.sin(col * a + row * b) * 10;
    return <line key={i} x1={x - 8} y1={y + tilt} x2={x + 8} y2={y - tilt} stroke="#64748b" strokeWidth="2" strokeLinecap="round" />;
  })}</g>;
}

function MatrixGrid({ active }: { active: number }) {
  return <g>{Array.from({ length: 9 }, (_, i) => <rect key={i} x={54 + (i % 3) * 26} y={42 + Math.floor(i / 3) * 26} width="20" height="20" rx="4" fill={i <= active ? "#22d3ee" : "#334155"} opacity="0.85" />)}</g>;
}

function ScatterFit({ a, b, t }: { a: number; b: number; t: number }) {
  const points = Array.from({ length: 10 }, (_, i) => ({ x: 48 + i * 24, y: 116 - i * (5 + a) - Math.sin(i * b + t * 5) * 16 }));
  return <g>{points.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r="5" fill="#f59e0b" />)}<line x1="44" y1={118 - b * 12} x2="278" y2={52 - a * 16} stroke="#22d3ee" strokeWidth="4" /></g>;
}

function SpectrumBars({ a, b }: { a: number; b: number }) {
  return <g>{Array.from({ length: 9 }, (_, i) => <rect key={i} x={42 + i * 18} y={132 - (12 + Math.abs(Math.sin(i * a + b)) * 42)} width="10" height={12 + Math.abs(Math.sin(i * a + b)) * 42} fill="#f59e0b" opacity="0.78" />)}</g>;
}

function Pulse({ x, color }: { x: number; color: string }) {
  return <path d={`M${x} 124 L${x + 28} 124 L${x + 28} 62 L${x + 78} 62 L${x + 78} 124 L${x + 108} 124`} fill="none" stroke={color} strokeWidth="4" />;
}

function HeatGrid({ a, b, t, wave = false }: { a: number; b: number; t: number; wave?: boolean }) {
  return <g>{Array.from({ length: 48 }, (_, i) => {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const heat = wave ? Math.abs(Math.sin(col * a + row * b + t * 6)) : Math.exp(-t * (col + 1) / (2 + a)) * Math.abs(Math.sin(row + b));
    return <rect key={i} x={48 + col * 24} y={28 + row * 18} width="21" height="15" fill={heat > 0.55 ? "#f59e0b" : heat > 0.3 ? "#22d3ee" : "#1e293b"} opacity="0.9" />;
  })}</g>;
}

function ConicFamily({ a, b, t }: { a: number; b: number; t: number }) {
  return <g><ellipse cx="118" cy="82" rx={28 + a * 16} ry={20 + b * 10} fill="none" stroke="#22d3ee" strokeWidth="4" /><path d={`M178 128 Q${220 + t * 26} ${28 + b * 20} 278 118`} fill="none" stroke="#f59e0b" strokeWidth="4" /><line x1="40" y1="126" x2="288" y2="34" stroke="#fb7185" strokeWidth="3" strokeDasharray="6 6" /></g>;
}

function ContourMap({ a, b, t }: { a: number; b: number; t: number }) {
  return <g>{[28, 48, 68].map((r, i) => <ellipse key={r} cx={160 + Math.sin(t * 5 + i) * 10} cy={82} rx={r + a * 8} ry={r * 0.55 + b * 6} fill="none" stroke={i === 1 ? "#22d3ee" : "#64748b"} strokeWidth={i === 1 ? 4 : 2} />)}</g>;
}

function DistributionVisual({ a, b, t, spread = false }: { a: number; b: number; t: number; spread?: boolean }) {
  const sigma = spread ? a * 0.8 + b * 0.5 : 0.7 + b * 0.25;
  return <path d={pathFromSamples((x) => 126 - 76 * Math.exp(-Math.pow(x - (3.5 + (t - 0.5) * 2), 2) / sigma), 0, 7, 100)} fill="none" stroke="#22d3ee" strokeWidth="4" />;
}

function QueueVisual({ a, b, t }: { a: number; b: number; t: number }) {
  const count = Math.max(2, Math.min(8, Math.round(2 + a * 2 + t * 4)));
  return <g>{Array.from({ length: count }, (_, i) => <circle key={i} cx={54 + i * 24} cy="96" r="9" fill="#22d3ee" />)}<rect x="238" y="68" width="42" height="56" rx="8" fill="#f59e0b" opacity={0.8 + b * 0.05} /></g>;
}

function StateNode({ x, y, label, active }: { x: number; y: number; label: string; active: number }) {
  return <g><circle cx={x} cy={y} r={26 + active * 12} fill="#0e7490" opacity="0.45" stroke="#22d3ee" strokeWidth="3" /><text x={x - 5} y={y + 5} fill="#f8fafc" fontSize="14" fontWeight="900">{label}</text></g>;
}

function FeasibleRegion({ a, b, t, dual = false }: { a: number; b: number; t: number; dual?: boolean }) {
  return <g><polygon points={`62,126 62,72 ${130 + a * 20},42 ${248 - b * 15},92 222,126`} fill="#0e7490" opacity="0.45" stroke="#22d3ee" strokeWidth="3" /><line x1="42" y1={126 - t * 62} x2="282" y2={70 - t * 34} stroke={dual ? "#fb7185" : "#f59e0b"} strokeWidth="4" /><circle cx={222 - t * 90} cy={126 - t * 58} r="7" fill="#f8fafc" /></g>;
}

function NetworkVisual({ t }: { t: number }) {
  const nodes = [[62, 92], [128, 48], [132, 118], [212, 66], [256, 112]];
  return <g>{[[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [2, 4]].map(([from, to], i) => <line key={i} x1={nodes[from][0]} y1={nodes[from][1]} x2={nodes[to][0]} y2={nodes[to][1]} stroke={i < 3 + t * 3 ? "#f59e0b" : "#475569"} strokeWidth="4" />)}{nodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="12" fill="#22d3ee" />)}</g>;
}

function FieldArrows({ a, b, t, mode }: { a: number; b: number; t: number; mode: "div" | "curl" }) {
  return <g>{Array.from({ length: 35 }, (_, i) => {
    const col = i % 7;
    const row = Math.floor(i / 7);
    const x = 54 + col * 34;
    const y = 34 + row * 24;
    const dx = mode === "curl" ? -(y - 82) * 0.15 * b : (x - 160) * 0.07 * a;
    const dy = mode === "curl" ? (x - 160) * 0.09 * a : (y - 82) * 0.06 * b + Math.sin(t * 6) * 2;
    return <VectorLine key={i} x1={x} y1={y} x2={x + dx} y2={y + dy} color={i % 2 ? "#22d3ee" : "#f59e0b"} />;
  })}</g>;
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
