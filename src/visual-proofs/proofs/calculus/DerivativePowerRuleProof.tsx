import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { derivativePowerRulePhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function DerivativePowerRuleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={derivativePowerRulePhaseFourteenConfig} />;
}
