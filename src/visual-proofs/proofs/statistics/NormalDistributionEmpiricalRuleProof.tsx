import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import NormalProbabilityMobileProof from "./NormalProbabilityMobileProof";

export default function NormalDistributionEmpiricalRuleProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <NormalProbabilityMobileProof />;
}
