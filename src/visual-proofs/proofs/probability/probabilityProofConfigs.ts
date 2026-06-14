import type { ProofStep } from "../../data/proofTypes";

export type ProbabilityProofKind =
  | "sampleSpace"
  | "complement"
  | "mutuallyExclusive"
  | "generalAddition"
  | "independentMultiplication"
  | "conditional"
  | "bayes"
  | "totalProbability"
  | "expectedValue"
  | "permutation"
  | "combination"
  | "binomial"
  | "geometricArea"
  | "birthday"
  | "montyHall";

export type ProbabilityParameterKey = "pA" | "pB" | "overlap" | "prior" | "likelihood" | "falsePositive" | "n" | "r" | "k" | "p" | "trials" | "people" | "favorable";

export type ProbabilityProofConfig = {
  kind: ProbabilityProofKind;
  parameters: Partial<Record<ProbabilityParameterKey, { label: string; min: number; max: number; step?: number; defaultValue: number }>>;
  toggles: string[];
  steps: ProofStep[];
  formulas: string[];
  notes: string[];
  questions: string[];
};

const standardSteps: ProofStep[] = [
  { id: "space", title: "Build the sample space", description: "Start with all possible outcomes as visible objects or regions.", focusLabel: "sample space" },
  { id: "event", title: "Highlight the event", description: "Mark the outcomes or paths that satisfy the condition.", focusLabel: "event" },
  { id: "probability", title: "Read the probability", description: "Compare favorable outcomes, regions, paths, or long-run frequencies with the total.", focusLabel: "probability" },
];

const questions = ["Which part of the visual is the sample space?", "How does changing the control change the probability statement?"];

export const probabilityProofConfigs: Record<string, ProbabilityProofConfig> = {
  SampleSpaceEventProbabilityProof: {
    kind: "sampleSpace",
    parameters: { favorable: { label: "Favorable outcomes", min: 1, max: 24, defaultValue: 6 } },
    toggles: ["Show favorable outcomes"],
    steps: standardSteps,
    formulas: ["P(E) = |E| / |S|"],
    notes: ["Probability compares event size with total sample-space size."],
    questions,
  },
  ComplementRuleProof: {
    kind: "complement",
    parameters: { pA: { label: "P(A)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.35 } },
    toggles: ["Show complement"],
    steps: standardSteps,
    formulas: ["P(A) + P(A') = 1", "P(A') = 1 - P(A)"],
    notes: ["An event and its complement fill the entire sample space without overlap."],
    questions,
  },
  AdditionRuleMutuallyExclusiveProof: {
    kind: "mutuallyExclusive",
    parameters: { pA: { label: "P(A)", min: 0.05, max: 0.6, step: 0.05, defaultValue: 0.25 }, pB: { label: "P(B)", min: 0.05, max: 0.6, step: 0.05, defaultValue: 0.3 } },
    toggles: ["Show union highlight"],
    steps: standardSteps,
    formulas: ["A intersection B = empty", "P(A union B) = P(A) + P(B)"],
    notes: ["No overlap means no double-counting."],
    questions,
  },
  GeneralAdditionRuleUnionProof: {
    kind: "generalAddition",
    parameters: { pA: { label: "P(A)", min: 0.1, max: 0.8, step: 0.05, defaultValue: 0.45 }, pB: { label: "P(B)", min: 0.1, max: 0.8, step: 0.05, defaultValue: 0.4 }, overlap: { label: "P(A intersection B)", min: 0, max: 0.5, step: 0.05, defaultValue: 0.15 } },
    toggles: ["Show double-counting explanation"],
    steps: standardSteps,
    formulas: ["P(A union B) = P(A) + P(B) - P(A intersection B)"],
    notes: ["The overlap is counted in A and again in B, so subtract it once."],
    questions,
  },
  MultiplicationRuleIndependentProof: {
    kind: "independentMultiplication",
    parameters: { pA: { label: "P(A)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.6 }, pB: { label: "P(B)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.5 } },
    toggles: ["Show area model"],
    steps: standardSteps,
    formulas: ["If A and B are independent, P(A intersection B) = P(A)P(B)"],
    notes: ["The joint probability is rectangle area: width times height."],
    questions,
  },
  ConditionalProbabilityProof: {
    kind: "conditional",
    parameters: { pB: { label: "P(B)", min: 0.1, max: 0.9, step: 0.05, defaultValue: 0.55 }, overlap: { label: "P(A intersection B)", min: 0.05, max: 0.5, step: 0.05, defaultValue: 0.25 } },
    toggles: ["Show restricted sample space"],
    steps: standardSteps,
    formulas: ["P(A | B) = P(A intersection B) / P(B)"],
    notes: ["Conditioning shrinks the sample space to B."],
    questions,
  },
  BayesTheoremTreeDiagramProof: {
    kind: "bayes",
    parameters: { prior: { label: "P(A)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.3 }, likelihood: { label: "P(B|A)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.8 }, falsePositive: { label: "P(B|not A)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.2 } },
    toggles: ["Show path probabilities", "Show posterior calculation"],
    steps: standardSteps,
    formulas: ["P(B)=P(B|A)P(A)+P(B|A')P(A')", "P(A|B)=P(B|A)P(A)/P(B)"],
    notes: ["Bayes reverses a conditional probability by comparing B paths."],
    questions,
  },
  LawOfTotalProbabilityProof: {
    kind: "totalProbability",
    parameters: { pA: { label: "P(A1)", min: 0.1, max: 0.9, step: 0.05, defaultValue: 0.4 }, pB: { label: "P(B|A1)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.75 }, overlap: { label: "P(B|A2)", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.25 } },
    toggles: ["Show contribution bars"],
    steps: standardSteps,
    formulas: ["P(B) = sum P(B | Ai)P(Ai)"],
    notes: ["Partition contributions add to the total probability of B."],
    questions,
  },
  ExpectedValueLongRunAverageProof: {
    kind: "expectedValue",
    parameters: { trials: { label: "Trials", min: 10, max: 10000, step: 10, defaultValue: 500 } },
    toggles: ["Show long-run average graph"],
    steps: standardSteps,
    formulas: ["E(X) = sum xP(x)"],
    notes: ["Expected value is a weighted average and a long-run simulation target."],
    questions,
  },
  PermutationsArrangementsProof: {
    kind: "permutation",
    parameters: { n: { label: "Objects n", min: 2, max: 8, defaultValue: 5 }, r: { label: "Slots r", min: 1, max: 5, defaultValue: 3 } },
    toggles: ["Show slot choices"],
    steps: standardSteps,
    formulas: ["P(n,r) = n! / (n-r)!"],
    notes: ["Order matters, so each slot reduces the choices."],
    questions,
  },
  CombinationsSelectionsProof: {
    kind: "combination",
    parameters: { n: { label: "Objects n", min: 2, max: 10, defaultValue: 6 }, r: { label: "Selected r", min: 1, max: 5, defaultValue: 3 } },
    toggles: ["Show order ignored"],
    steps: standardSteps,
    formulas: ["C(n,r) = P(n,r) / r!", "C(n,r) = n!/[r!(n-r)!]"],
    notes: ["Combinations group many arrangements into one unordered selection."],
    questions,
  },
  BinomialProbabilityVisualProof: {
    kind: "binomial",
    parameters: { n: { label: "Trials n", min: 1, max: 12, defaultValue: 6 }, k: { label: "Successes k", min: 0, max: 12, defaultValue: 2 }, p: { label: "Success probability p", min: 0.05, max: 0.95, step: 0.05, defaultValue: 0.5 } },
    toggles: ["Show binomial coefficient"],
    steps: standardSteps,
    formulas: ["P(X=k) = C(n,k)p^k(1-p)^(n-k)"],
    notes: ["Choose success positions, then multiply by each pattern probability."],
    questions,
  },
  GeometricProbabilityAreaProof: {
    kind: "geometricArea",
    parameters: { favorable: { label: "Favorable area percent", min: 5, max: 95, step: 5, defaultValue: 35 }, trials: { label: "Random points", min: 20, max: 1000, step: 20, defaultValue: 180 } },
    toggles: ["Show random points"],
    steps: standardSteps,
    formulas: ["P(E) = favorable area / total area"],
    notes: ["Uniform geometric probability is area ratio."],
    questions,
  },
  BirthdayParadoxSimulationProof: {
    kind: "birthday",
    parameters: { people: { label: "People", min: 2, max: 80, defaultValue: 23 }, trials: { label: "Trials", min: 100, max: 5000, step: 100, defaultValue: 1000 } },
    toggles: ["Show exact approximation"],
    steps: standardSteps,
    formulas: ["P(at least one match) = 1 - P(no match)"],
    notes: ["Pair comparisons grow quickly, so matches appear sooner than intuition expects."],
    questions,
  },
  MontyHallVisualProof: {
    kind: "montyHall",
    parameters: { trials: { label: "Simulation trials", min: 10, max: 10000, step: 10, defaultValue: 1000 } },
    toggles: ["Switch strategy"],
    steps: standardSteps,
    formulas: ["Stay wins 1/3", "Switch wins 2/3"],
    notes: ["The unchosen unopened door inherits the original 2/3 probability when the host reveals a goat."],
    questions,
  },
};
