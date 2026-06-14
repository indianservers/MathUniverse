import type { ProofStep } from "../../data/proofTypes";

export type SequenceSeriesProofKind =
  | "apSteps"
  | "naturalSum"
  | "oddSum"
  | "apSum"
  | "gpScaling"
  | "finiteGp"
  | "infiniteGp"
  | "triangular"
  | "squareLayers"
  | "fibTiling"
  | "fibSpiral"
  | "fibSum"
  | "pascal"
  | "induction"
  | "harmonic";

export type SequenceSeriesParameterKey = "a" | "d" | "r" | "n" | "k";

export type SequenceSeriesProofConfig = {
  kind: SequenceSeriesProofKind;
  parameters: Partial<Record<SequenceSeriesParameterKey, { label: string; min: number; max: number; step?: number; defaultValue: number }>>;
  toggles: string[];
  steps: ProofStep[];
  formulas: string[];
  notes: string[];
  questions: string[];
};

const questions = ["What pattern stays constant as the slider changes?", "How does the visual rearrangement justify the formula?"];

const steps = (focus: string): ProofStep[] => [
  { id: "pattern", title: "Build the pattern", description: "Start with visible terms instead of a formula.", focusLabel: focus },
  { id: "rearrange", title: "Reveal the structure", description: "Use grouping, pairing, scaling, or tiling to expose the relationship.", focusLabel: "structure" },
  { id: "formula", title: "Read the formula", description: "Translate the visual pattern into notation.", focusLabel: "formula" },
];

export const sequenceSeriesProofConfigs: Record<string, SequenceSeriesProofConfig> = {
  ArithmeticProgressionEqualStepsProof: {
    kind: "apSteps",
    parameters: { a: { label: "First term a", min: -10, max: 20, defaultValue: 2 }, d: { label: "Common difference d", min: -8, max: 12, defaultValue: 3 }, n: { label: "Term count n", min: 2, max: 14, defaultValue: 8 } },
    toggles: ["Show jump labels"],
    steps: steps("equal steps"),
    formulas: ["a_n = a + (n - 1)d"],
    notes: ["Arithmetic progressions move by the same additive step each time."],
    questions,
  },
  SumFirstNNaturalNumbersProof: {
    kind: "naturalSum",
    parameters: { n: { label: "n", min: 1, max: 20, defaultValue: 8 } },
    toggles: ["Show duplicate rectangle"],
    steps: steps("triangle"),
    formulas: ["1 + 2 + ... + n = n(n + 1)/2"],
    notes: ["Two matching triangular dot patterns make an n by n+1 rectangle."],
    questions,
  },
  SumFirstNOddNumbersProof: {
    kind: "oddSum",
    parameters: { n: { label: "n", min: 1, max: 16, defaultValue: 7 } },
    toggles: ["Show layer labels"],
    steps: steps("odd layers"),
    formulas: ["1 + 3 + 5 + ... + (2n - 1) = n^2"],
    notes: ["Each odd number is the next L-shaped layer of a square."],
    questions,
  },
  SumArithmeticProgressionProof: {
    kind: "apSum",
    parameters: { a: { label: "First term a", min: 1, max: 12, defaultValue: 2 }, d: { label: "Common difference d", min: 1, max: 8, defaultValue: 2 }, n: { label: "Term count n", min: 2, max: 12, defaultValue: 7 } },
    toggles: ["Show pair sums"],
    steps: steps("paired bars"),
    formulas: ["S_n = n/2(a + l)", "l = a + (n - 1)d"],
    notes: ["Pairing first with last makes every pair sum the same."],
    questions,
  },
  GeometricProgressionScalingProof: {
    kind: "gpScaling",
    parameters: { a: { label: "First term a", min: 1, max: 8, defaultValue: 2 }, r: { label: "Ratio r", min: 0.5, max: 3, step: 0.1, defaultValue: 1.5 }, n: { label: "Term count n", min: 2, max: 10, defaultValue: 7 } },
    toggles: ["Show ratio labels"],
    steps: steps("scaling"),
    formulas: ["a_n = ar^(n-1)"],
    notes: ["Geometric progressions multiply by the same scale factor each time."],
    questions,
  },
  FiniteGeometricSeriesSumProof: {
    kind: "finiteGp",
    parameters: { a: { label: "First term a", min: 1, max: 8, defaultValue: 3 }, r: { label: "Ratio r", min: 0.2, max: 2.5, step: 0.1, defaultValue: 0.6 }, n: { label: "Terms n", min: 2, max: 12, defaultValue: 6 } },
    toggles: ["Show algebra cancellation"],
    steps: steps("geometric bars"),
    formulas: ["S(1 - r) = a(1 - r^n)", "S = a(1 - r^n)/(1 - r)"],
    notes: ["Multiplying the series by r shifts every term, so subtraction cancels the middle."],
    questions,
  },
  InfiniteGeometricSeriesConvergenceProof: {
    kind: "infiniteGp",
    parameters: { a: { label: "First amount a", min: 1, max: 8, defaultValue: 4 }, r: { label: "Ratio r", min: 0.1, max: 0.9, step: 0.05, defaultValue: 0.5 }, n: { label: "Visible terms", min: 2, max: 14, defaultValue: 8 } },
    toggles: ["Show convergence meter"],
    steps: steps("shrinking parts"),
    formulas: ["As n -> infinity, r^n -> 0", "S_infinity = a/(1 - r)"],
    notes: ["When |r| < 1, each new term fills less remaining space."],
    questions,
  },
  TriangularNumbersProof: {
    kind: "triangular",
    parameters: { n: { label: "n", min: 1, max: 20, defaultValue: 9 } },
    toggles: ["Show duplicate rectangle"],
    steps: steps("triangular dots"),
    formulas: ["T_n = 1 + 2 + ... + n = n(n + 1)/2"],
    notes: ["Triangular numbers are natural-number sums arranged as rows."],
    questions,
  },
  SquareNumbersOddLayersProof: {
    kind: "squareLayers",
    parameters: { n: { label: "n", min: 1, max: 16, defaultValue: 8 } },
    toggles: ["Show layer sizes"],
    steps: steps("square layers"),
    formulas: ["n^2 - (n - 1)^2 = 2n - 1"],
    notes: ["Growing a square by one row and one column adds an odd number of cells."],
    questions,
  },
  FibonacciSequenceTilingProof: {
    kind: "fibTiling",
    parameters: { n: { label: "Fibonacci squares", min: 2, max: 12, defaultValue: 8 } },
    toggles: ["Show recurrence labels"],
    steps: steps("Fibonacci tiles"),
    formulas: ["F_n = F_(n-1) + F_(n-2)"],
    notes: ["Each new Fibonacci side length is the sum of the previous two."],
    questions,
  },
  FibonacciSpiralApproximationProof: {
    kind: "fibSpiral",
    parameters: { n: { label: "Squares", min: 2, max: 12, defaultValue: 8 } },
    toggles: ["Show square labels"],
    steps: steps("quarter arcs"),
    formulas: ["F_(n+1)/F_n -> phi"],
    notes: ["Quarter arcs inside Fibonacci squares approximate a spiral."],
    questions,
  },
  SumOfFibonacciNumbersProof: {
    kind: "fibSum",
    parameters: { n: { label: "n", min: 2, max: 12, defaultValue: 8 } },
    toggles: ["Show identity explanation"],
    steps: steps("Fibonacci accumulation"),
    formulas: ["sum from k=1 to n of F_k = F_(n+2) - 1"],
    notes: ["The accumulated Fibonacci count is always one less than a later Fibonacci number."],
    questions,
  },
  PascalTriangleBinomialCoefficientsProof: {
    kind: "pascal",
    parameters: { n: { label: "Row n", min: 1, max: 12, defaultValue: 6 }, k: { label: "Column k", min: 0, max: 12, defaultValue: 3 } },
    toggles: ["Show binomial expansion"],
    steps: steps("Pascal rule"),
    formulas: ["C(n,k) = C(n-1,k-1) + C(n-1,k)"],
    notes: ["Every interior entry is the sum of the two entries above it."],
    questions,
  },
  VisualInductionDominoGrowthProof: {
    kind: "induction",
    parameters: { n: { label: "Dominoes", min: 3, max: 24, defaultValue: 12 } },
    toggles: ["Show implication arrows"],
    steps: [
      { id: "base", title: "Base case", description: "The first domino stands for P(1).", focusLabel: "P(1)" },
      { id: "step", title: "Induction step", description: "One true case pushes the next true case.", focusLabel: "P(k) => P(k+1)" },
      { id: "all", title: "All cases follow", description: "The chain reaches every domino.", focusLabel: "all n" },
    ],
    formulas: ["Base case: P(1) is true", "Induction step: P(k) => P(k+1)", "Therefore P(n) is true for all n"],
    notes: ["Induction is a chain of guaranteed implications, not a finite checklist."],
    questions,
  },
  HarmonicSeriesGrowthIntuitionProof: {
    kind: "harmonic",
    parameters: { n: { label: "Terms", min: 4, max: 128, defaultValue: 32 } },
    toggles: ["Show partial sum graph"],
    steps: steps("grouped bars"),
    formulas: ["1 + 1/2 + (1/3 + 1/4) + (1/5 + ... + 1/8) + ...", "Each group adds at least 1/2"],
    notes: ["The harmonic series grows slowly, but the grouped lower bounds keep increasing without limit."],
    questions,
  },
};
