import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  DivergenceCurlVectorFieldVisual,
  FourierWaveBuildingVisual,
  GradientSteepestIncreaseVisual,
  LaplaceDecaySystemVisual,
  LinearProgrammingFeasibleRegionVisual,
  SimpleHarmonicMotionVisual,
  SlopeFieldDifferentialEquationVisual,
  TrapezoidalRuleNumericalIntegrationVisual,
} from "./PhaseTwentySevenEngineeringVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const engineeringRoute = "/olympyard/practice/engineering-mathematics-foundations";

export const slopeFieldDifferentialEquationPhaseTwentySevenConfig = makeConfig({
  modelKey: "slope-field-initial-condition-solution-curve",
  steps: ["Choose differential equation", "Draw slope field", "Pick initial condition", "Follow local slopes", "Trace solution curve", "Conclude slope-field meaning"],
  parameters: [param("mode", "equation 0=y 1=x-y", 0, 1, 1, 1), param("x0", "initial x0", -4, 2, -3, 0.25), param("y0", "initial y0", -3, 3, 1, 0.25), param("h", "step size h", 0.1, 0.6, 0.25, 0.05)],
  prediction: ["What does each small line segment in a slope field show?", "The local slope dy/dx at that point."],
  misconception: ["A slope field is one single solution curve.", "A slope field shows local directions everywhere; each initial condition produces its own solution curve."],
  tokens: ["dy-dx", "fxy", "initial-condition", "solution-curve"],
  formula: ({ mode }) => `dy/dx = f(x,y), selected rule: ${odeName(mode)}`,
  liveValues: ({ mode, x0, y0, h }) => [value("equation-type", "equation type", odeName(mode)), value("initial-x0-y0", "initial x0, y0", pt(x0, y0)), value("selected-point", "selected point", pt(x0, y0)), value("local-slope", "local slope", fmt(slopeAt(x0, y0, mode))), value("step-size", "step size", fmt(h)), value("approximate-next-point", "approximate next point", pt(x0 + h, y0 + h * slopeAt(x0, y0, mode))), value("slope-field-insight", "insight", "solution curve follows local slopes")],
  invariant: () => "The solution curve follows the local slope assigned by f(x,y) at each point.",
  renderVisual: SlopeFieldDifferentialEquationVisual,
});

export const simpleHarmonicMotionPhaseTwentySevenConfig = makeConfig({
  modelKey: "simple-harmonic-motion-amplitude-frequency-phase",
  steps: ["Choose amplitude", "Choose frequency", "Show oscillating displacement", "Draw graph over time", "Adjust phase", "Conclude SHM formula"],
  parameters: [param("amplitude", "amplitude A", 0.5, 3, 2, 0.1), param("omega", "angular frequency omega", 0.5, 4, 1.5, 0.1), param("phase", "phase phi", -3.14, 3.14, 0.4, 0.1), param("t", "time t", 0, 6.28, 2, 0.05)],
  prediction: ["What happens to the period if angular frequency omega increases?", "The period decreases."],
  misconception: ["Amplitude changes how fast the motion repeats.", "Amplitude changes maximum displacement; frequency controls repetition speed."],
  tokens: ["a", "omega", "phi", "cos", "x-t"],
  formula: ({ amplitude, omega, phase, t }) => `x(t)=A cos(omega t + phi) = ${fmt(amplitude)} cos(${fmt(omega)}*${fmt(t)}+${fmt(phase)}) = ${fmt(amplitude * Math.cos(omega * t + phase))}`,
  liveValues: ({ amplitude, omega, phase, t }) => [value("A", "A", fmt(amplitude)), value("omega", "omega", fmt(omega)), value("phi", "phi", fmt(phase)), value("t", "t", fmt(t)), value("x-t", "x(t)", fmt(amplitude * Math.cos(omega * t + phase))), value("period", "period T=2pi/omega", fmt((2 * Math.PI) / omega)), value("max-min-displacement", "max/min displacement", `${fmt(amplitude)} / ${fmt(-amplitude)}`), value("shm-insight", "insight", "SHM repeats periodically")],
  invariant: () => "Frequency controls period; amplitude controls maximum displacement.",
  renderVisual: SimpleHarmonicMotionVisual,
});

export const fourierWaveBuildingPhaseTwentySevenConfig = makeConfig({
  modelKey: "fourier-series-harmonic-wave-building",
  steps: ["Start with first sine wave", "Add next harmonic", "Add weighted components", "Sum the waves", "Compare with target", "Conclude Fourier-building intuition"],
  parameters: [param("target", "target 0=square 1=triangle", 0, 1, 0, 1), param("harmonics", "number of terms n", 1, 9, 5, 1), param("t", "current t", 0, 6.28, 1.6, 0.05)],
  prediction: ["What usually happens when more harmonics are added?", "The approximation becomes closer to the target waveform."],
  misconception: ["Fourier series means one sine wave equals every signal.", "It uses a sum of many sine/cosine waves to approximate or represent periodic signals."],
  tokens: ["harmonic", "sum", "approximation", "n"],
  formula: ({ harmonics, target }) => `${targetName(target)} partial sum with n=${fmt(harmonics)} harmonic terms`,
  liveValues: ({ target, harmonics, t }) => [value("target-type", "target type", targetName(target)), value("harmonics-included", "harmonics included", fmt(harmonics)), value("current-t", "current t", fmt(t)), value("component-values", "component values", "weighted sine harmonics"), value("summed-value", "summed value", fmt(fourierValue(t, harmonics, target))), value("approximation-error", "approximation error at selected t", fmt(Math.abs(targetWave(t, target) - fourierValue(t, harmonics, target)))), value("fourier-insight", "insight", "more harmonics improve approximation but can create ringing")],
  invariant: () => "Periodic signals can be built from weighted harmonic waves.",
  renderVisual: FourierWaveBuildingVisual,
});

export const laplaceTransformDecayPhaseTwentySevenConfig = makeConfig({
  modelKey: "laplace-decay-time-to-s-domain",
  steps: ["Draw time-domain decay", "Mark decay rate a", "Apply transform notation", "Show s-domain expression", "Change a and compare", "Conclude transform intuition"],
  parameters: [param("a", "decay rate a", 0.2, 3, 1, 0.1), param("t", "selected t", 0, 5, 1.5, 0.1), param("s", "selected s", 0.5, 5, 2, 0.1)],
  prediction: ["What happens to e^(-at) when a increases?", "It decays faster."],
  misconception: ["Laplace transform is just another graph of the same time curve.", "It represents the function in a different domain, often simplifying system and differential-equation work."],
  tokens: ["e-minus-at", "laplace", "s-domain", "a"],
  formula: ({ a }) => `L{e^(-at)} = 1/(s+a), so L{e^(-${fmt(a)}t)} = 1/(s+${fmt(a)})`,
  liveValues: ({ a, t, s }) => [value("a", "a", fmt(a)), value("selected-t", "selected t", fmt(t)), value("time-value", "time value e^(-at)", fmt(Math.exp(-a * t))), value("selected-s", "selected s", fmt(s)), value("transform-value-approximation", "transform value approximation", fmt(1 / (s + a))), value("laplace-insight", "insight", "transform changes viewpoint from time behavior to system expression")],
  invariant: () => "The transform changes the representation from time behavior to an s-domain system expression.",
  renderVisual: LaplaceDecaySystemVisual,
});

export const gradientSteepestIncreasePhaseTwentySevenConfig = makeConfig({
  modelKey: "gradient-contour-steepest-increase",
  steps: ["Draw contour map", "Pick a point", "Compute local partial changes", "Draw gradient vector", "Compare with contour", "Conclude steepest increase"],
  parameters: [param("x", "point x", -3, 3, 1.2, 0.1), param("y", "point y", -3, 3, 1, 0.1), param("direction", "direction angle radians", -3.14, 3.14, 0.8, 0.1)],
  prediction: ["What direction does the gradient point?", "The direction of steepest increase."],
  misconception: ["The gradient points along a contour line.", "The gradient is perpendicular to contour lines and points uphill."],
  tokens: ["df-dx", "df-dy", "gradient", "steepest-increase", "contour"],
  formula: ({ x, y }) => `grad f = <df/dx, df/dy> = <${fmt(2 * x)}, ${fmt(2 * y)}> for f=x^2+y^2`,
  liveValues: ({ x, y, direction }) => { const gx = 2 * x; const gy = 2 * y; return [value("point-x-y", "point x,y", pt(x, y)), value("f-x-y", "f(x,y)", fmt(x * x + y * y)), value("gradient-components", "gradient components", `<${fmt(gx)}, ${fmt(gy)}>`), value("gradient-magnitude", "gradient magnitude", fmt(Math.hypot(gx, gy))), value("selected-direction", "selected direction", fmt(direction)), value("directional-derivative", "directional derivative", fmt(gx * Math.cos(direction) + gy * Math.sin(direction))), value("gradient-invariant", "invariant", "gradient points in steepest increase direction")]; },
  invariant: () => "The gradient is perpendicular to contours and points toward steepest increase.",
  renderVisual: GradientSteepestIncreaseVisual,
});

export const divergenceCurlVectorFieldPhaseTwentySevenConfig = makeConfig({
  modelKey: "divergence-curl-vector-field-local-behavior",
  steps: ["Choose vector field", "Place test region", "Observe flow in or out", "Observe local rotation", "Compare div and curl", "Conclude their meanings"],
  parameters: [param("field", "field 0=source 1=sink 2=rotation 3=uniform", 0, 3, 2, 1), param("x", "test x", -4, 4, 0.5, 0.1), param("y", "test y", -3, 3, 0.5, 0.1)],
  prediction: ["What does positive divergence look like?", "Arrows spreading outward from a region."],
  misconception: ["Divergence and curl mean the same thing.", "Divergence measures source/sink behavior; curl measures rotation."],
  tokens: ["div-f", "curl-f", "partial-terms"],
  formula: ({ field }) => `div F = dP/dx+dQ/dy, curl F = dQ/dx-dP/dy; selected field: ${fieldName(field)}`,
  liveValues: ({ field, x, y }) => [value("selected-field", "selected field", fieldName(field)), value("point-x-y", "point x,y", pt(x, y)), value("approximate-divergence", "approximate divergence", fmt(divergence(field))), value("approximate-curl", "approximate curl", fmt(curlValue(field))), value("qualitative-status", "qualitative status", fieldStatus(field)), value("div-curl-insight", "insight", "divergence measures spreading; curl measures spinning")],
  invariant: () => "Divergence measures local spreading, while curl measures local spinning.",
  renderVisual: DivergenceCurlVectorFieldVisual,
});

export const trapezoidalRuleNumericalIntegrationPhaseTwentySevenConfig = makeConfig({
  modelKey: "trapezoidal-rule-subinterval-area-approximation",
  steps: ["Draw curve", "Split interval", "Connect sample points", "Form trapezoids", "Add trapezoid areas", "Conclude numerical integration rule"],
  parameters: [param("func", "function 0=quadratic 1=sine", 0, 1, 0, 1), param("a", "left endpoint a", -3, 2, -2, 0.25), param("b", "right endpoint b", -1, 4, 3, 0.25), param("n", "subintervals n", 2, 10, 5, 1)],
  prediction: ["Why do interior heights have coefficient 2?", "Each interior height is shared by two neighboring trapezoids."],
  misconception: ["The trapezoidal rule always gives exact area.", "It approximates curved area; exactness depends on the function and interval."],
  tokens: ["h", "endpoint-terms", "two-fi", "trapezoid-areas"],
  formula: ({ a, b, n }) => `integral_a^b f(x) dx approx h/2[f(x0)+2f(x1)+...+f(xn)], h=${fmt((b - a) / Math.round(n))}`,
  liveValues: ({ func, a, b, n }) => { const left = Math.min(a, b - 0.5); const count = Math.round(n); return [value("a-b", "a,b", `${fmt(left)}, ${fmt(b)}`), value("n", "n", fmt(count)), value("h", "h", fmt((b - left) / count)), value("trapezoid-heights", "trapezoid heights", "sampled endpoint and interior heights"), value("approximation", "approximation", fmt(trapezoidApprox(left, b, count, func))), value("reference-area", "reference area", fmt(referenceArea(left, b, func))), value("error", "error", fmt(Math.abs(referenceArea(left, b, func) - trapezoidApprox(left, b, count, func)))), value("trapezoid-insight", "insight", "more trapezoids generally improve approximation")]; },
  invariant: () => "Interior heights are counted twice because neighboring trapezoids share them.",
  renderVisual: TrapezoidalRuleNumericalIntegrationVisual,
});

export const linearProgrammingFeasibleRegionPhaseTwentySevenConfig = makeConfig({
  modelKey: "linear-programming-feasible-region-objective-vertices",
  steps: ["Draw constraints", "Shade half-planes", "Intersect feasible region", "Draw objective line", "Slide objective line", "Find optimum vertex"],
  parameters: [param("objA", "objective coefficient a", 0.5, 4, 2, 0.25), param("objB", "objective coefficient b", 0.5, 4, 1.5, 0.25), param("level", "objective level", 1, 10, 6, 0.25)],
  prediction: ["Where should we check for the optimum in a bounded linear program?", "At the vertices of the feasible region."],
  misconception: ["The optimum must occur in the middle of the feasible region.", "For a linear objective over a polygonal feasible region, extrema occur at vertices."],
  tokens: ["constraints", "feasible-region", "objective", "vertex"],
  formula: ({ objA, objB }) => `linear objective z = ${fmt(objA)}x + ${fmt(objB)}y; extrema occur at feasible vertices when bounded`,
  liveValues: ({ objA, objB }) => { const vertices = [[0, 0], [4, 0], [3, 2], [1, 3], [0, 2]]; const scored = vertices.map(([x, y]) => ({ x, y, z: objA * x + objB * y })); const best = scored.reduce((max, item) => item.z > max.z ? item : max, scored[0]); return [value("constraints", "constraints", "x>=0, y>=0, x+y<=4, x+2y<=7"), value("feasible-vertices", "feasible vertices", vertices.map(([x, y]) => pt(x, y)).join(" ")), value("objective-coefficients", "objective coefficients", `${fmt(objA)}, ${fmt(objB)}`), value("objective-value-at-vertices", "objective value at vertices", scored.map((item) => fmt(item.z)).join(", ")), value("optimum-vertex", "optimum vertex", pt(best.x, best.y)), value("bounded-unbounded-status", "bounded/unbounded status", "bounded"), value("linear-programming-insight", "insight", "linear objective optimum occurs at feasible vertex when bounded")]; },
  invariant: () => "For a bounded linear program, a linear objective reaches extrema at feasible-region vertices.",
  renderVisual: LinearProgrammingFeasibleRegionVisual,
});

export const phaseTwentySevenRouteSlugs = [
  ["engineering-mathematics", "first-order-differential-equation-slope-field"],
  ["engineering-mathematics", "simple-harmonic-motion"],
  ["engineering-mathematics", "fourier-series-wave-building"],
  ["engineering-mathematics", "laplace-transform-decay-system"],
  ["engineering-mathematics", "gradient-steepest-increase"],
  ["engineering-mathematics", "divergence-curl-vector-field"],
  ["engineering-mathematics", "trapezoidal-rule-numerical-integration"],
  ["engineering-mathematics", "linear-programming-feasible-region"],
] as const;

export const phaseTwentySevenConfigs = [
  slopeFieldDifferentialEquationPhaseTwentySevenConfig,
  simpleHarmonicMotionPhaseTwentySevenConfig,
  fourierWaveBuildingPhaseTwentySevenConfig,
  laplaceTransformDecayPhaseTwentySevenConfig,
  gradientSteepestIncreasePhaseTwentySevenConfig,
  divergenceCurlVectorFieldPhaseTwentySevenConfig,
  trapezoidalRuleNumericalIntegrationPhaseTwentySevenConfig,
  linearProgrammingFeasibleRegionPhaseTwentySevenConfig,
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

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseTwentySevenModelKey: string } {
  return {
    phaseTwentySevenModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: engineeringRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `engineering-${input.modelKey}-invariant`, label: "applied-system invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG applied-system model.", "Values are bounded to keep graph labels readable on mobile.", "Keyboard fallback controls are available in the shared parameter panel."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, stepValue = 1) { return { id, label, min, max, defaultValue, step: stepValue }; }
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p27-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "applied-system visual" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the applied-system visual before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "static-formula", label: "The formula is only a memorized symbol.", feedback: "The visual shows the system behavior behind the formula." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the field, wave, transform panel, contour, vector field, trapezoids, or feasible region.", options: [{ id: "system-view", label: "Use the system behavior shown in the visual.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Use the symbol without the visual meaning.", feedback: "Engineering mathematics connects formulas to system behavior." }] };
}
function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "dy-dx": "dy/dx", fxy: "f(x,y)", "initial-condition": "initial condition", "solution-curve": "solution curve",
    a: "A / a", omega: "omega", phi: "phi", cos: "cos", "x-t": "x(t)",
    harmonic: "harmonic", sum: "sum", approximation: "approximation", n: "n",
    "e-minus-at": "e^(-at)", laplace: "L{}", "s-domain": "1/(s+a)",
    "df-dx": "df/dx", "df-dy": "df/dy", gradient: "grad f", "steepest-increase": "steepest increase", contour: "contour",
    "div-f": "div F", "curl-f": "curl F", "partial-terms": "partial terms",
    h: "h", "endpoint-terms": "endpoint terms", "two-fi": "2f(x_i)", "trapezoid-areas": "trapezoid areas",
    constraints: "constraints", "feasible-region": "feasible region", objective: "objective", vertex: "vertex",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}
function tokenVisualLabel(token: string) {
  if (["dy-dx", "fxy", "initial-condition", "solution-curve"].includes(token)) return "slope field, initial point, tangent, and solution curve";
  if (["a", "omega", "phi", "cos", "x-t"].includes(token)) return "oscillator displacement and cosine graph";
  if (["harmonic", "sum", "approximation", "n"].includes(token)) return "harmonic components, partial sum, and target wave";
  if (["e-minus-at", "laplace", "s-domain"].includes(token)) return "time-domain decay and s-domain transform panel";
  if (["df-dx", "df-dy", "gradient", "steepest-increase", "contour"].includes(token)) return "contour map, partial components, and gradient arrow";
  if (["div-f", "curl-f", "partial-terms"].includes(token)) return "vector field, test region, spreading, and spinning";
  if (["h", "endpoint-terms", "two-fi", "trapezoid-areas"].includes(token)) return "subinterval width, heights, and trapezoid areas";
  if (["constraints", "feasible-region", "objective", "vertex"].includes(token)) return "constraint lines, feasible polygon, objective line, and optimum vertex";
  return "engineering applied-system visual feature";
}

function fmt(input: number) { return Number.isFinite(input) ? input.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
function pt(x: number, y: number) { return `(${fmt(x)}, ${fmt(y)})`; }
function slopeAt(x: number, y: number, mode: number) { return Math.round(mode) === 0 ? y : x - y; }
function odeName(mode: number) { return Math.round(mode) === 0 ? "dy/dx = y" : "dy/dx = x - y"; }
function targetName(mode: number) { return Math.round(mode) === 0 ? "square wave" : "triangle wave"; }
function fourierValue(x: number, harmonics: number, mode: number) {
  let sum = 0;
  for (let index = 0; index < Math.round(harmonics); index += 1) {
    const k = Math.round(mode) === 0 ? 2 * index + 1 : index + 1;
    sum += Math.round(mode) === 0 ? (4 / Math.PI) * Math.sin(k * x) / k : (8 / Math.PI ** 2) * ((index % 2 === 0 ? 1 : -1) * Math.sin(k * x) / (k * k));
  }
  return sum;
}
function targetWave(x: number, mode: number) { return Math.round(mode) === 0 ? (Math.sin(x) >= 0 ? 1 : -1) : (2 / Math.PI) * Math.asin(Math.sin(x)); }
function fieldName(mode: number) { return ["source field", "sink field", "rotation field", "uniform field"][Math.round(mode)] ?? "source field"; }
function fieldStatus(mode: number) { return ["source / positive divergence", "sink / negative divergence", "rotation / positive curl", "near-zero div and curl"][Math.round(mode)] ?? "source"; }
function divergence(mode: number) { return Math.round(mode) === 0 ? 2 : Math.round(mode) === 1 ? -2 : 0; }
function curlValue(mode: number) { return Math.round(mode) === 2 ? 2 : 0; }
function f(x: number, mode: number) { return Math.round(mode) === 0 ? 0.25 * x * x + 1 : 2 + Math.sin(x); }
function trapezoidApprox(a: number, b: number, n: number, mode: number) {
  const h = (b - a) / n;
  let sum = f(a, mode) + f(b, mode);
  for (let index = 1; index < n; index += 1) sum += 2 * f(a + index * h, mode);
  return (h / 2) * sum;
}
function referenceArea(a: number, b: number, mode: number) {
  if (Math.round(mode) === 0) return (b ** 3 - a ** 3) / 12 + (b - a);
  return 2 * (b - a) - Math.cos(b) + Math.cos(a);
}
