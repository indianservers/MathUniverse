import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  ChangeOfBaseVisual,
  ExponentialGrowthDecayVisual,
  ExponentLawsVisual,
  ExponentsRepeatedMultiplicationVisual,
  LogInverseExponentialVisual,
  LogLawsVisual,
  LogScaleVisual,
  NaturalExponentialVisual,
} from "./PhaseTwentyFiveLogExponentVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const logExponentRoute = "/olympyard/practice/logarithms-exponents-foundations";

export const exponentsRepeatedMultiplicationPhaseTwentyFiveConfig = makeConfig({
  modelKey: "exponents-repeated-factor-growth-blocks",
  steps: ["Choose base a", "Choose exponent n", "Expand repeated factors", "Multiply step by step", "Check n = 0 and n = 1", "Conclude exponent meaning"],
  parameters: [param("base", "base a", 2, 5, 3, 1), param("exponent", "exponent n", 0, 6, 4, 1)],
  prediction: ["What does the exponent n count?", "The number of repeated factors of the base."],
  misconception: ["a^n means a x n.", "Exponentiation is repeated multiplication by the base, not multiplication by the exponent."],
  tokens: ["base-a", "exponent-n", "power-a-n", "zero-exponent"],
  formula: ({ base, exponent }) => `${fmt(base)}^${fmt(exponent)} = ${factorText(base, exponent)} = ${fmt(pow(base, exponent))}`,
  liveValues: ({ base, exponent }) => [value("base-a", "base a", fmt(base)), value("exponent-n", "exponent n", fmt(exponent)), value("repeated-factors", "repeated factors", factorText(base, exponent)), value("value-a-n", "value a^n", fmt(pow(base, exponent))), value("growth-factor-from-previous-exponent", "growth factor from previous exponent", exponent > 0 ? fmt(base) : "starts at 1"), value("multiplication-step-invariant", "invariant", "each step multiplies by a")],
  invariant: () => "Each exponent step multiplies the previous value by the base.",
  renderVisual: ExponentsRepeatedMultiplicationVisual,
});

export const lawsOfExponentsSameBasePhaseTwentyFiveConfig = makeConfig({
  modelKey: "same-base-exponent-laws-factor-counts",
  steps: ["Expand first power", "Expand second power", "Combine or cancel factor groups", "Count resulting factors", "Compare with simplified exponent", "Conclude exponent law"],
  parameters: [param("base", "base a", 2, 5, 2, 1), param("m", "m", 1, 5, 3, 1), param("n", "n", 1, 4, 2, 1), param("mode", "mode 0=product 1=quotient 2=power", 0, 2, 0, 1)],
  prediction: ["When multiplying powers with the same base, what happens to exponents?", "They add."],
  misconception: ["a^m times a^n = a^(mn).", "Multiplication of same-base powers combines factor counts, so exponents add."],
  tokens: ["m", "n", "m-plus-n", "m-minus-n", "mn"],
  formula: ({ base, m, n, mode }) => `${lawFormula(base, m, n, mode)} = ${fmt(pow(base, simplifiedExponent(m, n, mode)))}`,
  liveValues: ({ base, m, n, mode }) => [value("base-a", "base a", fmt(base)), value("m", "m", fmt(m)), value("n", "n", fmt(n)), value("selected-law", "selected law", exponentLawName(mode)), value("expanded-factors", "expanded factors", lawExpandedText(base, m, n, mode)), value("simplified-exponent", "simplified exponent", fmt(simplifiedExponent(m, n, mode))), value("value-comparison", "value comparison", "expanded = simplified"), value("exponent-law-invariant", "invariant", "expanded expression equals simplified expression")],
  invariant: () => "Expanded factor chains and the simplified exponent form have the same value.",
  renderVisual: ExponentLawsVisual,
});

export const exponentialGrowthDecayPhaseTwentyFiveConfig = makeConfig({
  modelKey: "exponential-growth-decay-constant-multiplier",
  steps: ["Choose initial value", "Choose multiplier b", "Step x forward", "Multiply each step", "Compare growth and decay", "Conclude exponential model"],
  parameters: [param("initial", "initial value a", 0.5, 4, 1.5, 0.25), param("multiplier", "multiplier b", 0.4, 2.2, 1.4, 0.05), param("x", "x steps", 0, 6, 3, 0.25)],
  prediction: ["What is the key pattern in exponential growth?", "Equal input steps multiply the output by a constant factor."],
  misconception: ["Exponential growth adds the same amount each step.", "Exponential growth multiplies by the same factor each step."],
  tokens: ["initial-a", "multiplier-b", "x-steps", "a-b-x"],
  formula: ({ initial, multiplier, x }) => `y = a*b^x = ${fmt(initial)}*${fmt(multiplier)}^${fmt(x)} = ${fmt(initial * multiplier ** x)}`,
  liveValues: ({ initial, multiplier, x }) => [value("initial-value-a", "initial value a", fmt(initial)), value("base-multiplier-b", "base/multiplier b", fmt(multiplier)), value("x", "x", fmt(x)), value("current-y", "current y", fmt(initial * multiplier ** x)), value("growth-decay-status", "growth/decay status", multiplier > 1 ? "growth" : "decay"), value("ratio-y-next-over-y", "ratio y(x+1)/y(x)", fmt(multiplier)), value("constant-multiplier-invariant", "invariant", "equal x-steps multiply by b")],
  invariant: () => "Equal x-steps multiply the output by the same factor b.",
  renderVisual: ExponentialGrowthDecayVisual,
});

export const logarithmInverseExponentialPhaseTwentyFiveConfig = makeConfig({
  modelKey: "logarithm-inverse-reflection-exponential",
  steps: ["Draw exponential graph", "Choose exponent x", "Compute y=b^x", "Reflect point across y=x", "Read logarithm", "Conclude log as inverse"],
  parameters: [param("base", "base b", 1.5, 3, 2, 0.1), param("exponent", "exponent x", 0, 4, 2, 0.25)],
  prediction: ["What question does log_b(y) answer?", "What exponent on b gives y?"],
  misconception: ["Logarithm is a new unrelated operation.", "A logarithm reverses exponentiation."],
  tokens: ["log-b-y", "x-exponent", "b-x", "inverse"],
  formula: ({ base, exponent }) => `log_b(y)=x means ${fmt(base)}^${fmt(exponent)} = ${fmt(base ** exponent)} and log_${fmt(base)}(${fmt(base ** exponent)}) = ${fmt(exponent)}`,
  liveValues: ({ base, exponent }) => [value("base-b", "base b", fmt(base)), value("exponent-x", "exponent x", fmt(exponent)), value("y-equals-b-x", "y = b^x", fmt(base ** exponent)), value("log-b-y", "log_b(y)", fmt(logBase(base ** exponent, base))), value("reflected-point", "reflected point", `(${fmt(base ** exponent)}, ${fmt(exponent)})`), value("inverse-invariant", "invariant", "log_b(b^x)=x")],
  invariant: () => "A logarithm gives the exponent needed to produce a value from a base.",
  renderVisual: LogInverseExponentialVisual,
});

export const lawsOfLogarithmsPhaseTwentyFiveConfig = makeConfig({
  modelKey: "log-laws-from-exponent-laws",
  steps: ["Write M and N as powers of b", "Multiply/divide/raise power", "Use exponent laws", "Take logarithm", "Compare both sides", "Conclude log law"],
  parameters: [param("base", "base b", 1.5, 4, 2, 0.25), param("m", "m = log_b M", 1, 4, 2, 0.25), param("n", "n = log_b N", 1, 3, 1.5, 0.25), param("p", "power p", 1, 4, 3, 0.25), param("mode", "mode 0=product 1=quotient 2=power", 0, 2, 0, 1)],
  prediction: ["Why does log_b(MN) become a sum?", "Because multiplying same-base powers adds their exponents."],
  misconception: ["log_b(M+N)=log_b M + log_b N.", "Log product law applies to multiplication, not addition."],
  tokens: ["M", "N", "MN", "M-over-N", "M-power-p", "plus", "minus", "p-log-b-M"],
  formula: ({ base, m, n, p, mode }) => logLawFormula(base, m, n, p, mode),
  liveValues: ({ base, m, n, p, mode }) => [value("base-b", "base b", fmt(base)), value("M", "M", fmt(base ** m)), value("N", "N", fmt(base ** n)), value("m-log-b-M", "m = log_b M", fmt(m)), value("n-log-b-N", "n = log_b N", fmt(n)), value("selected-log-law", "selected log law", logLawName(mode)), value("left-side", "left side", fmt(logLawLeft(base, m, n, p, mode))), value("right-side", "right side", fmt(logLawRight(m, n, p, mode))), value("log-law-invariant", "invariant", "log law follows exponent law")],
  invariant: () => "Logarithm laws follow directly from exponent laws after writing values as powers of the base.",
  renderVisual: LogLawsVisual,
});

export const changeOfBasePhaseTwentyFiveConfig = makeConfig({
  modelKey: "change-of-base-log-scale-conversion",
  steps: ["Define y=log_b x", "Rewrite as b^y=x", "Take log base k", "Use power law", "Solve for y", "Conclude change of base"],
  parameters: [param("baseB", "target base b", 1.5, 5, 2, 0.25), param("baseK", "comparison base k", 1.5, 10, 10, 0.25), param("xValue", "value x", 1.2, 64, 16, 0.25)],
  prediction: ["What does the denominator log_k b do?", "It converts the k-base log scale into the b-base log scale."],
  misconception: ["Changing log base changes the actual exponent answer.", "The value log_b x is fixed; change of base just computes it using another log scale."],
  tokens: ["log-b-x", "log-k-x", "log-k-b", "ratio"],
  formula: ({ baseB, baseK, xValue }) => `log_b x = log_k x / log_k b = ${fmt(logBase(xValue, baseK))}/${fmt(logBase(baseB, baseK))} = ${fmt(logBase(xValue, baseB))}`,
  liveValues: ({ baseB, baseK, xValue }) => [value("b", "b", fmt(baseB)), value("k", "k", fmt(baseK)), value("x", "x", fmt(xValue)), value("direct-log-b-x", "direct log_b x", fmt(logBase(xValue, baseB))), value("numerator-log-k-x", "numerator log_k x", fmt(logBase(xValue, baseK))), value("denominator-log-k-b", "denominator log_k b", fmt(logBase(baseB, baseK))), value("ratio", "ratio", fmt(logBase(xValue, baseK) / logBase(baseB, baseK))), value("change-base-invariant", "invariant", "ratio equals target logarithm")],
  invariant: () => "The change-of-base ratio equals the original logarithm.",
  renderVisual: ChangeOfBaseVisual,
});

export const logarithmicScalePhaseTwentyFiveConfig = makeConfig({
  modelKey: "log-scale-equal-ratios-orders-magnitude",
  steps: ["Show linear scale", "Show log scale", "Mark powers of 10", "Compare equal ratios", "Move a value", "Conclude log-scale meaning"],
  parameters: [param("xValue", "value x", 1, 1000, 100, 1)],
  prediction: ["On a base-10 log scale, what is the distance relationship between 1 to 10 and 10 to 100?", "They are equal distances because both are x10."],
  misconception: ["A log scale keeps equal differences equally spaced.", "A log scale keeps equal ratios equally spaced."],
  tokens: ["log10-x", "times-10", "orders-magnitude"],
  formula: ({ xValue }) => `position = log10(x) = log10(${fmt(xValue)}) = ${fmt(Math.log10(xValue))}; multiplying by 10 adds 1`,
  liveValues: ({ xValue }) => [value("value-x", "value x", fmt(xValue)), value("log10-x", "log10(x)", fmt(Math.log10(xValue))), value("nearest-power-of-10", "nearest power of 10", `10^${Math.round(Math.log10(xValue))}`), value("order-of-magnitude", "order of magnitude", Math.floor(Math.log10(xValue))), value("linear-position", "linear position", fmt(xValue / 1000)), value("log-position", "log position", fmt(Math.log10(xValue) / 3)), value("log-scale-invariant", "invariant", "multiplying by 10 adds 1 to log10")],
  invariant: () => "Equal ratios occupy equal distances on a logarithmic scale.",
  renderVisual: LogScaleVisual,
});

export const naturalExponentialPhaseTwentyFiveConfig = makeConfig({
  modelKey: "natural-exponential-height-slope-e-approximation",
  steps: ["Draw y=e^x", "Pick a point", "Compare height and slope", "Show compound-growth approximation", "Increase n", "Conclude natural exponential meaning"],
  parameters: [param("x", "x", -1.5, 2, 0.6, 0.1), param("n", "n for approximation", 1, 100, 20, 1)],
  prediction: ["What is special about y=e^x?", "Its slope equals its value at every point."],
  misconception: ["e is just a random decimal.", "e arises naturally from continuous growth and the exponential whose derivative equals itself."],
  tokens: ["e-x", "slope", "compound-growth", "e"],
  formula: ({ x, n }) => `d/dx e^x = e^x, so height = slope = ${fmt(Math.E ** x)}; (1+1/n)^n = ${fmt((1 + 1 / n) ** n)}`,
  liveValues: ({ x, n }) => [value("x", "x", fmt(x)), value("e-x", "e^x", fmt(Math.E ** x)), value("tangent-slope", "tangent slope", fmt(Math.E ** x)), value("difference", "difference", "0"), value("n", "n", fmt(n)), value("approximation", "(1+1/n)^n", fmt((1 + 1 / n) ** n)), value("e-comparison", "e comparison", fmt(Math.E)), value("natural-growth-insight", "insight", "e is natural for continuous growth")],
  invariant: () => "For y=e^x, the height and tangent slope are equal.",
  renderVisual: NaturalExponentialVisual,
});

export const phaseTwentyFiveRouteSlugs = [
  ["logarithms-exponents", "exponents-repeated-multiplication"],
  ["logarithms-exponents", "laws-of-exponents-same-base"],
  ["logarithms-exponents", "exponential-growth-decay"],
  ["logarithms-exponents", "logarithm-inverse-exponential"],
  ["logarithms-exponents", "laws-of-logarithms"],
  ["logarithms-exponents", "change-of-base-formula"],
  ["logarithms-exponents", "logarithmic-scale-orders-magnitude"],
  ["logarithms-exponents", "natural-exponential-e"],
] as const;

export const phaseTwentyFiveConfigs = [
  exponentsRepeatedMultiplicationPhaseTwentyFiveConfig,
  lawsOfExponentsSameBasePhaseTwentyFiveConfig,
  exponentialGrowthDecayPhaseTwentyFiveConfig,
  logarithmInverseExponentialPhaseTwentyFiveConfig,
  lawsOfLogarithmsPhaseTwentyFiveConfig,
  changeOfBasePhaseTwentyFiveConfig,
  logarithmicScalePhaseTwentyFiveConfig,
  naturalExponentialPhaseTwentyFiveConfig,
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

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentyFiveModelKey: string } {
  return {
    phaseTwentyFiveModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: logExponentRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `log-exp-${input.modelKey}-invariant`, label: "growth-scale invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG growth-scale model.", "Values are bounded to keep graph labels readable on mobile.", "Keyboard fallback controls are available in the shared parameter panel."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) { return { id, label, min, max, defaultValue, step }; }
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p25-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "growth-scale visual" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the growth-scale visual before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "linear-thinking", label: "It works like ordinary addition.", feedback: "Exponential and logarithmic structure is multiplicative." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight repeated factors, equal multipliers, inverse reflection, scale conversion, or height-slope comparison.", options: [{ id: "growth-scale", label: "Use the growth-scale relationship.", correct: true, feedback: "Correct." }, { id: "memorize-only", label: "Treat it as an isolated rule.", feedback: "The rule follows from factor counts, inverse graphs, or equal ratios." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "base-a": "a", "exponent-n": "n", "power-a-n": "a^n", "zero-exponent": "a^0=1",
    m: "m", n: "n", "m-plus-n": "m+n", "m-minus-n": "m-n", mn: "mn",
    "initial-a": "a", "multiplier-b": "b", "x-steps": "x", "a-b-x": "a*b^x",
    "log-b-y": "log_b(y)", "x-exponent": "x", "b-x": "b^x", inverse: "inverse",
    M: "M", N: "N", MN: "MN", "M-over-N": "M/N", "M-power-p": "M^p", plus: "+", minus: "-", "p-log-b-M": "p log_b M",
    "log-b-x": "log_b x", "log-k-x": "log_k x", "log-k-b": "log_k b", ratio: "ratio",
    "log10-x": "log10(x)", "times-10": "x10", "orders-magnitude": "orders of magnitude",
    "e-x": "e^x", slope: "slope", "compound-growth": "(1+1/n)^n", e: "e",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}
function tokenVisualLabel(token: string) {
  if (["base-a", "exponent-n", "power-a-n", "zero-exponent"].includes(token)) return "repeated multiplication factor chain and growth blocks";
  if (["m", "n", "m-plus-n", "m-minus-n", "mn"].includes(token)) return "same-base factor chains and simplified exponent count";
  if (["initial-a", "multiplier-b", "x-steps", "a-b-x"].includes(token)) return "exponential graph and equal-step multiplier markers";
  if (["log-b-y", "x-exponent", "b-x", "inverse"].includes(token)) return "exponential/log inverse graph reflection";
  if (["M", "N", "MN", "M-over-N", "M-power-p", "plus", "minus", "p-log-b-M"].includes(token)) return "log laws derived from exponent laws";
  if (["log-b-x", "log-k-x", "log-k-b", "ratio"].includes(token)) return "change-of-base scale conversion";
  if (["log10-x", "times-10", "orders-magnitude"].includes(token)) return "linear versus logarithmic scale";
  if (["e-x", "slope", "compound-growth", "e"].includes(token)) return "natural exponential height, tangent slope, and compound-growth approximation";
  return "logarithm/exponent visual feature";
}

function pow(base: number, exponent: number) { return Math.round(exponent) === 0 ? 1 : base ** Math.round(exponent); }
function factorText(base: number, exponent: number) { return Math.round(exponent) === 0 ? "empty product = 1" : Array.from({ length: Math.round(exponent) }, () => fmt(base)).join(" x "); }
function exponentLawName(mode: number) { return Math.round(mode) === 0 ? "product" : Math.round(mode) === 1 ? "quotient" : "power of power"; }
function simplifiedExponent(m: number, n: number, mode: number) { return Math.round(mode) === 0 ? m + n : Math.round(mode) === 1 ? m - n : m * n; }
function lawFormula(base: number, m: number, n: number, mode: number) {
  if (Math.round(mode) === 0) return `${fmt(base)}^${fmt(m)} * ${fmt(base)}^${fmt(n)} = ${fmt(base)}^${fmt(m + n)}`;
  if (Math.round(mode) === 1) return `${fmt(base)}^${fmt(m)} / ${fmt(base)}^${fmt(n)} = ${fmt(base)}^${fmt(m - n)}`;
  return `(${fmt(base)}^${fmt(m)})^${fmt(n)} = ${fmt(base)}^${fmt(m * n)}`;
}
function lawExpandedText(base: number, m: number, n: number, mode: number) {
  if (Math.round(mode) === 0) return `${factorText(base, m)} then ${factorText(base, n)}`;
  if (Math.round(mode) === 1) return "common factors cancel";
  return `${fmt(n)} groups of ${factorText(base, m)}`;
}
function logLawName(mode: number) { return Math.round(mode) === 0 ? "product" : Math.round(mode) === 1 ? "quotient" : "power"; }
function logLawFormula(base: number, m: number, n: number, p: number, mode: number) {
  const mValue = base ** m;
  const nValue = base ** n;
  if (Math.round(mode) === 0) return `log_b(MN)=log_b M+log_b N = ${fmt(m)}+${fmt(n)} = ${fmt(m + n)}`;
  if (Math.round(mode) === 1) return `log_b(M/N)=log_b M-log_b N = ${fmt(m)}-${fmt(n)} = ${fmt(m - n)}`;
  return `log_b(M^p)=p log_b M = ${fmt(p)}*${fmt(m)} = ${fmt(p * m)} where M=${fmt(mValue)}, N=${fmt(nValue)}`;
}
function logLawLeft(base: number, m: number, n: number, p: number, mode: number) {
  if (Math.round(mode) === 0) return logBase((base ** m) * (base ** n), base);
  if (Math.round(mode) === 1) return logBase((base ** m) / (base ** n), base);
  return logBase((base ** m) ** p, base);
}
function logLawRight(m: number, n: number, p: number, mode: number) { return Math.round(mode) === 0 ? m + n : Math.round(mode) === 1 ? m - n : p * m; }
function logBase(value: number, base: number) { return Math.log(value) / Math.log(base); }
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
