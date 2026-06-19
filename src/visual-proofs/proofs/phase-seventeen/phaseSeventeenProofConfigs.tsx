import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  AdditionRuleVisual,
  ComplementRuleVisual,
  ConditionalProbabilityVisual,
  ExperimentalProbabilityVisual,
  ExpectedValueVisual,
  FavorableTotalVisual,
  IndependentProductVisual,
  ProbabilityTreeVisual,
} from "./PhaseSeventeenProbabilityVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const probabilityRoute = "/olympyard/practice/probability-foundations";

export const favorableTotalPhaseSeventeenConfig = makeConfig({
  modelKey: "sample-space",
  steps: ["Build the sample space", "Select event A", "Count favorable outcomes", "Count total outcomes", "Form the ratio", "Conclude P(A)"],
  parameters: [param("total", "Total outcomes", 2, 36, 10, 1), param("favorable", "Favorable outcomes", 0, 36, 3, 1)],
  prediction: ["If 3 out of 10 outcomes are favorable, what is P(A)?", "3/10 = 0.3 = 30%."],
  misconception: ["Probability counts only favorable outcomes.", "Probability compares favorable outcomes to the total equally likely outcomes."],
  tokens: ["P-A", "favorable-outcomes", "total-outcomes", "fraction"],
  formula: ({ favorable, total }) => `P(A) = favorable/total = ${Math.min(favorable, total)}/${total} = ${fmt(Math.min(favorable, total) / total)}`,
  liveValues: ({ favorable, total }) => probabilityValues(Math.min(favorable, total), total),
  invariant: ({ favorable, total }) => `Because favorable outcomes are inside the sample space, 0 <= P(A) <= 1. Here P(A)=${fmt(Math.min(favorable, total) / total)}.`,
  renderVisual: FavorableTotalVisual,
});

export const complementPhaseSeventeenConfig = makeConfig({
  modelKey: "complement",
  steps: ["Draw sample space", "Mark event A", "Mark everything outside A", "Add A and A complement", "Compare with whole space", "Conclude complement rule"],
  parameters: [param("total", "Total outcomes", 2, 36, 20, 1), param("aCount", "A count", 0, 36, 14, 1)],
  prediction: ["If P(A)=0.7, what is P(A complement)?", "0.3."],
  misconception: ["The complement means the opposite event has probability -P(A).", "The complement is the remaining part of the sample space, so its probability is 1 - P(A)."],
  tokens: ["A", "A-complement", "one", "one-minus-P-A"],
  formula: ({ aCount, total }) => `P(A complement) = 1 - P(A) = 1 - ${fmt(Math.min(aCount, total) / total)} = ${fmt(1 - Math.min(aCount, total) / total)}`,
  liveValues: ({ aCount, total }) => [value("total-outcomes", "total outcomes", total), value("A-count", "A count", Math.min(aCount, total)), value("A-complement-count", "A complement count", total - Math.min(aCount, total)), value("P-A", "P(A)", fmt(Math.min(aCount, total) / total)), value("P-A-complement", "P(A complement)", fmt(1 - Math.min(aCount, total) / total)), value("invariant", "invariant", "P(A)+P(A complement)=1")],
  invariant: () => "Event A and its complement partition the sample space, so their probabilities add to 1.",
  renderVisual: ComplementRuleVisual,
});

export const additionPhaseSeventeenConfig = makeConfig({
  modelKey: "union-intersection",
  steps: ["Draw event A", "Draw event B", "Notice overlap", "Add A and B", "Remove double-counted overlap", "Conclude addition rule"],
  parameters: [param("total", "Total outcomes", 10, 60, 40, 1), param("aCount", "A count", 1, 40, 18, 1), param("bCount", "B count", 1, 40, 16, 1), param("intersection", "Intersection count", 0, 24, 6, 1)],
  prediction: ["Why do we subtract P(A intersection B)?", "Because the overlap is counted twice when adding P(A) and P(B)."],
  misconception: ["P(A union B) is always P(A)+P(B).", "That only works for disjoint events; overlapping events need the intersection subtracted."],
  tokens: ["A-union-B", "P-A", "P-B", "A-intersection-B", "subtract-overlap"],
  formula: ({ aCount, bCount, intersection, total }) => `P(A union B)=(${aCount}+${bCount}-${intersection})/${total}=${fmt((aCount + bCount - intersection) / total)}`,
  liveValues: ({ total, aCount, bCount, intersection }) => [value("total-outcomes", "total outcomes", total), value("A-count", "A count", aCount), value("B-count", "B count", bCount), value("intersection-count", "intersection count", intersection), value("union-count", "union count", aCount + bCount - intersection), value("P-A", "P(A)", fmt(aCount / total)), value("P-B", "P(B)", fmt(bCount / total)), value("P-intersection", "P(A intersection B)", fmt(intersection / total)), value("P-union", "P(A union B)", fmt((aCount + bCount - intersection) / total))],
  invariant: () => "The union count equals A count plus B count minus the intersection count.",
  renderVisual: AdditionRuleVisual,
});

export const multiplicationPhaseSeventeenConfig = makeConfig({
  modelKey: "independent-product",
  steps: ["Choose P(A)", "Choose P(B)", "Build product grid", "Highlight A and B", "Multiply probabilities", "Conclude independent multiplication rule"],
  parameters: [param("pA", "P(A)", 0.05, 0.95, 0.5, 0.05), param("pB", "P(B)", 0.05, 0.95, 0.33, 0.05)],
  prediction: ["If P(A)=1/2 and P(B)=1/3 and events are independent, what is P(A and B)?", "1/6."],
  misconception: ["Independent means events cannot happen together.", "Independent means one event does not change the probability of the other; they can happen together."],
  tokens: ["P-A", "P-B", "P-A-times-P-B", "A-intersection-B"],
  formula: ({ pA, pB }) => `P(A and B)=P(A)P(B)=${fmt(pA)} x ${fmt(pB)} = ${fmt(pA * pB)}`,
  liveValues: ({ pA, pB }) => [value("P-A", "P(A)", fmt(pA)), value("P-B", "P(B)", fmt(pB)), value("P-intersection", "P(A and B)", fmt(pA * pB)), value("independence-status", "independence status", "independent"), value("invariant", "invariant", "independent intersection equals product")],
  invariant: ({ pA, pB }) => `For independent events, the intersection area is the product ${fmt(pA * pB)}.`,
  renderVisual: IndependentProductVisual,
});

export const conditionalPhaseSeventeenConfig = makeConfig({
  modelKey: "restricted-sample-space",
  steps: ["Draw full sample space", "Mark B", "Restrict attention to B", "Count A inside B", "Divide by size of B", "Conclude conditional probability"],
  parameters: [param("total", "Total outcomes", 10, 80, 40, 1), param("bCount", "B count", 1, 60, 20, 1), param("intersection", "A inside B", 0, 40, 8, 1)],
  prediction: ["In P(A|B), what is the new sample space?", "B."],
  misconception: ["P(A|B) is always the same as P(A).", "Conditioning on B changes the sample space; it equals P(A) only in special cases such as independence."],
  tokens: ["B", "A-intersection-B", "P-A-given-B", "divide-by-P-B"],
  formula: ({ bCount, intersection }) => `P(A|B)=P(A intersection B)/P(B)=${Math.min(intersection, bCount)}/${bCount}=${fmt(Math.min(intersection, bCount) / bCount)}`,
  liveValues: ({ total, bCount, intersection }) => [value("total-outcomes", "total outcomes", total), value("B-count", "B count", bCount), value("A-intersection-B-count", "A intersection B count", Math.min(intersection, bCount)), value("P-B", "P(B)", fmt(bCount / total)), value("P-intersection", "P(A intersection B)", fmt(Math.min(intersection, bCount) / total)), value("P-A-given-B", "P(A|B)", fmt(Math.min(intersection, bCount) / bCount)), value("invariant", "invariant", "conditional probability uses B as the new sample space")],
  invariant: () => "The denominator changes from the full sample space to B.",
  renderVisual: ConditionalProbabilityVisual,
});

export const treePhaseSeventeenConfig = makeConfig({
  modelKey: "branch-path",
  steps: ["Build first-stage branches", "Add second-stage branches", "Select a path", "Multiply along the path", "Add selected paths if needed", "Conclude compound probability"],
  parameters: [param("pA", "P(A)", 0.05, 0.95, 0.6, 0.05), param("pBGivenA", "P(B|A)", 0.05, 0.95, 0.7, 0.05), param("pBGivenNotA", "P(B|not A)", 0.05, 0.95, 0.25, 0.05)],
  prediction: ["How do you find probability of one complete path?", "Multiply the branch probabilities along that path."],
  misconception: ["In a tree diagram, we add along a branch.", "Multiply along a path; add separate disjoint paths."],
  tokens: ["branch-probability", "path-product", "sum-of-paths"],
  formula: ({ pA, pBGivenA, pBGivenNotA }) => `P(B)=P(A)P(B|A)+P(not A)P(B|not A)=${fmt(pA * pBGivenA + (1 - pA) * pBGivenNotA)}`,
  liveValues: ({ pA, pBGivenA, pBGivenNotA }) => [value("stage-1-probabilities", "stage 1 probabilities", `A ${fmt(pA)}, not A ${fmt(1 - pA)}`), value("stage-2-conditional-probabilities", "stage 2 conditional probabilities", `B|A ${fmt(pBGivenA)}, B|not A ${fmt(pBGivenNotA)}`), value("selected-paths", "selected paths", "A then B; not A then B"), value("path-products", "path products", `${fmt(pA * pBGivenA)}, ${fmt((1 - pA) * pBGivenNotA)}`), value("total-probability", "total probability", fmt(pA * pBGivenA + (1 - pA) * pBGivenNotA)), value("invariant", "invariant", "terminal path probabilities sum to 1")],
  invariant: () => "Tree terminal probabilities partition the full experiment, so all terminal paths sum to 1.",
  renderVisual: ProbabilityTreeVisual,
});

export const experimentalPhaseSeventeenConfig = makeConfig({
  modelKey: "trials-frequency",
  steps: ["Set theoretical probability", "Run a few trials", "Compare experimental frequency", "Run many trials", "Watch relative frequency stabilize", "Conclude law of large numbers intuition"],
  parameters: [param("p", "Theoretical probability p", 0.05, 0.95, 0.5, 0.05), param("trials", "Trials", 1, 500, 100, 1)],
  prediction: ["With more trials, should experimental probability usually get closer to the theoretical value?", "Usually yes, though random variation remains."],
  misconception: ["After many trials, experimental probability must equal theoretical probability exactly.", "It tends to get close, but random variation can remain."],
  tokens: ["successes-over-trials", "theoretical-p", "large-number"],
  formula: ({ p, trials }) => `experimental probability = successes/trials = ${deterministicSuccesses(p, trials)}/${trials} = ${fmt(deterministicSuccesses(p, trials) / trials)}`,
  liveValues: ({ p, trials }) => {
    const successes = deterministicSuccesses(p, trials);
    return [value("trials", "trials", trials), value("successes", "successes", successes), value("experimental-probability", "experimental probability", fmt(successes / trials)), value("theoretical-probability", "theoretical probability", fmt(p)), value("difference", "difference", fmt(Math.abs(successes / trials - p))), value("insight", "insight", "variation shrinks relatively as trials grow")];
  },
  invariant: ({ p, trials }) => `The running frequency ${fmt(deterministicSuccesses(p, trials) / trials)} is compared with theoretical p=${fmt(p)}.`,
  renderVisual: ExperimentalProbabilityVisual,
});

export const expectedValuePhaseSeventeenConfig = makeConfig({
  modelKey: "outcome-contribution",
  steps: ["List outcomes", "Attach probabilities", "Multiply value by probability", "Add contributions", "Compare with long-run simulation", "Conclude expected value"],
  parameters: [param("x1", "Outcome x1", 0, 10, 1, 1), param("x2", "Outcome x2", 0, 10, 4, 1), param("x3", "Outcome x3", 0, 10, 8, 1), param("p1", "P(x1)", 0.05, 0.9, 0.25, 0.05), param("p2", "P(x2)", 0.05, 0.9, 0.35, 0.05)],
  prediction: ["Is expected value always one of the possible outcomes?", "No. It is a long-run average and may not be an actual outcome."],
  misconception: ["Expected value means the result you should expect every single time.", "It is the average over many repetitions, not a guaranteed single-trial result."],
  tokens: ["x-i", "P-x-i", "x-i-P-x-i", "sum"],
  formula: ({ x1, x2, x3, p1, p2 }) => `E(X)=sum x_i P(x_i)=${fmt(expectedValue([x1, x2, x3], [p1, p2, Math.max(0, 1 - p1 - p2)]))}`,
  liveValues: ({ x1, x2, x3, p1, p2 }) => {
    const probs = [p1, p2, Math.max(0, 1 - p1 - p2)];
    const outcomes = [x1, x2, x3];
    return [value("outcomes", "outcomes", outcomes.map(fmt).join(", ")), value("probabilities", "probabilities", probs.map(fmt).join(", ")), value("contributions", "contributions", outcomes.map((x, i) => fmt(x * probs[i])).join(", ")), value("expected-value", "expected value", fmt(expectedValue(outcomes, probs))), value("simulated-average", "simulated average if shown", fmt(expectedValue(outcomes, probs))), value("invariant", "invariant", `probabilities sum to ${fmt(probs.reduce((sum, p) => sum + p, 0))}`)];
  },
  invariant: ({ p1, p2 }) => `Probabilities are normalized as p1, p2, and remaining ${fmt(Math.max(0, 1 - p1 - p2))}.`,
  renderVisual: ExpectedValueVisual,
});

export const phaseSeventeenRouteSlugs = [
  ["probability", "probability-favorable-over-total"],
  ["probability", "complement-rule"],
  ["probability", "addition-rule-overlapping-events"],
  ["probability", "multiplication-rule-independent-events"],
  ["probability", "conditional-probability"],
  ["probability", "tree-diagram-compound-probability"],
  ["probability", "experimental-probability-law-large-numbers"],
  ["probability", "expected-value-long-run-average"],
] as const;

export const phaseSeventeenConfigs = [
  favorableTotalPhaseSeventeenConfig,
  complementPhaseSeventeenConfig,
  additionPhaseSeventeenConfig,
  multiplicationPhaseSeventeenConfig,
  conditionalPhaseSeventeenConfig,
  treePhaseSeventeenConfig,
  experimentalPhaseSeventeenConfig,
  expectedValuePhaseSeventeenConfig,
];

type ConfigInput = {
  modelKey: string;
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValues) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseSeventeenModelKey: string } {
  return {
    phaseSeventeenModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: probabilityRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `probability-${input.modelKey}-invariant`, label: "simulation-board invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG simulation-board model.", "Sliders are bounded to keep labels and probability regions readable.", "Rounded displays support intuition while formulas preserve the proof structure."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}

function value(id: string, label: string, item: number | string) {
  return { id, label, value: item };
}

function step(title: string, index: number) {
  return { id: `p17-${index}`, title, description: title, focusLabel: index < 2 ? "sample space" : index < 5 ? "probability model" : "conclusion" };
}

function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the sample space, grid, tree, or frequency model before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use a memorized rule without the model.", feedback: "The visual probability model explains why the rule is true." }] };
}

function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the connected simulation-board feature.", options: [{ id: "visual", label: "Use the probability visual model.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Ignore the sample space.", feedback: "The sample space or simulation structure is what gives the formula meaning." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "P-A": "P(A)",
    "favorable-outcomes": "favorable outcomes",
    "total-outcomes": "total outcomes",
    fraction: "favorable/total",
    A: "A",
    "A-complement": "A complement",
    one: "1",
    "one-minus-P-A": "1 - P(A)",
    "A-union-B": "A union B",
    "P-B": "P(B)",
    "A-intersection-B": "A intersection B",
    "subtract-overlap": "subtract overlap",
    "P-A-times-P-B": "P(A)P(B)",
    B: "B",
    "P-A-given-B": "P(A|B)",
    "divide-by-P-B": "divide by P(B)",
    "branch-probability": "branch probability",
    "path-product": "path product",
    "sum-of-paths": "sum of paths",
    "successes-over-trials": "successes/trials",
    "theoretical-p": "theoretical p",
    "large-number": "large number",
    "x-i": "x_i",
    "P-x-i": "P(x_i)",
    "x-i-P-x-i": "x_i P(x_i)",
    sum: "sum",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("favorable") || token.includes("total") || token === "P-A") return "sample-space grid cells";
  if (token.includes("complement") || token === "one") return "remaining sample-space cells";
  if (token.includes("union") || token.includes("intersection") || token.includes("overlap")) return "overlapping Venn regions";
  if (token.includes("times")) return "independent product rectangle";
  if (token.includes("given") || token === "B") return "restricted sample space";
  if (token.includes("branch") || token.includes("path")) return "tree diagram";
  if (token.includes("trials") || token.includes("large")) return "frequency simulation";
  if (token.includes("x-i") || token === "sum") return "expected-value contribution bars";
  return "probability visual feature";
}

function probabilityValues(favorable: number, total: number) {
  return [value("total-outcomes", "total outcomes", total), value("favorable-outcomes", "favorable outcomes", favorable), value("probability-fraction", "probability fraction", `${favorable}/${total}`), value("decimal", "decimal", fmt(favorable / total)), value("percent", "percent", `${Math.round((favorable / total) * 100)}%`), value("invariant", "invariant", "0 <= P(A) <= 1")];
}

function deterministicSuccesses(p: number, trials: number) {
  let successes = 0;
  for (let index = 1; index <= trials; index += 1) {
    if ((((index * 37 + 17) % 100) / 100) < p) successes += 1;
  }
  return successes;
}

function expectedValue(outcomes: number[], probs: number[]) {
  return outcomes.reduce((sum, outcome, index) => sum + outcome * probs[index], 0);
}

function fmt(value: number) {
  return Number.isFinite(value) ? value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : "0";
}
