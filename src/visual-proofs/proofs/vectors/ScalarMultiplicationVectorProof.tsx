import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { scalarMultiplicationPhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function ScalarMultiplicationVectorProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={scalarMultiplicationPhaseTwentyConfig} />;
}
