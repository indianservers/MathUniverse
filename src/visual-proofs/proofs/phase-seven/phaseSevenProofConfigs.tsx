import type { PhaseTwoProofConfig } from "../../components/PhaseTwoProofExperience";
import { approximationStatus, ArcLengthFormulaVisual, phaseSevenBrowserSmokeStatus, SmallAngleApproximationVisual } from "./PhaseSevenTrigVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const trigRoute = "/olympyard/practice/trigonometry";
const round = (value: number, digits = 3) => Number(value.toFixed(digits));
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
const sinDeg = (degrees: number) => Math.sin(degToRad(degrees));
const tanDeg = (degrees: number) => Math.tan(degToRad(degrees));
const percentError = (theta: number) => (degToRad(theta) === 0 ? 0 : Math.abs((degToRad(theta) - sinDeg(theta)) / degToRad(theta)) * 100);

export const smallAngleApproximationPhaseSevenConfig: PhaseTwoProofConfig = {
  steps: ["Start with a unit circle", "Mark a small angle theta", "Compare arc length theta with sine height", "Measure the small gap", "Increase theta and watch the error grow", "Conclude sin theta is approximately theta only for small radian theta"].map(step),
  parameters: [{ id: "theta", label: "Angle theta", min: 0, max: 60, defaultValue: 8, step: 0.5, unit: "deg" }],
  toggles: [labelsToggle, { id: "expanded", label: "Expand to 60 degrees", defaultValue: false }],
  olympyardRoute: trigRoute,
  prediction: { question: "If theta gets closer to 0, what happens to the difference between theta and sin theta?", correctFeedback: "It gets smaller and approaches 0.", incorrectFeedback: "Watch the highlighted gap shrink as theta approaches 0.", revealAfterAnswer: true, options: [{ id: "smaller", label: "It gets smaller", correct: true, feedback: "Correct." }, { id: "larger", label: "It gets larger", feedback: "The arc and sine height coincide more closely near 0." }] },
  misconception: { question: "Does sin theta approximately equal theta work for degrees too?", explanation: "The approximation uses theta measured in radians; degree values must be converted first.", visualHint: "Highlight the radian warning.", options: [{ id: "radians", label: "No, theta must be in radians.", correct: true, feedback: "Correct." }, { id: "degrees", label: "Yes, degrees work directly.", feedback: "A degree number is not the same length as a unit-circle arc." }] },
  formulaTokens: () => [{ id: "sin", label: "sin theta", visualLabel: "vertical sine segment" }, { id: "theta", label: "theta", visualLabel: "arc length" }, { id: "gap", label: "approximately equal", visualLabel: "small visible gap" }, { id: "radians", label: "radians", visualLabel: "unit warning" }],
  formula: ({ theta }) => `sin(theta) ~= theta for small theta in radians; error = ${round(degToRad(theta) - sinDeg(theta), 5)}`,
  explanation: ({ theta }) => `At ${round(theta, 1)} degrees, theta is ${round(degToRad(theta))} radians and the approximation is ${approximationStatus(theta)}.`,
  liveValues: ({ theta }) => [{ id: "theta-deg", label: "theta degrees", value: round(theta, 1), unit: "deg" }, { id: "theta-rad", label: "theta radians", value: round(degToRad(theta)) }, { id: "sin", label: "sin theta", value: round(sinDeg(theta)) }, { id: "tan", label: "tan theta", value: round(tanDeg(theta)) }, { id: "arc", label: "arc length theta", value: round(degToRad(theta)) }, { id: "abs-error", label: "absolute error", value: round(degToRad(theta) - sinDeg(theta), 5), warning: theta > 20 ? "Approximation is no longer small-angle quality." : undefined }, { id: "percent-error", label: "percent error", value: `${round(percentError(theta), 2)}%` }, { id: "status", label: "approximation status", value: approximationStatus(theta) }],
  invariants: ({ theta }) => [{ id: "approaches-zero", label: "Error approaches 0 as theta approaches 0", holds: true, explanation: `Current absolute error is ${round(degToRad(theta) - sinDeg(theta), 5)} radians.` }],
  assumptions: ["Theta must be measured in radians inside sin theta ~= theta.", "Default view keeps the useful small-angle range visible.", `Browser smoke status: ${phaseSevenBrowserSmokeStatus}.`],
  renderVisual: SmallAngleApproximationVisual,
};

export const arcLengthFormulaPhaseSevenConfig: PhaseTwoProofConfig = {
  steps: ["Start from the radian definition", "Mark radius r", "Mark angle theta in radians", "Highlight arc length s", "Scale radius and angle", "Conclude s = r theta"].map(step),
  parameters: [{ id: "theta", label: "Angle theta", min: 10, max: 300, defaultValue: 120, step: 1, unit: "deg" }, { id: "radius", label: "Radius r", min: 3, max: 7, defaultValue: 4, step: 1 }],
  toggles: [labelsToggle],
  olympyardRoute: trigRoute,
  prediction: { question: "If theta is fixed and r doubles, what happens to arc length s?", correctFeedback: "Arc length doubles because s = r theta.", incorrectFeedback: "Theta is a ratio; multiplying radius scales the actual arc length.", revealAfterAnswer: true, options: [{ id: "double", label: "s doubles", correct: true, feedback: "Correct." }, { id: "same", label: "s stays the same", feedback: "A larger circle cuts a longer arc for the same angle." }] },
  misconception: { question: "Can theta be used in degrees directly in s = r theta?", explanation: "No. The formula s = r theta requires theta in radians.", visualHint: "Highlight theta and the radian conversion.", options: [{ id: "radians", label: "Theta must be in radians.", correct: true, feedback: "Correct." }, { id: "degrees", label: "Degrees can be used directly.", feedback: "Degrees must be converted to radians first." }] },
  formulaTokens: () => [{ id: "s", label: "s", visualLabel: "arc length" }, { id: "r", label: "r", visualLabel: "radius" }, { id: "theta", label: "theta", visualLabel: "central angle" }, { id: "radians", label: "radians", visualLabel: "angle unit" }],
  formula: ({ theta, radius }) => `s = r theta = ${radius} x ${round(degToRad(theta))} = ${round(radius * degToRad(theta))}`,
  explanation: () => "Arc length equals radius times the radian measure of the central angle.",
  liveValues: ({ theta, radius }) => [{ id: "radius", label: "radius r", value: radius }, { id: "theta-deg", label: "theta degrees", value: round(theta, 1), unit: "deg" }, { id: "theta-rad", label: "theta radians", value: round(degToRad(theta)) }, { id: "arc", label: "arc length s", value: round(radius * degToRad(theta)) }, { id: "ratio", label: "s/r", value: round((radius * degToRad(theta)) / radius) }],
  invariants: ({ theta, radius }) => [{ id: "arc-length", label: "s = r theta", holds: true, explanation: `${round(radius * degToRad(theta))} = ${radius} x ${round(degToRad(theta))}.` }],
  assumptions: ["Theta is converted to radians before applying s = r theta.", "The model uses a circular arc."],
  renderVisual: ArcLengthFormulaVisual,
};

export const lawOfCosinesCircleConstructionPhaseSevenConfig: PhaseTwoProofConfig = {
  steps: ["Draw triangle ABC", "Place the circle through the included-angle joint", "Extend the baseline by a", "Extend the side line to show a - c", "Compare the auxiliary right triangle", "Connect the chord relation to the cosine rule"].map(step),
  parameters: [{ id: "theta", label: "Included angle theta", min: 25, max: 120, defaultValue: 62, step: 1, unit: "deg" }, { id: "radius", label: "Circle radius", min: 3, max: 7, defaultValue: 5, step: 0.5 }],
  toggles: [labelsToggle],
  olympyardRoute: trigRoute,
  prediction: { question: "What part of the construction changes when theta changes?", correctFeedback: "The projected chord length changes with cos(theta).", incorrectFeedback: "Watch the chord/projection labels tied to theta.", revealAfterAnswer: true, options: [{ id: "projection", label: "The projection/chord length changes", correct: true, feedback: "Correct." }, { id: "base", label: "Only the base label changes", feedback: "The geometry changes because cos(theta) changes the projection." }] },
  misconception: { question: "Is c always found by a^2 + b^2?", explanation: "No. That is the right-triangle case. The correction term 2ab cos(theta) handles non-right included angles.", visualHint: "Compare the circle chord and cosine correction labels.", options: [{ id: "correction", label: "No, the cosine correction is needed.", correct: true, feedback: "Correct." }, { id: "pythagoras-only", label: "Yes, Pythagoras is enough.", feedback: "Only when theta is 90 degrees does cos(theta) become 0." }] },
  formulaTokens: () => [{ id: "c2", label: "c^2", visualLabel: "opposite side squared" }, { id: "a2", label: "a^2", visualLabel: "base square" }, { id: "b2", label: "b^2", visualLabel: "side square" }, { id: "correction", label: "2ab cos(theta)", visualLabel: "projection correction" }],
  formula: ({ theta, radius }) => `c^2 = a^2 + b^2 - 2ab cos(theta); theta = ${round(theta, 1)} deg, circle radius = ${radius}`,
  explanation: () => "The circle construction exposes the projection term that corrects Pythagoras for a non-right included angle.",
  liveValues: ({ theta, radius }) => [{ id: "theta", label: "theta", value: round(theta, 1), unit: "deg" }, { id: "cos", label: "cos theta", value: round(Math.cos(degToRad(theta))) }, { id: "radius", label: "circle radius", value: radius }, { id: "correction", label: "correction factor", value: round(2 * radius * Math.cos(degToRad(theta))) }],
  invariants: () => [{ id: "cosine-rule", label: "Cosine rule balances all side lengths", holds: true, explanation: "The correction term disappears only at a right angle." }],
  assumptions: ["The construction treats theta as the included angle between a and b.", "The visual labels keep side names consistent with the cosine rule."],
  renderVisual: ArcLengthFormulaVisual,
};

function step(title: string, index: number) {
  return { id: `s${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "measure" : "conclusion" };
}

export const phaseSevenRouteSlugs = [
  ["trigonometry", "arc-length-formula"],
  ["trigonometry", "small-angle-approximation"],
  ["trigonometry", "law-of-cosines-circle-construction"],
] as const;

export const phaseSevenConfigs = [arcLengthFormulaPhaseSevenConfig, smallAngleApproximationPhaseSevenConfig, lawOfCosinesCircleConstructionPhaseSevenConfig];
