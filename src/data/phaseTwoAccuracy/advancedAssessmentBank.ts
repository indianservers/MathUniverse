import { phaseTwoAdvancedContracts } from "./registry";

export type AdvancedAssessmentItem = {
  id: string; conceptId: string; mode: "recognition" | "calculation" | "interpretation" | "error-analysis" | "transfer";
  prompt: string; hintLadder: [string, string]; expectedEvidence: string; misconception: string;
  scoringRule: { points: 4; criteria: string[] }; oracle: string;
};

export const phaseTwoAdvancedAssessments: AdvancedAssessmentItem[] = phaseTwoAdvancedContracts.flatMap((contract) =>
  contract.assessmentModes.map((mode) => ({
    id: `${contract.id}.assessment.${mode}`, conceptId: contract.id, mode, prompt: promptFor(mode, contract),
    hintLadder: [`Start from the definition: ${contract.definition}`, `Check the restriction: ${contract.restrictions[0]}`],
    expectedEvidence: `${contract.formula}; then demonstrate ${contract.invariants[0]}.`, misconception: contract.misconception.claim,
    scoringRule: { points: 4 as const, criteria: ["1: valid setup and restrictions", "1: correct method", "1: correct result or conclusion", "1: independent oracle/invariant check"] }, oracle: contract.oracle,
  })),
);

function promptFor(mode: AdvancedAssessmentItem["mode"], contract: (typeof phaseTwoAdvancedContracts)[number]) {
  if (mode === "recognition") return `Identify which representation correctly matches ${contract.topic} and justify it from the definition.`;
  if (mode === "calculation") return `Calculate a valid ${contract.topic.toLowerCase()} result using ${contract.formula}; show all restrictions.`;
  if (mode === "interpretation") return `Interpret the result in the context of ${contract.exampleContexts[0]} and state what remains invariant.`;
  if (mode === "error-analysis") return `Find and correct the error in “${contract.misconception.claim}”; include the counterexample ${contract.misconception.counterexample}.`;
  return `Transfer ${contract.topic.toLowerCase()} to ${contract.exampleContexts.at(-1)} and verify it independently with ${contract.oracle}.`;
}
