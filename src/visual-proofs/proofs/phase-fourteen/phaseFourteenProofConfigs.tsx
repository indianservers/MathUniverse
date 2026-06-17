import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import { definiteIntegralApprox, formatNumber } from "../../utils/calculusMath";
import {
  ChainRuleVisual,
  DefiniteIntegralAccumulatedAreaVisual,
  DerivativePowerRuleVisual,
  DerivativeSlopeOfTangentVisual,
  LimitApproachesPointVisual,
  ProductRuleVisual,
  RiemannSumsAreaVisual,
  SecantBecomesTangentVisual,
} from "./PhaseFourteenCalculusVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const holeToggle = { id: "hole", label: "Show removable hole", defaultValue: true };
const cornerToggle = { id: "corner", label: "Show tiny corner", defaultValue: true };
const calculusRoute = "/olympyard/practice/calculus-foundations";

export const limitApproachesPointPhaseFourteenConfig = makeConfig({
  steps: ["Graph f(x)", "Choose approach point a", "Move in from the left", "Move in from the right", "Compare y-values", "Name the limiting value L", "Separate limit from f(a)"],
  parameters: [param("a", "Approach point a", -2.5, 2.5, 1, 0.1), param("h", "Approach distance h", 0.05, 1.5, 0.8, 0.05)],
  toggles: [holeToggle],
  prediction: ["Can a limit exist even when the function has a hole at the target point?", "Yes, if the approaching y-values settle on the same L."],
  misconception: ["The limit always equals f(a).", "A limit is about nearby values; f(a) can be missing or different."],
  tokens: ["x-to-a", "f-x", "L", "lim"],
  formula: ({ a }) => `lim x->${formatNumber(a)} f(x) = ${formatNumber(a * a)}`,
  liveValues: ({ a, h }) => [value("a", "approach point a", a), value("h", "approach distance h", h), value("left-x", "left input a-h", formatNumber(a - h)), value("right-x", "right input a+h", formatNumber(a + h)), value("left-y", "f(a-h)", formatNumber((a - h) ** 2)), value("right-y", "f(a+h)", formatNumber((a + h) ** 2)), value("L", "target L", formatNumber(a * a)), value("gap", "two-sided gap", formatNumber(Math.abs((a + h) ** 2 - (a - h) ** 2)))],
  invariant: () => "Both one-sided traces must approach the same y-value for a two-sided limit.",
  renderVisual: LimitApproachesPointVisual,
});

export const derivativeSlopePhaseFourteenConfig = makeConfig({
  steps: ["Pick point A", "Add nearby point B", "Draw the secant", "Measure rise over h", "Shrink h", "See the secant become tangent", "Read f'(a) as slope"],
  parameters: [param("a", "Point a", -2.2, 2.2, 1, 0.1), param("h", "Horizontal change h", 0.05, 1.8, 0.9, 0.05)],
  prediction: ["As h shrinks toward 0, which line does the secant approach?", "The tangent line at point A."],
  misconception: ["A derivative is just one ordinary secant slope.", "A derivative is the limiting value of nearby secant slopes."],
  tokens: ["h", "rise", "over-h", "h-to-0", "derivative"],
  formula: ({ a, h }) => `f'(${formatNumber(a)}) = lim h->0 [(a+h)^2-a^2]/h; current secant = ${formatNumber(2 * a + h)}`,
  liveValues: ({ a, h }) => [value("a", "a", a), value("h", "h", h), value("rise", "rise", formatNumber((a + h) ** 2 - a ** 2)), value("secant", "secant slope", formatNumber(2 * a + h)), value("derivative", "tangent slope", formatNumber(2 * a)), value("slope-gap", "slope gap", formatNumber(Math.abs(h)))],
  invariant: () => "The secant slope tends to the tangent slope as h tends to 0.",
  renderVisual: DerivativeSlopeOfTangentVisual,
});

export const secantBecomesTangentPhaseFourteenConfig = makeConfig({
  steps: ["Start with a wide secant", "Mark delta x", "Mark delta y", "Compute average slope", "Reduce delta x", "Watch the limiting line", "Name instantaneous slope"],
  parameters: [param("x1", "Starting x1", -2.2, 2.2, -0.8, 0.1), param("dx", "Delta x", 0.05, 1.8, 1.1, 0.05)],
  prediction: ["Why does a tangent line belong to limits?", "It is the limiting position of secant lines through nearby points."],
  misconception: ["The tangent is unrelated to secants.", "The tangent is what secants approach as the second point moves in."],
  tokens: ["delta-x", "delta-y", "avg-slope", "instantaneous"],
  formula: ({ x1, dx }) => `average slope = [f(${formatNumber(x1 + dx)}) - f(${formatNumber(x1)})]/${formatNumber(dx)}`,
  liveValues: ({ x1, dx }) => {
    const f = (x: number) => 0.25 * x ** 3 - 1.1 * x + 2.8;
    const derivative = 0.75 * x1 * x1 - 1.1;
    return [value("x1", "x1", x1), value("delta-x", "delta x", dx), value("delta-y", "delta y", formatNumber(f(x1 + dx) - f(x1))), value("avg-slope", "average slope", formatNumber((f(x1 + dx) - f(x1)) / dx)), value("instantaneous", "instantaneous slope", formatNumber(derivative))];
  },
  invariant: () => "Average rate of change becomes instantaneous rate in the limiting view.",
  renderVisual: SecantBecomesTangentVisual,
});

export const derivativePowerRulePhaseFourteenConfig = makeConfig({
  steps: ["Choose a power n", "Graph y = x^n", "Build the difference quotient", "Find the first-order term", "Divide by h", "Let h vanish", "Conclude d/dx x^n = nx^(n-1)"],
  parameters: [param("n", "Power n", 2, 5, 3, 1), param("a", "Input a", 0.2, 2.2, 1.2, 0.1), param("h", "Small h", 0.04, 1.4, 0.5, 0.04)],
  prediction: ["For x^5, what coefficient appears in the derivative?", "5."],
  misconception: ["The derivative of x^n is x^(n-1).", "The exponent also becomes the coefficient, so the derivative is nx^(n-1)."],
  tokens: ["x-power", "n", "x-power-minus-1", "nx-power-minus-1"],
  formula: ({ n, a, h }) => `[(x+h)^${Math.round(n)} - x^${Math.round(n)}]/h -> ${Math.round(n)}x^${Math.round(n) - 1}; current slope ~= ${formatNumber(((a + h) ** Math.round(n) - a ** Math.round(n)) / h)}`,
  liveValues: ({ n, a, h }) => [value("n", "power n", Math.round(n)), value("a", "a", a), value("h", "h", h), value("secant", "finite quotient", formatNumber(((a + h) ** Math.round(n) - a ** Math.round(n)) / h)), value("nx-power-minus-1", "power-rule slope", formatNumber(Math.round(n) * a ** (Math.round(n) - 1)))],
  invariant: () => "After division by h, only the first-order h term survives the limit.",
  renderVisual: DerivativePowerRuleVisual,
});

export const productRulePhaseFourteenConfig = makeConfig({
  steps: ["Start with rectangle uv", "Increase width by du", "Increase height by dv", "Identify the v du strip", "Identify the u dv strip", "Shrink the tiny corner", "Conclude (uv)' = u'v + uv'"],
  parameters: [param("u", "u", 1, 6, 4, 0.2), param("v", "v", 1, 5, 3, 0.2), param("du", "du", 0.1, 2, 0.7, 0.1), param("dv", "dv", 0.1, 2, 0.5, 0.1)],
  toggles: [cornerToggle],
  prediction: ["Why does the du dv corner disappear in the derivative?", "It is second-order small compared with the two strips."],
  misconception: ["The product rule is only u'v'.", "Changing a product creates two first-order strips: u'v and uv'."],
  tokens: ["uv", "u-prime-v", "u-v-prime", "tiny-corner"],
  formula: ({ u, v, du, dv }) => `Delta(uv) = v du + u dv + du dv = ${formatNumber(v * du)} + ${formatNumber(u * dv)} + ${formatNumber(du * dv)}`,
  liveValues: ({ u, v, du, dv }) => [value("u", "u", u), value("v", "v", v), value("du", "du", du), value("dv", "dv", dv), value("uv", "base area uv", formatNumber(u * v)), value("u-prime-v", "v du strip", formatNumber(v * du)), value("u-v-prime", "u dv strip", formatNumber(u * dv)), value("tiny-corner", "du dv corner", formatNumber(du * dv))],
  invariant: () => "The total change decomposes into two first-order strips plus one second-order corner.",
  renderVisual: ProductRuleVisual,
});

export const chainRulePhaseFourteenConfig = makeConfig({
  steps: ["Send x into g", "Create the middle variable u", "Send u into f", "Track dx to du", "Track du to dy", "Multiply the two rates", "Conclude dy/dx = dy/du times du/dx"],
  parameters: [param("x", "Input x", -1.3, 2.3, 1.1, 0.1), param("dx", "Small dx", 0.02, 0.8, 0.25, 0.02)],
  prediction: ["For y = f(g(x)), why do the rates multiply?", "The output change passes through the middle variable u."],
  misconception: ["The derivative of a composite is the sum of the two derivatives.", "The linked rate is a product: dy/du times du/dx."],
  tokens: ["g-prime", "f-prime-g", "rate-product", "chain-derivative"],
  formula: ({ x }) => `For y=(x^2)^2, dy/dx = (2u)(2x) = ${formatNumber(4 * x ** 3)}`,
  liveValues: ({ x, dx }) => {
    const u = x * x;
    const du = (x + dx) ** 2 - x ** 2;
    return [value("x", "x", x), value("dx", "dx", dx), value("u", "u = x^2", formatNumber(u)), value("du", "du", formatNumber(du)), value("g-prime", "du/dx", formatNumber(2 * x)), value("f-prime-g", "dy/du", formatNumber(2 * u)), value("chain-derivative", "dy/dx", formatNumber(4 * x ** 3))];
  },
  invariant: () => "A composite changes through an inner rate and an outer rate evaluated at the inner output.",
  renderVisual: ChainRuleVisual,
});

export const riemannSumsPhaseFourteenConfig = makeConfig({
  steps: ["Choose an interval", "Split it into n pieces", "Choose sample heights", "Build rectangles", "Add rectangle areas", "Increase n", "Read the integral as the limiting sum"],
  parameters: [param("a", "Lower bound a", -2.5, 1.5, -1, 0.1), param("b", "Upper bound b", -0.5, 4, 3, 0.1), param("n", "Rectangles n", 2, 30, 8, 1), param("method", "Method 0 left 1 mid 2 right", 0, 2, 1, 1)],
  prediction: ["What happens to dx when n increases on the same interval?", "dx becomes smaller."],
  misconception: ["One rectangle gives the exact curved area.", "Riemann sums become reliable by taking many thin rectangles."],
  tokens: ["sigma", "height", "dx", "n-to-infinity"],
  formula: ({ a, b, n, method }) => `Delta x = (${formatNumber(b)} - ${formatNumber(a)})/${Math.round(n)} = ${formatNumber((b - a) / n)}; method = ${methodName(method)}`,
  liveValues: ({ a, b, n, method }) => {
    const safeN = Math.round(n);
    const dx = (b - a) / safeN;
    return [value("a", "a", a), value("b", "b", b), value("n", "n", safeN), value("method", "sample method", methodName(method)), value("dx", "delta x", formatNumber(dx)), value("sigma", "rectangle sum", formatNumber(riemannPositive(a, b, safeN, methodName(method))))];
  },
  invariant: () => "Rectangle width times sampled height approximates area; the limit removes sampling error.",
  renderVisual: RiemannSumsAreaVisual,
});

export const definiteIntegralPhaseFourteenConfig = makeConfig({
  steps: ["Fix the lower bound a", "Move the endpoint b", "Shade accumulated area", "Add positive slices", "Subtract negative slices", "Increase slices", "Read the definite integral"],
  parameters: [param("a", "Lower bound a", -2.5, 1.5, -1.5, 0.1), param("b", "Endpoint b", -0.5, 4, 2.5, 0.1), param("n", "Area slices n", 8, 48, 24, 1)],
  prediction: ["What should happen to accumulated area when the curve is below the x-axis?", "It subtracts from the signed total."],
  misconception: ["A definite integral always counts only positive area.", "A definite integral is signed area: below the axis contributes negatively."],
  tokens: ["integral", "a", "b", "f-x", "dx"],
  formula: ({ a, b }) => `integral from ${formatNumber(a)} to ${formatNumber(b)} of f(x) dx ~= ${formatNumber(definiteIntegralApprox("sinLinear", a, b, 260))}`,
  liveValues: ({ a, b, n }) => [value("a", "a", a), value("b", "b", b), value("n", "slices n", Math.round(n)), value("dx", "slice width", formatNumber((b - a) / Math.round(n))), value("integral", "signed accumulated area", formatNumber(definiteIntegralApprox("sinLinear", a, b, 260))), value("orientation", "orientation", b >= a ? "left to right" : "reversed")],
  invariant: () => "Positive and negative signed slices accumulate into one definite integral value.",
  renderVisual: DefiniteIntegralAccumulatedAreaVisual,
});

export const phaseFourteenRouteSlugs = [
  ["calculus", "limit-approaches-point"],
  ["calculus", "derivative-slope-of-tangent"],
  ["calculus", "secant-becomes-tangent"],
  ["calculus", "derivative-power-rule"],
  ["calculus", "product-rule-visual-proof"],
  ["calculus", "chain-rule-visual-proof"],
  ["calculus", "riemann-sums-area-under-curve"],
  ["calculus", "definite-integral-accumulated-area"],
] as const;

export const phaseFourteenLegacyCalculusRouteSlugs = [
  ["calculus", "mean-value-theorem"],
  ["calculus", "fundamental-theorem-of-calculus"],
  ["calculus", "integration-by-parts-visual-proof"],
  ["calculus", "derivative-of-sine"],
  ["calculus", "derivative-of-exponential"],
  ["calculus", "taylor-series-approximation"],
  ["calculus", "optimization-derivative-max-min"],
] as const;

export const phaseFourteenConfigs = [
  limitApproachesPointPhaseFourteenConfig,
  derivativeSlopePhaseFourteenConfig,
  secantBecomesTangentPhaseFourteenConfig,
  derivativePowerRulePhaseFourteenConfig,
  productRulePhaseFourteenConfig,
  chainRulePhaseFourteenConfig,
  riemannSumsPhaseFourteenConfig,
  definiteIntegralPhaseFourteenConfig,
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
    olympyardRoute: calculusRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: "calculus-limit-invariant", label: "calculus invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Graphs are schematic classroom models.", "Slider values are clamped to safe visible ranges.", "Approximation values are rounded; exact reasoning lives in the limit statement."],
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
  return { id: `p14-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "limit view" : "formula" };
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Check the graph behavior before using the symbolic rule.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use the memorized rule only.", feedback: "The rule must match the visible limiting behavior." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the related graph, strip, or area region.", options: [{ id: "visual", label: "Use the visual limit model.", correct: true, feedback: "Correct." }, { id: "shortcut", label: "Ignore the limiting picture.", feedback: "The symbolic shortcut is justified by the limiting picture." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "x-to-a": "x -> a",
    "f-x": "f(x)",
    L: "L",
    lim: "limit",
    h: "h",
    rise: "rise",
    "over-h": "/h",
    "h-to-0": "h -> 0",
    derivative: "f'(a)",
    "delta-x": "delta x",
    "delta-y": "delta y",
    "avg-slope": "average slope",
    instantaneous: "instantaneous slope",
    "x-power": "x^n",
    n: "n",
    "x-power-minus-1": "x^(n-1)",
    "nx-power-minus-1": "nx^(n-1)",
    uv: "uv",
    "u-prime-v": "u'v",
    "u-v-prime": "uv'",
    "tiny-corner": "du dv",
    "g-prime": "g'(x)",
    "f-prime-g": "f'(g(x))",
    "rate-product": "rate product",
    "chain-derivative": "chain derivative",
    sigma: "sum",
    height: "height",
    dx: "dx",
    "n-to-infinity": "n -> infinity",
    integral: "integral",
    a: "a",
    b: "b",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("slope") || token.includes("derivative") || token.includes("rise")) return "secant/tangent overlay";
  if (token.includes("integral") || token.includes("sigma") || token === "dx" || token === "height") return "area slices";
  if (token.includes("corner") || token.includes("prime") || token === "uv") return "rate rectangle";
  if (token.includes("chain") || token.includes("rate")) return "rate pipeline";
  return "graph feature";
}

function methodName(value: number) {
  if (value < 0.5) return "left";
  if (value < 1.5) return "midpoint";
  return "right";
}

function riemannPositive(a: number, b: number, n: number, method: string) {
  const dx = (b - a) / n;
  let total = 0;
  for (let index = 0; index < n; index += 1) {
    const x0 = a + index * dx;
    const sample = method === "right" ? x0 + dx : method === "midpoint" ? x0 + dx / 2 : x0;
    total += (0.2 * sample * sample + 1.2) * dx;
  }
  return total;
}
