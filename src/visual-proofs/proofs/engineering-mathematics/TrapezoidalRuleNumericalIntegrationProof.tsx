import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { trapezoidalRuleNumericalIntegrationPhaseTwentySevenConfig } from "../phase-twenty-seven/phaseTwentySevenProofConfigs";

export default function TrapezoidalRuleNumericalIntegrationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={trapezoidalRuleNumericalIntegrationPhaseTwentySevenConfig} />;
}
