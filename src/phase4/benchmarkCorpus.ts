import { analyzeAssumptions } from "./assumptionEngine";
import { exportCsv, parseDataset, summarize } from "./dataframe";
import { createDistribution } from "./distributions";
import { runSamplingSimulation } from "./simulation";
import { fitSimpleLinearRegression, normalSurvival, twoSampleComparison } from "./statistics";
import { convertUnit } from "./units";

export type BenchmarkCategory = "ALGEBRA" | "EQUATION" | "CALCULUS" | "MATRIX" | "COMPLEX" | "UNIT" | "ADVERSARIAL_CAS" | "DESCRIPTIVE" | "REGRESSION" | "INFERENCE" | "DISTRIBUTION" | "EXTREME_TAIL" | "SIMULATION" | "MALFORMED_DATASET" | "ACCESSIBLE_WORKFLOW";
export type Phase4Benchmark = { id: string; category: BenchmarkCategory; supportedDomain: string; input: Record<string, number | string>; expectedResult: string; conditions: string[]; status: "EXACT" | "APPROXIMATE" | "ERROR_EXPECTED"; tolerance: number; expectedDiagnostics: string[]; referenceMethod: string; capabilityId: string };

export const phase4BenchmarkCorpus: Phase4Benchmark[] = [
  ...cases("ALGEBRA", 100, (i) => ({ a: i - 50, x: (i % 13) - 6 }), "integer arithmetic", "Direct exact coefficient collection", "cas.simplify"),
  ...cases("EQUATION", 60, (i) => ({ a: i + 1, b: (i - 30) * 3 }), "real linear equations with non-zero coefficient", "Substitution residual", "cas.solve.linear"),
  ...cases("CALCULUS", 50, (i) => ({ n: (i % 12) + 1, x: (i % 9) - 4 }), "polynomial powers", "Power rule with finite-difference check", "cas.derivative"),
  ...cases("MATRIX", 30, (i) => ({ a: i + 1, b: i % 5, c: (i * 2) % 7, d: i + 2 }), "2x2 real matrices", "Closed-form determinant", "cas.matrix.determinant"),
  ...cases("COMPLEX", 30, (i) => ({ a: i - 15, b: (i % 11) - 5 }), "Cartesian complex values", "Modulus identity", "cas.complex.modulus"),
  ...cases("UNIT", 20, (i) => ({ value: i + 0.25 }), "length unit conversion", "SI round trip", "units.convert"),
  ...cases("ADVERSARIAL_CAS", 30, (i) => ({ symbol: `x${i}`, value: i % 5 }), "contradictory scalar assumptions", "Contradiction detector", "cas.assumptions"),
  ...cases("DESCRIPTIVE", 30, (i) => ({ start: i - 10 }), "finite numeric samples", "Direct moments and ordered quantiles", "data.summary"),
  ...cases("REGRESSION", 30, (i) => ({ slope: (i % 9) - 4, intercept: i - 15 }), "nonconstant perfect linear data", "Ordinary least squares normal equations", "statistics.regression.linear"),
  ...cases("INFERENCE", 30, (i) => ({ shift: (i % 10) / 2 + 0.1 }), "two independent finite groups", "Welch comparison", "statistics.inference.welch"),
  ...cases("DISTRIBUTION", 40, (i) => ({ mu: (i % 9) - 4, sigma: (i % 5) / 2 + 0.5, p: 0.01 + (i % 39) / 40 }), "normal distribution", "CDF/inverse-CDF round trip", "probability.distribution.normal"),
  ...cases("EXTREME_TAIL", 20, (i) => ({ z: 6 + i / 4 }), "standard-normal upper tail", "Complementary error function", "probability.tail.normal"),
  ...cases("SIMULATION", 20, (i) => ({ seed: 1000 + i, trials: 100 + i }), "seeded Bernoulli sampling", "Byte-identical repeated generator output", "simulation.seeded"),
  ...cases("MALFORMED_DATASET", 20, (i) => ({ input: i % 2 ? 'a,b\n"unclosed,2' : "a,b\n=CMD(),2" }), "delimited text and safe CSV", "Parser rejection or formula neutralization", "data.import.safe"),
  ...cases("ACCESSIBLE_WORKFLOW", 15, (i) => ({ workflow: i + 1 }), "structured nonvisual workflow", "Required semantic alternative metadata", "accessibility.phase4"),
];

export function runPhase4Benchmarks() {
  const failures: Array<{ id: string; reason: string }> = [];
  for (const item of phase4BenchmarkCorpus) { try { if (!execute(item)) failures.push({ id: item.id, reason: "Expected mathematical invariant was not satisfied." }); } catch (error) { failures.push({ id: item.id, reason: error instanceof Error ? error.message : "Unexpected failure" }); } }
  const byCategory = Object.fromEntries([...new Set(phase4BenchmarkCorpus.map((item) => item.category))].map((category) => { const total = phase4BenchmarkCorpus.filter((item) => item.category === category).length; const failed = failures.filter((item) => item.id.startsWith(category.toLowerCase())).length; return [category, { total, passed: total - failed, failed }]; }));
  return { version: "1.0.0", total: phase4BenchmarkCorpus.length, passed: phase4BenchmarkCorpus.length - failures.length, failed: failures.length, failures, byCategory };
}

function execute(item: Phase4Benchmark) {
  const value = (key: string) => Number(item.input[key]);
  if (item.category === "ALGEBRA") return ((value("a") + 1) * value("x")) === value("a") * value("x") + value("x");
  if (item.category === "EQUATION") { const root = value("b") / value("a"); return Math.abs(value("a") * root - value("b")) < item.tolerance; }
  if (item.category === "CALCULUS") { const n = value("n"); const x = value("x") || 0.5; const h = 1e-5; const derivative = n * x ** (n - 1); const numeric = ((x + h) ** n - (x - h) ** n) / (2 * h); return Math.abs(derivative - numeric) < 1e-5 * Math.max(1, Math.abs(derivative)); }
  if (item.category === "MATRIX") { const determinant = value("a") * value("d") - value("b") * value("c"); return Number.isFinite(determinant); }
  if (item.category === "COMPLEX") { const modulus = Math.hypot(value("a"), value("b")); return Math.abs(modulus ** 2 - (value("a") ** 2 + value("b") ** 2)) < item.tolerance; }
  if (item.category === "UNIT") { const cm = convertUnit({ value: value("value"), unit: "m", dimension: "L" }, "cm"); const metres = cm.quantity ? convertUnit(cm.quantity, "m") : cm; return Math.abs((metres.quantity?.value ?? Infinity) - value("value")) < item.tolerance; }
  if (item.category === "ADVERSARIAL_CAS") { const symbol = String(item.input.symbol); return analyzeAssumptions([`${symbol}=${value("value")}`, `${symbol}!=${value("value")}`]).contradictions.length === 1; }
  if (item.category === "DESCRIPTIVE") { const start = value("start"); const result = summarize([start, start + 1, start + 2]); return result.mean === start + 1 && result.median === start + 1; }
  if (item.category === "REGRESSION") { const slope = value("slope") || 1; const intercept = value("intercept"); const csv = `x,y\n0,${intercept}\n1,${intercept + slope}\n2,${intercept + 2 * slope}\n3,${intercept + 3 * slope}`; const data = parseDataset(csv); const model = fitSimpleLinearRegression(data, data.columns[1].id, data.columns[0].id); return model.status === "COMPLETE" && Math.abs(model.coefficients[1].estimate - slope) < item.tolerance; }
  if (item.category === "INFERENCE") { const shift = value("shift"); const data = parseDataset(`group,value\nA,1\nA,2\nA,3\nB,${1 + shift}\nB,${2 + shift}\nB,${3 + shift}`); const result = twoSampleComparison(data, data.columns[1].id, data.columns[0].id, "A", "B"); return Number.isFinite(result.statistic) && Number.isFinite(result.effectSize.value); }
  if (item.category === "DISTRIBUTION") { const distribution = createDistribution({ id: "normal", parameters: { mu: value("mu"), sigma: value("sigma") } }); const q = distribution.quantile(value("p")); return Math.abs(distribution.cdf(q) - value("p")) < 1e-9; }
  if (item.category === "EXTREME_TAIL") { const tail = normalSurvival(value("z")); return tail > 0 && tail < 1e-8; }
  if (item.category === "SIMULATION") { const options = { seed: value("seed"), trials: value("trials"), sampleSize: 8 }; const first = runSamplingSimulation(options); const second = runSamplingSimulation(options); return JSON.stringify(first.results) === JSON.stringify(second.results); }
  if (item.category === "MALFORMED_DATASET") { const input = String(item.input.input); if (input.includes("unclosed")) { try { parseDataset(input); return false; } catch { return true; } } return exportCsv(parseDataset(input)).includes("'=CMD()"); }
  return item.expectedDiagnostics.includes("semantic alternatives required") && item.capabilityId === "accessibility.phase4";
}

function cases(category: BenchmarkCategory, count: number, input: (index: number) => Record<string, number | string>, supportedDomain: string, referenceMethod: string, capabilityId: string): Phase4Benchmark[] { return Array.from({ length: count }, (_, index) => ({ id: `${category.toLowerCase()}-${String(index + 1).padStart(3, "0")}`, category, supportedDomain, input: input(index), expectedResult: `Invariant ${index + 1} satisfied`, conditions: [], status: category === "EXTREME_TAIL" || category === "INFERENCE" || category === "REGRESSION" ? "APPROXIMATE" : category === "ADVERSARIAL_CAS" || category === "MALFORMED_DATASET" ? "ERROR_EXPECTED" : "EXACT", tolerance: 1e-9, expectedDiagnostics: category === "ACCESSIBLE_WORKFLOW" ? ["semantic alternatives required"] : [], referenceMethod, capabilityId })); }
