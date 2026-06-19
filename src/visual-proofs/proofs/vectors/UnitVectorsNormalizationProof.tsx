import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { unitVectorsNormalizationPhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function UnitVectorsNormalizationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={unitVectorsNormalizationPhaseTwentyConfig} />;
}
