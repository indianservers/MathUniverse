import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { cosineRulePhaseSixConfig } from "../phase-six/phaseSixProofConfigs";

export default function CosineRuleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={cosineRulePhaseSixConfig} />;
}
