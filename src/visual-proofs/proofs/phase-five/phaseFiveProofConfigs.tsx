import type { PhaseTwoProofConfig } from "../../components/PhaseTwoProofExperience";
import {
  formatTrigValue,
  phaseFiveTraceConfig,
  PythagoreanTrigIdentityVisual,
  RadiansArcRadiusVisual,
  RightTriangleTrigRatiosVisual,
  TangentRatioIdentityVisual,
  TrigGraphsFromUnitCircleVisual,
  UnitCircleSineCosineVisual,
} from "./PhaseFiveTrigVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const trigRoute = "/olympyard/practice/trigonometry";
const round = (value: number, digits = 3) => Number(value.toFixed(digits));
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
const sinDeg = (degrees: number) => Math.sin(degToRad(degrees));
const cosDeg = (degrees: number) => Math.cos(degToRad(degrees));
const tanDeg = (degrees: number) => (Math.abs(cosDeg(degrees)) < 0.03 ? undefined : sinDeg(degrees) / cosDeg(degrees));
const quadrant = (theta: number) => {
  const angle = ((theta % 360) + 360) % 360;
  if (angle === 0 || angle === 90 || angle === 180 || angle === 270 || angle === 360) return "axis";
  if (angle < 90) return "I";
  if (angle < 180) return "II";
  if (angle < 270) return "III";
  return "IV";
};

export const rightTriangleTrigRatiosPhaseFiveConfig: PhaseTwoProofConfig = {
  steps: ["Build a right triangle", "Identify theta", "Label opposite, adjacent, and hypotenuse", "Compare side ratios", "Resize the triangle", "Conclude the trig ratios"].map(step),
  parameters: [{ id: "theta", label: "Angle theta", min: 15, max: 75, defaultValue: 36, step: 1, unit: "deg" }, { id: "scale", label: "Triangle size", min: 2, max: 6, defaultValue: 4, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: trigRoute,
  prediction: { question: "If we make the triangle larger but keep theta the same, what happens to sin theta?", correctFeedback: "It stays the same because opposite and hypotenuse scale together.", incorrectFeedback: "Only the side lengths change; their ratio remains fixed for similar right triangles.", revealAfterAnswer: true, options: [{ id: "same", label: "It stays the same", correct: true, feedback: "Correct." }, { id: "larger", label: "It gets larger", feedback: "The opposite side grows, but the hypotenuse grows by the same factor." }, { id: "smaller", label: "It gets smaller", feedback: "The ratio is controlled by theta, not absolute size." }] },
  misconception: { question: "Do trig ratios depend on triangle size?", explanation: "They depend on the angle, not the absolute size, for similar right triangles.", visualHint: "Resize the triangle and compare the ratio bars.", options: [{ id: "angle", label: "They depend on theta, not size.", correct: true, feedback: "Correct." }, { id: "size", label: "They depend on size.", feedback: "Size changes both numerator and denominator together." }] },
  formulaTokens: () => [{ id: "sin theta", label: "sin theta", visualLabel: "sine ratio bar" }, { id: "cos theta", label: "cos theta", visualLabel: "cosine ratio bar" }, { id: "tan theta", label: "tan theta", visualLabel: "tangent ratio bar" }, { id: "opposite", label: "opposite", visualLabel: "opposite side" }, { id: "adjacent", label: "adjacent", visualLabel: "adjacent side" }, { id: "hypotenuse", label: "hypotenuse", visualLabel: "hypotenuse side" }],
  formula: () => "sin theta = opposite/hypotenuse, cos theta = adjacent/hypotenuse, tan theta = opposite/adjacent",
  explanation: () => "For a fixed acute angle, every similar right triangle keeps the same side ratios.",
  liveValues: ({ theta, scale }) => [{ id: "theta-deg", label: "theta degrees", value: round(theta, 1), unit: "deg" }, { id: "theta-rad", label: "theta radians", value: round(degToRad(theta), 3) }, { id: "opposite", label: "opposite", value: round(scale * sinDeg(theta)) }, { id: "adjacent", label: "adjacent", value: round(scale * cosDeg(theta)) }, { id: "hypotenuse", label: "hypotenuse", value: scale }, { id: "sin", label: "sin theta", value: round(sinDeg(theta)) }, { id: "cos", label: "cos theta", value: round(cosDeg(theta)) }, { id: "tan", label: "tan theta", value: round(sinDeg(theta) / cosDeg(theta)) }],
  invariants: ({ theta }) => [{ id: "ratio-scale", label: "Ratios remain same when scale changes", holds: true, explanation: `sin theta remains ${round(sinDeg(theta))} for every similar triangle size.` }],
  assumptions: ["The triangle stays right-angled.", "Theta is kept acute for the right-triangle definition model."],
  renderVisual: RightTriangleTrigRatiosVisual,
};

export const unitCircleSineCosinePhaseFiveConfig: PhaseTwoProofConfig = {
  steps: ["Draw the unit circle", "Pick an angle theta", "Locate the point on the circle", "Project to the axes", "Read x as cos theta and y as sin theta", "Track signs by quadrant"].map(step),
  parameters: [{ id: "theta", label: "Angle theta", min: 0, max: 360, defaultValue: 135, step: 1, unit: "deg" }],
  toggles: [labelsToggle, { id: "snap", label: "Snap to common angles", defaultValue: false }],
  olympyardRoute: trigRoute,
  prediction: { question: "In Quadrant II, what sign should cos theta have?", correctFeedback: "Negative. Cosine is the x-coordinate.", incorrectFeedback: "Look left of the y-axis: x-values are negative there.", revealAfterAnswer: true, options: [{ id: "negative", label: "Negative", correct: true, feedback: "Correct." }, { id: "positive", label: "Positive", feedback: "That is true in Quadrants I and IV, not Quadrant II." }] },
  misconception: { question: "Is sin theta always positive because it is a length?", explanation: "On the unit circle, sin theta is the y-coordinate and can be negative below the x-axis.", visualHint: "Drag the point below the x-axis.", options: [{ id: "coordinate", label: "No, it is a coordinate.", correct: true, feedback: "Correct." }, { id: "length", label: "Yes, it is always a length.", feedback: "The projection is signed on the coordinate plane." }] },
  formulaTokens: () => [{ id: "cos", label: "cos theta", visualLabel: "x-projection" }, { id: "sin", label: "sin theta", visualLabel: "y-projection" }, { id: "point", label: "(cos theta, sin theta)", visualLabel: "unit-circle point" }],
  formula: ({ theta }) => `P(${round(theta, 1)} deg) = (cos theta, sin theta)`,
  explanation: () => "The moving point's x-coordinate is cosine and its y-coordinate is sine.",
  liveValues: ({ theta }) => [{ id: "theta-deg", label: "theta degrees", value: round(theta, 1), unit: "deg" }, { id: "theta-rad", label: "theta radians", value: round(degToRad(theta), 3) }, { id: "quadrant", label: "quadrant", value: quadrant(theta) }, { id: "cos", label: "cos theta", value: formatTrigValue("cos", theta).rounded, exactValue: formatTrigValue("cos", theta).exact }, { id: "sin", label: "sin theta", value: formatTrigValue("sin", theta).rounded, exactValue: formatTrigValue("sin", theta).exact }, { id: "point", label: "point coordinates", value: `(${round(cosDeg(theta))}, ${round(sinDeg(theta))})` }],
  invariants: ({ theta }) => [{ id: "unit", label: "cos^2 theta + sin^2 theta = 1", holds: true, explanation: `${round(cosDeg(theta) ** 2)} + ${round(sinDeg(theta) ** 2)} = ${round(cosDeg(theta) ** 2 + sinDeg(theta) ** 2)}.` }],
  assumptions: ["The circle radius is 1.", "Exact values are shown for common angles where feasible."],
  renderVisual: UnitCircleSineCosineVisual,
};

export const pythagoreanTrigIdentityPhaseFiveConfig = makeUnitConfig(
  "sin^2 theta + cos^2 theta = 1",
  ["Start with the unit circle", "Draw radius 1", "Drop sine and cosine legs", "Apply Pythagorean theorem", "Drag theta and observe the sum", "Conclude the identity"],
  PythagoreanTrigIdentityVisual,
  "If theta changes, what happens to sin^2 theta + cos^2 theta?",
  "It remains 1.",
  "It comes from the unit circle radius being 1 for every angle.",
  [{ id: "sin2", label: "sin^2 theta", visualLabel: "vertical leg square" }, { id: "cos2", label: "cos^2 theta", visualLabel: "horizontal leg square" }, { id: "one", label: "1", visualLabel: "unit radius" }],
);

export const tangentRatioIdentityPhaseFiveConfig: PhaseTwoProofConfig = {
  ...makeUnitConfig("tan theta = sin theta / cos theta", ["Start on the unit circle", "Read sine as vertical rise", "Read cosine as horizontal run", "Form rise over run", "Compare to tangent", "Note when tangent is undefined"], TangentRatioIdentityVisual, "What happens to tan theta when cos theta gets very close to 0?", "tan theta becomes very large in magnitude or undefined.", "tan theta divides by cos theta, so it is undefined when cos theta = 0.", [{ id: "tan", label: "tan theta", visualLabel: "slope/tangent segment" }, { id: "sin", label: "sin theta", visualLabel: "vertical rise" }, { id: "cos", label: "cos theta", visualLabel: "horizontal run" }, { id: "divide", label: "/", visualLabel: "rise over run" }]),
  liveValues: ({ theta }) => {
    const tan = tanDeg(theta);
    return [{ id: "theta-deg", label: "theta degrees", value: round(theta, 1), unit: "deg" }, { id: "sin", label: "sin theta", value: round(sinDeg(theta)) }, { id: "cos", label: "cos theta", value: round(cosDeg(theta)), warning: Math.abs(cosDeg(theta)) < 0.08 ? "cos theta is near 0" : undefined }, { id: "tan", label: "tan theta", value: tan === undefined ? "undefined" : round(tan), warning: tan === undefined ? "undefined because cos theta is 0" : undefined }];
  },
  invariants: ({ theta }) => [{ id: "tan-ratio", label: "tan theta = sin theta / cos theta", holds: Math.abs(cosDeg(theta)) >= 0.03, explanation: Math.abs(cosDeg(theta)) < 0.03 ? "The quotient is undefined when cos theta is 0." : `${round(sinDeg(theta))} / ${round(cosDeg(theta))} = ${round(sinDeg(theta) / cosDeg(theta))}.` }],
};

export const radiansArcRadiusPhaseFiveConfig: PhaseTwoProofConfig = {
  steps: ["Draw a sector", "Mark radius r", "Mark arc length s", "Compare s to r", "Show one radian", "Conclude theta = s/r"].map(step),
  parameters: [{ id: "theta", label: "Angle theta", min: 20, max: 300, defaultValue: 90, step: 1, unit: "deg" }, { id: "radius", label: "Radius r", min: 3, max: 7, defaultValue: 4, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: trigRoute,
  prediction: { question: "If radius doubles but theta stays the same, what happens to arc length?", correctFeedback: "Arc length doubles, but s/r stays the same.", incorrectFeedback: "Arc length scales with radius; the radian ratio does not.", revealAfterAnswer: true, options: [{ id: "double", label: "Arc length doubles", correct: true, feedback: "Correct." }, { id: "same", label: "Arc length stays same", feedback: "The same angle cuts a longer arc on a larger circle." }] },
  misconception: { question: "Are radians just another arbitrary degree scale?", explanation: "Radians measure the ratio of arc length to radius.", visualHint: "Compare s and r while changing the radius.", options: [{ id: "ratio", label: "No, radians are s/r.", correct: true, feedback: "Correct." }, { id: "arbitrary", label: "Yes, arbitrary like degrees.", feedback: "The sector shows the ratio definition." }] },
  formulaTokens: () => [{ id: "theta", label: "theta", visualLabel: "central angle" }, { id: "s", label: "s", visualLabel: "arc length" }, { id: "r", label: "r", visualLabel: "radius" }, { id: "s-over-r", label: "s / r", visualLabel: "arc-radius ratio" }],
  formula: ({ theta, radius }) => `theta = s/r = ${round(radius * degToRad(theta))}/${radius} = ${round(degToRad(theta))} rad`,
  explanation: () => "A radian is built from the ratio of arc length to radius, so changing radius alone does not change theta.",
  liveValues: ({ theta, radius }) => [{ id: "radius", label: "radius r", value: radius }, { id: "theta-deg", label: "angle degrees", value: round(theta, 1), unit: "deg" }, { id: "theta-rad", label: "angle radians", value: round(degToRad(theta)) }, { id: "arc", label: "arc length s", value: round(radius * degToRad(theta)) }, { id: "ratio", label: "s/r", value: round((radius * degToRad(theta)) / radius) }],
  invariants: ({ theta }) => [{ id: "radian-ratio", label: "theta radians = s/r", holds: true, explanation: `s/r remains ${round(degToRad(theta))} for this angle.` }],
  assumptions: ["Theta is measured in radians inside s = r theta.", "The sector uses a circular arc."],
  renderVisual: RadiansArcRadiusVisual,
};

export const trigGraphsFromUnitCirclePhaseFiveConfig: PhaseTwoProofConfig = {
  ...makeUnitConfig("y = sin theta, x = cos theta", ["Start with the unit circle", "Rotate a point by theta", "Read the vertical sine projection", "Transfer that height to the graph", "Trace the sine wave", "See the repeating cycle"], TrigGraphsFromUnitCircleVisual, "When the unit-circle point is at the top, what is sin theta?", "1.", "The sine graph records the y-coordinate of the rotating unit-circle point.", [{ id: "sin", label: "sin theta", visualLabel: "projection and sine point" }, { id: "cos", label: "cos theta", visualLabel: "horizontal projection" }, { id: "theta", label: "theta", visualLabel: "graph input axis" }]),
  assumptions: ["The graph shows one full 0 to 2pi cycle.", `Trace model: ${phaseFiveTraceConfig.graph}.`],
  invariants: ({ theta }) => [{ id: "period", label: "Periodicity insight", holds: true, explanation: `After 360 degrees the sine trace repeats; current graph point is (${round(degToRad(theta))}, ${round(sinDeg(theta))}).` }],
};

function makeUnitConfig(formulaText: string, steps: string[], renderVisual: PhaseTwoProofConfig["renderVisual"], predictionQuestion: string, predictionAnswer: string, misconceptionExplanation: string, tokens: ReturnType<PhaseTwoProofConfig["formulaTokens"]>): PhaseTwoProofConfig {
  return {
    steps: steps.map(step),
    parameters: [{ id: "theta", label: "Angle theta", min: 0, max: 360, defaultValue: 55, step: 1, unit: "deg" }],
    toggles: [labelsToggle],
    olympyardRoute: trigRoute,
    prediction: { question: predictionQuestion, correctFeedback: predictionAnswer, incorrectFeedback: "Use the unit-circle projection before deciding.", revealAfterAnswer: true, options: [{ id: "correct", label: predictionAnswer, correct: true, feedback: "Correct." }, { id: "other", label: "It depends on triangle size", feedback: "The unit circle radius is fixed at 1." }] },
    misconception: { question: "Does this identity only work for special angles?", explanation: misconceptionExplanation, visualHint: "Drag theta and watch the linked values.", options: [{ id: "all", label: "It follows from the unit-circle model.", correct: true, feedback: "Correct." }, { id: "special", label: "Only common angles work.", feedback: "Common angles are easier to name exactly, but the identity is general." }] },
    formulaTokens: () => tokens,
    formula: () => formulaText,
    explanation: () => misconceptionExplanation,
    liveValues: ({ theta }) => {
      const tan = tanDeg(theta);
      return [{ id: "theta-deg", label: "theta degrees", value: round(theta, 1), unit: "deg" }, { id: "theta-rad", label: "theta radians", value: round(degToRad(theta)) }, { id: "sin", label: "sin theta", value: round(sinDeg(theta)) }, { id: "cos", label: "cos theta", value: round(cosDeg(theta)) }, { id: "tan", label: "tan theta", value: tan === undefined ? "undefined" : round(tan), warning: tan === undefined ? "undefined because cos theta is 0" : undefined }];
    },
    invariants: ({ theta }) => [{ id: "unit-identity", label: "sin^2 theta + cos^2 theta = 1", holds: true, explanation: `${round(sinDeg(theta) ** 2)} + ${round(cosDeg(theta) ** 2)} = ${round(sinDeg(theta) ** 2 + cosDeg(theta) ** 2)}.` }],
    assumptions: ["The circle radius is 1.", "Rounded values are shown away from common angles."],
    renderVisual,
  };
}

function step(title: string, index: number) {
  return { id: `s${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "link" : "conclusion" };
}

export const phaseFiveRouteSlugs = [
  ["trigonometry", "right-triangle-trig-ratios"],
  ["trigonometry", "unit-circle-sine-cosine"],
  ["trigonometry", "pythagorean-trig-identity"],
  ["trigonometry", "tangent-ratio-identity"],
  ["trigonometry", "radians-arc-radius"],
  ["trigonometry", "trig-graphs-from-unit-circle"],
] as const;

export const phaseFiveConfigs = [
  rightTriangleTrigRatiosPhaseFiveConfig,
  unitCircleSineCosinePhaseFiveConfig,
  pythagoreanTrigIdentityPhaseFiveConfig,
  tangentRatioIdentityPhaseFiveConfig,
  radiansArcRadiusPhaseFiveConfig,
  trigGraphsFromUnitCirclePhaseFiveConfig,
];
