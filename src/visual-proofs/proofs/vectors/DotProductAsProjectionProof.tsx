import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { dotProductProjectionPhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function DotProductAsProjectionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={dotProductProjectionPhaseTwentyConfig} />;
}
