import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  AmGmInequalityVisual,
  CauchySchwarzVisual,
  CompoundIntervalsVisual,
  InequalityNumberLineVisual,
  LinearInequalityRegionsVisual,
  QuadraticInequalityVisual,
  SolvingLinearInequalityVisual,
  TriangleInequalityVisual,
} from "./PhaseTwentyFourInequalityVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const inequalitiesRoute = "/olympyard/practice/inequalities-foundations";

export const inequalityNumberLinePhaseTwentyFourConfig = makeConfig({
  modelKey: "number-line-boundary-open-closed-region",
  steps: ["Choose boundary a", "Choose inequality operator", "Mark boundary", "Decide open or closed circle", "Shade the correct direction", "Conclude solution set"],
  parameters: [param("boundary", "boundary a", -5, 5, 1.5, 0.25), param("operator", "operator 0=< 1=<= 2=> 3=>=", 0, 3, 0, 1), param("testX", "test value x", -6, 6, -1, 0.25)],
  prediction: ["What does a closed circle mean on a number line?", "The boundary value is included."],
  misconception: ["x < a and x <= a have the same graph.", "They shade the same direction, but <= includes the boundary while < does not."],
  tokens: ["x", "operator", "a", "open-closed-circle"],
  formula: ({ boundary, operator }) => `x ${op(operator)} a means x ${op(operator)} ${fmt(boundary)} and interval ${intervalForRay(boundary, op(operator))}`,
  liveValues: ({ boundary, operator, testX }) => [value("boundary-a", "boundary a", fmt(boundary)), value("operator", "operator", op(operator)), value("test-value-x", "test value x", fmt(testX)), value("truth-status", "truth status", compare(testX, boundary, op(operator)) ? "satisfies" : "does not satisfy"), value("interval-notation", "interval notation", intervalForRay(boundary, op(operator))), value("solution-region-invariant", "invariant", "solution region contains exactly values satisfying the inequality")],
  invariant: () => "The shaded ray contains exactly the values that make the inequality true.",
  renderVisual: InequalityNumberLineVisual,
});

export const solvingLinearInequalitiesPhaseTwentyFourConfig = makeConfig({
  modelKey: "linear-inequality-sign-flip-solver",
  steps: ["Start with linear inequality", "Move constant term", "Divide by coefficient", "Check if coefficient is negative", "Flip sign if needed", "Graph solution interval"],
  parameters: [param("a", "coefficient a", -5, 5, -2, 0.5), param("b", "constant b", -6, 6, 3, 0.5), param("c", "right side c", -6, 6, -1, 0.5), param("operator", "operator 0=< 1=<= 2=> 3=>=", 0, 3, 0, 1), param("testX", "test value x", -6, 6, 1, 0.25)],
  prediction: ["When do we reverse the inequality sign?", "When multiplying or dividing both sides by a negative number."],
  misconception: ["The inequality sign never changes during solving.", "It reverses when both sides are multiplied or divided by a negative."],
  tokens: ["ax-plus-b", "c", "negative-division", "final-interval"],
  formula: ({ a, b, c, operator }) => {
    const boundary = (c - b) / a;
    const finalOp = a < 0 ? flip(op(operator)) : op(operator);
    return `${fmt(a)}x + ${fmt(b)} ${op(operator)} ${fmt(c)} -> x ${finalOp} ${fmt(boundary)}${a < 0 ? " after negative division flips the sign" : ""}`;
  },
  liveValues: ({ a, b, c, operator, testX }) => {
    const boundary = (c - b) / a;
    const finalOp = a < 0 ? flip(op(operator)) : op(operator);
    return [value("a", "a", fmt(a)), value("b", "b", fmt(b)), value("c", "c", fmt(c)), value("operator", "operator", op(operator)), value("isolated-boundary", "isolated boundary", fmt(boundary)), value("sign-flip-status", "sign-flip status", a < 0 ? "flip required" : "no flip"), value("interval-solution", "interval solution", intervalForRay(boundary, finalOp)), value("test-value-check", "test value check", compare(testX, boundary, finalOp) ? "true" : "false")];
  },
  invariant: () => "Equivalent operations preserve the solution set; negative multiplication or division reverses order.",
  renderVisual: SolvingLinearInequalityVisual,
});

export const compoundInequalitiesPhaseTwentyFourConfig = makeConfig({
  modelKey: "compound-interval-union-intersection",
  steps: ["Draw first inequality", "Draw second inequality", "Choose AND or OR", "Combine regions", "Write interval notation", "Conclude compound inequality rule"],
  parameters: [param("left", "boundary a", -5, 4, -2, 0.25), param("right", "boundary b", -4, 5, 2, 0.25), param("connector", "connector 0=AND 1=OR", 0, 1, 0, 1), param("leftInclusive", "left endpoint closed", 0, 1, 0, 1), param("rightInclusive", "right endpoint closed", 0, 1, 1, 1), param("testX", "test value x", -6, 6, 0, 0.25)],
  prediction: ["For AND, do we take the overlap or everything from both regions?", "The overlap."],
  misconception: ["AND and OR shade the same combined region.", "AND means values satisfying both inequalities; OR means values satisfying at least one."],
  tokens: ["and", "or", "endpoints", "interval-notation"],
  formula: ({ left, right, connector, leftInclusive, rightInclusive }) => `compound result = ${compoundInterval(Math.min(left, right), Math.max(left, right), connectorName(connector), leftInclusive >= 0.5, rightInclusive >= 0.5)}`,
  liveValues: ({ left, right, connector, leftInclusive, rightInclusive, testX }) => [value("boundary-a", "boundary a", fmt(Math.min(left, right))), value("boundary-b", "boundary b", fmt(Math.max(left, right))), value("connector", "connector", connectorName(connector)), value("endpoint-inclusion", "endpoint inclusion", `${leftInclusive >= 0.5 ? "closed" : "open"} / ${rightInclusive >= 0.5 ? "closed" : "open"}`), value("resulting-interval-union", "resulting interval/union", compoundInterval(Math.min(left, right), Math.max(left, right), connectorName(connector), leftInclusive >= 0.5, rightInclusive >= 0.5)), value("test-value-status", "test value status", compoundTruth(testX, left, right, connector, leftInclusive, rightInclusive) ? "inside" : "outside")],
  invariant: () => "AND keeps common values; OR keeps values in either region.",
  renderVisual: CompoundIntervalsVisual,
});

export const quadraticInequalitiesPhaseTwentyFourConfig = makeConfig({
  modelKey: "quadratic-sign-chart-graph-regions",
  steps: ["Draw quadratic graph", "Locate roots", "Split number line into intervals", "Test graph sign", "Shade solution regions", "Conclude inequality solution"],
  parameters: [param("a", "quadratic a", -2, 2, 0.6, 0.1), param("b", "quadratic b", -4, 4, -0.8, 0.25), param("c", "quadratic c", -4, 4, -2, 0.25), param("mode", "mode 0=f(x)>0 1=f(x)<0", 0, 1, 0, 1), param("testX", "test x", -5, 5, 2.5, 0.25)],
  prediction: ["For f(x)>0, do we choose where the graph is above or below the x-axis?", "Above the x-axis."],
  misconception: ["The solution of a quadratic inequality is always between the roots.", "It depends on whether the parabola opens up/down and whether we need positive or negative values."],
  tokens: ["f-positive", "f-negative", "roots", "solution-interval"],
  formula: ({ a, b, c, mode }) => `f(x)=${fmt(a)}x^2+${fmt(b)}x+${fmt(c)}; solve f(x) ${Math.round(mode) === 0 ? ">0" : "<0"} using roots ${rootText(a, b, c)}`,
  liveValues: ({ a, b, c, mode }) => [value("a", "a", fmt(a)), value("b", "b", fmt(b)), value("c", "c", fmt(c)), value("discriminant", "discriminant", fmt(b * b - 4 * a * c)), value("roots", "roots", rootText(a, b, c)), value("selected-inequality", "selected inequality", Math.round(mode) === 0 ? "f(x)>0" : "f(x)<0"), value("sign-intervals", "sign intervals", signIntervalText(a, b, c)), value("solution-intervals", "solution intervals", quadraticSolutionText(a, b, c, Math.round(mode) === 0 ? ">0" : "<0"))],
  invariant: () => "The sign of f(x) matches whether the graph is above or below the x-axis.",
  renderVisual: QuadraticInequalityVisual,
});

export const amGmInequalityPhaseTwentyFourConfig = makeConfig({
  modelKey: "am-gm-area-rearrangement-comparison",
  steps: ["Choose nonnegative a and b", "Build arithmetic mean", "Build geometric mean", "Compare lengths", "Check equality case", "Conclude AM >= GM"],
  parameters: [param("a", "length a", 0, 6, 4, 0.25), param("b", "length b", 0, 6, 1.5, 0.25)],
  prediction: ["When does equality hold in AM-GM?", "When a = b."],
  misconception: ["Geometric mean can be larger than arithmetic mean for positive numbers.", "For nonnegative values, arithmetic mean is always at least geometric mean."],
  tokens: ["arithmetic-mean", "geometric-mean", "greater-equal", "equality-case"],
  formula: ({ a, b }) => `(a+b)/2 = ${fmt((a + b) / 2)} >= sqrt(ab) = ${fmt(Math.sqrt(Math.max(0, a * b)))}`,
  liveValues: ({ a, b }) => [value("a", "a", fmt(a)), value("b", "b", fmt(b)), value("arithmetic-mean", "arithmetic mean", fmt((a + b) / 2)), value("geometric-mean", "geometric mean", fmt(Math.sqrt(Math.max(0, a * b)))), value("difference-am-gm", "difference AM-GM", fmt((a + b) / 2 - Math.sqrt(Math.max(0, a * b)))), value("equality-status", "equality status", Math.abs(a - b) < 0.05 ? "a=b" : "not equal")],
  invariant: () => "For nonnegative a and b, the arithmetic mean is at least the geometric mean.",
  renderVisual: AmGmInequalityVisual,
});

export const triangleInequalityPhaseTwentyFourConfig = makeConfig({
  modelKey: "triangle-broken-path-shortest-direct-side",
  steps: ["Draw two connected sides", "Draw direct segment", "Compare broken path with straight path", "Move angle toward straight line", "Observe equality limit", "Conclude triangle inequality"],
  parameters: [param("sideA", "side a", 1, 4, 2.7, 0.25), param("sideB", "side b", 1, 4, 2.1, 0.25), param("angle", "included angle", 20, 179, 72, 1)],
  prediction: ["What is the shortest path between two points?", "The straight segment."],
  misconception: ["A triangle can have one side longer than the sum of the other two.", "If one side is at least the sum of the other two, the sides cannot close into a triangle."],
  tokens: ["side-a", "side-b", "side-c", "a-plus-b-greater-c"],
  formula: ({ sideA, sideB, angle }) => `a+b=${fmt(sideA + sideB)} > c=${fmt(thirdSide(sideA, sideB, angle))} for a nondegenerate triangle`,
  liveValues: ({ sideA, sideB, angle }) => [value("a", "a", fmt(sideA)), value("b", "b", fmt(sideB)), value("included-angle", "included angle", `${fmt(angle)} deg`), value("c", "c", fmt(thirdSide(sideA, sideB, angle))), value("a-plus-b", "a+b", fmt(sideA + sideB)), value("difference-a-plus-b-minus-c", "a+b-c", fmt(sideA + sideB - thirdSide(sideA, sideB, angle))), value("triangle-valid-status", "triangle valid status", angle >= 179 ? "degenerate equality limit" : "valid")],
  invariant: () => "Any two sides of a nondegenerate triangle exceed the third side.",
  renderVisual: TriangleInequalityVisual,
});

export const cauchySchwarzPhaseTwentyFourConfig = makeConfig({
  modelKey: "cauchy-schwarz-dot-product-projection-bound",
  steps: ["Draw u and v", "Measure angle", "Write dot product formula", "Bound cos theta", "Compare |u dot v| to |u||v|", "Conclude Cauchy-Schwarz"],
  parameters: [param("ux", "u x", -5, 5, 3, 0.25), param("uy", "u y", -5, 5, 2, 0.25), param("vx", "v x", -5, 5, 3.5, 0.25), param("vy", "v y", -5, 5, -1, 0.25)],
  prediction: ["When does equality hold in Cauchy-Schwarz?", "When the vectors point in the same or opposite direction."],
  misconception: ["The dot product can be larger than the product of magnitudes.", "The dot product includes cos theta, whose absolute value is at most 1."],
  tokens: ["u-dot-v", "u-magnitude", "v-magnitude", "cos-theta", "bound"],
  formula: ({ ux, uy, vx, vy }) => `|u dot v| = ${fmt(Math.abs(dot(ux, uy, vx, vy)))} <= |u||v| = ${fmt(Math.hypot(ux, uy) * Math.hypot(vx, vy))} because |cos theta| <= 1`,
  liveValues: ({ ux, uy, vx, vy }) => {
    const dotValue = dot(ux, uy, vx, vy);
    const product = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    return [value("u", "u", `(${fmt(ux)}, ${fmt(uy)})`), value("v", "v", `(${fmt(vx)}, ${fmt(vy)})`), value("angle-theta", "angle theta", `${fmt(angleBetween(ux, uy, vx, vy))} deg`), value("cos-theta", "cos theta", fmt(product ? dotValue / product : 0)), value("dot-product", "dot product", fmt(dotValue)), value("magnitude-product", "|u||v|", fmt(product)), value("cauchy-ratio", "|u dot v|/(|u||v|)", fmt(product ? Math.abs(dotValue) / product : 0))];
  },
  invariant: () => "The absolute dot product never exceeds the product of vector magnitudes.",
  renderVisual: CauchySchwarzVisual,
});

export const linearInequalityRegionsPhaseTwentyFourConfig = makeConfig({
  modelKey: "linear-half-plane-boundary-test-point",
  steps: ["Draw boundary equation", "Choose inequality operator", "Decide solid or dashed boundary", "Test a point", "Shade satisfying side", "Conclude half-plane solution"],
  parameters: [param("a", "coefficient a", -4, 4, 1.5, 0.25), param("b", "coefficient b", -4, 4, 2, 0.25), param("c", "threshold c", -6, 6, 2, 0.25), param("operator", "operator 0=< 1=<= 2=> 3=>=", 0, 3, 1, 1), param("testX", "test point x", -5, 5, 1, 0.25), param("testY", "test point y", -5, 5, 0, 0.25)],
  prediction: ["What does a dashed boundary line mean?", "The boundary is not included."],
  misconception: ["The shaded side is always above the line.", "The side depends on the inequality and line coefficients; a test point determines it."],
  tokens: ["ax-plus-by", "c", "operator", "test-point"],
  formula: ({ a, b, c, operator }) => `${fmt(a)}x + ${fmt(b)}y ${op(operator)} ${fmt(c)} shades one side of ${fmt(a)}x + ${fmt(b)}y = ${fmt(c)}`,
  liveValues: ({ a, b, c, operator, testX, testY }) => [value("a", "a", fmt(a)), value("b", "b", fmt(b)), value("c", "c", fmt(c)), value("operator", "operator", op(operator)), value("test-point", "test point", `(${fmt(testX)}, ${fmt(testY)})`), value("expression-value", "expression value", fmt(a * testX + b * testY)), value("truth-status", "truth status", compare(a * testX + b * testY, c, op(operator)) ? "satisfies" : "does not satisfy"), value("boundary-style", "boundary style", op(operator).includes("=") ? "solid" : "dashed"), value("shaded-side", "shaded side", compare(0, c, op(operator)) ? "includes origin side" : "opposite origin side")],
  invariant: () => "Every shaded point satisfies the linear inequality.",
  renderVisual: LinearInequalityRegionsVisual,
});

export const phaseTwentyFourRouteSlugs = [
  ["inequalities", "inequality-number-line"],
  ["inequalities", "solving-linear-inequalities"],
  ["inequalities", "compound-inequalities-intervals"],
  ["inequalities", "quadratic-inequalities-graph-regions"],
  ["inequalities", "am-gm-inequality"],
  ["inequalities", "triangle-inequality"],
  ["inequalities", "cauchy-schwarz-dot-product-bound"],
  ["inequalities", "linear-inequality-regions"],
] as const;

export const phaseTwentyFourConfigs = [
  inequalityNumberLinePhaseTwentyFourConfig,
  solvingLinearInequalitiesPhaseTwentyFourConfig,
  compoundInequalitiesPhaseTwentyFourConfig,
  quadraticInequalitiesPhaseTwentyFourConfig,
  amGmInequalityPhaseTwentyFourConfig,
  triangleInequalityPhaseTwentyFourConfig,
  cauchySchwarzPhaseTwentyFourConfig,
  linearInequalityRegionsPhaseTwentyFourConfig,
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

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentyFourModelKey: string } {
  return {
    phaseTwentyFourModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: inequalitiesRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `inequalities-${input.modelKey}-invariant`, label: "inequality invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG inequality model.", "Labels are compact and values are bounded for mobile resilience.", "Use the parameter panel for keyboard-accessible fallback controls."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p24-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "inequality visual" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the shaded region, boundary, or comparison model before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "formula-only", label: "Ignore the visual and memorize the symbol.", feedback: "The visual shows what the inequality symbol means." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the boundary, interval, sign flip, graph region, equality case, projection, or test point.", options: [{ id: "visual-reasoning", label: "Use the comparison visual.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Treat the symbol as decoration.", feedback: "The symbol controls inclusion, direction, and region choice." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    x: "x", operator: "operator", a: "a", "open-closed-circle": "open/closed circle",
    "ax-plus-b": "ax + b", c: "c", "negative-division": "negative division", "final-interval": "final interval",
    and: "AND", or: "OR", endpoints: "endpoints", "interval-notation": "interval notation",
    "f-positive": "f(x)>0", "f-negative": "f(x)<0", roots: "roots", "solution-interval": "solution interval",
    "arithmetic-mean": "(a+b)/2", "geometric-mean": "sqrt(ab)", "greater-equal": ">=", "equality-case": "a=b",
    "side-a": "a", "side-b": "b", "side-c": "c", "a-plus-b-greater-c": "a+b>c",
    "u-dot-v": "u dot v", "u-magnitude": "|u|", "v-magnitude": "|v|", "cos-theta": "cos theta", bound: "<= bound",
    "ax-plus-by": "ax + by", "test-point": "test point",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}
function tokenVisualLabel(token: string) {
  if (["x", "operator", "a", "open-closed-circle"].includes(token)) return "number-line boundary and shaded ray";
  if (["ax-plus-b", "c", "negative-division", "final-interval"].includes(token)) return "linear inequality solving and final number line";
  if (["and", "or", "endpoints", "interval-notation"].includes(token)) return "compound interval union/intersection";
  if (["f-positive", "f-negative", "roots", "solution-interval"].includes(token)) return "quadratic graph sign regions";
  if (["arithmetic-mean", "geometric-mean", "greater-equal", "equality-case"].includes(token)) return "AM-GM length and area comparison";
  if (["side-a", "side-b", "side-c", "a-plus-b-greater-c"].includes(token)) return "triangle broken path and direct side";
  if (["u-dot-v", "u-magnitude", "v-magnitude", "cos-theta", "bound"].includes(token)) return "vector projection and dot product bound";
  if (["ax-plus-by", "c", "operator", "test-point"].includes(token)) return "half-plane boundary and test point";
  return "inequality visual feature";
}
function op(value: number) {
  const selected = Math.round(value);
  if (selected === 0) return "<";
  if (selected === 1) return "<=";
  if (selected === 2) return ">";
  return ">=";
}
function flip(operator: string) {
  if (operator === "<") return ">";
  if (operator === "<=") return ">=";
  if (operator === ">") return "<";
  return "<=";
}
function compare(left: number, right: number, operator: string) {
  if (operator === "<") return left < right;
  if (operator === "<=") return left <= right;
  if (operator === ">") return left > right;
  return left >= right;
}
function intervalForRay(boundary: number, operator: string) {
  if (operator === "<") return `(-inf, ${fmt(boundary)})`;
  if (operator === "<=") return `(-inf, ${fmt(boundary)}]`;
  if (operator === ">") return `(${fmt(boundary)}, inf)`;
  return `[${fmt(boundary)}, inf)`;
}
function connectorName(value: number) { return Math.round(value) === 0 ? "AND" : "OR"; }
function compoundTruth(testX: number, leftRaw: number, rightRaw: number, connector: number, leftInclusive: number, rightInclusive: number) {
  const left = Math.min(leftRaw, rightRaw);
  const right = Math.max(leftRaw, rightRaw);
  const leftOk = leftInclusive >= 0.5 ? testX >= left : testX > left;
  const rightOk = rightInclusive >= 0.5 ? testX <= right : testX < right;
  const outsideLeft = leftInclusive >= 0.5 ? testX <= left : testX < left;
  const outsideRight = rightInclusive >= 0.5 ? testX >= right : testX > right;
  return connectorName(connector) === "AND" ? leftOk && rightOk : outsideLeft || outsideRight;
}
function compoundInterval(left: number, right: number, connector: string, leftInclusive: boolean, rightInclusive: boolean) {
  if (connector === "AND") return `${leftInclusive ? "[" : "("}${fmt(left)}, ${fmt(right)}${rightInclusive ? "]" : ")"}`;
  return `(-inf, ${fmt(left)}${leftInclusive ? "]" : ")"} U ${rightInclusive ? "[" : "("}${fmt(right)}, inf)`;
}
function roots(a: number, b: number, c: number) {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  const rd = Math.sqrt(d);
  return [(-b - rd) / (2 * a), (-b + rd) / (2 * a)].sort((x, y) => x - y);
}
function rootText(a: number, b: number, c: number) {
  const items = roots(a, b, c);
  return items.length ? items.map(fmt).join(", ") : "no real roots";
}
function signIntervalText(a: number, b: number, c: number) {
  const items = roots(a, b, c);
  if (!items.length) return a > 0 ? "positive everywhere" : "negative everywhere";
  return `${a > 0 ? "positive" : "negative"} outside roots, ${a > 0 ? "negative" : "positive"} between roots`;
}
function quadraticSolutionText(a: number, b: number, c: number, mode: string) {
  const items = roots(a, b, c);
  if (!items.length) return (mode === ">0") === (a > 0) ? "all real" : "no real x";
  const outside = mode === ">0" ? a > 0 : a < 0;
  return outside ? `(-inf, ${fmt(items[0])}) U (${fmt(items[1])}, inf)` : `(${fmt(items[0])}, ${fmt(items[1])})`;
}
function thirdSide(a: number, b: number, angle: number) { return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(angle * Math.PI / 180)); }
function dot(ux: number, uy: number, vx: number, vy: number) { return ux * vx + uy * vy; }
function angleBetween(ux: number, uy: number, vx: number, vy: number) {
  const product = Math.hypot(ux, uy) * Math.hypot(vx, vy);
  return product ? Math.acos(Math.min(1, Math.max(-1, dot(ux, uy, vx, vy) / product))) * 180 / Math.PI : 0;
}
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
