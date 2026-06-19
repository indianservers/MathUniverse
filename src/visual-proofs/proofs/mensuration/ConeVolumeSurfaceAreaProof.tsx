import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { coneVolumeSurfaceAreaPhaseTwentyTwoConfig } from "../phase-twenty-two/phaseTwentyTwoProofConfigs";

export default function ConeVolumeSurfaceAreaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={coneVolumeSurfaceAreaPhaseTwentyTwoConfig} />;
}
