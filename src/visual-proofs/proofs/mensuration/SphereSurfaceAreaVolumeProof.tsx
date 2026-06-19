import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { sphereSurfaceAreaVolumePhaseTwentyTwoConfig } from "../phase-twenty-two/phaseTwentyTwoProofConfigs";

export default function SphereSurfaceAreaVolumeProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={sphereSurfaceAreaVolumePhaseTwentyTwoConfig} />;
}
