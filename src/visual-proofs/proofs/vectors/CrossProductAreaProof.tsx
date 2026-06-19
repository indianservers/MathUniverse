import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { crossProductAreaPhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function CrossProductAreaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={crossProductAreaPhaseTwentyConfig} />;
}
