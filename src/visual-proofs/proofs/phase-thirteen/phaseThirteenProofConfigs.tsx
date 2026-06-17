import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  ArithmeticProgressionSumVisual,
  ArithmeticProgressionVisual,
  FibonacciSpiralVisual,
  FibonacciSumVisual,
  FibonacciTilingVisual,
  FiniteGeometricSeriesVisual,
  GeometricProgressionVisual,
  HarmonicGrowthVisual,
  InductionDominoVisual,
  InfiniteGeometricConvergenceVisual,
  PascalTriangleVisual,
  SquareNumbersOddLayersVisual,
  TriangularNumbersVisual,
} from "./PhaseThirteenSequenceVisualModels";
import {
  arithmeticSum,
  arithmeticTerm,
  binomialCoefficient,
  fibonacci,
  fibonacciList,
  fibonacciSum,
  finiteGeometricSum,
  formatNumber,
  geometricTerm,
  harmonicPartialSum,
  infiniteGeometricSum,
  naturalNumberSum,
  oddNumberSum,
} from "../../utils/sequenceSeriesMath";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const duplicateToggle = { id: "duplicate", label: "Show duplicate", defaultValue: true };
const sequenceRoute = "/olympyard/practice/patterns-sequences";
const phi = (1 + Math.sqrt(5)) / 2;

export const arithmeticProgressionPhaseThirteenConfig = makeConfig({
  steps: ["Place the first term", "Add equal steps", "Count jumps", "Reach nth term", "Match formula parts", "Conclude a_n = a + (n - 1)d"],
  parameters: [param("a", "First term a", -10, 20, 2), param("d", "Common difference d", -8, 12, 3), param("n", "Term count n", 2, 14, 8)],
  prediction: ["If n = 5, how many jumps from the first term are needed?", "4."],
  misconception: ["The nth term is a + nd.", "The first term already counts as term 1, so only n - 1 jumps are needed."],
  tokens: ["a", "d", "n-minus-1", "a-n"],
  formula: ({ a, d, n }) => `a_${n} = ${a} + (${n} - 1)${d} = ${arithmeticTerm(a, d, n)}`,
  liveValues: ({ a, d, n }) => [value("a", "a", a), value("d", "d", d), value("n", "n", n), value("n-minus-1", "number of jumps n-1", n - 1), value("a-n", "nth term", arithmeticTerm(a, d, n))],
  invariant: ({ d }) => `Every step changes by the common difference d = ${d}.`,
  renderVisual: ArithmeticProgressionVisual,
});

export const arithmeticProgressionSumPhaseThirteenConfig = makeConfig({
  steps: ["Build AP bars", "Duplicate the bars", "Reverse the duplicate", "Pair terms", "Count n equal pairs", "Conclude the AP sum formula"],
  parameters: [param("a", "First term a", 1, 12, 2), param("d", "Common difference d", 1, 8, 2), param("n", "Term count n", 2, 12, 7)],
  toggles: [duplicateToggle],
  prediction: ["Why do we divide the paired rectangle/bar total by 2?", "Because we duplicated the series before pairing."],
  misconception: ["The AP sum is just first term plus last term.", "First plus last is one pair; the sum depends on the number of terms."],
  tokens: ["n", "a", "l", "a-plus-l", "half"],
  formula: ({ a, d, n }) => {
    const l = arithmeticTerm(a, d, n);
    return `S_${n} = ${n}(${a} + ${l})/2 = ${arithmeticSum(a, d, n)}`;
  },
  liveValues: ({ a, d, n }) => {
    const l = arithmeticTerm(a, d, n);
    return [value("a", "a", a), value("d", "d", d), value("n", "n", n), value("l", "last term l", l), value("a-plus-l", "pair sum", a + l), value("duplicated", "duplicated total", n * (a + l)), value("sum", "actual sum", arithmeticSum(a, d, n))];
  },
  invariant: ({ a, d, n }) => `Each paired column has height a + l = ${a + arithmeticTerm(a, d, n)}.`,
  renderVisual: ArithmeticProgressionSumVisual,
});

export const geometricProgressionPhaseThirteenConfig = makeConfig({
  steps: ["Start with first term", "Multiply by r", "Repeat scaling", "Count multiplications", "Reach nth term", "Conclude a_n = ar^(n-1)"],
  parameters: [param("a", "First term a", 1, 8, 2), param("r", "Common ratio r", 0.4, 3, 1.5, 0.1), param("n", "Term count n", 2, 10, 7)],
  prediction: ["If r = 2, what happens from one term to the next?", "Each term doubles."],
  misconception: ["Geometric progression adds the same number each time.", "Geometric progression multiplies by the same ratio each time."],
  tokens: ["a", "r", "n-minus-1", "a-n"],
  formula: ({ a, r, n }) => `a_${n} = ${a}(${formatNumber(r)})^${n - 1} = ${formatNumber(geometricTerm(a, r, n))}`,
  liveValues: ({ a, r, n }) => [value("a", "a", a), value("r", "r", r), value("n", "n", n), value("n-minus-1", "multiplications n-1", n - 1), value("a-n", "nth term", formatNumber(geometricTerm(a, r, n)))],
  invariant: ({ r }) => `Each term divided by the previous term equals r = ${formatNumber(r)}.`,
  renderVisual: GeometricProgressionVisual,
});

export const finiteGeometricSeriesPhaseThirteenConfig = makeConfig({
  steps: ["Build finite GP", "Name the sum S_n", "Build scaled copy rS_n", "Subtract to cancel middle terms", "Solve for S_n", "Conclude the finite GP formula"],
  parameters: [param("a", "First term a", 1, 8, 3), param("r", "Ratio r", 0.2, 2.5, 0.6, 0.1), param("n", "Terms n", 2, 12, 6)],
  prediction: ["What happens to the formula when r = 1?", "The denominator becomes zero, so this formula form is not used; the sum is na."],
  misconception: ["The finite GP sum formula works unchanged for r = 1.", "When r = 1, every term is a, so the sum is na."],
  tokens: ["s-n", "r-s-n", "one-minus-r-n", "one-minus-r"],
  formula: ({ a, r, n }) => Math.abs(r - 1) < 0.001 ? `S_${n} = ${n}${a} = ${n * a}` : `S_${n} = ${a}(1 - ${formatNumber(r)}^${n})/(1 - ${formatNumber(r)}) = ${formatNumber(finiteGeometricSum(a, r, n))}`,
  liveValues: ({ a, r, n }) => [value("a", "a", a), value("r", "r", r), value("n", "n", n), value("r-n", "r^n", formatNumber(r ** n)), value("direct-sum", "direct sum", formatNumber(finiteGeometricSum(a, r, n))), value("formula-sum", "formula sum", formatNumber(finiteGeometricSum(a, r, n))), { id: "warning", label: "warning when r = 1", value: Math.abs(r - 1) < 0.001 ? "use S = na" : "not needed" }],
  invariant: ({ a, r, n }) => `Formula equals direct finite sum: ${formatNumber(finiteGeometricSum(a, r, n))}.`,
  renderVisual: FiniteGeometricSeriesVisual,
});

export const infiniteGeometricSeriesPhaseThirteenConfig = makeConfig({
  steps: ["Build shrinking terms", "Add partial sums", "Watch the gap shrink", "Compare with |r| < 1", "Show divergence when condition fails", "Conclude S = a/(1-r)"],
  parameters: [param("a", "First term a", 1, 8, 4), param("r", "Ratio r", -1.2, 1.2, 0.5, 0.1), param("n", "Visible terms", 2, 16, 9)],
  prediction: ["If |r| is greater than or equal to 1, does the series converge?", "No."],
  misconception: ["Every infinite geometric series has a finite sum.", "Only when |r| < 1 do the terms shrink enough for convergence."],
  tokens: ["a", "r", "condition", "limit-factor"],
  formula: ({ a, r }) => Math.abs(r) < 1 ? `S = ${a}/(1 - ${formatNumber(r)}) = ${formatNumber(infiniteGeometricSum(a, r))}` : `|r| >= 1, so the infinite series diverges`,
  liveValues: ({ a, r, n }) => {
    const terms = Array.from({ length: n }, (_, index) => a * r ** index);
    const partial = terms.reduce((total, item) => total + item, 0);
    const limit = infiniteGeometricSum(a, r);
    return [value("a", "a", a), value("r", "r", r), value("n", "visible terms", n), value("partial", "partial sum", formatNumber(partial)), value("limit", "limit if convergent", Number.isNaN(limit) ? "diverges" : formatNumber(limit)), value("gap", "gap to limit", Number.isNaN(limit) ? "none" : formatNumber(Math.abs(limit - partial))), { id: "status", label: "convergence status", value: Math.abs(r) < 1 ? "convergent" : "divergent" }];
  },
  invariant: ({ r }) => Math.abs(r) < 1 ? "|r| < 1, so partial sums approach a finite limit." : "|r| >= 1, so no finite geometric limit is claimed.",
  renderVisual: InfiniteGeometricConvergenceVisual,
});

export const triangularNumbersPhaseThirteenConfig = makeConfig({
  steps: ["Build triangular rows", "Count 1 through n", "Duplicate the triangle", "Form a rectangle", "Divide by 2", "Conclude T_n = n(n+1)/2"],
  parameters: [param("n", "Rows n", 1, 20, 9)],
  toggles: [duplicateToggle],
  prediction: ["Why are triangular numbers connected to 1 + 2 + ... + n?", "Because the triangular dot rows have 1, 2, ..., n dots."],
  misconception: ["Triangular numbers are unrelated to natural-number sums.", "They are exactly the sums of the first n natural numbers."],
  tokens: ["n", "n-plus-1", "half", "t-n"],
  formula: ({ n }) => `T_${n} = ${n}(${n}+1)/2 = ${naturalNumberSum(n)}`,
  liveValues: ({ n }) => [value("n", "n", n), value("dots", "dot count", naturalNumberSum(n)), value("rectangle", "rectangle dimensions", `${n} x ${n + 1}`), value("rectangle-area", "rectangle area", n * (n + 1)), value("t-n", "triangular number", naturalNumberSum(n))],
  invariant: ({ n }) => `Two triangles form an ${n} by ${n + 1} rectangle.`,
  renderVisual: TriangularNumbersVisual,
});

export const squareNumbersOddLayersPhaseThirteenConfig = makeConfig({
  steps: ["Start with 1 cell", "Add odd border layers", "Count the nth layer", "Form n by n square", "Compare total cells", "Conclude sum of odd numbers is n^2"],
  parameters: [param("n", "Layers n", 1, 16, 8)],
  prediction: ["What is the 5th odd layer?", "9."],
  misconception: ["Odd layers make a square by coincidence.", "Each new L-shaped border adds exactly the next odd number of cells."],
  tokens: ["latest-odd", "n-square", "odd-layers"],
  formula: ({ n }) => `1 + 3 + ... + ${2 * n - 1} = ${n}^2 = ${oddNumberSum(n)}`,
  liveValues: ({ n }) => [value("n", "n", n), value("latest-odd", "latest odd layer", 2 * n - 1), value("total", "total cells", oddNumberSum(n)), value("square", "square area", `${n} x ${n}`)],
  invariant: ({ n }) => `Odd layers exactly fill an ${n} by ${n} square.`,
  renderVisual: SquareNumbersOddLayersVisual,
});

export const fibonacciTilingPhaseThirteenConfig = makeConfig({
  steps: ["Start with first small squares", "Add the next square", "Use previous two lengths", "Continue the tiling", "Read recurrence", "Conclude F_n = F_(n-1) + F_(n-2)"],
  parameters: [param("n", "Fibonacci squares n", 3, 12, 8)],
  prediction: ["If the previous two Fibonacci terms are 8 and 13, what is the next?", "21."],
  misconception: ["Fibonacci adds the same difference each time.", "Each term is the sum of the previous two, so differences change."],
  tokens: ["f-n-minus-1", "f-n-minus-2", "f-n", "plus"],
  formula: ({ n }) => `F_${n} = F_${n - 1} + F_${n - 2} = ${fibonacci(n - 1)} + ${fibonacci(n - 2)} = ${fibonacci(n)}`,
  liveValues: ({ n }) => [value("n", "n", n), { id: "list", label: "Fibonacci list", value: fibonacciList(n).join(", ") }, value("latest-two", "latest two terms", `${fibonacci(n - 1)}, ${fibonacci(n - 2)}`), value("next", "next term", fibonacci(n))],
  invariant: ({ n }) => `F_${n} equals the sum of the previous two terms.`,
  renderVisual: FibonacciTilingVisual,
});

export const fibonacciSpiralPhaseThirteenConfig = makeConfig({
  steps: ["Build Fibonacci squares", "Draw quarter arcs", "Connect arcs visually", "Compare ratios", "Approach phi", "Conclude it is an approximation"],
  parameters: [param("n", "Squares n", 3, 12, 8)],
  prediction: ["Is the Fibonacci spiral exactly the same as the golden spiral?", "No, it approximates it."],
  misconception: ["The Fibonacci spiral is exactly the golden spiral.", "The quarter arcs approximate a spiral; ratios approach phi as terms grow."],
  tokens: ["ratio", "phi", "quarter-arcs"],
  formula: ({ n }) => `F_${n}/F_${n - 1} = ${formatNumber(fibonacci(n) / fibonacci(n - 1))}, approaching phi ~= ${formatNumber(phi)}`,
  liveValues: ({ n }) => [value("n", "n", n), value("latest", "latest Fibonacci terms", `${fibonacci(n - 1)}, ${fibonacci(n)}`), value("ratio", "ratio", formatNumber(fibonacci(n) / fibonacci(n - 1))), value("phi", "phi approximation", formatNumber(phi)), { id: "insight", label: "insight", value: "approximation, not exact golden spiral" }],
  invariant: ({ n }) => `The ratio ${formatNumber(fibonacci(n) / fibonacci(n - 1))} moves toward phi as n grows.`,
  renderVisual: FibonacciSpiralVisual,
});

export const fibonacciSumPhaseThirteenConfig = makeConfig({
  steps: ["Build Fibonacci terms", "Add them cumulatively", "Compare to F_(n+2)", "Show missing one unit", "Verify numerically", "Conclude the sum formula"],
  parameters: [param("n", "Terms n", 2, 12, 8)],
  prediction: ["If n = 5 and the terms are 1,1,2,3,5, what is their sum?", "12, which equals F_7 - 1 = 13 - 1."],
  misconception: ["The sum of Fibonacci numbers has no simple pattern.", "The cumulative sum is always one less than the Fibonacci number two places ahead."],
  tokens: ["fib-sum", "f-n-plus-2", "minus-one"],
  formula: ({ n }) => `F_1 + ... + F_${n} = F_${n + 2} - 1 = ${fibonacci(n + 2)} - 1 = ${fibonacciSum(n)}`,
  liveValues: ({ n }) => [value("n", "n", n), { id: "terms", label: "Fibonacci terms", value: fibonacciList(n).join(", ") }, value("direct", "direct sum", fibonacciSum(n)), value("f-n-plus-2", `F_${n + 2}`, fibonacci(n + 2)), value("identity", `F_${n + 2} - 1`, fibonacci(n + 2) - 1)],
  invariant: ({ n }) => `Direct sum equals F_${n + 2} - 1.`,
  renderVisual: FibonacciSumVisual,
});

export const pascalTrianglePhaseThirteenConfig = makeConfig({
  steps: ["Build Pascal rows", "Add two-above rule", "Select row n", "Map entries to coefficients", "Match expansion terms", "Conclude binomial coefficient connection"],
  parameters: [param("n", "Row n", 0, 8, 6), param("k", "Column k", 0, 8, 3)],
  prediction: ["How is an interior Pascal entry formed?", "By adding the two entries above it."],
  misconception: ["Pascal's triangle is just a number pattern unrelated to binomial expansion.", "Each row gives the coefficients of a binomial expansion."],
  tokens: ["c-n-k", "row-n", "expansion"],
  formula: ({ n, k }) => `C(${n},${Math.min(k, n)}) = ${binomialCoefficient(n, Math.min(k, n))}; row ${n} gives (a+b)^${n}`,
  liveValues: ({ n, k }) => {
    const safeK = Math.min(k, n);
    const row = Array.from({ length: n + 1 }, (_, index) => binomialCoefficient(n, index));
    return [value("n", "n", n), value("k", "selected k", safeK), value("c-n-k", `C(${n},${safeK})`, binomialCoefficient(n, safeK)), { id: "row", label: "row values", value: row.join(", ") }];
  },
  invariant: () => "Each interior entry equals the sum of the two entries above it.",
  renderVisual: PascalTriangleVisual,
});

export const inductionDominoPhaseThirteenConfig = makeConfig({
  steps: ["Show first domino/base case", "Show one link k to k+1", "Repeat the link", "Let the chain grow", "Reach n", "Conclude induction logic"],
  parameters: [param("n", "Dominoes n", 3, 24, 12)],
  prediction: ["What two things are needed for induction?", "A base case and an inductive step."],
  misconception: ["Checking many examples is the same as proof by induction.", "Induction proves the chain continues for every case, not just checked examples."],
  tokens: ["base-case", "inductive-step", "all-n"],
  formula: ({ n }) => `Base case + P(k) => P(k+1) proves P(n) through n = ${n}`,
  liveValues: ({ n }) => [value("n", "n", n), { id: "base", label: "base case status", value: "established" }, { id: "step", label: "inductive link status", value: "valid k to k+1" }, value("range", "proven range", `1 through ${n}`)],
  invariant: () => "Base case plus every valid link reaches all dominoes.",
  renderVisual: InductionDominoVisual,
});

export const harmonicGrowthPhaseThirteenConfig = makeConfig({
  steps: ["Show harmonic terms", "Group terms by powers of two", "Compare each group to 1/2", "Stack group lower bounds", "Watch total grow", "Conclude divergence"],
  parameters: [param("groups", "Power-of-two groups", 2, 7, 5)],
  prediction: ["Does the harmonic series stop growing after terms become very small?", "No, it keeps growing without bound, but slowly."],
  misconception: ["If terms go to zero, the series must converge.", "Terms going to zero is necessary but not sufficient; the harmonic series still diverges."],
  tokens: ["one-over-n", "group-half", "diverges"],
  formula: ({ groups }) => `1 + 1/2 + ... + 1/${2 ** groups} keeps gaining grouped lower bounds > 1/2`,
  liveValues: ({ groups }) => {
    const terms = 2 ** groups;
    return [value("terms", "number of terms", terms), value("partial", "partial sum", formatNumber(harmonicPartialSum(terms))), value("groups", "group count", groups), value("lower", "lower-bound total", formatNumber(1 + Math.max(0, groups - 1) * 0.5)), { id: "insight", label: "insight", value: "grows slowly but without bound" }];
  },
  invariant: ({ groups }) => `${groups} grouped lower bounds keep accumulating; no finite ceiling is claimed.`,
  renderVisual: HarmonicGrowthVisual,
});

export const phaseThirteenRouteSlugs = [
  ["sequences-and-series", "arithmetic-progression-equal-steps"],
  ["sequences-and-series", "sum-arithmetic-progression"],
  ["sequences-and-series", "geometric-progression-repeated-scaling"],
  ["sequences-and-series", "finite-geometric-series-sum"],
  ["sequences-and-series", "infinite-geometric-series-convergence"],
  ["sequences-and-series", "triangular-numbers"],
  ["sequences-and-series", "square-numbers-odd-layers"],
  ["sequences-and-series", "fibonacci-sequence-tiling"],
  ["sequences-and-series", "fibonacci-spiral-approximation"],
  ["sequences-and-series", "sum-of-fibonacci-numbers"],
  ["sequences-and-series", "pascal-triangle-binomial-coefficients"],
  ["sequences-and-series", "visual-induction-domino-growth"],
  ["sequences-and-series", "harmonic-series-growth-intuition"],
] as const;

export const allSequenceSeriesPhaseRouteSlugs = [
  ["sequences-and-series", "sum-first-n-natural-numbers"],
  ["sequences-and-series", "sum-first-n-odd-numbers"],
  ...phaseThirteenRouteSlugs,
] as const;

export const phaseThirteenConfigs = [
  arithmeticProgressionPhaseThirteenConfig,
  arithmeticProgressionSumPhaseThirteenConfig,
  geometricProgressionPhaseThirteenConfig,
  finiteGeometricSeriesPhaseThirteenConfig,
  infiniteGeometricSeriesPhaseThirteenConfig,
  triangularNumbersPhaseThirteenConfig,
  squareNumbersOddLayersPhaseThirteenConfig,
  fibonacciTilingPhaseThirteenConfig,
  fibonacciSpiralPhaseThirteenConfig,
  fibonacciSumPhaseThirteenConfig,
  pascalTrianglePhaseThirteenConfig,
  inductionDominoPhaseThirteenConfig,
  harmonicGrowthPhaseThirteenConfig,
];

type ConfigInput = {
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  toggles?: PhaseTwoProofConfig["toggles"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValues) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

function makeConfig(input: ConfigInput): PhaseTwoProofConfig {
  return {
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle, ...(input.toggles ?? [])],
    olympyardRoute: sequenceRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: "pattern-invariant", label: "pattern invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Pattern units are exact.", "Slider values are clamped to safe classroom ranges.", "SVG labels are compact; exact values live in the formula and state panels."],
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
  return { id: `p13-${index}`, title, description: title, focusLabel: index < 2 ? "build" : index < 5 ? "pattern" : "formula" };
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the visible pattern before applying the formula.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use only memorized notation.", feedback: "The notation must match the visual pattern." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the linked pattern region.", options: [{ id: "pattern", label: "Use the visual pattern.", correct: true, feedback: "Correct." }, { id: "memorized", label: "Trust the shortcut only.", feedback: "The shortcut is reliable only when it matches the construction." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "a-n": "a_n",
    "n-minus-1": "n - 1",
    "a-plus-l": "a + l",
    half: "1/2",
    "s-n": "S_n",
    "r-s-n": "rS_n",
    "one-minus-r-n": "1 - r^n",
    "one-minus-r": "1 - r",
    condition: "|r| < 1",
    "limit-factor": "1/(1-r)",
    "n-plus-1": "n + 1",
    "t-n": "T_n",
    "n-square": "n^2",
    "latest-odd": "2n - 1",
    "odd-layers": "odd layers",
    "f-n-minus-1": "F_(n-1)",
    "f-n-minus-2": "F_(n-2)",
    "f-n": "F_n",
    "f-n-plus-2": "F_(n+2)",
    "minus-one": "-1",
    "c-n-k": "C(n,k)",
    "row-n": "row n",
    expansion: "(a+b)^n",
    "base-case": "base case",
    "inductive-step": "inductive step",
    "all-n": "all n",
    "one-over-n": "1/n",
    "group-half": "> 1/2",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("fib") || token.startsWith("f-")) return "Fibonacci tile or block";
  if (token.includes("condition") || token.includes("limit")) return "convergence panel";
  if (token.includes("inductive") || token.includes("base")) return "domino chain";
  if (token.includes("group") || token.includes("diverges")) return "harmonic group";
  return "pattern region";
}
