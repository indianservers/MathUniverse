import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { sineRulePhaseSixConfig } from "../phase-six/phaseSixProofConfigs";

export default function SineRuleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={sineRulePhaseSixConfig} />;
}
