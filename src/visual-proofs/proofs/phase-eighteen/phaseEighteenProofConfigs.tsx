import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  CorrelationScatterplotVisual,
  HistogramFrequencyVisual,
  MeanBalanceVisual,
  MedianQuartilesVisual,
  NormalEmpiricalRuleVisual,
  RegressionLeastSquaresVisual,
  SamplingDistributionVisual,
  VarianceStandardDeviationVisual,
} from "./PhaseEighteenStatisticsVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const statisticsRoute = "/olympyard/practice/statistics-foundations";
const defaultData = [
  param("x1", "Data point 1", 0, 20, 3, 1),
  param("x2", "Data point 2", 0, 20, 6, 1),
  param("x3", "Data point 3", 0, 20, 8, 1),
  param("x4", "Data point 4", 0, 20, 12, 1),
  param("x5", "Data point 5", 0, 20, 15, 1),
  param("x6", "Data point 6", 0, 20, 18, 1),
];

export const meanBalancePhaseEighteenConfig = makeConfig({
  modelKey: "balance-deviation",
  steps: ["Plot data points", "Add all values", "Divide by n", "Place the balance point", "Compare deviations", "Conclude the mean formula"],
  parameters: defaultData,
  prediction: ["If one data point moves far to the right, what usually happens to the mean?", "The mean moves to the right."],
  misconception: ["The mean must be one of the data values.", "The mean is a balance point and does not need to be an actual observed value."],
  tokens: ["sum-x-i", "n", "mean", "deviations"],
  formula: (values) => {
    const data = dataValues(values);
    return `mean = sum x_i / n = ${sum(data)}/${data.length} = ${fmt(mean(data))}`;
  },
  liveValues: (values) => {
    const data = dataValues(values);
    const m = mean(data);
    const deviations = data.map((x) => x - m);
    return [value("data-values", "data values", data.join(", ")), value("n", "n", data.length), value("sum", "sum", sum(data)), value("mean", "mean", fmt(m)), value("deviations", "deviations", deviations.map(fmt).join(", ")), value("positive-deviation-total", "positive deviation total", fmt(sum(deviations.filter((d) => d > 0)))), value("negative-deviation-total", "negative deviation total", fmt(Math.abs(sum(deviations.filter((d) => d < 0))))), value("invariant", "invariant", "signed deviations from mean sum to 0")];
  },
  invariant: (values) => `Signed deviations from the mean sum to ${fmt(sum(dataValues(values).map((x) => x - mean(dataValues(values)))))}.`,
  renderVisual: MeanBalanceVisual,
});

export const medianQuartilesPhaseEighteenConfig = makeConfig({
  modelKey: "sorted-quartile-boxplot",
  steps: ["Show raw data", "Sort the data", "Find the middle", "Find Q1 and Q3", "Build the boxplot", "Conclude median/quartile meaning"],
  parameters: defaultData,
  prediction: ["What must we do before finding the median?", "Sort the data."],
  misconception: ["The median is the average of all values.", "The median is the middle value after ordering, not the arithmetic average."],
  tokens: ["median", "Q1", "Q3", "IQR"],
  formula: (values) => {
    const sorted = sortedData(values);
    const stats = quartiles(sorted);
    return `median = middle of sorted data; IQR = Q3 - Q1 = ${stats.q3} - ${stats.q1} = ${stats.q3 - stats.q1}`;
  },
  liveValues: (values) => {
    const raw = dataValues(values);
    const sorted = [...raw].sort((a, b) => a - b);
    const stats = quartiles(sorted);
    return [value("raw-data", "raw data", raw.join(", ")), value("sorted-data", "sorted data", sorted.join(", ")), value("min", "min", stats.min), value("Q1", "Q1", stats.q1), value("median", "median", stats.median), value("Q3", "Q3", stats.q3), value("max", "max", stats.max), value("IQR", "IQR", stats.q3 - stats.q1)];
  },
  invariant: () => "The median splits ordered data into two halves.",
  renderVisual: MedianQuartilesVisual,
});

export const varianceStandardDeviationPhaseEighteenConfig = makeConfig({
  modelKey: "squared-deviation",
  steps: ["Plot data", "Find mean", "Measure deviations", "Square deviations", "Average squared deviations", "Take square root"],
  parameters: defaultData,
  prediction: ["What happens to standard deviation when points spread farther from the mean?", "It usually increases."],
  misconception: ["Standard deviation is the average distance without squaring.", "Variance averages squared deviations, and standard deviation is the square root of that average."],
  tokens: ["x-i-minus-mu", "squared-term", "sum", "divide-by-n", "square-root"],
  formula: (values) => {
    const data = dataValues(values);
    const variance = populationVariance(data);
    return `variance = sum (x_i - mu)^2 / n = ${fmt(variance)}; standard deviation = sqrt(variance) = ${fmt(Math.sqrt(variance))}`;
  },
  liveValues: (values) => {
    const data = dataValues(values);
    const m = mean(data);
    const deviations = data.map((x) => x - m);
    const squared = deviations.map((d) => d * d);
    const variance = mean(squared);
    return [value("data-values", "data values", data.join(", ")), value("mean-mu", "mean mu", fmt(m)), value("deviations", "deviations", deviations.map(fmt).join(", ")), value("squared-deviations", "squared deviations", squared.map(fmt).join(", ")), value("variance", "variance", fmt(variance)), value("standard-deviation", "standard deviation", fmt(Math.sqrt(variance))), value("invariant", "invariant", "variance is nonnegative")];
  },
  invariant: (values) => `Variance is ${fmt(populationVariance(dataValues(values)))} and cannot be negative because squared deviations are nonnegative.`,
  renderVisual: VarianceStandardDeviationVisual,
});

export const histogramFrequencyPhaseEighteenConfig = makeConfig({
  modelKey: "bin-frequency",
  steps: ["Plot raw data", "Choose bins", "Count data in each bin", "Draw bars", "Compare bin widths", "Conclude histogram meaning"],
  parameters: [...defaultData, param("binCount", "Bin count", 2, 8, 5, 1)],
  prediction: ["What should the sum of all histogram bar frequencies equal?", "The total number of data points."],
  misconception: ["Histogram bars must always show exact individual data values.", "Histograms group data into intervals; individual values are summarized into bins."],
  tokens: ["bin", "frequency", "data-count"],
  formula: (values) => {
    const bins = histogram(dataValues(values), Math.round(values.binCount));
    return `sum of frequencies = ${bins.map((bin) => bin.count).join(" + ")} = ${sum(bins.map((bin) => bin.count))}`;
  },
  liveValues: (values) => {
    const data = dataValues(values);
    const binCount = Math.round(values.binCount);
    const bins = histogram(data, binCount);
    return [value("data-values", "data values", data.join(", ")), value("bin-count", "bin count", binCount), value("bin-width", "bin width", fmt(20 / binCount)), value("frequencies", "frequencies", bins.map((bin) => bin.count).join(", ")), value("total-count", "total count", sum(bins.map((bin) => bin.count))), value("invariant", "invariant", "sum of frequencies equals n")];
  },
  invariant: (values) => `The histogram accounts for all ${dataValues(values).length} observations exactly once.`,
  renderVisual: HistogramFrequencyVisual,
});

export const samplingDistributionPhaseEighteenConfig = makeConfig({
  modelKey: "repeated-sample-mean",
  steps: ["Show population", "Draw one sample", "Compute sample mean", "Repeat many samples", "Plot sample means", "Observe center and spread"],
  parameters: [param("sampleSize", "Sample size n", 1, 6, 3, 1), param("samples", "Number of samples", 5, 60, 24, 1)],
  prediction: ["What usually happens to the spread of sample means when sample size increases?", "It decreases."],
  misconception: ["All samples have the same mean as the population.", "Individual sample means vary, but their distribution centers around the population mean."],
  tokens: ["sample-mean", "population-mean", "sample-size-n"],
  formula: (values) => {
    const population = basePopulation();
    const means = sampleMeans(population, Math.round(values.sampleSize), Math.round(values.samples));
    return `mean of sample means = ${fmt(mean(means))}; population mean = ${fmt(mean(population))}`;
  },
  liveValues: (values) => {
    const population = basePopulation();
    const sampleSize = Math.round(values.sampleSize);
    const samples = Math.round(values.samples);
    const latest = deterministicSample(population, sampleSize, samples);
    const means = sampleMeans(population, sampleSize, samples);
    return [value("population-values", "population values", population.join(", ")), value("population-mean", "population mean", fmt(mean(population))), value("sample-size", "sample size", sampleSize), value("number-of-samples", "number of samples", samples), value("latest-sample", "latest sample", latest.join(", ")), value("latest-sample-mean", "latest sample mean", fmt(mean(latest))), value("mean-of-sample-means", "mean of sample means", fmt(mean(means))), value("spread-of-sample-means", "spread of sample means", fmt(std(means))), value("insight", "insight", "sample means center near population mean")];
  },
  invariant: () => "Repeated sample means vary but center near the population mean.",
  renderVisual: SamplingDistributionVisual,
});

export const normalEmpiricalRulePhaseEighteenConfig = makeConfig({
  modelKey: "mean-sigma-empirical-rule",
  steps: ["Draw normal curve", "Mark mean", "Mark 1 standard deviation", "Shade 68%", "Add 2 sigma and 3 sigma regions", "Conclude empirical rule"],
  parameters: [param("mu", "Mean mu", 2, 18, 10, 0.5), param("sigma", "Standard deviation sigma", 1, 6, 3, 0.5)],
  prediction: ["If sigma increases, what happens to the bell curve?", "It becomes wider and flatter."],
  misconception: ["68-95-99.7 applies to every distribution.", "It applies to approximately normal distributions, not all data shapes."],
  tokens: ["mu", "sigma", "68-percent", "95-percent", "99-7-percent"],
  formula: ({ mu, sigma }) => `normal empirical rule: mu +/- sigma = ${fmt(mu - sigma)} to ${fmt(mu + sigma)}, about 68%; mu +/- 2sigma about 95%; mu +/- 3sigma about 99.7%`,
  liveValues: ({ mu, sigma }) => [value("mu", "mu", fmt(mu)), value("sigma", "sigma", fmt(sigma)), value("interval-1-sigma", "interval mu +/- sigma", `${fmt(mu - sigma)} to ${fmt(mu + sigma)}`), value("interval-2-sigma", "interval mu +/- 2sigma", `${fmt(mu - 2 * sigma)} to ${fmt(mu + 2 * sigma)}`), value("interval-3-sigma", "interval mu +/- 3sigma", `${fmt(mu - 3 * sigma)} to ${fmt(mu + 3 * sigma)}`), value("empirical-rule-percentages", "empirical rule percentages", "68%, 95%, 99.7%"), value("insight", "insight", "sigma controls spread")],
  invariant: () => "The empirical rule is a normal-distribution approximation.",
  renderVisual: NormalEmpiricalRuleVisual,
});

export const correlationScatterplotPhaseEighteenConfig = makeConfig({
  modelKey: "r-trend-spread",
  steps: ["Plot paired data", "Observe direction", "Add trend line", "Measure strength", "Show r value", "Warn about causation"],
  parameters: [param("r", "Correlation direction/strength", -0.95, 0.95, 0.7, 0.05), param("noise", "Spread/noise", 0, 2.5, 0.9, 0.1)],
  prediction: ["If points slope downward from left to right, is correlation positive or negative?", "Negative."],
  misconception: ["Correlation proves causation.", "Correlation shows association, not proof that one variable causes the other."],
  tokens: ["r", "trend-line", "spread-around-line"],
  formula: ({ r }) => `correlation coefficient r is between -1 and +1; target r = ${fmt(r)}`,
  liveValues: ({ r, noise }) => {
    const points = scatterPoints(r, noise);
    const fit = leastSquares(points);
    return [value("data-points", "data points", points.map((point) => `(${fmt(point.x)},${fmt(point.y)})`).join(" ")), value("r", "r", fmt(correlation(points))), value("slope-direction", "slope direction", fit.slope >= 0 ? "positive" : "negative"), value("spread-noise", "spread/noise", fmt(noise)), value("insight", "insight", "r ranges from -1 to +1")];
  },
  invariant: () => "Correlation measures linear association, not causation.",
  renderVisual: CorrelationScatterplotVisual,
});

export const regressionLeastSquaresPhaseEighteenConfig = makeConfig({
  modelKey: "residual-least-squares",
  steps: ["Plot data", "Draw a candidate line", "Measure residuals", "Square residuals", "Adjust line to reduce total", "Conclude least-squares idea"],
  parameters: [param("slope", "Candidate slope", -0.5, 1.8, 0.7, 0.05), param("intercept", "Candidate intercept", 0, 7, 1.5, 0.1)],
  prediction: ["Why do we square residuals?", "To make errors positive and penalize larger errors more."],
  misconception: ["The best-fit line must pass through every point.", "For noisy data, the best-fit line balances residuals and usually does not pass through every point."],
  tokens: ["residual", "residual-squared", "sum-residual-squared", "least-squares"],
  formula: ({ slope, intercept }) => {
    const points = regressionData();
    const residuals = points.map((point) => point.y - (slope * point.x + intercept));
    return `least squares minimizes sum residual^2; candidate loss = ${fmt(sum(residuals.map((r) => r * r)))}`;
  },
  liveValues: ({ slope, intercept }) => {
    const points = regressionData();
    const residuals = points.map((point) => point.y - (slope * point.x + intercept));
    const squared = residuals.map((r) => r * r);
    const best = leastSquares(points);
    return [value("slope", "slope", fmt(slope)), value("intercept", "intercept", fmt(intercept)), value("residuals", "residuals", residuals.map(fmt).join(", ")), value("squared-residuals", "squared residuals", squared.map(fmt).join(", ")), value("total-squared-error", "total squared error", fmt(sum(squared))), value("best-fit-comparison", "best-fit comparison", `best slope ${fmt(best.slope)}, intercept ${fmt(best.intercept)}`), value("invariant", "invariant", "least-squares line has minimum squared residual sum for the data")];
  },
  invariant: () => "For fixed data, the least-squares line minimizes the sum of squared vertical residuals.",
  renderVisual: RegressionLeastSquaresVisual,
});

export const phaseEighteenRouteSlugs = [
  ["statistics", "mean-as-balance-point"],
  ["statistics", "median-and-quartiles"],
  ["statistics", "variance-standard-deviation"],
  ["statistics", "histogram-frequency-distribution"],
  ["statistics", "sampling-distribution-mean"],
  ["statistics", "normal-distribution-empirical-rule"],
  ["statistics", "correlation-scatterplot"],
  ["statistics", "linear-regression-least-squares"],
] as const;

export const phaseEighteenConfigs = [
  meanBalancePhaseEighteenConfig,
  medianQuartilesPhaseEighteenConfig,
  varianceStandardDeviationPhaseEighteenConfig,
  histogramFrequencyPhaseEighteenConfig,
  samplingDistributionPhaseEighteenConfig,
  normalEmpiricalRulePhaseEighteenConfig,
  correlationScatterplotPhaseEighteenConfig,
  regressionLeastSquaresPhaseEighteenConfig,
];

type ConfigInput = {
  modelKey: string;
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValues) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseEighteenModelKey: string } {
  return {
    phaseEighteenModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: statisticsRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `statistics-${input.modelKey}-invariant`, label: "data-display invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG data-display model.", "Sliders are bounded to keep labels and plots readable.", "Rounded displays support classroom interpretation while formulas preserve the statistical structure."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}

function value(id: string, label: string, item: number | string) {
  return { id, label, value: item };
}

function step(title: string, index: number) {
  return { id: `p18-${index}`, title, description: title, focusLabel: index < 2 ? "data display" : index < 5 ? "statistical structure" : "conclusion" };
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the data display before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use a memorized rule without reading the display.", feedback: "The display explains why the statistic behaves that way." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the connected data-display feature.", options: [{ id: "visual", label: "Use the data display.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Ignore the data structure.", feedback: "The plot, interval, residual, or distribution gives the formula meaning." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "sum-x-i": "sum x_i",
    n: "n",
    mean: "mean",
    deviations: "deviations",
    median: "median",
    Q1: "Q1",
    Q3: "Q3",
    IQR: "IQR = Q3 - Q1",
    "x-i-minus-mu": "x_i - mu",
    "squared-term": "(x_i - mu)^2",
    sum: "sum",
    "divide-by-n": "/n",
    "square-root": "square root",
    bin: "bin",
    frequency: "frequency",
    "data-count": "data count",
    "sample-mean": "sample mean",
    "population-mean": "population mean",
    "sample-size-n": "sample size n",
    mu: "mu",
    sigma: "sigma",
    "68-percent": "68%",
    "95-percent": "95%",
    "99-7-percent": "99.7%",
    r: "r",
    "trend-line": "trend line",
    "spread-around-line": "spread around line",
    residual: "residual",
    "residual-squared": "residual^2",
    "sum-residual-squared": "sum residual^2",
    "least-squares": "least squares",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("mean") || token.includes("deviation") || token === "sum-x-i" || token === "n") return "dot plot and deviation segments";
  if (token === "median" || token === "Q1" || token === "Q3" || token === "IQR") return "sorted data and boxplot";
  if (token.includes("squared") || token.includes("root") || token.includes("mu")) return "deviation bars and mean marker";
  if (token.includes("bin") || token.includes("frequency") || token.includes("count")) return "histogram bars";
  if (token.includes("sample") || token.includes("population")) return "sampling distribution dots";
  if (token.includes("sigma") || token.includes("percent")) return "normal curve shaded intervals";
  if (token === "r" || token.includes("trend") || token.includes("spread")) return "scatterplot and trend line";
  if (token.includes("residual") || token.includes("least")) return "residual segments and squared-error bars";
  return "statistics data-display feature";
}

function dataValues(values: PhaseTwoValues) {
  return ["x1", "x2", "x3", "x4", "x5", "x6"].map((key) => Math.round(values[key]));
}

function sortedData(values: PhaseTwoValues) {
  return dataValues(values).sort((a, b) => a - b);
}

function sum(items: number[]) {
  return items.reduce((total, item) => total + item, 0);
}

function mean(items: number[]) {
  return items.length ? sum(items) / items.length : 0;
}

function populationVariance(data: number[]) {
  const m = mean(data);
  return mean(data.map((x) => (x - m) ** 2));
}

function std(items: number[]) {
  const m = mean(items);
  return Math.sqrt(mean(items.map((item) => (item - m) ** 2)));
}

function quartiles(sorted: number[]) {
  return { min: sorted[0], q1: median(sorted.slice(0, 3)), median: median(sorted), q3: median(sorted.slice(3)), max: sorted[sorted.length - 1] };
}

function median(items: number[]) {
  const sorted = [...items].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function histogram(data: number[], binCount: number) {
  const width = 20 / binCount;
  return Array.from({ length: binCount }, (_, index) => {
    const start = index * width;
    const end = (index + 1) * width;
    const count = data.filter((value) => index === binCount - 1 ? value >= start && value <= end : value >= start && value < end).length;
    return { count };
  });
}

function basePopulation() {
  return [2, 4, 5, 7, 9, 11, 14, 16];
}

function deterministicSample(population: number[], sampleSize: number, offset: number) {
  return Array.from({ length: sampleSize }, (_, index) => population[(index * 3 + offset) % population.length]);
}

function sampleMeans(population: number[], sampleSize: number, samples: number) {
  return Array.from({ length: samples }, (_, index) => mean(deterministicSample(population, sampleSize, index)));
}

type Point = { x: number; y: number };
function scatterPoints(rTarget: number, noise: number): Point[] {
  return Array.from({ length: 12 }, (_, index) => {
    const x = 0.8 + index * 0.78;
    const wave = ((index * 7) % 5 - 2) * noise;
    const y = 5 + rTarget * (x - 5) + wave;
    return { x, y: Math.max(0.5, Math.min(11.5, y)) };
  });
}

function regressionData(): Point[] {
  return [{ x: 1, y: 2.2 }, { x: 2, y: 3.7 }, { x: 3, y: 3.9 }, { x: 4, y: 5.8 }, { x: 5, y: 5.1 }, { x: 6, y: 7.2 }, { x: 7, y: 7.8 }, { x: 8, y: 9.6 }];
}

function correlation(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const mx = mean(xs);
  const my = mean(ys);
  const numerator = sum(points.map((p) => (p.x - mx) * (p.y - my)));
  const denominator = Math.sqrt(sum(xs.map((x) => (x - mx) ** 2)) * sum(ys.map((y) => (y - my) ** 2)));
  return denominator ? numerator / denominator : 0;
}

function leastSquares(points: Point[]) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const mx = mean(xs);
  const my = mean(ys);
  const numerator = sum(points.map((p) => (p.x - mx) * (p.y - my)));
  const denominator = sum(xs.map((x) => (x - mx) ** 2));
  const slope = denominator ? numerator / denominator : 0;
  return { slope, intercept: my - slope * mx };
}

function fmt(item: number) {
  return Number.isFinite(item) ? item.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : "0";
}
