import type { PhaseTwoProofConfig } from "../../components/PhaseTwoProofExperience";
import {
  closeWithin,
  ComplementaryAngleIdentitiesVisual,
  CosineAngleAdditionVisual,
  CosineRuleVisual,
  DoubleAngleIdentitiesVisual,
  phaseSixDoubleAngleTabs,
  SineAngleAdditionVisual,
  SineRuleVisual,
  TriangleAreaSineVisual,
} from "./PhaseSixTrigVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const trigRoute = "/olympyard/practice/trigonometry";
const round = (value: number, digits = 3) => Number(value.toFixed(digits));
const degToRad = (degrees: number) => (degrees * Math.PI) / 180;
const sinDeg = (degrees: number) => Math.sin(degToRad(degrees));
const cosDeg = (degrees: number) => Math.cos(degToRad(degrees));
const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export const cosineAngleAdditionPhaseSixConfig = makeTwoAngleConfig({
  formula: "cos(A + B) = cos A cos B - sin A sin B",
  visual: CosineAngleAdditionVisual,
  steps: ["Place angle A on the unit circle", "Add angle B from the rotated direction", "Locate A + B", "Read the combined projection", "Compare with cos A cos B - sin A sin B", "Conclude the identity"],
  prediction: "If A and B both increase, should cos(A + B) always increase?",
  answer: "No. Cosine depends on the combined angle's position on the unit circle and can increase or decrease.",
  misconception: "Cosine of a sum is not the sum of cosines; projection changes after rotation and includes both cosine and sine terms.",
  tokens: [{ id: "cos-sum", label: "cos(A + B)", visualLabel: "combined projection" }, { id: "cos A cos B", label: "cos A cos B", visualLabel: "positive projection contribution" }, { id: "sin A sin B", label: "sin A sin B", visualLabel: "subtracted cross projection" }],
  live: ({ A, B }) => {
    const sum = A + B;
    const lhs = cosDeg(sum);
    const positive = cosDeg(A) * cosDeg(B);
    const cross = sinDeg(A) * sinDeg(B);
    const rhs = positive - cross;
    return { sum, lhs, positive, cross, rhs };
  },
});

export const sineAngleAdditionPhaseSixConfig = makeTwoAngleConfig({
  formula: "sin(A + B) = sin A cos B + cos A sin B",
  visual: SineAngleAdditionVisual,
  steps: ["Place angle A", "Add angle B from the rotated direction", "Locate A + B", "Read the vertical projection", "Compare with sin A cos B + cos A sin B", "Conclude the identity"],
  prediction: "Is sin(A + B) usually equal to sin A + sin B?",
  answer: "No.",
  misconception: "The vertical projection after rotation is built from two component contributions, not a direct sum of sine values.",
  tokens: [{ id: "sin-sum", label: "sin(A + B)", visualLabel: "combined vertical projection" }, { id: "sin A cos B", label: "sin A cos B", visualLabel: "first vertical contribution" }, { id: "cos A sin B", label: "cos A sin B", visualLabel: "second vertical contribution" }],
  live: ({ A, B }) => {
    const sum = A + B;
    const lhs = sinDeg(sum);
    const positive = sinDeg(A) * cosDeg(B);
    const cross = cosDeg(A) * sinDeg(B);
    const rhs = positive + cross;
    return { sum, lhs, positive, cross, rhs };
  },
});

export const doubleAngleIdentitiesPhaseSixConfig: PhaseTwoProofConfig = {
  steps: ["Choose theta", "Double the angle", "Read sin(2theta)", "Compare with 2sin theta cos theta", "Read cos(2theta)", "Compare the cosine forms"].map(step),
  parameters: [{ id: "theta", label: "Angle theta", min: 0, max: 180, defaultValue: 45, step: 1, unit: "deg" }],
  toggles: [labelsToggle],
  olympyardRoute: trigRoute,
  prediction: { question: "If theta = 45 degrees, what is 2theta and what should sin(2theta) be?", correctFeedback: "2theta = 90 degrees, so sin(2theta) = 1.", incorrectFeedback: "Double the angle first, then read sine.", revealAfterAnswer: true, options: [{ id: "one", label: "2theta = 90 degrees and sin(2theta) = 1", correct: true, feedback: "Correct." }, { id: "sqrt", label: "2theta = 45 degrees and sin(2theta) = sqrt(2)/2", feedback: "The angle doubles before sine is evaluated." }] },
  misconception: { question: "Is sin(2theta) the same as 2sin theta?", explanation: "Doubling the angle is not the same as doubling the sine value; the correct relation is 2sin theta cos theta.", visualHint: "Compare the doubled projection to the product row.", options: [{ id: "product", label: "No, it is 2sin theta cos theta.", correct: true, feedback: "Correct." }, { id: "double", label: "Yes, just double sine.", feedback: "That only works in rare accidental cases." }] },
  formulaTokens: () => [{ id: "sin2", label: "sin(2theta)", visualLabel: "doubled vertical projection" }, { id: "product", label: "2sin theta cos theta", visualLabel: "product relationship" }, { id: "cos2", label: "cos(2theta)", visualLabel: "doubled horizontal projection" }, { id: "difference", label: "cos^2 theta - sin^2 theta", visualLabel: "square-difference relation" }],
  formula: () => "sin(2theta)=2sin theta cos theta; cos(2theta)=cos^2 theta - sin^2 theta",
  explanation: () => `Tabs: ${phaseSixDoubleAngleTabs.join(", ")}.`,
  liveValues: ({ theta }) => {
    const doubled = theta * 2;
    return [{ id: "theta-deg", label: "theta degrees", value: round(theta, 1), unit: "deg" }, { id: "theta-rad", label: "theta radians", value: round(degToRad(theta)) }, { id: "double-deg", label: "2theta degrees", value: round(doubled, 1), unit: "deg" }, { id: "double-rad", label: "2theta radians", value: round(degToRad(doubled)) }, { id: "sin", label: "sin theta", value: round(sinDeg(theta)) }, { id: "cos", label: "cos theta", value: round(cosDeg(theta)) }, { id: "sin2", label: "sin(2theta)", value: round(sinDeg(doubled)) }, { id: "cos2", label: "cos(2theta)", value: round(cosDeg(doubled)) }, { id: "product", label: "2sin theta cos theta", value: round(2 * sinDeg(theta) * cosDeg(theta)) }, { id: "difference", label: "cos^2 - sin^2", value: round(cosDeg(theta) ** 2 - sinDeg(theta) ** 2) }];
  },
  invariants: ({ theta }) => [{ id: "sin-double", label: "sin(2theta)=2sin theta cos theta", holds: closeWithin(sinDeg(2 * theta), 2 * sinDeg(theta) * cosDeg(theta)), explanation: "The sine double-angle identity matches within rounding tolerance." }, { id: "cos-double", label: "cos(2theta)=cos^2 theta - sin^2 theta", holds: closeWithin(cosDeg(2 * theta), cosDeg(theta) ** 2 - sinDeg(theta) ** 2), explanation: "The cosine double-angle identity matches within rounding tolerance." }],
  assumptions: ["Angles are in degrees for controls and converted to radians in formulas.", `Identity tabs: ${phaseSixDoubleAngleTabs.join(" | ")}.`],
  renderVisual: DoubleAngleIdentitiesVisual,
};

export const sineRulePhaseSixConfig: PhaseTwoProofConfig = {
  steps: ["Draw a triangle", "Label opposite sides and angles", "Construct the circumcircle", "Compare a/sin A and b/sin B", "Extend to all three sides", "Conclude the sine rule"].map(step),
  parameters: trianglePointParameters(),
  toggles: [labelsToggle],
  olympyardRoute: trigRoute,
  prediction: { question: "If side a grows while the triangle remains valid, what should happen to angle A?", correctFeedback: "It generally grows because side a is opposite angle A.", incorrectFeedback: "Remember that side a is opposite angle A.", revealAfterAnswer: true, options: [{ id: "grows", label: "Angle A generally grows", correct: true, feedback: "Correct." }, { id: "shrinks", label: "Angle A generally shrinks", feedback: "The opposite angle usually opens as the opposite side grows." }] },
  misconception: { question: "Does side a belong next to angle A?", explanation: "In triangle notation, side a is opposite angle A, not adjacent to it.", visualHint: "Highlight side a and angle A together.", options: [{ id: "opposite", label: "Side a is opposite angle A.", correct: true, feedback: "Correct." }, { id: "adjacent", label: "Side a is adjacent to angle A.", feedback: "The notation pairs each angle with its opposite side." }] },
  formulaTokens: () => [{ id: "a", label: "a", visualLabel: "side a" }, { id: "sinA", label: "sin A", visualLabel: "angle A" }, { id: "b", label: "b", visualLabel: "side b" }, { id: "sinB", label: "sin B", visualLabel: "angle B" }, { id: "c", label: "c", visualLabel: "side c" }, { id: "sinC", label: "sin C", visualLabel: "angle C" }, { id: "2R", label: "2R", visualLabel: "circumcircle diameter" }],
  formula: () => "a/sin A = b/sin B = c/sin C = 2R",
  explanation: () => "Each side is a chord of the circumcircle, so side/sine(opposite angle) equals the diameter.",
  liveValues: triangleLiveValues,
  invariants: (values) => {
    const m = metrics(values);
    const ra = m.a / sinDeg(m.A);
    const rb = m.b / sinDeg(m.B);
    const rc = m.c / sinDeg(m.C);
    return [{ id: "sine-rule", label: "Ratios equal", holds: closeWithin(ra, rb, 0.08) && closeWithin(rb, rc, 0.08), explanation: `${round(ra)} ~ ${round(rb)} ~ ${round(rc)}.` }];
  },
  assumptions: ["Triangle vertices are clamped to a non-extreme drawing region.", "Ratios are rounded for display."],
  renderVisual: SineRuleVisual,
};

export const cosineRulePhaseSixConfig = makeTwoSideConfig("c^2 = a^2 + b^2 - 2ab cos C", CosineRuleVisual, "What happens to the formula when C = 90 degrees?", "cos 90 degrees = 0, so it becomes c^2 = a^2 + b^2.", "It generalizes Pythagorean theorem; when the included angle is 90 degrees, the correction term becomes zero.", [{ id: "c2", label: "c^2", visualLabel: "opposite side c" }, { id: "a", label: "a^2", visualLabel: "side a" }, { id: "b", label: "b^2", visualLabel: "side b" }, { id: "cosC", label: "cos C", visualLabel: "projection related to C" }, { id: "correction", label: "-2ab cos C", visualLabel: "correction term" }]);

export const complementaryAngleIdentitiesPhaseSixConfig: PhaseTwoProofConfig = {
  steps: ["Draw a right triangle", "Mark theta", "Mark 90 degrees - theta", "Compare opposite and adjacent sides", "Swap the angle viewpoint", "Conclude the identities"].map(step),
  parameters: [{ id: "theta", label: "Angle theta", min: 5, max: 85, defaultValue: 35, step: 1, unit: "deg" }],
  toggles: [labelsToggle],
  olympyardRoute: trigRoute,
  prediction: { question: "If theta becomes larger, what happens to 90 degrees - theta?", correctFeedback: "It becomes smaller.", incorrectFeedback: "The two acute angles in a right triangle add to 90 degrees.", revealAfterAnswer: true, options: [{ id: "smaller", label: "It becomes smaller", correct: true, feedback: "Correct." }, { id: "larger", label: "It becomes larger", feedback: "Their sum must stay 90 degrees." }] },
  misconception: { question: "Are sine and cosine unrelated functions?", explanation: "For complementary angles, sine of one angle equals cosine of the other because opposite and adjacent swap.", visualHint: "Highlight the swapped sides.", options: [{ id: "swap", label: "They match through complementary angle swaps.", correct: true, feedback: "Correct." }, { id: "unrelated", label: "They are unrelated.", feedback: "The right triangle shows the side swap." }] },
  formulaTokens: () => [{ id: "sin-complement", label: "sin(90 - theta)", visualLabel: "side matching cos theta" }, { id: "cos", label: "cos theta", visualLabel: "matching adjacent side" }, { id: "cos-complement", label: "cos(90 - theta)", visualLabel: "side matching sin theta" }, { id: "sin", label: "sin theta", visualLabel: "matching opposite side" }],
  formula: () => "sin(90 - theta)=cos theta; cos(90 - theta)=sin theta",
  explanation: () => "The same right triangle is read from the other acute angle, so opposite and adjacent swap.",
  liveValues: ({ theta }) => [{ id: "theta", label: "theta", value: round(theta, 1), unit: "deg" }, { id: "complement", label: "90 - theta", value: round(90 - theta, 1), unit: "deg" }, { id: "sin", label: "sin theta", value: round(sinDeg(theta)) }, { id: "cos", label: "cos theta", value: round(cosDeg(theta)) }, { id: "sin-comp", label: "sin(90 - theta)", value: round(sinDeg(90 - theta)) }, { id: "cos-comp", label: "cos(90 - theta)", value: round(cosDeg(90 - theta)) }],
  invariants: ({ theta }) => [{ id: "sin-cos-swap", label: "sin(90-theta)=cos theta", holds: closeWithin(sinDeg(90 - theta), cosDeg(theta)), explanation: "The complementary sine equals the original cosine." }, { id: "cos-sin-swap", label: "cos(90-theta)=sin theta", holds: closeWithin(cosDeg(90 - theta), sinDeg(theta)), explanation: "The complementary cosine equals the original sine." }],
  assumptions: ["Theta stays acute.", "Angles are shown in degrees."],
  renderVisual: ComplementaryAngleIdentitiesVisual,
};

export const triangleAreaSineFormulaPhaseSixConfig = makeTwoSideConfig("Area = 1/2 ab sin C", TriangleAreaSineVisual, "What happens to the area when C gets close to 0 degrees while a and b stay fixed?", "Area approaches 0 because height approaches 0.", "The included angle controls the height, so area also depends on sin C.", [{ id: "a", label: "a", visualLabel: "side a" }, { id: "b", label: "b", visualLabel: "side b/base" }, { id: "sinC", label: "sin C", visualLabel: "height ratio" }, { id: "half", label: "1/2", visualLabel: "triangle-half relationship" }]);

function makeTwoAngleConfig(input: {
  formula: string;
  visual: PhaseTwoProofConfig["renderVisual"];
  steps: string[];
  prediction: string;
  answer: string;
  misconception: string;
  tokens: ReturnType<PhaseTwoProofConfig["formulaTokens"]>;
  live: (values: { A: number; B: number }) => { sum: number; lhs: number; positive: number; cross: number; rhs: number };
}): PhaseTwoProofConfig {
  return {
    steps: input.steps.map(step),
    parameters: [{ id: "A", label: "Angle A", min: 0, max: 180, defaultValue: 35, step: 1, unit: "deg" }, { id: "B", label: "Angle B", min: 0, max: 180, defaultValue: 40, step: 1, unit: "deg" }],
    toggles: [labelsToggle],
    olympyardRoute: trigRoute,
    prediction: { question: input.prediction, correctFeedback: input.answer, incorrectFeedback: "Use the combined angle on the unit circle before deciding.", revealAfterAnswer: true, options: [{ id: "no", label: input.answer, correct: true, feedback: "Correct." }, { id: "linear", label: "Yes, it behaves linearly", feedback: "Angle addition changes projection geometry, not just arithmetic." }] },
    misconception: { question: input.formula.includes("cos") ? "Is cos(A + B) equal to cos A + cos B?" : "Is sin(A + B) equal to sin A + sin B?", explanation: input.misconception, visualHint: "Compare the combined projection with the contribution bars.", options: [{ id: "projection", label: "No, use the projection identity.", correct: true, feedback: "Correct." }, { id: "sum", label: "Yes, just add values.", feedback: "The visual contribution bars show extra terms." }] },
    formulaTokens: () => input.tokens,
    formula: () => input.formula,
    explanation: () => input.misconception,
    liveValues: ({ A, B }) => {
      const live = input.live({ A, B });
      return [{ id: "A-deg", label: "A degrees", value: round(A, 1), unit: "deg" }, { id: "A-rad", label: "A radians", value: round(degToRad(A)) }, { id: "B-deg", label: "B degrees", value: round(B, 1), unit: "deg" }, { id: "B-rad", label: "B radians", value: round(degToRad(B)) }, { id: "sum-deg", label: "A+B degrees", value: round(live.sum, 1), unit: "deg" }, { id: "sum-rad", label: "A+B radians", value: round(degToRad(live.sum)) }, { id: "lhs", label: "LHS", value: round(live.lhs) }, { id: "positive", label: "first contribution", value: round(live.positive) }, { id: "cross", label: "cross contribution", value: round(live.cross) }, { id: "rhs", label: "RHS", value: round(live.rhs) }];
    },
    invariants: ({ A, B }) => {
      const live = input.live({ A, B });
      return [{ id: "angle-addition", label: "LHS equals RHS", holds: closeWithin(live.lhs, live.rhs), explanation: `${round(live.lhs)} equals ${round(live.rhs)} within rounding tolerance.` }];
    },
    assumptions: ["Angles are draggable in degrees.", "Values are rounded for display but invariants use numeric tolerance."],
    renderVisual: input.visual,
  };
}

function makeTwoSideConfig(formulaText: string, visual: PhaseTwoProofConfig["renderVisual"], predictionQuestion: string, answer: string, misconception: string, tokens: ReturnType<PhaseTwoProofConfig["formulaTokens"]>): PhaseTwoProofConfig {
  return {
    steps: (formulaText.includes("Area") ? ["Build two sides a and b", "Mark included angle C", "Drop the height", "Express height using sine", "Substitute into triangle area formula", "Conclude Area = 1/2 ab sin C"] : ["Build sides a and b with included angle C", "Draw opposite side c", "Project one side onto the other", "Explain the correction term", "Check the 90 degree case", "Conclude the cosine rule"]).map(step),
    parameters: [{ id: "a", label: "Side a", min: 2, max: 7, defaultValue: 5, step: 0.5 }, { id: "b", label: "Side b", min: 2, max: 7, defaultValue: 6, step: 0.5 }, { id: "C", label: "Angle C", min: 15, max: 165, defaultValue: 58, step: 1, unit: "deg" }],
    toggles: [labelsToggle],
    olympyardRoute: trigRoute,
    prediction: { question: predictionQuestion, correctFeedback: answer, incorrectFeedback: "Check the included angle and projection height.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "wrong", label: "Nothing important changes", feedback: "The angle controls projection and height." }] },
    misconception: { question: formulaText.includes("Area") ? "Does area only depend on side lengths a and b?" : "Is cosine rule unrelated to Pythagorean theorem?", explanation: misconception, visualHint: "Highlight the angle-controlled projection.", options: [{ id: "angle", label: "The included angle matters.", correct: true, feedback: "Correct." }, { id: "only-sides", label: "Only side lengths matter here.", feedback: "The visual projection changes as C changes." }] },
    formulaTokens: () => tokens,
    formula: () => formulaText,
    explanation: () => misconception,
    liveValues: ({ a, b, C }) => {
      const c2 = a * a + b * b - 2 * a * b * cosDeg(C);
      const area = 0.5 * a * b * sinDeg(C);
      return [{ id: "a", label: "a", value: a }, { id: "b", label: "b", value: b }, { id: "C-deg", label: "C degrees", value: round(C, 1), unit: "deg" }, { id: "C-rad", label: "C radians", value: round(degToRad(C)) }, { id: "c", label: "c", value: round(Math.sqrt(Math.max(0, c2))) }, { id: "c2", label: "c^2", value: round(c2) }, { id: "a2b2", label: "a^2 + b^2", value: round(a * a + b * b) }, { id: "correction", label: "2ab cos C", value: round(2 * a * b * cosDeg(C)) }, { id: "height", label: "height", value: round(a * sinDeg(C)) }, { id: "sinC", label: "sin C", value: round(sinDeg(C)) }, { id: "area", label: "area", value: round(area) }];
    },
    invariants: ({ a, b, C }) => {
      const c2 = a * a + b * b - 2 * a * b * cosDeg(C);
      return formulaText.includes("Area") ? [{ id: "area-sine", label: "Area = 1/2 ab sin C", holds: true, explanation: `Area = ${round(0.5 * a * b * sinDeg(C))}.` }] : [{ id: "cosine-rule", label: "c^2 equals RHS", holds: true, explanation: `c^2 = ${round(c2)} from the correction term.` }];
    },
    assumptions: ["Side and angle controls are clamped to stable triangle bounds.", "Values are rounded in the inspector."],
    renderVisual: visual,
  };
}

function trianglePointParameters() {
  return [{ id: "ax", label: "A x", min: 105, max: 490, defaultValue: 165 }, { id: "ay", label: "A y", min: 95, max: 430, defaultValue: 385 }, { id: "bx", label: "B x", min: 105, max: 490, defaultValue: 465 }, { id: "by", label: "B y", min: 95, max: 430, defaultValue: 390 }, { id: "cx", label: "C x", min: 105, max: 490, defaultValue: 305 }, { id: "cy", label: "C y", min: 95, max: 430, defaultValue: 135 }];
}

function triangleLiveValues(values: Record<string, number>) {
  const m = metrics(values);
  return [{ id: "A", label: "A", value: round(m.A, 1), unit: "deg" }, { id: "B", label: "B", value: round(m.B, 1), unit: "deg" }, { id: "C", label: "C", value: round(m.C, 1), unit: "deg" }, { id: "a", label: "a", value: round(m.a) }, { id: "b", label: "b", value: round(m.b) }, { id: "c", label: "c", value: round(m.c) }, { id: "sinA", label: "sin A", value: round(sinDeg(m.A)) }, { id: "sinB", label: "sin B", value: round(sinDeg(m.B)) }, { id: "sinC", label: "sin C", value: round(sinDeg(m.C)) }, { id: "aRatio", label: "a/sin A", value: round(m.a / sinDeg(m.A)) }, { id: "bRatio", label: "b/sin B", value: round(m.b / sinDeg(m.B)) }, { id: "cRatio", label: "c/sin C", value: round(m.c / sinDeg(m.C)) }, { id: "R", label: "circumradius R", value: round(m.a / (2 * sinDeg(m.A))) }];
}

function metrics(values: Record<string, number>) {
  const A = { x: values.ax, y: values.ay };
  const B = { x: values.bx, y: values.by };
  const C = { x: values.cx, y: values.cy };
  const a = distance(B, C) / 42;
  const b = distance(A, C) / 42;
  const c = distance(A, B) / 42;
  const angle = (p: typeof A, q: typeof A, r: typeof A) => {
    const v1 = { x: p.x - q.x, y: p.y - q.y };
    const v2 = { x: r.x - q.x, y: r.y - q.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
    return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI;
  };
  const angleA = angle(B, A, C);
  const angleB = angle(A, B, C);
  return { a, b, c, A: angleA, B: angleB, C: 180 - angleA - angleB };
}

function step(title: string, index: number) {
  return { id: `s${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "projection" : "conclusion" };
}

export const phaseSixRouteSlugs = [
  ["trigonometry", "cosine-angle-addition"],
  ["trigonometry", "sine-angle-addition"],
  ["trigonometry", "double-angle-identities"],
  ["trigonometry", "sine-rule-proof"],
  ["trigonometry", "cosine-rule-proof"],
  ["trigonometry", "complementary-angle-identities"],
  ["trigonometry", "triangle-area-sine-formula"],
] as const;

export const phaseSixConfigs = [
  cosineAngleAdditionPhaseSixConfig,
  sineAngleAdditionPhaseSixConfig,
  doubleAngleIdentitiesPhaseSixConfig,
  sineRulePhaseSixConfig,
  cosineRulePhaseSixConfig,
  complementaryAngleIdentitiesPhaseSixConfig,
  triangleAreaSineFormulaPhaseSixConfig,
];
