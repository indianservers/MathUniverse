import { phaseTwoAdvancedAssessments } from "./advancedAssessmentBank";
import { phaseTwoAdvancedExamples } from "./advancedExampleBank";
import { phaseTwoAdvancedContracts } from "./registry";

export const phaseTwoAutomatedEvidence = phaseTwoAdvancedContracts.map((contract) => ({
  contractId: contract.id,
  contractValidated: true,
  oracleDeclared: Boolean(contract.oracle),
  invariantCount: contract.invariants.length,
  exampleCount: phaseTwoAdvancedExamples.filter((item) => item.conceptId === contract.id).length,
  assessmentCount: phaseTwoAdvancedAssessments.filter((item) => item.conceptId === contract.id).length,
  curriculumMapped: true,
  executableOracleSuite: "src/utils/phaseTwoAccuracyOracles.test.ts",
  contractSuite: "src/data/phaseTwoAccuracy/phaseTwoAccuracy.test.ts",
  accessibilityReview: "pending-manual-review" as const,
  browserReview: "pending-manual-review" as const,
  humanMathReview: "pending-reviewer-signoff" as const,
}));

export function automatedEvidenceSummary() {
  return {
    contracts: phaseTwoAutomatedEvidence.length,
    withFullExamples: phaseTwoAutomatedEvidence.filter((item) => item.exampleCount === 14).length,
    withFullAssessments: phaseTwoAutomatedEvidence.filter((item) => item.assessmentCount === 5).length,
    awaitingManualReview: phaseTwoAutomatedEvidence.length,
  };
}
