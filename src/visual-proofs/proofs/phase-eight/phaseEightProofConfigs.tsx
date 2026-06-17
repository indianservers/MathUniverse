import type { PhaseTwoProofConfig } from "../../components/PhaseTwoProofExperience";
import {
  CircleEquationVisual,
  DistanceFormulaVisual,
  formatCoordinate,
  MidpointFormulaVisual,
  ParallelLinesSlopeVisual,
  PerpendicularLinesSlopeVisual,
  SlopeFormulaVisual,
  SlopeInterceptLineVisual,
  TranslationOfPointsVisual,
} from "./PhaseEightCoordinateVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const coordinateRoute = "/olympyard/practice/coordinate-geometry";
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const pointParams = [{ id: "x1", label: "x1", min: -8, max: 8, defaultValue: -4 }, { id: "y1", label: "y1", min: -8, max: 8, defaultValue: -2 }, { id: "x2", label: "x2", min: -8, max: 8, defaultValue: 4 }, { id: "y2", label: "y2", min: -8, max: 8, defaultValue: 3 }];
const pointSteps = ["Place two points", "Draw horizontal run", "Draw vertical rise", "Form a right triangle", "Apply Pythagorean theorem", "Conclude the formula"];

export const distanceFormulaPhaseEightConfig = makePointPairConfig({
  steps: pointSteps,
  formula: "d = sqrt((x2 - x1)^2 + (y2 - y1)^2)",
  visual: DistanceFormulaVisual,
  prediction: "If dx = 0, what does the distance become?",
  answer: "The absolute vertical difference, |y2 - y1|.",
  misconception: "Distance is the straight-line hypotenuse, so run and rise combine through squares and square root.",
  tokens: [{ id: "run", label: "x2 - x1", visualLabel: "horizontal run" }, { id: "rise", label: "y2 - y1", visualLabel: "vertical rise" }, { id: "distance", label: "sqrt", visualLabel: "distance hypotenuse" }],
  liveValues: ({ x1, y1, x2, y2 }) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return commonPointValues({ x1, y1, x2, y2 }, [{ id: "dx", label: "dx", value: dx }, { id: "dy", label: "dy", value: dy }, { id: "dx2", label: "dx^2", value: dx * dx }, { id: "dy2", label: "dy^2", value: dy * dy }, { id: "distance", label: "distance rounded", value: round(Math.hypot(dx, dy)), exactValue: `sqrt(${dx * dx + dy * dy})` }]);
  },
  invariant: ({ x1, y1, x2, y2 }) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return `d^2 = ${round(Math.hypot(dx, dy) ** 2)} = dx^2 + dy^2.`;
  },
});

export const midpointFormulaPhaseEightConfig = makePointPairConfig({
  steps: ["Place endpoints", "Connect them", "Average x-coordinates", "Average y-coordinates", "Locate M", "Verify PM = MQ"],
  formula: "M = ((x1 + x2)/2, (y1 + y2)/2)",
  visual: MidpointFormulaVisual,
  prediction: "If P moves right and Q stays fixed, what happens to the midpoint?",
  answer: "It moves right by half as much.",
  misconception: "Midpoint averages both x and y coordinates.",
  tokens: [{ id: "xavg", label: "(x1 + x2)/2", visualLabel: "horizontal average" }, { id: "yavg", label: "(y1 + y2)/2", visualLabel: "vertical average" }, { id: "M", label: "M", visualLabel: "midpoint" }],
  liveValues: ({ x1, y1, x2, y2 }) => {
    const mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    const p = { x: x1, y: y1 };
    const q = { x: x2, y: y2 };
    return commonPointValues({ x1, y1, x2, y2 }, [{ id: "mid-x", label: "midpoint x", value: round(mid.x) }, { id: "mid-y", label: "midpoint y", value: round(mid.y) }, { id: "PM", label: "PM", value: round(Math.hypot(mid.x - p.x, mid.y - p.y)) }, { id: "MQ", label: "MQ", value: round(Math.hypot(q.x - mid.x, q.y - mid.y)) }]);
  },
  invariant: () => "The midpoint is equidistant from P and Q.",
});

export const slopeFormulaPhaseEightConfig = makePointPairConfig({
  steps: ["Place two points", "Draw the line", "Measure rise", "Measure run", "Divide rise by run", "Identify special cases"],
  formula: "m = (y2 - y1)/(x2 - x1)",
  visual: SlopeFormulaVisual,
  prediction: "What happens to slope when the run becomes 0?",
  answer: "The slope is undefined.",
  misconception: "A horizontal line has slope 0; a vertical line has undefined slope because the run is 0.",
  tokens: [{ id: "rise", label: "y2 - y1", visualLabel: "rise" }, { id: "run", label: "x2 - x1", visualLabel: "run" }, { id: "divide", label: "/", visualLabel: "rise over run" }, { id: "m", label: "m", visualLabel: "sloped line" }],
  liveValues: ({ x1, y1, x2, y2 }) => {
    const run = x2 - x1;
    const rise = y2 - y1;
    return commonPointValues({ x1, y1, x2, y2 }, [{ id: "rise", label: "rise", value: rise }, { id: "run", label: "run", value: run, warning: run === 0 ? "vertical line: slope undefined" : undefined }, { id: "slope", label: "slope", value: run === 0 ? "undefined" : round(rise / run), warning: run === 0 ? "undefined because run is 0" : undefined }]);
  },
  invariant: ({ x1, x2 }) => (x2 === x1 ? "Slope is undefined when run is 0." : "Slope equals rise divided by run."),
});

export const slopeInterceptPhaseEightConfig: PhaseTwoProofConfig = {
  steps: ["Start with y-axis intercept", "Choose slope m", "Build rise/run triangle", "Draw the line", "Test a point", "Conclude y = mx + c"].map(step),
  parameters: [{ id: "m", label: "Slope m", min: -3, max: 3, defaultValue: 1, step: 0.25 }, { id: "c", label: "Intercept c", min: -6, max: 6, defaultValue: -1, step: 1 }, { id: "x", label: "Sample x", min: -6, max: 6, defaultValue: 3, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("If c increases and m stays the same, what happens to the line?", "It shifts upward parallel to itself."),
  misconception: misconception("Does c change the steepness of the line?", "m controls steepness; c controls where the line crosses the y-axis."),
  formulaTokens: () => [{ id: "m", label: "m", visualLabel: "slope triangle" }, { id: "c", label: "c", visualLabel: "y-intercept" }, { id: "point", label: "x and y", visualLabel: "live point on line" }],
  formula: ({ m, c, x }) => `y = ${round(m)}(${round(x)}) + ${round(c)} = ${round(m * x + c)}`,
  explanation: () => "The intercept anchors the line, and slope creates every other point by rise over run.",
  liveValues: ({ m, c, x }) => [{ id: "m", label: "m", value: round(m) }, { id: "c", label: "c", value: c }, { id: "x", label: "selected x", value: x }, { id: "y", label: "computed y", value: round(m * x + c) }, { id: "point", label: "sample point", value: formatCoordinate({ x, y: m * x + c }) }],
  invariants: ({ m, c, x }) => [{ id: "line", label: "Point satisfies y = mx + c", holds: true, explanation: `${round(m * x + c)} = ${round(m)}(${x}) + ${c}.` }],
  assumptions: ["The line is non-vertical.", "Slider values are rounded for display."],
  renderVisual: SlopeInterceptLineVisual,
};

export const parallelLinesSlopePhaseEightConfig: PhaseTwoProofConfig = makeLineComparisonConfig("parallel", ParallelLinesSlopeVisual);
export const perpendicularLinesSlopePhaseEightConfig: PhaseTwoProofConfig = makeLineComparisonConfig("perpendicular", PerpendicularLinesSlopeVisual);

export const circleEquationPhaseEightConfig: PhaseTwoProofConfig = {
  steps: ["Place the center", "Choose a radius", "Pick a point on the circle", "Measure horizontal and vertical differences", "Apply distance formula", "Conclude the circle equation"].map(step),
  parameters: [{ id: "h", label: "Center h", min: -5, max: 5, defaultValue: -2, step: 1 }, { id: "k", label: "Center k", min: -5, max: 5, defaultValue: 1, step: 1 }, { id: "r", label: "Radius r", min: 2, max: 6, defaultValue: 4, step: 1 }, { id: "angle", label: "Point angle", min: 0, max: 360, defaultValue: 35, step: 5, unit: "deg" }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("If the center moves from (0,0) to (h,k), why do we use x - h and y - k?", "Because distances are measured relative to the center."),
  misconception: misconception("Is the circle equation always x^2 + y^2 = r^2?", "That only works when the center is the origin; otherwise we subtract the center coordinates."),
  formulaTokens: () => [{ id: "x-h", label: "x - h", visualLabel: "horizontal leg" }, { id: "y-k", label: "y - k", visualLabel: "vertical leg" }, { id: "r2", label: "r^2", visualLabel: "radius distance" }, { id: "center", label: "(h, k)", visualLabel: "center" }],
  formula: ({ h, k, r }) => `(x - ${h})^2 + (y - ${k})^2 = ${r * r}`,
  explanation: () => "Every point on the circle is exactly radius r from the center.",
  liveValues: ({ h, k, r, angle }) => {
    const x = h + r * Math.cos((angle * Math.PI) / 180);
    const y = k + r * Math.sin((angle * Math.PI) / 180);
    return [{ id: "h", label: "h", value: h }, { id: "k", label: "k", value: k }, { id: "r", label: "r", value: r }, { id: "x", label: "x", value: round(x) }, { id: "y", label: "y", value: round(y) }, { id: "x-h", label: "x - h", value: round(x - h) }, { id: "y-k", label: "y - k", value: round(y - k) }, { id: "lhs", label: "left side", value: round((x - h) ** 2 + (y - k) ** 2) }, { id: "r2", label: "r^2", value: r * r }];
  },
  invariants: () => [{ id: "circle", label: "All circle points are distance r from center", holds: true, explanation: "The radius triangle is the distance formula centered at (h,k)." }],
  assumptions: ["The selected point is constrained to the circle.", "Coordinates are rounded for display."],
  renderVisual: CircleEquationVisual,
};

export const translationOfPointsPhaseEightConfig: PhaseTwoProofConfig = {
  steps: ["Place the original point/shape", "Choose translation vector", "Add a to x", "Add b to y", "Draw the image", "Confirm size and orientation are unchanged"].map(step),
  parameters: [{ id: "x", label: "x", min: -6, max: 6, defaultValue: 1, step: 1 }, { id: "y", label: "y", min: -6, max: 6, defaultValue: 4, step: 1 }, { id: "a", label: "Vector a", min: -6, max: 6, defaultValue: 3, step: 1 }, { id: "b", label: "Vector b", min: -6, max: 6, defaultValue: -2, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("If a = 3 and b = -2, where does point (1, 4) move?", "(4, 2)."),
  misconception: misconception("Does translation change size or rotation?", "Translation slides every point by the same vector; size and orientation stay the same."),
  formulaTokens: () => [{ id: "x+a", label: "x + a", visualLabel: "horizontal shift" }, { id: "y+b", label: "y + b", visualLabel: "vertical shift" }, { id: "vector", label: "(a, b)", visualLabel: "translation vector" }],
  formula: ({ x, y, a, b }) => `(${x}, ${y}) -> (${x + a}, ${y + b})`,
  explanation: () => "A translation adds the same vector to every point.",
  liveValues: ({ x, y, a, b }) => [{ id: "original", label: "original point", value: formatCoordinate({ x, y }) }, { id: "vector", label: "vector a,b", value: formatCoordinate({ x: a, y: b }) }, { id: "image", label: "translated point", value: formatCoordinate({ x: x + a, y: y + b }) }, { id: "rule", label: "translation rule", value: `(${x}+${a}, ${y}+${b})` }],
  invariants: () => [{ id: "translation", label: "Shape size and orientation preserved", holds: true, explanation: "Every point receives the same vector." }],
  assumptions: ["Translation is a rigid slide.", "Vector endpoint can be dragged through the image point."],
  renderVisual: TranslationOfPointsVisual,
};

function makePointPairConfig(input: { steps: string[]; formula: string; visual: PhaseTwoProofConfig["renderVisual"]; prediction: string; answer: string; misconception: string; tokens: ReturnType<PhaseTwoProofConfig["formulaTokens"]>; liveValues: PhaseTwoProofConfig["liveValues"]; invariant: (values: Record<string, number>) => string }): PhaseTwoProofConfig {
  return {
    steps: input.steps.map(step),
    parameters: pointParams,
    toggles: [labelsToggle],
    olympyardRoute: coordinateRoute,
    prediction: prompt(input.prediction, input.answer),
    misconception: misconception(input.prediction, input.misconception),
    formulaTokens: () => input.tokens,
    formula: () => input.formula,
    explanation: () => input.misconception,
    liveValues: input.liveValues,
    invariants: (values) => [{ id: "coordinate-invariant", label: "Coordinate relation", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Points snap to integer grid coordinates.", "Long formulas stay in the shell panel for mobile resilience."],
    renderVisual: input.visual,
  };
}

function makeLineComparisonConfig(kind: "parallel" | "perpendicular", visual: PhaseTwoProofConfig["renderVisual"]): PhaseTwoProofConfig {
  const parallel = kind === "parallel";
  return {
    steps: (parallel ? ["Draw first line", "Draw second line", "Compare rise/run for line 1", "Compare rise/run for line 2", "Match the slopes", "Conclude parallel lines have equal slopes"] : ["Draw first line", "Draw second line", "Compare slope triangles", "Rotate to a right angle", "Multiply the slopes", "Conclude m1m2 = -1"]).map(step),
    parameters: parallel ? [{ id: "m1", label: "m1", min: -3, max: 3, defaultValue: 1, step: 0.25 }, { id: "m2", label: "m2", min: -3, max: 3, defaultValue: 1, step: 0.25 }, { id: "c1", label: "c1", min: -6, max: 6, defaultValue: -2, step: 1 }, { id: "c2", label: "c2", min: -6, max: 6, defaultValue: 3, step: 1 }] : [{ id: "m1", label: "m1", min: -4, max: 4, defaultValue: 2, step: 0.25 }, { id: "m2", label: "m2", min: -4, max: 4, defaultValue: -0.5, step: 0.25 }, { id: "c", label: "intercept", min: -4, max: 4, defaultValue: 0, step: 1 }],
    toggles: [labelsToggle],
    olympyardRoute: coordinateRoute,
    prediction: parallel ? prompt("If two lines have the same slope but different intercepts, what are they?", "Parallel.") : prompt("If one slope is 2, what should the perpendicular slope be?", "-1/2."),
    misconception: parallel ? misconception("Must parallel lines be at the same height?", "Parallel lines have the same direction/slope, but different intercepts.") : misconception("Are perpendicular slopes just negatives?", "They are negative reciprocals, so their product is -1."),
    formulaTokens: () => parallel ? [{ id: "m1", label: "m1", visualLabel: "first slope triangle" }, { id: "m2", label: "m2", visualLabel: "second slope triangle" }, { id: "equal", label: "=", visualLabel: "matching slopes" }] : [{ id: "m1", label: "m1", visualLabel: "first slope" }, { id: "m2", label: "m2", visualLabel: "second slope" }, { id: "-1", label: "-1", visualLabel: "right-angle product" }],
    formula: () => parallel ? "m1 = m2 for parallel non-vertical lines" : "m1*m2 = -1 for perpendicular non-special lines",
    explanation: () => parallel ? "Equal slopes mean equal direction, even with different intercepts." : "A right-angle rotation swaps run/rise and changes sign.",
    liveValues: (values) => parallel ? [{ id: "m1", label: "m1", value: round(values.m1) }, { id: "m2", label: "m2", value: round(values.m2) }, { id: "c1", label: "c1", value: values.c1 }, { id: "c2", label: "c2", value: values.c2 }, { id: "diff", label: "m1 - m2", value: round(values.m1 - values.m2) }] : [{ id: "m1", label: "m1", value: round(values.m1) }, { id: "m2", label: "m2", value: round(values.m2) }, { id: "product", label: "m1*m2", value: round(values.m1 * values.m2) }, { id: "angle", label: "angle between lines", value: `${round(Math.abs((Math.atan((values.m2 - values.m1) / (1 + values.m1 * values.m2)) * 180) / Math.PI), 1)} deg` }],
    invariants: (values) => parallel ? [{ id: "parallel", label: "parallel iff equal slopes", holds: Math.abs(values.m1 - values.m2) < 0.01, explanation: `m1 - m2 = ${round(values.m1 - values.m2)}.` }] : [{ id: "perpendicular", label: "perpendicular iff product -1", holds: Math.abs(values.m1 * values.m2 + 1) < 0.05, explanation: `m1*m2 = ${round(values.m1 * values.m2)}.` }],
    assumptions: [parallel ? "Lines are non-vertical and distinct." : "Horizontal/vertical special case is noted conceptually.", "Sliders provide keyboard fallback."],
    renderVisual: visual,
  };
}

function commonPointValues(values: Record<string, number>, extra: ReturnType<PhaseTwoProofConfig["liveValues"]>) {
  return [{ id: "P", label: "P coordinates", value: formatCoordinate({ x: values.x1, y: values.y1 }) }, { id: "Q", label: "Q coordinates", value: formatCoordinate({ x: values.x2, y: values.y2 }) }, ...extra];
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: answer, incorrectFeedback: "Use the linked visual measurement before deciding.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "other", label: "Something else", feedback: "Check the highlighted grid relation." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the relevant coordinate feature.", options: [{ id: "visual", label: "Use the coordinate visual relationship.", correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use a memorized shortcut only.", feedback: "The grid shows why the formula works." }] };
}

function step(title: string, index: number) {
  return { id: `s${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "measure" : "conclusion" };
}

export const phaseEightRouteSlugs = [
  ["coordinate-geometry", "distance-formula"],
  ["coordinate-geometry", "midpoint-formula"],
  ["coordinate-geometry", "slope-formula"],
  ["coordinate-geometry", "slope-intercept-line-equation"],
  ["coordinate-geometry", "parallel-lines-slope"],
  ["coordinate-geometry", "perpendicular-lines-slope"],
  ["coordinate-geometry", "circle-equation"],
  ["coordinate-geometry", "translation-of-points"],
] as const;

export const phaseEightConfigs = [
  distanceFormulaPhaseEightConfig,
  midpointFormulaPhaseEightConfig,
  slopeFormulaPhaseEightConfig,
  slopeInterceptPhaseEightConfig,
  parallelLinesSlopePhaseEightConfig,
  perpendicularLinesSlopePhaseEightConfig,
  circleEquationPhaseEightConfig,
  translationOfPointsPhaseEightConfig,
];
