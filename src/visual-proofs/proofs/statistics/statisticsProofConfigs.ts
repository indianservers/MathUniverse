import type { ProofStep } from "../../data/proofTypes";

export type StatisticsProofKind =
  | "mean"
  | "quartiles"
  | "variance"
  | "standardDeviation"
  | "zScore"
  | "histogram"
  | "normal"
  | "samplingMean"
  | "clt"
  | "confidence"
  | "correlation"
  | "leastSquares"
  | "residuals"
  | "bestFit"
  | "lln";

export type StatisticsParameterKey = "spread" | "x" | "mu" | "sigma" | "bins" | "sampleSize" | "trials" | "confidence" | "correlation" | "noise" | "slope" | "intercept";

export type StatisticsProofConfig = {
  kind: StatisticsProofKind;
  parameters: Partial<Record<StatisticsParameterKey, { label: string; min: number; max: number; step?: number; defaultValue: number }>>;
  toggles: string[];
  steps: ProofStep[];
  formulas: string[];
  notes: string[];
  questions: string[];
};

const steps: ProofStep[] = [
  { id: "data", title: "Show the data", description: "Start from visible dots, bars, intervals, or sampled values.", focusLabel: "data" },
  { id: "measure", title: "Add the statistic", description: "Overlay the statistic as a balance point, spread band, curve, or line.", focusLabel: "statistic" },
  { id: "interpret", title: "Interpret the result", description: "Connect the visual measurement to the formula.", focusLabel: "interpretation" },
];

const questions = ["Which visual object represents the statistic?", "What changes when the data or simulation controls change?"];

export const statisticsProofConfigs: Record<string, StatisticsProofConfig> = {
  MeanAsBalancePointProof: {
    kind: "mean",
    parameters: { spread: { label: "Spread", min: 1, max: 12, defaultValue: 5 } },
    toggles: ["Show balance beam"],
    steps,
    formulas: ["Mean = sum x / n"],
    notes: ["The mean is the point where total signed distance balances."],
    questions,
  },
  MedianQuartilesNumberLineProof: {
    kind: "quartiles",
    parameters: { spread: { label: "Dataset spread", min: 1, max: 12, defaultValue: 6 } },
    toggles: ["Show box plot"],
    steps,
    formulas: ["Median = middle value", "IQR = Q3 - Q1"],
    notes: ["Quartiles split ordered data into four parts."],
    questions,
  },
  VarianceAverageSquaredDistanceProof: {
    kind: "variance",
    parameters: { spread: { label: "Spread", min: 1, max: 12, defaultValue: 7 } },
    toggles: ["Show squared blocks"],
    steps,
    formulas: ["Variance = average squared deviation from mean"],
    notes: ["Squaring makes all distances positive and emphasizes large deviations."],
    questions,
  },
  StandardDeviationSpreadProof: {
    kind: "standardDeviation",
    parameters: { spread: { label: "Spread", min: 1, max: 12, defaultValue: 6 } },
    toggles: ["Show SD bands"],
    steps,
    formulas: ["Standard deviation = sqrt(variance)"],
    notes: ["Standard deviation returns spread to original data units."],
    questions,
  },
  ZScoreStandardizedDistanceProof: {
    kind: "zScore",
    parameters: { mu: { label: "Mean mu", min: -5, max: 15, defaultValue: 5 }, sigma: { label: "Standard deviation sigma", min: 1, max: 8, defaultValue: 2 }, x: { label: "Value x", min: -10, max: 20, defaultValue: 9 } },
    toggles: ["Show SD bands"],
    steps,
    formulas: ["z = (x - mu) / sigma"],
    notes: ["A z-score measures distance in standard deviation units."],
    questions,
  },
  HistogramDistributionShapeProof: {
    kind: "histogram",
    parameters: { bins: { label: "Bins", min: 4, max: 30, defaultValue: 10 } },
    toggles: ["Show raw dots"],
    steps,
    formulas: ["Frequency in a bin = data count in that interval"],
    notes: ["Histograms reveal shape by grouping nearby values."],
    questions,
  },
  NormalDistributionEmpiricalRuleProof: {
    kind: "normal",
    parameters: { mu: { label: "Mean", min: -5, max: 15, defaultValue: 5 }, sigma: { label: "Standard deviation", min: 1, max: 6, defaultValue: 2 } },
    toggles: ["Show 1 sigma", "Show 2 sigma", "Show 3 sigma"],
    steps,
    formulas: ["68-95-99.7 empirical rule"],
    notes: ["Normal distributions have predictable mass around the mean."],
    questions,
  },
  SamplingDistributionMeanProof: {
    kind: "samplingMean",
    parameters: { sampleSize: { label: "Sample size", min: 2, max: 50, defaultValue: 8 }, trials: { label: "Samples", min: 50, max: 5000, step: 50, defaultValue: 500 } },
    toggles: ["Show sample mean histogram"],
    steps,
    formulas: ["sample mean = sum x / n"],
    notes: ["Sample means vary and form their own distribution."],
    questions,
  },
  CentralLimitTheoremSimulationProof: {
    kind: "clt",
    parameters: { sampleSize: { label: "Sample size", min: 2, max: 60, defaultValue: 20 }, trials: { label: "Samples", min: 50, max: 5000, step: 50, defaultValue: 800 } },
    toggles: ["Show bell overlay"],
    steps,
    formulas: ["As n increases, distribution of sample mean approaches normal"],
    notes: ["CLT concerns the distribution of means, not the original population shape."],
    questions,
  },
  ConfidenceIntervalIntuitionProof: {
    kind: "confidence",
    parameters: { confidence: { label: "Confidence percent", min: 90, max: 99, step: 4, defaultValue: 95 }, sampleSize: { label: "Sample size", min: 5, max: 80, defaultValue: 25 }, trials: { label: "Intervals", min: 20, max: 300, step: 20, defaultValue: 80 } },
    toggles: ["Show misses"],
    steps,
    formulas: ["CI approx xbar +/- z x SE"],
    notes: ["Confidence level is a long-run capture rate for the interval procedure."],
    questions,
  },
  CorrelationCoMovementProof: {
    kind: "correlation",
    parameters: { correlation: { label: "Target correlation", min: -1, max: 1, step: 0.1, defaultValue: 0.7 }, noise: { label: "Noise", min: 0, max: 8, defaultValue: 3 } },
    toggles: ["Show trend direction"],
    steps,
    formulas: ["r = covariance(X,Y) / (sigma_x sigma_y)"],
    notes: ["Correlation measures linear co-movement, not causation."],
    questions,
  },
  LeastSquaresRegressionProof: {
    kind: "leastSquares",
    parameters: { slope: { label: "Candidate slope", min: -2, max: 4, step: 0.1, defaultValue: 1 }, intercept: { label: "Candidate intercept", min: -10, max: 20, step: 1, defaultValue: 4 } },
    toggles: ["Show residual squares"],
    steps,
    formulas: ["Minimize sum (yi - yhat_i)^2"],
    notes: ["Least squares chooses the line with the smallest total squared residuals."],
    questions,
  },
  ResidualsSumOfSquaresProof: {
    kind: "residuals",
    parameters: { slope: { label: "Line slope", min: -2, max: 4, step: 0.1, defaultValue: 1.1 }, intercept: { label: "Line intercept", min: -10, max: 20, step: 1, defaultValue: 3 } },
    toggles: ["Show residuals", "Show squared residuals"],
    steps,
    formulas: ["SSR = sum e_i^2 = sum (yi - yhat_i)^2"],
    notes: ["Residuals are vertical prediction errors."],
    questions,
  },
  RegressionLineBestFitProof: {
    kind: "bestFit",
    parameters: { slope: { label: "Try slope", min: -2, max: 4, step: 0.1, defaultValue: 0.8 }, intercept: { label: "Try intercept", min: -10, max: 20, step: 1, defaultValue: 5 } },
    toggles: ["Show best fit line"],
    steps,
    formulas: ["yhat = mx + b", "Choose m,b to minimize sum squared errors"],
    notes: ["The best-fit line balances residuals by minimizing squared error."],
    questions,
  },
  LawOfLargeNumbersSimulationProof: {
    kind: "lln",
    parameters: { trials: { label: "Trials", min: 10, max: 10000, step: 10, defaultValue: 1000 } },
    toggles: ["Show running average"],
    steps,
    formulas: ["As n becomes large: sample average -> expected value"],
    notes: ["Long-run averages stabilize near expected value, though short runs wander."],
    questions,
  },
};
