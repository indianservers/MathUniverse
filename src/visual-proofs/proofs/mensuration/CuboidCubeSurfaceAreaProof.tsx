import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { cuboidCubeSurfaceAreaPhaseTwentyTwoConfig } from "../phase-twenty-two/phaseTwentyTwoProofConfigs";

export default function CuboidCubeSurfaceAreaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={cuboidCubeSurfaceAreaPhaseTwentyTwoConfig} />;
}
