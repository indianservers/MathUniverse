import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import { CircleCircumferenceVisual, DifferenceOfSquaresVisual, ProductOfBinomialsVisual, PythagoreanAreaVisual, SquareOfDifferenceVisual, TriangleAngleSumVisual } from "./PhaseFourVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const areaRoute = "/olympyard/practice/area-perimeter";
const algebraRoute = "/olympyard/practice/algebraic-thinking";
const round = (value: number) => Math.round(value * 100) / 100;

export const pythagoreanPhaseFourConfig: PhaseTwoProofConfig = {
  steps: ["Build a right triangle", "Add squares on both legs", "Add square on hypotenuse", "Compare the areas", "Rearrange/verify equality", "Conclude a^2 + b^2 = c^2"].map((title, index) => ({ id: `s${index}`, title, description: title, focusLabel: index < 2 ? "legs" : index < 4 ? "squares" : "equality" })),
  parameters: [{ id: "a", label: "Leg a", min: 3, max: 9, defaultValue: 5 }, { id: "b", label: "Leg b", min: 3, max: 8, defaultValue: 4 }],
  toggles: [labelsToggle],
  olympyardRoute: areaRoute,
  prediction: { question: "Before reveal: what should match the hypotenuse square?", correctFeedback: "Yes. The two leg squares together match c^2.", incorrectFeedback: "Compare the square areas, not just side lengths.", revealAfterAnswer: true, options: [{ id: "sum", label: "a^2 + b^2", correct: true, feedback: "Correct." }, { id: "ab", label: "a + b", feedback: "That adds lengths, not square areas." }, { id: "twice", label: "2ab", feedback: "2ab appears in rearrangements, but the theorem compares squares." }] },
  misconception: { question: "Is the hypotenuse square only visually bigger, not exactly equal to the two smaller squares?", explanation: "The computed and visual areas match exactly for every right triangle.", visualHint: "Highlight the three side squares.", options: [{ id: "exact", label: "The areas match exactly: a^2 + b^2 = c^2.", correct: true, feedback: "Correct." }, { id: "visual", label: "It only looks close in the diagram.", feedback: "The invariant is numerical and geometric, not just visual." }] },
  formulaTokens: () => [{ id: "a2", label: "a^2", visualLabel: "square on a" }, { id: "b2", label: "b^2", visualLabel: "square on b" }, { id: "c2", label: "c^2", visualLabel: "hypotenuse square" }],
  formula: ({ a, b }) => `${a}^2 + ${b}^2 = ${round(Math.hypot(a, b))}^2`,
  explanation: ({ a, b }) => `The leg squares have areas ${a * a} and ${b * b}; together they equal ${a * a + b * b}, the square on the hypotenuse.`,
  liveValues: ({ a, b }) => [{ id: "a", label: "a", value: a }, { id: "b", label: "b", value: b }, { id: "c", label: "c", value: round(Math.hypot(a, b)), exactValue: `sqrt(${a * a + b * b})` }, { id: "a2", label: "a^2", value: a * a }, { id: "b2", label: "b^2", value: b * b }, { id: "c2", label: "c^2", value: round(Math.hypot(a, b) ** 2) }],
  invariants: ({ a, b }) => [{ id: "pythagorean", label: "a^2 + b^2 = c^2", holds: true, explanation: `${a * a} + ${b * b} = ${a * a + b * b}.` }],
  assumptions: ["The triangle keeps a right angle.", "Squares are built externally on each side."],
  renderVisual: PythagoreanAreaVisual,
};

export const triangleAngleSumPhaseFourConfig: PhaseTwoProofConfig = {
  steps: ["Draw any triangle", "Measure angle A", "Measure angle B", "Measure angle C", "Rearrange angles on a straight line", "Conclude the sum is 180 degrees"].map((title, index) => ({ id: `s${index}`, title, description: title, focusLabel: index < 4 ? "angle" : "straight line" })),
  parameters: [{ id: "ax", label: "A x", min: 150, max: 620, defaultValue: 230 }, { id: "ay", label: "A y", min: 120, max: 410, defaultValue: 380 }, { id: "bx", label: "B x", min: 150, max: 620, defaultValue: 510 }, { id: "by", label: "B y", min: 120, max: 410, defaultValue: 375 }, { id: "cx", label: "C x", min: 150, max: 620, defaultValue: 370 }, { id: "cy", label: "C y", min: 120, max: 410, defaultValue: 170 }],
  toggles: [labelsToggle],
  olympyardRoute: "/olympyard/practice/geometry-angles",
  prediction: { question: "If the triangle is not equilateral, what should A + B + C be?", correctFeedback: "Yes. Every Euclidean triangle totals 180 degrees.", incorrectFeedback: "Drag the vertices: the individual angles change, but the sum stays fixed.", revealAfterAnswer: true, options: [{ id: "180", label: "180 degrees", correct: true, feedback: "Correct." }, { id: "depends", label: "It depends on the shape", feedback: "The individual angles depend on shape; the sum does not." }, { id: "only-eq", label: "Only equilateral triangles make 180 degrees", feedback: "All Euclidean triangles do." }] },
  misconception: { question: "Do only equilateral triangles add to 180 degrees?", explanation: "Every Euclidean triangle's interior angles form a straight angle when rearranged.", visualHint: "Highlight the straight-line angle arrangement.", options: [{ id: "every", label: "Every Euclidean triangle adds to 180 degrees.", correct: true, feedback: "Correct." }, { id: "equilateral", label: "Only equilateral triangles do.", feedback: "Equilateral is just one example." }] },
  formulaTokens: () => [{ id: "A", label: "A", visualLabel: "angle A" }, { id: "B", label: "B", visualLabel: "angle B" }, { id: "C", label: "C", visualLabel: "angle C" }, { id: "straight", label: "180°", visualLabel: "straight line" }],
  formula: () => "A + B + C = 180°",
  explanation: () => "The three interior angles can be rearranged to form a straight angle.",
  liveValues: () => [{ id: "sum", label: "Angle sum", value: "180°" }, { id: "invariant", label: "Invariant", value: "A + B + C" }],
  invariants: () => [{ id: "angle-sum", label: "Triangle angle sum", holds: true, explanation: "A + B + C remains 180 degrees while vertices move." }],
  assumptions: ["The triangle is non-degenerate.", "The model is Euclidean."],
  renderVisual: TriangleAngleSumVisual,
};

export const circleCircumferencePhaseFourConfig: PhaseTwoProofConfig = {
  steps: ["Start with a circle", "Mark radius and diameter", "Roll/unwrap the boundary", "Compare boundary to diameter", "See pi diameters", "Conclude C = pi d = 2 pi r"].map((title, index) => ({ id: `s${index}`, title, description: title, focusLabel: index < 2 ? "circle" : "circumference" })),
  parameters: [{ id: "radius", label: "Radius r", min: 2, max: 8, defaultValue: 5 }],
  toggles: [labelsToggle],
  olympyardRoute: "/olympyard/practice/circles",
  prediction: { question: "Is the unwrapped circumference exactly 3 diameters?", correctFeedback: "Correct. It is pi diameters, a little more than 3.", incorrectFeedback: "Compare the line to three diameters: it goes a bit farther.", revealAfterAnswer: true, options: [{ id: "pi", label: "No, it is pi diameters.", correct: true, feedback: "Correct." }, { id: "three", label: "Yes, exactly 3 diameters.", feedback: "Pi is about 3.14159, not exactly 3." }] },
  misconception: { question: "Is circumference exactly 3 diameters?", explanation: "No. It is pi diameters, a little more than 3 diameters.", visualHint: "Highlight the extra length beyond three diameters.", options: [{ id: "pi", label: "It is pi diameters.", correct: true, feedback: "Correct." }, { id: "3", label: "It is exactly 3 diameters.", feedback: "The unwrapped line extends past three diameters." }] },
  formulaTokens: () => [{ id: "r", label: "r", visualLabel: "radius" }, { id: "d", label: "d", visualLabel: "diameter" }, { id: "pi-d", label: "πd", visualLabel: "unwrapped boundary" }, { id: "r", label: "2πr", visualLabel: "diameter relation" }],
  formula: ({ radius }) => `C = 2π(${radius}) = π(${2 * radius}) ≈ ${round(2 * Math.PI * radius)}`,
  explanation: () => "One full boundary unwraps to a line of length pi diameters.",
  liveValues: ({ radius }) => [{ id: "r", label: "Radius", value: radius }, { id: "d", label: "Diameter", value: 2 * radius }, { id: "c-exact", label: "Circumference exact", value: `2π(${radius})` }, { id: "c-rounded", label: "Circumference rounded", value: round(2 * Math.PI * radius), warning: "π is irrational; decimal is rounded." }],
  invariants: ({ radius }) => [{ id: "circumference", label: "C = 2πr = πd", holds: true, explanation: `d = ${2 * radius}, so πd = 2πr.` }],
  assumptions: ["The circle rolls without slipping.", "π is shown using a rounded decimal."],
  renderVisual: CircleCircumferenceVisual,
};

export const differenceOfSquaresPhaseFourConfig: PhaseTwoProofConfig = makeAlgebraConfig("Difference of squares", ["Start with a^2", "Remove b^2", "Observe the L-shape", "Cut and move one part", "Form rectangle", "Conclude (a - b)(a + b)"], DifferenceOfSquaresVisual, ({ a, b }) => `a^2 - b^2 = ${a * a} - ${b * b} = ${(a - b) * (a + b)}`, "a^2 - b^2 = (a - b)(a + b)", [{ id: "a2", label: "a^2", visualLabel: "large square" }, { id: "b2", label: "b^2", visualLabel: "removed square" }, { id: "a-b", label: "a - b", visualLabel: "short rectangle side" }, { id: "a-plus-b", label: "a + b", visualLabel: "long rectangle side" }], "a^2 - b^2 = (a - b)^2?", "No. The remaining L-shape rearranges to a rectangle with sides a - b and a + b, not a square.", "Which rectangle sides appear after rearranging?", "a - b and a + b");

export const squareOfDifferencePhaseFourConfig: PhaseTwoProofConfig = makeAlgebraConfig("Square of a difference", ["Start with a^2", "Mark b on each side", "Remove two ab strips", "Notice the corner overlap", "Add back b^2", "Conclude (a - b)^2"], SquareOfDifferenceVisual, ({ a, b }) => `(a - b)^2 = ${a * a} - 2(${a})(${b}) + ${b * b} = ${(a - b) ** 2}`, "a^2 - 2ab + b^2 = (a - b)^2", [{ id: "a2", label: "a^2", visualLabel: "large square" }, { id: "minus-2ab", label: "-2ab", visualLabel: "removed strips" }, { id: "plus-b2", label: "+b^2", visualLabel: "add-back corner" }, { id: "final", label: "(a - b)^2", visualLabel: "final square" }], "(a - b)^2 = a^2 - b^2?", "No. Removing b from both side lengths removes two strips and double-counts the corner.", "What must be added back after removing two strips?", "the b^2 corner");

export const productOfBinomialsPhaseFourConfig: PhaseTwoProofConfig = {
  ...makeAlgebraConfig("Product of binomials", ["Build width x + a", "Build height x + b", "Form the rectangle", "Split into four regions", "Match each region to a formula term", "Conclude the expansion"], ProductOfBinomialsVisual, ({ x, a, b }) => `(x + a)(x + b) = x^2 + ax + bx + ab = ${(x + a) * (x + b)}`, "full rectangle area equals sum of parts", [{ id: "x2", label: "x^2", visualLabel: "x by x" }, { id: "ax", label: "ax", visualLabel: "a by x" }, { id: "bx", label: "bx", visualLabel: "b by x" }, { id: "ab", label: "ab", visualLabel: "a by b" }], "Only first and last terms matter?", "No. The middle rectangles ax and bx are real regions of the rectangle.", "Which middle regions appear?", "ax and bx"),
  parameters: [{ id: "x", label: "x", min: 2, max: 7, defaultValue: 4 }, { id: "a", label: "a", min: 1, max: 6, defaultValue: 3 }, { id: "b", label: "b", min: 1, max: 6, defaultValue: 2 }],
};

function makeAlgebraConfig(title: string, steps: string[], renderVisual: PhaseTwoProofConfig["renderVisual"], formula: (values: PhaseTwoValues) => string, invariantLabel: string, tokens: PhaseTwoProofConfig["formulaTokens"] extends (values: PhaseTwoValues) => infer T ? T : never, misconceptionQuestion: string, misconceptionExplanation: string, predictionQuestion: string, correctLabel: string): PhaseTwoProofConfig {
  return {
    steps: steps.map((step, index) => ({ id: `s${index}`, title: step, description: step, focusLabel: index < 2 ? "setup" : index < 5 ? "regions" : "formula" })),
    parameters: [{ id: "a", label: "a", min: 3, max: 9, defaultValue: 7 }, { id: "b", label: "b", min: 1, max: 6, defaultValue: 3 }],
    toggles: [labelsToggle],
    olympyardRoute: algebraRoute,
    prediction: { question: predictionQuestion, correctFeedback: `Yes. The key result is ${correctLabel}.`, incorrectFeedback: "Use the regions in the tile model, not only the symbols.", revealAfterAnswer: true, options: [{ id: "correct", label: correctLabel, correct: true, feedback: "Correct." }, { id: "wrong", label: "only the corner regions", feedback: "The full area includes every visible region." }] },
    misconception: { question: misconceptionQuestion, explanation: misconceptionExplanation, visualHint: "Highlight the linked tile regions.", options: [{ id: "visual", label: "Use the rearranged area regions.", correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use only the first and last terms.", feedback: "That misses visible area regions." }] },
    formulaTokens: () => tokens,
    formula,
    explanation: () => misconceptionExplanation,
    liveValues: ({ a, b, x = 0 }) => [{ id: "a", label: "a", value: a }, { id: "b", label: "b", value: b }, ...(x ? [{ id: "x", label: "x", value: x }] : []), { id: "area", label: "Area value", value: formula({ a, b, x }) }],
    invariants: () => [{ id: "area", label: invariantLabel, holds: true, explanation: "The rearranged regions preserve the exact area." }],
    assumptions: ["All regions are squares or rectangles.", "Dragged values are clamped to safe whole-number dimensions."],
    renderVisual,
  };
}

export const phaseFourRouteSlugs = [
  ["geometry", "pythagorean-theorem-area-rearrangement"],
  ["geometry", "triangle-angle-sum"],
  ["geometry", "circle-circumference-unwrapping"],
  ["algebraic-identities", "difference-of-squares"],
  ["algebraic-identities", "square-of-difference"],
  ["algebraic-identities", "product-of-binomials"],
] as const;

export const phaseFourConfigs = [pythagoreanPhaseFourConfig, triangleAngleSumPhaseFourConfig, circleCircumferencePhaseFourConfig, differenceOfSquaresPhaseFourConfig, squareOfDifferencePhaseFourConfig, productOfBinomialsPhaseFourConfig];
