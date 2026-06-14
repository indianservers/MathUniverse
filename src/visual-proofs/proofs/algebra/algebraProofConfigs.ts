import type { ProofStep, VisualProofComponentKey } from "../../data/proofTypes";

export type AlgebraProofKind = Extract<
  VisualProofComponentKey,
  | "SquareOfSumProof"
  | "SquareOfDifferenceProof"
  | "DifferenceOfSquaresProof"
  | "ProductOfBinomialsProof"
  | "DistributiveLawAreaModelProof"
  | "ThreeTermSquareProof"
  | "CompletingTheSquareProof"
  | "QuadraticFactorizationAreaModelProof"
  | "PerfectSquareTrinomialRecognitionProof"
  | "CubeOfSumProof"
  | "CubeOfDifferenceProof"
  | "SumAndDifferenceProductProof"
>;

export type AlgebraParameterKey = "a" | "b" | "c" | "d" | "x" | "m" | "n";

export type AlgebraParameter = {
  key: AlgebraParameterKey;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  step?: number;
};

export type AlgebraProofConfig = {
  kind: AlgebraProofKind;
  parameters: AlgebraParameter[];
  steps: ProofStep[];
  formulas: string[];
  notes: string;
  questions: string[];
  secondaryToggle?: string;
};

const areaQuestions = [
  "Which visual region matches the middle term?",
  "How does the whole area connect to the expression on the left?",
  "Which regions combine into like terms?",
];

const squareSteps = (finalText: string): ProofStep[] => [
  { id: "whole", title: "Show whole model", description: "Start from the complete square or rectangle.", focusLabel: "whole expression" },
  { id: "split", title: "Split dimensions", description: "Divide the sides into the algebraic parts.", focusLabel: "dimension split" },
  { id: "first", title: "Highlight first region", description: "Identify the leading square or product term.", focusLabel: "first term" },
  { id: "middle", title: "Highlight product terms", description: "Show the rectangular product terms.", focusLabel: "middle terms" },
  { id: "last", title: "Highlight final region", description: "Identify the final square or corner product.", focusLabel: "last term" },
  { id: "combine", title: "Combine terms", description: finalText, focusLabel: "identity" },
];

export const algebraProofConfigs: Record<AlgebraProofKind, AlgebraProofConfig> = {
  SquareOfSumProof: {
    kind: "SquareOfSumProof",
    parameters: [
      { key: "a", label: "a", min: 2, max: 8, defaultValue: 5, step: 1 },
      { key: "b", label: "b", min: 1, max: 6, defaultValue: 3, step: 1 },
    ],
    steps: squareSteps("Combine ab + ab into 2ab."),
    formulas: ["Area of whole square = (a + b)^2", "Area of parts = a^2 + ab + ab + b^2", "(a + b)^2 = a^2 + 2ab + b^2"],
    notes: "The square side is a + b. Splitting both side directions creates one a^2 square, two matching ab rectangles, and one b^2 square.",
    questions: areaQuestions,
    secondaryToggle: "Show dimension braces",
  },
  SquareOfDifferenceProof: {
    kind: "SquareOfDifferenceProof",
    parameters: [
      { key: "a", label: "a", min: 4, max: 10, defaultValue: 7, step: 1 },
      { key: "b", label: "b", min: 1, max: 4, defaultValue: 2, step: 1 },
    ],
    steps: squareSteps("The b^2 corner was removed twice, so add it back once."),
    formulas: ["Start with a^2", "Remove ab twice: a^2 - ab - ab", "Add back b^2 once", "(a - b)^2 = a^2 - 2ab + b^2"],
    notes: "Subtractive regions are shown with dashed outlines. The overlap correction explains the positive b^2 term.",
    questions: areaQuestions,
    secondaryToggle: "Show removed strips",
  },
  DifferenceOfSquaresProof: {
    kind: "DifferenceOfSquaresProof",
    parameters: [
      { key: "a", label: "a", min: 4, max: 10, defaultValue: 8, step: 1 },
      { key: "b", label: "b", min: 1, max: 5, defaultValue: 3, step: 1 },
    ],
    steps: squareSteps("Rearrange the remaining L-shape into a rectangle of sides a - b and a + b."),
    formulas: ["Remaining area = a^2 - b^2", "Rectangle dimensions = (a - b) and (a + b)", "a^2 - b^2 = (a - b)(a + b)"],
    notes: "The L-shape left after removing b^2 keeps the same area when rearranged into a rectangle.",
    questions: areaQuestions,
    secondaryToggle: "Show rearranged rectangle",
  },
  ProductOfBinomialsProof: {
    kind: "ProductOfBinomialsProof",
    parameters: [
      { key: "x", label: "x", min: 3, max: 8, defaultValue: 5, step: 1 },
      { key: "a", label: "a", min: 1, max: 5, defaultValue: 2, step: 1 },
      { key: "b", label: "b", min: 1, max: 5, defaultValue: 3, step: 1 },
    ],
    steps: squareSteps("Combine ax + bx as (a + b)x."),
    formulas: ["(x + a)(x + b)", "= x^2 + ax + bx + ab", "= x^2 + (a + b)x + ab"],
    notes: "The rectangle dimensions are the factors. The internal regions are the expanded terms.",
    questions: areaQuestions,
    secondaryToggle: "Combine middle term",
  },
  DistributiveLawAreaModelProof: {
    kind: "DistributiveLawAreaModelProof",
    parameters: [
      { key: "a", label: "a", min: 2, max: 7, defaultValue: 4, step: 1 },
      { key: "b", label: "b", min: 1, max: 6, defaultValue: 3, step: 1 },
      { key: "c", label: "c", min: 2, max: 7, defaultValue: 5, step: 1 },
      { key: "d", label: "d", min: 1, max: 6, defaultValue: 2, step: 1 },
    ],
    steps: squareSteps("All four product regions add to the total area."),
    formulas: ["Total area = (a + b)(c + d)", "Parts = ac + ad + bc + bd", "(a + b)(c + d) = ac + ad + bc + bd"],
    notes: "Distribution is area bookkeeping: every part of one side multiplies every part of the other side.",
    questions: areaQuestions,
  },
  ThreeTermSquareProof: {
    kind: "ThreeTermSquareProof",
    parameters: [
      { key: "a", label: "a", min: 2, max: 6, defaultValue: 4, step: 1 },
      { key: "b", label: "b", min: 1, max: 5, defaultValue: 3, step: 1 },
      { key: "c", label: "c", min: 1, max: 5, defaultValue: 2, step: 1 },
    ],
    steps: squareSteps("Pair ab with ba, bc with cb, and ca with ac."),
    formulas: ["(a + b + c)^2", "= a^2 + b^2 + c^2 + ab + ba + bc + cb + ca + ac", "= a^2 + b^2 + c^2 + 2ab + 2bc + 2ca"],
    notes: "A 3 by 3 split makes all nine products visible. Off-diagonal matching pairs create the doubled terms.",
    questions: areaQuestions,
    secondaryToggle: "Group pairs",
  },
  CompletingTheSquareProof: {
    kind: "CompletingTheSquareProof",
    parameters: [
      { key: "x", label: "x", min: 3, max: 8, defaultValue: 5, step: 1 },
      { key: "b", label: "b", min: 2, max: 8, defaultValue: 4, step: 1 },
    ],
    steps: squareSteps("Add the missing corner (b/2)^2 to complete a square."),
    formulas: ["x^2 + bx = x^2 + 2 x (b/2)x", "Add missing corner: x^2 + bx + (b/2)^2", "x^2 + bx + (b/2)^2 = (x + b/2)^2", "x^2 + bx = (x + b/2)^2 - (b/2)^2"],
    notes: "Splitting bx into two equal rectangles reveals the missing corner needed to complete the larger square.",
    questions: areaQuestions,
    secondaryToggle: "Show missing corner",
  },
  QuadraticFactorizationAreaModelProof: {
    kind: "QuadraticFactorizationAreaModelProof",
    parameters: [
      { key: "x", label: "x", min: 3, max: 8, defaultValue: 5, step: 1 },
      { key: "m", label: "m", min: 1, max: 10, defaultValue: 2, step: 1 },
      { key: "n", label: "n", min: 1, max: 10, defaultValue: 3, step: 1 },
    ],
    steps: squareSteps("Read the side lengths as x + m and x + n."),
    formulas: ["x^2 + px + q", "p = m + n and q = mn", "x^2 + (m + n)x + mn = (x + m)(x + n)"],
    notes: "Choosing m and n makes the area model factorable because the middle rectangles and corner match the rectangle dimensions.",
    questions: areaQuestions,
    secondaryToggle: "Show factored form",
  },
  PerfectSquareTrinomialRecognitionProof: {
    kind: "PerfectSquareTrinomialRecognitionProof",
    parameters: [
      { key: "x", label: "x", min: 3, max: 8, defaultValue: 5, step: 1 },
      { key: "a", label: "a", min: 1, max: 6, defaultValue: 3, step: 1 },
    ],
    steps: squareSteps("Check: first term square, last term square, middle term twice the product."),
    formulas: ["x^2 + 2ax + a^2 = (x + a)^2", "x^2 - 2ax + a^2 = (x - a)^2", "Checklist: square, square, twice the product"],
    notes: "The plus and minus versions use the same perfect-square structure; the sign controls the middle rectangles.",
    questions: areaQuestions,
    secondaryToggle: "Toggle minus version",
  },
  CubeOfSumProof: {
    kind: "CubeOfSumProof",
    parameters: [
      { key: "a", label: "a", min: 2, max: 7, defaultValue: 5, step: 1 },
      { key: "b", label: "b", min: 1, max: 5, defaultValue: 2, step: 1 },
    ],
    steps: squareSteps("Group volume blocks as a^3, 3a^2b, 3ab^2, and b^3."),
    formulas: ["(a + b)^3", "= a^3 + a^2b + a^2b + a^2b + ab^2 + ab^2 + ab^2 + b^3", "= a^3 + 3a^2b + 3ab^2 + b^3"],
    notes: "The isometric SVG is a 2.5D volume model. It keeps the feature static and browser-only while showing volume decomposition.",
    questions: ["Where do the three a^2b blocks appear?", "Why are there three ab^2 blocks?", "How do the coefficients match the block count?"],
    secondaryToggle: "Explode blocks",
  },
  CubeOfDifferenceProof: {
    kind: "CubeOfDifferenceProof",
    parameters: [
      { key: "a", label: "a", min: 4, max: 10, defaultValue: 7, step: 1 },
      { key: "b", label: "b", min: 1, max: 4, defaultValue: 2, step: 1 },
    ],
    steps: squareSteps("Removed slabs, added overlaps, and final corner correction create alternating signs."),
    formulas: ["(a - b)^3", "= a^3 - 3a^2b + 3ab^2 - b^3"],
    notes: "The signs alternate because subtracting slabs over-removes overlap regions, which then require corrections.",
    questions: ["Which blocks are removed?", "Which blocks are corrections?", "Why does the final b^3 term have a minus sign?"],
    secondaryToggle: "Show corrections",
  },
  SumAndDifferenceProductProof: {
    kind: "SumAndDifferenceProductProof",
    parameters: [
      { key: "a", label: "a", min: 4, max: 10, defaultValue: 8, step: 1 },
      { key: "b", label: "b", min: 1, max: 5, defaultValue: 3, step: 1 },
    ],
    steps: squareSteps("Rearrange the rectangle into the same L-shape as a^2 - b^2."),
    formulas: ["Rectangle area = (a + b)(a - b)", "Rearranged area = a^2 - b^2", "(a + b)(a - b) = a^2 - b^2"],
    notes: "This product is the factored form of the difference of squares identity.",
    questions: areaQuestions,
    secondaryToggle: "Compare L-shape",
  },
};
