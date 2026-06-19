import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { vectorAdditionPhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function VectorAdditionTipToTailProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={vectorAdditionPhaseTwentyConfig} />;
}
