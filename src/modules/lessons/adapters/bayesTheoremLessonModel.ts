export type DiagnosticParameters = {
  population: number;
  baseRate: number;
  sensitivity: number;
  specificity: number;
};
export const defaultDiagnosticParameters: DiagnosticParameters = {
  population: 1000,
  baseRate: 0.1,
  sensitivity: 0.9,
  specificity: 0.9,
};
export function clampRate(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}
export function diagnosticSummary(parameters: DiagnosticParameters) {
  const population = Math.max(1, Math.round(parameters.population)),
    baseRate = clampRate(parameters.baseRate),
    sensitivity = clampRate(parameters.sensitivity),
    specificity = clampRate(parameters.specificity);
  const disease = Math.round(population * baseRate),
    noDisease = population - disease,
    truePositive = Math.round(disease * sensitivity),
    falseNegative = disease - truePositive,
    trueNegative = Math.round(noDisease * specificity),
    falsePositive = noDisease - trueNegative,
    positive = truePositive + falsePositive,
    negative = falseNegative + trueNegative,
    posterior = positive ? truePositive / positive : 0;
  return {
    population,
    baseRate,
    sensitivity,
    specificity,
    disease,
    noDisease,
    truePositive,
    falseNegative,
    trueNegative,
    falsePositive,
    positive,
    negative,
    posterior,
  };
}
export type BayesQuestion = {
  baseRate: number;
  sensitivity: number;
  specificity: number;
  options: number[];
};
export const bayesQuestions: BayesQuestion[] = [
  {
    baseRate: 0.05,
    sensitivity: 0.95,
    specificity: 0.95,
    options: [0.32, 0.167, 0.095, 0.5],
  },
  {
    baseRate: 0.02,
    sensitivity: 0.9,
    specificity: 0.98,
    options: [0.479, 0.02, 0.9, 0.31],
  },
  {
    baseRate: 0.2,
    sensitivity: 0.85,
    specificity: 0.8,
    options: [0.515, 0.85, 0.2, 0.68],
  },
];
export function questionAnswer(question: BayesQuestion) {
  return diagnosticSummary({ population: 10000, ...question }).posterior;
}
