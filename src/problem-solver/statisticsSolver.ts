import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

type StatsOperation =
  | "mean"
  | "median"
  | "mode"
  | "range"
  | "variance"
  | "sample-variance"
  | "standard-deviation"
  | "sample-standard-deviation"
  | "quartiles"
  | "five-number-summary"
  | "frequency-table"
  | "summary"
  | "weighted-mean";

type DataParse = {
  numbers: number[];
  rejected: string[];
};

const epsilon = 1e-9;

export function solveStatistics(classification: ProblemClassification): ProblemSolverResult | null {
  if (classification.kind !== "statistics") return null;
  const operation = detectOperation(classification.rawInput);
  if (operation === "weighted-mean") return weightedMeanResult(classification);
  const data = parseNumberList(classification.expression ?? classification.normalizedInput);
  if (!data.numbers.length) return emptyDataResult(classification, operation, data.rejected);

  const warnings = data.rejected.length ? [`Ignored non-numeric value(s): ${data.rejected.join(", ")}.`] : [];
  if (operation === "mean") return meanResult(classification, data.numbers, warnings);
  if (operation === "median") return medianResult(classification, data.numbers, warnings);
  if (operation === "mode") return modeResult(classification, data.numbers, warnings);
  if (operation === "range") return rangeResult(classification, data.numbers, warnings);
  if (operation === "variance") return varianceResult(classification, data.numbers, false, warnings);
  if (operation === "sample-variance") return varianceResult(classification, data.numbers, true, warnings);
  if (operation === "standard-deviation") return standardDeviationResult(classification, data.numbers, false, warnings);
  if (operation === "sample-standard-deviation") return standardDeviationResult(classification, data.numbers, true, warnings);
  if (operation === "quartiles") return quartilesResult(classification, data.numbers, warnings, false);
  if (operation === "five-number-summary") return quartilesResult(classification, data.numbers, warnings, true);
  if (operation === "frequency-table") return frequencyTableResult(classification, data.numbers, warnings);
  return summaryResult(classification, data.numbers, warnings);
}

function meanResult(classification: ProblemClassification, numbers: number[], warnings: string[]) {
  const total = sum(numbers);
  const mean = total / numbers.length;
  return statsResult(classification, {
    method: "Mean",
    result: formatNumber(mean),
    steps: [
      `Data set: ${formatList(numbers)}.`,
      `Formula: mean = sum / count.`,
      `Sum = ${formatNumber(total)}.`,
      `Count = ${numbers.length}.`,
      `Mean = ${formatNumber(total)} / ${numbers.length} = ${formatNumber(mean)}.`,
      `Final answer: ${formatNumber(mean)}.`,
    ],
    warnings,
  });
}

function medianResult(classification: ProblemClassification, numbers: number[], warnings: string[]) {
  const sorted = sortNumbers(numbers);
  const median = medianOfSorted(sorted);
  const middleStep = sorted.length % 2 === 0
    ? `Middle two values = ${formatNumber(sorted[sorted.length / 2 - 1])} and ${formatNumber(sorted[sorted.length / 2])}.`
    : `Middle value = ${formatNumber(sorted[Math.floor(sorted.length / 2)])}.`;
  return statsResult(classification, {
    method: "Median",
    result: formatNumber(median),
    steps: [
      `Data set: ${formatList(numbers)}.`,
      `Sorted data: ${formatList(sorted)}.`,
      "Rule: the median is the middle value, or the average of the two middle values for an even-sized data set.",
      middleStep,
      sorted.length % 2 === 0 ? `Median = (${formatNumber(sorted[sorted.length / 2 - 1])} + ${formatNumber(sorted[sorted.length / 2])}) / 2 = ${formatNumber(median)}.` : `Median = ${formatNumber(median)}.`,
      `Final answer: ${formatNumber(median)}.`,
    ],
    warnings,
  });
}

function modeResult(classification: ProblemClassification, numbers: number[], warnings: string[]) {
  const table = frequencyRows(numbers);
  const maxFrequency = Math.max(...table.map((row) => row.frequency));
  const modes = maxFrequency > 1 ? table.filter((row) => row.frequency === maxFrequency).map((row) => row.value) : [];
  const result = modes.length ? modes.map(formatNumber).join(", ") : "No mode";
  return statsResult(classification, {
    method: "Mode",
    result,
    steps: [
      `Data set: ${formatList(numbers)}.`,
      "Rule: the mode is the value or values with the highest frequency.",
      `Frequency count: ${formatFrequency(table)}.`,
      maxFrequency > 1 ? `Highest frequency is ${maxFrequency}.` : "No value repeats.",
      `Final answer: ${result}.`,
    ],
    warnings,
  });
}

function rangeResult(classification: ProblemClassification, numbers: number[], warnings: string[]) {
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  return statsResult(classification, {
    method: "Range",
    result: formatNumber(range),
    steps: [
      `Data set: ${formatList(numbers)}.`,
      `Minimum = ${formatNumber(min)}.`,
      `Maximum = ${formatNumber(max)}.`,
      `Range = max - min = ${formatNumber(max)} - ${formatNumber(min)} = ${formatNumber(range)}.`,
      `Final answer: ${formatNumber(range)}.`,
    ],
    warnings,
  });
}

function varianceResult(classification: ProblemClassification, numbers: number[], sample: boolean, warnings: string[]) {
  if (sample && numbers.length < 2) return sampleTooSmallResult(classification, "sample variance", warnings);
  const mean = sum(numbers) / numbers.length;
  const squared = numbers.map((value) => (value - mean) ** 2);
  const denominator = sample ? numbers.length - 1 : numbers.length;
  const variance = sum(squared) / denominator;
  return statsResult(classification, {
    method: sample ? "Sample variance" : "Population variance",
    result: formatNumber(variance),
    assumptions: sample ? ["Sample variance uses denominator n - 1."] : ["Population variance is used by default."],
    steps: [
      `Data set: ${formatList(numbers)}.`,
      sample ? "Formula: s^2 = sum((x - xbar)^2) / (n - 1)." : "Formula: sigma^2 = sum((x - mu)^2) / n.",
      `Mean = ${formatNumber(mean)}.`,
      `Squared deviations: ${formatList(squared)}.`,
      `Sum of squared deviations = ${formatNumber(sum(squared))}.`,
      `${sample ? "Sample variance" : "Population variance"} = ${formatNumber(sum(squared))} / ${denominator} = ${formatNumber(variance)}.`,
      `Final answer: ${formatNumber(variance)}.`,
    ],
    warnings,
  });
}

function standardDeviationResult(classification: ProblemClassification, numbers: number[], sample: boolean, warnings: string[]) {
  if (sample && numbers.length < 2) return sampleTooSmallResult(classification, "sample standard deviation", warnings);
  const mean = sum(numbers) / numbers.length;
  const squared = numbers.map((value) => (value - mean) ** 2);
  const denominator = sample ? numbers.length - 1 : numbers.length;
  const variance = sum(squared) / denominator;
  const sd = Math.sqrt(variance);
  return statsResult(classification, {
    method: sample ? "Sample standard deviation" : "Population standard deviation",
    result: formatNumber(sd),
    assumptions: sample ? ["Sample standard deviation uses denominator n - 1."] : ["Population standard deviation is used by default."],
    steps: [
      `Data set: ${formatList(numbers)}.`,
      sample ? "Formula: s = sqrt(sample variance)." : "Formula: sigma = sqrt(population variance).",
      `Variance = ${formatNumber(variance)}.`,
      `Standard deviation = sqrt(${formatNumber(variance)}) = ${formatNumber(sd)}.`,
      `Final answer: ${formatNumber(sd)}.`,
    ],
    warnings,
  });
}

function quartilesResult(classification: ProblemClassification, numbers: number[], warnings: string[], fiveNumber: boolean) {
  const sorted = sortNumbers(numbers);
  const q = quartiles(sorted);
  const result = fiveNumber
    ? `min = ${formatNumber(q.min)}, Q1 = ${formatNumber(q.q1)}, median = ${formatNumber(q.q2)}, Q3 = ${formatNumber(q.q3)}, max = ${formatNumber(q.max)}`
    : `Q1 = ${formatNumber(q.q1)}, Q2 = ${formatNumber(q.q2)}, Q3 = ${formatNumber(q.q3)}`;
  return statsResult(classification, {
    method: fiveNumber ? "Five-number summary" : "Quartiles",
    result,
    assumptions: ["Quartiles use the median-of-halves method."],
    steps: [
      `Data set: ${formatList(numbers)}.`,
      `Sorted data: ${formatList(sorted)}.`,
      "Method: median-of-halves method.",
      `Lower half: ${formatList(q.lower)}.`,
      `Upper half: ${formatList(q.upper)}.`,
      `Q1 = ${formatNumber(q.q1)}, Q2/median = ${formatNumber(q.q2)}, Q3 = ${formatNumber(q.q3)}.`,
      fiveNumber ? `Five-number summary: ${result}.` : `Final answer: ${result}.`,
    ],
    warnings,
  });
}

function frequencyTableResult(classification: ProblemClassification, numbers: number[], warnings: string[]) {
  const table = frequencyRows(numbers);
  return statsResult(classification, {
    method: "Frequency table",
    result: formatFrequency(table),
    steps: [
      `Data set: ${formatList(numbers)}.`,
      `Sorted data: ${formatList(sortNumbers(numbers))}.`,
      "Rule: frequency is the number of times each value appears.",
      "Count how many times each value appears.",
      `Value | Frequency: ${formatFrequency(table)}.`,
      `Final answer: ${formatFrequency(table)}.`,
    ],
    warnings,
  });
}

function summaryResult(classification: ProblemClassification, numbers: number[], warnings: string[]) {
  const sorted = sortNumbers(numbers);
  const total = sum(numbers);
  const mean = total / numbers.length;
  const median = medianOfSorted(sorted);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;
  const variance = sum(numbers.map((value) => (value - mean) ** 2)) / numbers.length;
  const sd = Math.sqrt(variance);
  const result = `count = ${numbers.length}, sum = ${formatNumber(total)}, mean = ${formatNumber(mean)}, median = ${formatNumber(median)}, min = ${formatNumber(min)}, max = ${formatNumber(max)}, range = ${formatNumber(range)}, variance = ${formatNumber(variance)}, standard deviation = ${formatNumber(sd)}`;
  return statsResult(classification, {
    method: "Statistics summary",
    result,
    assumptions: ["Population variance and population standard deviation are used by default."],
    steps: [
      `Data set: ${formatList(numbers)}.`,
      `Sorted data: ${formatList(sorted)}.`,
      `Count = ${numbers.length}; Sum = ${formatNumber(total)}.`,
      `Mean = ${formatNumber(total)} / ${numbers.length} = ${formatNumber(mean)}.`,
      `Median = ${formatNumber(median)}.`,
      `Min = ${formatNumber(min)}, Max = ${formatNumber(max)}, Range = ${formatNumber(range)}.`,
      `Population variance = ${formatNumber(variance)}.`,
      `Population standard deviation = ${formatNumber(sd)}.`,
      `Final answer: ${result}.`,
    ],
    warnings,
  });
}

function weightedMeanResult(classification: ProblemClassification): ProblemSolverResult {
  const match = classification.rawInput.match(/^weighted\s+(?:mean|average)\s+values\s+(.+?)\s+weights\s+(.+)$/i);
  if (!match) return emptyDataResult(classification, "weighted-mean", ["Could not parse weighted mean values and weights."]);
  const values = parseNumberList(match[1]);
  const weights = parseNumberList(match[2]);
  const warnings = [...values.rejected.map((item) => `Ignored non-numeric value: ${item}.`), ...weights.rejected.map((item) => `Ignored non-numeric weight: ${item}.`)];
  if (!values.numbers.length || !weights.numbers.length) return emptyDataResult(classification, "weighted-mean", warnings);
  if (values.numbers.length !== weights.numbers.length) {
    return statsResult(classification, {
      method: "Weighted mean",
      result: "Cannot compute weighted mean",
      steps: [
        `Values: ${formatList(values.numbers)}.`,
        `Weights: ${formatList(weights.numbers)}.`,
        "Weighted mean requires the same number of values and weights.",
      ],
      warnings: [...warnings, "Weighted mean values/weights count mismatch."],
      canCopy: false,
    });
  }
  const negativeWeights = weights.numbers.filter((weight) => weight < 0);
  const weightedProducts = values.numbers.map((value, index) => value * weights.numbers[index]);
  const weightSum = sum(weights.numbers);
  const weightedSum = sum(weightedProducts);
  if (isZero(weightSum)) {
    return statsResult(classification, {
      method: "Weighted mean",
      result: "Cannot compute weighted mean",
      steps: [`Values: ${formatList(values.numbers)}.`, `Weights: ${formatList(weights.numbers)}.`, "Sum of weights is 0."],
      warnings: [...warnings, "Weighted mean is undefined when total weight is 0."],
      canCopy: false,
    });
  }
  const result = weightedSum / weightSum;
  return statsResult(classification, {
    method: "Weighted mean",
    result: formatNumber(result),
    steps: [
      `Values: ${formatList(values.numbers)}.`,
      `Weights: ${formatList(weights.numbers)}.`,
      "Formula: weighted mean = sum(value * weight) / sum(weights).",
      `Products value * weight: ${formatList(weightedProducts)}.`,
      `Sum of products = ${formatNumber(weightedSum)}.`,
      `Sum of weights = ${formatNumber(weightSum)}.`,
      `Weighted mean = ${formatNumber(weightedSum)} / ${formatNumber(weightSum)} = ${formatNumber(result)}.`,
      `Final answer: ${formatNumber(result)}.`,
    ],
    warnings: negativeWeights.length ? [...warnings, "Negative weights were included; confirm this is intentional."] : warnings,
  });
}

function emptyDataResult(classification: ProblemClassification, operation: StatsOperation, warnings: string[]): ProblemSolverResult {
  return statsResult(classification, {
    method: labelForOperation(operation),
    result: "No valid numeric data",
    steps: [
      "The input was classified as statistics.",
      "No valid numeric data values were found.",
      "No calculation was performed.",
    ],
    warnings: warnings.length ? warnings : ["Empty or invalid data list."],
    canCopy: false,
  });
}

function sampleTooSmallResult(classification: ProblemClassification, operation: string, warnings: string[]) {
  return statsResult(classification, {
    method: operation,
    result: `Cannot compute ${operation}`,
    steps: [`${operation} requires at least 2 values.`, "No calculation was performed."],
    warnings: [...warnings, `Too few values for ${operation}.`],
    canCopy: false,
  });
}

function statsResult(classification: ProblemClassification, data: {
  assumptions?: string[];
  canCopy?: boolean;
  method: string;
  result: string;
  steps: string[];
  warnings: string[];
}): ProblemSolverResult {
  return {
    kind: "statistics",
    method: data.method,
    title: "Statistics",
    normalizedInput: classification.normalizedInput,
    result: data.result,
    restrictions: [],
    steps: data.steps,
    assumptions: [...classification.assumptions, ...(data.assumptions ?? [])],
    warnings: [...classification.warnings, ...data.warnings],
    canCopy: data.canCopy ?? true,
  };
}

function detectOperation(rawInput: string): StatsOperation {
  const lower = rawInput.trim().toLowerCase().replace(/^=\s*/, "").replace(/^(?:please\s+|can you\s+|could you\s+|would you\s+)?(?:what is|what's|calculate|compute|evaluate|find)\s+/, "");
  const functionName = lower.match(/^([a-z][a-z0-9.]*)\s*\(/i)?.[1] ?? "";
  if (/^weighted\s+(mean|average)\b/.test(lower)) return "weighted-mean";
  if (/^sample\s+standard\s+deviation\b/.test(lower) || functionName === "stdev.s") return "sample-standard-deviation";
  if (/^standard\s+deviation\b/.test(lower) || ["stdev", "stdev.p", "standarddeviation"].includes(functionName)) return "standard-deviation";
  if (/^sample\s+variance\b/.test(lower) || ["var.s"].includes(functionName)) return "sample-variance";
  if (/^variance\b/.test(lower) || ["variance", "var", "var.p"].includes(functionName)) return "variance";
  if (/^five\s+number\s+summary\b/.test(lower)) return "five-number-summary";
  if (/^frequency\s+table\b/.test(lower) || ["frequency", "frequency.table"].includes(functionName)) return "frequency-table";
  if (/^quartiles\b/.test(lower) || ["quartile", "quartile.inc", "quartiles"].includes(functionName)) return "quartiles";
  if (/^median\b/.test(lower) || functionName === "median") return "median";
  if (/^mode\b/.test(lower) || ["mode", "mode.sngl"].includes(functionName)) return "mode";
  if (/^range\b/.test(lower) || functionName === "range") return "range";
  if (/^(mean|average)\b/.test(lower) || ["mean", "average"].includes(functionName)) return "mean";
  return "summary";
}

function parseNumberList(value: string): DataParse {
  const tokens = value.split(/,|\s+/).map((item) => item.trim()).filter(Boolean);
  const numbers: number[] = [];
  const rejected: string[] = [];
  for (const token of tokens) {
    const clean = token.replace(/[:;]/g, "");
    const numeric = Number(clean);
    if (Number.isFinite(numeric)) numbers.push(numeric);
    else rejected.push(token);
  }
  return { numbers, rejected };
}

function quartiles(sorted: number[]) {
  const q2 = medianOfSorted(sorted);
  const middle = Math.floor(sorted.length / 2);
  const lower = sorted.length % 2 === 0 ? sorted.slice(0, middle) : sorted.slice(0, middle);
  const upper = sorted.length % 2 === 0 ? sorted.slice(middle) : sorted.slice(middle + 1);
  return {
    lower,
    max: sorted[sorted.length - 1],
    min: sorted[0],
    q1: lower.length ? medianOfSorted(lower) : sorted[0],
    q2,
    q3: upper.length ? medianOfSorted(upper) : sorted[sorted.length - 1],
    upper,
  };
}

function frequencyRows(numbers: number[]) {
  const counts = new Map<number, number>();
  for (const value of numbers) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => a[0] - b[0]).map(([value, frequency]) => ({ value, frequency }));
}

function medianOfSorted(sorted: number[]) {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function sortNumbers(numbers: number[]) {
  return [...numbers].sort((left, right) => left - right);
}

function sum(numbers: number[]) {
  return numbers.reduce((total, value) => total + value, 0);
}

function formatFrequency(rows: Array<{ value: number; frequency: number }>) {
  return rows.map((row) => `${formatNumber(row.value)} | ${row.frequency}`).join("; ");
}

function formatList(numbers: number[]) {
  return numbers.map(formatNumber).join(", ");
}

function formatNumber(value: number) {
  const rounded = Math.round(value * 10_000) / 10_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function labelForOperation(operation: StatsOperation) {
  return operation.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function isZero(value: number) {
  return Math.abs(value) < epsilon;
}
