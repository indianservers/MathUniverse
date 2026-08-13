import { ArrowRight, BarChart3, BrainCircuit, FlaskConical, GitBranch, LineChart, Network, Search, Sigma, Shuffle, SlidersHorizontal, Table2, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GraphCard from "../components/ui/GraphCard";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import StudioPageShell from "../components/ui/StudioPageShell";
import ResponsiveBarChart from "../components/charts/ResponsiveBarChart";
import ResponsiveLineChart from "../components/charts/ResponsiveLineChart";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";
import { distributionSpecs } from "../modules/probability-statistics/data/distributionAtlas";
import { statisticsLearningContent } from "../modules/probability-statistics/data/learningContent";
import { statisticsSyllabusStudios } from "../modules/probability-statistics/pages/StatisticsSyllabusCompletionPage";
import LearningExpansion from "../modules/probability-statistics/pages/LearningExpansion";

type AccentName = "cyan" | "violet" | "emerald" | "rose" | "amber" | "sky" | "indigo" | "slate";
type StatsTabId = "concepts" | "normal" | "data" | "learning";

type ConceptCardItem = {
  title: string;
  route: string;
  label: string;
  text: string;
  tags: readonly string[];
  icon: LucideIcon;
  accent: AccentName;
};

const conceptCards = [
  {
    title: "Probability & Statistics Map",
    route: "/probability-statistics/module",
    label: "Module",
    text: "Phase-wise roadmap for distributions, inference, regression, Bayesian reasoning, stochastic processes, and advanced models.",
    tags: ["roadmap", "module", "all concepts"],
    icon: Sigma,
    accent: "cyan",
  },
  {
    title: "Distribution Atlas",
    route: "/probability-statistics/distributions",
    label: "Distributions",
    text: "Open the complete atlas of discrete and continuous probability models with formulas, supports, charts, and examples.",
    tags: ["pmf", "pdf", "cdf", "models"],
    icon: BarChart3,
    accent: "violet",
  },
  {
    title: "Sampling Distributions",
    route: "/probability-statistics/sampling",
    label: "Inference base",
    text: "Standard error, repeated samples, CLT shape, confidence bands, and why larger samples stabilize estimates.",
    tags: ["standard error", "CLT", "sample mean"],
    icon: Shuffle,
    accent: "emerald",
  },
  {
    title: "Inference & Hypothesis Testing",
    route: "/probability-statistics/inference",
    label: "Decisions",
    text: "Confidence intervals, p-values, rejection regions, alpha, Type I/II error, and power intuition.",
    tags: ["p-value", "confidence interval", "power"],
    icon: BrainCircuit,
    accent: "rose",
  },
  {
    title: "Regression Diagnostics",
    route: "/probability-statistics/regression",
    label: "Models",
    text: "Least squares, residuals, R squared, outliers, curvature, and model fit checks.",
    tags: ["least squares", "residuals", "R squared"],
    icon: LineChart,
    accent: "amber",
  },
  {
    title: "Bayesian Reasoning",
    route: "/probability-statistics/bayesian",
    label: "Bayes",
    text: "Priors, likelihoods, posteriors, base rates, and beta conjugacy with live updates.",
    tags: ["prior", "posterior", "likelihood"],
    icon: GitBranch,
    accent: "sky",
  },
  {
    title: "Stochastic Processes",
    route: "/probability-statistics/stochastic",
    label: "Time systems",
    text: "Markov chains, random walks, Poisson arrivals, queues, reliability decay, and steady-state behavior.",
    tags: ["Markov", "queue", "Poisson process"],
    icon: Network,
    accent: "indigo",
  },
  {
    title: "Advanced Statistical Models",
    route: "/probability-statistics/advanced-models",
    label: "PG bridge",
    text: "Multivariate normal geometry, covariance, entropy, KL divergence, and mixture-model intuition.",
    tags: ["multivariate", "entropy", "mixture"],
    icon: FlaskConical,
    accent: "slate",
  },
] as const satisfies readonly ConceptCardItem[];

const syllabusCompletionCards = statisticsSyllabusStudios.map((studio, index) => ({
  title: studio.title,
  route: `/probability-statistics/${studio.id}`,
  label: studio.level,
  text: studio.subtitle,
  tags: studio.concepts.slice(0, 3),
  icon: [Shuffle, FlaskConical, BarChart3, LineChart, BrainCircuit, Sigma, BrainCircuit, Table2, GitBranch, Network, SlidersHorizontal, FlaskConical, BarChart3][index] ?? Sigma,
  accent: (["cyan", "violet", "emerald", "amber", "rose", "sky", "indigo", "slate"] as const)[index % 8],
})) satisfies ConceptCardItem[];

const quickConceptCards = [
  { title: "Normal Distribution", route: "/probability-statistics/distributions/normal", label: "Quick concept", text: "Bell curve, z-score, sigma, density, mean, and variance.", tags: ["z-score", "bell curve"], icon: Sigma, accent: "cyan" },
  { title: "Binomial Distribution", route: "/probability-statistics/distributions/binomial", label: "Quick concept", text: "Fixed trials, success probability, PMF, expectation, and variance.", tags: ["trials", "success"], icon: BarChart3, accent: "violet" },
  { title: "Poisson Distribution", route: "/probability-statistics/distributions/poisson", label: "Quick concept", text: "Counts in an interval, event rate lambda, and rare-event modelling.", tags: ["counts", "lambda"], icon: Table2, accent: "emerald" },
  { title: "Student t Distribution", route: "/probability-statistics/distributions/student-t", label: "Quick concept", text: "Small-sample mean inference when population sigma is unknown.", tags: ["small sample", "tails"], icon: Sigma, accent: "rose" },
] as const satisfies readonly ConceptCardItem[];

const statisticsConceptCards = [
  { title: "Data Handling", route: "/probability-statistics#data-lab", label: "School concept", text: "Collect, organize, summarize, and display raw data with tables, bars, histograms, and quick summaries.", tags: ["class 6", "tables", "graphs"], icon: Table2, accent: "cyan" },
  { title: "Descriptive Statistics", route: "/probability-statistics#data-lab", label: "Statistics basics", text: "Mean, median, mode, range, spread, histogram shape, and what a typical value can hide.", tags: ["mean", "median", "mode"], icon: BarChart3, accent: "emerald" },
  { title: "Normal Curve & z-Score", route: "/probability-statistics#normal-lab", label: "Interactive lab", text: "Move mean, standard deviation, and observed x to see z-score and cumulative probability update.", tags: ["normal", "z-score", "cdf"], icon: Sigma, accent: "violet" },
  { title: "Probability Basics", route: "/math-lab/probability", label: "Math Lab tool", text: "Run coins, dice, random variables, expected value, and Markov-chain experiments in one probability lab.", tags: ["sample space", "events", "simulation"], icon: FlaskConical, accent: "sky" },
  { title: "Conditional Probability", route: "/math-lab/probability", label: "Math Lab tool", text: "Compare given information, event overlap, conditional probability, Bayes updates, and tree-style reasoning.", tags: ["conditional", "Bayes", "tree"], icon: GitBranch, accent: "indigo" },
  { title: "Probability Visual Proofs", route: "/visual-proofs/probability", label: "Proof index", text: "Open visual proofs for complement, addition, multiplication, conditional probability, expected value, and tree diagrams.", tags: ["proofs", "rules", "expected value"], icon: BrainCircuit, accent: "rose" },
  { title: "Statistics Visual Proofs", route: "/visual-proofs/statistics", label: "Proof index", text: "Open visual proofs for mean as balance point, variance, histograms, correlation, regression, and sampling distributions.", tags: ["proofs", "variance", "correlation"], icon: LineChart, accent: "amber" },
  { title: "Data & Probability Lessons", route: "/lessons/data-and-probability", label: "Lesson index", text: "Browse guided interactive lessons from data handling through distributions, probability rules, regression, and inference.", tags: ["lessons", "practice", "guided"], icon: BrainCircuit, accent: "slate" },
  { title: "Statistical Inference Lessons", route: "/lessons/advanced-concepts", label: "Advanced lessons", text: "Open the advanced concept lesson pack for confidence intervals, p-values, tests, and Type I/II error.", tags: ["inference", "p-value", "confidence"], icon: Shuffle, accent: "emerald" },
  { title: "Spreadsheet & Data Workspace", route: "/workspace/data/spreadsheet", label: "Workspace tool", text: "Enter tabular data, build scatterplots, run regression, and move between spreadsheet and graph workflows.", tags: ["spreadsheet", "csv", "regression"], icon: Table2, accent: "cyan" },
] as const satisfies readonly ConceptCardItem[];

export default function ProbabilityStatistics() {
  const [activeTab, setActiveTab] = useState<StatsTabId>(() => readStatsTabFromUrl());
  const [conceptQuery, setConceptQuery] = useState("");
  const [mean, setMean] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [x, setX] = useState(1);
  const [rawData, setRawData] = useState("4, 5, 6, 6, 7, 7, 7, 8, 9, 10, 10, 11");
  const safeSigma = Math.max(0.1, sigma);
  const z = (x - mean) / safeSigma;
  const normalData = useMemo(() => Array.from({ length: 121 }, (_, index) => {
    const value = mean - 4 * safeSigma + (index / 120) * 8 * safeSigma;
    return { x: Number(value.toFixed(2)), y: normalPdf(value, mean, safeSigma) };
  }), [mean, safeSigma]);
  const samples = useMemo(() => rawData.split(/[,\s]+/).map(Number).filter(Number.isFinite), [rawData]);
  const histogram = useMemo(() => buildHistogram(samples), [samples]);
  const distributionCards = useMemo<ConceptCardItem[]>(() => distributionSpecs.map((spec) => ({
    title: spec.name,
    route: spec.route,
    label: spec.kind === "discrete" ? "Discrete distribution" : "Continuous distribution",
    text: spec.shortUse,
    tags: [spec.kind, spec.family, spec.formula],
    icon: spec.kind === "discrete" ? BarChart3 : LineChart,
    accent: spec.kind === "discrete" ? "cyan" : "violet",
  })), []);
  const allConcepts = useMemo(() => [...conceptCards, ...syllabusCompletionCards, ...statisticsConceptCards, ...quickConceptCards, ...distributionCards], [distributionCards]);
  const normalizedConceptQuery = conceptQuery.trim().toLowerCase();
  const filteredConcepts = useMemo(() => {
    if (!normalizedConceptQuery) return allConcepts;
    return allConcepts.filter((card) => cardMatches(card, normalizedConceptQuery));
  }, [allConcepts, normalizedConceptQuery]);
  const filteredCoreCards = useMemo(() => {
    if (!normalizedConceptQuery) return conceptCards;
    return conceptCards.filter((card) => cardMatches(card, normalizedConceptQuery));
  }, [normalizedConceptQuery]);
  const filteredStatisticsCards = useMemo(() => {
    if (!normalizedConceptQuery) return statisticsConceptCards;
    return statisticsConceptCards.filter((card) => cardMatches(card, normalizedConceptQuery));
  }, [normalizedConceptQuery]);
  const filteredSyllabusCompletionCards = useMemo(() => {
    if (!normalizedConceptQuery) return syllabusCompletionCards;
    return syllabusCompletionCards.filter((card) => cardMatches(card, normalizedConceptQuery));
  }, [normalizedConceptQuery]);
  const filteredQuickCards = useMemo(() => {
    if (!normalizedConceptQuery) return quickConceptCards;
    return quickConceptCards.filter((card) => cardMatches(card, normalizedConceptQuery));
  }, [normalizedConceptQuery]);
  const filteredDistributionCards = useMemo(() => {
    if (!normalizedConceptQuery) return distributionCards;
    return distributionCards.filter((card) => cardMatches(card, normalizedConceptQuery));
  }, [distributionCards, normalizedConceptQuery]);
  const hasVisibleCards = filteredConcepts.length > 0;
  const tabs = [
    { id: "concepts" as const, label: "Concepts", summary: "Search concept cards, distributions, inference pages, lessons, proof routes, and statistics studios." },
    { id: "normal" as const, label: "Normal Lab", summary: "Move mean, standard deviation, and observed x to see z-score and cumulative probability update." },
    { id: "data" as const, label: "Data Lab", summary: "Enter raw data, read quick summaries, and build a histogram from the same sample." },
    { id: "learning" as const, label: "Learning", summary: "Open the overview learning expansion and the domain readiness panel in one place." },
  ];
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  const selectTab = (tabId: StatsTabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    if (tabId === "concepts") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tabId);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  useEffect(() => {
    const onPopState = () => setActiveTab(readStatsTabFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <StudioPageShell
      className="stats-studio"
      title="Probability & Statistics Studio"
      subtitle="Open concept cards for distributions, inference, regression, Bayesian reasoning, stochastic processes, and data labs."
      breadcrumbs={["Home", "Probability & Statistics"]}
      difficulty="Concept Home"
      estimatedMinutes={10}
      progress={76}
      status={[
        { id: "cards", label: "Index cards", value: allConcepts.length, tone: "cyan" },
        { id: "distributions", label: "Distributions", value: distributionSpecs.length, tone: "violet" },
      ]}
    >
      <div className="stats-workspace">
        <section className="stats-main-panel" aria-label="Probability and statistics workspace">
          <div className="stats-tabs" role="tablist" aria-label="Probability and statistics sections">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={tab.id === currentTab.id} className={tab.id === currentTab.id ? "active" : ""} onClick={() => selectTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="stats-context-strip">
            <div>
              <span>Current view</span>
              <strong>{currentTab.label}</strong>
            </div>
            <p>{currentTab.summary}</p>
          </div>
          <div className="stats-tab-content thin-scrollbar">
            {activeTab === "concepts" ? (
              <div className="grid gap-4">
                {!hasVisibleCards ? <p className="rounded-2xl bg-white p-4 text-sm font-bold dark:bg-slate-950">No probability or statistics concept matches that search.</p> : null}
                <ConceptSection title="Main interactive studios" description="The primary probability and statistics tools. Each card opens a dedicated interactive page." cards={filteredCoreCards} />
                <ConceptSection title="UG, PG, and professional statistics studios" description="Survey sampling, DOE, SQC, time series, nonparametrics, multivariate, advanced inference, official statistics, survival, actuarial, computing, modelling, and school statistics polish." cards={filteredSyllabusCompletionCards} />
                <ConceptSection title="Concepts, lessons, and proof tools" description="School-to-university concepts plus visual proof and workspace routes." cards={filteredStatisticsCards} />
                <ConceptSection title="Popular distribution shortcuts" description="Fast links to the most-used probability distribution pages." cards={filteredQuickCards} />
                <ConceptSection title="Complete distribution index" description="All distribution concepts currently wired in the atlas, with a basic use-case description for each." cards={filteredDistributionCards} />
              </div>
            ) : null}
            {activeTab === "normal" ? (
              <div id="normal-lab" className="grid gap-6 scroll-mt-24 xl:grid-cols-[320px_minmax(0,1fr)]">
                <SectionCard title="Normal Controls">
                  <div className="space-y-4">
                    <SliderGroup title="Distribution parameters">
                      <SliderControl density="compact" label="Mean mu" value={mean} min={-10} max={10} step={0.1} onChange={setMean} />
                      <SliderControl density="compact" label="Standard deviation sigma" value={safeSigma} min={0.1} max={6} step={0.1} onChange={setSigma} />
                      <SliderControl density="compact" label="Observed x" value={x} min={-15} max={15} step={0.1} onChange={setX} />
                    </SliderGroup>
                    <div className="rounded-2xl bg-cyan-50 p-4 text-sm font-semibold text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">
                      z = (x - mu) / sigma = {round(z)}<br />
                      {"P(Z <= z) ~= "} {round(normalCdf(z))}
                    </div>
                  </div>
                </SectionCard>
                <GraphCard title="Normal Distribution Curve">
                  <ResponsiveLineChart data={normalData} lineColor="#8b5cf6" />
                </GraphCard>
              </div>
            ) : null}
            {activeTab === "data" ? (
              <div id="data-lab" className="grid gap-6 scroll-mt-24 xl:grid-cols-[320px_minmax(0,1fr)]">
                <SectionCard title="Manual Data Input" description="Enter numbers separated by commas or spaces.">
                  <textarea className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-slate-950/60" value={rawData} onChange={(event) => setRawData(event.target.value)} />
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Stat label="n" value={samples.length} />
                    <Stat label="mean" value={round(avg(samples))} />
                    <Stat label="min" value={round(Math.min(...samples))} />
                    <Stat label="max" value={round(Math.max(...samples))} />
                  </div>
                </SectionCard>
                <GraphCard title="Histogram Builder">
                  <ResponsiveBarChart data={histogram} color="#14b8a6" />
                </GraphCard>
              </div>
            ) : null}
            {activeTab === "learning" ? (
              <div className="grid gap-4">
                <LearningExpansion content={statisticsLearningContent.overview} />
                <PhaseTwoDomainPanel domain="statistics-probability" />
              </div>
            ) : null}
          </div>
        </section>
        <aside className="stats-inspector thin-scrollbar" aria-label="Probability and statistics inspector">
          <div className="stats-guide-card">
            <span>Studio guide</span>
            <h2>{currentTab.label}</h2>
            <p>{currentTab.summary}</p>
          </div>
          <label className="stats-search-box">
            <Search className="h-5 w-5 text-cyan-600" />
            <input value={conceptQuery} onChange={(event) => setConceptQuery(event.target.value)} placeholder="Search normal, p-value, regression..." />
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          </label>
          <div className="stats-mini-grid">
            <Stat label="Index cards" value={allConcepts.length} />
            <Stat label="Visible" value={filteredConcepts.length} />
            <Stat label="Distributions" value={distributionSpecs.length} />
            <Stat label="Tools" value={conceptCards.length + statisticsConceptCards.length} />
          </div>
          <SectionCard title="Live Normal" compact>
            <div className="grid gap-2 text-sm font-semibold">
              <p>z = {round(z)}</p>
              <p>P(Z &lt;= z) ~= {round(normalCdf(z))}</p>
            </div>
          </SectionCard>
          <SectionCard title="Data Snapshot" compact>
            <div className="grid gap-2 text-sm font-semibold">
              <p>n = {samples.length}</p>
              <p>mean = {round(avg(samples))}</p>
            </div>
          </SectionCard>
        </aside>
      </div>
    </StudioPageShell>
  );
}

function ConceptSection({ title, description, cards }: { title: string; description: string; cards: readonly ConceptCardItem[] }) {
  if (!cards.length) return null;
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{cards.length} cards</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <ConceptCard key={`${card.route}-${card.title}-${card.label}`} card={card} />)}
      </div>
    </section>
  );
}

function cardMatches(card: ConceptCardItem, query: string) {
  return `${card.title} ${card.label} ${card.text} ${card.tags.join(" ")}`.toLowerCase().includes(query);
}

function ConceptCard({ card }: { card: ConceptCardItem }) {
  const Icon = card.icon;
  const color = accentClasses(card.accent);
  return (
    <Link to={card.route} className={`group flex min-h-[210px] flex-col rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-950/70 ${color.border}`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${color.iconBg} ${color.iconText}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${color.chip}`}>{card.label}</span>
      </div>
      <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">{card.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.text}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {card.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{tag}</span>)}
      </div>
      <span className={`mt-auto inline-flex items-center gap-2 pt-4 text-sm font-black ${color.link}`}>
        Open concept <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function accentClasses(accent: AccentName) {
  const styles = {
    cyan: { border: "border-cyan-200 hover:border-cyan-400 dark:border-cyan-300/20", iconBg: "bg-cyan-50 dark:bg-cyan-400/10", iconText: "text-cyan-700 dark:text-cyan-100", chip: "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100", link: "text-cyan-700 dark:text-cyan-300" },
    violet: { border: "border-violet-200 hover:border-violet-400 dark:border-violet-300/20", iconBg: "bg-violet-50 dark:bg-violet-400/10", iconText: "text-violet-700 dark:text-violet-100", chip: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-100", link: "text-violet-700 dark:text-violet-300" },
    emerald: { border: "border-emerald-200 hover:border-emerald-400 dark:border-emerald-300/20", iconBg: "bg-emerald-50 dark:bg-emerald-400/10", iconText: "text-emerald-700 dark:text-emerald-100", chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-100", link: "text-emerald-700 dark:text-emerald-300" },
    rose: { border: "border-rose-200 hover:border-rose-400 dark:border-rose-300/20", iconBg: "bg-rose-50 dark:bg-rose-400/10", iconText: "text-rose-700 dark:text-rose-100", chip: "bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-100", link: "text-rose-700 dark:text-rose-300" },
    amber: { border: "border-amber-200 hover:border-amber-400 dark:border-amber-300/20", iconBg: "bg-amber-50 dark:bg-amber-400/10", iconText: "text-amber-700 dark:text-amber-100", chip: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-100", link: "text-amber-700 dark:text-amber-300" },
    sky: { border: "border-sky-200 hover:border-sky-400 dark:border-sky-300/20", iconBg: "bg-sky-50 dark:bg-sky-400/10", iconText: "text-sky-700 dark:text-sky-100", chip: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-100", link: "text-sky-700 dark:text-sky-300" },
    indigo: { border: "border-indigo-200 hover:border-indigo-400 dark:border-indigo-300/20", iconBg: "bg-indigo-50 dark:bg-indigo-400/10", iconText: "text-indigo-700 dark:text-indigo-100", chip: "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-100", link: "text-indigo-700 dark:text-indigo-300" },
    slate: { border: "border-slate-200 hover:border-slate-400 dark:border-white/10", iconBg: "bg-slate-100 dark:bg-white/10", iconText: "text-slate-700 dark:text-slate-100", chip: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-100", link: "text-slate-700 dark:text-slate-300" },
  };
  return styles[accent];
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><span className="text-xs uppercase text-slate-500">{label}</span><p className="font-mono font-black">{String(value)}</p></div>;
}

function normalPdf(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function normalCdf(z: number) {
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * a);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return 0.5 * (1 + sign * erf);
}

function buildHistogram(values: number[]) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bins = Math.min(10, Math.max(4, Math.ceil(Math.sqrt(values.length))));
  const width = (max - min || 1) / bins;
  return Array.from({ length: bins }, (_, index) => {
    const start = min + index * width;
    const end = index === bins - 1 ? max : start + width;
    const count = values.filter((value) => value >= start && (index === bins - 1 ? value <= end : value < end)).length;
    return { name: `${round(start)}-${round(end)}`, value: count };
  });
}

function avg(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function round(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "0";
}

function readStatsTabFromUrl(): StatsTabId {
  if (typeof window === "undefined") return "concepts";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "normal" || tab === "data" || tab === "learning") return tab;
  return "concepts";
}
