import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import { NaturalNumberSumVisual, OddNumberSquareVisual, ParallelogramShearVisual, SquareOfSumVisual, TriangleAreaVisual } from "./PhaseTwoVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };

export const naturalNumberSumPhaseTwoConfig: PhaseTwoProofConfig = {
  steps: [
    { id: "build", title: "Build the staircase", description: "Make rows with 1, 2, 3, and so on up to n cells.", focusLabel: "staircase" },
    { id: "count", title: "Count the rows", description: "The row lengths are exactly the terms in 1 + 2 + ... + n.", focusLabel: "rows" },
    { id: "duplicate", title: "Duplicate the staircase", description: "Copy the same staircase, so the count is doubled.", focusLabel: "same copy" },
    { id: "rotate", title: "Rotate and fit", description: "Fit the duplicate into the missing spaces beside the original.", focusLabel: "fit" },
    { id: "rectangle", title: "Form a rectangle", description: "The two staircases now make an n by n + 1 rectangle.", focusLabel: "rectangle" },
    { id: "halve", title: "Divide by 2", description: "One staircase is half of the rectangle.", focusLabel: "half" },
  ],
  parameters: [{ id: "n", label: "Term count n", min: 2, max: 12, defaultValue: 8 }],
  toggles: [labelsToggle, { id: "duplicate", label: "Show duplicate staircase", defaultValue: true }],
  olympyardRoute: "/olympyard/practice/patterns-sequences",
  prediction: {
    question: "Before reveal: if n is the current n, what will the rectangle dimensions be after duplicating the staircase?",
    correctFeedback: "Yes. The duplicate staircase fills an n by n + 1 rectangle.",
    incorrectFeedback: "Look for the extra row created when the copy fits beside the original staircase.",
    revealAfterAnswer: true,
    options: [
      { id: "n-n1", label: "n by n + 1", correct: true, feedback: "Correct: the two staircases complete n columns and n + 1 rows." },
      { id: "n-n", label: "n by n", feedback: "That would be a square, but the duplicated staircase creates one extra row." },
      { id: "half", label: "n by half n", feedback: "The half appears after forming the full rectangle, not in its dimensions." },
    ],
  },
  misconception: {
    question: "Why do we divide by 2 at the end?",
    explanation: "Because the completed rectangle contains two identical staircases, and the original sum is only one of them.",
    visualHint: "Highlight the duplicate copy and the rectangle outline.",
    options: [
      { id: "two", label: "The rectangle is made of two identical staircases.", correct: true, feedback: "Correct." },
      { id: "formula", label: "Because the formula says divide by 2.", feedback: "The formula is the conclusion, not the visual reason." },
      { id: "odd-even", label: "Because n might be even.", feedback: "The argument works for every whole n, not only even n." },
    ],
  },
  formulaTokens: () => [
    { id: "n", label: "n", visualLabel: "columns" },
    { id: "n-plus-1", label: "n + 1", visualLabel: "rows" },
    { id: "half", label: "/ 2", visualLabel: "one staircase" },
  ],
  formula: ({ n }) => `1 + 2 + ... + ${n} = ${n}(${n} + 1) / 2 = ${(n * (n + 1)) / 2}`,
  explanation: ({ n }, activeStep) =>
    activeStep >= 4
      ? `Two identical staircases fill an ${n} by ${n + 1} rectangle, so one staircase has half of ${n * (n + 1)} cells.`
      : "Build the staircase first, then make an equal copy before reading the formula.",
  liveValues: ({ n }) => [
    { id: "n", label: "Exact n", value: n },
    { id: "rectangle", label: "Rectangle dimensions", value: `${n} x ${n + 1}` },
    { id: "rectangle-count", label: "Rectangle cell count", value: n * (n + 1), exactValue: String(n * (n + 1)) },
    { id: "staircase-count", label: "Staircase cell count", value: (n * (n + 1)) / 2, exactValue: String((n * (n + 1)) / 2) },
  ],
  invariants: ({ n }) => [{ id: "double", label: "2 x staircase = rectangle", holds: true, explanation: `2 x ${(n * (n + 1)) / 2} = ${n * (n + 1)}.` }],
  assumptions: ["The duplicate is identical to the original staircase.", "Rows are counted as unit cells.", "The rectangle has n columns and n + 1 rows."],
  renderVisual: NaturalNumberSumVisual,
};

export const oddNumberSumPhaseTwoConfig: PhaseTwoProofConfig = {
  steps: [
    { id: "one", title: "Start with 1", description: "The first odd layer is one cell.", focusLabel: "1 cell" },
    { id: "next", title: "Add the next L-shaped odd layer", description: "Grow the square by adding a new row and a new column.", focusLabel: "L layer" },
    { id: "odd", title: "Observe every layer is odd", description: "Each new border has 2k - 1 cells.", focusLabel: "odd layer" },
    { id: "grow", title: "Grow to n layers", description: "Repeat the same L-shaped growth until layer n.", focusLabel: "n layers" },
    { id: "square", title: "See the n by n square", description: "The layers exactly fill a square.", focusLabel: "square" },
    { id: "conclude", title: "Conclude the sum is n^2", description: "The first n odd numbers count all cells in the n by n square.", focusLabel: "n^2" },
  ],
  parameters: [{ id: "n", label: "Layers n", min: 1, max: 10, defaultValue: 6 }],
  toggles: [labelsToggle],
  olympyardRoute: "/olympyard/practice/patterns-sequences",
  prediction: {
    question: "After adding the nth odd layer, what shape should the cells form?",
    correctFeedback: "Yes. The odd layers exactly fill an n by n square.",
    incorrectFeedback: "Count the border layer as a new row plus a new column sharing one corner.",
    revealAfterAnswer: true,
    options: [
      { id: "square", label: "An n by n square", correct: true, feedback: "Correct: the full shape has n rows and n columns." },
      { id: "rectangle", label: "An n by n + 1 rectangle", feedback: "That rectangle belongs to the natural-number staircase proof." },
      { id: "line", label: "A single row of odd cells", feedback: "The cells wrap around as an L-shaped layer, not a single row." },
    ],
  },
  misconception: {
    question: "Is the square pattern only a coincidence?",
    explanation: "No. Each odd layer adds exactly the next L-shaped border around the previous square.",
    visualHint: "Highlight the newest L-shaped odd border.",
    options: [
      { id: "border", label: "Each layer is the next L-shaped border.", correct: true, feedback: "Correct." },
      { id: "coincidence", label: "Odd numbers make a square by coincidence.", feedback: "The L-shaped border explains the square growth every time." },
      { id: "skip", label: "The shape skips cells and later fills them.", feedback: "No cells are skipped; each layer completes the next square." },
    ],
  },
  formulaTokens: ({ n }) => [
    { id: "n", label: "n", visualLabel: `${n} layers` },
    { id: "latest-odd", label: "2n - 1", visualLabel: "new border" },
    { id: "n-square", label: "n^2", visualLabel: "square area" },
  ],
  formula: ({ n }) => `1 + 3 + 5 + ... + ${2 * n - 1} = ${n}^2 = ${n * n}`,
  explanation: ({ n }) => `Layer ${n} adds ${2 * n - 1} cells, and all layers together fill a ${n} by ${n} square.`,
  liveValues: ({ n }) => [
    { id: "n", label: "Current n", value: n },
    { id: "latest-odd", label: "Latest odd layer", value: 2 * n - 1 },
    { id: "total", label: "Total cells", value: n * n, exactValue: `${n}^2 = ${n * n}` },
    { id: "sum", label: "Layer sum", value: `1 + 3 + ... + ${2 * n - 1}` },
  ],
  invariants: ({ n }) => [{ id: "square-fill", label: "Odd layers fill square", holds: true, explanation: `The first ${n} odd layers fill every cell of a ${n} by ${n} square.` }],
  assumptions: ["Each layer wraps around the previous square.", "The corner cell of a new row and column is counted once."],
  renderVisual: OddNumberSquareVisual,
};

export const triangleAreaPhaseTwoConfig: PhaseTwoProofConfig = {
  steps: [
    { id: "rectangle", title: "Build a rectangle", description: "Start with a rectangle of base b and height h.", focusLabel: "rectangle" },
    { id: "diagonal", title: "Draw the diagonal", description: "A diagonal splits the rectangle into two triangles.", focusLabel: "diagonal" },
    { id: "compare", title: "Compare the two triangles", description: "The two triangles match exactly.", focusLabel: "congruence" },
    { id: "equal", title: "Confirm both halves are equal", description: "Each triangle is half of the rectangle.", focusLabel: "equal halves" },
    { id: "area", title: "Rectangle area is base x height", description: "The full rectangle area is b x h.", focusLabel: "b x h" },
    { id: "half", title: "Triangle area is half", description: "One triangle has area 1/2 x b x h.", focusLabel: "half" },
  ],
  parameters: [
    { id: "base", label: "Base b", min: 3, max: 12, defaultValue: 8 },
    { id: "height", label: "Height h", min: 2, max: 8, defaultValue: 5 },
  ],
  toggles: [labelsToggle, { id: "diagonal", label: "Show diagonal", defaultValue: true }, { id: "duplicate", label: "Show congruent triangle", defaultValue: true }],
  olympyardRoute: "/olympyard/practice/area-perimeter",
  prediction: {
    question: "If the rectangle area is base x height, what is the area of one triangle?",
    correctFeedback: "Yes. One diagonal half is 1/2 x base x height.",
    incorrectFeedback: "The diagonal makes two congruent halves, so one triangle is half the rectangle.",
    revealAfterAnswer: true,
    options: [
      { id: "half", label: "Half of base x height", correct: true, feedback: "Correct." },
      { id: "full", label: "base x height", feedback: "That is the full rectangle, not one triangle." },
      { id: "slant", label: "base x slanted side", feedback: "The slanted side is not the perpendicular height." },
    ],
  },
  misconception: {
    question: "Is the slanted side the height?",
    explanation: "No. The height is the perpendicular distance from the base to the opposite vertex.",
    visualHint: "Highlight the perpendicular height guide.",
    options: [
      { id: "perpendicular", label: "Height is perpendicular to the base.", correct: true, feedback: "Correct." },
      { id: "slanted", label: "The slanted side is the height.", feedback: "The slanted side changes with tilt; the perpendicular distance is the height." },
      { id: "longest", label: "The longest side is always height.", feedback: "Height is a distance at 90 degrees, not the longest side." },
    ],
  },
  formulaTokens: () => [
    { id: "half", label: "1/2", visualLabel: "one congruent half" },
    { id: "base", label: "base", visualLabel: "bottom edge" },
    { id: "height", label: "height", visualLabel: "perpendicular guide" },
  ],
  formula: ({ base, height }) => `Triangle area = 1/2 x ${base} x ${height} = ${(base * height) / 2}`,
  explanation: ({ base, height }) => `The rectangle area is ${base * height}; the diagonal makes two congruent triangles, so one triangle is ${(base * height) / 2}.`,
  liveValues: ({ base, height }) => [
    { id: "base", label: "Base", value: base },
    { id: "height", label: "Perpendicular height", value: height },
    { id: "rectangle", label: "Rectangle area", value: base * height },
    { id: "triangle", label: "Triangle area", value: (base * height) / 2 },
  ],
  invariants: ({ base, height }) => [{ id: "two-halves", label: "Two congruent triangles form the rectangle", holds: true, explanation: `2 x ${(base * height) / 2} = ${base * height}.` }],
  assumptions: ["The diagonal joins opposite rectangle corners.", "Base and height are perpendicular."],
  renderVisual: TriangleAreaVisual,
};

export const parallelogramAreaPhaseTwoConfig: PhaseTwoProofConfig = {
  steps: [
    { id: "start", title: "Start with parallelogram", description: "Begin with a slanted parallelogram.", focusLabel: "parallelogram" },
    { id: "height", title: "Identify base and perpendicular height", description: "Area uses vertical height, not the slanted side.", focusLabel: "height" },
    { id: "cut", title: "Cut the side wedge", description: "Separate the triangular wedge from one side.", focusLabel: "wedge" },
    { id: "slide", title: "Slide wedge to the other side", description: "Move the wedge without stretching it.", focusLabel: "slide" },
    { id: "rectangle", title: "Form a rectangle", description: "The rearranged shape is a rectangle with the same base and height.", focusLabel: "rectangle" },
    { id: "conclude", title: "Conclude area is base x height", description: "Cut-and-slide preserves area, so A = b x h.", focusLabel: "area" },
  ],
  parameters: [
    { id: "base", label: "Base b", min: 4, max: 12, defaultValue: 8 },
    { id: "height", label: "Height h", min: 2, max: 8, defaultValue: 5 },
    { id: "slant", label: "Slant offset", min: 0, max: 5, defaultValue: 3 },
    { id: "progress", label: "Rearrange progress", min: 0, max: 100, step: 10, defaultValue: 70, unit: "%" },
  ],
  toggles: [labelsToggle, { id: "heightGuide", label: "Show height guide", defaultValue: true }],
  olympyardRoute: "/olympyard/practice/area-perimeter",
  prediction: {
    question: "If we change only the slant but keep base and perpendicular height, what happens to the area?",
    correctFeedback: "Yes. The area stays base x perpendicular height.",
    incorrectFeedback: "Slant changes the side angle, but the cut-and-slide rectangle keeps the same base and height.",
    revealAfterAnswer: true,
    options: [
      { id: "same", label: "The area stays the same.", correct: true, feedback: "Correct." },
      { id: "bigger", label: "The area gets bigger.", feedback: "The shape leans more, but the perpendicular height did not change." },
      { id: "slanted-side", label: "Area becomes base x slanted side.", feedback: "The slanted side is not the perpendicular height." },
    ],
  },
  misconception: {
    question: "Does the area change when the parallelogram slants more?",
    explanation: "No. Area remains base x perpendicular height; the wedge is only translated.",
    visualHint: "Highlight the perpendicular height and unchanged rectangle.",
    options: [
      { id: "fixed-height", label: "No, base and perpendicular height still determine area.", correct: true, feedback: "Correct." },
      { id: "slant-more", label: "Yes, more slant means more area.", feedback: "The slanted side moved, but the base and perpendicular height stayed fixed." },
      { id: "side", label: "Use base times slanted side.", feedback: "That multiplies by a side length, not by the perpendicular distance between bases." },
    ],
  },
  formulaTokens: () => [
    { id: "base", label: "base", visualLabel: "bottom edge" },
    { id: "height", label: "height", visualLabel: "perpendicular guide" },
  ],
  formula: ({ base, height }) => `Parallelogram area = ${base} x ${height} = ${base * height}`,
  explanation: ({ base, height }) => `The wedge slides without changing area, forming a ${base} by ${height} rectangle.`,
  liveValues: ({ base, height, slant }) => [
    { id: "base", label: "Base", value: base },
    { id: "height", label: "Perpendicular height", value: height },
    { id: "slant", label: "Slant offset", value: slant },
    { id: "area", label: "Area", value: base * height },
  ],
  invariants: ({ base, height }) => [{ id: "cut-slide", label: "Cut-and-slide preserves area", holds: true, explanation: `The rearranged rectangle still has area ${base * height}.` }],
  assumptions: ["The wedge is translated, not scaled.", "The perpendicular height stays fixed."],
  renderVisual: ParallelogramShearVisual,
};

export const squareOfSumPhaseTwoConfig: PhaseTwoProofConfig = {
  steps: [
    { id: "side", title: "Build a side of length a + b", description: "Split one side into parts a and b.", focusLabel: "a + b" },
    { id: "square", title: "Form the full square", description: "The total area is (a + b)^2.", focusLabel: "full square" },
    { id: "split", title: "Split into a and b parts", description: "Draw the same split horizontally and vertically.", focusLabel: "grid" },
    { id: "squares", title: "Identify a^2 and b^2", description: "Two corner regions are perfect squares.", focusLabel: "a^2 and b^2" },
    { id: "rectangles", title: "Identify the two ab rectangles", description: "The cross regions each have area ab.", focusLabel: "2ab" },
    { id: "combine", title: "Combine terms", description: "Add all regions to get a^2 + 2ab + b^2.", focusLabel: "expansion" },
  ],
  parameters: [
    { id: "a", label: "Length a", min: 2, max: 8, defaultValue: 5 },
    { id: "b", label: "Length b", min: 1, max: 6, defaultValue: 3 },
  ],
  toggles: [labelsToggle, { id: "highlights", label: "Show formula highlights", defaultValue: true }],
  olympyardRoute: "/olympyard/practice/algebraic-thinking",
  prediction: {
    question: "Which extra regions are missing if someone says (a + b)^2 = a^2 + b^2?",
    correctFeedback: "Yes. The two ab rectangles are the missing middle regions.",
    incorrectFeedback: "Look between the a square and b square; two rectangles fill the cross regions.",
    revealAfterAnswer: true,
    options: [
      { id: "two-ab", label: "The two ab rectangles", correct: true, feedback: "Correct." },
      { id: "a2", label: "The a^2 square", feedback: "a^2 is already included in that mistaken formula." },
      { id: "b2", label: "The b^2 square", feedback: "b^2 is already included in that mistaken formula." },
    ],
  },
  misconception: {
    question: "Why is (a + b)^2 not just a^2 + b^2?",
    explanation: "Because the full square also contains two ab rectangles between the a and b parts.",
    visualHint: "Highlight both ab rectangles.",
    options: [
      { id: "ab", label: "The whole square contains two ab rectangles.", correct: true, feedback: "Correct." },
      { id: "disappear", label: "The middle rectangles disappear when simplified.", feedback: "The rectangles are real area regions; simplification cannot erase them." },
      { id: "only-corners", label: "Only the corner squares count.", feedback: "Area counts every region inside the large square." },
    ],
  },
  formulaTokens: () => [
    { id: "a2", label: "a^2", visualLabel: "a by a square" },
    { id: "ab-top", label: "ab", visualLabel: "top rectangle" },
    { id: "ab-left", label: "ab", visualLabel: "side rectangle" },
    { id: "two-ab", label: "2ab", visualLabel: "both rectangles" },
    { id: "b2", label: "b^2", visualLabel: "b by b square" },
  ],
  formula: ({ a, b }) => `(${a} + ${b})^2 = ${a ** 2} + 2(${a})(${b}) + ${b ** 2} = ${(a + b) ** 2}`,
  explanation: ({ a, b }) => `The large square has area ${(a + b) ** 2}; its parts are ${a ** 2}, ${a * b}, ${a * b}, and ${b ** 2}.`,
  liveValues: ({ a, b }) => [
    { id: "a", label: "Side a", value: a },
    { id: "b", label: "Side b", value: b },
    { id: "whole-side", label: "Whole side", value: a + b, exactValue: `a + b = ${a} + ${b}` },
    { id: "a2-area", label: "a^2 region", value: a ** 2, exactValue: `${a} x ${a}` },
    { id: "top-ab", label: "Top ab rectangle", value: a * b, exactValue: `${a} x ${b}` },
    { id: "left-ab", label: "Left ab rectangle", value: a * b, exactValue: `${a} x ${b}` },
    { id: "b2-area", label: "b^2 region", value: b ** 2, exactValue: `${b} x ${b}` },
    { id: "two-ab", label: "Combined ab rectangles", value: 2 * a * b, exactValue: `2 x ${a * b}` },
    { id: "full", label: "Full square area", value: (a + b) ** 2, exactValue: `(${a} + ${b})^2` },
    { id: "expanded", label: "Expanded sum", value: a ** 2 + 2 * a * b + b ** 2, exactValue: `${a ** 2} + ${2 * a * b} + ${b ** 2}` },
  ],
  invariants: ({ a, b }) => [{ id: "area-sum", label: "Whole equals parts", holds: true, explanation: `${(a + b) ** 2} = ${a ** 2 + 2 * a * b + b ** 2}.` }],
  assumptions: ["All regions are rectangles or squares.", "Area is preserved when the square is partitioned."],
  renderVisual: SquareOfSumVisual,
};

export const phaseTwoRouteSlugs = [
  ["sequences-and-series", "sum-first-n-natural-numbers"],
  ["sequences-and-series", "sum-first-n-odd-numbers"],
  ["geometry", "triangle-area-half-rectangle"],
  ["geometry", "parallelogram-area-shearing"],
  ["algebraic-identities", "square-of-sum"],
] as const;

export const phaseTwoConfigs = [
  naturalNumberSumPhaseTwoConfig,
  oddNumberSumPhaseTwoConfig,
  triangleAreaPhaseTwoConfig,
  parallelogramAreaPhaseTwoConfig,
  squareOfSumPhaseTwoConfig,
];

export function getPhaseTwoFormulaPreview(config: PhaseTwoProofConfig) {
  const values = Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue])) as PhaseTwoValues;
  return config.formula(values);
}
