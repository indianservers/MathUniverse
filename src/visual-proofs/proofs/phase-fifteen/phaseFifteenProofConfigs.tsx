import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import { formatNumber, taylorPolynomial } from "../../utils/calculusMath";
import {
  DerivativeOfExponentialVisual,
  DerivativeOfSineVisual,
  FundamentalTheoremCalculusVisual,
  IntegrationByPartsVisual,
  MeanValueTheoremVisual,
  OptimizationDerivativeVisual,
  TaylorSeriesApproximationVisual,
} from "./PhaseFifteenCalculusVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const calculusRoute = "/olympyard/practice/calculus-foundations";

export const meanValueTheoremPhaseFifteenConfig = makeConfig({
  steps: ["Choose interval [a,b]", "Draw endpoint secant", "Compute average slope", "Search inside for c", "Draw tangent at c", "Conclude f'(c) equals secant slope"],
  parameters: [param("a", "Left endpoint a", -2.5, 1.5, -1.6, 0.1), param("b", "Right endpoint b", -0.5, 3.5, 2.4, 0.1), param("c", "Interior point c", -2.3, 3.3, 0.2, 0.1)],
  prediction: ["What must match at the special point c?", "The tangent slope must match the secant slope across [a,b]."],
  misconception: ["The Mean Value Theorem says the function value equals the average value.", "It is about matching slopes: instantaneous rate equals average rate somewhere."],
  tokens: ["f-prime-c", "f-b-minus-f-a", "b-minus-a", "secant-slope", "c"],
  formula: ({ a, b }) => `f'(c) = [f(b)-f(a)]/(b-a) = ${formatNumber(mvtSecant(a, b))}`,
  liveValues: ({ a, b, c }) => [value("a", "a", a), value("b", "b", b), value("c", "c", c), value("f-a", "f(a)", formatNumber(mvtFunction(a))), value("f-b", "f(b)", formatNumber(mvtFunction(b))), value("secant-slope", "secant slope", formatNumber(mvtSecant(a, b))), value("f-prime-c", "tangent slope at c", formatNumber(mvtDerivative(c))), value("slope-difference", "slope difference", formatNumber(Math.abs(mvtSecant(a, b) - mvtDerivative(c)))), { id: "conditions", label: "conditions note", value: "continuous on [a,b], differentiable on (a,b)" }],
  invariant: () => "For a smooth function on [a,b], at least one interior tangent slope matches the endpoint secant slope.",
  renderVisual: MeanValueTheoremVisual,
});

export const fundamentalTheoremPhaseFifteenConfig = makeConfig({
  steps: ["Start with function f", "Accumulate area from a to x", "Move x slightly", "Observe the new thin strip", "Compare area-change rate with f(x)", "Conclude A'(x)=f(x)"],
  parameters: [param("a", "Fixed lower bound a", -2.5, 1.5, -1.4, 0.1), param("x", "Moving endpoint x", -1.2, 4, 2.3, 0.1), param("dx", "Tiny width dx", 0.04, 0.6, 0.18, 0.02)],
  prediction: ["If the graph height f(x) is larger, what happens to the rate at which accumulated area grows?", "It grows faster."],
  misconception: ["The derivative of accumulated area is another area.", "The derivative of accumulated area is the current height f(x), because adding a tiny slice adds height times width."],
  tokens: ["A-x", "integral-a-x", "f-x", "A-prime-x", "F-b-minus-F-a"],
  formula: ({ a, x }) => `If A(x)=integral_${formatNumber(a)}^x f(t)dt, then A'(x)=f(x)=${formatNumber(ftcFunction(x))}`,
  liveValues: ({ a, x, dx }) => [value("a", "fixed a", a), value("x", "moving x", x), value("f-x", "f(x)", formatNumber(ftcFunction(x))), value("A-x", "accumulated area A(x)", formatNumber(integrate(ftcFunction, a, x, 180))), value("thin-strip", "thin strip approximation", formatNumber(ftcFunction(x) * dx)), value("A-prime-x", "derivative estimate of A", formatNumber(ftcFunction(x))), { id: "insight", label: "insight", value: "area growth rate equals current height" }],
  invariant: () => "A tiny added area is approximately f(x) dx, so the area-change rate is f(x).",
  renderVisual: FundamentalTheoremCalculusVisual,
});

export const integrationByPartsPhaseFifteenConfig = makeConfig({
  steps: ["Start with product rectangle uv", "Change u and v slightly", "Identify two first-order strips", "Recall product rule", "Rearrange for u dv", "Accumulate to get integration by parts"],
  parameters: [param("u", "u", 1, 6, 4, 0.2), param("v", "v", 1, 5, 3, 0.2), param("du", "du", 0.1, 2, 0.7, 0.1), param("dv", "dv", 0.1, 2, 0.5, 0.1)],
  prediction: ["Which derivative rule is integration by parts based on?", "The product rule."],
  misconception: ["Integration by parts is a random formula to memorize.", "It comes from rearranging the product rule and accumulating both sides."],
  tokens: ["uv", "u-dv", "v-du", "integral-u-dv", "uv-minus-integral-v-du"],
  formula: () => "integral u dv = uv - integral v du",
  liveValues: ({ u, v, du, dv }) => [value("u", "u", u), value("v", "v", v), value("du", "du", du), value("dv", "dv", dv), value("u-dv", "u dv strip", formatNumber(u * dv)), value("v-du", "v du strip", formatNumber(v * du)), value("product-change", "product change", formatNumber(u * dv + v * du)), value("uv", "product rectangle", formatNumber(u * v))],
  invariant: () => "In first-order view, d(uv)=u dv + v du, so accumulating a rearranged strip gives integration by parts.",
  renderVisual: IntegrationByPartsVisual,
});

export const derivativeOfSinePhaseFifteenConfig = makeConfig({
  steps: ["Choose angle x", "Read sin x", "Draw tangent to sine curve", "Compare slope with cos x", "Move x and track both", "Conclude derivative of sin x is cos x"],
  parameters: [param("x", "Angle x", -3.14, 6.28, 0, 0.05)],
  prediction: ["At x = 0, what is the slope of sin x?", "1, which equals cos 0."],
  misconception: ["The derivative of sin x is sin x.", "The slope of the sine curve follows the cosine curve."],
  tokens: ["sin-x", "cos-x", "d-dx"],
  formula: ({ x }) => `d/dx(sin x)=cos x=${formatNumber(Math.cos(x))}`,
  liveValues: ({ x }) => [value("x-radians", "x radians", formatNumber(x)), value("x-degrees", "x degrees", formatNumber((x * 180) / Math.PI)), value("sin-x", "sin x", formatNumber(Math.sin(x))), value("cos-x", "cos x", formatNumber(Math.cos(x))), value("finite-difference-slope", "finite-difference slope", formatNumber((Math.sin(x + 0.001) - Math.sin(x)) / 0.001)), value("tangent-slope", "tangent slope", formatNumber(Math.cos(x))), value("slope-error", "slope error", "0")],
  invariant: () => "The slope of the sine graph at x equals the unit-circle horizontal coordinate cos x.",
  renderVisual: DerivativeOfSineVisual,
});

export const derivativeOfExponentialPhaseFifteenConfig = makeConfig({
  steps: ["Draw y=e^x", "Pick x=a", "Read height e^a", "Draw tangent", "Compare slope and height", "Conclude derivative equals e^x"],
  parameters: [param("a", "Input a", -2.4, 1.7, 0.8, 0.1)],
  prediction: ["What is special about e^x compared with most functions?", "Its rate of change equals its current value."],
  misconception: ["The derivative of e^x is x e^(x-1) by the power rule.", "The power rule applies to x^n, not e^x. The variable is in the exponent here."],
  tokens: ["exp-x", "derivative-exp-x", "height-equals-slope"],
  formula: ({ a }) => `d/dx(e^x)=e^x=${formatNumber(Math.exp(a))}`,
  liveValues: ({ a }) => [value("a", "a", a), value("exp-a", "e^a", formatNumber(Math.exp(a))), value("finite-difference-slope", "finite-difference slope", formatNumber((Math.exp(a + 0.001) - Math.exp(a)) / 0.001)), value("tangent-slope", "tangent slope", formatNumber(Math.exp(a))), value("y-value", "y-value", formatNumber(Math.exp(a))), value("slope-y-difference", "slope-y difference", "0")],
  invariant: () => "For e^x, the tangent slope equals the current graph height.",
  renderVisual: DerivativeOfExponentialVisual,
});

export const taylorSeriesPhaseFifteenConfig = makeConfig({
  steps: ["Choose function and center", "Start with constant approximation", "Add tangent term", "Add curvature terms", "Increase degree", "Compare approximation error"],
  parameters: [param("a", "Center a", -2.4, 2.4, 0, 0.1), param("n", "Degree n", 0, 7, 3, 1), param("x", "Test point x", -3, 4.5, 1.2, 0.1)],
  prediction: ["What happens near the center as we add more Taylor terms?", "The approximation usually becomes more accurate near the center."],
  misconception: ["A Taylor polynomial is equally accurate everywhere.", "Taylor approximation is strongest near its center and may worsen farther away."],
  tokens: ["f-a", "linear-term", "higher-terms", "degree-n", "approximation-error"],
  formula: ({ a, n }) => `f(x) ~= f(a)+f'(a)(x-a)+... through degree n=${Math.round(n)} at a=${formatNumber(a)}`,
  liveValues: ({ a, n, x }) => {
    const degree = Math.round(n);
    const approx = taylorPolynomial("sin", a, degree, x);
    const actual = Math.sin(x);
    return [value("function", "function", "sin x"), value("a", "center a", a), value("degree-n", "degree", degree), value("x", "test x", x), value("true-f-x", "true f(x)", formatNumber(actual)), value("approximation", "approximation value", formatNumber(approx)), value("approximation-error", "error", formatNumber(Math.abs(actual - approx))), { id: "insight", label: "insight", value: "higher degree improves local approximation" }];
  },
  invariant: () => "Matching more derivatives at the center improves local accuracy near the center.",
  renderVisual: TaylorSeriesApproximationVisual,
});

export const optimizationPhaseFifteenConfig = makeConfig({
  steps: ["Draw function graph", "Move along the curve", "Track tangent slope", "Find where slope is zero", "Check sign change", "Classify maximum or minimum"],
  parameters: [param("x", "Point x", -2.4, 2.4, -0.7, 0.1)],
  prediction: ["What does f'(x)=0 usually mean on the graph?", "The tangent is horizontal; it may be a max, min, or neither."],
  misconception: ["Every point where f'(x)=0 is automatically a maximum or minimum.", "A zero derivative marks a critical point, but classification depends on sign change or second derivative."],
  tokens: ["f-prime-positive", "f-prime-negative", "f-prime-zero", "max", "min"],
  formula: ({ x }) => `critical check: f'(x)=x^3-x=${formatNumber(x ** 3 - x)}`,
  liveValues: ({ x }) => [value("x", "x", x), value("f-x", "f(x)", formatNumber(x ** 4 / 4 - x * x / 2 + 2)), value("f-prime-x", "f'(x)", formatNumber(x ** 3 - x)), value("derivative-sign", "derivative sign", x ** 3 - x > 0 ? "positive" : x ** 3 - x < 0 ? "negative" : "zero"), value("critical-status", "critical point status", Math.abs(x ** 3 - x) < 0.08 ? "near critical" : "not critical"), value("classification", "classification", classifyPoint(x)), { id: "insight", label: "insight", value: "sign change classifies extrema" }],
  invariant: () => "A horizontal tangent is only a candidate; derivative sign change classifies max or min.",
  renderVisual: OptimizationDerivativeVisual,
});

export const phaseFifteenRouteSlugs = [
  ["calculus", "mean-value-theorem"],
  ["calculus", "fundamental-theorem-of-calculus"],
  ["calculus", "integration-by-parts-visual-proof"],
  ["calculus", "derivative-of-sine"],
  ["calculus", "derivative-of-exponential"],
  ["calculus", "taylor-series-approximation"],
  ["calculus", "optimization-derivative-max-min"],
] as const;

export const allCalculusPhaseRouteSlugs = [
  ["calculus", "limit-approaches-point"],
  ["calculus", "derivative-slope-of-tangent"],
  ["calculus", "secant-becomes-tangent"],
  ["calculus", "derivative-power-rule"],
  ["calculus", "product-rule-visual-proof"],
  ["calculus", "chain-rule-visual-proof"],
  ["calculus", "mean-value-theorem"],
  ["calculus", "riemann-sums-area-under-curve"],
  ["calculus", "definite-integral-accumulated-area"],
  ["calculus", "fundamental-theorem-of-calculus"],
  ["calculus", "integration-by-parts-visual-proof"],
  ["calculus", "derivative-of-sine"],
  ["calculus", "derivative-of-exponential"],
  ["calculus", "taylor-series-approximation"],
  ["calculus", "optimization-derivative-max-min"],
] as const;

export const phaseFifteenConfigs = [
  meanValueTheoremPhaseFifteenConfig,
  fundamentalTheoremPhaseFifteenConfig,
  integrationByPartsPhaseFifteenConfig,
  derivativeOfSinePhaseFifteenConfig,
  derivativeOfExponentialPhaseFifteenConfig,
  taylorSeriesPhaseFifteenConfig,
  optimizationPhaseFifteenConfig,
];

type ConfigInput = {
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

function makeConfig(input: ConfigInput): PhaseTwoProofConfig {
  return {
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: calculusRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: "calculus-phase-fifteen-invariant", label: "graph-limit invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Graphs are browser-only schematic teaching models.", "Slider values are clamped to visible classroom ranges.", "Rounded numeric values support intuition; exact proof logic is in the formula panel."],
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
  return { id: `p15-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "graph limit" : "conclusion" };
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the visual slope, area, or approximation behavior before applying the symbolic rule.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use the memorized formula only.", feedback: "The formula is justified by the graph-limit picture." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the connected graph feature.", options: [{ id: "visual", label: "Use the graph-limit model.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Ignore the visual evidence.", feedback: "The symbolic statement needs the visual rate, area, or approximation meaning." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "f-prime-c": "f'(c)",
    "f-b-minus-f-a": "f(b)-f(a)",
    "b-minus-a": "b-a",
    "secant-slope": "[f(b)-f(a)]/(b-a)",
    c: "c",
    "A-x": "A(x)",
    "integral-a-x": "integral_a^x",
    "f-x": "f(x)",
    "A-prime-x": "A'(x)",
    "F-b-minus-F-a": "F(b)-F(a)",
    uv: "uv",
    "u-dv": "u dv",
    "v-du": "v du",
    "integral-u-dv": "integral u dv",
    "uv-minus-integral-v-du": "uv - integral v du",
    "sin-x": "sin x",
    "cos-x": "cos x",
    "d-dx": "d/dx",
    "exp-x": "e^x",
    "derivative-exp-x": "derivative e^x",
    "height-equals-slope": "height = slope",
    "f-a": "f(a)",
    "linear-term": "f'(a)(x-a)",
    "higher-terms": "higher-order terms",
    "degree-n": "degree n",
    "approximation-error": "error",
    "f-prime-positive": "f'(x)>0",
    "f-prime-negative": "f'(x)<0",
    "f-prime-zero": "f'(x)=0",
    max: "max",
    min: "min",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("prime") || token.includes("slope")) return "tangent/secant slope";
  if (token.includes("integral") || token.includes("A-") || token.includes("F-")) return "accumulated area";
  if (token.includes("dv") || token.includes("du") || token === "uv") return "product-rule strip";
  if (token.includes("sin") || token.includes("cos")) return "unit circle and sine graph";
  if (token.includes("exp") || token.includes("height")) return "exponential graph height and tangent";
  if (token.includes("term") || token.includes("degree") || token.includes("error")) return "Taylor approximation curve";
  if (token.includes("max") || token.includes("min") || token.includes("positive") || token.includes("negative")) return "optimization sign guide";
  return "graph feature";
}

function mvtFunction(x: number) {
  return 0.18 * x ** 3 - 0.9 * x + 2.6;
}

function mvtDerivative(x: number) {
  return 0.54 * x * x - 0.9;
}

function mvtSecant(a: number, b: number) {
  return (mvtFunction(b) - mvtFunction(a)) / (b - a);
}

function ftcFunction(x: number) {
  return Math.sin(x) + 0.5 * x + 1;
}

function integrate(fn: (x: number) => number, a: number, b: number, samples: number) {
  const dx = (b - a) / samples;
  return Array.from({ length: samples }, (_, index) => fn(a + (index + 0.5) * dx) * dx).reduce((sum, item) => sum + item, 0);
}

function classifyPoint(x: number) {
  if (Math.abs(x + 1) < 0.12) return "local max";
  if (Math.abs(x - 1) < 0.12) return "local min";
  if (Math.abs(x) < 0.12) return "flat but not extremum";
  return x ** 3 - x > 0 ? "increasing" : "decreasing";
}
