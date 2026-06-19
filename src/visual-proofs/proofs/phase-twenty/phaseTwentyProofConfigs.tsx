import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  CrossProductAreaVisual,
  DotProductProjectionVisual,
  ScalarMultiplicationVisual,
  UnitVectorNormalizationVisual,
  VectorAdditionVisual,
  VectorDirectedSegmentVisual,
  VectorEquationLineVisual,
  VectorProjectionComponentVisual,
} from "./PhaseTwentyVectorVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const vectorRoute = "/olympyard/practice/vector-algebra-foundations";
const singleVectorParams = [param("x", "x component", -5, 5, 3, 0.1), param("y", "y component", -5, 5, 2, 0.1)];
const twoVectorParams = [
  param("ux", "u x", -5, 5, 3, 0.1),
  param("uy", "u y", -5, 5, 1.5, 0.1),
  param("vx", "v x", -5, 5, 1.2, 0.1),
  param("vy", "v y", -5, 5, 2.4, 0.1),
];

export const vectorDirectedSegmentPhaseTwentyConfig = makeConfig({
  modelKey: "component-magnitude-direction",
  steps: ["Draw coordinate axes", "Place vector endpoint", "Read x and y components", "Measure magnitude", "Measure direction", "Conclude vector meaning"],
  parameters: singleVectorParams,
  prediction: ["If x and y both change, what changes about the vector?", "Its components, magnitude, and direction may change."],
  misconception: ["A vector is just a point.", "A vector is a directed displacement; its endpoint represents components when drawn from the origin."],
  tokens: ["component-vector", "x-component", "y-component", "magnitude", "theta"],
  formula: ({ x, y }) => `v = <x,y> = <${fmt(x)}, ${fmt(y)}> and |v| = sqrt(x^2+y^2) = ${fmt(Math.hypot(x, y))}`,
  liveValues: ({ x, y }) => [value("x-component", "x", fmt(x)), value("y-component", "y", fmt(y)), value("magnitude", "magnitude", fmt(Math.hypot(x, y))), value("direction-angle", "direction angle", `${fmt(angleDeg({ x, y }))} deg`), value("quadrant", "quadrant", quadrant({ x, y })), value("invariant", "invariant", "vector is determined by magnitude and direction or components")],
  invariant: () => "A vector is determined by its components, equivalently by magnitude and direction.",
  renderVisual: VectorDirectedSegmentVisual,
});

export const vectorAdditionPhaseTwentyConfig = makeConfig({
  modelKey: "resultant-parallelogram",
  steps: ["Draw vector u", "Draw vector v", "Move v tip-to-tail", "Build parallelogram", "Draw resultant", "Conclude component addition"],
  parameters: [...twoVectorParams, param("mode", "Tip-to-tail view", 0, 1, 1, 1)],
  prediction: ["What does the diagonal of the parallelogram represent?", "The vector sum u + v."],
  misconception: ["Adding vectors means adding only their lengths.", "Vector addition combines components and direction, not just magnitudes."],
  tokens: ["u", "v", "u-plus-v", "component-sums", "parallelogram"],
  formula: ({ ux, uy, vx, vy }) => `u+v = <u1+v1,u2+v2> = <${fmt(ux)}+${fmt(vx)}, ${fmt(uy)}+${fmt(vy)}> = <${fmt(ux + vx)}, ${fmt(uy + vy)}>`,
  liveValues: ({ ux, uy, vx, vy }) => [value("u-components", "u components", `(${fmt(ux)}, ${fmt(uy)})`), value("v-components", "v components", `(${fmt(vx)}, ${fmt(vy)})`), value("resultant-components", "resultant components", `(${fmt(ux + vx)}, ${fmt(uy + vy)})`), value("resultant-magnitude", "resultant magnitude", fmt(Math.hypot(ux + vx, uy + vy))), value("invariant", "invariant", "tip-to-tail and parallelogram give same resultant")],
  invariant: () => "Tip-to-tail and parallelogram construction give the same vector sum.",
  renderVisual: VectorAdditionVisual,
});

export const scalarMultiplicationPhaseTwentyConfig = makeConfig({
  modelKey: "k-scaling",
  steps: ["Draw vector v", "Choose scalar k", "Multiply components", "Compare lengths", "Check sign of k", "Conclude scalar multiplication"],
  parameters: [...singleVectorParams, param("k", "scalar k", -3, 3, 1.5, 0.1)],
  prediction: ["What happens when k is negative?", "The vector reverses direction and is scaled by |k|."],
  misconception: ["Scalar multiplication rotates the vector.", "Scalar multiplication changes length and may reverse direction, but it does not rotate to a new unrelated angle."],
  tokens: ["k", "v", "kv", "scaled-components", "length-scale"],
  formula: ({ x, y, k }) => `kv = <kx,ky> = <${fmt(k)}(${fmt(x)}), ${fmt(k)}(${fmt(y)})> = <${fmt(k * x)}, ${fmt(k * y)}>`,
  liveValues: ({ x, y, k }) => [value("v-components", "v components", `(${fmt(x)}, ${fmt(y)})`), value("k", "k", fmt(k)), value("kv-components", "kv components", `(${fmt(k * x)}, ${fmt(k * y)})`), value("original-magnitude", "original magnitude", fmt(Math.hypot(x, y))), value("scaled-magnitude", "scaled magnitude", fmt(Math.hypot(k * x, k * y))), value("direction-status", "direction status", directionStatus(k, { x, y })), value("invariant", "invariant", "|kv| = |k||v|")],
  invariant: () => "Scalar multiplication scales length by |k| and reverses direction only when k is negative.",
  renderVisual: ScalarMultiplicationVisual,
});

export const dotProductProjectionPhaseTwentyConfig = makeConfig({
  modelKey: "projection-sign",
  steps: ["Draw u and v", "Measure angle", "Project u onto v", "Compare with cos theta", "Compute dot product", "Interpret sign"],
  parameters: twoVectorParams,
  prediction: ["What is the dot product when two nonzero vectors are perpendicular?", "0."],
  misconception: ["Dot product is always positive.", "It is positive for acute angles, zero for perpendicular vectors, and negative for obtuse angles."],
  tokens: ["u-dot-v", "u-magnitude", "v-magnitude", "cos-theta", "projection"],
  formula: ({ ux, uy, vx, vy }) => `u dot v = |u||v|cos theta = u1v1+u2v2 = ${fmt(ux * vx + uy * vy)}`,
  liveValues: (values) => {
    const u = vec(values.ux, values.uy);
    const v = vec(values.vx, values.vy);
    return [value("u-components", "u components", pair(u)), value("v-components", "v components", pair(v)), value("u-magnitude", "|u|", fmt(mag(u))), value("v-magnitude", "|v|", fmt(mag(v))), value("theta", "theta", `${fmt(angleBetween(u, v))} deg`), value("cos-theta", "cos theta", fmt(cosBetween(u, v))), value("dot-product", "dot product", fmt(dot(u, v))), value("sign-meaning", "sign meaning", dotSign(dot(u, v))), value("invariant", "invariant", "u dot v = |u||v|cos theta = u1v1 + u2v2")];
  },
  invariant: () => "The dot product measures signed projection agreement between two vectors.",
  renderVisual: DotProductProjectionVisual,
});

export const crossProductAreaPhaseTwentyConfig = makeConfig({
  modelKey: "area-parallelogram",
  steps: ["Draw u and v", "Build parallelogram", "Identify base", "Drop perpendicular height", "Compute area", "Conclude cross-product magnitude"],
  parameters: twoVectorParams,
  prediction: ["What happens to |u x v| when u and v are parallel?", "It becomes 0."],
  misconception: ["Cross product magnitude is largest when vectors point in the same direction.", "It is largest when vectors are perpendicular and zero when they are parallel."],
  tokens: ["cross-magnitude", "base-u", "height-v-sin-theta", "sin-theta", "area"],
  formula: (values) => {
    const u = vec(values.ux, values.uy);
    const v = vec(values.vx, values.vy);
    return `|u x v| = |u||v|sin theta = parallelogram area = ${fmt(Math.abs(cross(u, v)))}`;
  },
  liveValues: (values) => {
    const u = vec(values.ux, values.uy);
    const v = vec(values.vx, values.vy);
    const area = Math.abs(cross(u, v));
    return [value("u-components", "u components", pair(u)), value("v-components", "v components", pair(v)), value("theta", "theta", `${fmt(angleBetween(u, v))} deg`), value("base", "base", fmt(mag(u))), value("height", "height", fmt(mag(u) ? area / mag(u) : 0)), value("area-cross-magnitude", "area/cross magnitude", fmt(area)), value("parallel-warning", "parallel warning", area < 0.001 ? "parallel or zero vector" : "not parallel"), value("invariant", "invariant", "cross magnitude equals parallelogram area")];
  },
  invariant: () => "The magnitude of a cross product is the area of the parallelogram spanned by the vectors.",
  renderVisual: CrossProductAreaVisual,
});

export const unitVectorsNormalizationPhaseTwentyConfig = makeConfig({
  modelKey: "normalization-zero-warning",
  steps: ["Draw vector v", "Measure |v|", "Divide components by |v|", "Draw unit vector", "Compare direction", "Conclude normalization"],
  parameters: singleVectorParams,
  prediction: ["What changes when a vector is normalized?", "Its length becomes 1, but its direction stays the same."],
  misconception: ["Normalization changes direction.", "Dividing by magnitude rescales length to 1 without changing direction."],
  tokens: ["v", "magnitude", "v-over-magnitude", "length-one", "unit-circle"],
  formula: ({ x, y }) => `v_hat = v/|v| = <${fmt(x)}, ${fmt(y)}> / ${fmt(Math.hypot(x, y))}`,
  liveValues: ({ x, y }) => {
    const v = vec(x, y);
    const n = normalize(v);
    return [value("v-components", "v components", pair(v)), value("magnitude", "magnitude", fmt(mag(v))), value("normalized-components", "normalized components", n ? pair(n) : "undefined"), value("normalized-magnitude", "normalized magnitude", n ? fmt(mag(n)) : "undefined"), value("zero-vector-warning", "zero-vector warning", n ? "no" : "cannot normalize zero vector"), value("invariant", "invariant", "v_hat has length 1 when v is nonzero")];
  },
  invariant: (values) => mag(vec(values.x, values.y)) < 0.001 ? "The zero vector has no direction, so it cannot be normalized." : "Normalization keeps direction and changes length to 1.",
  renderVisual: UnitVectorNormalizationVisual,
});

export const vectorEquationLinePhaseTwentyConfig = makeConfig({
  modelKey: "a-d-t-parameter",
  steps: ["Choose start vector a", "Choose direction d", "Pick parameter t", "Scale direction by t", "Add to a", "Trace the line"],
  parameters: [param("ax", "a x", -4, 4, -1, 0.1), param("ay", "a y", -4, 4, 1, 0.1), param("dx", "d x", -4, 4, 2, 0.1), param("dy", "d y", -4, 4, 1, 0.1), param("t", "parameter t", -3, 3, 1.2, 0.1)],
  prediction: ["What does changing t do?", "It moves the point along the line in direction d."],
  misconception: ["The vector equation gives only one point.", "As t varies, it gives all points on the line."],
  tokens: ["a", "d", "t", "r", "td"],
  formula: ({ ax, ay, dx, dy, t }) => `r = a + td = <${fmt(ax)}, ${fmt(ay)}> + ${fmt(t)}<${fmt(dx)}, ${fmt(dy)}> = <${fmt(ax + t * dx)}, ${fmt(ay + t * dy)}>`,
  liveValues: ({ ax, ay, dx, dy, t }) => [value("a-components", "a components", `(${fmt(ax)}, ${fmt(ay)})`), value("d-components", "d components", `(${fmt(dx)}, ${fmt(dy)})`), value("t", "t", fmt(t)), value("td", "td", `(${fmt(t * dx)}, ${fmt(t * dy)})`), value("r", "r = a + td", `(${fmt(ax + t * dx)}, ${fmt(ay + t * dy)})`), value("invariant", "invariant", "every r lies on the line through a in direction d")],
  invariant: () => "Changing t moves along one line determined by start vector a and direction d.",
  renderVisual: VectorEquationLineVisual,
});

export const vectorProjectionComponentPhaseTwentyConfig = makeConfig({
  modelKey: "residual-perpendicular",
  steps: ["Draw u and v", "Project u onto line of v", "Compute dot product", "Scale v by coefficient", "Show residual", "Conclude projection formula"],
  parameters: twoVectorParams,
  prediction: ["What is special about the residual after projection?", "It is perpendicular to the direction vector v."],
  misconception: ["Projection means just dropping the y-component.", "Projection depends on the chosen direction vector, not necessarily the coordinate axes."],
  tokens: ["u-dot-v", "v-squared", "projection-scalar", "proj-v-u", "residual"],
  formula: (values) => {
    const u = vec(values.ux, values.uy);
    const v = vec(values.vx, values.vy);
    return `proj_v u = ((u dot v)/|v|^2)v = ${fmt(projectionScalar(u, v))}v`;
  },
  liveValues: (values) => {
    const u = vec(values.ux, values.uy);
    const v = vec(values.vx, values.vy);
    const p = projection(u, v);
    const residual = sub(u, p);
    return [value("u-components", "u components", pair(u)), value("v-components", "v components", pair(v)), value("dot-product", "dot product", fmt(dot(u, v))), value("v-squared", "|v|^2", fmt(dot(v, v))), value("projection-scalar", "projection scalar", fmt(projectionScalar(u, v))), value("projection-vector", "projection vector", pair(p)), value("residual-vector", "residual vector", pair(residual)), value("perpendicular-check", "perpendicular check", fmt(dot(residual, v))), value("invariant", "invariant", "residual dot v is approximately 0")];
  },
  invariant: () => "The residual u - proj_v u is perpendicular to v.",
  renderVisual: VectorProjectionComponentVisual,
});

export const phaseTwentyRouteSlugs = [
  ["vectors", "vector-as-directed-segment"],
  ["vectors", "vector-addition-tip-to-tail"],
  ["vectors", "scalar-multiplication-vector"],
  ["vectors", "dot-product-as-projection"],
  ["vectors", "cross-product-area"],
  ["vectors", "unit-vectors-normalization"],
  ["vectors", "vector-equation-line"],
  ["vectors", "vector-projection-component"],
] as const;

export const phaseTwentyConfigs = [
  vectorDirectedSegmentPhaseTwentyConfig,
  vectorAdditionPhaseTwentyConfig,
  scalarMultiplicationPhaseTwentyConfig,
  dotProductProjectionPhaseTwentyConfig,
  crossProductAreaPhaseTwentyConfig,
  unitVectorsNormalizationPhaseTwentyConfig,
  vectorEquationLinePhaseTwentyConfig,
  vectorProjectionComponentPhaseTwentyConfig,
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

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentyModelKey: string } {
  return {
    phaseTwentyModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: vectorRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `vector-${input.modelKey}-invariant`, label: "vector invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG vector-field model.", "Vector coordinates are bounded to keep labels readable on mobile.", "Rounded values support classroom intuition while formulas preserve the vector relationship."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p20-${index}`, title, description: title, focusLabel: index < 2 ? "vector setup" : index < 5 ? "visual relation" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the vector-field visual before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use only a memorized rule.", feedback: "The vector visual explains why the rule works." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the connected vector, component, projection, or parallelogram.", options: [{ id: "visual", label: "Use the vector-field model.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Ignore direction and components.", feedback: "Vector geometry gives the formula its meaning." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "component-vector": "<x,y>", "x-component": "x", "y-component": "y", magnitude: "|v|", theta: "theta",
    u: "u", v: "v", "u-plus-v": "u+v", "component-sums": "component sums", parallelogram: "parallelogram",
    k: "k", kv: "kv", "scaled-components": "<kx,ky>", "length-scale": "|kv|",
    "u-dot-v": "u dot v", "u-magnitude": "|u|", "v-magnitude": "|v|", "cos-theta": "cos theta", projection: "projection",
    "cross-magnitude": "|u x v|", "base-u": "|u|", "height-v-sin-theta": "|v|sin theta", "sin-theta": "sin theta", area: "area",
    "v-over-magnitude": "v/|v|", "length-one": "length 1", "unit-circle": "unit circle",
    a: "a", d: "d", t: "t", r: "r", td: "td",
    "v-squared": "|v|^2", "projection-scalar": "(u dot v)/|v|^2", "proj-v-u": "proj_v u", residual: "residual",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("component") || token === "magnitude" || token === "theta") return "component guide and directed arrow";
  if (token === "u" || token === "v" || token.includes("plus") || token.includes("parallelogram")) return "vector addition arrows";
  if (token === "k" || token === "kv" || token.includes("scaled") || token.includes("length")) return "scalar scaling arrows";
  if (token.includes("dot") || token.includes("cos") || token.includes("projection")) return "projection and signed shadow";
  if (token.includes("cross") || token.includes("height") || token.includes("sin") || token === "area") return "parallelogram area guide";
  if (token.includes("unit") || token.includes("magnitude")) return "unit circle and normalized vector";
  if (token === "a" || token === "d" || token === "t" || token === "td" || token === "r") return "parameterized line guide";
  if (token.includes("squared") || token.includes("scalar") || token.includes("residual")) return "projection residual guide";
  return "vector visual feature";
}

type Vec = { x: number; y: number };
function vec(x: number, y: number): Vec { return { x, y }; }
function sub(a: Vec, b: Vec): Vec { return { x: a.x - b.x, y: a.y - b.y }; }
function dot(a: Vec, b: Vec) { return a.x * b.x + a.y * b.y; }
function cross(a: Vec, b: Vec) { return a.x * b.y - a.y * b.x; }
function mag(a: Vec) { return Math.hypot(a.x, a.y); }
function projectionScalar(u: Vec, v: Vec) { return dot(v, v) ? dot(u, v) / dot(v, v) : 0; }
function projection(u: Vec, v: Vec) { const scalar = projectionScalar(u, v); return { x: scalar * v.x, y: scalar * v.y }; }
function normalize(a: Vec) { const length = mag(a); return length < 0.001 ? null : { x: a.x / length, y: a.y / length }; }
function cosBetween(a: Vec, b: Vec) { const length = mag(a) * mag(b); return length ? dot(a, b) / length : 0; }
function angleBetween(a: Vec, b: Vec) { return Math.acos(Math.max(-1, Math.min(1, cosBetween(a, b)))) * 180 / Math.PI; }
function angleDeg(a: Vec) { return Math.atan2(a.y, a.x) * 180 / Math.PI; }
function quadrant(a: Vec) {
  if (Math.abs(a.x) < 0.001 && Math.abs(a.y) < 0.001) return "origin";
  if (Math.abs(a.x) < 0.001) return "y-axis";
  if (Math.abs(a.y) < 0.001) return "x-axis";
  return a.x > 0 && a.y > 0 ? "I" : a.x < 0 && a.y > 0 ? "II" : a.x < 0 && a.y < 0 ? "III" : "IV";
}
function directionStatus(k: number, v: Vec) {
  if (Math.abs(k) < 0.001 || mag(v) < 0.001) return "zero";
  return k > 0 ? "same" : "reversed";
}
function dotSign(value: number) { return Math.abs(value) < 0.001 ? "zero" : value > 0 ? "positive" : "negative"; }
function pair(v: Vec) { return `(${fmt(v.x)}, ${fmt(v.y)})`; }
function fmt(item: number) { return Number.isFinite(item) ? item.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
