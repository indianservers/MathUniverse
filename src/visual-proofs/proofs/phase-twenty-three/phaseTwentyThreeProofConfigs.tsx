import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  CircleLocusVisual,
  ConeSlicingVisual,
  DirectrixFocusEquationsVisual,
  EccentricityClassifierVisual,
  EllipseDistanceSumVisual,
  HyperbolaDifferenceVisual,
  ParabolaFocusDirectrixVisual,
  ParabolaReflectionVisual,
} from "./PhaseTwentyThreeConicVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const conicsRoute = "/olympyard/practice/conic-sections-foundations";

export const circleLocusPhaseTwentyThreeConfig = makeConfig({
  modelKey: "circle-center-radius-locus",
  steps: ["Place center", "Choose radius", "Pick a point on circle", "Measure distance from center", "Relate distance to equation", "Conclude circle locus definition"],
  parameters: [param("h", "center h", -3, 3, 0.5, 0.25), param("k", "center k", -3, 3, -0.5, 0.25), param("r", "radius r", 1, 5, 3, 0.25), param("theta", "point angle", -3.14, 3.14, 0.8, 0.05)],
  prediction: ["What stays constant for every point on a circle?", "The distance from the center."],
  misconception: ["A circle is defined by equal x and y coordinates.", "A circle is the set of all points at a fixed distance from the center."],
  tokens: ["center", "radius", "x-minus-h", "y-minus-k", "r-squared"],
  formula: ({ h, k, r }) => `(x - h)^2 + (y - k)^2 = r^2, so (x - ${fmt(h)})^2 + (y - ${fmt(k)})^2 = ${fmt(r ** 2)}`,
  liveValues: ({ h, k, r, theta }) => {
    const point = { x: h + r * Math.cos(theta), y: k + r * Math.sin(theta) };
    const left = (point.x - h) ** 2 + (point.y - k) ** 2;
    return [value("h", "h", fmt(h)), value("k", "k", fmt(k)), value("r", "r", fmt(r)), value("selected-point", "selected point x,y", `(${fmt(point.x)}, ${fmt(point.y)})`), value("distance-from-center", "distance from center", fmt(r)), value("equation-left-side", "equation left side", fmt(left)), value("r-squared", "r^2", fmt(r ** 2)), value("circle-locus-invariant", "invariant", "distance from center remains r")];
  },
  invariant: () => "Every point on the circle is exactly radius r from the center.",
  renderVisual: CircleLocusVisual,
});

export const parabolaFocusDirectrixPhaseTwentyThreeConfig = makeConfig({
  modelKey: "parabola-focus-directrix-equality",
  steps: ["Place focus", "Draw directrix", "Pick point on parabola", "Measure distance to focus", "Measure distance to directrix", "Conclude focus-directrix definition"],
  parameters: [param("p", "focus parameter p", 0.8, 4.5, 2, 0.25), param("t", "point x-position", -5, 5, 2.5, 0.25)],
  prediction: ["What two distances are equal for every point on a parabola?", "Distance to the focus and distance to the directrix."],
  misconception: ["A parabola is just any U-shaped curve.", "A parabola has a precise focus-directrix distance property."],
  tokens: ["focus", "directrix", "pf", "distance-directrix", "x-squared-4py"],
  formula: ({ p }) => `For focus (0,p) and directrix y=-p: x^2 = 4py = ${fmt(4 * p)}y`,
  liveValues: ({ p, t }) => {
    const y = (t * t) / (4 * p);
    const focusDistance = Math.hypot(t, y - p);
    const directrixDistance = Math.abs(y + p);
    return [value("p", "p", fmt(p)), value("focus", "focus", `(0, ${fmt(p)})`), value("directrix", "directrix", `y = ${fmt(-p)}`), value("selected-point", "selected point", `(${fmt(t)}, ${fmt(y)})`), value("distance-to-focus", "distance to focus", fmt(focusDistance)), value("distance-to-directrix", "distance to directrix", fmt(directrixDistance)), value("difference-error", "difference/error", fmt(Math.abs(focusDistance - directrixDistance))), value("parabola-distance-invariant", "invariant", "distances are equal")];
  },
  invariant: () => "A parabola point is equidistant from the focus and directrix.",
  renderVisual: ParabolaFocusDirectrixVisual,
});

export const ellipseSumPhaseTwentyThreeConfig = makeConfig({
  modelKey: "ellipse-foci-distance-sum",
  steps: ["Place two foci", "Draw ellipse", "Pick moving point P", "Measure PF1 and PF2", "Add distances", "Conclude ellipse locus rule"],
  parameters: [param("a", "semi-major axis a", 2.5, 5.5, 4.2, 0.25), param("b", "semi-minor axis b", 1.2, 4, 2.5, 0.25), param("theta", "point angle", -3.14, 3.14, 1.1, 0.05)],
  prediction: ["What remains constant as a point moves around an ellipse?", "The sum of distances to the two foci."],
  misconception: ["An ellipse is just a stretched circle with no special distance rule.", "An ellipse has a constant-sum-of-distances rule from two foci."],
  tokens: ["f1", "f2", "pf1-pf2", "constant", "a", "b"],
  formula: ({ a, b }) => `x^2/a^2 + y^2/b^2 = 1 with PF1 + PF2 = 2a = ${fmt(2 * Math.max(a, b + 0.5))}`,
  liveValues: ({ a, b, theta }) => {
    const aa = Math.max(a, b + 0.5);
    const c = Math.sqrt(aa * aa - b * b);
    const point = { x: aa * Math.cos(theta), y: b * Math.sin(theta) };
    const pf1 = Math.hypot(point.x + c, point.y);
    const pf2 = Math.hypot(point.x - c, point.y);
    return [value("a", "a", fmt(aa)), value("b", "b", fmt(b)), value("c", "c", fmt(c)), value("foci-coordinates", "foci coordinates", `(+/-${fmt(c)},0)`), value("selected-point", "selected point", `(${fmt(point.x)}, ${fmt(point.y)})`), value("pf1", "PF1", fmt(pf1)), value("pf2", "PF2", fmt(pf2)), value("distance-sum", "distance sum", fmt(pf1 + pf2)), value("ellipse-sum-invariant", "invariant", "PF1 + PF2 = 2a")];
  },
  invariant: () => "The sum of distances from a point on an ellipse to the two foci is constant.",
  renderVisual: EllipseDistanceSumVisual,
});

export const hyperbolaDifferencePhaseTwentyThreeConfig = makeConfig({
  modelKey: "hyperbola-foci-distance-difference",
  steps: ["Place foci", "Draw branches", "Pick point on branch", "Measure distances to foci", "Compute difference", "Conclude hyperbola locus rule"],
  parameters: [param("a", "semi-transverse axis a", 1.3, 3.2, 2, 0.25), param("b", "semi-conjugate axis b", 0.8, 2.8, 1.4, 0.25), param("t", "branch parameter", 0, 1.5, 0.8, 0.05)],
  prediction: ["What distance relationship defines a hyperbola?", "A constant absolute difference of distances to two foci."],
  misconception: ["A hyperbola is just two unrelated curves.", "Both branches follow the same constant-difference focus rule."],
  tokens: ["f1", "f2", "pf1-minus-pf2", "constant", "asymptotes"],
  formula: ({ a, b }) => `x^2/a^2 - y^2/b^2 = 1 and |PF1 - PF2| = 2a = ${fmt(2 * a)}; asymptotes y=+/-${fmt(b / a)}x`,
  liveValues: ({ a, b, t }) => {
    const c = Math.sqrt(a * a + b * b);
    const point = { x: a * Math.cosh(t), y: b * Math.sinh(t) };
    const pf1 = Math.hypot(point.x + c, point.y);
    const pf2 = Math.hypot(point.x - c, point.y);
    return [value("a", "a", fmt(a)), value("b", "b", fmt(b)), value("c", "c", fmt(c)), value("foci", "foci", `(+/-${fmt(c)},0)`), value("selected-point", "selected point", `(${fmt(point.x)}, ${fmt(point.y)})`), value("pf1", "PF1", fmt(pf1)), value("pf2", "PF2", fmt(pf2)), value("absolute-difference", "absolute difference", fmt(Math.abs(pf1 - pf2))), value("asymptote-slopes", "asymptote slopes", `+/-${fmt(b / a)}`), value("hyperbola-difference-invariant", "invariant", "|PF1 - PF2| = 2a")];
  },
  invariant: () => "A hyperbola has constant absolute difference of distances to its two foci.",
  renderVisual: HyperbolaDifferenceVisual,
});

export const eccentricityClassificationPhaseTwentyThreeConfig = makeConfig({
  modelKey: "eccentricity-conic-classifier",
  steps: ["Introduce eccentricity e", "Set e = 0", "Move through 0 < e < 1", "Set e = 1", "Increase e above 1", "Conclude conic classification"],
  parameters: [param("e", "eccentricity e", 0, 1.8, 0.7, 0.05)],
  prediction: ["What conic appears when e = 1?", "Parabola."],
  misconception: ["Eccentricity only means how stretched a shape looks.", "Eccentricity is a precise ratio that classifies conics."],
  tokens: ["e", "ellipse-range", "parabola-equals-one", "hyperbola-greater-one", "focus-directrix-ratio"],
  formula: ({ e }) => `e = distance to focus / distance to directrix; current classification: ${classify(e)}`,
  liveValues: ({ e }) => [value("e", "e", fmt(e)), value("conic-type", "conic type", classify(e)), value("focus-directrix-ratio", "focus/directrix ratio explanation", "distance to focus divided by distance to directrix"), value("current-equation-shape-note", "current equation/shape note", classifyNote(e)), value("classification-status", "classification status", classify(e))],
  invariant: () => "Eccentricity e is the focus-directrix distance ratio used to classify conics.",
  renderVisual: EccentricityClassifierVisual,
});

export const coneSlicingPhaseTwentyThreeConfig = makeConfig({
  modelKey: "double-cone-slice-classifier",
  steps: ["Show cone", "Add slicing plane", "Try horizontal slice", "Tilt slice", "Match special angles", "Conclude conic-section origin"],
  parameters: [param("sliceAngle", "slice angle", 0, 65, 18, 1), param("slicePosition", "slice position", -3, 3, 0, 0.25)],
  prediction: ["What conic appears when the cutting plane is parallel to the side of the cone?", "Parabola."],
  misconception: ["Conic sections are unrelated formulas.", "They arise from different plane slices of the same cone."],
  tokens: ["circle", "ellipse", "parabola", "hyperbola", "slicing-angle", "double-cone"],
  formula: ({ sliceAngle }) => `Plane slice of double cone -> ${sliceType(sliceAngle)} (${sliceNote(sliceAngle)})`,
  liveValues: ({ sliceAngle, slicePosition }) => [value("slice-angle", "slice angle", `${fmt(sliceAngle)} deg`), value("slice-position", "slice position", fmt(slicePosition)), value("cone-angle", "cone angle", "38 deg"), value("resulting-conic-type", "resulting conic type", sliceType(sliceAngle)), value("geometric-condition-note", "geometric condition note", sliceNote(sliceAngle))],
  invariant: () => "Circle, ellipse, parabola, and hyperbola are plane sections of the same double cone.",
  renderVisual: ConeSlicingVisual,
});

export const parabolaReflectivePhaseTwentyThreeConfig = makeConfig({
  modelKey: "parabola-tangent-focus-reflection",
  steps: ["Draw parabola", "Mark focus and axis", "Choose point P", "Draw tangent", "Reflect incoming parallel ray", "Conclude focus reflection property"],
  parameters: [param("p", "focus parameter p", 0.8, 4, 2, 0.25), param("t", "point x-position", -4.5, 4.5, 2.2, 0.25)],
  prediction: ["Where does a ray parallel to the parabola's axis reflect?", "Through the focus."],
  misconception: ["The focus is just a label and has no geometric role.", "The focus controls the parabola and explains its reflective property."],
  tokens: ["parallel-ray", "focus", "tangent", "equal-angles"],
  formula: ({ p, t }) => `For x^2=4py, tangent slope at P is x/(2p) = ${fmt(t / (2 * p))}; reflected parallel ray passes through focus.`,
  liveValues: ({ p, t }) => {
    const y = (t * t) / (4 * p);
    return [value("p", "p", fmt(p)), value("point-p", "point P", `(${fmt(t)}, ${fmt(y)})`), value("tangent-slope", "tangent slope", fmt(t / (2 * p))), value("incoming-angle", "incoming angle", "parallel to axis"), value("reflected-angle", "reflected angle", "toward focus"), value("focus-check", "focus check", "reflected ray passes through focus"), value("reflection-invariant", "invariant", "reflected ray passes through focus")];
  },
  invariant: () => "A ray parallel to the parabola axis reflects through the focus.",
  renderVisual: ParabolaReflectionVisual,
});

export const directrixFocusEquationsPhaseTwentyThreeConfig = makeConfig({
  modelKey: "focus-directrix-standard-equation-comparison",
  steps: ["Choose conic type", "Show focus/directrix geometry", "Introduce parameters", "Show standard equation", "Compare with other conics", "Conclude equation-geometry connection"],
  parameters: [param("conicType", "conic type 0=parabola 1=ellipse 2=hyperbola", 0, 2, 1, 1), param("p", "parabola p", 0.8, 4, 2, 0.25), param("a", "a", 2.2, 5, 3.8, 0.25), param("b", "b", 1.1, 3.6, 2.2, 0.25)],
  prediction: ["What sign difference separates the standard ellipse and hyperbola equations?", "Ellipse uses a plus sign between squared terms; hyperbola uses a minus sign."],
  misconception: ["Standard conic equations are just memorized formulas.", "They encode geometric focus/directrix and distance relationships."],
  tokens: ["focus-directrix", "standard-equation", "plus-sign", "minus-sign", "four-p"],
  formula: ({ conicType, p, a, b }) => selectedEquation(conicType, p, a, b),
  liveValues: ({ conicType, p, a, b }) => [value("selected-conic", "selected conic", conicName(conicType)), value("parameters", "parameters", `p=${fmt(p)}, a=${fmt(a)}, b=${fmt(b)}`), value("focus-directrix-data", "focus/directrix data", focusData(conicType, p, a, b)), value("standard-equation", "standard equation", selectedEquation(conicType, p, a, b)), value("classification-note", "classification note", equationNote(conicType))],
  invariant: () => "Standard conic equations encode the underlying distance geometry.",
  renderVisual: DirectrixFocusEquationsVisual,
});

export const phaseTwentyThreeRouteSlugs = [
  ["conic-sections", "circle-locus-equal-distance"],
  ["conic-sections", "parabola-focus-directrix"],
  ["conic-sections", "ellipse-sum-of-distances"],
  ["conic-sections", "hyperbola-difference-of-distances"],
  ["conic-sections", "eccentricity-classification"],
  ["conic-sections", "cone-slicing-conics"],
  ["conic-sections", "parabola-reflective-property"],
  ["conic-sections", "directrix-focus-standard-equations"],
] as const;

export const phaseTwentyThreeConfigs = [
  circleLocusPhaseTwentyThreeConfig,
  parabolaFocusDirectrixPhaseTwentyThreeConfig,
  ellipseSumPhaseTwentyThreeConfig,
  hyperbolaDifferencePhaseTwentyThreeConfig,
  eccentricityClassificationPhaseTwentyThreeConfig,
  coneSlicingPhaseTwentyThreeConfig,
  parabolaReflectivePhaseTwentyThreeConfig,
  directrixFocusEquationsPhaseTwentyThreeConfig,
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

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentyThreeModelKey: string } {
  return {
    phaseTwentyThreeModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: conicsRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `conics-${input.modelKey}-invariant`, label: "conic invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG conic model.", "Coordinates are bounded to keep labels readable on mobile.", "Schematic cone slicing and reflection visuals emphasize geometry over photorealistic 3D."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p23-${index}`, title, description: title, focusLabel: index < 2 ? "conic setup" : index < 5 ? "locus relation" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the conic visual before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "formula-only", label: "Use only a memorized equation.", feedback: "The locus or slicing visual explains why the equation works." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the focus, directrix, distance segments, slice plane, tangent, or standard equation.", options: [{ id: "geometry", label: "Use the conic geometry.", correct: true, feedback: "Correct." }, { id: "shape-only", label: "Classify by rough shape only.", feedback: "Conics are defined by precise locus or slicing conditions." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    center: "(h,k)", radius: "r", "x-minus-h": "x-h", "y-minus-k": "y-k", "r-squared": "r^2",
    focus: "focus", directrix: "directrix", pf: "PF", "distance-directrix": "distance to directrix", "x-squared-4py": "x^2 = 4py",
    f1: "F1", f2: "F2", "pf1-pf2": "PF1 + PF2", constant: "constant", a: "a", b: "b",
    "pf1-minus-pf2": "|PF1 - PF2|", asymptotes: "asymptotes",
    e: "e", "ellipse-range": "0 < e < 1", "parabola-equals-one": "e = 1", "hyperbola-greater-one": "e > 1", "focus-directrix-ratio": "focus/directrix ratio",
    circle: "circle", ellipse: "ellipse", parabola: "parabola", hyperbola: "hyperbola", "slicing-angle": "slicing angle", "double-cone": "double cone",
    "parallel-ray": "parallel ray", tangent: "tangent", "equal-angles": "equal angles",
    "focus-directrix": "focus/directrix", "standard-equation": "standard equation", "plus-sign": "+", "minus-sign": "-", "four-p": "4p",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (["center", "radius", "x-minus-h", "y-minus-k", "r-squared"].includes(token)) return "circle center-radius coordinate grid";
  if (["focus", "directrix", "pf", "distance-directrix", "x-squared-4py"].includes(token)) return "parabola focus-directrix guide";
  if (["f1", "f2", "pf1-pf2", "constant", "a", "b"].includes(token)) return "ellipse foci and distance-sum ribbons";
  if (["pf1-minus-pf2", "asymptotes"].includes(token)) return "hyperbola foci, difference, and asymptotes";
  if (["e", "ellipse-range", "parabola-equals-one", "hyperbola-greater-one", "focus-directrix-ratio"].includes(token)) return "eccentricity classifier";
  if (["circle", "ellipse", "parabola", "hyperbola", "slicing-angle", "double-cone"].includes(token)) return "double-cone slicing schematic";
  if (["parallel-ray", "tangent", "equal-angles"].includes(token)) return "parabola tangent and reflection guide";
  if (["focus-directrix", "standard-equation", "plus-sign", "minus-sign", "four-p"].includes(token)) return "standard equation comparison";
  return "conic visual feature";
}

function classify(e: number) {
  if (e <= 0.05) return "circle";
  if (e < 1) return "ellipse";
  if (Math.abs(e - 1) < 0.05) return "parabola";
  return "hyperbola";
}
function classifyNote(e: number) {
  if (e <= 0.05) return "e=0 gives a circle";
  if (e < 1) return "0<e<1 gives an ellipse";
  if (Math.abs(e - 1) < 0.05) return "e=1 gives a parabola";
  return "e>1 gives a hyperbola";
}
function sliceType(angle: number) {
  if (angle < 8) return "circle";
  if (angle < 35) return "ellipse";
  if (angle < 47) return "parabola";
  return "hyperbola";
}
function sliceNote(angle: number) {
  if (angle < 8) return "horizontal cut";
  if (angle < 35) return "tilted nonparallel cut";
  if (angle < 47) return "plane parallel to cone side";
  return "steep cut through both nappes";
}
function conicName(mode: number) { return Math.round(mode) === 0 ? "parabola" : Math.round(mode) === 1 ? "ellipse" : "hyperbola"; }
function selectedEquation(mode: number, p: number, a: number, b: number) {
  const selected = Math.round(mode);
  if (selected === 0) return `x^2 = 4py = ${fmt(4 * p)}y`;
  if (selected === 1) return `x^2/${fmt(a ** 2)} + y^2/${fmt(b ** 2)} = 1`;
  return `x^2/${fmt(a ** 2)} - y^2/${fmt(b ** 2)} = 1`;
}
function focusData(mode: number, p: number, a: number, b: number) {
  const selected = Math.round(mode);
  if (selected === 0) return `focus (0,${fmt(p)}), directrix y=${fmt(-p)}`;
  const c = selected === 1 ? Math.sqrt(Math.max(0, a * a - b * b)) : Math.sqrt(a * a + b * b);
  return `foci (+/-${fmt(c)},0)`;
}
function equationNote(mode: number) {
  const selected = Math.round(mode);
  if (selected === 0) return "parabola uses 4p";
  if (selected === 1) return "ellipse uses plus sign";
  return "hyperbola uses minus sign";
}
function fmt(item: number) { return Number.isFinite(item) ? item.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
