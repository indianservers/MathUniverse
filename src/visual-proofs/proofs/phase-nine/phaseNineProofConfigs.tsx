import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import { formatCoordinate, type Point } from "../phase-eight/PhaseEightCoordinateVisualModels";
import {
  CoordinatePythagoreanVisual,
  PointSlopeLineVisual,
  ReflectionAcrossAxesVisual,
  RotationAboutOriginVisual,
  ScalingDilationOriginVisual,
  SectionFormulaVisual,
  TriangleAreaCoordinatesVisual,
} from "./PhaseNineCoordinateVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const coordinateRoute = "/olympyard/practice/coordinate-geometry";
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const dist = (p: Point, q: Point) => Math.hypot(q.x - p.x, q.y - p.y);

export const sectionFormulaPhaseNineConfig: PhaseTwoProofConfig = {
  steps: ["Place endpoints A and B", "Choose ratio m:n", "Divide AB into m+n parts", "Locate P internally", "Compute weighted coordinates", "Conclude the section formula"].map(step),
  parameters: pointPairParams("A", "B", -4, -2, 5, 4, [{ id: "m", label: "ratio m", min: 1, max: 6, defaultValue: 2, step: 1 }, { id: "n", label: "ratio n", min: 1, max: 6, defaultValue: 3, step: 1 }]),
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("If m = n, where is point P?", "At the midpoint of AB."),
  misconception: misconception("Ratio m:n means P is m parts away from B and n parts away from A.", "Here AP:PB = m:n, so the coordinate formula weights B by m and A by n."),
  formulaTokens: () => [{ id: "x-weight", label: "mx2 + nx1", visualLabel: "weighted x-average" }, { id: "y-weight", label: "my2 + ny1", visualLabel: "weighted y-average" }, { id: "m:n", label: "m:n", visualLabel: "AP:PB division" }, { id: "total", label: "m + n", visualLabel: "total weight" }],
  formula: ({ x1, y1, x2, y2, m, n }) => `P = ((${m}*${x2} + ${n}*${x1})/${m + n}, (${m}*${y2} + ${n}*${y1})/${m + n})`,
  explanation: () => "The section point is a weighted average: larger m makes AP longer and pulls P toward B.",
  liveValues: ({ x1, y1, x2, y2, m, n }) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const p = sectionPoint(a, b, m, n);
    const ap = dist(a, p);
    const pb = dist(p, b);
    return [{ id: "A", label: "A coordinates", value: formatCoordinate(a) }, { id: "B", label: "B coordinates", value: formatCoordinate(b) }, { id: "m", label: "m", value: m }, { id: "n", label: "n", value: n }, { id: "P", label: "P coordinates", value: formatCoordinate(p) }, { id: "AP", label: "AP length", value: round(ap) }, { id: "PB", label: "PB length", value: round(pb) }, { id: "ratio", label: "AP:PB", value: `${round(ap / Math.max(0.01, pb))}:1` }];
  },
  invariants: ({ x1, y1, x2, y2, m, n }) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const p = sectionPoint(a, b, m, n);
    const ratio = dist(a, p) / Math.max(0.01, dist(p, b));
    return [{ id: "section-ratio", label: "AP/PB = m/n", holds: Math.abs(ratio - m / n) < 0.03, explanation: `AP/PB = ${round(ratio)}, m/n = ${round(m / n)}.` }];
  },
  assumptions: ["P divides AB internally.", "Points snap to integer grid coordinates; P may be fractional."],
  renderVisual: SectionFormulaVisual,
};

export const pointSlopeLinePhaseNineConfig: PhaseTwoProofConfig = {
  steps: ["Choose an anchor point", "Choose a slope", "Draw rise/run from the anchor", "Pick another point on the line", "Compare changes from the anchor", "Conclude y - y1 = m(x - x1)"].map(step),
  parameters: [{ id: "x1", label: "anchor x1", min: -6, max: 6, defaultValue: -2, step: 1 }, { id: "y1", label: "anchor y1", min: -6, max: 6, defaultValue: 1, step: 1 }, { id: "m", label: "slope m", min: -3, max: 3, defaultValue: 1, step: 0.25 }, { id: "x", label: "test x", min: -7, max: 7, defaultValue: 4, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("If the anchor point moves but slope m stays the same, what happens to the line?", "It shifts to pass through the new point but keeps the same steepness."),
  misconception: misconception("Point-slope form only works when the point is on the y-axis.", "The point can be anywhere; the formula measures change relative to that anchor point."),
  formulaTokens: () => [{ id: "rise", label: "y - y1", visualLabel: "vertical change" }, { id: "run", label: "x - x1", visualLabel: "horizontal change" }, { id: "m", label: "m", visualLabel: "slope triangle" }, { id: "anchor", label: "(x1, y1)", visualLabel: "anchor point" }],
  formula: ({ x1, y1, m, x }) => `y - ${y1} = ${round(m)}(${x} - ${x1})`,
  explanation: () => "Point-slope form says every point Q on the line keeps the same rise/run from the anchor point P.",
  liveValues: ({ x1, y1, m, x }) => {
    const y = y1 + m * (x - x1);
    const dx = x - x1;
    const dy = y - y1;
    return [{ id: "anchor", label: "anchor point", value: formatCoordinate({ x: x1, y: y1 }) }, { id: "m", label: "slope m", value: round(m) }, { id: "x", label: "test x", value: x }, { id: "y", label: "computed y", value: round(y) }, { id: "dx", label: "delta x", value: dx }, { id: "dy", label: "delta y", value: round(dy) }, { id: "ratio", label: "delta y / delta x", value: dx === 0 ? "undefined slope" : round(dy / dx) }];
  },
  invariants: ({ x1, y1, m, x }) => {
    const y = y1 + m * (x - x1);
    return [{ id: "point-slope", label: "y - y1 = m(x - x1)", holds: true, explanation: `${round(y - y1)} = ${round(m)}(${round(x - x1)}).` }];
  },
  assumptions: ["The line is non-vertical.", "The test point stays on the displayed line."],
  renderVisual: PointSlopeLineVisual,
};

export const triangleAreaCoordinatesPhaseNineConfig: PhaseTwoProofConfig = {
  steps: ["Place three vertices", "Connect the triangle", "Trace shoelace products", "Compute signed area", "Take absolute value", "Conclude the coordinate area formula"].map(step),
  parameters: [{ id: "x1", label: "A x", min: -7, max: 7, defaultValue: -4, step: 1 }, { id: "y1", label: "A y", min: -6, max: 6, defaultValue: -2, step: 1 }, { id: "x2", label: "B x", min: -7, max: 7, defaultValue: 4, step: 1 }, { id: "y2", label: "B y", min: -6, max: 6, defaultValue: -1, step: 1 }, { id: "x3", label: "C x", min: -7, max: 7, defaultValue: 1, step: 1 }, { id: "y3", label: "C y", min: -6, max: 6, defaultValue: 5, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("What happens to the area if all three points become collinear?", "The area becomes 0."),
  misconception: misconception("Coordinate triangle area is always positive before absolute value.", "The signed area depends on vertex order; absolute value gives geometric area."),
  formulaTokens: () => [{ id: "term1", label: "x1(y2-y3)", visualLabel: "first shoelace contribution" }, { id: "term2", label: "x2(y3-y1)", visualLabel: "second contribution" }, { id: "term3", label: "x3(y1-y2)", visualLabel: "third contribution" }, { id: "half", label: "1/2", visualLabel: "triangle half relation" }, { id: "abs", label: "| |", visualLabel: "absolute area" }],
  formula: () => "Area = 1/2 |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|",
  explanation: () => "Shoelace area is signed by vertex order; the absolute value returns geometric area.",
  liveValues: ({ x1, y1, x2, y2, x3, y3 }) => {
    const forward = x1 * y2 + x2 * y3 + x3 * y1;
    const backward = y1 * x2 + y2 * x3 + y3 * x1;
    const signed = 0.5 * (forward - backward);
    return [{ id: "A", label: "A coordinates", value: formatCoordinate({ x: x1, y: y1 }) }, { id: "B", label: "B coordinates", value: formatCoordinate({ x: x2, y: y2 }) }, { id: "C", label: "C coordinates", value: formatCoordinate({ x: x3, y: y3 }) }, { id: "forward", label: "shoelace forward sum", value: round(forward) }, { id: "backward", label: "shoelace backward sum", value: round(backward) }, { id: "signed", label: "signed area", value: round(signed) }, { id: "area", label: "absolute area", value: round(Math.abs(signed)), warning: Math.abs(signed) < 0.01 ? "collinear: area is 0" : undefined }];
  },
  invariants: (values) => [{ id: "triangle-area", label: "absolute area is non-negative", holds: true, explanation: `Area = ${triangleArea(values)} after absolute value.` }],
  assumptions: ["Vertex order controls signed area.", "Collinear points produce zero area."],
  renderVisual: TriangleAreaCoordinatesVisual,
};

export const reflectionAcrossAxesPhaseNineConfig: PhaseTwoProofConfig = {
  steps: ["Place the original point", "Choose mirror axis", "Measure distance to axis", "Flip across the axis", "Compare coordinates", "Conclude the reflection rule"].map(step),
  parameters: [{ id: "x", label: "P x", min: -7, max: 7, defaultValue: 4, step: 1 }, { id: "y", label: "P y", min: -6, max: 6, defaultValue: 3, step: 1 }, { id: "axis", label: "axis: 1 x, 2 y", min: 1, max: 2, defaultValue: 1, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("When reflecting across the x-axis, which coordinate changes sign?", "The y-coordinate."),
  misconception: misconception("Reflection across x-axis changes x.", "Reflecting across the x-axis keeps x the same and flips y."),
  formulaTokens: ({ axis }) => Math.round(axis) === 2 ? [{ id: "x-neg", label: "x -> -x", visualLabel: "y-axis reflection" }, { id: "unchanged", label: "y unchanged", visualLabel: "same y coordinate" }, { id: "axis", label: "mirror axis", visualLabel: "y-axis" }] : [{ id: "y-neg", label: "y -> -y", visualLabel: "x-axis reflection" }, { id: "unchanged", label: "x unchanged", visualLabel: "same x coordinate" }, { id: "axis", label: "mirror axis", visualLabel: "x-axis" }],
  formula: ({ x, y, axis }) => Math.round(axis) === 2 ? `(${x}, ${y}) -> (${-x}, ${y})` : `(${x}, ${y}) -> (${x}, ${-y})`,
  explanation: () => "Reflection makes the image the same distance from the mirror axis on the opposite side.",
  liveValues: ({ x, y, axis }) => {
    const useY = Math.round(axis) === 2;
    const image = useY ? { x: -x, y } : { x, y: -y };
    const d = useY ? Math.abs(x) : Math.abs(y);
    return [{ id: "original", label: "original coordinates", value: formatCoordinate({ x, y }) }, { id: "image", label: "reflected coordinates", value: formatCoordinate(image) }, { id: "axis", label: "selected axis", value: useY ? "y-axis" : "x-axis" }, { id: "before", label: "distance before", value: d }, { id: "after", label: "distance after", value: d }];
  },
  invariants: () => [{ id: "reflection-distance", label: "same distance from mirror axis", holds: true, explanation: "The original and image sit equally far from the selected axis." }],
  assumptions: ["Axis selector uses 1 for x-axis and 2 for y-axis.", "Only coordinate-axis reflections are shown."],
  renderVisual: ReflectionAcrossAxesVisual,
};

export const rotationAboutOriginPhaseNineConfig: PhaseTwoProofConfig = {
  steps: ["Place the original point", "Choose rotation angle", "Draw arc around origin", "Rotate the point", "Compare coordinates", "Confirm distance is preserved"].map(step),
  parameters: [{ id: "x", label: "P x", min: -6, max: 6, defaultValue: 4, step: 1 }, { id: "y", label: "P y", min: -6, max: 6, defaultValue: 2, step: 1 }, { id: "angle", label: "angle", min: 90, max: 270, defaultValue: 90, step: 90, unit: "deg" }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("What happens to distance from origin during rotation?", "It stays the same."),
  misconception: misconception("Rotation changes the point's distance from the origin.", "Rotation turns a point around the origin; it preserves distance."),
  formulaTokens: () => [{ id: "r90", label: "(-y, x)", visualLabel: "90 degree rotation" }, { id: "r180", label: "(-x, -y)", visualLabel: "180 degree rotation" }, { id: "r270", label: "(y, -x)", visualLabel: "270 degree rotation" }, { id: "origin", label: "origin", visualLabel: "rotation center" }],
  formula: ({ x, y, angle }) => `${angle} deg: (${x}, ${y}) -> ${formatCoordinate(rotatePoint({ x, y }, angle))}`,
  explanation: () => "Rotation about the origin changes direction but preserves distance from origin.",
  liveValues: ({ x, y, angle }) => {
    const image = rotatePoint({ x, y }, angle);
    return [{ id: "original", label: "original coordinates", value: formatCoordinate({ x, y }) }, { id: "angle", label: "rotation angle", value: `${angle} deg` }, { id: "image", label: "rotated coordinates", value: formatCoordinate(image) }, { id: "before", label: "distance from origin before", value: round(Math.hypot(x, y)) }, { id: "after", label: "distance from origin after", value: round(Math.hypot(image.x, image.y)) }];
  },
  invariants: ({ x, y, angle }) => {
    const image = rotatePoint({ x, y }, angle);
    return [{ id: "rotation-distance", label: "distance from origin is preserved", holds: Math.abs(Math.hypot(x, y) - Math.hypot(image.x, image.y)) < 0.01, explanation: "OP and OP' are radii of the same circle." }];
  },
  assumptions: ["Special rotations are snapped to 90, 180, and 270 degrees.", "Counterclockwise orientation is used."],
  renderVisual: RotationAboutOriginVisual,
};

export const scalingDilationOriginPhaseNineConfig: PhaseTwoProofConfig = {
  steps: ["Place the original point", "Draw ray from origin", "Choose scale factor k", "Multiply coordinates", "Locate the image", "Confirm distances scale by k"].map(step),
  parameters: [{ id: "x", label: "P x", min: -5, max: 5, defaultValue: 3, step: 1 }, { id: "y", label: "P y", min: -5, max: 5, defaultValue: 2, step: 1 }, { id: "k", label: "scale factor k", min: -2, max: 3, defaultValue: 1.5, step: 0.25 }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("If k = 2, what happens to the distance from the origin?", "It doubles."),
  misconception: misconception("Dilation means adding k to x and y.", "Dilation multiplies coordinates by k; translation adds."),
  formulaTokens: () => [{ id: "kx", label: "kx", visualLabel: "scaled x-coordinate" }, { id: "ky", label: "ky", visualLabel: "scaled y-coordinate" }, { id: "k", label: "k", visualLabel: "scale factor" }, { id: "origin", label: "origin", visualLabel: "dilation center" }],
  formula: ({ x, y, k }) => `(${x}, ${y}) -> (${round(k * x)}, ${round(k * y)})`,
  explanation: () => "Dilation from the origin multiplies every coordinate by k, so distance from origin is scaled by |k|.",
  liveValues: ({ x, y, k }) => [{ id: "original", label: "original point", value: formatCoordinate({ x, y }) }, { id: "k", label: "k", value: round(k) }, { id: "image", label: "image point", value: formatCoordinate({ x: k * x, y: k * y }) }, { id: "before", label: "original distance from origin", value: round(Math.hypot(x, y)) }, { id: "after", label: "image distance from origin", value: round(Math.hypot(k * x, k * y)) }],
  invariants: ({ x, y, k }) => [{ id: "dilation-distance", label: "distance from origin is scaled by |k|", holds: true, explanation: `${round(Math.hypot(k * x, k * y))} = |${round(k)}| x ${round(Math.hypot(x, y))}.` }],
  assumptions: ["Negative k is shown as reversal through the origin.", "Dragging P' estimates k by projection onto OP."],
  renderVisual: ScalingDilationOriginVisual,
};

export const coordinatePythagoreanPhaseNineConfig: PhaseTwoProofConfig = {
  steps: ["Place right triangle on axes", "Set horizontal leg a", "Set vertical leg b", "Measure hypotenuse with distance formula", "Square both sides", "Conclude a^2 + b^2 = c^2"].map(step),
  parameters: [{ id: "a", label: "leg a", min: 2, max: 8, defaultValue: 3, step: 1 }, { id: "b", label: "leg b", min: 2, max: 8, defaultValue: 4, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: coordinateRoute,
  prediction: prompt("If a = 3 and b = 4, what is c?", "5."),
  misconception: misconception("The coordinate proof is different from the Pythagorean theorem.", "It is the same theorem expressed through coordinate distances."),
  formulaTokens: () => [{ id: "a2", label: "a^2", visualLabel: "horizontal leg square/run" }, { id: "b2", label: "b^2", visualLabel: "vertical leg square/rise" }, { id: "c2", label: "c^2", visualLabel: "hypotenuse square/distance" }],
  formula: ({ a, b }) => `${a * a} + ${b * b} = ${round(Math.hypot(a, b) ** 2)}`,
  explanation: () => "With the legs on the coordinate axes, the distance formula for BC becomes c^2 = a^2 + b^2.",
  liveValues: ({ a, b }) => [{ id: "a", label: "a", value: a }, { id: "b", label: "b", value: b }, { id: "c", label: "c rounded", value: round(Math.hypot(a, b)) }, { id: "a2", label: "a^2", value: a * a }, { id: "b2", label: "b^2", value: b * b }, { id: "c2", label: "c^2", value: round(Math.hypot(a, b) ** 2) }],
  invariants: ({ a, b }) => [{ id: "pythagorean", label: "a^2 + b^2 = c^2", holds: Math.abs(a * a + b * b - Math.hypot(a, b) ** 2) < 0.01, explanation: "The hypotenuse is the distance from (a,0) to (0,b)." }],
  assumptions: ["A is fixed at the origin.", "B drags along the x-axis and C drags along the y-axis."],
  renderVisual: CoordinatePythagoreanVisual,
};

export const phaseNineRouteSlugs = [
  ["coordinate-geometry", "section-formula"],
  ["coordinate-geometry", "point-slope-line-equation"],
  ["coordinate-geometry", "triangle-area-coordinates"],
  ["coordinate-geometry", "reflection-across-axes"],
  ["coordinate-geometry", "rotation-about-origin"],
  ["coordinate-geometry", "scaling-dilation-origin"],
  ["coordinate-geometry", "coordinate-proof-pythagorean-theorem"],
] as const;

export const allCoordinateRouteSlugs = [
  ["coordinate-geometry", "distance-formula"],
  ["coordinate-geometry", "midpoint-formula"],
  ["coordinate-geometry", "section-formula"],
  ["coordinate-geometry", "slope-formula"],
  ["coordinate-geometry", "slope-intercept-line-equation"],
  ["coordinate-geometry", "point-slope-line-equation"],
  ["coordinate-geometry", "parallel-lines-slope"],
  ["coordinate-geometry", "perpendicular-lines-slope"],
  ["coordinate-geometry", "triangle-area-coordinates"],
  ["coordinate-geometry", "circle-equation"],
  ["coordinate-geometry", "translation-of-points"],
  ["coordinate-geometry", "reflection-across-axes"],
  ["coordinate-geometry", "rotation-about-origin"],
  ["coordinate-geometry", "scaling-dilation-origin"],
  ["coordinate-geometry", "coordinate-proof-pythagorean-theorem"],
] as const;

export const phaseNineConfigs = [
  sectionFormulaPhaseNineConfig,
  pointSlopeLinePhaseNineConfig,
  triangleAreaCoordinatesPhaseNineConfig,
  reflectionAcrossAxesPhaseNineConfig,
  rotationAboutOriginPhaseNineConfig,
  scalingDilationOriginPhaseNineConfig,
  coordinatePythagoreanPhaseNineConfig,
];

function pointPairParams(a: string, b: string, x1: number, y1: number, x2: number, y2: number, extra: PhaseTwoProofConfig["parameters"] = []) {
  return [{ id: "x1", label: `${a} x`, min: -8, max: 8, defaultValue: x1, step: 1 }, { id: "y1", label: `${a} y`, min: -8, max: 8, defaultValue: y1, step: 1 }, { id: "x2", label: `${b} x`, min: -8, max: 8, defaultValue: x2, step: 1 }, { id: "y2", label: `${b} y`, min: -8, max: 8, defaultValue: y2, step: 1 }, ...extra];
}

function sectionPoint(a: Point, b: Point, m: number, n: number) {
  return { x: (m * b.x + n * a.x) / (m + n), y: (m * b.y + n * a.y) / (m + n) };
}

function rotatePoint(p: Point, angle: number): Point {
  if (angle === 90) return { x: -p.y, y: p.x };
  if (angle === 180) return { x: -p.x, y: -p.y };
  return { x: p.y, y: -p.x };
}

function triangleArea(values: PhaseTwoValues) {
  const forward = values.x1 * values.y2 + values.x2 * values.y3 + values.x3 * values.y1;
  const backward = values.y1 * values.x2 + values.y2 * values.x3 + values.y3 * values.x1;
  return round(Math.abs(0.5 * (forward - backward)));
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: answer, incorrectFeedback: "Use the coordinate visual before deciding.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "other", label: "Something else", feedback: "Check the highlighted coordinate relationship." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the linked coordinate feature.", options: [{ id: "visual", label: "Use the visual coordinate relationship.", correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use only the memorized rule.", feedback: "The grid explains why the rule works." }] };
}

function step(title: string, index: number) {
  return { id: `p9-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "measure" : "conclusion" };
}
