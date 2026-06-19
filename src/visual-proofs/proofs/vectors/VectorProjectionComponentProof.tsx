import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { vectorProjectionComponentPhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function VectorProjectionComponentProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={vectorProjectionComponentPhaseTwentyConfig} />;
}
