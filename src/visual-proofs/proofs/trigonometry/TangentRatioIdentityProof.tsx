import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { tangentRatioIdentityPhaseFiveConfig } from "../phase-five/phaseFiveProofConfigs";

export default function TangentRatioIdentityProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={tangentRatioIdentityPhaseFiveConfig} />;
}
