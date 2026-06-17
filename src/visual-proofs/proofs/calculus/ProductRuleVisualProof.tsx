import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { productRulePhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function ProductRuleVisualProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={productRulePhaseFourteenConfig} />;
}
