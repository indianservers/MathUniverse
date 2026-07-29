import { ArrowLeft, BookOpen, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import TopicHeader from "../../../components/ui/TopicHeader";

export type StatisticsSyllabusStudioId =
  | "survey-sampling"
  | "design-of-experiments"
  | "quality-control"
  | "time-series"
  | "nonparametric"
  | "multivariate-analysis"
  | "advanced-inference"
  | "official-statistics"
  | "survival-analysis"
  | "actuarial-reliability"
  | "statistical-computing"
  | "applied-modelling"
  | "school-statistics";

type StudioConfig = {
  id: StatisticsSyllabusStudioId;
  title: string;
  subtitle: string;
  level: "School polish" | "UG core" | "PG depth" | "Professional";
  formula: string;
  controlA: ControlSpec;
  controlB: ControlSpec;
  controlC: ControlSpec;
  theory: string[];
  concepts: string[];
  workflow: string[];
  examples: string[];
};

type ControlSpec = {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

type Point = { x: number; y: number; label?: string };
type Model = {
  metrics: Array<[string, string]>;
  line: Point[];
  bars: Point[];
  highlight: string;
  interpretation: string;
};

export const statisticsSyllabusStudios: StudioConfig[] = [
  {
    id: "survey-sampling",
    title: "Survey Sampling Studio",
    subtitle: "Stratified, systematic, cluster, and multistage sampling with finite population correction and allocation logic.",
    level: "UG core",
    formula: "SE_strat = sqrt(sum W_h^2 S_h^2 / n_h) x sqrt((N-n)/(N-1))",
    controlA: control("Population size N", 500, 100000, 500, 12000),
    controlB: control("Sample size n", 20, 2000, 10, 600),
    controlC: control("Strata imbalance", 0, 1, 0.01, 0.42),
    theory: [
      "Stratification divides a population into meaningful groups before sampling, often reducing variance when groups differ.",
      "Finite population correction matters when the sample is a non-trivial fraction of the population.",
      "Neyman allocation gives more sample to large or variable strata, not necessarily equal sample to every stratum.",
    ],
    concepts: ["Stratified sampling", "Systematic sampling", "Cluster sampling", "Multistage sampling", "Finite population correction", "Neyman allocation", "Sampling vs census"],
    workflow: ["Define population and sampling frame.", "Choose design based on cost and heterogeneity.", "Allocate sample across strata or clusters.", "Estimate mean/proportion with standard error.", "Explain bias, non-response, and design effect."],
    examples: ["Election polling across states and urban/rural strata.", "Household expenditure survey with ward-level clusters.", "School achievement survey with schools as first-stage units."],
  },
  {
    id: "design-of-experiments",
    title: "Design of Experiments Studio",
    subtitle: "CRD, RBD, Latin square, factorial interaction, blocking, replication, randomization, and ANOVA construction.",
    level: "UG core",
    formula: "F = MS_treatment / MS_error",
    controlA: control("Treatment effect", 0, 12, 0.1, 4.5),
    controlB: control("Block noise removed", 0, 1, 0.01, 0.35),
    controlC: control("Replicates per cell", 2, 12, 1, 5),
    theory: [
      "Randomization protects against hidden systematic bias in treatment assignment.",
      "Blocking removes known nuisance variation so the treatment comparison becomes sharper.",
      "Interaction means the effect of one factor changes depending on the level of another factor.",
    ],
    concepts: ["CRD", "RBD", "Latin square", "Factorial design", "Interaction", "Blocking", "Replication", "ANOVA table"],
    workflow: ["Select response and factors.", "Randomize treatments.", "Block known nuisance sources.", "Compute sums of squares.", "Compare F statistic with error noise.", "Interpret main effects and interactions."],
    examples: ["Fertilizer trial across plots with soil blocks.", "Website A/B/n experiment with traffic segments.", "Manufacturing temperature-pressure factorial experiment."],
  },
  {
    id: "quality-control",
    title: "Statistical Quality Control Studio",
    subtitle: "X-bar, R, p, np, c, u charts, process capability, and control limits versus specification limits.",
    level: "UG core",
    formula: "Cp = (USL-LSL)/(6 sigma),  Cpk = min(USL-mu, mu-LSL)/(3 sigma)",
    controlA: control("Process mean shift", -3, 3, 0.05, 0.6),
    controlB: control("Process sigma", 0.3, 3, 0.05, 1),
    controlC: control("Defect rate", 0.001, 0.2, 0.001, 0.035),
    theory: [
      "Control limits describe expected process variation; specification limits describe customer tolerance.",
      "A process can be in statistical control but still incapable if it is too variable for the specifications.",
      "Attribute charts model defect counts or proportions; variable charts model measured quantities.",
    ],
    concepts: ["X-bar chart", "R chart", "p chart", "np chart", "c chart", "u chart", "Cp", "Cpk", "Control vs specification limits"],
    workflow: ["Choose variable or attribute chart.", "Estimate center and variation from stable data.", "Draw UCL and LCL.", "Flag points and patterns.", "Compute capability against specifications.", "Decide adjustment or investigation."],
    examples: ["Bottle-fill volume monitoring.", "Defective boards per production batch.", "Call-center error rate per audited sample."],
  },
  {
    id: "time-series",
    title: "Time Series Studio",
    subtitle: "Trend, seasonality, moving averages, exponential smoothing, ACF/PACF intuition, ARMA/ARIMA, and forecast error.",
    level: "UG core",
    formula: "y_t = trend_t + seasonal_t + error_t,  S_t = alpha y_t + (1-alpha)S_(t-1)",
    controlA: control("Trend slope", -2, 4, 0.1, 1.1),
    controlB: control("Season strength", 0, 12, 0.1, 6),
    controlC: control("Smoothing alpha", 0.05, 0.95, 0.01, 0.28),
    theory: [
      "Trend is long-run direction; seasonality is repeated calendar pattern; residuals are what remains.",
      "Moving averages smooth noise but lag turning points.",
      "ACF/PACF patterns help distinguish autoregressive and moving-average behavior before ARIMA modelling.",
    ],
    concepts: ["Trend", "Seasonal", "Cyclic", "Irregular", "Moving average", "Exponential smoothing", "ACF/PACF", "AR", "MA", "ARMA/ARIMA", "Forecast error metrics"],
    workflow: ["Plot the series.", "Separate trend and seasonality.", "Smooth or difference if needed.", "Inspect lag dependence.", "Forecast.", "Score with MAE, RMSE, or MAPE."],
    examples: ["Monthly retail demand forecast.", "Electricity load with daily seasonality.", "Rainfall or price index trend analysis."],
  },
  {
    id: "nonparametric",
    title: "Nonparametric Tests Studio",
    subtitle: "Sign, Wilcoxon, Mann-Whitney U, Kruskal-Wallis, and runs tests with rank-based decision intuition.",
    level: "UG core",
    formula: "U = R_1 - n_1(n_1+1)/2",
    controlA: control("Group shift", -2.5, 2.5, 0.05, 0.8),
    controlB: control("Noise / spread", 0.4, 3, 0.05, 1.1),
    controlC: control("Sample size", 6, 60, 1, 22),
    theory: [
      "Nonparametric tests are useful when normal assumptions are weak, sample sizes are small, or ranks are more trustworthy than values.",
      "Rank transformations preserve ordering while reducing sensitivity to extreme values.",
      "Mann-Whitney tests stochastic ordering, not only a difference in means.",
    ],
    concepts: ["Sign test", "Wilcoxon signed-rank", "Mann-Whitney U", "Kruskal-Wallis", "Runs test", "Rank transformation"],
    workflow: ["Choose paired, two-sample, or k-sample structure.", "Convert values to signs or ranks.", "Compute rank statistic.", "Compare to null distribution or normal approximation.", "Report effect direction and assumptions."],
    examples: ["Before-after pain scores.", "Two teaching methods with ordinal scores.", "Checking if pass/fail sequence is random."],
  },
  {
    id: "multivariate-analysis",
    title: "Multivariate Analysis Expansion",
    subtitle: "Wishart, Hotelling T2, MANOVA, PCA, canonical correlation, and classification boundaries.",
    level: "PG depth",
    formula: "T2 = n (xbar-mu)' S^-1 (xbar-mu)",
    controlA: control("Correlation", -0.9, 0.9, 0.01, 0.55),
    controlB: control("Group separation", 0, 6, 0.1, 2.4),
    controlC: control("Dimension pressure", 2, 20, 1, 6),
    theory: [
      "Multivariate methods model variables together, so covariance is part of the signal rather than a nuisance.",
      "PCA rotates data toward directions of maximum variance; classification uses boundaries in feature space.",
      "Wishart theory describes random covariance matrices and supports multivariate inference.",
    ],
    concepts: ["Wishart distribution", "Hotelling T2", "MANOVA", "PCA", "Canonical correlation", "Classification boundaries"],
    workflow: ["Standardize variables.", "Inspect covariance and correlation.", "Reduce or test dimensions.", "Fit multivariate model.", "Interpret axes, loadings, and boundaries."],
    examples: ["Iris-style botanical classification.", "Finance portfolio covariance.", "Multiple biomarker treatment comparison."],
  },
  {
    id: "advanced-inference",
    title: "Advanced Inference Expansion",
    subtitle: "MLE workflow, likelihood curves, Fisher information, likelihood-ratio tests, asymptotics, delta method, and SPRT.",
    level: "PG depth",
    formula: "I(theta) = -E[d2 log L(theta)/d theta2]",
    controlA: control("True parameter", 0.1, 0.9, 0.01, 0.62),
    controlB: control("Sample size", 10, 1000, 10, 180),
    controlC: control("Null distance", 0, 0.4, 0.01, 0.12),
    theory: [
      "MLE chooses the parameter that makes observed data most likely.",
      "Fisher information measures local curvature of the likelihood and controls estimator precision.",
      "Likelihood-ratio and sequential tests compare evidence paths, not only one fixed statistic.",
    ],
    concepts: ["MLE", "Likelihood curve", "Fisher information", "Neyman-Pearson lemma", "Likelihood ratio test", "Asymptotic normality", "Delta method", "SPRT"],
    workflow: ["Write likelihood.", "Log-transform and maximize.", "Read curvature/information.", "Compare hypotheses by likelihood ratio.", "Use asymptotic approximation or simulation check."],
    examples: ["Estimating conversion probability.", "Reliability failure-rate estimation.", "Sequential quality decision in batch testing."],
  },
  {
    id: "official-statistics",
    title: "Survey and Official Statistics Studio",
    subtitle: "Index numbers, CPI/WPI, demography, vital statistics, official data-source literacy, and Indian statistical system context.",
    level: "Professional",
    formula: "Laspeyres index = sum p_t q_0 / sum p_0 q_0 x 100",
    controlA: control("Price inflation", -0.05, 0.25, 0.005, 0.07),
    controlB: control("Basket weight shift", 0, 1, 0.01, 0.35),
    controlC: control("Birth-death gap", -20, 30, 1, 12),
    theory: [
      "Index numbers summarize price or quantity change relative to a base period and depend on basket weights.",
      "CPI and WPI answer different price questions because their baskets and scopes differ.",
      "Official statistics require metadata literacy: source, frame, definitions, revision policy, and comparability.",
    ],
    concepts: ["Index numbers", "CPI", "WPI", "Demography", "Vital statistics", "Official statistical system", "Data-source literacy"],
    workflow: ["Identify source and definition.", "Choose base period and basket.", "Compute index.", "Read demographic rate.", "Check revisions and coverage before comparison."],
    examples: ["Consumer price inflation dashboard.", "District birth and death rate comparison.", "Reading MOSPI/RBI-style statistical tables."],
  },
  {
    id: "survival-analysis",
    title: "Biostatistics and Survival Analysis Studio",
    subtitle: "Kaplan-Meier curves, hazard, censoring, log-rank tests, clinical-trial language, and treatment-control designs.",
    level: "UG core",
    formula: "S(t) = product(1 - d_i/n_i)",
    controlA: control("Treatment effect", 0, 0.8, 0.01, 0.32),
    controlB: control("Censoring rate", 0, 0.7, 0.01, 0.18),
    controlC: control("Baseline hazard", 0.02, 0.4, 0.01, 0.12),
    theory: [
      "Survival analysis handles time-to-event data, especially when some subjects are censored.",
      "The Kaplan-Meier curve updates survival only at event times.",
      "The log-rank test compares survival curves across groups over the observed event times.",
    ],
    concepts: ["Kaplan-Meier", "Hazard", "Censoring", "Log-rank test", "Clinical trial", "Treatment-control design"],
    workflow: ["Define event and origin time.", "Mark censored observations.", "Build risk sets.", "Compute survival steps.", "Compare groups with log-rank style evidence."],
    examples: ["Time to relapse in a clinical trial.", "Machine part lifetime with censored tests.", "Customer churn duration analysis."],
  },
  {
    id: "actuarial-reliability",
    title: "Actuarial and Reliability Statistics Studio",
    subtitle: "Life tables, survival functions, hazard rates, risk models, premium basics, and ruin intuition.",
    level: "Professional",
    formula: "Premium approx E[claim] + loading,  R(t)=S(t)",
    controlA: control("Claim frequency", 0.01, 0.5, 0.01, 0.12),
    controlB: control("Claim severity", 1000, 100000, 1000, 18000),
    controlC: control("Safety loading", 0, 0.8, 0.01, 0.22),
    theory: [
      "Life tables track survival by age or duration and turn hazards into expected lifetimes.",
      "Actuarial risk combines claim frequency and claim severity.",
      "Ruin intuition compares reserve plus premium income against random aggregate claims.",
    ],
    concepts: ["Life tables", "Survival function", "Hazard rate", "Risk model", "Premium", "Ruin probability"],
    workflow: ["Estimate frequency and severity.", "Compute expected aggregate loss.", "Add safety loading.", "Track reserve stress under claim scenarios.", "Explain risk and solvency tradeoff."],
    examples: ["Insurance premium quote.", "Warranty reserve planning.", "Server failure and replacement reserve."],
  },
  {
    id: "statistical-computing",
    title: "Statistical Computing Lab",
    subtitle: "Monte Carlo integration, random number generation, bootstrap, permutation tests, CSV-style workflow, and R/Python-style snippets.",
    level: "Professional",
    formula: "bootstrap SE = sd(theta*_1, ..., theta*_B)",
    controlA: control("Simulation runs", 100, 10000, 100, 2000),
    controlB: control("Bootstrap spread", 0.1, 5, 0.1, 1.4),
    controlC: control("Permutation effect", 0, 3, 0.05, 0.7),
    theory: [
      "Monte Carlo estimates expectations by repeated random simulation.",
      "Bootstrap estimates sampling uncertainty by resampling observed data.",
      "Permutation tests create a null distribution by shuffling labels instead of assuming a formula distribution.",
    ],
    concepts: ["Monte Carlo integration", "Random number generation", "Bootstrap", "Permutation test", "CSV workflow", "R/Python style snippets"],
    workflow: ["Define statistic.", "Generate or resample data.", "Repeat many times.", "Build simulated distribution.", "Read standard error, interval, or p-value.", "Export reproducible steps."],
    examples: ["Bootstrap median confidence interval.", "Permutation test for two classroom groups.", "Monte Carlo area under a curve."],
  },
  {
    id: "applied-modelling",
    title: "Applied Modelling Workflows Studio",
    subtitle: "GLMs, Poisson/logistic regression diagnostics, deviance, AIC/BIC, cross-validation, train/test split, and causal basics.",
    level: "PG depth",
    formula: "AIC = 2k - 2 log L,  logit(p)=b0+b1x",
    controlA: control("Signal strength", 0, 4, 0.1, 1.7),
    controlB: control("Model complexity", 1, 12, 1, 4),
    controlC: control("Confounding", 0, 1, 0.01, 0.35),
    theory: [
      "GLMs model non-normal outcomes through a link function and likelihood.",
      "AIC/BIC balance fit against complexity; cross-validation checks prediction on held-out data.",
      "Causal inference asks what would happen under intervention, so confounding must be handled deliberately.",
    ],
    concepts: ["GLM", "Poisson regression", "Logistic regression", "Deviance", "AIC/BIC", "Cross-validation", "Train/test split", "Confounding", "Matching", "Treatment effect"],
    workflow: ["Choose outcome family and link.", "Fit candidate models.", "Inspect residual/deviance behavior.", "Compare AIC/BIC and validation error.", "Address confounding before causal claims."],
    examples: ["Hospital readmission logistic model.", "Call arrivals Poisson regression.", "Treatment effect with matched customers."],
  },
  {
    id: "school-statistics",
    title: "School-Level Statistics Polish",
    subtitle: "Grouped-data median/mode, ogives, pictographs, bar graphs, and without-replacement tree diagrams.",
    level: "School polish",
    formula: "Median = L + ((N/2 - cf)/f)h",
    controlA: control("Class width h", 2, 20, 1, 10),
    controlB: control("Median class frequency", 5, 80, 1, 32),
    controlC: control("Previous cumulative frequency", 0, 100, 1, 48),
    theory: [
      "Grouped-data median estimates the middle from class intervals, not individual raw values.",
      "An ogive plots cumulative frequency and lets students read medians and quartiles visually.",
      "Without-replacement tree diagrams update probabilities after each draw.",
    ],
    concepts: ["Grouped-data median", "Grouped-data mode", "Ogive", "Pictograph", "Bar graph", "Without-replacement probability tree"],
    workflow: ["Build frequency table.", "Compute cumulative frequency.", "Locate median class.", "Use formula and ogive cross-read.", "Compare pictograph and bar chart for younger learners."],
    examples: ["Class 10 grouped marks median.", "Class 6 pictograph of library books.", "Drawing two balls without replacement."],
  },
];

export function getStatisticsSyllabusStudio(id?: string) {
  return statisticsSyllabusStudios.find((studio) => studio.id === id) ?? statisticsSyllabusStudios[0];
}

export default function StatisticsSyllabusCompletionPage({ studioId }: { studioId: StatisticsSyllabusStudioId }) {
  const studio = getStatisticsSyllabusStudio(studioId);
  const [a, setA] = useState(studio.controlA.defaultValue);
  const [b, setB] = useState(studio.controlB.defaultValue);
  const [c, setC] = useState(studio.controlC.defaultValue);

  const model = useMemo(() => buildModel(studio.id, a, b, c), [a, b, c, studio.id]);

  return (
    <div className="space-y-6">
      <TopicHeader
        title={studio.title}
        subtitle={studio.subtitle}
        difficulty={studio.level}
        estimatedMinutes={18}
        formula={{ title: "Core formula", formula: studio.formula, explanation: model.interpretation }}
      />

      <div className="flex flex-wrap gap-2">
        <Link className="mini-chip" to="/probability-statistics">
          <ArrowLeft className="h-3.5 w-3.5" /> Probability & Statistics
        </Link>
        <Link className="mini-chip" to="/probability-statistics/module">
          <Sigma className="h-3.5 w-3.5" /> Module
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Live Controls" description="Move the sliders and the example, chart, and interpretation update immediately.">
          <SliderGroup>
            <SliderControl density="compact" label={studio.controlA.label} value={a} min={studio.controlA.min} max={studio.controlA.max} step={studio.controlA.step} onChange={setA} />
            <SliderControl density="compact" label={studio.controlB.label} value={b} min={studio.controlB.min} max={studio.controlB.max} step={studio.controlB.step} onChange={setB} />
            <SliderControl density="compact" label={studio.controlC.label} value={c} min={studio.controlC.min} max={studio.controlC.max} step={studio.controlC.step} onChange={setC} />
          </SliderGroup>
          <MetricGrid items={model.metrics} />
        </SectionCard>

        <SectionCard title="Interactive Model" description={model.interpretation} allowFullscreen>
          <div className="min-h-[390px] rounded-2xl border border-slate-200 bg-slate-950 p-3 dark:border-white/10">
            <StudioSvg title={studio.title} model={model} />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionCard title="Concepts Covered" description="These are the missing syllabus items now represented in this studio.">
          <div className="flex flex-wrap gap-2">
            {studio.concepts.map((concept) => <span key={concept} className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{concept}</span>)}
          </div>
        </SectionCard>
        <SectionCard title="Real-Time Examples" description="Use these as classroom or applied-data prompts.">
          <div className="grid gap-2 md:grid-cols-3">
            {studio.examples.map((example) => <p key={example} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">{example}</p>)}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Theory Notes" description="Knowledge layer for lessons, revision, and university-depth teaching.">
          <div className="grid gap-3">
            {studio.theory.map((item) => (
              <article key={item} className="rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
                <BookOpen className="mb-2 h-4 w-4 text-cyan-500" />
                {item}
              </article>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Workflow" description="A practical sequence for solving real statistical tasks.">
          <ol className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {studio.workflow.map((step, index) => (
              <li key={step} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="mr-2 font-black text-cyan-700 dark:text-cyan-200">{index + 1}.</span>{step}
              </li>
            ))}
          </ol>
        </SectionCard>
      </section>

      <SectionCard title="Syllabus Completion Map" description="All missing concepts from the report are available as interactive studios.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {statisticsSyllabusStudios.map((item) => (
            <Link key={item.id} to={`/probability-statistics/${item.id}`} className={`group rounded-xl border p-3 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-300/10 ${item.id === studio.id ? "border-cyan-300 bg-cyan-50 dark:border-cyan-300/40 dark:bg-cyan-300/10" : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/60"}`}>
              <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{item.level}</p>
              <h3 className="mt-2 font-black text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.subtitle}</p>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function buildModel(id: StatisticsSyllabusStudioId, a: number, b: number, c: number): Model {
  switch (id) {
    case "survey-sampling": {
      const fpc = Math.sqrt(Math.max(0, (a - b) / Math.max(1, a - 1)));
      const stratGain = 1 - 0.38 * c;
      const se = 40 / Math.sqrt(b) * fpc * stratGain;
      return model(
        [["FPC", fmt(fpc)], ["Stratified SE", fmt(se)], ["Census cost saved", pct(1 - b / a)], ["Neyman shift", pct(c)]],
        curve(1, 8, 28, (x) => se * (1 + Math.sin(x) * 0.08)),
        bars([["S1", 0.24 + c * 0.2], ["S2", 0.32], ["S3", 0.44 - c * 0.18]]),
        "Stratified allocation reduces standard error when strata are different and sample is assigned intelligently.",
      );
    }
    case "design-of-experiments": {
      const error = Math.max(0.4, 8 * (1 - b) / Math.sqrt(c));
      const f = (a ** 2) / error;
      return model(
        [["F statistic", fmt(f)], ["Error MS", fmt(error)], ["Replicates", fmt(c)], ["Block gain", pct(b)]],
        curve(0, 5, 30, (x) => 18 + a * x + Math.sin(x * 2) * error),
        bars([["Control", 20], ["T1", 20 + a], ["T2", 20 + a * 1.45], ["T3", 20 + a * 0.72]]),
        "Blocking and replication make treatment differences easier to separate from background noise.",
      );
    }
    case "quality-control": {
      const cp = 6 / (6 * b);
      const cpk = Math.min(3 - a, 3 + a) / (3 * b);
      return model(
        [["Cp", fmt(cp)], ["Cpk", fmt(cpk)], ["Defect pct", pct(c)], ["State", Math.abs(a) > 2 || b > 1.7 ? "investigate" : "stable"]],
        curve(1, 24, 24, (x) => a + Math.sin(x * 1.7) * b + Math.cos(x * 0.4) * b * 0.4),
        bars([["p", c], ["np", c * 100], ["c", c * 45], ["u", c * 18]]),
        "Control charts detect process signals; capability compares the process to customer specifications.",
      );
    }
    case "time-series": {
      const line = curve(1, 36, 36, (t) => 30 + a * t / 2 + b * Math.sin((2 * Math.PI * t) / 12));
      const smooth = exponentialSmooth(line, c);
      return model(
        [["Last forecast", fmt(smooth[smooth.length - 1].y)], ["Season range", fmt(2 * b)], ["Alpha", fmt(c)], ["MAE proxy", fmt(Math.abs(a) + b * (1 - c) / 3)]],
        smooth,
        bars([["Trend", Math.abs(a)], ["Season", b], ["Cycle", b * 0.45], ["Irregular", (1 - c) * 5]]),
        "Trend, seasonality, and smoothing interact: higher alpha reacts faster but can chase noise.",
      );
    }
    case "nonparametric": {
      const n = Math.round(c);
      const u = (n * n) / 2 + a * n * 2.2;
      const z = a / (b / Math.sqrt(n));
      return model(
        [["Mann-Whitney U", fmt(u)], ["Rank z", fmt(z)], ["Sample size", fmt(n)], ["Evidence", Math.abs(z) > 1.96 ? "strong" : "moderate"]],
        curve(1, n, n, (x) => x + Math.sin(x * 1.8) * b + a * 2),
        bars([["Sign", Math.max(0, 0.5 + a / 5)], ["Wilcoxon", Math.abs(z)], ["M-W U", Math.abs(u) / Math.max(1, n * n)], ["Runs", 1 / b]]),
        "Rank tests convert noisy values into ordered evidence, making them robust for skewed or ordinal data.",
      );
    }
    case "multivariate-analysis": {
      const t2 = (b ** 2) / Math.max(0.1, 1 - a ** 2) * c;
      return model(
        [["Hotelling T2", fmt(t2)], ["Correlation", fmt(a)], ["PCA first axis", pct((1 + Math.abs(a)) / 2)], ["Dimensions", fmt(c)]],
        curve(-4, 4, 40, (x) => normalPdf(x, -b / 2, 1.1) + normalPdf(x, b / 2, 1.2)),
        bars([["PC1", (1 + Math.abs(a)) / 2], ["PC2", (1 - Math.abs(a)) / 2], ["T2", t2 / 80], ["MANOVA", b / 6]]),
        "Correlation tilts the covariance ellipse; separation and dimension pressure drive multivariate test evidence.",
      );
    }
    case "advanced-inference": {
      const se = Math.sqrt(a * (1 - a) / b);
      const info = b / Math.max(0.01, a * (1 - a));
      const lr = (c / Math.max(se, 0.001)) ** 2;
      return model(
        [["MLE", fmt(a)], ["Fisher info", fmt(info)], ["SE", fmt(se)], ["LR stat", fmt(lr)]],
        curve(Math.max(0.01, a - 0.35), Math.min(0.99, a + 0.35), 60, (theta) => Math.exp(-((theta - a) ** 2) / (2 * se ** 2))),
        bars([["MLE", a], ["Null", Math.max(0, a - c)], ["Info", Math.min(1, info / 5000)], ["LR", Math.min(1, lr / 12)]]),
        "Likelihood curvature grows with sample size, so the MLE becomes more concentrated around the true parameter.",
      );
    }
    case "official-statistics": {
      const laspeyres = 100 * (1 + a);
      const paasche = 100 * (1 + a * (1 - b * 0.25));
      const vital = c;
      return model(
        [["CPI style index", fmt(laspeyres)], ["WPI style index", fmt(paasche)], ["Basket shift", pct(b)], ["Natural increase", `${fmt(vital)} per 1000`]],
        curve(1, 12, 12, (month) => 100 + a * 100 * month / 12 + Math.sin(month) * b * 5),
        bars([["Food", 0.42 + b * 0.1], ["Fuel", 0.18], ["Housing", 0.25 - b * 0.08], ["Other", 0.15]]),
        "Index numbers summarize price movement, but basket definitions and source metadata control interpretation.",
      );
    }
    case "survival-analysis": {
      const treatmentHazard = c * (1 - a);
      const censoring = b;
      return model(
        [["Control hazard", fmt(c)], ["Treatment hazard", fmt(treatmentHazard)], ["Censoring", pct(censoring)], ["KM gap", pct(a)]],
        curve(0, 24, 25, (t) => Math.exp(-treatmentHazard * t)),
        bars([["Control S(12)", Math.exp(-c * 12)], ["Treat S(12)", Math.exp(-treatmentHazard * 12)], ["Censored", censoring], ["Log-rank", a * 2]]),
        "Censoring removes complete event times, so survival curves update only at observed event times.",
      );
    }
    case "actuarial-reliability": {
      const expectedLoss = a * b;
      const premium = expectedLoss * (1 + c);
      return model(
        [["Expected loss", money(expectedLoss)], ["Premium", money(premium)], ["Loading", pct(c)], ["Reserve stress", money(expectedLoss * (1.8 - c))]],
        curve(0, 12, 25, (t) => Math.exp(-a * t)),
        bars([["Frequency", a], ["Severity", b / 100000], ["Premium", premium / 60000], ["Reserve", expectedLoss / Math.max(premium, 1)]]),
        "Premiums combine expected claims with loading; reliability/life-table curves describe time-to-failure risk.",
      );
    }
    case "statistical-computing": {
      const mcError = b / Math.sqrt(a);
      const permZ = c / Math.max(mcError, 0.001);
      return model(
        [["Monte Carlo SE", fmt(mcError)], ["Runs", fmt(a)], ["Permutation z", fmt(permZ)], ["Bootstrap width", fmt(3.92 * mcError)]],
        curve(1, 40, 40, (i) => 0.5 + Math.sin(i * 2.4) * mcError + c / 10),
        bars([["MC", mcError], ["Bootstrap", b], ["Permutation", c], ["RNG", 1 / Math.sqrt(a / 100)]]),
        "More simulation runs shrink Monte Carlo error; bootstrap and permutation workflows turn computation into inference.",
      );
    }
    case "applied-modelling": {
      const trainError = 1 / (1 + a) + b * 0.015;
      const testError = trainError + Math.max(0, b - 4) * 0.045 + c * 0.2;
      const aic = 100 + 2 * b - 20 * Math.log(1 + a);
      return model(
        [["Train error", fmt(trainError)], ["Test error", fmt(testError)], ["AIC proxy", fmt(aic)], ["Confounding", pct(c)]],
        curve(1, 12, 12, (k) => 1 / (1 + a) + k * 0.015 + Math.max(0, k - 4) * 0.04 + c * 0.1),
        bars([["Signal", a / 4], ["Complexity", b / 12], ["AIC", aic / 140], ["Confounding", c]]),
        "Model selection balances fit and complexity; causal claims need confounding control beyond predictive accuracy.",
      );
    }
    case "school-statistics": {
      const median = 40 + ((100 / 2 - c) / Math.max(1, b)) * a;
      const mode = 40 + (b / Math.max(1, b + c)) * a;
      return model(
        [["Grouped median", fmt(median)], ["Grouped mode", fmt(mode)], ["Class width", fmt(a)], ["Tree update", `${fmt(5 / 12)} then ${fmt(4 / 11)}`]],
        curve(1, 8, 8, (cls) => Math.max(5, b * Math.exp(-((cls - 4) ** 2) / 5) + c / 5)),
        bars([["Pictograph", 6], ["Bar graph", 9], ["Ogive", c], ["Median class", b]]),
        "Grouped data formulas estimate location from intervals; ogives and tree diagrams make the logic visible.",
      );
    }
  }
}

function StudioSvg({ title, model }: { title: string; model: Model }) {
  const w = 920;
  const h = 390;
  const xLine = scale(Math.min(...model.line.map((p) => p.x)), Math.max(...model.line.map((p) => p.x)), 58, 560);
  const yLine = scale(Math.min(0, ...model.line.map((p) => p.y)), Math.max(...model.line.map((p) => p.y), 1), 310, 70);
  const yBar = scale(0, Math.max(...model.bars.map((p) => p.y), 1), 310, 95);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" role="img" aria-label={`${title} interactive chart`}>
      <defs>
        <linearGradient id="statsCompletionBars" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} rx="24" fill="#020617" />
      {Array.from({ length: 8 }, (_, index) => <line key={index} x1="40" x2="880" y1={72 + index * 34} y2={72 + index * 34} stroke="#1e293b" strokeWidth="1" />)}
      <text x="52" y="42" fill="#e0f2fe" fontSize="18" fontWeight="900">{title}</text>
      <text x="52" y="354" fill="#bae6fd" fontSize="13" fontWeight="800">{model.highlight}</text>
      <path d={pathFor(model.line, xLine, yLine)} fill="none" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {model.line.map((point, index) => index % Math.ceil(model.line.length / 12) === 0 ? <circle key={index} cx={xLine(point.x)} cy={yLine(point.y)} r="4" fill="#f97316" /> : null)}
      {model.bars.map((bar, index) => {
        const x = 620 + index * 62;
        const y = yBar(bar.y);
        return (
          <g key={bar.label ?? index}>
            <rect x={x} y={y} width="34" height={310 - y} rx="7" fill="url(#statsCompletionBars)" />
            <text x={x + 17} y="334" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="900">{bar.label}</text>
          </g>
        );
      })}
      <text x="620" y="74" fill="#e0f2fe" fontSize="14" fontWeight="900">live comparison</text>
    </svg>
  );
}

function MetricGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

function model(metrics: Array<[string, string]>, line: Point[], bars: Point[], interpretation: string): Model {
  return { metrics, line, bars, interpretation, highlight: interpretation };
}

function control(label: string, min: number, max: number, step: number, defaultValue: number): ControlSpec {
  return { label, min, max, step, defaultValue };
}

function bars(values: Array<[string, number]>): Point[] {
  return values.map(([label, y], x) => ({ x, y: Math.max(0, y), label }));
}

function curve(start: number, end: number, count: number, fn: (x: number) => number): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const x = start + (index / Math.max(1, count - 1)) * (end - start);
    return { x, y: fn(x) };
  });
}

function exponentialSmooth(points: Point[], alpha: number): Point[] {
  let previous = points[0]?.y ?? 0;
  return points.map((point) => {
    previous = alpha * point.y + (1 - alpha) * previous;
    return { ...point, y: previous };
  });
}

function pathFor(points: Point[], xScale: (value: number) => number, yScale: (value: number) => number) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${xScale(point.x)} ${yScale(point.y)}`).join(" ");
}

function scale(min: number, max: number, outMin: number, outMax: number) {
  const span = max - min || 1;
  return (value: number) => outMin + ((value - min) / span) * (outMax - outMin);
}

function normalPdf(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function fmt(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(Math.abs(value) >= 100 ? 1 : 3)).toString() : "0";
}

function pct(value: number) {
  return `${fmt(value * 100)}%`;
}

function money(value: number) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}
