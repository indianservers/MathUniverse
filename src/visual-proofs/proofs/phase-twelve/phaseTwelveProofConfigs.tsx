import type { PhaseTwoProofConfig } from "../../components/PhaseTwoProofExperience";
import {
  CompletingSquareVisual,
  CubeDifferenceVisual,
  CubeSumVisual,
  DistributiveGridVisual,
  PerfectSquareRecognitionVisual,
  QuadraticFactorVisual,
  SumDifferenceProductVisual,
  ThreeTermSquareVisual,
} from "./PhaseTwelveAlgebraVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const algebraRoute = "/olympyard/practice/algebraic-thinking";
const round = (value: number) => Math.round(value * 100) / 100;

export const distributiveLawPhaseTwelveConfig = makeConfig({
  steps: ["Build width a + b", "Build height c + d", "Form full rectangle", "Split width and height", "Match four regions to formula terms", "Conclude the distributive expansion"],
  parameters: ["a", "b", "c", "d"].map((id) => ({ id, label: id, min: 2, max: 7, defaultValue: id === "a" || id === "c" ? 4 : 3, step: 1 })),
  prediction: ["How many smaller rectangles appear when both sides are split into two parts?", "4."],
  misconception: ["Only ac and bd are needed.", "All four pairwise products are real regions in the rectangle."],
  tokens: ["ac", "ad", "bc", "bd", "full"],
  formula: ({ a, b, c, d }) => `(${a}+${b})(${c}+${d}) = ${a * c} + ${a * d} + ${b * c} + ${b * d}`,
  liveValues: ({ a, b, c, d }) => [
    value("a", a), value("b", b), value("c", c), value("d", d),
    { id: "full", label: "full area", value: (a + b) * (c + d) },
    { id: "ac", label: "ac", value: a * c },
    { id: "ad", label: "ad", value: a * d },
    { id: "bc", label: "bc", value: b * c },
    { id: "bd", label: "bd", value: b * d },
    { id: "parts", label: "sum of parts", value: a * c + a * d + b * c + b * d },
  ],
  invariant: ({ a, b, c, d }) => `full area ${(a + b) * (c + d)} equals sum of four tile regions ${a * c + a * d + b * c + b * d}.`,
  renderVisual: DistributiveGridVisual,
});

export const threeTermSquarePhaseTwelveConfig = makeConfig({
  steps: ["Build side a+b+c", "Form the full square", "Split into a, b, c parts", "Identify square terms", "Pair mixed rectangles", "Conclude the formula"],
  parameters: ["a", "b", "c"].map((id, index) => ({ id, label: id, min: 1, max: 5, defaultValue: 3 - (index === 2 ? 1 : 0), step: 1 })),
  prediction: ["Why do the mixed terms have coefficient 2?", "Because each mixed rectangle appears twice symmetrically."],
  misconception: ["(a+b+c)^2 = a^2 + b^2 + c^2.", "The full square also contains mixed rectangles: two each of ab, bc, and ca."],
  tokens: ["a2", "b2", "c2", "twoab", "twobc", "twoca", "full"],
  formula: ({ a, b, c }) => `(${a}+${b}+${c})^2 = ${a ** 2} + ${b ** 2} + ${c ** 2} + ${2 * a * b} + ${2 * b * c} + ${2 * c * a}`,
  liveValues: ({ a, b, c }) => [
    value("a", a), value("b", b), value("c", c),
    { id: "full", label: "full area", value: (a + b + c) ** 2 },
    { id: "square-terms", label: "square terms", value: a ** 2 + b ** 2 + c ** 2 },
    { id: "mixed-terms", label: "mixed terms", value: 2 * a * b + 2 * b * c + 2 * c * a },
    { id: "regions", label: "tile regions", value: 9 },
  ],
  invariant: ({ a, b, c }) => `the full square ${(a + b + c) ** 2} equals the sum of 9 tile regions.`,
  renderVisual: ThreeTermSquareVisual,
});

export const completingSquarePhaseTwelveConfig = makeConfig({
  steps: ["Start with x^2", "Add bx rectangle", "Split bx into two equal strips", "Move strips around x^2", "Add the missing corner", "Conclude the completed square form"],
  parameters: [{ id: "x", label: "x", min: 3, max: 7, defaultValue: 5, step: 1 }, { id: "b", label: "b", min: 2, max: 8, defaultValue: 4, step: 0.5 }],
  prediction: ["What square piece is missing after placing the two half-strips?", "A square of side b/2."],
  misconception: ["Completing the square means adding b^2.", "The missing corner has side b/2, so its area is (b/2)^2."],
  tokens: ["x2", "bx", "half", "complete", "corner"],
  formula: ({ x, b }) => `${x}^2 + ${b}${x} = (${x}+${b / 2})^2 - (${b / 2})^2`,
  liveValues: ({ x, b }) => [
    value("x", x), value("b", b), { id: "half", label: "b/2", value: b / 2 },
    { id: "x2", label: "x^2", value: x ** 2 },
    { id: "bx", label: "bx", value: b * x },
    { id: "corner", label: "missing corner", value: round((b / 2) ** 2) },
    { id: "complete", label: "completed square area", value: round((x + b / 2) ** 2) },
  ],
  invariant: ({ x, b }) => `x^2 + bx + (b/2)^2 = ${round((x + b / 2) ** 2)} forms a perfect square.`,
  renderVisual: CompletingSquareVisual,
});

export const quadraticFactorizationPhaseTwelveConfig = makeConfig({
  steps: ["Start with x^2", "Choose m and n", "Build two middle rectangles", "Build constant rectangle mn", "Form rectangle dimensions x+m and x+n", "Conclude factorization"],
  parameters: [{ id: "x", label: "x", min: 3, max: 7, defaultValue: 4, step: 1 }, { id: "m", label: "m", min: 1, max: 5, defaultValue: 3, step: 1 }, { id: "n", label: "n", min: 1, max: 5, defaultValue: 4, step: 1 }],
  prediction: ["If m = 3 and n = 4, what are p and q?", "p = 7 and q = 12."],
  misconception: ["To factor x^2+px+q, we only need m+n=p.", "Both conditions must hold: m+n=p and mn=q."],
  tokens: ["x2", "mx", "nx", "mn", "factors"],
  formula: ({ x, m, n }) => `x^2 + ${(m + n)}x + ${m * n} = (${x}+${m})(${x}+${n})`,
  liveValues: ({ x, m, n }) => [
    value("x", x), value("m", m), value("n", n),
    { id: "p", label: "p = m+n", value: m + n },
    { id: "q", label: "q = mn", value: m * n },
    { id: "regions", label: "x^2, mx, nx, mn", value: `${x ** 2}, ${m * x}, ${n * x}, ${m * n}` },
  ],
  invariant: ({ m, n }) => `(x+${m})(x+${n}) multiplies to x^2 + ${(m + n)}x + ${m * n}.`,
  renderVisual: QuadraticFactorVisual,
});

export const perfectSquareRecognitionPhaseTwelveConfig = makeConfig({
  steps: ["Identify x^2", "Identify a^2", "Check the middle term", "Arrange two ax rectangles", "Complete the square", "Recognize the trinomial"],
  parameters: [{ id: "x", label: "x", min: 3, max: 7, defaultValue: 5, step: 1 }, { id: "a", label: "a", min: 1, max: 5, defaultValue: 3, step: 1 }],
  prediction: ["What must the middle term be for x^2 + ? + a^2 to be a perfect square?", "2ax."],
  misconception: ["Any trinomial with first and last square terms is a perfect square.", "The middle term must be exactly twice the product of the square roots."],
  tokens: ["x2", "twoax", "a2", "complete"],
  formula: ({ a }) => `x^2 + 2(${a})x + ${a}^2 = (x+${a})^2`,
  liveValues: ({ x, a }) => [
    value("x", x), value("a", a),
    { id: "middle", label: "2ax", value: 2 * a * x },
    { id: "a2", label: "a^2", value: a ** 2 },
    { id: "side", label: "complete square side x+a", value: x + a },
    { id: "checklist", label: "recognition checklist", value: "square, square, twice product" },
  ],
  invariant: ({ x, a }) => `x^2 + 2ax + a^2 = ${(x + a) ** 2}.`,
  renderVisual: PerfectSquareRecognitionVisual,
});

export const cubeOfSumPhaseTwelveConfig = makeCubeConfig("sum");
export const cubeOfDifferencePhaseTwelveConfig = makeCubeConfig("difference");

export const sumDifferenceProductPhaseTwelveConfig = makeConfig({
  steps: ["Build dimensions a+b and a-b", "Form the rectangle", "Compare with a^2 square", "Remove b^2 square", "Show equal areas", "Conclude a^2-b^2"],
  parameters: [{ id: "a", label: "a", min: 4, max: 9, defaultValue: 7, step: 1 }, { id: "b", label: "b", min: 1, max: 6, defaultValue: 3, step: 1 }],
  prediction: ["What identity does (a+b)(a-b) create?", "Difference of squares."],
  misconception: ["(a+b)(a-b) = a^2 + b^2.", "The cross terms cancel: +ab and -ab, leaving a^2-b^2."],
  tokens: ["a-plus-b", "a-minus-b", "a2", "b2", "remaining"],
  formula: ({ a, b }) => `(${a}+${b})(${a}-${b}) = ${a ** 2} - ${b ** 2} = ${a ** 2 - b ** 2}`,
  liveValues: ({ a, b }) => [
    value("a", a), value("b", b),
    { id: "a-plus-b", label: "a+b", value: a + b },
    { id: "a-minus-b", label: "a-b", value: a - b },
    { id: "rectangle", label: "rectangle area", value: (a + b) * (a - b) },
    { id: "difference", label: "a^2-b^2", value: a ** 2 - b ** 2 },
    { id: "cancellation", label: "cross-term cancellation", value: "+ab and -ab cancel" },
  ],
  invariant: ({ a, b }) => `(a+b)(a-b) = ${(a + b) * (a - b)} and a^2-b^2 = ${a ** 2 - b ** 2}.`,
  renderVisual: SumDifferenceProductVisual,
});

export const phaseTwelveRouteSlugs = [
  ["algebraic-identities", "distributive-law-area-model"],
  ["algebraic-identities", "three-term-square"],
  ["algebraic-identities", "completing-the-square"],
  ["algebraic-identities", "quadratic-factorization-area-model"],
  ["algebraic-identities", "perfect-square-trinomial-recognition"],
  ["algebraic-identities", "cube-of-sum"],
  ["algebraic-identities", "cube-of-difference"],
  ["algebraic-identities", "sum-and-difference-product"],
] as const;

export const phaseTwelveConfigs = [
  distributiveLawPhaseTwelveConfig,
  threeTermSquarePhaseTwelveConfig,
  completingSquarePhaseTwelveConfig,
  quadraticFactorizationPhaseTwelveConfig,
  perfectSquareRecognitionPhaseTwelveConfig,
  cubeOfSumPhaseTwelveConfig,
  cubeOfDifferencePhaseTwelveConfig,
  sumDifferenceProductPhaseTwelveConfig,
];

type ConfigInput = {
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValuesLike) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

type PhaseTwoValuesLike = Record<string, number>;

function makeConfig(input: ConfigInput): PhaseTwoProofConfig {
  return {
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: algebraRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: labelFor(token), visualLabel: visualLabelFor(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values as PhaseTwoValuesLike),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: "tile-invariant", label: "full area equals sum of parts", holds: true, explanation: input.invariant(values as PhaseTwoValuesLike) }],
    assumptions: ["Tiles represent exact algebraic area or volume terms.", "Values are clamped to safe positive dimensions.", "The same region keeps the same value when rearranged."],
    renderVisual: input.renderVisual,
  };
}

function makeCubeConfig(mode: "sum" | "difference"): PhaseTwoProofConfig {
  const isSum = mode === "sum";
  return makeConfig({
    steps: isSum
      ? ["Build side a+b", "Form the whole cube", "Split into a and b dimensions", "Identify pure cubes", "Count mixed slabs", "Conclude the cube expansion"]
      : ["Start with a^3", "Mark b removed from each dimension", "Remove three slabs", "Add back overlaps", "Correct final corner", "Conclude the signed cube formula"],
    parameters: [{ id: "a", label: "a", min: 4, max: 8, defaultValue: 5, step: 1 }, { id: "b", label: "b", min: 1, max: 4, defaultValue: 2, step: 1 }],
    prediction: isSum ? ["Why do the middle terms have coefficient 3?", "There are three orientation placements for each mixed slab type."] : ["Why do some terms become positive after subtracting slabs?", "Because overlapping removed parts are subtracted more than once and must be added back."],
    misconception: isSum ? ["(a+b)^3 = a^3 + b^3.", "The full cube includes mixed-volume blocks, not only the two pure cubes."] : ["(a-b)^3 = a^3 - b^3.", "Removing b from each dimension creates several slab and overlap corrections."],
    tokens: isSum ? ["a3", "a2b", "ab2", "b3", "full"] : ["a3", "minus-a2b", "plus-ab2", "minus-b3", "remaining"],
    formula: ({ a, b }) => isSum ? `(${a}+${b})^3 = ${a ** 3} + ${3 * a * a * b} + ${3 * a * b * b} + ${b ** 3}` : `(${a}-${b})^3 = ${a ** 3} - ${3 * a * a * b} + ${3 * a * b * b} - ${b ** 3}`,
    liveValues: ({ a, b }) => [
      value("a", a), value("b", b), ...(isSum ? [] : [{ id: "a-minus-b", label: "a-b", value: a - b }]),
      { id: "total", label: isSum ? "total volume" : "final volume", value: isSum ? (a + b) ** 3 : (a - b) ** 3 },
      { id: "a3", label: "a^3", value: a ** 3 },
      { id: "a2b", label: "3a^2b", value: 3 * a * a * b },
      { id: "ab2", label: "3ab^2", value: 3 * a * b * b },
      { id: "b3", label: "b^3", value: b ** 3 },
    ],
    invariant: ({ a, b }) => isSum ? `total volume ${(a + b) ** 3} equals all pure and mixed blocks.` : `signed decomposition equals (a-b)^3 = ${(a - b) ** 3}.`,
    renderVisual: isSum ? CubeSumVisual : CubeDifferenceVisual,
  });
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the visible tile regions before simplifying.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Only the outer terms matter.", feedback: "The inner tile regions also count." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the linked tile region.", options: [{ id: "regions", label: "Count every tile region.", correct: true, feedback: "Correct." }, { id: "memorize", label: "Use only the memorized shortcut.", feedback: "The shortcut must match the regions." }] };
}

function step(title: string, index: number) {
  return { id: `p12-${index}`, title, description: title, focusLabel: index < 2 ? "setup" : index < 5 ? "tile regions" : "identity" };
}

function value(id: string, v: number) {
  return { id, label: id, value: v };
}

function labelFor(token: string) {
  return token.replace(/-/g, " ");
}

function visualLabelFor(token: string) {
  if (token === "full") return "full area";
  if (token === "complete") return "completed square";
  if (token === "corner") return "missing/add-back corner";
  if (token === "factors") return "factor dimensions";
  if (token === "remaining") return "remaining signed region";
  return "tile region";
}
