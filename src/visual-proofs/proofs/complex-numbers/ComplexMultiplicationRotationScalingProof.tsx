import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { complexMultiplicationPhaseTwentyOneConfig } from "../phase-twenty-one/phaseTwentyOneProofConfigs";

export default function ComplexMultiplicationRotationScalingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={complexMultiplicationPhaseTwentyOneConfig} />;
}
